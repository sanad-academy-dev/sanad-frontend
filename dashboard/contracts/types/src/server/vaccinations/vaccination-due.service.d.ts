import type { VaccinationDoseKind } from "@/generated/prisma/enums";
/**
 * محرّك الاستحقاق — دوالّ خالصة بلا وصول إلى قاعدة البيانات.
 *
 * الخلوص شرط لا رفاهية: لا يوجد `DATABASE_URL` محلي في هذا المستودع، والاختبارات
 * التي تُشغَّل قبل الدفع هي اختبارات خالصة. أي منطق جدولة يعيش داخل استعلام Prisma
 * لا يمكن التحقّق منه إلا في CI — فيُكتب هنا، ويُغذّى من الطبقة أعلاه.
 *
 * الحساب يجري **لكل مُستضِدّ**، لا لكل لقاح: اللقاح متعدّد التكافؤ، وجرعة DHPPi
 * تُرضي أربعة مُستضِدّات دفعة واحدة. الحساب على مستوى المنتج ينكسر في اللحظة التي
 * تبدّل فيها الأكاديمية لقاحًا رباعيًا بخماسي.
 */
export declare const VACCINATION_DUE_STATUSES: readonly ["UP_TO_DATE", "DUE_SOON", "DUE", "OVERDUE", "NOT_STARTED", "UNKNOWN_AGE"];
export type VaccinationDueStatus = (typeof VACCINATION_DUE_STATUSES)[number];
/** الحالات التي تستدعي إجراءً من الأكاديمية — تُستخدم للترشيح والعدّ في كل الشاشات. */
export declare const ACTIONABLE_DUE_STATUSES: readonly VaccinationDueStatus[];
/** جرعة بروتوكول بالقدر الذي يحتاجه الحساب (لا يعتمد على شكل Prisma كاملًا). */
export type DueProtocolDose = {
    id: string;
    order: number;
    antigenCode: string;
    label: string;
    kind: VaccinationDoseKind;
    ageWeeksMin: number | null;
    ageWeeksMax: number | null;
    intervalDaysFromPrev: number | null;
    boosterIntervalDays: number | null;
};
/** جرعة أُعطيت فعلًا، مع المُستضِدّات التي غطّتها. */
export type DueGivenRecord = {
    id: string;
    administeredAt: Date;
    antigenCodes: readonly string[];
    isVoided: boolean;
};
export type DueProjection = {
    antigenCode: string;
    /** الجرعة المنتظَرة تاليًا من البروتوكول — `null` إذا اكتمل ولا منشّطة له */
    dose: DueProtocolDose | null;
    /** رقم الجرعة القادمة ضمن سلسلة هذا المُستضِدّ (1-based) */
    nextDoseNumber: number;
    dueAt: Date | null;
    status: VaccinationDueStatus;
    /** عدد الأيام حتى الاستحقاق — سالب يعني تأخّرًا */
    daysUntilDue: number | null;
    lastGivenAt: Date | null;
    /** عدد الجرعات المعطاة لهذا المُستضِدّ */
    dosesGiven: number;
};
export type ComputeDueArgs = {
    birthDate: Date | null;
    records: readonly DueGivenRecord[];
    doses: readonly DueProtocolDose[];
    /** مدى الاستباق بالأيام قبل أن تُعدّ الجرعة «تستحق قريبًا» */
    leadDays: number;
    today: Date;
};
/** بداية اليوم بالتوقيت المحلي — المقارنات كلها على مستوى اليوم لا اللحظة. */
export declare const startOfDay: (d: Date) => Date;
export declare const addDays: (d: Date, days: number) => Date;
export declare const addWeeks: (d: Date, weeks: number) => Date;
/** فرق الأيام الكامل بين يومين (الثاني ناقص الأول). */
export declare const diffDays: (from: Date, to: Date) => number;
/**
 * يحسب الاستحقاق لكل مُستضِدّ في البروتوكول.
 *
 * غياب تاريخ الميلاد لا يُعوَّض بتخمين من حقل `age` (رقم حرّ بلا مرجع زمني ولا
 * لحظة قياس): الحالة تُبلَّغ `UNKNOWN_AGE` صراحةً. تلفيق تاريخ استحقاق لجرو عمره
 * مجهول أسوأ من الاعتراف بأن العمر ناقص.
 */
export declare function computeDueProjections({ birthDate, records, doses, leadDays, today, }: ComputeDueArgs): DueProjection[];
/** أقرب تاريخ استحقاق فعلي عبر كل المُستضِدّات — هو ما يُخزَّن في `nextDueAt`. */
export declare function earliestDueAt(projections: readonly DueProjection[]): Date | null;
/** أخطر حالة عبر المُستضِدّات — تلخّص حال الطفل في شارة واحدة. */
export declare function worstStatus(projections: readonly DueProjection[]): VaccinationDueStatus | null;
