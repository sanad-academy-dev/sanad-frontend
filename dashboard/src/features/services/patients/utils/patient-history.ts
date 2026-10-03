import {
	IconActivityHeartbeat,
	IconBodyScan,
	IconClipboardHeart,
	IconFlask,
	IconStethoscope,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { STATUS_META } from "@/features/appointments/data/status-meta";
import {
	formatVitalValue,
	VITALS_FIELD_BY_KEY,
	VITALS_PROFILES,
} from "@/features/services/vital-signs/data/vitals-fields";
import type { CarePlanEnrollmentStatus, VitalSignsSource } from "@/generated/prisma/enums";
import { deriveOrderStatus, LAB_STATUS_LABELS } from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";
import type { PatientHistoryEntry, PatientHistoryKind } from "@/server/patients/patients.type";
import {
	deriveRadiologyOrderStatus,
	RADIOLOGY_STATUS_LABELS,
} from "@sanad/contracts/runtime/server/radiology/radiology.workflow";

// وصف موحّد لكل حدث في الخط الزمني. الصف والمعاينة ورأس المجموعة يقرأون منه
// وحده، فلا يُعيد أي مكوّن اشتقاق العنوان أو الحالة بطريقته.

export const HISTORY_KIND_META: Record<
	PatientHistoryKind,
	{
		label: string;
		icon: ComponentType<{ className?: string }>;
		/** خلفية ولون أيقونة الصف — درجة واحدة لكل نوع تميّزه في القائمة */
		iconClassName: string;
		/** لون النقطة على الخط الزمني */
		dotClassName: string;
	}
> = {
	VISIT: {
		label: "زيارة",
		icon: IconStethoscope,
		iconClassName: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
		dotClassName: "bg-blue-500",
	},
	LAB: {
		label: "تحاليل",
		icon: IconFlask,
		iconClassName: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
		dotClassName: "bg-violet-500",
	},
	RADIOLOGY: {
		label: "أشعة",
		icon: IconBodyScan,
		iconClassName: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400",
		dotClassName: "bg-cyan-500",
	},
	VITALS: {
		label: "علامات حيوية",
		icon: IconActivityHeartbeat,
		iconClassName: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
		dotClassName: "bg-rose-500",
	},
	CARE_PLAN: {
		label: "خطة علاجية",
		icon: IconClipboardHeart,
		iconClassName: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
		dotClassName: "bg-emerald-500",
	},
};

// مسبوقة بـ«من» عمدًا: الوسم على صف القياس يقع في موضع وسم الحالة، و«زيارة»
// وحدها تُقرأ نوعًا للسجل لا مصدرًا له.
// الوسم الصريح هو الحارس: بدونه سقطت `TRIAGE` من هذه الخريطة يوم أضافتها وحدة
// الطوارئ، ولم يظهر العيب لأنّ فحص مشروع العميل كان ينهار بنفاد الذاكرة قبل بلوغه.
const VITALS_SOURCE_LABELS: Record<VitalSignsSource, string> = {
	MANUAL: "إدخال يدوي",
	VISIT: "من زيارة",
	LAB: "من التحاليل",
	RADIOLOGY: "من الأشعة",
	OPERATION: "من العمليات",
	GROOMING: "من التجميل",
	INPATIENT: "من التنويم",
	TRIAGE: "من فرز الطوارئ",
};

const CARE_PLAN_STATUS_LABELS: Record<CarePlanEnrollmentStatus, string> = {
	ACTIVE: "نشط",
	COMPLETED: "مكتمل",
	CANCELLED: "ملغى",
};

export type PatientHistoryDescriptor = {
	kindLabel: string;
	icon: ComponentType<{ className?: string }>;
	iconClassName: string;
	dotClassName: string;
	/** عنوان الصف — اسم الدورة أو سبب الزيارة */
	title: string;
	/** سطر ثانٍ: من نفّذ الإجراء وما يميّزه */
	subtitle: string | null;
	/** معرّف السجل الظاهر (PT-XXXX نمطًا) — يُعرض LTR دائمًا */
	code: string;
	statusLabel: string;
	/** ما إذا كان السجل ملغى — الصف يُكتَم عندها */
	isCancelled: boolean;
};

/** "CBC +2" — الاسم الأول وعدد ما بعده، فالصف لا يتمدّد بأسماء الدورات */
const collapseNames = (names: string[], fallback: string): string => {
	const [first, ...rest] = names;
	if (!first) return fallback;
	return rest.length > 0 ? `${first} +${rest.length}` : first;
};

export function describeHistoryEntry(entry: PatientHistoryEntry): PatientHistoryDescriptor {
	const kind = HISTORY_KIND_META[entry.kind];
	const base = {
		kindLabel: kind.label,
		icon: kind.icon,
		iconClassName: kind.iconClassName,
		dotClassName: kind.dotClassName,
	};

	switch (entry.kind) {
		case "VISIT": {
			const { record } = entry;
			const serviceName = collapseNames(
				record.services.map((s) => s.service.name),
				"زيارة",
			);
			const doctor = `${record.staff.prefix ?? ""}${record.staff.name}`.trim();
			return {
				...base,
				title: record.reason?.trim() || serviceName,
				subtitle: doctor || null,
				code: record.code,
				statusLabel: STATUS_META[record.status].label,
				isCancelled: record.status === "CANCELLED",
			};
		}

		case "LAB": {
			const { record } = entry;
			const status = deriveOrderStatus(record.items);
			return {
				...base,
				title: collapseNames(
					record.items.map((i) => i.service.name),
					"طلب تحاليل",
				),
				subtitle: record.requestedBy?.name ?? null,
				code: record.code,
				statusLabel: LAB_STATUS_LABELS[status],
				isCancelled: status === "CANCELLED",
			};
		}

		case "RADIOLOGY": {
			const { record } = entry;
			const status = deriveRadiologyOrderStatus(record.items);
			return {
				...base,
				title: collapseNames(
					record.items.map((i) => i.service.name),
					"طلب أشعة",
				),
				subtitle: record.requestedBy?.name ?? null,
				code: record.code,
				statusLabel: RADIOLOGY_STATUS_LABELS[status],
				isCancelled: status === "CANCELLED",
			};
		}

		case "VITALS": {
			const { record } = entry;
			// عنوان القياس = أبرز ثلاثة مقاييس مسجّلة، فالصف يُقرأ منه دون فتحه
			const measured = VITALS_PROFILES.BASIC.flatMap((key) => {
				const spec = VITALS_FIELD_BY_KEY.get(key);
				const value = record[key];
				if (!spec || value == null) return [];
				// Decimal يصل كسلسلة نصية عبر Treaty وإن كان نوعه Decimal في التوقيع
				return [`${spec.label} ${formatVitalValue(value as string | number, spec)}`];
			}).slice(0, 3);

			return {
				...base,
				title: measured.length > 0 ? measured.join(" · ") : "قياس علامات حيوية",
				subtitle: record.recordedBy?.name ?? null,
				code: record.code,
				statusLabel: VITALS_SOURCE_LABELS[record.source],
				isCancelled: false,
			};
		}

		case "CARE_PLAN": {
			const { record } = entry;
			return {
				...base,
				title: record.carePlan.name,
				subtitle: record._count.visits > 0 ? `${record._count.visits} زيارة بالخطة` : null,
				code: record.code,
				statusLabel: CARE_PLAN_STATUS_LABELS[record.status],
				isCancelled: record.status === "CANCELLED",
			};
		}
	}
}

// ── نطاق التاريخ ─────────────────────────────────────────────────────────────

/**
 * الاختصارات نوافذ تنتهي باليوم الحالي، فلا تعرض الجلسات المستقبلية —
 * «آخر 30 يومًا» يعني ما مضى فعلًا. من أراد الأمام يختار «مخصص» أو «الكل».
 */
export const HISTORY_RANGE_PRESETS = ["ALL", "D7", "D30", "D90", "Y1"] as const;

export type PatientHistoryRangePreset = (typeof HISTORY_RANGE_PRESETS)[number] | "CUSTOM";

export const HISTORY_RANGE_PRESET_LABELS: Record<PatientHistoryRangePreset, string> = {
	ALL: "كل الفترات",
	D7: "آخر 7 أيام",
	D30: "آخر 30 يومًا",
	D90: "آخر 3 أشهر",
	Y1: "آخر سنة",
	CUSTOM: "مخصص",
};

export type PatientHistoryRange = {
	preset: PatientHistoryRangePreset;
	/** الحدّان شاملان ليومَيهما كاملَين؛ null = بلا حدّ من تلك الجهة */
	from: Date | null;
	to: Date | null;
};

export const ALL_TIME_RANGE: PatientHistoryRange = { preset: "ALL", from: null, to: null };

const startOfDay = (date: Date) => {
	const next = new Date(date);
	next.setHours(0, 0, 0, 0);
	return next;
};

const endOfDay = (date: Date) => {
	const next = new Date(date);
	next.setHours(23, 59, 59, 999);
	return next;
};

const daysAgo = (count: number, now: Date) => {
	const next = startOfDay(now);
	next.setDate(next.getDate() - count);
	return next;
};

/** يحوّل الاختصار إلى نطاق فعلي — «مخصص» يأتي حدّاه من التقويم لا من هنا */
export function resolveHistoryRange(
	preset: (typeof HISTORY_RANGE_PRESETS)[number],
	now = new Date(),
): PatientHistoryRange {
	switch (preset) {
		case "ALL":
			return ALL_TIME_RANGE;
		case "D7":
			return { preset, from: daysAgo(6, now), to: endOfDay(now) };
		case "D30":
			return { preset, from: daysAgo(29, now), to: endOfDay(now) };
		case "D90":
			return { preset, from: daysAgo(89, now), to: endOfDay(now) };
		case "Y1":
			return { preset, from: daysAgo(364, now), to: endOfDay(now) };
	}
}

export function filterHistoryByRange(
	entries: PatientHistoryEntry[],
	range: PatientHistoryRange,
): PatientHistoryEntry[] {
	if (!range.from && !range.to) return entries;
	const fromMs = range.from ? startOfDay(range.from).getTime() : Number.NEGATIVE_INFINITY;
	const toMs = range.to ? endOfDay(range.to).getTime() : Number.POSITIVE_INFINITY;
	return entries.filter((entry) => {
		const at = new Date(entry.occurredAt).getTime();
		return at >= fromMs && at <= toMs;
	});
}

const shortDate = (date: Date, withYear = true) =>
	date.toLocaleDateString("ar-EG-u-nu-latn", {
		day: "numeric",
		month: "short",
		...(withYear ? { year: "numeric" as const } : {}),
	});

/**
 * نصّ زرّ الفلتر: اسم الاختصار، أو طرفا النطاق المخصص. السنة تُذكر مرة واحدة
 * حين يتّفق الطرفان عليها — «5 أغسطس — 21 أغسطس 2026» لا تكرارها مرتين، فالزرّ
 * يعيش في صفّ شرائح ضيّق.
 */
export function historyRangeLabel(range: PatientHistoryRange): string {
	if (range.preset !== "CUSTOM") return HISTORY_RANGE_PRESET_LABELS[range.preset];
	if (range.from && range.to) {
		const sameYear = range.from.getFullYear() === range.to.getFullYear();
		return `${shortDate(range.from, !sameYear)} — ${shortDate(range.to)}`;
	}
	if (range.from) return `من ${shortDate(range.from)}`;
	if (range.to) return `حتى ${shortDate(range.to)}`;
	return HISTORY_RANGE_PRESET_LABELS.ALL;
}

// ── التجميع باليوم ───────────────────────────────────────────────────────────

export type PatientHistoryDay = {
	/** مفتاح اليوم المحلي YYYY-MM-DD — لا نستعمل ISO فيزيح المنطقة الزمنية اليوم */
	key: string;
	date: Date;
	entries: PatientHistoryEntry[];
};

const dayKey = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
		date.getDate(),
	).padStart(2, "0")}`;

/**
 * يقسّم الأحداث المرتّبة تنازليًا إلى مجموعات يوم واحد. المدخل مرتّب أصلًا من
 * الخادم، فيكفي المرور مرة واحدة دون فرز ثانٍ.
 */
export function groupHistoryByDay(entries: PatientHistoryEntry[]): PatientHistoryDay[] {
	const days: PatientHistoryDay[] = [];

	for (const entry of entries) {
		const date = new Date(entry.occurredAt);
		const key = dayKey(date);
		const last = days[days.length - 1];
		if (last?.key === key) {
			last.entries.push(entry);
			continue;
		}
		days.push({ key, date, entries: [entry] });
	}

	return days;
}

const isSameDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

/**
 * «اليوم» / «أمس» ثم اليوم والشهر — رأس المجموعة على الخط الزمني.
 * الأرقام لاتينية (nu-latn) لا هندية: التاريخ الكامل تحته والوقت في كل صف
 * يُكتبان بالأرقام اللاتينية، فخلطهما في الكتلة نفسها يبدو خطأً مطبعيًا.
 */
export function historyDayLabel(date: Date, now = new Date()): string {
	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);

	if (isSameDay(date, now)) return "اليوم";
	if (isSameDay(date, yesterday)) return "أمس";
	return date.toLocaleDateString("ar-EG-u-nu-latn", { day: "numeric", month: "long" });
}

/** وقت الحدث داخل يومه — 3:20 م */
export function historyTimeLabel(value: Date | string): string {
	const date = new Date(value);
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const hour24 = date.getHours();
	const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
	return `${hour12}:${minutes} ${hour24 >= 12 ? "م" : "ص"}`;
}
