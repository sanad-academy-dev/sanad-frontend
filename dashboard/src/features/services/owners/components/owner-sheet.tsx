import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconPencil,
	IconPlus,
	IconUserPlus,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useState } from "react";
import { Controller, type Resolver, type SubmitHandler, useForm } from "react-hook-form";
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
import { OwnerMembershipBadge } from "@/features/accounting/memberships/components/owner-membership-badge";
import { OwnerOpenBalanceChip } from "@/features/accounting/memberships/components/owner-open-balance-chip";
import { OwnerPointsChip } from "@/features/loyalty/components/owner-points-chip";
import { AddPatientDialog } from "@/features/services/owners/components/add-patient-dialog";
import { OWNER_FIELD_LABELS } from "@/features/services/owners/data/constants";
import { useUpdateOwner } from "@/features/services/owners/hooks/use-update-owner";
import { DiscardConfirmDialog } from "@/features/services/patients/components/discard-confirm-dialog";
import { useCreateOwner } from "@/features/services/patients/hooks/use-create-owner";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { useFormProgress } from "@/hooks/use-form-progress";
import { cn } from "@/lib/utils";
import type { OwnerResponse } from "@/server/owners/owners.type";
import { createOwnerSchema } from "@sanad/contracts/runtime/server/owners/owners.type";

const ownerSheetCreateSchema = createOwnerSchema.extend({
	patientIds: z.array(z.string()).min(1, "يرجى اختيار طفل واحد على الأقل"),
});

type OwnerSheetFormInput = z.infer<typeof createOwnerSchema>;

interface OwnerSheetProps {
	open: boolean;
	onClose: () => void;
	owner?: OwnerResponse | null;
	readOnly?: boolean;
}

export function OwnerSheet({ open, onClose, owner, readOnly = false }: OwnerSheetProps) {
	const isEdit = !!owner && !readOnly;
	const schema = isEdit || readOnly ? createOwnerSchema : ownerSheetCreateSchema;

	const { createOwner, isPending: isCreating } = useCreateOwner();
	const { updateOwner, isPending: isUpdating } = useUpdateOwner();
	const { patients } = usePatients();
	const isPending = isCreating || isUpdating;

	const [patientSearch, setPatientSearch] = useState("");
	const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
	const [patientDialogOpen, setPatientDialogOpen] = useState(false);
	const [patientComboOpen, setPatientComboOpen] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [continueAdding, setContinueAdding] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		getValues,
		setValue,
		formState: { errors, isDirty },
	} = useForm<OwnerSheetFormInput>({
		resolver: zodResolver(schema) as Resolver<OwnerSheetFormInput>,
		defaultValues: owner
			? {
					name: owner.name,
					phone: owner.phone,
					email: owner.email ?? "",
					gender: owner.gender ?? undefined,
					ownerType: owner.ownerType,
					relationship: owner.relationship ?? undefined,
					country: owner.country ?? undefined,
					city: owner.city ?? undefined,
					address: owner.address ?? undefined,
					notes: owner.notes ?? undefined,
					active: owner.active,
					patientIds: owner.patients.map((p) => p.id),
				}
			: { active: true, ownerType: "ALL" as const, patientIds: [] },
	});

	useEffect(() => {
		if (open && owner) {
			reset({
				name: owner.name,
				phone: owner.phone,
				email: owner.email ?? "",
				gender: owner.gender ?? undefined,
				ownerType: owner.ownerType,
				relationship: owner.relationship ?? undefined,
				country: owner.country ?? undefined,
				city: owner.city ?? undefined,
				address: owner.address ?? undefined,
				notes: owner.notes ?? undefined,
				active: owner.active,
				patientIds: owner.patients.map((p) => p.id),
			});
		} else if (!open) {
			reset({ active: true, ownerType: "ALL", patientIds: [] });
			setPatientSearch("");
		}
	}, [open, owner, reset]);

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

	const formProgress = useFormProgress({ schema, values });

	// عدد مرات تعديل السجل المحفوظ في قاعدة البيانات — لا علاقة له بالتغييرات الحالية
	const changesCount = owner?.editsCount ?? 0;

	const filteredPatients = patients.filter(
		(p) =>
			p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
			p.code.toLowerCase().includes(patientSearch.toLowerCase()),
	);

	const handleCloseAttempt = () => {
		if (readOnly) {
			onClose();
			return;
		}
		if (isEdit) {
			if (isDirty) {
				setConfirmDiscardOpen(true);
			} else {
				reset();
				onClose();
			}
			return;
		}
		if (filledFields.length > 0) {
			setConfirmDiscardOpen(true);
		} else {
			reset({ active: true, ownerType: "ALL", patientIds: [] });
			setPatientSearch("");
			onClose();
		}
	};

	const handleConfirmDiscard = () => {
		setConfirmDiscardOpen(false);
		reset({ active: true, ownerType: "ALL", patientIds: [] });
		setPatientSearch("");
		onClose();
	};

	const onSubmit: SubmitHandler<OwnerSheetFormInput> = async (data) => {
		if (isEdit) {
			const { email: _email, ...updateData } = data;
			await updateOwner(owner.id, updateData);
		} else {
			await createOwner(data);
		}
		reset({ active: true, ownerType: "ALL", patientIds: [] });
		setPatientSearch("");
		// «حفظ ومتابعة الإضافة» — متاح في وضع الإضافة فقط
		if (!isEdit && continueAdding) return;
		onClose();
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), {
		enabled: open && !readOnly,
	});

	const title = readOnly
		? "بيانات وليّ الأمر"
		: isEdit
			? "تعديل بيانات وليّ الأمر"
			: "إضافة وليّ أمر جديد";

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
					className={cn(
						"w-full gap-0 flex flex-col p-0 transition-[max-width] duration-200",
						expanded ? "max-w-[50vw]! sm:max-w-[50vw]!" : "max-w-xl! sm:max-w-xl!",
					)}
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
						title={title}
						identity={owner ? { name: owner.name, code: owner.code } : null}
						changesCount={changesCount}
						progress={readOnly ? null : formProgress}
						onClose={handleCloseAttempt}
						actions={
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => setExpanded((v) => !v)}
								aria-label={expanded ? "تصغير" : "توسيع"}
								type="button"
							>
								{expanded ? (
									<IconArrowsDiagonalMinimize2 className="size-4" />
								) : (
									<IconArrowsDiagonal className="size-4" />
								)}
							</Button>
						}
					/>

					<form
						id="owner-sheet-form"
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4 px-4 py-4 overflow-y-auto flex-1"
						dir="rtl"
					>
						{/* [MI-P1] §2.7 — شارة العضوية؛ [MI-P6] ومعها الرصيد المفتوح (قرار MI-P5 §10.3a:
						    المرفوض المُعاد تحميله يعيش ذمةً في الدفتر والفاتورة تبقى مدفوعة) */}
						{owner && <OwnerMembershipBadge ownerId={owner.id} />}
						{owner && <OwnerOpenBalanceChip ownerId={owner.id} />}
						{/* [LY-P1] §10.3 — نقاط الولاء بجوارهما؛ تختفي بلا وحدة أو بلا صلاحية */}
						{owner && <OwnerPointsChip ownerId={owner.id} />}
						<div className="flex flex-col gap-1.5">
							<FieldLabel required={!readOnly}>
								<Label
									className="text-sm font-medium"
									htmlFor="owner-sheet-name"
								>
									اسم وليّ الأمر
								</Label>
							</FieldLabel>
							<Field data-invalid={!!errors.name}>
								<Input
									id="owner-sheet-name"
									placeholder="مثال: محمد عمر صلاح"
									className="text-sm"
									aria-invalid={!!errors.name}
									disabled={isPending || readOnly}
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
										onValueChange={readOnly ? undefined : field.onChange}
									>
										<TabsList className="w-full bg-transparent gap-3">
											<TabsTrigger
												value="MALE"
												className="flex-1 border border-border h-9"
												disabled={isPending || readOnly}
											>
												ذكر
											</TabsTrigger>
											<TabsTrigger
												value="FEMALE"
												className="flex-1 border border-border h-9"
												disabled={isPending || readOnly}
											>
												أنثى
											</TabsTrigger>
										</TabsList>
									</Tabs>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">تصنيف العميل</Label>
								<Controller
									name="ownerType"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value ?? "ALL"}
											onValueChange={readOnly ? undefined : field.onChange}
											disabled={isPending || readOnly}
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
								<FieldLabel required>العلاقة</FieldLabel>
								<Controller
									name="relationship"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value ?? ""}
											onValueChange={readOnly ? undefined : (v) => field.onChange(v || null)}
											disabled={isPending || readOnly}
										>
											<SelectTrigger
												className="w-full text-sm"
												dir="rtl"
											>
												<SelectValue placeholder="اختر..." />
											</SelectTrigger>
											<SelectContent dir="rtl">
												<SelectItem value="OWNER">وليّ أمر</SelectItem>
												<SelectItem value="GUARDIAN">وصي</SelectItem>
												<SelectItem value="DELEGATE">مفوض</SelectItem>
												<SelectItem value="EMERGENCY">جهة اتصال للطوارئ</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<FieldLabel required={!isEdit && !readOnly}>
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
											onValueChange={readOnly ? () => {} : (val) => field.onChange(val ?? [])}
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
												{!readOnly && (
													<ComboboxChipsInput
														placeholder={(field.value ?? []).length ? "" : "ابحث عن طفل..."}
														value={patientSearch}
														onChange={(e) => setPatientSearch(e.target.value)}
														disabled={isPending}
													/>
												)}
											</ComboboxChips>
											{!readOnly && (
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
											)}
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
								<FieldLabel required={!readOnly}>
									<Label
										className="text-sm font-medium"
										htmlFor="owner-sheet-phone"
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
												id="owner-sheet-phone"
												defaultCountry="SA"
												placeholder="05XXXXXXXX"
												aria-invalid={!!errors.phone}
												disabled={isPending || readOnly}
												value={field.value ?? undefined}
												onChange={(v) => field.onChange(v ?? "")}
											/>
										)}
									/>
									<FieldError errors={[errors.phone]} />
								</Field>
							</div>

							<div className="flex flex-col gap-1.5">
								<FieldLabel required={!isEdit && !readOnly}>
									<Label
										className="text-sm font-medium"
										htmlFor="owner-sheet-email"
									>
										البريد الإلكتروني
										{(isEdit || readOnly) && (
											<span className="text-xs text-muted-foreground font-normal me-1">
												(غير قابل للتعديل)
											</span>
										)}
									</Label>
								</FieldLabel>
								<Field data-invalid={!!errors.email}>
									<Input
										id="owner-sheet-email"
										type="email"
										placeholder="example@email.com"
										className="text-sm"
										aria-invalid={!!errors.email}
										disabled={isPending || isEdit || readOnly}
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
									htmlFor="owner-sheet-country"
								>
									الدولة
								</Label>
								<Field data-invalid={!!errors.country}>
									<Input
										id="owner-sheet-country"
										placeholder="مثال: السعودية"
										className="text-sm"
										disabled={isPending || readOnly}
										{...register("country")}
									/>
									<FieldError errors={[errors.country]} />
								</Field>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label
									className="text-sm font-medium"
									htmlFor="owner-sheet-city"
								>
									المدينة
								</Label>
								<Field data-invalid={!!errors.city}>
									<Input
										id="owner-sheet-city"
										placeholder="مثال: الرياض"
										className="text-sm"
										disabled={isPending || readOnly}
										{...register("city")}
									/>
									<FieldError errors={[errors.city]} />
								</Field>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								className="text-sm font-medium"
								htmlFor="owner-sheet-address"
							>
								العنوان
							</Label>
							<Field data-invalid={!!errors.address}>
								<Input
									id="owner-sheet-address"
									placeholder="مثال: حي العزيزية"
									className="text-sm"
									disabled={isPending || readOnly}
									{...register("address")}
								/>
								<FieldError errors={[errors.address]} />
							</Field>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								className="text-sm font-medium"
								htmlFor="owner-sheet-notes"
							>
								ملاحظات
							</Label>
							<Textarea
								id="owner-sheet-notes"
								placeholder="أضف أي ملاحظات..."
								className="text-sm min-h-20 resize-none"
								disabled={isPending || readOnly}
								{...register("notes")}
							/>
						</div>
					</form>

					<FormFooter
						continueAdding={continueAdding}
						onContinueAddingChange={readOnly || isEdit ? undefined : setContinueAdding}
						disabled={isPending}
						showShortcut={!readOnly}
					>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={readOnly ? onClose : handleCloseAttempt}
							disabled={isPending}
						>
							{readOnly ? "إغلاق" : "إلغاء"}
						</Button>
						{!readOnly && (
							<Button
								type="submit"
								form="owner-sheet-form"
								size="sm"
								disabled={isPending}
							>
								{isEdit ? (
									<>
										<IconPencil className="size-3.5" />
										حفظ التعديلات
									</>
								) : (
									<>
										<IconUserPlus className="size-3.5" />
										إضافة وليّ الأمر
									</>
								)}
							</Button>
						)}
					</FormFooter>
				</SheetContent>
			</Sheet>

			{!readOnly && (
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
			)}

			<DiscardConfirmDialog
				open={confirmDiscardOpen}
				filledFields={isEdit ? [] : filledFields}
				fieldLabels={OWNER_FIELD_LABELS}
				resumeLabel={isEdit ? "متابعة التعديل" : "متابعة إضافة وليّ الأمر"}
				onDiscard={handleConfirmDiscard}
				onResume={() => setConfirmDiscardOpen(false)}
			/>
		</>
	);
}
