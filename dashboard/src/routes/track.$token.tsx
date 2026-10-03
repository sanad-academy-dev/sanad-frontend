import { IconMapPin, IconPhone, IconTruck } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { backendUrl } from "@/lib/backend-fetch";

/**
 * [MC8.4] صفحة تتبّع وليّ الأمر — حيازة الرابط هي الإذن، بلا تسجيل دخول.
 *
 * ما يصل إلى هذه الصفحة مُخشَّن ومحدود عمدًا (انظر `mobile-tracking.controller`): موقع
 * تقريبي، ومرحلة، ووقت وصول متوقّع. لا طاقم، ولا محطّات أخرى، ولا معرّفات.
 */
export const Route = createFileRoute("/track/$token")({
	component: TrackPage,
	ssr: false,
});

type Tracking = {
	stage: string;
	stageLabel: string;
	finished: boolean;
	etaAt: string | null;
	windowStart: string | null;
	windowEnd: string | null;
	arrivedAt: string | null;
	startsAt: string;
	patientName: string | null;
	clinicName: string;
	clinicPhone: string | null;
	address: string;
	landmark: string | null;
	van: { lat: number; lng: number } | null;
	vanSeenAt: string | null;
};

const timeFmt = new Intl.DateTimeFormat("ar-EG", { timeStyle: "short" });

const STEPS = ["ASSIGNED", "EN_ROUTE", "ARRIVED", "IN_SERVICE", "COMPLETED"];

function TrackPage() {
	const { token } = Route.useParams();
	const [stage, setStage] = useState<string | null>(null);

	const { data, isLoading } = useQuery<Tracking>({
		queryKey: ["tracking", token],
		queryFn: async () => {
			const res = await api["mobile-tracking"]({ token }).get();
			if (res.error) throw new Error("رابط التتبّع غير صالح");
			return res.data as Tracking;
		},
	});

	// البثّ يحدّث المرحلة فقط؛ الموقع التقريبي يُعرض نصًّا لا خريطة — صفحة عامّة يفتحها
	// وليّ الأمر على بيانات جوّاله، وتحميل ١ ميغابايت من MapLibre لأجل نقطة واحدة مبالغة.
	useEffect(() => {
		if (!data || data.finished) return;
		const source = new EventSource(backendUrl(`/api/mobile-tracking/${token}/stream`));
		const onStage = (event: MessageEvent) => {
			const payload = JSON.parse(event.data) as { stage: string };
			setStage(payload.stage);
		};
		source.addEventListener("track.stage", onStage);
		return () => {
			source.removeEventListener("track.stage", onStage);
			source.close();
		};
	}, [data, token]);

	if (isLoading) {
		return <main className="p-8 text-center text-sm text-muted-foreground">جارٍ التحميل…</main>;
	}

	if (!data) {
		return <main className="p-8 text-center text-sm">رابط التتبّع غير صالح أو منتهٍ.</main>;
	}

	const current = stage ?? data.stage;
	const currentIndex = STEPS.indexOf(current);

	return (
		<main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4 sm:p-8">
			<header className="flex flex-col gap-1">
				<span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
					<IconTruck className="size-4" />
					{data.clinicName}
				</span>
				<h1 className="text-xl font-bold">
					{data.patientName ? `زيارة ${data.patientName}` : "زيارتك المتنقلة"}
				</h1>
			</header>

			<section className="rounded-[4px] border p-4">
				<span className="text-sm font-semibold">{data.stageLabel}</span>

				{data.etaAt && !data.finished && (
					<p className="mt-1 text-sm text-muted-foreground">
						الوصول المتوقّع نحو {timeFmt.format(new Date(data.etaAt))}
					</p>
				)}
				{data.windowStart && data.windowEnd && !data.finished && (
					<p className="mt-1 text-xs text-muted-foreground">
						نافذة الوصول {timeFmt.format(new Date(data.windowStart))} –{" "}
						{timeFmt.format(new Date(data.windowEnd))}
					</p>
				)}
				{data.finished && (
					<p className="mt-1 text-sm text-muted-foreground">انتهت هذه الزيارة.</p>
				)}

				<ol className="mt-3 flex flex-col gap-2">
					{STEPS.map((step, index) => (
						<li
							key={step}
							className="flex items-center gap-2 text-xs"
						>
							<span
								className={
									index <= currentIndex
										? "size-2 rounded-full bg-emerald-500"
										: "size-2 rounded-full bg-muted-foreground/30"
								}
							/>
							<span
								className={index <= currentIndex ? "text-foreground" : "text-muted-foreground"}
							>
								{step === "ASSIGNED"
									? "تم تحديد المركبة"
									: step === "EN_ROUTE"
										? "في الطريق إليك"
										: step === "ARRIVED"
											? "وصلت المركبة"
											: step === "IN_SERVICE"
												? "الدورة جارية"
												: "اكتملت الزيارة"}
							</span>
						</li>
					))}
				</ol>
			</section>

			<section className="flex flex-col gap-2 rounded-[4px] border p-4 text-sm">
				<span className="inline-flex items-start gap-2">
					<IconMapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
					<span>
						{data.address}
						{data.landmark ? ` — ${data.landmark}` : ""}
					</span>
				</span>
				{data.clinicPhone && (
					<a
						href={`tel:${data.clinicPhone}`}
						className="inline-flex items-center gap-2 text-primary"
					>
						<IconPhone className="size-4 shrink-0" />
						<span dir="ltr">{data.clinicPhone}</span>
					</a>
				)}
			</section>
		</main>
	);
}
