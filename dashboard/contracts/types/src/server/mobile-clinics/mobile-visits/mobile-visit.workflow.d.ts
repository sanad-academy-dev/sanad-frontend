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
export declare const DISPATCH_STAGE_LABELS: Record<MobileDispatchStage, string>;
/**
 * الانتقالات المسموحة.
 *
 * الرجوع خطوةً واحدة متاح حتى `IN_SERVICE`: الطاقم يضغط «وصلت» بالخطأ وهو على بُعد شارع،
 * ومنعُ التراجع يدفعه إلى إلغاء الزيارة وإنشاء غيرها — وهو أسوأ بكثير من تصحيح مرحلة.
 * أمّا بعد الاكتمال فلا رجوع: الفاتورة والفحص السريري صارا مرتبطَين بها.
 */
export declare const ALLOWED_STAGE_TRANSITIONS: Record<MobileDispatchStage, readonly MobileDispatchStage[]>;
export declare const TERMINAL_STAGES: readonly ["COMPLETED", "FAILED", "CANCELLED"];
/** المراحل التي يقودها تطبيق المركبة بنفسه (البقيّة من لوحة الإرسال). */
export declare const APP_DRIVEN_STAGES: readonly ["EN_ROUTE", "ARRIVED", "IN_SERVICE", "COMPLETED", "FAILED"];
/** المراحل التي تُلزم ذكر سبب. */
export declare const STAGES_REQUIRING_REASON: readonly ["FAILED"];
export declare function isTerminalStage(stage: MobileDispatchStage): boolean;
export declare function canTransitionStage(from: MobileDispatchStage, to: MobileDispatchStage): boolean;
export declare function invalidStageMessage(from: MobileDispatchStage, to: MobileDispatchStage): string;
/**
 * **العقد بين الطبقتين** (خطة الوحدة §3.3).
 *
 * `COMPLETED` تُقابل `AWAITING_PAYMENT` لا `DONE` عمدًا: بوّابات الإنهاء القائمة في
 * `appointments.dao` (اكتمال الفحص السريري، وتسوية الفاتورة) تبقى كما هي. انتهاء عمل
 * الطاقم في الموقع ليس إذنًا بتخطّيها.
 */
export declare const STAGE_TO_APPOINTMENT_STATUS: Record<MobileDispatchStage, AppointmentStatus>;
/**
 * هل يستلزم الانتقال إلى هذه المرحلة تحريك حالة الزيارة؟
 *
 * لا يُعاد ضبط الحالة إن كانت مطابقة أصلًا — الانتقال بين مراحل تُقابل الحالة نفسها
 * (PENDING → ASSIGNED → EN_ROUTE كلّها SCHEDULED) يجب ألّا يُنتج سطر تدقيق كاذبًا.
 */
export declare function appointmentStatusForStage(stage: MobileDispatchStage, currentStatus: AppointmentStatus): AppointmentStatus | null;
/** انتقال متأخّر وصل من طابور غير متّصل — يُقبل إن كان صالحًا، ويُتجاهل إن سبقته الحقيقة. */
export declare function isStaleStageUpdate(current: MobileDispatchStage, incoming: MobileDispatchStage): boolean;
