import { LabSampleStage, LabTestStatus } from "@/generated/prisma/enums";
export declare const LAB_STATUS_LABELS: Record<LabTestStatus, string>;
export declare const LAB_STAGE_LABELS: Record<LabSampleStage, string>;
export declare const ALLOWED_LAB_TRANSITIONS: Record<LabTestStatus, readonly LabTestStatus[]>;
export declare const LAB_TERMINAL_STATUSES: readonly ["COMPLETED", "CANCELLED"];
export declare const LAB_STATUS_ORDER: readonly ["QUEUE", "SCHEDULED", "SAMPLE_COLLECTION", "IN_LAB", "UNDER_REVIEW", "COMPLETED"];
export declare const LAB_STAGE_ORDER: readonly ["NOT_COLLECTED", "COLLECTED", "QUALITY_CHECK", "LABEL_PRINT", "ANALYZER_ASSIGNMENT", "HANDOVER_SUMMARY", "ANALYZING", "RESULTS_READY"];
export declare const STAGES_BY_STATUS: Partial<Record<LabTestStatus, readonly LabSampleStage[]>>;
/**
 * الأولوية تُعدَّل قبل بدء سحب العيّنة فقط. بعده صار للطلب أثر مادي في المختبر
 * (عيّنة مسحوبة وملصقة وجهاز محجوز)، فترتيبه لم يعد مجرّد تفضيل يُعاد ضبطه.
 */
export declare const PRIORITY_LOCKED_MESSAGE = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0623\u0648\u0644\u0648\u064A\u0629 \u0628\u0639\u062F \u0628\u062F\u0621 \u0633\u062D\u0628 \u0627\u0644\u0639\u064A\u0651\u0646\u0629";
export declare const canChangePriority: (orderStatus: LabTestStatus) => boolean;
/** المرحلة التي يبدأ بها التحليل عند دخول حالة ما */
export declare const entryStageFor: (status: LabTestStatus) => LabSampleStage;
/**
 * فهرس آخر مرحلة بلغها التحليل في LAB_STAGE_ORDER، و-1 إذا لم يبدأ المسار بعد.
 *
 * المرحلة الفرعية وحدها لا تكفي: `entryStageFor` يُصفّرها إلى NOT_COLLECTED عند
 * كل تغيّر حالة لا مراحل فرعية لها — فتحليل «مكتمل» يخزّن أول مرحلة لا آخرها.
 * الحالة هي المرجع، والمرحلة تفصّل داخل «سحب العيّنة» و«في المختبر» وحدهما.
 */
export declare const labStageProgress: (status: LabTestStatus, stage: LabSampleStage) => number;
export declare const isLabTerminalStatus: (status: LabTestStatus) => boolean;
export declare const canLabTransition: (from: LabTestStatus, to: LabTestStatus) => boolean;
export declare const invalidLabTransitionMessage: (from: LabTestStatus, to: LabTestStatus) => string;
/** المرحلة التالية للعيّنة ضمن الحالة نفسها، أو null إذا كانت آخر مرحلة فيها */
export declare const nextSampleStage: (stage: LabSampleStage, status?: LabTestStatus) => LabSampleStage | null;
/** المرحلة السابقة للعيّنة ضمن الحالة نفسها، أو null إذا كانت أولى مراحلها */
export declare const previousSampleStage: (stage: LabSampleStage, status?: LabTestStatus) => LabSampleStage | null;
/** لا يغادر التحليل مرحلة السحب قبل تسجيل سحب العيّنة فعلًا */
export declare const canLeaveSampleCollection: (status: LabTestStatus, stage: LabSampleStage) => boolean;
export declare const SAMPLE_BLOCKED_MESSAGE = "\u0623\u0643\u0645\u0644 \u062E\u0637\u0648\u0627\u062A \u0633\u062D\u0628 \u0627\u0644\u0639\u064A\u0651\u0646\u0629 \u0623\u0648\u0644\u064B\u0627 \u0642\u0628\u0644 \u0625\u0631\u0633\u0627\u0644\u0647\u0627 \u0625\u0644\u0649 \u0627\u0644\u0645\u062E\u062A\u0628\u0631";
/** الانتقال إلى المراجعة مسموح فقط بعد ظهور النتائج */
export declare const canSendToReview: (status: LabTestStatus, stage: LabSampleStage) => boolean;
export declare const REVIEW_BLOCKED_MESSAGE = "\u0623\u062F\u062E\u0644 \u0627\u0644\u0646\u062A\u0627\u0626\u062C \u0648\u0627\u0646\u062A\u0642\u0644 \u0625\u0644\u0649 \u00AB\u0638\u0647\u0631\u062A \u0627\u0644\u0646\u062A\u0627\u0626\u062C\u00BB \u0623\u0648\u0644\u0627\u064B";
/**
 * حالة الطلب = أقلّ عناصره تقدّمًا. التحاليل الملغاة تُستثنى ما لم تكن كلها
 * ملغاة، فالطلب الذي أُلغي أحد تحاليله لا يزال قائمًا ببقيّتها.
 */
export declare const deriveOrderStatus: (items: readonly {
    status: LabTestStatus;
}[]) => LabTestStatus;
