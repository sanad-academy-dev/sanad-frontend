import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil, IconPlus, IconUserPlus } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useState } from "react";
import { Controller, type Resolver, type SubmitHandler, useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { AddOwnerDialog } from "@/features/services/patients/components/add-owner-dialog";
import { DiscardConfirmDialog } from "@/features/services/patients/components/discard-confirm-dialog";
import { FIELD_LABELS } from "@/features/services/patients/data/constants";
import { useCreatePatient } from "@/features/services/patients/hooks/use-create-patient";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { useUpdatePatient } from "@/features/services/patients/hooks/use-update-patient";
import { useAnimalStrains } from "@/features/settings/animals/hooks/use-animal-strains";
import { useAnimalTypes } from "@/features/settings/animals/hooks/use-animal-types";
import { useFormProgress } from "@/hooks/use-form-progress";
import type { PatientResponse } from "@/server/patients/patients.type";
import {
	type CreatePatientFormInput,
	createPatientSchema,
} from "@sanad/contracts/runtime/server/patients/patients.type";

/** `<input type="date">` لا يقبل إلا YYYY-MM-DD — والقيمة تصل من الخادم ISO كاملة. */
const toDateInput = (value: Date | string | null | undefined) =>
	value ? new Date(value).toISOString().slice(0, 10) : undefined;

interface PatientSheetProps {
	open: boolean;
	onClose: () => void;
	patient?: PatientResponse | null;
	readOnly?: boolean;
}

export function PatientSheet({ open, onClose, patient, readOnly = false }: PatientSheetProps) {
	const isEdit = !!patient && !readOnly;

	const { createPatient, isPending: isCreating } = useCreatePatient();
	const { updatePatient, isPending: isUpdating } = useUpdatePatient();
	const { animalTypes, isLoading: typesLoading } = useAnimalTypes();
	const { strains, isLoading: strainsLoading } = useAnimalStrains();
	const { owners, isLoading: ownersLoading } = useOwners();
	const isPending = isCreating || isUpdating;

	const [ownerDialogOpen, setOwnerDialogOpen] = useState(false);
	const [ownerSelectOpen, setOwnerSelectOpen] = useState(false);
	const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
	const [continueAdding, setContinueAdding] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		setValue,
		formState: { errors, isDirty },
	} = useForm<CreatePatientFormInput>({
		resolver: zodResolver(createPatientSchema) as Resolver<CreatePatientFormInput>,
		defaultValues: patient
			? {
					name: patient.name,
					gender: patient.gender,
					animalTypeId: patient.animalType?.id ?? "",
					animalStrainId: patient.animalStrain?.id ?? undefined,
					ownerId: patient.owner?.id ?? "",
					age: patient.age ?? undefined,
					birthDate: toDateInput(patient.birthDate),
					weight: patient.weight ?? undefined,
					notes: patient.notes ?? undefined,
					active: patient.active,
				}
			: { active: true },
	});

	useEffect(() => {
		if (open && patient) {
			reset({
				name: patient.name,
				gender: patient.gender,
				animalTypeId: patient.animalType?.id ?? "",
				animalStrainId: patient.animalStrain?.id ?? undefined,
				ownerId: patient.owner?.id ?? "",
				age: patient.age ?? undefined,
				birthDate: toDateInput(patient.birthDate),
				weight: patient.weight ?? undefined,
				notes: patient.notes ?? undefined,
				active: patient.active,
			});
		} else if (!open) {
			reset({ active: true });
		}
	}, [open, patient, reset]);

	const values = watch();

	const filledFields = [
		values.name?.trim() ? "name" : null,
		values.gender ? "gender" : null,
		values.animalTypeId ? "animalTypeId" : null,
		values.animalStrainId ? "animalStrainId" : null,
		values.ownerId ? "ownerId" : null,
		values.age != null && values.age !== ("" as unknown as number) ? "age" : null,
		values.birthDate?.trim() ? "birthDate" : null,
		values.weight != null && values.weight !== ("" as unknown as number) ? "weight" : null,
		values.notes?.trim() ? "notes" : null,
	].filter((f): f is string => f !== null);

	const formProgress = useFormProgress({ schema: createPatientSchema, values });

	// عدد مرات تعديل السجل المحفوظ في قاعدة البيانات — لا علاقة له بالتغييرات الحالية
	const changesCount = patient?.editsCount ?? 0;

	const filteredStrains = values.animalTypeId
		? strains.filter((s) => s.animalTypeId === values.animalTypeId)
		: [];

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
			reset({ active: true });
			onClose();
		}
	};

	const handleConfirmDiscard = () => {
		setConfirmDiscardOpen(false);
		reset({ active: true });
		onClose();
	};

	const onSubmit: SubmitHandler<CreatePatientFormInput> = async (data) => {
		if (isEdit) {
			const { ownerId: _ownerId, active: _active, ...updateData } = data;
			await updatePatient(patient.id, updateData);
		} else {
			await createPatient(data);
		}
		reset({ active: true });
		// «حفظ ومتابعة الإضافة» — متاح في وضع الإضافة فقط
		if (!isEdit && continueAdding) return;
		onClose();
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), {
		enabled: open && !readOnly,
	});

	const title = readOnly
		? "بيانات الطفل"
		: isEdit
			? "تعديل بيانات الطفل"
			: "إضافة طفل جديد";

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
						if (ownerDialogOpen || confirmDiscardOpen) {
							e.preventDefault();
							return;
						}
						e.preventDefault();
						handleCloseAttempt();
					}}
				>
					<FormHeader
						title={title}
						identity={patient ? { name: patient.name, code: patient.code } : null}
						changesCount={changesCount}
						progress={readOnly ? null : formProgress}
						onClose={handleCloseAttempt}
					/>

					<form
						id="patient-sheet-form"
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4 px-4 py-4 overflow-y-auto flex-1"
						dir="rtl"
					>
						<div className="flex flex-col gap-1.5">
							<FieldLabel required={!readOnly}>
								<Label
									className="text-sm font-medium"
									htmlFor="patient-sheet-name"
								>
									اسم الطفل
								</Label>
							</FieldLabel>
							<Field data-invalid={!!errors.name}>
								<Input
									id="patient-sheet-name"
									placeholder="مثال: بسبوسة"
									className="text-sm"
									aria-invalid={!!errors.name}
									disabled={isPending || readOnly}
									{...register("name")}
								/>
								<FieldError errors={[errors.name]} />
							</Field>
						</div>

						<div className="flex flex-col gap-1.5">
							<FieldLabel required={!readOnly}>
								<Label className="text-sm font-medium">الجنس</Label>
							</FieldLabel>
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
								<FieldLabel required={!readOnly}>
									<Label className="text-sm font-medium">نوع الطفل</Label>
								</FieldLabel>
								<Controller
									name="animalTypeId"
									control={control}
									render={({ field }) => (
										<Field data-invalid={!!errors.animalTypeId}>
											<Select
												value={field.value ?? ""}
												onValueChange={readOnly ? undefined : field.onChange}
												disabled={typesLoading || isPending || readOnly}
												dir="rtl"
											>
												<SelectTrigger
													aria-invalid={!!errors.animalTypeId}
													className="w-full text-right text-sm"
												>
													<SelectValue placeholder="اختر النوع..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{animalTypes.map((type) => (
														<SelectItem
															key={type.id}
															value={type.id}
															className="text-right"
														>
															{type.arName}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError errors={[errors.animalTypeId]} />
										</Field>
									)}
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">السلالة</Label>
								<Controller
									name="animalStrainId"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value ?? ""}
											onValueChange={readOnly ? undefined : field.onChange}
											disabled={
												!values.animalTypeId || strainsLoading || isPending || readOnly
											}
											dir="rtl"
										>
											<SelectTrigger className="w-full text-right text-sm">
												<SelectValue
													placeholder={
														values.animalTypeId ? "اختر السلالة..." : "اختر النوع أولاً"
													}
												/>
											</SelectTrigger>
											<SelectContent dir="rtl">
												{filteredStrains.map((strain) => (
													<SelectItem
														key={strain.id}
														value={strain.id}
														className="text-right"
													>
														{strain.arName}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<FieldLabel required={!readOnly && !isEdit}>
								<Label className="text-sm font-medium">
									وليّ الأمر
									{isEdit && (
										<span className="text-xs text-muted-foreground font-normal me-1">
											(غير قابل للتعديل)
										</span>
									)}
								</Label>
							</FieldLabel>
							<Controller
								name="ownerId"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.ownerId}>
										<Select
											open={ownerSelectOpen}
											onOpenChange={setOwnerSelectOpen}
											value={field.value ?? ""}
											onValueChange={readOnly || isEdit ? undefined : field.onChange}
											disabled={ownersLoading || isPending || isEdit || readOnly}
											dir="rtl"
										>
											<SelectTrigger
												aria-invalid={!!errors.ownerId}
												className="w-full text-right text-sm"
											>
												<SelectValue placeholder="اختر وليّ الأمر..." />
											</SelectTrigger>
											<SelectContent
												dir="rtl"
												position="popper"
											>
												{!readOnly && !isEdit && (
													<div className="flex w-full justify-start p-1.5">
														<Button
															type="button"
															variant="ghost"
															size="sm"
															className="h-7 w-full gap-1 text-xs"
															disabled={isPending}
															onClick={(e) => {
																e.preventDefault();
																setOwnerSelectOpen(false);
																setOwnerDialogOpen(true);
															}}
														>
															<IconPlus className="size-3.5" />
															إضافة وليّ أمر جديد
														</Button>
													</div>
												)}
												{owners.map((owner) => (
													<SelectItem
														key={owner.id}
														value={owner.id}
														className="text-right"
													>
														<span>{owner.name}</span>
														<span className="text-muted-foreground text-xs ms-1">
															{owner.phone}
														</span>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.ownerId]} />
									</Field>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col gap-1.5">
								<Label
									className="text-sm font-medium"
									htmlFor="patient-sheet-age"
								>
									العمر (سنوات)
								</Label>
								<Field data-invalid={!!errors.age}>
									<Input
										id="patient-sheet-age"
										type="number"
										min={0}
										placeholder="مثال: 3"
										className="text-sm"
										aria-invalid={!!errors.age}
										disabled={isPending || readOnly}
										{...register("age")}
									/>
									<FieldError errors={[errors.age]} />
								</Field>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label
									className="text-sm font-medium"
									htmlFor="patient-sheet-weight"
								>
									الوزن (كيلو)
								</Label>
								<Field data-invalid={!!errors.weight}>
									<Input
										id="patient-sheet-weight"
										type="number"
										min={0}
										step="0.1"
										placeholder="مثال: 4.5"
										className="text-sm"
										aria-invalid={!!errors.weight}
										disabled={isPending || readOnly}
										{...register("weight")}
									/>
									<FieldError errors={[errors.weight]} />
								</Field>
							</div>
						</div>

						{/* تاريخ الميلاد مطلوب — منه وحده تُشتق جدولة التطعيم بالعمر. الملفات
						    القديمة قد تكون بلا تاريخ، فيطلبه أول تعديل ويكتمل الملف عندها. */}
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label
									className="text-sm font-medium"
									htmlFor="patient-sheet-birth-date"
								>
									تاريخ الميلاد
								</Label>
							</FieldLabel>
							<Field data-invalid={!!errors.birthDate}>
								<Input
									id="patient-sheet-birth-date"
									type="date"
									max={new Date().toISOString().slice(0, 10)}
									className="text-sm"
									aria-invalid={!!errors.birthDate}
									disabled={isPending || readOnly}
									{...register("birthDate")}
								/>
								<FieldError errors={[errors.birthDate]} />
							</Field>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								className="text-sm font-medium"
								htmlFor="patient-sheet-notes"
							>
								ملاحظات
							</Label>
							<Textarea
								id="patient-sheet-notes"
								placeholder="أي ملاحظات إضافية..."
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
								form="patient-sheet-form"
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
										أضف الطفل
									</>
								)}
							</Button>
						)}
					</FormFooter>
				</SheetContent>
			</Sheet>

			{!readOnly && !isEdit && (
				<AddOwnerDialog
					open={ownerDialogOpen}
					onClose={() => setOwnerDialogOpen(false)}
					onSuccess={(ownerId) => setValue("ownerId", ownerId)}
				/>
			)}

			<DiscardConfirmDialog
				open={confirmDiscardOpen}
				filledFields={isEdit ? [] : filledFields}
				fieldLabels={FIELD_LABELS}
				resumeLabel={isEdit ? "متابعة التعديل" : "متابعة إضافة الطفل"}
				onDiscard={handleConfirmDiscard}
				onResume={() => setConfirmDiscardOpen(false)}
			/>
		</>
	);
}
