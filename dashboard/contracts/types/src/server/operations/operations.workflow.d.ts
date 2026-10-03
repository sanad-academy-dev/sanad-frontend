import { ChecklistScope, OperationStage, OperationStatus, OperationTier, OperationUrgency } from "@/generated/prisma/enums";
export declare const OPERATION_STATUS_LABELS: Record<OperationStatus, string>;
export declare const OPERATION_STAGE_LABELS: Record<OperationStage, string>;
export declare const OPERATION_TIER_LABELS: Record<OperationTier, string>;
export declare const OPERATION_URGENCY_LABELS: Record<OperationUrgency, string>;
export declare const OPERATION_URGENCY_ORDER: readonly ["IMMEDIATE", "URGENT", "EXPEDITED", "ELECTIVE"];
export declare const OPERATION_TIER_ORDER: readonly ["MINOR", "INTERMEDIATE", "MAJOR"];
export declare const operationTierRank: (tier: OperationTier) => number;
/** درجة الحالة = أعلى درجات إجراءاتها — إضافة إجراء صغير لجراحة كبرى لا تخفّض السقف */
export declare const maxOperationTier: (tiers: readonly OperationTier[]) => OperationTier;
export type OperationPathway = readonly OperationStatus[];
export declare const FULL_OPERATION_PATHWAY: OperationPathway;
export declare const MINOR_OPERATION_PATHWAY: OperationPathway;
export declare const operationPathwayFor: (tier: OperationTier) => OperationPathway;
export declare const OPERATION_TERMINAL_STATUSES: readonly ["COMPLETED", "CANCELLED"];
export declare const isOperationTerminalStatus: (status: OperationStatus) => boolean;
/**
 * الإلغاء مسموح ما لم يبدأ فعل جراحي لا يُمحى: حتى نهاية «الوقفة الآمنة».
 * بعد بدء الجراحة فعليًا يوثَّق الإيقاف في التقرير الجراحي، لا كإلغاء.
 */
export declare const canCancelOperation: (status: OperationStatus, stage: OperationStage | null) => boolean;
export declare const OPERATION_CANCEL_BLOCKED_MESSAGE = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0639\u0645\u0644\u064A\u0629 \u0628\u0639\u062F \u0628\u062F\u0621 \u0627\u0644\u062C\u0631\u0627\u062D\u0629 \u2014 \u064A\u0648\u062B\u064E\u0651\u0642 \u0627\u0644\u0625\u064A\u0642\u0627\u0641 \u0641\u064A \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u062C\u0631\u0627\u062D\u064A";
/**
 * خطوة واحدة للأمام أو للخلف ضمن مسار الدرجة. الإلغاء له مساره الخاص
 * (canCancelOperation لأنه يحتاج المرحلة). الحالات النهائية لا تُغادَر (S21).
 */
export declare const canOperationTransition: (tier: OperationTier, from: OperationStatus, to: OperationStatus) => boolean;
export declare const invalidOperationTransitionMessage: (from: OperationStatus, to: OperationStatus) => string;
export declare const operationStagesFor: (status: OperationStatus, tier: OperationTier) => readonly OperationStage[];
/** المرحلة التي تبدأ بها الحالة عند دخولها — null لحالة بلا مراحل فرعية */
export declare const entryOperationStageFor: (status: OperationStatus, tier: OperationTier) => OperationStage | null;
/** المرحلة التالية ضمن الحالة نفسها، أو null إذا كانت الأخيرة */
export declare const nextOperationStage: (status: OperationStatus, tier: OperationTier, stage: OperationStage) => OperationStage | null;
/** المرحلة السابقة ضمن الحالة نفسها، أو null إذا كانت الأولى */
export declare const previousOperationStage: (status: OperationStatus, tier: OperationTier, stage: OperationStage) => OperationStage | null;
export type OperationGate = "G1_CONSENT" | "G2_FASTING" | "G3_ASSESSMENT" | "G4_SIGN_IN" | "G5_TIME_OUT" | "G6_SIGN_OUT" | "G7_OPERATIVE_NOTE" | "G8_RECOVERY_SCORE" | "G9_DISCHARGE_ORDERS" | "G10_PAYMENT";
export declare const OPERATION_GATE_BLOCKED_MESSAGES: Record<OperationGate, string>;
export type OperationGateContext = {
    /** تخدير/تهدئة مخطَّطة — ترفع متطلبات الصغرى إلى بوابات التخدير */
    sedationPlanned?: boolean;
    /** بوابة السداد مفعّلة من إعدادات الأكاديمية (G10 — القرار D3: معطّلة افتراضيًا) */
    paymentGateEnabled?: boolean;
    /** العدّ الجراحي مطلوب للصغرى أيضًا (القرار D7 — إعداد أكاديمية، معطّل افتراضيًا) */
    countsForMinor?: boolean;
};
/** كل البوابات الإلزامية لهذه الدرجة — مرجع الواجهة لعرض المتطلبات مسبقًا */
export declare const requiredOperationGates: (tier: OperationTier, context?: OperationGateContext) => readonly OperationGate[];
/**
 * بوابات انتقال حالة بعينه — تقاطع بوابات الدرجة مع موضع الانتقال في المسار.
 * G5 (الوقفة الآمنة) بوابة مرحلة لا حالة: تحرس TIME_OUT → IN_PROGRESS عبر
 * gatesForOperationStageAdvance.
 */
export declare const gatesForOperationTransition: (tier: OperationTier, from: OperationStatus, to: OperationStatus, context?: OperationGateContext) => readonly OperationGate[];
/**
 * بوابات تقدّم المراحل داخل الحالة — كل مرحلة محروسة لا تُغادَر قبل استيفاء
 * متطلباتها (الموافقة، الصيام، التقييم، القوائم، درجة الإفاقة). الوقفة الآمنة
 * تحرس بدء الشق الجراحي (S1, S4).
 */
export declare const gatesForOperationStageAdvance: (tier: OperationTier, _status: OperationStatus, fromStage: OperationStage, context?: OperationGateContext) => readonly OperationGate[];
export declare const checklistScopeForGate: (gate: OperationGate, tier: OperationTier) => ChecklistScope | null;
/**
 * حد الخروج من الإفاقة على مقياس 0–10 (نمط Aldrete؛ المعيار البشري ≥9،
 * والبيطري الشائع ≥8). يصبح إعداد أكاديمية في OP8 (ClinicProtocols).
 */
export declare const RECOVERY_DISCHARGE_SCORE_MIN = 8;
/**
 * الحالة الفورية وحدها تتجاوز البوابات — بسبب إلزامي يُسجَّل في سجل النشاط
 * ويظهر في تقارير الالتزام. البوابات لا تمنع إنقاذ حياة أبدًا.
 */
export declare const canOverrideOperationGates: (urgency: OperationUrgency) => boolean;
export declare const OPERATION_OVERRIDE_REASON_REQUIRED_MESSAGE = "\u062A\u062C\u0627\u0648\u0632 \u0628\u0648\u0627\u0628\u0629 \u0623\u0645\u0627\u0646 \u064A\u062A\u0637\u0644\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0633\u0628\u0628";
export declare const OPERATION_OVERRIDE_FORBIDDEN_MESSAGE = "\u062A\u062C\u0627\u0648\u0632 \u0628\u0648\u0627\u0628\u0627\u062A \u0627\u0644\u0623\u0645\u0627\u0646 \u0645\u062A\u0627\u062D \u0644\u0644\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u0641\u0648\u0631\u064A\u0629 (\u0625\u0646\u0642\u0627\u0630 \u062D\u064A\u0627\u0629) \u0641\u0642\u0637";
export declare const canChangeOperationUrgency: (status: OperationStatus, from: OperationUrgency, to: OperationUrgency) => boolean;
export declare const OPERATION_URGENCY_LOCKED_MESSAGE = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u062E\u0641\u064A\u0636 \u0623\u0648\u0644\u0648\u064A\u0629 \u0627\u0644\u0639\u0645\u0644\u064A\u0629 \u0628\u0639\u062F \u0628\u062F\u0621 \u0627\u0644\u062A\u062E\u062F\u064A\u0631";
/** حان موعد العملية المجدولة؟ غياب الموعد يعني «جاهزة الآن» */
export declare const isOperationDue: (scheduledAt: Date | string | null | undefined, now?: Date) => boolean;
/** كم بقي على الموعد — موجب: لم يحن بعد، سالب: تأخّر. بالدقائق */
export declare const operationMinutesUntilDue: (scheduledAt: Date | string | null | undefined, now?: Date) => number | null;
/** ما تحتاجه دوال الاستيفاء من الحالة — بنيوي كي يقبل استجابة التفاصيل كما هي */
export type OperationGateSnapshot = {
    consents: readonly {
        type: string;
        signedAt: Date | string | null;
        revokedAt: Date | string | null;
    }[];
    assessment: {
        asaClass: number | null;
        fastingVerified: boolean;
    } | null;
    checklistRuns: readonly {
        scope: string;
        completedAt: Date | string | null;
    }[];
    /** مرتّبة الأحدث أولًا — كما تُرجعها استجابة التفاصيل */
    recoveryAssessments: readonly {
        score: number | null;
    }[];
};
/**
 * هل استوفت الحالة بوابة بعينها؟ — مرآة واجهة لمنطق الخادم كي تُعطَّل
 * أزرار التقدّم بالسبب نفسه قبل نداء يُرفض حتمًا. الخادم يبقى الحكم.
 */
export declare const isOperationGateMet: (gate: OperationGate, snapshot: OperationGateSnapshot, tier: OperationTier, context?: OperationGateContext, recoveryScoreMin?: number) => boolean;
/** البوابة غير المستوفاة التي تمنع مغادرة المرحلة الحالية — null: الطريق سالك */
export declare const unmetOperationStageGate: (snapshot: OperationGateSnapshot, tier: OperationTier, status: OperationStatus, stage: OperationStage | null, context?: OperationGateContext, recoveryScoreMin?: number) => OperationGate | null;
