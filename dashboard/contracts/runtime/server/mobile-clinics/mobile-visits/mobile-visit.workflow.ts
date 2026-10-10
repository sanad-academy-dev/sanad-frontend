import { AppointmentStatus, MobileDispatchStage } from "@/generated/prisma/enums";

/**
 * [MC4.2] آلة حالات الزيارة المتنقلة — نقيّة، بلا قاعدة بيانات، يستوردها الخادم والعميل.
 *
 * **مرحلةٌ فوق حالة، لا حالةٌ منافسة.** `Appointment.status` يبقى المرجع لكل ما يعتمد على
 * الزيارة (الفوترة، الفحص السريري، التقارير)، و`MobileVisit.dispatchStage` طبقةٌ ثانية
 * تصف أين المركبة من هذه المحطّة. نفس شكل `radiology.workflow.ts` (حالة × مرحلة).
 *
 * لماذا لا نكتفي بـ `AppointmentStatus`؟ لأنّ «في الطريق» و«وصلت» لا وجود لهما داخل
 * الأكاديمية، وإضافتهما إلى تعداد تشترك فيه كل الزيارات تُجبر كل شاشة وتقرير على التعامل مع
 * حالتين لا تقعان لها أبدًا.
 *
 * ولماذا لا تُترك المرحلة حرّة؟ لأنّ كل مرحلة تُقابل حالةً واحدة لا لبس فيها، والخريطة
 * أدناه هي العقد: تجاوزها يُنتج زيارةً «وصلت» بينما حالتها «مجدولة».
 */

export const DISPATCH_STAGE_LABELS: Record<MobileDispatchStage, string> = {
	[MobileDispatchStage.PENDING]: "بانتظار الإسناد",
	[MobileDispatchStage.ASSIGNED]: "مُسنَدة",
	[MobileDispatchStage.EN_ROUTE]: "في الطريق",
	[MobileDispatchStage.ARRIVED]: "وصلت",
	[MobileDispatchStage.IN_SERVICE]: "الدورة جارية",
	[MobileDispatchStage.COMPLETED]: "اكتملت",
	[MobileDispatchStage.FAILED]: "تعذّر التنفيذ",
	[MobileDispatchStage.CANCELLED]: "ملغاة",
};

/**
 * الانتقالات المسموحة.
 *
 * الرجوع خطوةً واحدة متاح حتى `IN_SERVICE`: الطاقم يضغط «وصلت» بالخطأ وهو على بُعد شارع،
 * ومنعُ التراجع يدفعه إلى إلغاء الزيارة وإنشاء غيرها — وهو أسوأ بكثير من تصحيح مرحلة.
 * أمّا بعد الاكتمال فلا رجوع: الفاتورة والفحص السريري صارا مرتبطَين بها.
 */
export const ALLOWED_STAGE_TRANSITIONS: Record<
	MobileDispatchStage,
	readonly MobileDispatchStage[]
> = {
	[MobileDispatchStage.PENDING]: [MobileDispatchStage.ASSIGNED, MobileDispatchStage.CANCELLED],
	[MobileDispatchStage.ASSIGNED]: [
		MobileDispatchStage.EN_ROUTE,
		MobileDispatchStage.PENDING, // إلغاء الإسناد يعيدها إلى القائمة غير المسنَدة
		MobileDispatchStage.FAILED,
		MobileDispatchStage.CANCELLED,
	],
	[MobileDispatchStage.EN_ROUTE]: [
		MobileDispatchStage.ARRIVED,
		MobileDispatchStage.ASSIGNED,
		MobileDispatchStage.FAILED,
		MobileDispatchStage.CANCELLED,
	],
	[MobileDispatchStage.ARRIVED]: [
		MobileDispatchStage.IN_SERVICE,
		MobileDispatchStage.EN_ROUTE,
		MobileDispatchStage.FAILED,
		MobileDispatchStage.CANCELLED,
	],
	[MobileDispatchStage.IN_SERVICE]: [
		MobileDispatchStage.COMPLETED,
		MobileDispatchStage.ARRIVED,
		MobileDispatchStage.FAILED,
	],
	// نهائيّة: الفاتورة والسجلّ السريري معلّقان بها
	[MobileDispatchStage.COMPLETED]: [],
	[MobileDispatchStage.FAILED]: [],
	[MobileDispatchStage.CANCELLED]: [],
};

export const TERMINAL_STAGES = [
	MobileDispatchStage.COMPLETED,
	MobileDispatchStage.FAILED,
	MobileDispatchStage.CANCELLED,
] as const;

/** المراحل التي يقودها تطبيق المركبة بنفسه (البقيّة من لوحة الإرسال). */
export const APP_DRIVEN_STAGES = [
	MobileDispatchStage.EN_ROUTE,
	MobileDispatchStage.ARRIVED,
	MobileDispatchStage.IN_SERVICE,
	MobileDispatchStage.COMPLETED,
	MobileDispatchStage.FAILED,
] as const;

/** المراحل التي تُلزم ذكر سبب. */
export const STAGES_REQUIRING_REASON = [MobileDispatchStage.FAILED] as const;

export function isTerminalStage(stage: MobileDispatchStage): boolean {
	return (TERMINAL_STAGES as readonly MobileDispatchStage[]).includes(stage);
}

export function canTransitionStage(
	from: MobileDispatchStage,
	to: MobileDispatchStage,
): boolean {
	if (from === to) return false;
	return ALLOWED_STAGE_TRANSITIONS[from].includes(to);
}

export function invalidStageMessage(
	from: MobileDispatchStage,
	to: MobileDispatchStage,
): string {
	if (from === to) return `الزيارة بالفعل في مرحلة «${DISPATCH_STAGE_LABELS[to]}»`;
	if (isTerminalStage(from)) return `لا يمكن تغيير مرحلة زيارة ${DISPATCH_STAGE_LABELS[from]}`;
	return `لا يمكن الانتقال من «${DISPATCH_STAGE_LABELS[from]}» إلى «${DISPATCH_STAGE_LABELS[to]}»`;
}

/**
 * **العقد بين الطبقتين** (خطة الوحدة §3.3).
 *
 * `COMPLETED` تُقابل `AWAITING_PAYMENT` لا `DONE` عمدًا: بوّابات الإنهاء القائمة في
 * `appointments.dao` (اكتمال الفحص السريري، وتسوية الفاتورة) تبقى كما هي. انتهاء عمل
 * الطاقم في الموقع ليس إذنًا بتخطّيها.
 */
export const STAGE_TO_APPOINTMENT_STATUS: Record<MobileDispatchStage, AppointmentStatus> = {
	[MobileDispatchStage.PENDING]: AppointmentStatus.SCHEDULED,
	[MobileDispatchStage.ASSIGNED]: AppointmentStatus.SCHEDULED,
	[MobileDispatchStage.EN_ROUTE]: AppointmentStatus.SCHEDULED,
	[MobileDispatchStage.ARRIVED]: AppointmentStatus.CHECK_IN,
	[MobileDispatchStage.IN_SERVICE]: AppointmentStatus.IN_SERVICE,
	[MobileDispatchStage.COMPLETED]: AppointmentStatus.AWAITING_PAYMENT,
	[MobileDispatchStage.FAILED]: AppointmentStatus.CANCELLED,
	[MobileDispatchStage.CANCELLED]: AppointmentStatus.CANCELLED,
};

/**
 * هل يستلزم الانتقال إلى هذه المرحلة تحريك حالة الزيارة؟
 *
 * لا يُعاد ضبط الحالة إن كانت مطابقة أصلًا — الانتقال بين مراحل تُقابل الحالة نفسها
 * (PENDING → ASSIGNED → EN_ROUTE كلّها SCHEDULED) يجب ألّا يُنتج سطر تدقيق كاذبًا.
 */
export function appointmentStatusForStage(
	stage: MobileDispatchStage,
	currentStatus: AppointmentStatus,
): AppointmentStatus | null {
	const target = STAGE_TO_APPOINTMENT_STATUS[stage];
	return target === currentStatus ? null : target;
}

/** انتقال متأخّر وصل من طابور غير متّصل — يُقبل إن كان صالحًا، ويُتجاهل إن سبقته الحقيقة. */
export function isStaleStageUpdate(
	current: MobileDispatchStage,
	incoming: MobileDispatchStage,
): boolean {
	if (isTerminalStage(current)) return true;
	return !canTransitionStage(current, incoming);
}
