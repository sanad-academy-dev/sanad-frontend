import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

import type { MobileUnitStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import { backendUrl } from "@/lib/backend-fetch";

/**
 * [MC3.4] الحالة الحيّة للأسطول = لقطة أولى + بثّ SSE فوقها.
 *
 * اللقطة ضرورية: بلا ها تبدأ الخريطة فارغة إلى أن تتحرّك أوّل مركبة — وقد لا تتحرّك.
 * البثّ يعدّل اللقطة في الذاكرة بدل إعادة الجلب، فالحدث يصل كل ٣ ثوانٍ لكل مركبة وإعادة
 * الجلب عندها أثقل من التعديل بمراتب.
 */

export type FleetUnit = {
	id: string;
	code: string;
	name: string;
	plateNumber: string | null;
	status: MobileUnitStatus;
	branch: { id: string; name: string } | null;
	lat: number | null;
	lng: number | null;
	lastLocationAt: string | null;
	speedKph: number | null;
	heading: number | null;
	batteryPct: number | null;
	openShift: { id: string; startedAt: string; openedBy: string } | null;
};

/** بعد هذه المدّة بلا نبضة تُعدّ المركبة «متأخّرة» ويظهر ذلك على الخريطة. */
export const STALE_AFTER_MS = 180_000;

export const isStale = (lastLocationAt: string | null, now: number): boolean => {
	if (!lastLocationAt) return true;
	return now - new Date(lastLocationAt).getTime() > STALE_AFTER_MS;
};

export const useFleetLive = () => {
	const queryClient = useQueryClient();
	const { data, isLoading, refetch } = useQuery<FleetUnit[]>({
		queryKey: ["mobile-fleet-live"],
		queryFn: async () => {
			const res = await api["mobile-fleet"].live.get();
			if (res.error) throw new Error("فشل جلب حالة الأسطول");
			return res.data as FleetUnit[];
		},
		staleTime: 1000 * 30,
	});

	const [units, setUnits] = useState<FleetUnit[]>([]);
	const [connected, setConnected] = useState(false);
	// نُبقي أحدث نسخة في ref حتى لا يُعاد فتح البثّ مع كل تحديث حالة.
	const unitsRef = useRef<FleetUnit[]>([]);
	unitsRef.current = units;

	useEffect(() => {
		if (data) setUnits(data);
	}, [data]);

	useEffect(() => {
		const source = new EventSource(backendUrl("/api/mobile-fleet/stream"), {
			withCredentials: true,
		});

		const onReady = () => setConnected(true);

		const onLocation = (event: MessageEvent) => {
			const payload = JSON.parse(event.data) as {
				mobileUnitId: string;
				lat: number;
				lng: number;
				speedKph: number | null;
				heading: number | null;
				batteryPct: number | null;
				recordedAt: string;
			};
			setUnits((current) =>
				current.map((unit) =>
					unit.id === payload.mobileUnitId
						? {
								...unit,
								lat: payload.lat,
								lng: payload.lng,
								speedKph: payload.speedKph,
								heading: payload.heading,
								batteryPct: payload.batteryPct,
								lastLocationAt: payload.recordedAt,
							}
						: unit,
				),
			);
		};

		const onStatus = (event: MessageEvent) => {
			const payload = JSON.parse(event.data) as {
				mobileUnitId: string;
				status: MobileUnitStatus;
			};
			setUnits((current) =>
				current.map((unit) =>
					unit.id === payload.mobileUnitId ? { ...unit, status: payload.status } : unit,
				),
			);
		};

		// مركبة أُوقفت إداريًّا تختفي من الخريطة فورًا — بقاؤها يوحي بأنّها لا تزال عاملة.
		const onDisabled = (event: MessageEvent) => {
			const payload = JSON.parse(event.data) as { mobileUnitId: string };
			setUnits((current) => current.filter((unit) => unit.id !== payload.mobileUnitId));
		};

		// أُعيد تفعيلها: الحدث لا يحمل صفّ المركبة كاملًا، فتُعاد اللقطة بدل تلفيق سجلّ
		// ناقص. نادرٌ بما يكفي — إعادة جلب واحدة لا تُقارن ببثّ الموقع كل ٣ ثوانٍ.
		const onEnabled = () => {
			void refetch();
		};

		/**
		 * طلب زيارة وصل أو فُرز — يُبطَل طابور الطلبات ولوحة الإرسال.
		 *
		 * قبل هذا كان الطابور يستطلع كل ٦٠ ثانية («تصل من نموذج عام بلا بثّ»)، فطلبٌ
		 * منزلي قد يبقى دقيقةً كاملة بلا أن يراه أحد — والزيارة المنزلية طلبٌ عاجل
		 * بطبيعته. الإبطال هنا يجعلها تظهر في ثوانٍ.
		 *
		 * إبطالٌ لا تعديلٌ في الذاكرة، خلافًا لأحداث الموقع: الحمولة مقصودة الفقر (معرّف
		 * ورمز وحالة فقط) لأنها تُبثّ لكل المركبات، فلا تكفي لبناء صفّ الطلب. والحدث
		 * نادر — إعادة جلب واحدة لا تُقارن ببثّ الموقع كل ٣ ثوانٍ.
		 */
		const onRequestChanged = () => {
			void queryClient.invalidateQueries({ queryKey: ["mobile-requests"] });
			void queryClient.invalidateQueries({ queryKey: ["mobile-dispatch-board"] });
		};

		source.addEventListener("mobile.ready", onReady);
		source.addEventListener("mobile.unit.location", onLocation);
		source.addEventListener("mobile.unit.status", onStatus);
		source.addEventListener("mobile.unit.disabled", onDisabled);
		source.addEventListener("mobile.unit.enabled", onEnabled);
		source.addEventListener("mobile.request.created", onRequestChanged);
		source.addEventListener("mobile.request.handled", onRequestChanged);
		// المتصفّح يعيد الاتصال تلقائيًّا (retry: 5000 من الخادم) — نعكس الانقطاع فقط
		source.onerror = () => setConnected(false);

		return () => {
			source.removeEventListener("mobile.ready", onReady);
			source.removeEventListener("mobile.unit.location", onLocation);
			source.removeEventListener("mobile.unit.status", onStatus);
			source.removeEventListener("mobile.unit.disabled", onDisabled);
			source.removeEventListener("mobile.unit.enabled", onEnabled);
			source.removeEventListener("mobile.request.created", onRequestChanged);
			source.removeEventListener("mobile.request.handled", onRequestChanged);
			source.close();
		};
	}, [refetch, queryClient]);

	const located = useMemo(
		() => units.filter((unit) => unit.lat !== null && unit.lng !== null),
		[units],
	);

	return { units, located, isLoading, connected };
};
