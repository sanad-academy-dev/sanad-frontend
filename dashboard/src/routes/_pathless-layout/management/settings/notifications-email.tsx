import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, ContainerRow } from "@/components/common/container";
import { Switch } from "@/components/ui/switch";
import { ReminderAction } from "@/features/settings/notifications/components/reminder-action";
import { useNotifications } from "@/features/settings/notifications/hooks/use-notifications";
import { useUpdateNotifications } from "@/features/settings/notifications/hooks/use-update-notifications";

export const Route = createFileRoute(
	"/_pathless-layout/management/settings/notifications-email",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { notifications, isLoading } = useNotifications();
	const { updateNotifications, isPending } = useUpdateNotifications();
	const disabled = isPending || isLoading;

	return (
		<div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-4 px-6">
			<Container
				title="البريد الإلكتروني"
				description="تخصيص الإشعارات المُرسلة إلى الأطفال."
			>
				<ContainerRow
					title="فعّل إشعارت البريد الإلكتروني"
					subtitle="إرسال إشعار البريد الإلكتروني عبر info@sanad.com."
					action={
						<Switch
							size="sm"
							checked={notifications?.emailEnabled ?? false}
							disabled={disabled}
							onCheckedChange={(checked) => updateNotifications({ emailEnabled: checked })}
						/>
					}
				/>
			</Container>

			<Container
				title="الزيارات"
				description="تلقي تحديثات عن الزيارات والمتابعة مع العملاء. ستذهب الإشعارات دائمًا إلى صندوق الوارد الخاص بك."
			>
				<ContainerRow
					title="حجوزات الزيارة"
					subtitle="وقت التسليم فوري"
					action={
						<Switch
							size="sm"
							checked={notifications?.emailBookings ?? false}
							disabled={disabled}
							onCheckedChange={(checked) => updateNotifications({ emailBookings: checked })}
						/>
					}
				/>

				<ContainerRow
					title="تحديثات الزيارات"
					subtitle="تلقائي فوري"
					action={
						<Switch
							size="sm"
							checked={notifications?.emailAppointmentUpdates ?? false}
							disabled={disabled}
							onCheckedChange={(checked) =>
								updateNotifications({ emailAppointmentUpdates: checked })
							}
						/>
					}
				/>

				<ContainerRow
					title="إلغاءات الزيارات"
					subtitle="تلقائي فوري"
					action={
						<Switch
							size="sm"
							checked={notifications?.emailAppointmentCancellations ?? false}
							disabled={disabled}
							onCheckedChange={(checked) =>
								updateNotifications({ emailAppointmentCancellations: checked })
							}
						/>
					}
				/>
			</Container>

			{/*
			  [RC0] هذه المفاتيح **تُحفظ ولا يقرؤها أيّ مسار إرسال**.
			
			  ليست ملاحظةً نظرية: أعمدة `ClinicNotificationSettings.emailReminder*` كلّها
			  تُكتب من هنا ولا يستهلكها الخادم في أيّ موضع. أي أنّ الأكاديمية تُشغّل
			  «تذكير قبل ٢٤ ساعة» وتغادر الشاشة واثقةً — ولا يحدث شيء أبدًا.
			
			  والوجهة الصحيحة صارت موجودة: وحدة «التذكيرات والاستدعاء» فيها محرّك
			  استحقاق ومُجدوِل وصندوق صادر وقوالب فعليّة. فبدل حذف المفاتيح (وإسقاط ما
			  ضبطته أكاديميات قائمة) أو إبقائها صامتة (وهو الأسوأ)، تُعرَض هنا بلافتة
			  تقول الحقيقة وتدلّ على الشاشة التي تعمل. نقلُ إعداداتها إلى قواعد حقيقية
			  بندٌ مستقلّ يحتاج ترحيلًا وقرار وليّ أمر.
			*/}
			<Container
				title="التذكيرات"
				description="هذه المفاتيح لا تُرسل شيئًا بعد — التذكيرات الفعّالة تُضبط في «التذكيرات والاستدعاء»."
			>
				<div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-amber-900 text-xs dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
					<p className="font-medium">هذه الإعدادات محفوظة لكنّها غير مُفعَّلة.</p>
					<p className="mt-1">
						لا يقرأ الخادم هذه المفاتيح في أيّ مسار إرسال. لضبط تذكيرات تعمل فعلًا — بقواعد
						وقنوات وقوالب ومُجدوِل — افتح{" "}
						<Link
							to="/management/reminders"
							search={{
								tab: "rules",
								q: "",
								trigger: "ALL",
								horizon: "14",
								handled: false,
								status: "ALL",
							}}
							className="font-medium underline underline-offset-2"
						>
							التذكيرات والاستدعاء
						</Link>
						.
					</p>
				</div>

				<ContainerRow
					title="تذكير بالموافقة النهائية"
					subtitle="عند تفعيل هذه الميزة، سيتم تحديد هذا التذكير مسبقًا للزيارات."
					action={
						<ReminderAction
							enabled={notifications?.emailReminderApprovalEnabled ?? false}
							hours={notifications?.emailReminderApprovalHours ?? 24}
							isPending={disabled}
							onEnabledChange={(checked) =>
								updateNotifications({ emailReminderApprovalEnabled: checked })
							}
							onHoursChange={(hours) =>
								updateNotifications({ emailReminderApprovalHours: hours })
							}
						/>
					}
				/>

				<ContainerRow
					title="إشعارات المتابعة"
					subtitle="قبل الزيارة ب 24 ساعة"
					action={
						<ReminderAction
							enabled={notifications?.emailReminderFollowUpEnabled ?? false}
							hours={notifications?.emailReminderFollowUpHours ?? 24}
							isPending={disabled}
							onEnabledChange={(checked) =>
								updateNotifications({ emailReminderFollowUpEnabled: checked })
							}
							onHoursChange={(hours) =>
								updateNotifications({ emailReminderFollowUpHours: hours })
							}
						/>
					}
				/>

				<ContainerRow
					title="تذكيرات حالة الدفع"
					subtitle="قبل الزيارة ب 24 ساعة"
					action={
						<ReminderAction
							enabled={notifications?.emailReminderPaymentEnabled ?? false}
							hours={notifications?.emailReminderPaymentHours ?? 12}
							isPending={disabled}
							onEnabledChange={(checked) =>
								updateNotifications({ emailReminderPaymentEnabled: checked })
							}
							onHoursChange={(hours) =>
								updateNotifications({ emailReminderPaymentHours: hours })
							}
						/>
					}
				/>

				<ContainerRow
					title="إشعارات التعليقات للزيارات"
					subtitle="إرسال إشعار فوري عند حدوث تغييرات أو إشارات داخل الزيارات"
					action={
						<ReminderAction
							enabled={notifications?.emailReminderCommentsEnabled ?? false}
							isPending={disabled}
							onEnabledChange={(checked) =>
								updateNotifications({ emailReminderCommentsEnabled: checked })
							}
						/>
					}
				/>
			</Container>

			<Container
				title="عام"
				description="إرسال تحديثات عن الزيارات والمتابعة مع العملاء. ستذهب الإشعارات دائمًا إلى صندوق الوارد الخاص بك."
			>
				<ContainerRow
					title="الفواتير والإيصالات"
					subtitle="عند تفعيل هذه الميزة، سيتم تحديد هذا التذكير مسبقًا للزيارات."
					action={
						<Switch
							size="sm"
							checked={notifications?.emailInvoices ?? false}
							disabled={disabled}
							onCheckedChange={(checked) => updateNotifications({ emailInvoices: checked })}
						/>
					}
				/>

				<ContainerRow
					title="طلب نموذج"
					subtitle="قبل الزيارة ب 24 ساعة"
					action={
						<Switch
							size="sm"
							checked={notifications?.emailFormRequest ?? false}
							disabled={disabled}
							onCheckedChange={(checked) => updateNotifications({ emailFormRequest: checked })}
						/>
					}
				/>

				<ContainerRow
					title="متابعة طلب النموذج"
					subtitle="إرسال إشعار فوري عند حدوث تغييرات أو إشارات داخل الزيارات"
					action={
						<Switch
							size="sm"
							checked={notifications?.emailFormFollowUp ?? false}
							disabled={disabled}
							onCheckedChange={(checked) =>
								updateNotifications({ emailFormFollowUp: checked })
							}
						/>
					}
				/>

				<ContainerRow
					title="متابعة العلاج"
					subtitle="إرسال إشعار فوري عند حدوث تغييرات أو إشارات داخل الزيارات"
					action={
						<Switch
							size="sm"
							checked={notifications?.emailTreatmentFollowUp ?? false}
							disabled={disabled}
							onCheckedChange={(checked) =>
								updateNotifications({ emailTreatmentFollowUp: checked })
							}
						/>
					}
				/>
			</Container>
		</div>
	);
}
