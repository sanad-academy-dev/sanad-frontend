import {
	IconAmbulance,
	IconBedFlat,
	IconBolt,
	IconCircleCheck,
	IconCircleDashed,
	IconCircleX,
	IconClock,
	IconClockPause,
	IconCreditCard,
	IconLogin2,
	IconPaw,
	IconPlayerPlay,
	IconStethoscope,
} from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import {
	BranchDetailsShell,
	ComingSoonPill,
	SectionHeading,
	SettingRow,
	SettingsCard,
	UserMultiPicker,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useUpdateBranchSettings } from "@/features/settings/branches/hooks/use-update-branch-settings";
import type { BranchSettings } from "@/server/branches/branches.type";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

// حالات سير عمل الزيارة (AppointmentStatus) بترتيب التصميم
const VISIT_STATUSES = [
	{
		key: "WAITING",
		label: "طابور",
		description: "الطابور يجمع طلبات الحجوزات الجديدة قبل ما تدخل سير العمل.",
		icon: IconClockPause,
		iconClassName: "text-foreground",
	},
	{
		key: "SCHEDULED",
		label: "مجدول",
		icon: IconCircleDashed,
		iconClassName: "text-muted-foreground",
	},
	{ key: "CHECK_IN", label: "تسجيل دخول", icon: IconLogin2, iconClassName: "text-blue-500" },
	{
		key: "IN_SERVICE",
		label: "جاري الدورة",
		icon: IconPlayerPlay,
		iconClassName: "text-amber-500",
	},
	{ key: "HOSPITALIZED", label: "تنويم", icon: IconBedFlat, iconClassName: "text-indigo-500" },
	{
		key: "AWAITING_PAYMENT",
		label: "بإنتظار الدفع",
		icon: IconCreditCard,
		iconClassName: "text-blue-500",
	},
	{ key: "DONE", label: "تمت", icon: IconCircleCheck, iconClassName: "text-blue-500" },
	{
		key: "CANCELLED",
		label: "ملغي",
		icon: IconCircleX,
		iconClassName: "text-muted-foreground",
	},
];

type VisitStatusKey = (typeof VISIT_STATUSES)[number]["key"];

export function BranchVisitsPage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);
	const { updateSettings, isPending } = useUpdateBranchSettings(branchId);
	const { users } = useClinicUsers();

	// حالة إعادة التسمية: المرحلة المستهدفة + النص المُدخل
	const [renaming, setRenaming] = useState<{ key: VisitStatusKey; value: string } | null>(
		null,
	);

	if (isLoading || !branch) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-80 w-full rounded-[4px]" />
			</div>
		);
	}

	const settings = parseBranchSettings(branch.settings);
	const update = (patch: Partial<BranchSettings["queue"]>) =>
		updateSettings({ ...settings, queue: { ...settings.queue, ...patch } });
	const updateEmergency = (patch: Partial<BranchSettings["emergency"]>) =>
		updateSettings({ ...settings, emergency: { ...settings.emergency, ...patch } });

	const statusLabels = settings.queue.statusLabels;
	// الاسم الظاهر لمرحلة = التخصيص إن وُجد، وإلا الاسم الافتراضي من التصميم
	const effectiveLabel = (status: (typeof VISIT_STATUSES)[number]) =>
		statusLabels[status.key]?.trim() || status.label;

	const saveRename = async () => {
		if (!renaming) return;
		const value = renaming.value.trim();
		const next = { ...statusLabels };
		const original = VISIT_STATUSES.find((s) => s.key === renaming.key)?.label;
		// نصّ فارغ أو مطابق للافتراضي → أزل التخصيص ليسقط للافتراضي
		if (!value || value === original) delete next[renaming.key];
		else next[renaming.key] = value;
		try {
			await update({ statusLabels: next });
		} catch {
			return;
		}
		setRenaming(null);
	};

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="الزيارات والطابور"
		>
			<SectionHeading
				title="الطابور"
				description="الطابور يجمع طلبات الحجز الجديدة قبل ما تدخل سير عمل الزيارة."
			/>
			<SettingsCard>
				<SettingRow
					title="تفعيل الطابور لهذا الفرع"
					description="الحجوزات المضافة لهذا الفرع من العملاء تُرسل أولًا إلى صندوق الطابور"
					trailing={
						<Switch
							checked={settings.queue.enabled}
							disabled={isPending}
							onCheckedChange={(checked) => update({ enabled: checked })}
							aria-label="تفعيل الطابور لهذا الفرع"
						/>
					}
				/>
				<SettingRow
					title="تفعيل الأولوية الطبية"
					description="يمكن تصنيف الحالات حسب درجة الأولوية لضمان التعامل مع الحالات الأكثر خطورة أولًا."
					trailing={
						<Switch
							checked={settings.queue.medicalPriority}
							disabled={isPending}
							onCheckedChange={(checked) => update({ medicalPriority: checked })}
							aria-label="تفعيل الأولوية الطبية"
						/>
					}
				/>
				<SettingRow
					title="نقل الحالات الطارئة لأعلى الطابور"
					description="وضع الحالات الحرجة تلقائيًا في مقدمة قائمة الطابور لتسريع تقديم الرعاية اللازمة."
					trailing={
						<Switch
							checked={settings.queue.emergencyToFront}
							disabled={isPending}
							onCheckedChange={(checked) => update({ emergencyToFront: checked })}
							aria-label="نقل الحالات الطارئة لأعلى الطابور"
						/>
					}
				/>
				<SettingRow
					title="آلية الاستدعاء الرقمي"
					description="حدد آلية انتقال الزائرين من قائمة الانتظار إلى سير عمل الزيارة (مجدول)."
					trailing={<ComingSoonPill />}
				/>
				<SettingRow
					title="السماح بالتعليقات"
					description="تمكن أعضاء الفريق من إضافة تعليقات ومناقشات داخل الزيارة."
					trailing={<ComingSoonPill />}
				/>
				<SettingRow
					title="الإشارات Mention@"
					description="إخطار المستخدمين عند الإشارة إليهم داخل التعليقات أو تحديثات الزيارة."
					trailing={
						<Switch
							checked={settings.queue.mentions}
							disabled={isPending}
							onCheckedChange={(checked) => update({ mentions: checked })}
							aria-label="الإشارات Mention"
						/>
					}
				/>
			</SettingsCard>

			<SectionHeading
				title="مسؤولية الطابور"
				description="حدد كيفية التعامل مع الحجوزات الواردة إلى الطابور"
			/>
			<SettingsCard>
				<SettingRow
					title="الإجراء"
					description="عند إنشاء حجز زيارة جديدة إلى طابور الفرع من يقوم بالموافقة ودخولها الجدول، قم باتخاذ الإجراء التالي"
					trailing={
						<UserMultiPicker
							users={users}
							selectedIds={settings.queue.responsibleIds}
							onChange={(ids) => update({ responsibleIds: ids })}
							disabled={isPending}
						/>
					}
				/>
			</SettingsCard>

			{/* [E0] الطوارئ والفرز — الخطة: docs/emergency-workflow-plan.md §7.1.
			    موضعها هنا لا في صفحة مستقلّة: الفرز **هو** ترتيب الطابور، وفصلُه عن
			    إعدادات الطابور يجعل مفتاحين متجاورين في المعنى متباعدين في الشاشة. */}
			<SectionHeading
				title="الطوارئ والفرز"
				description="تصنيف لوني خماسي لكل حالة عند الباب، ولكل لون هدف انتظار. مع الإطفاء يبقى «حالة طارئة» مفتاحًا يدويًا على الزيارة كما هو اليوم."
			/>
			<SettingsCard>
				<SettingRow
					icon={<IconAmbulance className="size-4" />}
					title="تفعيل الطوارئ والفرز لهذا الفرع"
					description="يُظهر شاشة الطوارئ ولوحتها، ويتيح تسجيل الوصول وفرز الحالات. فرعٌ لا يدير طوارئ يتركه مطفأً."
					trailing={
						<Switch
							checked={settings.emergency.enabled}
							disabled={isPending}
							onCheckedChange={(checked) => updateEmergency({ enabled: checked })}
							aria-label="تفعيل الطوارئ والفرز"
						/>
					}
				/>
				<SettingRow
					icon={<IconBolt className="size-4" />}
					title="المسار السريع للحالات الحمراء"
					description="الحالة الحمراء تنتقل إلى «جاري الدورة» لحظة فرزها بدل انتظار الطابور. كل انتقال يُسجَّل بسببه في سجلّ الزيارة."
					trailing={
						<Switch
							checked={settings.emergency.redFastWalk}
							disabled={isPending || !settings.emergency.enabled}
							onCheckedChange={(checked) => updateEmergency({ redFastWalk: checked })}
							aria-label="المسار السريع للحالات الحمراء"
						/>
					}
				/>
				<SettingRow
					icon={<IconStethoscope className="size-4" />}
					title="إلزام الفرز قبل بدء الدورة"
					description="يمنع نقل الزيارة إلى «جاري الدورة» قبل تصنيف لونها. اتركه مطفأً ما لم يكن الفرز إجراءً ثابتًا في هذا الفرع."
					trailing={
						<Switch
							checked={settings.emergency.requireTriageBeforeService}
							disabled={isPending || !settings.emergency.enabled}
							onCheckedChange={(checked) =>
								updateEmergency({ requireTriageBeforeService: checked })
							}
							aria-label="إلزام الفرز قبل بدء الدورة"
						/>
					}
				/>
				<SettingRow
					icon={<IconCreditCard className="size-4" />}
					title="تأجيل مطالبة السداد للحالات الحرجة"
					description="إخفاء مطالبة رسم الكشف للأحمر والبرتقالي حتى انتهاء الزيارة. ترتيبُ واجهة فقط — بوابة إقفال الفاتورة لا تُمسّ."
					trailing={
						<Switch
							checked={settings.emergency.deferPaymentUx}
							disabled={isPending || !settings.emergency.enabled}
							onCheckedChange={(checked) => updateEmergency({ deferPaymentUx: checked })}
							aria-label="تأجيل مطالبة السداد"
						/>
					}
				/>
				<SettingRow
					icon={<IconPaw className="size-4" />}
					title="قبول طفل مجهول"
					description="السماح بفتح سجلّ وصول بوصف مؤقّت بلا ملفّ طفل — طفل شارد أو أحضره غريب. تسجيل الطفل يبقى شرطًا لفتح الزيارة."
					trailing={
						<Switch
							checked={settings.emergency.allowUnidentifiedPatients}
							disabled={isPending || !settings.emergency.enabled}
							onCheckedChange={(checked) =>
								updateEmergency({ allowUnidentifiedPatients: checked })
							}
							aria-label="قبول طفل مجهول"
						/>
					}
				/>
				<SettingRow
					icon={<IconClock className="size-4" />}
					title="التنبيه على وصول بلا فرز بعد (دقيقة)"
					description="مدّة بقاء سجلّ الوصول بلا تصنيف قبل أن يُنبَّه مسؤولو الطابور."
					trailing={
						<Input
							type="number"
							min={1}
							max={120}
							disabled={isPending || !settings.emergency.enabled}
							defaultValue={settings.emergency.untriagedAlertMinutes}
							onBlur={(e) => {
								const value = Number(e.target.value);
								if (!Number.isFinite(value) || value < 1 || value > 120) return;
								if (value === settings.emergency.untriagedAlertMinutes) return;
								updateEmergency({ untriagedAlertMinutes: value });
							}}
							className="h-7 w-20 text-center"
							aria-label="دقائق التنبيه على وصول بلا فرز"
						/>
					}
				/>
			</SettingsCard>

			<SectionHeading
				title="حالات سير عمل الزيارات"
				description="الحالات توضّح المراحل التي تمر بها الزيارة من البداية وحتى الإنجاز"
			/>
			<SettingsCard>
				{VISIT_STATUSES.map((status) => {
					const label = effectiveLabel(status);
					const isRenamed = label !== status.label;
					// الطابور مرحلة نظامية باسم ثابت — لا يُعاد تسميتها
					const editable = status.key !== "WAITING";
					return (
						<SettingRow
							key={status.key}
							icon={<status.icon className={`size-4 ${status.iconClassName}`} />}
							title={label}
							description={status.description}
							highlighted={status.key === "WAITING"}
							trailing={
								editable ? (
									<div className="flex items-center gap-2">
										{isRenamed && (
											<span className="text-[10px] text-muted-foreground">
												({status.label})
											</span>
										)}
										<Button
											variant="outline"
											size="sm"
											disabled={isPending}
											onClick={() => setRenaming({ key: status.key, value: label })}
											className="h-6 rounded-lg px-2.5 text-[10px]"
										>
											تعديل
										</Button>
									</div>
								) : undefined
							}
						/>
					);
				})}
			</SettingsCard>

			<Dialog
				open={!!renaming}
				onOpenChange={(open) => {
					if (!open) setRenaming(null);
				}}
			>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>تعديل اسم المرحلة</DialogTitle>
						<DialogDescription>
							غيّر الاسم الظاهر لهذه المرحلة في سير عمل الزيارات. اتركه فارغًا لاستعادة الاسم
							الافتراضي.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="stage-name"
							className="text-xs font-semibold"
						>
							اسم المرحلة
						</Label>
						<Input
							id="stage-name"
							value={renaming?.value ?? ""}
							disabled={isPending}
							onChange={(e) =>
								setRenaming((prev) => (prev ? { ...prev, value: e.target.value } : prev))
							}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									void saveRename();
								}
							}}
							className="text-sm"
						/>
					</div>
					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setRenaming(null)}
						>
							إلغاء
						</Button>
						<Button
							size="sm"
							disabled={isPending}
							onClick={() => void saveRename()}
						>
							حفظ
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</BranchDetailsShell>
	);
}
