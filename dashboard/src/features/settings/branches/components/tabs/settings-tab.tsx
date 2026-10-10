import { zodResolver } from "@hookform/resolvers/zod";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Container, ContainerRow } from "@/components/common/container";
import { Badge } from "@/components/ui/badge";
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
import { PhoneInput } from "@/components/ui/phone-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import { BranchUsersTable } from "@/features/settings/branches/components/branch-users-table";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useDeleteBranch } from "@/features/settings/branches/hooks/use-delete-branch";
import { useToggleBranchStatus } from "@/features/settings/branches/hooks/use-toggle-branch-status";
import { useToggleEmergencyNotifications } from "@/features/settings/branches/hooks/use-toggle-emergency-notifications";
import { useUpdateBranch } from "@/features/settings/branches/hooks/use-update-branch";
import type { BranchTabProps } from "@/features/settings/branches/types/tabs.types";
import { CITIES } from "@/lib/data/cities";
import { cn } from "@/lib/utils";
import {
	type UpdateBranchFormInput,
	updateBranchSchema,
} from "@sanad/contracts/runtime/server/branches/branches.type";

const fieldClassName =
	"h-9 rounded-lg border-border/80 bg-background px-3 text-sm shadow-none placeholder:text-muted-foreground/85";
const fieldWrapperClassName = "w-[220px]";

export function SettingsTab({ branchId }: BranchTabProps) {
	const { branch } = useBranch(branchId);
	const { updateBranch, isPending } = useUpdateBranch(branchId);
	const { users } = useClinicUsers();
	const { toggleStatus, isPending: isToggling } = useToggleBranchStatus();
	const { toggleEmergencyNotifications, isPending: isTogglingEmergency } =
		useToggleEmergencyNotifications();
	const { deleteBranch, isPending: isDeleting } = useDeleteBranch();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showGeneralSettings, setShowGeneralSettings] = useState(false);
	const [showTeamSettings, setShowTeamSettings] = useState(false);

	const { register, handleSubmit, control, reset } = useForm<UpdateBranchFormInput>({
		resolver: zodResolver(updateBranchSchema),
		defaultValues: {
			name: "",
			managerId: undefined,
			email: undefined,
			phone: undefined,
			city: undefined,
			address: undefined,
		},
	});

	useEffect(() => {
		if (branch) {
			reset({
				name: branch.name,
				managerId: branch.managerId ?? undefined,
				email: branch.email ?? undefined,
				phone: branch.phone ?? undefined,
				city: branch.city ?? undefined,
				address: branch.address ?? undefined,
			});
		}
	}, [branch, reset]);

	const save = () => {
		if (isPending) return;
		handleSubmit((data) => updateBranch(data))();
	};

	return (
		<TabsContent
			value="settings"
			className="m-0 p-3"
			dir="rtl"
		>
			{showGeneralSettings && (
				<div className="flex flex-col gap-4">
					<Button
						variant="secondary"
						size="sm"
						className="w-fit"
						onClick={() => setShowGeneralSettings(false)}
					>
						<IconChevronRight className="size-4" />
						عودة
					</Button>

					<Container title="عام">
						<ContainerRow
							title="إشعارات الطوارئ"
							subtitle="إرسال تنبيهات فورية للفريق عند وجود حالات حرجة"
							action={
								<Switch
									checked={branch?.emergencyNotifications ?? false}
									disabled={isTogglingEmergency}
									onCheckedChange={(checked) =>
										toggleEmergencyNotifications(branchId, checked)
									}
								/>
							}
						/>
					</Container>
				</div>
			)}

			{showTeamSettings && (
				<div className="flex flex-col gap-4">
					<Button
						variant="secondary"
						size="sm"
						className="w-fit"
						onClick={() => setShowTeamSettings(false)}
					>
						عودة
						<IconChevronLeft className="size-4" />
					</Button>
					<BranchUsersTable branchId={branchId} />
				</div>
			)}

			{!showGeneralSettings && !showTeamSettings && (
				<div className="flex flex-col gap-4">
					<Container title="معلومات الفرع">
						<div className="flex items-center gap-4">
							<ContainerRow
								title="الاسم"
								className="flex-1 flex flex-col items-start gap-2"
								actionClassName="w-full"
								action={
									<Input
										placeholder="اسم الفرع"
										className={cn(fieldClassName, "w-full")}
										{...register("name")}
										onBlur={save}
										disabled={isPending}
									/>
								}
							/>

							<ContainerRow
								title="المعرّف"
								foregroundTitle="يُستخدم لتمييز الفرع"
								className="flex-1 flex flex-col items-start gap-2"
								actionClassName="w-full"
								action={
									<Input
										value={branch?.branchCode ?? ""}
										placeholder="الرمز"
										className={cn(fieldClassName, "w-full text-muted-foreground")}
										disabled
										readOnly
									/>
								}
							/>
						</div>

						<ContainerRow
							title="المسؤول"
							action={
								<Controller
									name="managerId"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value ?? undefined}
											onValueChange={(value) => {
												field.onChange(value);
												save();
											}}
											disabled={isPending}
											dir="rtl"
										>
											<SelectTrigger
												className={cn(fieldClassName, fieldWrapperClassName, "text-right")}
											>
												<SelectValue placeholder="اختر المسؤول" />
											</SelectTrigger>
											<SelectContent
												dir="rtl"
												className="w-fit"
											>
												{users.map((user) => (
													<SelectItem
														key={user.id}
														value={user.id}
														dir="rtl"
														className="text-right"
													>
														{user.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							}
						/>

						<ContainerRow
							title="البريد الإلكتروني"
							action={
								<Input
									type="email"
									placeholder="info@branch.com"
									className={cn(fieldClassName, fieldWrapperClassName)}
									{...register("email", { setValueAs: (v) => v || undefined })}
									onBlur={save}
									disabled={isPending}
								/>
							}
						/>

						<ContainerRow
							title="رقم الجوال"
							action={
								<Controller
									name="phone"
									control={control}
									render={({ field }) => (
										<PhoneInput
											{...field}
											value={field.value ?? undefined}
											defaultCountry="SA"
											placeholder="أدخل رقم الهاتف"
											className={fieldWrapperClassName}
											onBlur={save}
											disabled={isPending}
										/>
									)}
								/>
							}
						/>

						<ContainerRow
							title="المدينة"
							action={
								<Controller
									name="city"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value ?? undefined}
											onValueChange={(value) => {
												field.onChange(value);
												save();
											}}
											disabled={isPending}
											dir="rtl"
										>
											<SelectTrigger
												className={cn(fieldClassName, fieldWrapperClassName, "h-9 text-right")}
											>
												<SelectValue placeholder="اختر المدينة" />
											</SelectTrigger>
											<SelectContent
												dir="rtl"
												className="w-fit"
											>
												{CITIES.map((city) => (
													<SelectItem
														key={city.value}
														value={city.value}
														dir="rtl"
														className="text-right"
													>
														{city.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							}
						/>

						<ContainerRow
							title="العنوان التفصيلي"
							action={
								<Input
									placeholder="العنوان التفصيلي"
									className={cn(fieldClassName, fieldWrapperClassName)}
									{...register("address", { setValueAs: (v) => v || undefined })}
									onBlur={save}
									disabled={isPending}
								/>
							}
						/>
					</Container>

					<Container>
						<ContainerRow
							title="عام"
							subtitle="تحكم في خصائص وقدرات وأمان فرع"
							action={
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowGeneralSettings(!showGeneralSettings)}
								>
									<IconChevronLeft className="size-4" />
								</Button>
							}
						/>

						<ContainerRow
							title="الفريق"
							subtitle="أدر في فريق الفرع من هنا"
							action={
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowTeamSettings(!showTeamSettings)}
								>
									{branch?._count.branchUsers} عضو
									<IconChevronLeft className="size-4" />
								</Button>
							}
						/>
					</Container>

					<Container>
						<ContainerRow
							title="حالة الفرع"
							subtitle="تفعيل أو تعطيل الفرع مؤقتاً دون حذفه"
							badge={
								<Badge variant={branch?.type === "PRIMARY" ? "primary" : "sub"}>
									{branch?.type === "PRIMARY" ? "رئيسي" : "فرعي"}
								</Badge>
							}
							action={
								<Button
									variant="outline"
									size="sm"
									className={branch?.active ? "text-red-500" : "text-emerald-600"}
									disabled={isToggling || branch?.type === "PRIMARY"}
									onClick={() => toggleStatus(branchId, !branch?.active)}
								>
									{branch?.active ? "تعطيل" : "تفعيل"}
								</Button>
							}
						/>

						<ContainerRow
							title="حذف الفرع"
							subtitle="بمجرد حذف الفرع، وسيدخل الفرع الأرشفة يمكن استعادة من هناك قبل مرور 30 يوم من تاريخه قبل الحذف النهائي"
							action={
								<Button
									variant="outline"
									size="sm"
									className="text-red-500"
									onClick={() => setShowDeleteDialog(true)}
									disabled={isDeleting || branch?.type === "PRIMARY"}
								>
									حذف
								</Button>
							}
						/>
					</Container>

					<Dialog
						open={showDeleteDialog}
						onOpenChange={setShowDeleteDialog}
					>
						<DialogContent dir="rtl">
							<DialogHeader>
								<DialogTitle>تأكيد حذف الفرع</DialogTitle>
								<DialogDescription>
									هل أنت متأكد من حذف هذا الفرع؟ سيدخل الفرع الأرشفة ويمكن استعادته خلال 30
									يوماً قبل الحذف النهائي.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => setShowDeleteDialog(false)}
									disabled={isDeleting}
								>
									إلغاء
								</Button>
								<Button
									variant="destructive"
									disabled={isDeleting || branch?.type === "PRIMARY"}
									onClick={async () => {
										await deleteBranch(branchId);
										setShowDeleteDialog(false);
									}}
								>
									{isDeleting ? "جارٍ الحذف..." : "تأكيد الحذف"}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			)}
		</TabsContent>
	);
}
