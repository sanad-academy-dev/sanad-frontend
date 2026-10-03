import { RadiologyStage, RadiologyStatus } from "@/generated/prisma/enums";
export declare const RADIOLOGY_STATUS_LABELS: Record<RadiologyStatus, string>;
export declare const RADIOLOGY_STAGE_LABELS: Record<RadiologyStage, string>;
export declare const ALLOWED_RADIOLOGY_TRANSITIONS: Record<RadiologyStatus, readonly RadiologyStatus[]>;
export declare const RADIOLOGY_TERMINAL_STATUSES: readonly ["COMPLETED", "CANCELLED"];
export declare const RADIOLOGY_STATUS_ORDER: readonly ["QUEUE", "SCHEDULED", "PREPARATION", "IMAGING", "REPORTING", "UNDER_REVIEW", "COMPLETED"];
export declare const RADIOLOGY_STAGE_ORDER: readonly ["SAFETY_SCREENING", "PATIENT_PREP", "ROOM_ASSIGNMENT", "READY_CHECK", "ACQUISITION", "IMAGE_UPLOAD", "IMAGE_QC"];
export declare const STAGES_BY_RADIOLOGY_STATUS: Partial<Record<RadiologyStatus, readonly RadiologyStage[]>>;
/**
 * الأولوية تُعدَّل قبل بدء تحضير الطفل فقط. بعده صار للطلب أثر مادي
 * (طفل مُجهَّز وجهاز محجوز)، فترتيبه لم يعد مجرّد تفضيل يُعاد ضبطه.
 */
export declare const RADIOLOGY_PRIORITY_LOCKED_MESSAGE = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0623\u0648\u0644\u0648\u064A\u0629 \u0628\u0639\u062F \u0628\u062F\u0621 \u062A\u062D\u0636\u064A\u0631 \u0627\u0644\u0637\u0641\u0644";
export declare const canChangeRadiologyPriority: (orderStatus: RadiologyStatus) => boolean;
/** المرحلة التي يبدأ بها الفحص عند دخول حالة ما */
export declare const entryRadiologyStageFor: (status: RadiologyStatus) => RadiologyStage;
/**
 * فهرس آخر مرحلة بلغها الفحص في RADIOLOGY_STAGE_ORDER، و-1 إذا لم يبدأ المسار.
 *
 * المرحلة الفرعية وحدها لا تكفي: `entryRadiologyStageFor` يُصفّرها عند كل تغيّر
 * حالة لا مراحل فرعية لها. الحالة هي المرجع، والمرحلة تفصّل داخل «تحضير
 * الطفل» و«التصوير» وحدهما.
 */
export declare const radiologyStageProgress: (status: RadiologyStatus, stage: RadiologyStage) => number;
export declare const isRadiologyTerminalStatus: (status: RadiologyStatus) => boolean;
export declare const canRadiologyTransition: (from: RadiologyStatus, to: RadiologyStatus) => boolean;
export declare const invalidRadiologyTransitionMessage: (from: RadiologyStatus, to: RadiologyStatus) => string;
/** المرحلة التالية ضمن الحالة نفسها، أو null إذا كانت آخر مرحلة فيها */
export declare const nextRadiologyStage: (stage: RadiologyStage, status?: RadiologyStatus) => RadiologyStage | null;
/** المرحلة السابقة ضمن الحالة نفسها، أو null إذا كانت أولى مراحلها */
export declare const previousRadiologyStage: (stage: RadiologyStage, status?: RadiologyStatus) => RadiologyStage | null;
/** لا يغادر الفحص مرحلة التحضير قبل بلوغ الملخص والتسليم */
export declare const canLeavePreparation: (status: RadiologyStatus, stage: RadiologyStage) => boolean;
export declare const PREPARATION_BLOCKED_MESSAGE = "\u0623\u0643\u0645\u0644 \u062E\u0637\u0648\u0627\u062A \u062A\u062D\u0636\u064A\u0631 \u0627\u0644\u0637\u0641\u0644 \u0623\u0648\u0644\u064B\u0627 \u0642\u0628\u0644 \u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0625\u0644\u0649 \u0627\u0644\u062A\u0635\u0648\u064A\u0631";
/** لا يغادر الفحص مرحلة التصوير قبل فحص جودة الصور */
export declare const canLeaveImaging: (status: RadiologyStatus, stage: RadiologyStage) => boolean;
export declare const IMAGING_BLOCKED_MESSAGE = "\u0627\u0631\u0641\u0639 \u0627\u0644\u0635\u0648\u0631 \u0648\u0623\u0643\u0645\u0644 \u0641\u062D\u0635 \u062C\u0648\u062F\u062A\u0647\u0627 \u0623\u0648\u0644\u064B\u0627 \u0642\u0628\u0644 \u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0625\u0644\u0649 \u0643\u062A\u0627\u0628\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0631";
/** الانتقال إلى المراجعة مسموح فقط من كتابة التقرير */
export declare const canSendRadiologyToReview: (status: RadiologyStatus) => boolean;
export declare const RADIOLOGY_REVIEW_BLOCKED_MESSAGE = "\u0627\u0643\u062A\u0628 \u0627\u0644\u0645\u0648\u062C\u0648\u062F\u0627\u062A \u0648\u0627\u0644\u0627\u0646\u0637\u0628\u0627\u0639 \u0641\u064A \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0623\u0648\u0644\u064B\u0627 \u0642\u0628\u0644 \u0625\u0631\u0633\u0627\u0644\u0647 \u0644\u0644\u0645\u0631\u0627\u062C\u0639\u0629";
/**
 * الفحص المجدول يبقى في «مجدول» حتى يحين موعده: لا يُسحب منه تلقائيًا قبل
 * الوقت. الفنّي يستطيع بدأه يدويًا (وصول مبكّر أمر شائع)، لكن لا شيء يحرّكه
 * من تلقائه قبل موعده. غياب الموعد يعني «فور السداد» — سلوك ما قبل الجدولة.
 */
export declare const isRadiologyDue: (scheduledAt: Date | string | null | undefined, now?: Date) => boolean;
/** كم بقي على الموعد — موجب: لم يحن بعد، سالب: تأخّر. بالدقائق */
export declare const radiologyMinutesUntilDue: (scheduledAt: Date | string | null | undefined, now?: Date) => number | null;
/**
 * حالة الطلب = أقلّ عناصره تقدّمًا. الفحوصات الملغاة تُستثنى ما لم تكن كلها
 * ملغاة، فالطلب الذي أُلغي أحد فحوصاته لا يزال قائمًا ببقيّتها.
 */
export declare const deriveRadiologyOrderStatus: (items: readonly {
    status: RadiologyStatus;
}[]) => RadiologyStatus;
