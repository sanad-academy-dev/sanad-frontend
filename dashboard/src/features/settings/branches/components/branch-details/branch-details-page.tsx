import {
	IconAlertOctagon,
	IconBuildingHospital,
	IconChecklist,
	IconClockPause,
	IconDeviceMobile,
	IconFocus2,
	IconInfoCircle,
	IconMoodSmile,
	IconSettings,
	IconSettingsAutomation,
	IconSitemap,
	IconStethoscope,
	IconTags,
	IconTrash,
	IconUsers,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
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
import { PhoneInput } from "@/components/ui/phone-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import {
	BranchDetailsShell,
	BranchIconPicker,
	ComingSoonPill,
	NavRow,
	SectionHeading,
	SettingRow,
	SettingsCard,
	StatusDot,
	UserMultiPicker,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useDeleteBranch } from "@/features/settings/branches/hooks/use-delete-branch";
import { useSetBranchManagers } from "@/features/settings/branches/hooks/use-set-branch-managers";
import { useUpdateBranch } from "@/features/settings/branches/hooks/use-update-branch";
import { useI18n } from "@/hooks/use-i18n";
import { CITIES } from "@/lib/data/cities";
import { cn } from "@/lib/utils";
import type { BranchWithManager } from "@/server/branches/branches.type";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

const compactInputClassName = "h-8 rounded-lg px-2.5 text-xs";

export function BranchDetailsPage({ branchId }: { branchId: string }) {
	const { branch, isLoading } = useBranch(branchId);

	if (isLoading || !branch) {
		return (
			<div className="mx-auto flex w-full max-w-195 flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-64 w-full rounded-[4px]" />
				<Skeleton className="h-40 w-full rounded-[4px]" />
			</div>
		);
	}

	return <BranchDetailsContent branch={branch} />;
}

function BranchDetailsContent({ branch }: { branch: BranchWithManager }) {
	const navigate = useNavigate();
	const { isRtl: isArabic } = useI18n();
	const { users } = useClinicUsers();
	const { updateBranch, isPending } = useUpdateBranch(branch.id);
	const { setManagers, isPending: managersPending } = useSetBranchManagers(branch.id);
	const { deleteBranch, isPending: deletePending } = useDeleteBranch();

	const [phone, setPhone] = useState(branch.phone ?? "");
	const [deleteOpen, setDeleteOpen] = useState(false);
	// تأكيد تغيير التصنيف — الترقية لرئيسي تُنزِل الرئيسي الحالي تلقائيًا
	const [pendingType, setPendingType] = useState<"PRIMARY" | "SUB" | null>(null);

	const settings = parseBranchSettings(branch.settings);
	const isPrimary = branch.type === "PRIMARY";
	const warehouseEnabled = branch.warehouses.some((w) => w.active);
	const managerIds = branch.managers.map((m) => m.id);
	const staffCount = branch._count.branchUsers;
	const roomsCount = branch._count.rooms;

	const saveText = (field: "name" | "email" | "address", value: string) => {
		const current = (branch[field] ?? "") as string;
		if (value.trim() === current.trim()) return;
		if (field === "name" && !value.trim()) return;
		updateBranch({ [field]: value.trim() || null });
	};

	const branchTitle = `${branch.icon ? `${branch.icon} ` : ""}${branch.name}`;

	return (
		<BranchDetailsShell branchName={branchTitle}>
			{/* ── بيانات الفرع ─────────────────────────────── */}
			<SettingsCard>
				<div className="flex items-start gap-4 border-b py-4">
					<div className="flex flex-1 flex-col gap-1">
						<div className="flex items-center gap-2">
							<Label
								className="text-xs font-semibold"
								htmlFor="branch-name"
							>
								الأيقونة واسم الفرع
							</Label>
							{isPrimary && (
								<span className="flex items-center gap-1 text-[10px] text-amber-600">
									<IconInfoCircle className="size-3" />
									لا يمكن تعديل اسم الفرع الرئيسي
								</span>
							)}
						</div>
						<div className="flex items-start gap-1">
							<BranchIconPicker
								value={branch.icon}
								onChange={(icon) => updateBranch({ icon })}
								disabled={isPending}
								placeholder={<IconMoodSmile className="size-4 text-muted-foreground" />}
							/>
							<Input
								id="branch-name"
								defaultValue={branch.name}
								disabled={isPrimary || isPending}
								className={cn(compactInputClassName, "flex-1")}
								onBlur={(e) => saveText("name", e.target.value)}
							/>
						</div>
					</div>
					<div className="flex w-60 flex-col gap-1">
						<Label
							className="text-xs font-semibold"
							htmlFor="branch-code"
						>
							المعرّف{" "}
							<span className="text-[10px] font-normal text-muted-foreground">
								يُستخدم لتمييز الفرع
							</span>
						</Label>
						<Input
							id="branch-code"
							value={branch.branchCode}
							disabled
							readOnly
							className={cn(compactInputClassName, "bg-muted/50")}
						/>
					</div>
				</div>

				<div className="flex min-h-13 items-center justify-between gap-4 border-b py-3">
					<Label className="shrink-0 text-xs font-semibold">المسؤول</Label>
					<UserMultiPicker
						users={users}
						selectedIds={managerIds}
						onChange={(ids) => setManagers(ids)}
						disabled={managersPending}
					/>
				</div>

				<div className="flex min-h-13 items-center justify-between gap-4 border-b py-3">
					<Label
						className="text-xs font-semibold"
						htmlFor="branch-email"
					>
						البريد الإلكتروني للفرع
					</Label>
					<Input
						id="branch-email"
						type="email"
						defaultValue={branch.email ?? ""}
						placeholder="مثال: info@sanad.com"
						disabled={isPending}
						className={cn(compactInputClassName, "w-64")}
						onBlur={(e) => saveText("email", e.target.value)}
					/>
				</div>

				<div className="flex min-h-13 items-center justify-between gap-4 border-b py-3">
					<Label className="text-xs font-semibold">رقم جوال الفرع</Label>
					<div className="w-64">
						<PhoneInput
							value={phone}
							onChange={(value) => setPhone(value ?? "")}
							onBlur={() => {
								if ((branch.phone ?? "") !== phone) updateBranch({ phone: phone || null });
							}}
							variant="sm"
							disabled={isPending}
						/>
					</div>
				</div>

				<div className="flex min-h-13 items-center justify-between gap-4 border-b py-3">
					<Label className="text-xs font-semibold">المدينه</Label>
					<Select
						value={branch.city ?? undefined}
						onValueChange={(value) => updateBranch({ city: value })}
						disabled={isPending}
						dir={isArabic ? "rtl" : "ltr"}
					>
						<SelectTrigger
							size="sm"
							className="h-8 w-44 rounded-lg px-2.5 text-xs"
						>
							<SelectValue placeholder="اختر المدينة" />
						</SelectTrigger>
						<SelectContent dir={isArabic ? "rtl" : "ltr"}>
							{CITIES.map((city) => (
								<SelectItem
									key={city.value}
									value={city.value}
								>
									{city.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex min-h-13 items-center justify-between gap-4 py-3">
					<Label
						className="text-xs font-semibold"
						htmlFor="branch-address"
					>
						العنوان التفصيلي
					</Label>
					<Input
						id="branch-address"
						defaultValue={branch.address ?? ""}
						placeholder="شارع الملك فهد، حي العليا، الرياض"
						disabled={isPending}
						className={cn(compactInputClassName, "w-64")}
						onBlur={(e) => saveText("address", e.target.value)}
					/>
				</div>
			</SettingsCard>

			{/* ── أقسام الفرع ──────────────────────────────── */}
			<SettingsCard>
				<NavRow
					icon={<IconSettings className="size-4" />}
					title="عام"
					description="تحكم في خصائص وقدرات وأمان فرعك"
					to="/management/settings/branch/$branchId/general"
					params={{ branchId: branch.id }}
				/>
				<NavRow
					icon={<IconUsers className="size-4" />}
					title="الموظفين"
					description="أدر فريق الموظفين والصلاحيات الفرع من هنا"
					meta={
						<span className="text-[11px] text-muted-foreground">
							{staffCount === 1 ? "موظف واحد" : `${staffCount} موظفين`}
						</span>
					}
					to="/management/settings/branch/$branchId/staff"
					params={{ branchId: branch.id }}
				/>
				<NavRow
					icon={<IconBuildingHospital className="size-4" />}
					title="القاعات والمرافق والقدرات"
					description="حدد غرف هذا الفرع وقدراتها ومرافقها داخل المنشأة"
					meta={
						<span className="text-[11px] text-muted-foreground">
							{roomsCount === 1 ? "قاعة واحدة" : `${roomsCount} غرف`}
						</span>
					}
					to="/management/settings/branch/$branchId/rooms"
					params={{ branchId: branch.id }}
				/>
				<NavRow
					icon={<IconStethoscope className="size-4" />}
					title="الدورات"
					description="أدر دورات الفرع من هنا"
					to="/management/settings/branch/$branchId/services"
					params={{ branchId: branch.id }}
				/>
			</SettingsCard>

			{/* ── سير العمل ────────────────────────────────── */}
			<div className="flex flex-col gap-2.5">
				<SectionHeading title="سير العمل" />
				<SettingsCard>
					<NavRow
						icon={<IconClockPause className="size-4" />}
						title="الزيارات والطابور"
						description="الطابور يجمع طلبات الحجز الجديدة قبل ما تدخل سير عمل الزيارة."
						meta={
							<StatusDot
								on={settings.queue.enabled}
								offLabel="إيقاف"
							/>
						}
						to="/management/settings/branch/$branchId/visits"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconFocus2 className="size-4" />}
						title="المهام والطابور"
						description="الطابور يجمع المهام الجديدة قبل ما تدخل سير العمل."
						meta={
							<StatusDot
								on={settings.tasks.enabled}
								offLabel="إيقاف"
							/>
						}
						to="/management/settings/branch/$branchId/tasks"
						params={{ branchId: branch.id }}
					/>
					{/* بروتوكولات العمل القياسية — تخصّ التحاليل والأشعة والعمليات معًا،
					    فمكانها سير العمل لا قسم وحدة بعينها */}
					<NavRow
						icon={<IconChecklist className="size-4" />}
						title="بروتوكولات العمل القياسية (SOP)"
						description="خطوات تنفيذ كل تحليل وفحص أشعة وإجراء جراحي — تظهر لفريق العمل داخل الطلب."
						to="/management/settings/branch/$branchId/sops"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconTags className="size-4" />}
						title="المستودع"
						description="إدارة مخزون وأدوية ومستلزمات الفرع بشكل مستقل."
						meta={
							<StatusDot
								on={warehouseEnabled}
								offLabel="إيقاف"
							/>
						}
						to="/management/settings/branch/$branchId/warehouse"
						params={{ branchId: branch.id }}
					/>
					<NavRow
						icon={<IconSettingsAutomation className="size-4" />}
						title="الأتمتة"
						description="اربط المهام من البداية حتى الإنجاز، خصص الحالات والأتمتة بما يتناسب مع طريقة عملك."
						meta={<ComingSoonPill />}
						disabled
					/>
				</SettingsCard>
			</div>

			{/* ── تطبيق وليّ الأمر ─────────────────────────────── */}
			<div className="flex flex-col gap-2.5">
				<SectionHeading title="تطبيق وليّ الأمر" />
				<SettingsCard>
					<NavRow
						icon={<IconDeviceMobile className="size-4" />}
						title="ما يعرضه التطبيق"
						description="تحكّم في أنواع المعلومات الظاهرة لأصحاب الأطفال في تطبيقهم — السجلّ والتقارير والأسعار"
						to="/management/settings/branch/$branchId/parent-app"
						params={{ branchId: branch.id }}
					/>
				</SettingsCard>
			</div>

			{/* ── تصنيف وحالة الفرع ─────────────────────────── */}
			<div className="flex flex-col gap-2.5">
				<SectionHeading title="حدد تصنيف وحالة الفرع التي تناسبك" />
				<SettingsCard>
					<SettingRow
						icon={<IconSitemap className="size-4" />}
						title="تصنيف الفرع"
						description="حدد دور هذا الفرع وعلاقته بباقي الفروع داخل المنشأة."
						trailing={
							<div className="flex items-center gap-1 rounded-[4px] bg-muted/80 p-0.5">
								{(
									[
										{ value: "PRIMARY", label: "رئيسي" },
										{ value: "SUB", label: "فرعي" },
									] as const
								).map((option) => (
									<button
										type="button"
										key={option.value}
										disabled={isPending || (isPrimary && option.value === "SUB")}
										onClick={() => {
											if (branch.type !== option.value) setPendingType(option.value);
										}}
										className={cn(
											"rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors",
											branch.type === option.value
												? "border bg-background text-foreground shadow-xs"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										{option.label}
									</button>
								))}
							</div>
						}
					/>
					<SettingRow
						icon={<IconAlertOctagon className="size-4" />}
						title="حالة الفرع"
						status={<StatusDot on={branch.active} />}
						trailing={
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={isPending || isPrimary}
								onClick={() => updateBranch({ active: !branch.active })}
								className={cn(
									"h-7 rounded-lg px-3 text-[11px] font-semibold",
									branch.active
										? "text-red-600 hover:text-red-600"
										: "text-green-600 hover:text-green-600",
								)}
							>
								{branch.active ? "تعطيل" : "تفعيل"}
							</Button>
						}
					/>
					<SettingRow
						icon={<IconTrash className="size-4" />}
						title="حذف الفرع"
						description="بمجرد حذف الفرع، سينتقل الفرع للأرشفة ويمكن استعادته من هناك قبل مرور 30 يومًا من تاريخه قبل الحذف النهائي."
						trailing={
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={deletePending || isPrimary}
								onClick={() => setDeleteOpen(true)}
								className="h-7 rounded-lg px-3 text-[11px] font-semibold text-red-600 hover:text-red-600"
							>
								حذف
							</Button>
						}
					/>
				</SettingsCard>
			</div>

			<Dialog
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
			>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>حذف الفرع</DialogTitle>
						<DialogDescription>
							هل أنت متأكد من حذف فرع «{branch.name}»؟ سينتقل الفرع للأرشفة ويمكن استعادته خلال
							30 يومًا.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setDeleteOpen(false)}
						>
							إلغاء
						</Button>
						<Button
							variant="destructive"
							size="sm"
							disabled={deletePending}
							onClick={async () => {
								try {
									await deleteBranch(branch.id);
								} catch {
									return;
								}
								setDeleteOpen(false);
								navigate({ to: "/management/settings/branches-teams" });
							}}
						>
							حذف الفرع
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* تأكيد تغيير تصنيف الفرع */}
			<Dialog
				open={!!pendingType}
				onOpenChange={(open) => {
					if (!open) setPendingType(null);
				}}
			>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>تغيير تصنيف الفرع</DialogTitle>
						<DialogDescription>
							{pendingType === "PRIMARY"
								? `سيصبح فرع «${branch.name}» هو الفرع الرئيسي للمنشأة، وسيتحول الفرع الرئيسي الحالي إلى فرع فرعي تلقائيًا. هل تريد المتابعة؟`
								: `سيتحول فرع «${branch.name}» إلى فرع فرعي ويفقد صلاحيات الفرع الرئيسي. هل تريد المتابعة؟`}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPendingType(null)}
						>
							إلغاء
						</Button>
						<Button
							size="sm"
							disabled={isPending}
							onClick={async () => {
								if (!pendingType) return;
								try {
									await updateBranch({ type: pendingType });
								} catch {
									return;
								}
								setPendingType(null);
							}}
						>
							{pendingType === "PRIMARY" ? "تعيين كفرع رئيسي" : "تحويل لفرع فرعي"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</BranchDetailsShell>
	);
}
