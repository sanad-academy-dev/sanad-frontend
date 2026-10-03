import {
	IconCircleCheck,
	IconCircleDashed,
	IconCircleX,
	IconClockPause,
	IconCopy,
	IconLock,
	IconProgress,
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
	SectionHeading,
	SettingRow,
	SettingsCard,
	UserMultiPicker,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useUpdateBranchSettings } from "@/features/settings/branches/hooks/use-update-branch-settings";
import type { BranchSettings } from "@/server/branches/branches.type";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

// حالات سير عمل المهام (TaskStatus) بترتيب التصميم
const TASK_STATUSES = [
	{
		key: "QUEUE",
		label: "طابور",
		description: "الطابور يجمع المهام والطلبات الجديدة قبل ما تدخل سير العمل.",
		icon: IconClockPause,
		iconClassName: "text-foreground",
	},
	{ key: "PENDING", label: "قيد الإنتظار", icon: IconLock, iconClassName: "text-blue-500" },
	{
		key: "NOT_YET_STARTED",
		label: "لم تبدأ بعد",
		icon: IconCircleDashed,
		iconClassName: "text-muted-foreground",
	},
	{
		key: "IN_PROGRESS",
		label: "قيد التنفيذ",
		icon: IconProgress,
		iconClassName: "text-amber-500",
	},
	{ key: "COMPLETED", label: "تمت", icon: IconCircleCheck, iconClassName: "text-blue-500" },
	{ key: "CANCELLED", label: "ملغاة", icon: IconCircleX, iconClassName: "text-red-500" },
	{ key: "DUPLICATE", label: "مكررة", icon: IconCopy, iconClassName: "text-red-400" },
];

type TaskStatusKey = (typeof TASK_STATUSES)[number]["key"];

export function BranchTasksPage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);
	const { updateSettings, isPending } = useUpdateBranchSettings(branchId);
	const { users } = useClinicUsers();

	// حالة إعادة التسمية: المرحلة المستهدفة + النص المُدخل
	const [renaming, setRenaming] = useState<{ key: TaskStatusKey; value: string } | null>(null);

	if (isLoading || !branch) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-80 w-full rounded-[4px]" />
			</div>
		);
	}

	const settings = parseBranchSettings(branch.settings);
	const update = (patch: Partial<BranchSettings["tasks"]>) =>
		updateSettings({ ...settings, tasks: { ...settings.tasks, ...patch } });

	const statusLabels = settings.tasks.statusLabels;
	const effectiveLabel = (status: (typeof TASK_STATUSES)[number]) =>
		statusLabels[status.key]?.trim() || status.label;

	const saveRename = async () => {
		if (!renaming) return;
		const value = renaming.value.trim();
		const next = { ...statusLabels };
		const original = TASK_STATUSES.find((s) => s.key === renaming.key)?.label;
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
			section="المهام"
		>
			<SectionHeading
				title="المهام"
				description="الطابور يجمع المهام الجديدة قبل ما تدخل سير العمل."
			/>
			<SettingsCard>
				<SettingRow
					title="تفعيل المهام لهذا الفرع"
					description="المهام المضافة للموظفين تُرسل أولًا إلى صندوق الموافقات"
					trailing={
						<Switch
							checked={settings.tasks.enabled}
							disabled={isPending}
							onCheckedChange={(checked) => update({ enabled: checked })}
							aria-label="تفعيل المهام لهذا الفرع"
						/>
					}
				/>
				<SettingRow
					title="السماح بالتعليقات"
					description="تمكن أعضاء الفريق من إضافة تعليقات ومناقشات داخل المهمة."
					trailing={
						<Switch
							checked={settings.tasks.comments}
							disabled={isPending}
							onCheckedChange={(checked) => update({ comments: checked })}
							aria-label="السماح بالتعليقات"
						/>
					}
				/>
				<SettingRow
					title="الإشارات Mention@"
					description="إخطار المستخدمين عند الإشارة إليهم داخل التعليقات أو تحديثات المهمة."
					trailing={
						<Switch
							checked={settings.tasks.mentions}
							disabled={isPending}
							onCheckedChange={(checked) => update({ mentions: checked })}
							aria-label="الإشارات Mention"
						/>
					}
				/>
				<SettingRow
					title="إغلاق المهام تلقائيًا"
					description="إغلاق المهمة الرئيسية المفتوحة تلقائيًا عند إغلاق آخر مهمة فرعية تابعة لها."
					trailing={
						<Switch
							checked={settings.tasks.autoCloseMain}
							disabled={isPending}
							onCheckedChange={(checked) => update({ autoCloseMain: checked })}
							aria-label="إغلاق المهام تلقائيًا"
						/>
					}
				/>
				<SettingRow
					title="إغلاق المهام الفرعية تلقائيًا"
					description="إغلاق جميع المهام الفرعية تلقائيًا عند إغلاق المهمة الرئيسية."
					trailing={
						<Switch
							checked={settings.tasks.autoCloseSub}
							disabled={isPending}
							onCheckedChange={(checked) => update({ autoCloseSub: checked })}
							aria-label="إغلاق المهام الفرعية تلقائيًا"
						/>
					}
				/>
				<SettingRow
					title="إغلاق المهام المتقادمة تلقائيًا"
					description="إغلاق المهام التي لم يتم تحديثها أو إكمالها أو إغلاقها خلال فترة زمنية محددة."
					trailing={
						<Switch
							checked={settings.tasks.autoCloseStale}
							disabled={isPending}
							onCheckedChange={(checked) => update({ autoCloseStale: checked })}
							aria-label="إغلاق المهام المتقادمة تلقائيًا"
						/>
					}
				/>
			</SettingsCard>

			<SectionHeading
				title="مسؤولية المهام"
				description="حدد كيفية التعامل مع المهام الواردة إلى الطابور"
			/>
			<SettingsCard>
				<SettingRow
					title="منشئ المهام"
					description="عند إنشاء مهمة جديدة إلى مهام الفرع من المسؤول عن الموافقة عليها، قم باتخاذ الإجراء التالي"
					trailing={
						<UserMultiPicker
							users={users}
							selectedIds={settings.tasks.creatorIds}
							onChange={(ids) => update({ creatorIds: ids })}
							disabled={isPending}
						/>
					}
				/>
				<SettingRow
					title="الموافقة على المهام"
					description="عند إنشاء مهمة جديدة إلى مهام الفرع من المسؤول عن الموافقة عليها، قم باتخاذ الإجراء التالي"
					trailing={
						<UserMultiPicker
							users={users}
							selectedIds={settings.tasks.approverIds}
							onChange={(ids) => update({ approverIds: ids })}
							disabled={isPending}
						/>
					}
				/>
				<SettingRow
					title="إسناد المهام"
					description="إمكانية إسناد المهمة إلى عدة مستخدمين للعمل عليها بشكل مشترك."
					trailing={
						<UserMultiPicker
							users={users}
							selectedIds={settings.tasks.assigneeIds}
							onChange={(ids) => update({ assigneeIds: ids })}
							disabled={isPending}
						/>
					}
				/>
			</SettingsCard>

			<SectionHeading
				title="حالات سير عمل المهام"
				description="الحالات توضّح المراحل التي تمر بها المهام من البداية وحتى الإنجاز"
			/>
			<SettingsCard>
				{TASK_STATUSES.map((status) => {
					const label = effectiveLabel(status);
					const isRenamed = label !== status.label;
					// الطابور مرحلة نظامية باسم ثابت — لا يُعاد تسميتها
					const editable = status.key !== "QUEUE";
					return (
						<SettingRow
							key={status.key}
							icon={<status.icon className={`size-4 ${status.iconClassName}`} />}
							title={label}
							description={status.description}
							highlighted={status.key === "QUEUE"}
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
							غيّر الاسم الظاهر لهذه المرحلة في سير عمل المهام. اتركه فارغًا لاستعادة الاسم
							الافتراضي.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="task-stage-name"
							className="text-xs font-semibold"
						>
							اسم المرحلة
						</Label>
						<Input
							id="task-stage-name"
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
