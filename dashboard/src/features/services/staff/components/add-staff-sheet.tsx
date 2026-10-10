import { zodResolver } from "@hookform/resolvers/zod";
import { IconUserPlus } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useCreateStaff } from "@/features/services/staff/hooks/use-create-staff";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { useStaffRoles } from "@/features/settings/roles-permissions/hooks/use-staff-roles";
import { useSpecializationsTree } from "@/features/settings/specializations/hooks/use-specializations-tree";
import { useFormProgress } from "@/hooks/use-form-progress";
import { cn } from "@/lib/utils";
import {
	type CreateStaffFormInput,
	createStaffSchema,
	EmploymentType,
	Gender,
	StaffPrefix,
	type StaffResponse,
} from "@sanad/contracts/runtime/server/staff/staff.type";

const PREFIX_LABELS: Record<string, string> = {
	MR: "السيد",
	MRS: "السيدة",
	MS: "الآنسة",
	DR: "د.",
	PROF: "أ.د.",
};

interface AddStaffSheetProps {
	open: boolean;
	onClose: () => void;
	onCreated?: (staff: StaffResponse) => void;
}

export function AddStaffSheet({ open, onClose, onCreated }: AddStaffSheetProps) {
	const { roles, isLoading: rolesLoading } = useStaffRoles();
	const { branches, isLoading: branchesLoading } = useBranches();
	const { tree, isLoading: specsLoading } = useSpecializationsTree();
	const { createStaff, isPending } = useCreateStaff();

	const [continueAdding, setContinueAdding] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm<CreateStaffFormInput>({
		resolver: zodResolver(createStaffSchema) as Resolver<CreateStaffFormInput>,
	});

	const values = watch();
	const formProgress = useFormProgress({ schema: createStaffSchema, values });

	const secondaryOptions =
		tree.find((c) => c.id === values.primarySpecializationId)?.children ?? [];

	const handleClose = () => {
		reset();
		setContinueAdding(false);
		onClose();
	};

	const onSubmit = async (data: CreateStaffFormInput) => {
		const created = await createStaff(data);
		reset();
		if (continueAdding) return;
		if (created && onCreated) {
			onCreated(created);
		} else {
			onClose();
		}
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), { enabled: open });

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) handleClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				dir="rtl"
				className="w-full sm:max-w-xl! gap-0 flex flex-col p-0"
			>
				<FormHeader
					title="إضافة موظف جديد"
					progress={formProgress}
					onClose={handleClose}
				/>

				{/* Form */}
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col flex-1 overflow-y-auto"
				>
					<div className="flex flex-col gap-4 p-4">
						{/* Section: معلومات الموظف */}
						<p className="text-sm font-semibold text-right">معلومات الموظف</p>

						{/* Prefix + Name */}
						<div className="grid grid-cols-[120px_1fr] gap-3">
							<div>
								<Label className="mb-1.5 flex items-center gap-1 text-sm">السمي</Label>
								<Controller
									name="prefix"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.prefix}>
											<Select
												value={field.value ?? ""}
												onValueChange={(v) => field.onChange(v || undefined)}
												disabled={isPending}
												dir="rtl"
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="مثال: دكتور" />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{Object.values(StaffPrefix).map((p) => (
														<SelectItem
															key={p}
															value={p}
														>
															{PREFIX_LABELS[p]}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.prefix]} />
										</Field>
									)}
								/>
							</div>
							<div>
								<FieldLabel required>
									<Label className="mb-1.5 text-sm font-medium">اسم</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.name}>
									<Input
										aria-invalid={!!errors.name}
										placeholder="مثال: د.محمد علي"
										disabled={isPending}
										{...register("name")}
									/>
									<FieldError errors={[errors.name]} />
								</Field>
							</div>
						</div>

						{/* Gender */}
						<div>
							<Label className="mb-1.5 block text-sm text-right">الجنس</Label>
							<Controller
								name="gender"
								control={control}
								render={({ field }) => (
									<div className="grid grid-cols-2 gap-2">
										{(
											[
												{ value: Gender.MALE, label: "ذكر" },
												{ value: Gender.FEMALE, label: "أنثى" },
											] as const
										).map(({ value, label }) => (
											<button
												key={value}
												type="button"
												disabled={isPending}
												onClick={() =>
													field.onChange(field.value === value ? undefined : value)
												}
												className={cn(
													"py-2 rounded border text-sm transition-colors",
													field.value === value
														? "bg-primary text-primary-foreground border-primary"
														: "border-border hover:bg-muted",
												)}
											>
												{label}
											</button>
										))}
									</div>
								)}
							/>
						</div>

						{/* Age + Role */}
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label className="mb-1.5 flex items-center gap-1 text-sm">العمر</Label>
								<Field data-invalid={!!errors.age}>
									<Input
										type="number"
										min={1}
										max={100}
										placeholder="حدد العمر..."
										disabled={isPending}
										{...register("age")}
									/>
									<FieldError errors={[errors.age]} />
								</Field>
							</div>

							<div>
								<FieldLabel required>
									<Label className="mb-1.5 text-sm font-medium">الدور الوظيفي</Label>
								</FieldLabel>
								<Controller
									name="roleId"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.roleId}>
											<Select
												value={field.value ?? ""}
												onValueChange={field.onChange}
												disabled={isPending || rolesLoading}
												dir="rtl"
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="حدد دور الموظف..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{roles.map((r) => (
														<SelectItem
															key={r.id}
															value={r.id}
														>
															{r.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.roleId]} />
										</Field>
									)}
								/>
							</div>
						</div>

						{/* Primary + Secondary Specialization */}
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label className="mb-1.5 flex items-center   gap-1 text-sm">
									التخصص الأساسي
								</Label>
								<Controller
									name="primarySpecializationId"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.primarySpecializationId}>
											<Select
												value={field.value ?? ""}
												onValueChange={(v) => {
													field.onChange(v || undefined);
													setValue("secondarySpecializationId", undefined);
												}}
												disabled={isPending || specsLoading}
												dir="rtl"
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{tree.map((c) => (
														<SelectItem
															key={c.id}
															value={c.id}
														>
															{c.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.primarySpecializationId]} />
										</Field>
									)}
								/>
							</div>

							<div>
								<Label className="mb-1.5 flex items-center   gap-1 text-sm">
									التخصص الفرعي
								</Label>
								<Controller
									name="secondarySpecializationId"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.secondarySpecializationId}>
											<Select
												value={field.value ?? ""}
												onValueChange={(v) => field.onChange(v || undefined)}
												disabled={isPending || specsLoading || !values.primarySpecializationId}
												dir="rtl"
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{secondaryOptions.map((s) => (
														<SelectItem
															key={s.id}
															value={s.id}
														>
															{s.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.secondarySpecializationId]} />
										</Field>
									)}
								/>
							</div>
						</div>

						{/* License Number + Branch */}
						<div className="grid grid-cols-2 gap-3">
							<div>
								<FieldLabel required>
									<Label className="mb-1.5 text-sm font-medium">الفرع</Label>
								</FieldLabel>
								<Controller
									name="branchId"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.branchId}>
											<Select
												value={field.value ?? ""}
												onValueChange={field.onChange}
												disabled={isPending || branchesLoading}
												dir="rtl"
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{branches.map((b) => (
														<SelectItem
															key={b.id}
															value={b.id}
														>
															{b.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.branchId]} />
										</Field>
									)}
								/>
							</div>
							<div>
								<FieldLabel required>
									<Label className="mb-1.5 text-sm font-medium">رقم الترخيص</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.licenseNumber}>
									<Input
										aria-invalid={!!errors.licenseNumber}
										placeholder="مثال: Vet1233443"
										disabled={isPending}
										{...register("licenseNumber")}
									/>
									<FieldError errors={[errors.licenseNumber]} />
								</Field>
							</div>
						</div>

						{/* Employment Type */}
						<div>
							<Label className="mb-1.5 block text-sm text-right">نوع الدوام</Label>
							<Controller
								name="employmentType"
								control={control}
								render={({ field }) => (
									<div className="grid grid-cols-2 gap-2">
										{(
											[
												{ value: EmploymentType.FULL_TIME, label: "دوام كلي" },
												{ value: EmploymentType.PART_TIME, label: "دوام جزئي" },
											] as const
										).map(({ value, label }) => (
											<button
												key={value}
												type="button"
												disabled={isPending}
												onClick={() =>
													field.onChange(field.value === value ? undefined : value)
												}
												className={cn(
													"py-2 rounded border text-sm transition-colors",
													field.value === value
														? "bg-primary text-primary-foreground border-primary"
														: "border-border hover:bg-muted",
												)}
											>
												{label}
											</button>
										))}
									</div>
								)}
							/>
						</div>

						{/* Phone + Email */}
						<div className="grid grid-cols-2 gap-3">
							<div>
								<FieldLabel required>
									<Label className="mb-1.5 text-sm font-medium">رقم الجوال</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.phone}>
									<Controller
										name="phone"
										control={control}
										render={({ field }) => (
											<PhoneInput
												defaultCountry="SA"
												placeholder="05XXXXXXXX"
												aria-invalid={!!errors.phone}
												disabled={isPending}
												value={field.value ?? undefined}
												onChange={(v) => field.onChange(v ?? "")}
											/>
										)}
									/>
									<FieldError errors={[errors.phone]} />
								</Field>
							</div>

							<div>
								<Label className="mb-1.5 flex items-center   gap-1 text-sm">
									البريد الإلكتروني
								</Label>
								<Field data-invalid={!!errors.email}>
									<Input
										type="email"
										aria-invalid={!!errors.email}
										placeholder="مثال: Ep@gmail.com"
										disabled={isPending}
										{...register("email")}
									/>
									<FieldError errors={[errors.email]} />
								</Field>
							</div>
						</div>

						{/* Country + City */}
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label className="mb-1.5 flex items-center   gap-1 text-sm">الدولة</Label>
								<Field data-invalid={!!errors.country}>
									<Input
										placeholder="اختر..."
										disabled={isPending}
										{...register("country")}
									/>
									<FieldError errors={[errors.country]} />
								</Field>
							</div>

							<div>
								<Label className="mb-1.5 flex items-center   gap-1 text-sm">المدينة</Label>
								<Field data-invalid={!!errors.city}>
									<Input
										placeholder="اختر..."
										disabled={isPending}
										{...register("city")}
									/>
									<FieldError errors={[errors.city]} />
								</Field>
							</div>
						</div>

						{/* Address */}
						<div>
							<Label className="mb-1.5 flex items-center   gap-1 text-sm">العنوان</Label>
							<Field data-invalid={!!errors.address}>
								<Input
									placeholder="حي العزيزية"
									disabled={isPending}
									{...register("address")}
								/>
								<FieldError errors={[errors.address]} />
							</Field>
						</div>

						{/* Notes */}
						<div>
							<Label className="mb-1.5 flex items-center   gap-1 text-sm">ملاحظات</Label>
							<Field data-invalid={!!errors.notes}>
								<Textarea
									placeholder="أضف أي ملاحظات..."
									rows={3}
									disabled={isPending}
									{...register("notes")}
								/>
								<FieldError errors={[errors.notes]} />
							</Field>
						</div>
					</div>

					{/* Footer */}
					<FormFooter
						className="mt-auto"
						continueAdding={continueAdding}
						onContinueAddingChange={setContinueAdding}
						disabled={isPending}
					>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleClose}
							disabled={isPending}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isPending}
						>
							<IconUserPlus className="size-3.5" />
							إضافة وإرسال دعوة
						</Button>
					</FormFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
