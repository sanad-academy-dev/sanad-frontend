import {
	DischargeKind,
	InpatientAcuity,
	InpatientOrderKind,
	InpatientStayKind,
	InpatientStayStatus,
} from "@/generated/prisma/enums";

// آلة حالات الإقامة — المصدر الوحيد للمسار والانتقالات والبوابات.
// ملف بيانات/دوال نقية فقط (بلا db) — يُستورد من الخادم والواجهة معًا.
// الخطة الحاكمة: docs/inpatients-module-plan.md (§3 الآلة، §4 الطبقة الذكية).
//
// المسار قصير عمدًا وليس فيه «مراحل» كالعمليات أو التجميل: الإقامة ليست سير عمل
// خطوات، بل مدّة زمنية لها بداية ونهاية وما بينهما رعاية متكرّرة. ما يتكرّر يعيش
// في `InpatientAdministration` لا في حالة الإقامة.
//
//   طلب تنويم ← دخل (بالإسكان) ← قيد الرعاية ← قيد الخروج ← خرج
//
// ثلاث بوابات بلا أي مسار تجاوز — G4 (إسكان العزل) وG5 (أمر جارٍ) وG6 (تقرير
// الخروج). سبب الاستثناء أنّ الثلاث جميعًا قابلة للاستيفاء في دقيقة: تُنقل
// إلى قاعة عزل، أو تُوقف الأمر، أو تكتب التقرير. بوابةٌ يسهل استيفاؤها لا تحتاج
// بابًا خلفيًا، والباب الخلفي فيها يعني أنّها لم تكن بوابة أصلًا.

// ── التسميات العربية ────────────────────────────────────────────────────────

export const INPATIENT_STATUS_LABELS: Record<InpatientStayStatus, string> = {
	[InpatientStayStatus.REQUESTED]: "طلب تنويم",
	[InpatientStayStatus.ADMITTED]: "دخل",
	[InpatientStayStatus.IN_CARE]: "قيد الرعاية",
	[InpatientStayStatus.DISCHARGE_PENDING]: "قيد الخروج",
	[InpatientStayStatus.DISCHARGED]: "خرج",
	[InpatientStayStatus.CANCELLED]: "ملغاة",
};

export const INPATIENT_KIND_LABELS: Record<InpatientStayKind, string> = {
	[InpatientStayKind.MEDICAL]: "تنويم طبي",
	[InpatientStayKind.SURGICAL]: "ما بعد العملية",
	[InpatientStayKind.ICU]: "عناية مركّزة",
	[InpatientStayKind.ISOLATION]: "عزل",
	[InpatientStayKind.BOARDING]: "إقامة فندقية",
};

export const INPATIENT_ACUITY_LABELS: Record<InpatientAcuity, string> = {
	[InpatientAcuity.LOW]: "مستقرّ",
	[InpatientAcuity.MEDIUM]: "متوسّط",
	[InpatientAcuity.HIGH]: "حرج",
	[InpatientAcuity.CRITICAL]: "حرج جدًا",
};

export const DISCHARGE_KIND_LABELS: Record<DischargeKind, string> = {
	[DischargeKind.ROUTINE]: "خروج طبيعي",
	[DischargeKind.AGAINST_MEDICAL_ADVICE]: "خروج رغم المشورة الطبية",
	[DischargeKind.TRANSFERRED]: "تحويل لمنشأة أخرى",
	[DischargeKind.DIED]: "نفق",
	[DischargeKind.EUTHANIZED]: "تيسير الموت",
};

export const INPATIENT_ORDER_KIND_LABELS: Record<InpatientOrderKind, string> = {
	[InpatientOrderKind.MEDICATION]: "دواء",
	[InpatientOrderKind.FLUID]: "سوائل وريدية",
	[InpatientOrderKind.MONITORING]: "مراقبة وقياس",
	[InpatientOrderKind.FEEDING]: "تغذية",
	[InpatientOrderKind.ACTIVITY]: "نشاط وحركة",
	[InpatientOrderKind.WOUND_CARE]: "عناية بالجرح",
	[InpatientOrderKind.LAB]: "تحليل",
	[InpatientOrderKind.IMAGING]: "تصوير",
	[InpatientOrderKind.OTHER]: "أخرى",
};

// ── المسار والحالات النهائية ───────────────────────────────────────────────

export const INPATIENT_PATHWAY = [
	InpatientStayStatus.REQUESTED,
	InpatientStayStatus.ADMITTED,
	InpatientStayStatus.IN_CARE,
	InpatientStayStatus.DISCHARGE_PENDING,
	InpatientStayStatus.DISCHARGED,
] as const;

export const INPATIENT_TERMINAL_STATUSES = [
	InpatientStayStatus.DISCHARGED,
	InpatientStayStatus.CANCELLED,
] as const;

export const isInpatientTerminalStatus = (status: InpatientStayStatus): boolean =>
	(INPATIENT_TERMINAL_STATUSES as readonly InpatientStayStatus[]).includes(status);

/**
 * الحالات التي يكون فيها الطفل في عهدة الأكاديمية فعلًا — تُحسب في الإشغال، وتظهر
 * على اللوحة، وتُولَّد لها جرعات. «قيد الخروج» منها: الطفل ما زال في قفصه حتى
 * يخرج بالفعل، وحرمانه من جرعته لأن الفاتورة تُحسب خطأ سريري لا إداري.
 */
export const INPATIENT_ACTIVE_STATUSES = [
	InpatientStayStatus.ADMITTED,
	InpatientStayStatus.IN_CARE,
	InpatientStayStatus.DISCHARGE_PENDING,
] as const;

export const isInpatientActive = (status: InpatientStayStatus): boolean =>
	(INPATIENT_ACTIVE_STATUSES as readonly InpatientStayStatus[]).includes(status);

/**
 * ما تعرضه اللوحة تحت «القائمة الآن» — الحالات النشطة **زائدًا الطلب**.
 *
 * الطلب ليس نشطًا (لا يشغل قفصًا ولا يُحسب في الإشغال ولا تُولَّد له جرعات)،
 * لكنّه أوّل ما يجب أن يُرى: طفلٌ ينتظر سريرًا. الفصل بين القائمتين مقصود —
 * `INPATIENT_ACTIVE_STATUSES` تُجيب «من في عهدتنا؟» وهذه تُجيب «ما الذي على
 * اللوحة؟». خلطهما يجعل الطلب يُحتسب في الإشغال، أو يختفي عن أعين من يُسكن.
 */
export const INPATIENT_BOARD_STATUSES = [
	InpatientStayStatus.REQUESTED,
	...INPATIENT_ACTIVE_STATUSES,
] as const;

// ── الانتقالات ─────────────────────────────────────────────────────────────

/**
 * الإلغاء متاح ما دامت الرعاية لم تبدأ — نفس مبدأ إلغاء جلسة التجميل: بعد أن
 * يُعطى دواء أو يُسجَّل قياس صار في الإقامة عملٌ لا يُمحى، فتُنهى بالخروج
 * وتُوثَّق، ولا تُمحى بإلغاء يُخفي ما جرى ويُسقط ما استُهلك من مخزون.
 */
export const canCancelInpatientStay = (status: InpatientStayStatus): boolean =>
	status === InpatientStayStatus.REQUESTED || status === InpatientStayStatus.ADMITTED;

export const INPATIENT_CANCEL_BLOCKED_MESSAGE =
	"لا يمكن إلغاء الإقامة بعد بدء الرعاية — أنهِها بالخروج ووثّق سببه";

/**
 * خطوة واحدة للأمام ضمن المسار، وخطوة واحدة للخلف من «قيد الخروج» وحدها.
 *
 * التراجع من «قيد الخروج» إلى «قيد الرعاية» حالة سريرية حقيقية لا تصحيحُ خطأ:
 * طفل تقرّر خروجه ثم تدهور قبل أن يغادر. بقيّة الاتجاه الخلفي ممنوع — الرجوع
 * من «قيد الرعاية» إلى «دخل» لا يعني شيئًا، والخروج لا يُتراجع عنه بل تُفتح
 * إقامة جديدة (وهو ما يحفظ صدق مدّة الإقامة الأولى في التقارير).
 */
export const canInpatientTransition = (
	from: InpatientStayStatus,
	to: InpatientStayStatus,
): boolean => {
	if (from === to) return false;
	if (isInpatientTerminalStatus(from)) return false;
	if (to === InpatientStayStatus.CANCELLED) return canCancelInpatientStay(from);
	if (from === InpatientStayStatus.DISCHARGE_PENDING && to === InpatientStayStatus.IN_CARE) {
		return true;
	}
	const fromIndex = INPATIENT_PATHWAY.indexOf(from as (typeof INPATIENT_PATHWAY)[number]);
	const toIndex = INPATIENT_PATHWAY.indexOf(to as (typeof INPATIENT_PATHWAY)[number]);
	if (fromIndex < 0 || toIndex < 0) return false;
	return toIndex === fromIndex + 1;
};

export const invalidInpatientTransitionMessage = (
	from: InpatientStayStatus,
	to: InpatientStayStatus,
): string =>
	`لا يمكن نقل الإقامة من "${INPATIENT_STATUS_LABELS[from]}" إلى "${INPATIENT_STATUS_LABELS[to]}"`;

// ── البوابات G1–G7 (الخطة §3) ──────────────────────────────────────────────

export type InpatientGate =
	| "G1_CAGE_ASSIGNED"
	| "G2_ADMISSION_VITALS"
	| "G3_CONSENT"
	| "G4_ISOLATION_PLACEMENT"
	| "G5_NO_ACTIVE_ORDERS"
	| "G6_DISCHARGE_SUMMARY"
	| "G7_INVOICE_SETTLED";

export const INPATIENT_GATE_BLOCKED_MESSAGES: Record<InpatientGate, string> = {
	G1_CAGE_ASSIGNED: "اختر قفصًا للطفل — الإدخال هو فعل الإسكان نفسه",
	G2_ADMISSION_VITALS:
		"سجّل العلامات الحيوية ووزن الدخول أولًا — الجرعات كلّها تُحسب من هذا الوزن",
	G3_CONSENT: "لا يمكن بدء الرعاية قبل توقيع إقرار التنويم",
	G4_ISOLATION_PLACEMENT:
		"إقامة العزل لا تُسكن إلا في قاعة نوعها «عزل» — انقل الطفل قبل المتابعة",
	G5_NO_ACTIVE_ORDERS:
		"توجد أوامر دوائية أو وريدية ما زالت جارية — أنهِها أو أوقفها قبل الخروج",
	G6_DISCHARGE_SUMMARY: "اكتب تقرير الخروج وتعليماته قبل إنهاء الإقامة",
	G7_INVOICE_SETTLED: "لا يمكن إنهاء الإقامة قبل تسوية الفاتورة",
};

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
export const NON_OVERRIDABLE_INPATIENT_GATES = [
	"G4_ISOLATION_PLACEMENT",
	"G5_NO_ACTIVE_ORDERS",
	"G6_DISCHARGE_SUMMARY",
] as const satisfies readonly InpatientGate[];

export const isInpatientGateOverridable = (gate: InpatientGate): boolean =>
	!(NON_OVERRIDABLE_INPATIENT_GATES as readonly InpatientGate[]).includes(gate);

export const INPATIENT_OVERRIDE_REASON_REQUIRED_MESSAGE = "تجاوز بوابة يتطلب تسجيل السبب";

export const inpatientGateNotOverridableMessage = (gate: InpatientGate): string =>
	`${INPATIENT_GATE_BLOCKED_MESSAGES[gate]} — هذه البوابة لا تقبل التجاوز`;

/**
 * طرق الخروج التي تتجاوز بوابتَي الأمر الجاري والفاتورة.
 *
 * إيقاف أوامر طفلٍ نفق عملٌ بلا معنى، وحبسُ تسجيل النفوق على سداد فاتورة
 * قسوةٌ وخطأ بيانات معًا: التأخير يجعل تاريخ الوفاة كذبًا. الفاتورة تبقى قائمة
 * وتُحصَّل بمسارها، وهو ما لا علاقة له بإقفال السجل السريري.
 */
export const DISCHARGE_KINDS_BYPASSING_CLOSURE_GATES = [
	DischargeKind.DIED,
	DischargeKind.EUTHANIZED,
] as const satisfies readonly DischargeKind[];

export const dischargeBypassesClosureGates = (
	kind: DischargeKind | null | undefined,
): boolean =>
	kind != null &&
	(DISCHARGE_KINDS_BYPASSING_CLOSURE_GATES as readonly DischargeKind[]).includes(kind);

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
export const requiredInpatientGates = (
	context: InpatientGateContext = {},
): readonly InpatientGate[] => {
	const gates: InpatientGate[] = ["G1_CAGE_ASSIGNED", "G2_ADMISSION_VITALS"];
	if (context.consentRequired !== false) gates.push("G3_CONSENT");
	if (context.kind === InpatientStayKind.ISOLATION) gates.push("G4_ISOLATION_PLACEMENT");
	const bypass = dischargeBypassesClosureGates(context.dischargeKind);
	if (!bypass) gates.push("G5_NO_ACTIVE_ORDERS");
	gates.push("G6_DISCHARGE_SUMMARY");
	if (context.blockDischargeOnUnpaid !== false && !bypass) gates.push("G7_INVOICE_SETTLED");
	return gates;
};

/**
 * بوابات انتقال بعينه. البوابة تحرس التقدّم وحده: التراجع من «قيد الخروج»
 * إلى «قيد الرعاية» والإلغاء بلا بوابات، إذ لا يجوز أن يُحبس طفل متدهور في
 * عمود لأن الفاتورة لم تُسدَّد.
 */
export const gatesForInpatientTransition = (
	from: InpatientStayStatus,
	to: InpatientStayStatus,
	context: InpatientGateContext = {},
): readonly InpatientGate[] => {
	const fromIndex = INPATIENT_PATHWAY.indexOf(from as (typeof INPATIENT_PATHWAY)[number]);
	const toIndex = INPATIENT_PATHWAY.indexOf(to as (typeof INPATIENT_PATHWAY)[number]);
	if (fromIndex < 0 || toIndex !== fromIndex + 1) return [];
	const required = requiredInpatientGates(context);
	const has = (gate: InpatientGate) => required.includes(gate);
	const gates: InpatientGate[] = [];

	/**
	 * الإسكان بوّابة الدخول لا بوّابة بدء الرعاية.
	 *
	 * «طلب ← دخل» هو فعل الإسكان نفسه: القفص يُختار في تلك الخطوة، فتُستوفى G1
	 * وG4 بإتمامها لا قبلها. أمّا القياس والموافقة فبعد الدخول: لا يُقاس طفل
	 * لم يصل، ولا يُوقَّع إقرار تنويمٍ قد لا يحدث.
	 */
	if (from === InpatientStayStatus.REQUESTED) {
		if (has("G1_CAGE_ASSIGNED")) gates.push("G1_CAGE_ASSIGNED");
		if (has("G4_ISOLATION_PLACEMENT")) gates.push("G4_ISOLATION_PLACEMENT");
	}
	if (from === InpatientStayStatus.ADMITTED) {
		if (has("G2_ADMISSION_VITALS")) gates.push("G2_ADMISSION_VITALS");
		if (has("G3_CONSENT")) gates.push("G3_CONSENT");
	}
	if (from === InpatientStayStatus.IN_CARE && has("G5_NO_ACTIVE_ORDERS")) {
		gates.push("G5_NO_ACTIVE_ORDERS");
	}
	if (from === InpatientStayStatus.DISCHARGE_PENDING) {
		if (has("G6_DISCHARGE_SUMMARY")) gates.push("G6_DISCHARGE_SUMMARY");
		if (has("G7_INVOICE_SETTLED")) gates.push("G7_INVOICE_SETTLED");
	}
	return gates;
};

// ── دورية المراقبة الافتراضية ──────────────────────────────────────────────

/**
 * الدورية الافتراضية بالدقائق من درجة الحرجية. اقتراحٌ يُكتب في الحقل عند
 * الدخول ويبقى قابلًا للتعديل — لا قاعدةً تُفرض: المدرّب قد يطلب كل ساعتين
 * لطفل مستقرّ يراقَب لسبب بعينه.
 *
 * الأرقام هي ما يمارَس فعلًا في عنابر التنويم: العناية المركّزة كل ساعة،
 * والحرج كل ساعتين، والمتوسّط كل أربع، والمستقرّ مرّتين في المناوبة.
 */
export const DEFAULT_MONITORING_INTERVAL_BY_ACUITY: Record<InpatientAcuity, number> = {
	[InpatientAcuity.CRITICAL]: 60,
	[InpatientAcuity.HIGH]: 120,
	[InpatientAcuity.MEDIUM]: 240,
	[InpatientAcuity.LOW]: 480,
};

/** درجة الحرجية الافتراضية المقترحة من نوع الإقامة */
export const DEFAULT_ACUITY_BY_KIND: Record<InpatientStayKind, InpatientAcuity> = {
	[InpatientStayKind.ICU]: InpatientAcuity.CRITICAL,
	[InpatientStayKind.SURGICAL]: InpatientAcuity.HIGH,
	[InpatientStayKind.MEDICAL]: InpatientAcuity.MEDIUM,
	[InpatientStayKind.ISOLATION]: InpatientAcuity.MEDIUM,
	[InpatientStayKind.BOARDING]: InpatientAcuity.LOW,
};

export const defaultMonitoringIntervalMinutes = (
	acuity: InpatientAcuity,
	kind?: InpatientStayKind,
): number => {
	// الإقامة الفندقية لا تُراقَب طبّيًا — القياس فيها استثناء يُطلب لا قاعدة تُجدول
	if (kind === InpatientStayKind.BOARDING) return 720;
	return DEFAULT_MONITORING_INTERVAL_BY_ACUITY[acuity];
};

// ── قواعد الإسكان ──────────────────────────────────────────────────────────

export const ISOLATION_ROOM_TYPE = "ISOLATION" as const;

/**
 * هل يجوز إسكان هذه الإقامة في قاعة بهذا النوع؟
 *
 * قاعدةٌ واحدة صارمة (العزل)، وما عداها تحذير لا منع: عنبر عام ليس مكانًا مثاليًا
 * لحالة عناية مركّزة لكنّه أحيانًا كل ما في الفرع ليلة الجمعة، ومنعُه يدفع الطاقم
 * إلى ألّا يسجّل الإسكان أصلًا — فنخسر الإشغال والتتبّع معًا.
 */
export const isCagePlacementPermitted = (
	stayKind: InpatientStayKind,
	roomType: string,
): boolean => stayKind !== InpatientStayKind.ISOLATION || roomType === ISOLATION_ROOM_TYPE;

export const CAGE_PLACEMENT_BLOCKED_MESSAGE = "لا يمكن إسكان إقامة عزل في قاعة ليست قاعة عزل";

/** أنواع القاعات التي تصلح للتنويم أصلًا — ما عداها لا تُعرض في اختيار القفص */
export const INPATIENT_ROOM_TYPES = ["WARD", "ICU", "ISOLATION"] as const;
