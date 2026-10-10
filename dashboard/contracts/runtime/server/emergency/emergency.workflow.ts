import {
	AppointmentStatus,
	ArrivalStatus,
	DispositionKind,
	EmergencyStability,
} from "@/generated/prisma/enums";

/**
 * [E0] آلة حالات الوصول — المصدر الوحيد للانتقالات المسموحة.
 *
 * الخطة الحاكمة: `docs/emergency-workflow-plan.md` §3
 *
 * ── لماذا آلة ثانية أصلًا، والمبدأ يقول «طبقة لا آلة» ──────────────────────
 *
 * لأن هذه ليست آلة للزيارة بل للفترة **التي تسبقها**. آلة الزيارات تشترط مدرّبًا
 * ووقتًا ومدّة، وثلاثتها مجهولة قبل الفرز. فالوصول يعيش في آلته الصغيرة حتى يسدّ
 * الفرز الفجوة، ثم **يسلّم** إلى آلة الزيارات ولا يعود يتكلّم. هذا بالضبط شكل
 * `mobile-visit.workflow.ts`: طبقة لها مراحلها، وعقدٌ مثبَّت باختبار يربط مرحلتها
 * بحالة الزيارة.
 *
 * ملفّ بيانات/دوالّ نقية فقط (بلا db) — يُستورد من الخادم والواجهة معًا.
 */

export const ARRIVAL_STATUS_LABELS: Record<ArrivalStatus, string> = {
	[ArrivalStatus.EN_ROUTE]: "في الطريق",
	[ArrivalStatus.ARRIVED]: "وصل — بانتظار الفرز",
	[ArrivalStatus.TRIAGED]: "فُرز",
	[ArrivalStatus.DISPOSED]: "صدر القرار",
	[ArrivalStatus.LEFT_WITHOUT_TRIAGE]: "غادر قبل الفرز",
	[ArrivalStatus.CANCELLED]: "أُلغي",
};

export const ALLOWED_ARRIVAL_TRANSITIONS: Record<ArrivalStatus, readonly ArrivalStatus[]> = {
	[ArrivalStatus.EN_ROUTE]: [
		ArrivalStatus.ARRIVED,
		ArrivalStatus.CANCELLED,
		// بلاغٌ في الطريق لم يصل أبدًا: يُغلق «غادر قبل الفرز» لا «أُلغي» — الأوّل
		// مؤشّر جودة يُقاس، والثاني خطأ إدخال. الخلط بينهما يُفسد كلا الرقمين.
		ArrivalStatus.LEFT_WITHOUT_TRIAGE,
	],
	[ArrivalStatus.ARRIVED]: [
		ArrivalStatus.TRIAGED,
		ArrivalStatus.LEFT_WITHOUT_TRIAGE,
		ArrivalStatus.CANCELLED,
	],
	// [E5] بعد الفرز تتولّى آلة الزيارات مسار الزيارة، وتبقى للحلقة كلمة واحدة
	// أخيرة: القرار. «قيد العلاج» ليست حالة تُخزَّن هنا — تُشتقّ من `IN_SERVICE`
	// عند القراءة (`emergencyStageOf`)، فلا كتابة مزدوجة تفترق يومًا عن الزيارة.
	[ArrivalStatus.TRIAGED]: [ArrivalStatus.DISPOSED],
	[ArrivalStatus.DISPOSED]: [],
	[ArrivalStatus.LEFT_WITHOUT_TRIAGE]: [],
	[ArrivalStatus.CANCELLED]: [],
};

/**
 * الحالات التي لا تقبل انتقالًا من مسار الوصول. `TRIAGED` **ليست** منها منذ [E5]:
 * هي نهاية مسار الوصول وبداية الحلقة، والقرار هو ما يُقفلها.
 */
export const TERMINAL_ARRIVAL_STATUSES = [
	ArrivalStatus.DISPOSED,
	ArrivalStatus.LEFT_WITHOUT_TRIAGE,
	ArrivalStatus.CANCELLED,
] as const;

/** الحالات التي تظهر على اللوحة — المنتهية تُقرأ من تبويب السجلّ لا من اللوحة */
export const ACTIVE_ARRIVAL_STATUSES = [
	ArrivalStatus.EN_ROUTE,
	ArrivalStatus.ARRIVED,
] as const;

export const isTerminalArrivalStatus = (status: ArrivalStatus): boolean =>
	(TERMINAL_ARRIVAL_STATUSES as readonly ArrivalStatus[]).includes(status);

export const isActiveArrivalStatus = (status: ArrivalStatus): boolean =>
	(ACTIVE_ARRIVAL_STATUSES as readonly ArrivalStatus[]).includes(status);

export const canArrivalTransition = (from: ArrivalStatus, to: ArrivalStatus): boolean =>
	ALLOWED_ARRIVAL_TRANSITIONS[from].includes(to);

export const invalidArrivalTransitionMessage = (
	from: ArrivalStatus,
	to: ArrivalStatus,
): string =>
	`لا يمكن الانتقال من «${ARRIVAL_STATUS_LABELS[from]}» إلى «${ARRIVAL_STATUS_LABELS[to]}»`;

/**
 * عقد التسليم إلى آلة الزيارات — يُثبَّت باختبار (§3.1).
 *
 * وصولٌ حالته `TRIAGED` **يجب** أن يحمل زيارة، وحالة تلك الزيارة يجب أن تكون
 * واحدة من الثلاث التي يمكن أن يكون عليها طفلٌ حاضر في الأكاديمية الآن. أي حالة
 * أخرى تعني أن الوصول والزيارة افترقا، وهو ما لا يجوز أن يمرّ صامتًا.
 */
export const ARRIVAL_HANDOFF_APPOINTMENT_STATUSES = [
	AppointmentStatus.WAITING,
	AppointmentStatus.CHECK_IN,
	AppointmentStatus.IN_SERVICE,
] as const;

export const isValidArrivalHandoff = (
	arrivalStatus: ArrivalStatus,
	appointmentId: string | null,
	appointmentStatus: AppointmentStatus | null,
): boolean => {
	// [E5] حلقةٌ صدر قرارها حملت زيارة حتمًا — بأيّ حالة كانت بعد القرار
	if (arrivalStatus === ArrivalStatus.DISPOSED) return appointmentId != null;
	if (arrivalStatus !== ArrivalStatus.TRIAGED) return true;
	if (!appointmentId || !appointmentStatus) return false;
	return (ARRIVAL_HANDOFF_APPOINTMENT_STATUSES as readonly AppointmentStatus[]).includes(
		appointmentStatus,
	);
};

/**
 * المشي السريع للأحمر (القرار D5).
 *
 * الأحمر لا ينتظر في الطابور: يمشي `WAITING → CHECK_IN → IN_SERVICE` لحظة الفرز.
 * لكنّه **يمشي المسار ولا يقفز فوقه** — كل خطوة انتقالٌ مشروع في
 * `ALLOWED_TRANSITIONS` ويكتب صفّ `STATUS_CHANGED` بسببه. المصفوفة لا تُمسّ، والسجلّ
 * يقول لاحقًا لماذا قطع هذا الطفل الطابور في ثانية واحدة.
 */
export const RED_FAST_WALK_PATH = [
	AppointmentStatus.CHECK_IN,
	AppointmentStatus.IN_SERVICE,
] as const;

export const RED_FAST_WALK_REASON = "RED_FAST_WALK";

// ── رسائل الأخطاء (عربية، تصل العميل عبر `CLIENT_ERROR_NAMES`) ─────────────

export const VET_UNRESOLVED_MESSAGE =
	"لا يمكن تحديد المدرّب المستقبِل: عيّن مدرّبًا افتراضيًا للطوارئ في إعدادات الفرع، " +
	"أو أسنِد وردية اليوم، أو اختر المدرّب يدويًا";

export const TRIAGE_REQUIRED_MESSAGE = "لا يمكن بدء الدورة قبل فرز الحالة";

/**
 * [E5.4] وليّ أمر «طفل بلا وليّ أمر» — القرار D2.
 *
 * `Appointment.ownerId` غير قابل للفراغ: الزيارة تُفوتَر على جهة، وطفلُ الشارع لا
 * جهة له. فلكلّ أكاديمية وليّ أمرٌ واحد بهذا الاسم تُنسَب إليه هذه الحالات، ويظهر في قوائم
 * أولياء الأمور كأيّ وليّ أمر — لا سجلّ خفيّ.
 *
 * **يُنشأ عند أوّل حاجة لا في البذرة**: البذور تُقصَر على قاعدة مأهولة
 * (`ensureGlobalDefaults` تتوقّف مبكرًا)، فأكاديميةٌ أُنشئت بعد البذر كانت ستبقى بلا
 * وليّ أمرٍ للشوارد وتسقط عند أوّل فرز.
 *
 * والهاتف علامةٌ غير قابلة للاتّصال عمدًا: مفتاح التفرّد هو `(clinicId, phone)`،
 * ورقمٌ حقيقيّ المظهر هنا كان سيُرسَل إليه تذكيرٌ أو رسالة يومًا ما.
 */
export const STRAY_OWNER_NAME = "طفل بلا وليّ أمر (طوارئ)";
export const STRAY_OWNER_PHONE = "—";

export const PATIENT_REQUIRED_MESSAGE =
	"سجّل الطفل قبل الفرز — الزيارة لا تُفتح لطفل غير مسجَّل";

export const ARRIVAL_LEFT_REASON_REQUIRED = "سبب المغادرة أو الإلغاء مطلوب";

export const OVERRIDE_REASON_REQUIRED =
	"تغيير اللون المقترح يتطلّب تسجيل السبب — الفارق بين المقترح والمعتمد هو ما يُقاس";

export const NO_DISCRIMINATORS_MESSAGE =
	"اختر مُميِّزًا واحدًا على الأقلّ — اللون يُشتقّ من الفحص لا من الحدس";

// ── [E5] مراحل الحلقة على اللوحة — مشتقّة، لا مخزَّنة ─────────────────────

export const EMERGENCY_STAGES = [
	"EN_ROUTE",
	"UNTRIAGED",
	"TRIAGED_WAITING",
	"IN_TREATMENT",
	"DISPOSED",
] as const;

export type EmergencyStage = (typeof EMERGENCY_STAGES)[number];

export const EMERGENCY_STAGE_LABELS: Record<EmergencyStage, string> = {
	EN_ROUTE: "في الطريق",
	UNTRIAGED: "بانتظار الفرز",
	TRIAGED_WAITING: "مفروز — بانتظار المدرّب",
	IN_TREATMENT: "قيد العلاج",
	DISPOSED: "صدر القرار",
};

/**
 * مرحلة الحلقة من حالتَي الوصول والزيارة معًا.
 *
 * لا عمود للمرحلة عمدًا: المرحلة **قراءةٌ** لحالتين تملكهما آلتان مختلفتان، وتخزينها
 * ثالثةً يعني أن تفترق عنهما ذات يوم بلا أن يلاحظ أحد. الاشتقاق هو ما يجعل اللوحة
 * والزيارة يقولان الشيء نفسه دائمًا.
 */
export const emergencyStageOf = (input: {
	arrivalStatus: ArrivalStatus | null;
	appointmentStatus: AppointmentStatus | null;
	dispositionKind: DispositionKind | null;
}): EmergencyStage => {
	if (input.dispositionKind || input.arrivalStatus === ArrivalStatus.DISPOSED)
		return "DISPOSED";
	if (input.arrivalStatus === ArrivalStatus.EN_ROUTE) return "EN_ROUTE";
	if (input.arrivalStatus === ArrivalStatus.ARRIVED || !input.appointmentStatus) {
		return "UNTRIAGED";
	}
	if (input.appointmentStatus === AppointmentStatus.IN_SERVICE) return "IN_TREATMENT";
	return "TRIAGED_WAITING";
};

// ── [E5] القرار ────────────────────────────────────────────────────────────

export const DISPOSITION_KIND_LABELS: Record<DispositionKind, string> = {
	[DispositionKind.DISCHARGED]: "خروج للمنزل",
	[DispositionKind.ADMITTED]: "طلب تنويم",
	[DispositionKind.TO_SURGERY]: "إلى الجراحة",
	[DispositionKind.TRANSFERRED]: "تحويل لمنشأة أخرى",
	[DispositionKind.LEFT_AGAINST_ADVICE]: "خروج على مسؤولية وليّ الأمر",
	[DispositionKind.DIED]: "نفوق",
	[DispositionKind.EUTHANIZED]: "قتل رحيم",
};

export const DISPOSITION_KIND_ORDER = [
	DispositionKind.DISCHARGED,
	DispositionKind.ADMITTED,
	DispositionKind.TO_SURGERY,
	DispositionKind.TRANSFERRED,
	DispositionKind.LEFT_AGAINST_ADVICE,
	DispositionKind.DIED,
	DispositionKind.EUTHANIZED,
] as const;

export const STABILITY_LABELS: Record<EmergencyStability, string> = {
	[EmergencyStability.STABLE]: "مستقرّ",
	[EmergencyStability.UNSTABLE]: "غير مستقرّ",
	[EmergencyStability.CRITICAL]: "حرج",
};

/**
 * القرار ١: النفوق والقتل الرحيم يتجاوزان بوابة اكتمال الفحص — نفس
 * `DISCHARGE_KINDS_BYPASSING_CLOSURE_GATES` في التنويم. الفحص يُختَم بالمآل، والفاتورة
 * تبقى قائمة وتُحصَّل بمسارها؛ حبسُ تسجيل النفوق على إكمال فحصٍ قسوةٌ وخطأ بيانات
 * معًا (التأخير يجعل وقت الوفاة كذبًا).
 */
export const DISPOSITION_KINDS_BYPASSING_EXAM_GATE = [
	DispositionKind.DIED,
	DispositionKind.EUTHANIZED,
] as const satisfies readonly DispositionKind[];

export const dispositionBypassesExamGate = (kind: DispositionKind): boolean =>
	(DISPOSITION_KINDS_BYPASSING_EXAM_GATE as readonly DispositionKind[]).includes(kind);

/**
 * المآلات التي تُقفل الزيارة إلى «بانتظار الدفع»: ما قُدِّم يُفوتَر. الإدخال والجراحة
 * لا يُقفلان الزيارة — الوحدة المستقبِلة تكمل مسارها منها.
 */
export const DISPOSITION_KINDS_CLOSING_VISIT = [
	DispositionKind.DISCHARGED,
	DispositionKind.TRANSFERRED,
	DispositionKind.LEFT_AGAINST_ADVICE,
	DispositionKind.DIED,
	DispositionKind.EUTHANIZED,
] as const satisfies readonly DispositionKind[];

export const dispositionClosesVisit = (kind: DispositionKind): boolean =>
	(DISPOSITION_KINDS_CLOSING_VISIT as readonly DispositionKind[]).includes(kind);

/**
 * المآلات التي تُقبل والزيارة لم تبدأ خدمتها (ما زالت في الطابور):
 * - المغادرة على مسؤولية وليّ الأمر: تُلغى الزيارة بسبب مسجَّل — لم يُقدَّم شيء.
 * - النفوق والقتل الرحيم: تُمشى الزيارة إلى «جاري الدورة» أوّلًا — نفق في قاعة
 *   الانتظار لا يعني أن الزيارة لم تحدث.
 * الباقي يشترط `IN_SERVICE`: قرارُ خروجٍ أو إدخالٍ لطفل لم يره المدرّب ليس قرارًا.
 */
export const DISPOSITION_KINDS_ALLOWED_BEFORE_SERVICE = [
	DispositionKind.LEFT_AGAINST_ADVICE,
	DispositionKind.DIED,
	DispositionKind.EUTHANIZED,
] as const satisfies readonly DispositionKind[];

export const dispositionAllowedBeforeService = (kind: DispositionKind): boolean =>
	(DISPOSITION_KINDS_ALLOWED_BEFORE_SERVICE as readonly DispositionKind[]).includes(kind);

export const EMERGENCY_DISPOSITION_REASON = "EMERGENCY_DISPOSITION";

/** [E5.5] سبب المشي إلى «جاري الدورة» من لوحة الطوارئ */
export const EMERGENCY_START_TREATMENT_REASON = "EMERGENCY_START_TREATMENT";

export const DISPOSITION_REQUIRES_SERVICE_MESSAGE =
	"ابدأ الدورة قبل القرار — قرارُ خروج أو إدخال لطفل لم يره المدرّب ليس قرارًا";

export const TRANSFER_DESTINATION_REQUIRED_MESSAGE = "اذكر المنشأة المُحوَّل إليها";

export const SURGERY_DETAILS_REQUIRED_MESSAGE =
	"اختر الإجراء الجراحي والجرّاح — حالة العملية لا تُفتح بلا إجراء";

export const ALREADY_DISPOSED_MESSAGE = "صدر قرار هذه الحالة من قبل ولا يُعاد";

export const EPISODE_NOT_FOUND_MESSAGE =
	"لا حلقة طوارئ لهذه الزيارة — افرز الحالة أوّلًا ثم قرّر مآلها";

/** رسالة الرفض إن كان القرار ناقصًا — `null` يعني مقبول */
export const dispositionRequirementError = (input: {
	kind: DispositionKind;
	appointmentStatus: AppointmentStatus;
	transferDestination?: string | null;
	surgery?: { procedureServiceId?: string | null; surgeonStaffId?: string | null } | null;
}): string | null => {
	const inService = input.appointmentStatus === AppointmentStatus.IN_SERVICE;
	if (!inService && !dispositionAllowedBeforeService(input.kind)) {
		return DISPOSITION_REQUIRES_SERVICE_MESSAGE;
	}
	if (input.kind === DispositionKind.TRANSFERRED && !input.transferDestination?.trim()) {
		return TRANSFER_DESTINATION_REQUIRED_MESSAGE;
	}
	if (input.kind === DispositionKind.TO_SURGERY) {
		if (!input.surgery?.procedureServiceId || !input.surgery.surgeonStaffId) {
			return SURGERY_DETAILS_REQUIRED_MESSAGE;
		}
	}
	return null;
};
