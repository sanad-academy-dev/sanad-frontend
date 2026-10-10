import type { TriageCategory } from "@/generated/prisma/enums";
import { TRIAGE_RULES } from "@sanad/contracts/runtime/server/emergency/emergency.rules";

/**
 * [E2] عرض ألوان الفرز.
 *
 * ── لماذا الألوان هنا ثابتة لا رموز تصميم ──────────────────────────────────
 *
 * هذا هو الاستثناء الوحيد المقصود من قاعدة «الرموز فقط»: ألوان الفرز الخمسة
 * **معيار سريري لا خيار تصميم**. الأحمر يعني «الآن» في كل مستشفى على الأرض،
 * وتبديلُه برمز العلامة التجارية للأكاديمية يُفقد الشارة معناها المتّفق عليه — وهو
 * المعنى الذي يقرؤه ممرّض جديد في يومه الأوّل بلا أن يشرحه له أحد.
 *
 * ولهذا أيضًا لا يُكتفى باللون: كل شارة تحمل **نصًّا** معه. عمى الألوان الأحمر
 * الأخضر يصيب رجلًا من كل اثني عشر، وشارةٌ لونها وحده معناها تُخفي عنه الفرز كلّه.
 */

export type TriageTone = {
	/** خلفية الشارة والشريط الجانبي */
	badge: string;
	/** الشريط الملوّن على حافّة البطاقة */
	stripe: string;
	/** خلفية خفيفة لرأس المجموعة */
	surface: string;
};

export const TRIAGE_TONES: Record<TriageCategory, TriageTone> = {
	RED: {
		badge: "bg-red-600 text-white",
		stripe: "bg-red-600",
		surface: "bg-red-50 dark:bg-red-950/30",
	},
	ORANGE: {
		badge: "bg-orange-500 text-white",
		stripe: "bg-orange-500",
		surface: "bg-orange-50 dark:bg-orange-950/30",
	},
	YELLOW: {
		badge: "bg-yellow-400 text-yellow-950",
		stripe: "bg-yellow-400",
		surface: "bg-yellow-50 dark:bg-yellow-950/30",
	},
	GREEN: {
		badge: "bg-green-600 text-white",
		stripe: "bg-green-600",
		surface: "bg-green-50 dark:bg-green-950/30",
	},
	BLUE: {
		badge: "bg-blue-600 text-white",
		stripe: "bg-blue-600",
		surface: "bg-blue-50 dark:bg-blue-950/30",
	},
};

/** دقائق الانتظار حتى الآن — أو null بلا وقت وصول */
export const waitedMinutes = (arrivedAt: string | Date | null, now: number): number | null => {
	if (!arrivedAt) return null;
	const at = typeof arrivedAt === "string" ? new Date(arrivedAt) : arrivedAt;
	return Math.floor((now - at.getTime()) / 60_000);
};

export type WaitState = "OK" | "IMMINENT" | "BREACHED" | "UNKNOWN";

/**
 * حالة الانتظار مقابل هدف اللون.
 *
 * تُعاد نفس عتبة الخادم (٨٠٪) — والمنطق مكرّر هنا عمدًا بأبسط صورة لأن الواجهة
 * تدقّ بين جولات الشبكة: لو انتظرت رَدَّ الخادم لبقيت الساعة جامدة عشر ثوانٍ في
 * كل مرّة. والخادم يبقى المرجع لِما يُبعث من إنذارات.
 */
export const waitState = (
	category: TriageCategory | null,
	minutes: number | null,
): WaitState => {
	if (!category || minutes == null) return "UNKNOWN";
	const target = TRIAGE_RULES[category].targetMinutes;
	if (minutes > target) return "BREACHED";
	if (target > 0 && minutes >= target * 0.8) return "IMMINENT";
	return "OK";
};

export const WAIT_STATE_CLASS: Record<WaitState, string> = {
	BREACHED: "text-red-600 font-bold",
	IMMINENT: "text-orange-600 font-medium",
	OK: "text-muted-foreground",
	UNKNOWN: "text-muted-foreground",
};

/** «٤٥ د» / «١ س ٢٠ د» — أقصر ما يمكن قراءته بطرف العين على بطاقة */
export const formatWait = (minutes: number | null): string => {
	if (minutes == null) return "—";
	if (minutes < 60) return `${minutes} د`;
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return m === 0 ? `${h} س` : `${h} س ${m} د`;
};

export const PATIENT_ALERT_TONES: Record<string, string> = {
	ALLERGY: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
	CHRONIC_CONDITION: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
	BITE_RISK: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
	CODE_STATUS: "bg-slate-800 primarydark:bg-slate-200 dark:text-slate-900",
	OTHER: "bg-muted text-muted-foreground",
};

export const PATIENT_ALERT_LABELS: Record<string, string> = {
	ALLERGY: "حساسية",
	CHRONIC_CONDITION: "حالة مزمنة",
	BITE_RISK: "خطر عضّ",
	CODE_STATUS: "قرار الإنعاش",
	OTHER: "تنبيه",
};

/** [E5] ألوان الاستقرار — حرجٌ بلون التدمير، وغير مستقرّ بالتحذير، ومستقرّ محايد */
export const STABILITY_TONES: Record<string, string> = {
	STABLE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
	UNSTABLE: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
	CRITICAL: "bg-destructive/10 text-destructive",
};
