import type { VitalParameter } from "@/server/inpatients/vital-reference-ranges.data";
/**
 * [IP3] محرّك إنذارات العلامات الحيوية — نقيّ تمامًا (لا db، لا ساعة داخلية).
 *
 * ── المبدأ الأول: لا مدى ≠ سليم ─────────────────────────────────────────────
 *
 * حين لا يوجد صفٌّ مرجعي لهذا النوع وهذا المقياس، النتيجة `NO_RANGE` لا
 * `NORMAL`. الفرق هو الفرق بين «قِسنا ولم نجد خللًا» و«لا نعرف ما الطبيعي هنا»،
 * وخلطُهما يجعل الشاشة تُطمئن الطاقم على طفل لم يُقيَّم أصلًا. هذا هو نفس
 * قرار `computeResultFlag` في التحاليل ونفس تصنيفات الرفض في محرّك الجرعة.
 *
 * ── المبدأ الثاني: النقطة ليست الاتجاه ──────────────────────────────────────
 *
 * حرارة ٣٩٫٢ ضمن المدى، وثلاث قراءات متتالية صاعدة نحوها ليست ضمن شيء. أخطر ما
 * في ورقة المتابعة أن كل سطر فيها «طبيعي» بينما السطور مجتمعةً تحكي تدهورًا.
 * ولهذا يُقيَّم الاتجاه مستقلًّا عن حدود المدى.
 */
export type VitalFlag = "NORMAL" | "LOW" | "HIGH" | "CRITICAL_LOW" | "CRITICAL_HIGH"
/** لا صفّ مرجعي مطابق — ليست قراءةً سليمة بل قراءةٌ غير مُقيَّمة */
 | "NO_RANGE";
export declare const VITAL_FLAG_LABELS: Record<VitalFlag, string>;
export declare const CRITICAL_VITAL_FLAGS: readonly ["CRITICAL_LOW", "CRITICAL_HIGH"];
export declare const isCriticalVitalFlag: (flag: VitalFlag) => boolean;
export declare const isAbnormalVitalFlag: (flag: VitalFlag) => boolean;
export declare const VITAL_PARAMETER_LABELS: Record<VitalParameter, string>;
/** ما يحتاجه المحرّك من `vital_reference_range` — لا يستورد النموذج كي يبقى نقيًّا */
export type ReferenceRangeInput = {
    parameter: VitalParameter;
    low: number;
    high: number;
    criticalLow: number | null;
    criticalHigh: number | null;
    ageMinWeeks: number | null;
    ageMaxWeeks: number | null;
    /** null = صفّ عام مبذور؛ غير null = صفّ الأكاديمية، وهو يَجُبّ العام */
    clinicId: string | null;
};
/**
 * الصفّ المرجعي المناسب لهذا المقياس وهذا العمر.
 *
 * ترتيب الأفضلية مقصود: صفّ الأكاديمية قبل العام (الأكاديمية تعرف مرضاها)، ثم الصفّ
 * المحدَّد بالعمر قبل صفّ «كل الأعمار» (نبض الجرو ليس نبض الكلب البالغ). عمرٌ
 * غير معروف لا يُخمَّن: يسقط إلى صفّ «كل الأعمار» إن وُجد، وإلا فلا مدى — وهو
 * أصدق من مقارنة قراءةِ رضيعٍ بمدى بالغ.
 */
export declare const selectReferenceRange: (ranges: readonly ReferenceRangeInput[], parameter: VitalParameter, ageWeeks: number | null) => ReferenceRangeInput | null;
/**
 * تصنيف قراءة واحدة مقابل مداها.
 *
 * الحدّ الحرج الغائب لا يُشتقّ من الطبيعي: `null` يعني «لا حدّ حرج موثَّق»
 * لا «لا خطر»، فتبقى القراءة `HIGH` بدل أن تُرفَّع إلى `CRITICAL_HIGH` بتخمين.
 * ترقيةٌ ملفَّقة تُصعِّد إنذارًا إلى المدرّب المعالج في الثالثة فجرًا بلا أساس.
 */
export declare const flagVital: (value: number | null | undefined, range: ReferenceRangeInput | null) => VitalFlag;
export type TrendDirection = "RISING" | "FALLING" | "STABLE" | "INSUFFICIENT_DATA";
export declare const TREND_LABELS: Record<TrendDirection, string>;
/** أقلّ عدد قراءات يُقال عنده «اتجاه» — قراءتان تذبذبٌ لا اتجاه */
export declare const MIN_TREND_POINTS = 3;
/**
 * اتجاه آخر N قراءات (الأقدم أولًا في المصفوفة).
 *
 * الشرط صرامةٌ متعمَّدة: كل خطوة في الاتجاه نفسه. اتجاهٌ يُعلَن على «الغالب»
 * يُنتج إنذارًا من ذبذبةٍ عادية، ثم يُدرَّب الطاقم على تجاهله. القراءة المتساوية
 * تكسر الاتجاه لأنها فعلًا تكسره — استقرارٌ وسط صعود ليس صعودًا مطّردًا.
 */
export declare const detectTrend: (values: readonly (number | null | undefined)[], points?: number) => TrendDirection;
export declare const isConcerningTrend: (parameter: VitalParameter, trend: TrendDirection) => boolean;
/** عتبة فقدان الوزن التي تستحقّ إنذارًا — ٥٪ من وزن الدخول */
export declare const WEIGHT_LOSS_ALERT_PERCENT = 5;
/**
 * نسبة تغيّر الوزن عن وزن الدخول (سالبة = فقدان).
 * وزن دخول غير موجب يُعيد null بدل قسمةٍ على صفر تُنتج لانهاية تُعرض كنسبة.
 */
export declare const weightChangePercent: (admissionKg: number | null | undefined, currentKg: number | null | undefined) => number | null;
export type InpatientAlertSeverity = "INFO" | "WARNING" | "CRITICAL";
export type InpatientAlertCode = "VITAL_ABNORMAL" | "VITAL_CRITICAL" | "VITAL_TREND" | "VITAL_NO_RANGE" | "WEIGHT_LOSS";
export type InpatientAlert = {
    code: InpatientAlertCode;
    severity: InpatientAlertSeverity;
    parameter: VitalParameter | null;
    messageAr: string;
};
export type VitalReadingInput = {
    parameter: VitalParameter;
    value: number | null;
    unit?: string | null;
};
/**
 * إنذارات قراءةٍ واحدة مع تاريخها.
 *
 * `history` هي القراءات السابقة لهذا المقياس (الأقدم أولًا) شاملةً الحالية —
 * فالاتجاه يُقاس على السلسلة لا على النقطة.
 *
 * `NO_RANGE` لا يُنتج إنذارًا صاخبًا بل ملاحظةً واحدة من مستوى INFO: نقصُ إعداد
 * لا حالةٌ سريرية، والخلط بينهما يُغرق اللوحة بأحمرَ لا يعني مرضًا.
 */
export declare const evaluateVitalAlerts: (input: {
    reading: VitalReadingInput;
    range: ReferenceRangeInput | null;
    history?: readonly (number | null | undefined)[];
}) => InpatientAlert[];
/** إنذار فقدان الوزن مقارنةً بوزن الدخول */
export declare const evaluateWeightAlert: (input: {
    admissionKg: number | null | undefined;
    currentKg: number | null | undefined;
    thresholdPercent?: number;
}) => InpatientAlert | null;
export declare const worstAlertSeverity: (alerts: readonly InpatientAlert[]) => InpatientAlertSeverity | null;
/** هل يستوجب أيٌّ من هذه الإنذارات تصعيدًا فوريًّا إلى المدرّب المعالج؟ */
export declare const requiresAttendingEscalation: (alerts: readonly InpatientAlert[]) => boolean;
