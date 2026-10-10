import { DischargeKind, InpatientAcuity, InpatientOrderKind, InpatientStayKind, InpatientStayStatus } from "@/generated/prisma/enums";
export declare const INPATIENT_STATUS_LABELS: Record<InpatientStayStatus, string>;
export declare const INPATIENT_KIND_LABELS: Record<InpatientStayKind, string>;
export declare const INPATIENT_ACUITY_LABELS: Record<InpatientAcuity, string>;
export declare const DISCHARGE_KIND_LABELS: Record<DischargeKind, string>;
export declare const INPATIENT_ORDER_KIND_LABELS: Record<InpatientOrderKind, string>;
export declare const INPATIENT_PATHWAY: readonly ["REQUESTED", "ADMITTED", "IN_CARE", "DISCHARGE_PENDING", "DISCHARGED"];
export declare const INPATIENT_TERMINAL_STATUSES: readonly ["DISCHARGED", "CANCELLED"];
export declare const isInpatientTerminalStatus: (status: InpatientStayStatus) => boolean;
/**
 * الحالات التي يكون فيها الطفل في عهدة الأكاديمية فعلًا — تُحسب في الإشغال، وتظهر
 * على اللوحة، وتُولَّد لها جرعات. «قيد الخروج» منها: الطفل ما زال في قفصه حتى
 * يخرج بالفعل، وحرمانه من جرعته لأن الفاتورة تُحسب خطأ سريري لا إداري.
 */
export declare const INPATIENT_ACTIVE_STATUSES: readonly ["ADMITTED", "IN_CARE", "DISCHARGE_PENDING"];
export declare const isInpatientActive: (status: InpatientStayStatus) => boolean;
/**
 * ما تعرضه اللوحة تحت «القائمة الآن» — الحالات النشطة **زائدًا الطلب**.
 *
 * الطلب ليس نشطًا (لا يشغل قفصًا ولا يُحسب في الإشغال ولا تُولَّد له جرعات)،
 * لكنّه أوّل ما يجب أن يُرى: طفلٌ ينتظر سريرًا. الفصل بين القائمتين مقصود —
 * `INPATIENT_ACTIVE_STATUSES` تُجيب «من في عهدتنا؟» وهذه تُجيب «ما الذي على
 * اللوحة؟». خلطهما يجعل الطلب يُحتسب في الإشغال، أو يختفي عن أعين من يُسكن.
 */
export declare const INPATIENT_BOARD_STATUSES: readonly ["REQUESTED", "ADMITTED", "IN_CARE", "DISCHARGE_PENDING"];
/**
 * الإلغاء متاح ما دامت الرعاية لم تبدأ — نفس مبدأ إلغاء جلسة التجميل: بعد أن
 * يُعطى دواء أو يُسجَّل قياس صار في الإقامة عملٌ لا يُمحى، فتُنهى بالخروج
 * وتُوثَّق، ولا تُمحى بإلغاء يُخفي ما جرى ويُسقط ما استُهلك من مخزون.
 */
export declare const canCancelInpatientStay: (status: InpatientStayStatus) => boolean;
export declare const INPATIENT_CANCEL_BLOCKED_MESSAGE = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0625\u0642\u0627\u0645\u0629 \u0628\u0639\u062F \u0628\u062F\u0621 \u0627\u0644\u0631\u0639\u0627\u064A\u0629 \u2014 \u0623\u0646\u0647\u0650\u0647\u0627 \u0628\u0627\u0644\u062E\u0631\u0648\u062C \u0648\u0648\u062B\u0651\u0642 \u0633\u0628\u0628\u0647";
/**
 * خطوة واحدة للأمام ضمن المسار، وخطوة واحدة للخلف من «قيد الخروج» وحدها.
 *
 * التراجع من «قيد الخروج» إلى «قيد الرعاية» حالة سريرية حقيقية لا تصحيحُ خطأ:
 * طفل تقرّر خروجه ثم تدهور قبل أن يغادر. بقيّة الاتجاه الخلفي ممنوع — الرجوع
 * من «قيد الرعاية» إلى «دخل» لا يعني شيئًا، والخروج لا يُتراجع عنه بل تُفتح
 * إقامة جديدة (وهو ما يحفظ صدق مدّة الإقامة الأولى في التقارير).
 */
export declare const canInpatientTransition: (from: InpatientStayStatus, to: InpatientStayStatus) => boolean;
export declare const invalidInpatientTransitionMessage: (from: InpatientStayStatus, to: InpatientStayStatus) => string;
export type InpatientGate = "G1_CAGE_ASSIGNED" | "G2_ADMISSION_VITALS" | "G3_CONSENT" | "G4_ISOLATION_PLACEMENT" | "G5_NO_ACTIVE_ORDERS" | "G6_DISCHARGE_SUMMARY" | "G7_INVOICE_SETTLED";
export declare const INPATIENT_GATE_BLOCKED_MESSAGES: Record<InpatientGate, string>;
/**
 * البوابات التي لا تُتجاوز مهما كانت الصلاحية أو السبب.
 *
 * المعيار واحد: كل واحدة منها تُستوفى في دقيقة — تنقل الطفل إلى قاعة عزل،
 * أو تضغط «إيقاف» على أمر، أو تكتب سطرَي تقرير. بوابةٌ بهذه السهولة لا تحتاج
 * بابًا خلفيًا، ووجود الباب فيها يعني أنّها لم تكن بوابة أصلًا بل تذكيرًا.
 *
 * G4: طفل مُعدٍ في عنبر مشترك يصيب من فيه — ولا سبب تشغيليّ يوازي ذلك.
 * G5: إقامة تُقفل وقنينة وريدية معلّقة تعني طفلًا يخرج بقسطرة في وريده.
 * G6: التقرير هو ما يحمله وليّ الأمر معه؛ خروجٌ بلا تعليمات يُعيد الطفل بعد يومين.
 */
export declare const NON_OVERRIDABLE_INPATIENT_GATES: readonly ["G4_ISOLATION_PLACEMENT", "G5_NO_ACTIVE_ORDERS", "G6_DISCHARGE_SUMMARY"];
export declare const isInpatientGateOverridable: (gate: InpatientGate) => boolean;
export declare const INPATIENT_OVERRIDE_REASON_REQUIRED_MESSAGE = "\u062A\u062C\u0627\u0648\u0632 \u0628\u0648\u0627\u0628\u0629 \u064A\u062A\u0637\u0644\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0633\u0628\u0628";
export declare const inpatientGateNotOverridableMessage: (gate: InpatientGate) => string;
/**
 * طرق الخروج التي تتجاوز بوابتَي الأمر الجاري والفاتورة.
 *
 * إيقاف أوامر طفلٍ نفق عملٌ بلا معنى، وحبسُ تسجيل النفوق على سداد فاتورة
 * قسوةٌ وخطأ بيانات معًا: التأخير يجعل تاريخ الوفاة كذبًا. الفاتورة تبقى قائمة
 * وتُحصَّل بمسارها، وهو ما لا علاقة له بإقفال السجل السريري.
 */
export declare const DISCHARGE_KINDS_BYPASSING_CLOSURE_GATES: readonly ["DIED", "EUTHANIZED"];
export declare const dischargeBypassesClosureGates: (kind: DischargeKind | null | undefined) => boolean;
export type InpatientGateContext = {
    kind?: InpatientStayKind;
    /** اشتراط إقرار التنويم — إعداد أكاديمية، مفعّل افتراضيًا */
    consentRequired?: boolean;
    /** حبس الخروج على تسوية الفاتورة — إعداد أكاديمية، مفعّل افتراضيًا (القرار D8) */
    blockDischargeOnUnpaid?: boolean;
    /** طريقة الخروج المختارة — النفوق والتيسير يتجاوزان بوابتَي الإقفال */
    dischargeKind?: DischargeKind | null;
};
/** كل البوابات الإلزامية لهذه الإقامة — مرجع الواجهة لعرض المتطلبات مسبقًا */
export declare const requiredInpatientGates: (context?: InpatientGateContext) => readonly InpatientGate[];
/**
 * بوابات انتقال بعينه. البوابة تحرس التقدّم وحده: التراجع من «قيد الخروج»
 * إلى «قيد الرعاية» والإلغاء بلا بوابات، إذ لا يجوز أن يُحبس طفل متدهور في
 * عمود لأن الفاتورة لم تُسدَّد.
 */
export declare const gatesForInpatientTransition: (from: InpatientStayStatus, to: InpatientStayStatus, context?: InpatientGateContext) => readonly InpatientGate[];
/**
 * الدورية الافتراضية بالدقائق من درجة الحرجية. اقتراحٌ يُكتب في الحقل عند
 * الدخول ويبقى قابلًا للتعديل — لا قاعدةً تُفرض: المدرّب قد يطلب كل ساعتين
 * لطفل مستقرّ يراقَب لسبب بعينه.
 *
 * الأرقام هي ما يمارَس فعلًا في عنابر التنويم: العناية المركّزة كل ساعة،
 * والحرج كل ساعتين، والمتوسّط كل أربع، والمستقرّ مرّتين في المناوبة.
 */
export declare const DEFAULT_MONITORING_INTERVAL_BY_ACUITY: Record<InpatientAcuity, number>;
/** درجة الحرجية الافتراضية المقترحة من نوع الإقامة */
export declare const DEFAULT_ACUITY_BY_KIND: Record<InpatientStayKind, InpatientAcuity>;
export declare const defaultMonitoringIntervalMinutes: (acuity: InpatientAcuity, kind?: InpatientStayKind) => number;
export declare const ISOLATION_ROOM_TYPE: "ISOLATION";
/**
 * هل يجوز إسكان هذه الإقامة في قاعة بهذا النوع؟
 *
 * قاعدةٌ واحدة صارمة (العزل)، وما عداها تحذير لا منع: عنبر عام ليس مكانًا مثاليًا
 * لحالة عناية مركّزة لكنّه أحيانًا كل ما في الفرع ليلة الجمعة، ومنعُه يدفع الطاقم
 * إلى ألّا يسجّل الإسكان أصلًا — فنخسر الإشغال والتتبّع معًا.
 */
export declare const isCagePlacementPermitted: (stayKind: InpatientStayKind, roomType: string) => boolean;
export declare const CAGE_PLACEMENT_BLOCKED_MESSAGE = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u0633\u0643\u0627\u0646 \u0625\u0642\u0627\u0645\u0629 \u0639\u0632\u0644 \u0641\u064A \u0642\u0627\u0639\u0629 \u0644\u064A\u0633\u062A \u0642\u0627\u0639\u0629 \u0639\u0632\u0644";
/** أنواع القاعات التي تصلح للتنويم أصلًا — ما عداها لا تُعرض في اختيار القفص */
export declare const INPATIENT_ROOM_TYPES: readonly ["WARD", "ICU", "ISOLATION"];
