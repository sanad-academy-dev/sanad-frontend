import { LngLatBounds, Map as MapLibreMap, Marker, NavigationControl } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import { type FleetUnit, isStale } from "@/features/mobile-clinics/hooks/use-fleet-stream";

import "maplibre-gl/dist/maplibre-gl.css";

/** الرياض — مركز احتياطي حين لا توجد مركبة محدَّدة الموقع بعد. */
const FALLBACK_CENTER: [number, number] = [46.6753, 24.7136];

/**
 * تقريب افتراضي يُظهر الشوارع فعلًا.
 *
 * كان 10، وعنده لا تظهر الحارات (تبدأ ~14) ولا المحلّات (~16)، فتبدو الشاشة «خريطة
 * جغرافية» لا خريطة تشغيل. منسّق الحركة يحتاج أن يرى الشارع الذي تقف فيه المركبة.
 */
const DEFAULT_ZOOM = 14;

/** أقصى تقريب عند تأطير الأسطول — كيلا يقفز إلى أقصى تقريب حين تكون مركبة واحدة. */
const MAX_FIT_ZOOM = 15;

/**
 * لون العلامة يتبع الحالة التشغيلية. قيم CSS صريحة لا أصناف Tailwind: العلامة عنصر
 * DOM ينشئه MapLibre خارج شجرة React، فلا يمرّ على مُصنِّف الأنماط.
 */
const STATUS_COLORS: Record<FleetUnit["status"], string> = {
	OFFLINE: "#9ca3af",
	AVAILABLE: "#10b981",
	EN_ROUTE: "#3b82f6",
	ON_SITE: "#f97316",
	RETURNING: "#6366f1",
	ON_BREAK: "#f59e0b",
	OUT_OF_SERVICE: "#ef4444",
};

const STALE_COLOR = "#9ca3af";

function buildMarkerElement(unit: FleetUnit, stale: boolean): HTMLDivElement {
	const el = document.createElement("div");
	el.className = "flex flex-col items-center gap-1";
	el.style.cursor = "pointer";

	const dot = document.createElement("div");
	dot.style.width = "14px";
	dot.style.height = "14px";
	dot.style.borderRadius = "9999px";
	dot.style.border = "2px solid #fff";
	dot.style.boxShadow = "0 1px 3px rgba(0,0,0,.4)";
	dot.style.background = stale ? STALE_COLOR : STATUS_COLORS[unit.status];
	// نبضة خافتة للمتحرّكة فقط — مركبة متأخّرة يجب ألّا تبدو حيّة.
	if (!stale && unit.status === "EN_ROUTE")
		dot.style.outline = "3px solid rgba(59,130,246,.25)";

	const label = document.createElement("span");
	label.textContent = unit.name;
	label.style.fontSize = "10px";
	label.style.whiteSpace = "nowrap";
	label.style.padding = "1px 4px";
	label.style.borderRadius = "4px";
	label.style.background = "rgba(255,255,255,.85)";
	label.style.color = "#111";

	el.append(dot, label);
	return el;
}

type FleetMapProps = {
	units: FleetUnit[];
	selectedUnitId: string | null;
	onSelectUnit: (unitId: string) => void;
	/** رابط النمط يُمرَّر من الأعلى: الأب يفحصه قبل تحميل هذه الوحدة أصلًا. */
	styleUrl: string;
};

/**
 * [MC3.5] خريطة الأسطول الحيّة.
 *
 * المسند: MapLibre GL + بلاطات OSM (قرار وليّ الأمر D1). العلامات تُحدَّث في مكانها بدل إعادة
 * إنشائها كل مرّة — بثّ الموقع يصل كل ٣ ثوانٍ لكل مركبة، وإعادة بناء العلامات عندها
 * تُفقد الخريطة سلاسة الحركة وتُبطل أي نافذة مفتوحة.
 *
 * حاوية الخريطة `dir="ltr"` صراحةً: MapLibre يبني عناصر تحكّمه بافتراض LTR، ووراثة اتجاه
 * الصفحة العربية تعكس أزرار التكبير ومقياس الرسم. النصوص العربية داخل العلامات تُعرض
 * صحيحة على أي حال عبر معالجة المتصفّح ثنائية الاتجاه.
 */
export default function FleetMap({
	units,
	selectedUnitId,
	onSelectUnit,
	styleUrl,
}: FleetMapProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<MapLibreMap | null>(null);
	const markersRef = useRef<Map<string, Marker>>(new Map());

	// أحدث معالج اختيار دون إعادة إنشاء العلامات عند تغيّر مرجع الدالّة
	const onSelectRef = useRef(onSelectUnit);
	onSelectRef.current = onSelectUnit;

	// التأطير يحدث مرّة واحدة فقط: بعدها الخريطة ملك المستخدم، وإعادة التأطير مع كل
	// نبضة موقع تنتزع العرض من تحت يده كلّما تحرّكت مركبة.
	const hasFittedRef = useRef(false);

	/**
	 * فشل تحميل الخريطة كان يظهر كلوحة فارغة صامتة — والمستخدم لا يملك ما يميّز بها
	 * «لا توجد مركبات هنا» عن «النمط لم يُحمَّل». نفس مبدأ شارة الإشارة المتأخّرة: الخلل
	 * يُعرَض ولا يُخفى.
	 */
	const [loadError, setLoadError] = useState<string | null>(null);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);

	useEffect(() => {
		if (!containerRef.current || mapRef.current) return;

		const map = new MapLibreMap({
			container: containerRef.current,
			style: styleUrl,
			center: FALLBACK_CENTER,
			zoom: DEFAULT_ZOOM,
			attributionControl: { compact: true },
		});
		map.addControl(new NavigationControl({ showCompass: false }), "top-left");
		// كل خطأ يُسجَّل كاملًا. النسخة الأولى كانت تُسقط أي رسالة تحوي "tile" بحجّة أنّها
		// عابرة — وهو ترشيح يُخفي بالضبط الخطأ الذي يُبحث عنه حين لا تُرسَم أي بلاطة.
		map.on("error", (event) => {
			const err = (event as unknown as { error?: { message?: string } }).error;
			console.error("[fleet-map] error:", err?.message ?? event, event);
			if (err?.message) setLoadError(err.message);
		});

		// تشخيص: هل طُلبت البلاطات أصلًا، وهل وصلت؟ صمتُ هذه السطور يعني أنّ المصدر لم
		// يُستعلَم، لا أنّ الشبكة فشلت.
		map.on("sourcedata", (event) => {
			if (event.sourceId === "openmaptiles" && event.isSourceLoaded) {
				console.info("[fleet-map] vector source loaded");
			}
		});
		map.on("styleimagemissing", (event) => {
			console.warn("[fleet-map] missing sprite image:", event.id);
		});
		map.on("load", () => setLoadError(null));
		mapRef.current = map;

		/**
		 * الخريطة تُنشأ داخل `TabsContent` وهو التبويب الافتراضي، فتُقاس الحاوية أحيانًا قبل
		 * أن يستقرّ تخطيط flex فتخرج بأبعاد صفريّة. عندها لا تطلب MapLibre أي بلاطة إطلاقًا:
		 * يظهر شريط الإسناد (وهو عنصر DOM يأتي من النمط) بينما القماش فارغ تمامًا — وهو
		 * بالضبط العَرَض الذي يبدو كأنّ الخريطة «لا تعمل».
		 *
		 * ResizeObserver يخبرها بحجمها الحقيقي فور استقراره، وعند كل تغيير لاحق (فتح لوحة
		 * جانبية، تدوير جهاز، تبديل تبويب).
		 */
		const observer = new ResizeObserver(() => map.resize());
		observer.observe(containerRef.current);
		resizeObserverRef.current = observer;

		return () => {
			resizeObserverRef.current?.disconnect();
			resizeObserverRef.current = null;
			for (const marker of markersRef.current.values()) marker.remove();
			markersRef.current.clear();
			map.remove();
			mapRef.current = null;
		};
	}, [styleUrl]);

	// مزامنة العلامات مع الحالة
	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;

		const now = Date.now();
		const seen = new Set<string>();

		for (const unit of units) {
			if (unit.lat === null || unit.lng === null) continue;
			seen.add(unit.id);

			const stale = isStale(unit.lastLocationAt, now);
			const existing = markersRef.current.get(unit.id);

			if (existing) {
				existing.setLngLat([unit.lng, unit.lat]);
				const dot = existing.getElement().firstElementChild as HTMLDivElement | null;
				if (dot) dot.style.background = stale ? STALE_COLOR : STATUS_COLORS[unit.status];
				continue;
			}

			const element = buildMarkerElement(unit, stale);
			element.addEventListener("click", () => onSelectRef.current(unit.id));
			const marker = new Marker({ element }).setLngLat([unit.lng, unit.lat]).addTo(map);
			markersRef.current.set(unit.id, marker);
		}

		// مركبة اختفت (أُوقفت أو حُذفت) — أزِل علامتها بدل تركها معلّقة على الخريطة
		for (const [id, marker] of markersRef.current) {
			if (seen.has(id)) continue;
			marker.remove();
			markersRef.current.delete(id);
		}
	}, [units]);

	/**
	 * تأطير الأسطول عند أوّل تحميل فيه مواقع.
	 *
	 * بدونه تفتح الخريطة على نقطة ثابتة في الرياض بصرف النظر عن مكان المركبات — فإن كانت
	 * في مدينة أخرى لم يرَ المستخدم شيئًا، وظنّ الخريطة معطّلة. مركبة واحدة تُمركَز، وعدّة
	 * مركبات تُؤطَّر جميعًا.
	 */
	useEffect(() => {
		const map = mapRef.current;
		if (!map || hasFittedRef.current) return;

		const located = units.filter((unit) => unit.lat !== null && unit.lng !== null);
		if (located.length === 0) return;

		hasFittedRef.current = true;

		if (located.length === 1) {
			const only = located[0];
			map.easeTo({
				center: [only.lng as number, only.lat as number],
				zoom: DEFAULT_ZOOM,
			});
			return;
		}

		const bounds = located.reduce(
			(acc, unit) => acc.extend([unit.lng as number, unit.lat as number]),
			new LngLatBounds(
				[located[0].lng as number, located[0].lat as number],
				[located[0].lng as number, located[0].lat as number],
			),
		);
		map.fitBounds(bounds, { padding: 64, maxZoom: MAX_FIT_ZOOM, duration: 600 });
	}, [units]);

	// المتابعة عند الاختيار
	useEffect(() => {
		const map = mapRef.current;
		if (!map || !selectedUnitId) return;
		const unit = units.find((u) => u.id === selectedUnitId);
		if (!unit || unit.lat === null || unit.lng === null) return;
		map.easeTo({ center: [unit.lng, unit.lat], zoom: Math.max(map.getZoom(), DEFAULT_ZOOM) });
	}, [selectedUnitId, units]);

	return (
		// dir="ltr" مقصود: عناصر تحكّم MapLibre مبنيّة على افتراض LTR وتنعكس بدونه
		<div className="relative flex min-h-0 flex-1 flex-col border-t">
			<div
				ref={containerRef}
				dir="ltr"
				className="min-h-0 flex-1"
			/>
			{loadError && (
				<div className="absolute inset-x-0 top-0 z-10 bg-destructive/10 px-3 py-2 text-xs text-destructive">
					تعذّر تحميل الخريطة: {loadError}
				</div>
			)}
		</div>
	);
}
