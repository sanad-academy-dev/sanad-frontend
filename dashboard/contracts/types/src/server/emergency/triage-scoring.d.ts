import type { MucousMembrane } from "@/generated/prisma/enums";
import { type ReferenceRangeInput } from "@/server/inpatients/inpatient-alerts.service";
/**
 * [E1] درجة ATT — Animal Trauma Triage (Rockar et al. 1994).
 *
 * الخطة الحاكمة: `docs/emergency-workflow-plan.md` §4.6
 *
 * ── ما هي، ولماذا هي غير لون الفرز ─────────────────────────────────────────
 *
 * اللون يجيب «متى يُرى هذا الطفل؟» — وهو قرار ترتيبٍ تشغيليّ. ودرجة ATT تجيب
 * سؤالًا آخر تمامًا: «ما احتمال نجاته؟» — وهي أداة إنذار بالمآل. المنشور الأصلي
 * قاس أن كل نقطة زيادة تقابل انخفاضًا في احتمال النجاة بمقدار ٢٫٣–٢٫٦ ضعف. فهما
 * لا يتنافسان: اللون يرتّب الطابور، والدرجة تقول للمدرّب كم الحالة خطيرة.
 *
 * ستّة محاور، كلٌّ 0–3، فالمجموع 0–18. ثلاثة منها فسيولوجية تُحسب من العلامات
 * الحيوية التي يلتقطها النظام أصلًا (`capillaryRefillSec`, `mucousMembrane`,
 * `heartRate`, `respiratoryRate`, `oxygenSaturation`)، وثلاثة تُقرأ من مُميِّزات
 * الفرز لأنها فحصٌ بالنظر لا قياسٌ بجهاز.
 *
 * ── لماذا `null` أصدق من رقم ────────────────────────────────────────────────
 *
 * درجةٌ ناقصة المحاور ليست «درجة منخفضة»: طفلٌ لم يُقس تنفّسه ليس طفلًا تنفّسه
 * سليم. ولأن الرقم يُقرأ كتنبّؤ بالنجاة، فتلفيقه من محاور غائبة يعطي طمأنينة
 * كاذبة في اللحظة التي لا تُحتمل فيها. فإمّا كل المحاور أو `null`.
 */
export declare const ATT_AXES: readonly ["PERFUSION", "CARDIAC", "RESPIRATORY", "EYE_MUSCLE_INTEGUMENT", "SKELETAL", "NEUROLOGIC"];
export type AttAxis = (typeof ATT_AXES)[number];
export declare const ATT_AXIS_LABELS: Record<AttAxis, string>;
/** أعلى درجة لمحور واحد، وأعلى مجموع — ثابتا المنشور الأصلي */
export declare const ATT_MAX_PER_AXIS = 3;
export declare const ATT_MAX_TOTAL: number;
export type AttAxisScore = {
    axis: AttAxis;
    /** null = لم تتوفّر بيانات هذا المحور */
    score: number | null;
    /** ما اشتُقّت منه الدرجة — يظهر في الورقة كي لا تكون الدرجة صندوقًا أسود */
    basis: string;
};
export type AttResult = {
    /** المجموع، أو null إن نقص محور واحد */
    total: number | null;
    axes: AttAxisScore[];
    /** المحاور الناقصة — تُعرض للممرّض كي يعرف ماذا يقيس ليكتمل الرقم */
    missingAxes: AttAxis[];
};
export type TriageVitalsInput = {
    capillaryRefillSec?: number | null;
    mucousMembrane?: MucousMembrane | null;
    heartRate?: number | null;
    respiratoryRate?: number | null;
    oxygenSaturation?: number | null;
};
export declare const computeAttScore: (input: {
    vitals: TriageVitalsInput;
    discriminators: readonly string[];
    ranges: readonly ReferenceRangeInput[];
    ageWeeks: number | null;
}) => AttResult;
/**
 * قراءة نصّية للدرجة — لا تُترجَم إلى «نسبة نجاة».
 *
 * المنشور يعطي نسبةً مشروطة بمجموعة مرضاه هو، ونقلُها إلى شاشةٍ عربية تُقرأ كوعدٍ
 * للوليّ أمر. فالنصّ يصف الشدّة ويترك التنبّؤ للمدرّب.
 */
export declare const attSeverityLabel: (total: number | null) => string;
