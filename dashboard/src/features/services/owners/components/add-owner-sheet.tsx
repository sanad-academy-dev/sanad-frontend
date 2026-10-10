import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AddPatientDialog } from "@/features/services/owners/components/add-patient-dialog";
import { OWNER_FIELD_LABELS } from "@/features/services/owners/data/constants";
import { DiscardConfirmDialog } from "@/features/services/patients/components/discard-confirm-dialog";
import { useCreateOwner } from "@/features/services/patients/hooks/use-create-owner";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { useFormProgress } from "@/hooks/use-form-progress";
import { createOwnerSchema, type OwnerResponse } from "@sanad/contracts/runtime/server/owners/owners.type";

const addOwnerSheetSchema = createOwnerSchema.extend({
	patientIds: z.array(z.string()).min(1, "يرجى اختيار طفل واحد على الأقل"),
});

type AddOwnerSheetFormInput = z.infer<typeof addOwnerSheetSchema>;

export function AddOwnerSheet({
	open,
	onClose,
	onSuccess,
}: {
	open: boolean;
	onClose: () => void;
	onSuccess?: (owner: OwnerResponse) => void | Promise<void>;
}) {
	const { createOwner, isPending } = useCreateOwner();
	const { patients } = usePatients();
	const [patientSearch, setPatientSearch] = useState("");
	const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
	const [patientDialogOpen, setPatientDialogOpen] = useState(false);
	const [patientComboOpen, setPatientComboOpen] = useState(false);
	const [continueAdding, setContinueAdding] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		getValues,
		setValue,
		formState: { errors },
	} = useForm<AddOwnerSheetFormInput>({
		resolver: zodResolver(addOwnerSheetSchema) as Resolver<AddOwnerSheetFormInput>,
		defaultValues: { active: true, ownerType: "ALL", patientIds: [] },
	});

	useEffect(() => {
		if (!open) {
			reset({ active: true, ownerType: "ALL", patientIds: [] });
			setPatientSearch("");
		}
	}, [open, reset]);

	const values = watch();

	const filledFields = [
		values.name?.trim() ? "name" : null,
		values.gender ? "gender" : null,
		(values.patientIds ?? []).length > 0 ? "patientIds" : null,
		values.phone?.trim() ? "phone" : null,
		values.email?.trim() ? "email" : null,
		values.country?.trim() ? "country" : null,
		values.city?.trim() ? "city" : null,
		values.address?.trim() ? "address" : null,
		values.notes?.trim() ? "notes" : null,
	].filter((f): f is string => f !== null);

	const formProgress = useFormProgress({ schema: addOwnerSheetSchema, values });

	const onSubmit = async (data: AddOwnerSheetFormInput) => {
		const owner = await createOwner(data);
		await onSuccess?.(owner);
		reset({ active: true, ownerType: "ALL", patientIds: [] });
		setPatientSearch("");
		if (continueAdding) return;
		onClose();
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), { enabled: open });

	const handleCloseAttempt = () => {
		if (filledFields.length > 0) {
			setConfirmDiscardOpen(true);
		} else {
			reset();
			setPatientSearch("");
			onClose();
		}
	};

	const handleConfirmDiscard = () => {
		setConfirmDiscardOpen(false);
		reset();
		setPatientSearch("");
		onClose();
	};

	const filteredPatients = patients.filter(
		(p) =>
			p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
			p.code.toLowerCase().includes(patientSearch.toLowerCase()),
	);

	return (
		<>
			<Sheet
				open={open}
				onOpenChange={(isOpen) => {
					if (!isOpen) handleCloseAttempt();
				}}
			>
				<SheetContent
					side="left"
					showCloseButton={false}
					className="w-full sm:max-w-xl! gap-0 flex flex-col p-0"
					onInteractOutside={(e) => {
						if (patientDialogOpen || confirmDiscardOpen) {
							e.preventDefault();
							return;
						}
						e.preventDefault();
						handleCloseAttempt();
					}}
				>
					<FormHeader
						title="إضافة وليّ أمر جديد"
						progress={formProgress}
						onClose={handleCloseAttempt}
					/>

					<form
						id="add-owner-sheet-form"
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4 px-4 py-4 overflow-y-auto flex-1"
						dir="rtl"
					>
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label
									className="text-sm font-medium"
									htmlFor="sheet-owner-name"
								>
									اسم وليّ الأمر
								</Label>
							</FieldLabel>
							<Field data-invalid={!!errors.name}>
								<Input
									id="sheet-owner-name"
									placeholder="مثال: محمد عمر صلاح"
									className="text-sm"
									aria-invalid={!!errors.name}
									disabled={isPending}
									{...register("name")}
								/>
								<FieldError errors={[errors.name]} />
							</Field>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">الجنس</Label>
							<Controller
								name="gender"
								control={control}
								render={({ field }) => (
									<Tabs
										value={field.value ?? ""}
										onValueChange={field.onChange}
									>
										<TabsList className="w-full bg-transparent gap-3">
											<TabsTrigger
												value="MALE"
												className="flex-1 border border-border h-9"
												disabled={isPending}
											>
												ذكر
											</TabsTrigger>
											<TabsTrigger
												value="FEMALE"
												className="flex-1 border border-border h-9"
												disabled={isPending}
											>
												أنثى
											</TabsTrigger>
										</TabsList>
									</Tabs>
								)}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">نوع العميل</Label>
							<Controller
								name="ownerType"
								control={control}
								render={({ field }) => (
									<Select
										value={field.value ?? "ALL"}
										onValueChange={field.onChange}
										disabled={isPending}
									>
										<SelectTrigger
											className="w-full text-sm"
											dir="rtl"
										>
											<SelectValue placeholder="اختر..." />
										</SelectTrigger>
										<SelectContent dir="rtl">
											<SelectItem value="ALL">جميع العملاء</SelectItem>
											<SelectItem value="VIP">العملاء المميزون (VIP)</SelectItem>
											<SelectItem value="LOYALTY">أعضاء برنامج الولاء</SelectItem>
											<SelectItem value="NEW">العملاء الجدد</SelectItem>
											<SelectItem value="CURRENT">العملاء الحاليون</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label className="text-sm font-medium">الأطفال المرتبطون</Label>
							</FieldLabel>
							<Controller
								name="patientIds"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.patientIds}>
										<Combobox
											multiple
											open={patientComboOpen}
											onOpenChange={setPatientComboOpen}
											value={field.value ?? []}
											onValueChange={(val) => field.onChange(val ?? [])}
										>
											<ComboboxChips aria-invalid={!!errors.patientIds}>
												{(field.value ?? []).map((id) => {
													const patient = patients.find((p) => p.id === id);
													return patient ? (
														<ComboboxChip
															key={id}
															value={id}
														>
															{patient.name}
														</ComboboxChip>
													) : null;
												})}
												<ComboboxChipsInput
													placeholder={(field.value ?? []).length ? "" : "ابحث عن طفل..."}
													value={patientSearch}
													onChange={(e) => setPatientSearch(e.target.value)}
													disabled={isPending}
												/>
											</ComboboxChips>
											<ComboboxContent>
												<div className="flex w-full justify-start p-1.5">
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="h-7 w-full gap-1 text-xs"
														disabled={isPending}
														onClick={() => {
															setPatientComboOpen(false);
															setPatientDialogOpen(true);
														}}
													>
														<IconPlus className="size-3.5" />
														إضافة طفل جديد
													</Button>
												</div>
												<ComboboxList>
													{filteredPatients.length === 0 ? (
														<ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
													) : (
														filteredPatients.map((patient) => (
															<ComboboxItem
																key={patient.id}
																value={patient.id}
															>
																<span>{patient.name}</span>
																<span className="text-muted-foreground text-xs ms-auto">
																	{patient.code}
																</span>
															</ComboboxItem>
														))
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
										<FieldError
											errors={[
												errors.patientIds?.root ??
													(errors.patientIds as { message?: string } | undefined),
											]}
										/>
									</Field>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label
										className="text-sm font-medium"
										htmlFor="sheet-owner-phone"
									>
										رقم الجوال
									</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.phone}>
									<Controller
										name="phone"
										control={control}
										render={({ field }) => (
											<PhoneInput
												id="sheet-owner-phone"
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

							<div className="flex flex-col gap-1.5">
								<FieldLabel required>
									<Label
										className="text-sm font-medium"
										htmlFor="sheet-owner-email"
									>
										البريد الإلكتروني
									</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.email}>
									<Input
										id="sheet-owner-email"
										type="email"
										placeholder="example@email.com"
										className="text-sm"
										aria-invalid={!!errors.email}
										disabled={isPending}
										{...register("email")}
									/>
									<FieldError errors={[errors.email]} />
								</Field>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<Label
									className="text-sm font-medium"
									htmlFor="sheet-owner-country"
								>
									الدولة
								</Label>
								<Field data-invalid={!!errors.country}>
									<Input
										id="sheet-owner-country"
										placeholder="مثال: السعودية"
										className="text-sm"
										disabled={isPending}
										{...register("country")}
									/>
									<FieldError errors={[errors.country]} />
								</Field>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label
									className="text-sm font-medium"
									htmlFor="sheet-owner-city"
								>
									المدينة
								</Label>
								<Field data-invalid={!!errors.city}>
									<Input
										id="sheet-owner-city"
										placeholder="مثال: الرياض"
										className="text-sm"
										disabled={isPending}
										{...register("city")}
									/>
									<FieldError errors={[errors.city]} />
								</Field>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								className="text-sm font-medium"
								htmlFor="sheet-owner-address"
							>
								العنوان
							</Label>
							<Field data-invalid={!!errors.address}>
								<Input
									id="sheet-owner-address"
									placeholder="مثال: حي العزيزية"
									className="text-sm"
									disabled={isPending}
									{...register("address")}
								/>
								<FieldError errors={[errors.address]} />
							</Field>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								className="text-sm font-medium"
								htmlFor="sheet-owner-notes"
							>
								ملاحظات
							</Label>
							<Textarea
								id="sheet-owner-notes"
								placeholder="أضف أي ملاحظات..."
								className="text-sm min-h-20 resize-none"
								disabled={isPending}
								{...register("notes")}
							/>
						</div>
					</form>

					<FormFooter
						continueAdding={continueAdding}
						onContinueAddingChange={setContinueAdding}
						disabled={isPending}
					>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleCloseAttempt}
							disabled={isPending}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							form="add-owner-sheet-form"
							size="sm"
							disabled={isPending}
						>
							إضافة وليّ الأمر
						</Button>
					</FormFooter>
				</SheetContent>
			</Sheet>

			<AddPatientDialog
				open={patientDialogOpen}
				onClose={() => setPatientDialogOpen(false)}
				onSuccess={(patientId) => {
					const current = getValues("patientIds") ?? [];
					if (!current.includes(patientId)) {
						setValue("patientIds", [...current, patientId]);
					}
				}}
			/>

			<DiscardConfirmDialog
				open={confirmDiscardOpen}
				filledFields={filledFields}
				fieldLabels={OWNER_FIELD_LABELS}
				resumeLabel="متابعة إضافة وليّ الأمر"
				onDiscard={handleConfirmDiscard}
				onResume={() => setConfirmDiscardOpen(false)}
			/>
		</>
	);
}
