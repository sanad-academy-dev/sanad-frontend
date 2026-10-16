import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CreatePatientFormInput,
	createPatientSchema,
	type PatientResponse,
} from "@sanad/contracts/runtime/server/patients/patients.type";
import { IconLoader2, IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useMemo, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";

import { FormFooter } from "@/components/common/form-footer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AddOwnerDialog } from "@/features/services/patients/components/add-owner-dialog";
import { DiscardConfirmDialog } from "@/features/services/patients/components/discard-confirm-dialog";
import { PatientFormContent } from "@/features/services/patients/components/patient-form-content";
import {
	calculatePatientProgress,
	getPatientFilledFields,
	INITIAL_PATIENT_FORM_VALUES,
	PATIENT_FIELD_LABELS,
	RELATIONSHIP_OPTIONS,
} from "@/features/services/patients/data/patient-form-constants";
import { useCreatePatient } from "@/features/services/patients/hooks/use-create-patient";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { useUpdatePatient } from "@/features/services/patients/hooks/use-update-patient";

export interface AddPatientSheetProps {
	open: boolean;
	onClose: () => void;
	patient?: PatientResponse | null;
	readOnly?: boolean;
	defaultOwnerId?: string;
	onSuccess?: (patient: PatientResponse) => void | Promise<void>;
}

export function AddPatientSheet({
	open,
	onClose,
	patient,
	readOnly = false,
	defaultOwnerId,
	onSuccess,
}: AddPatientSheetProps) {
	const isEdit = Boolean(patient);
	const { owners, isLoading: ownersLoading } = useOwners();
	const { createPatient, isPending: isCreating } = useCreatePatient();
	const { updatePatient, isPending: isUpdating } = useUpdatePatient();
	const isPending = isCreating || isUpdating;

	const [ownerDialogOpen, setOwnerDialogOpen] = useState(false);
	const [ownerSelectOpen, setOwnerSelectOpen] = useState(false);
	const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
	const [continueAdding, setContinueAdding] = useState(false);
	const [showAdvanced, setShowAdvanced] = useState(false);

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
		defaultValues: INITIAL_PATIENT_FORM_VALUES,
	});

	const values = watch();

	useEffect(() => {
		if (!open) return;

		if (patient) {
			const toDateInput = (value: Date | string | null | undefined) => {
				if (!value) return "";
				const d = new Date(value);
				return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
			};

			const normalizeRelationship = (rel?: string | null) => {
				if (!rel) return "FATHER";
				const found = RELATIONSHIP_OPTIONS.find((r) => r.value === rel || r.label === rel);
				return found ? found.value : rel;
			};

			reset({
				name: patient.name ?? "",
				birthDate: toDateInput(patient.birthDate),
				nationalId: patient.nationalId ?? "",
				gender: patient.gender ?? "MALE",
				classroom: patient.classroom ?? "النجوم",
				ownerId: patient.owner?.id ?? "",
				guardianName: patient.guardianName || patient.owner?.name || "",
				guardianPhone: patient.guardianPhone || patient.owner?.phone || "",
				guardianEmail: patient.guardianEmail || patient.owner?.email || "",
				guardianRelationship: normalizeRelationship(patient.guardianRelationship),
				emergencyContactName: patient.emergencyContactName ?? "",
				emergencyContactPhone: patient.emergencyContactPhone ?? "",
				pocketMoneyEnabled: patient.pocketMoneyEnabled !== false,
				transportation: patient.transportation ?? "",
				feeType: patient.feeType ?? "",
				bloodType: patient.bloodType ?? "A+",
				developmentStatus: patient.developmentStatus ?? "NORMAL",
				allergies: patient.allergies ?? "لا يوجد",
				healthConditions: patient.healthConditions ?? "",
				previousNursery: patient.previousNursery ?? "",
				notes: patient.notes ?? "",
				active: patient.active ?? true,
				status: patient.status ?? "ACTIVE",
			});

			if (
				patient.transportation ||
				patient.feeType ||
				patient.previousNursery ||
				patient.notes
			) {
				setShowAdvanced(true);
			}
		} else {
			reset({
				...INITIAL_PATIENT_FORM_VALUES,
				ownerId: defaultOwnerId ?? "",
			});
			setShowAdvanced(false);

			if (defaultOwnerId) {
				const found = owners.find((o) => o.id === defaultOwnerId);
				if (found) {
					setValue("guardianName", found.name, { shouldValidate: true });
					if (found.phone) setValue("guardianPhone", found.phone, { shouldValidate: true });
					if (found.email) setValue("guardianEmail", found.email);
				}
			}
		}
	}, [defaultOwnerId, open, patient, owners, reset, setValue]);

	// حساب نسبة الحقول المطلوبة (6 حقول رئيسية مطابقة للتصميم)
	const requiredFieldsProgress = useMemo(() => calculatePatientProgress(values), [values]);

	const filledFields = useMemo(() => getPatientFilledFields(values), [values]);

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
		if (filledFields.length > 2) {
			setConfirmDiscardOpen(true);
		} else {
			reset();
			onClose();
		}
	};

	const handleConfirmDiscard = () => {
		setConfirmDiscardOpen(false);
		reset();
		onClose();
	};

	const onSubmit = async (data: CreatePatientFormInput) => {
		// اشتقاق العمر بالسنوات تلقائياً من تاريخ الميلاد
		let age: number | undefined;
		if (data.birthDate) {
			const b = new Date(data.birthDate);
			if (!Number.isNaN(b.getTime())) {
				const now = new Date();
				age = Math.max(0, now.getFullYear() - b.getFullYear());
			}
		}

		if (isEdit && patient) {
			const { active: _active, ...updateData } = data;
			const updated = await updatePatient(patient.id, {
				...updateData,
				ownerId: data.ownerId || undefined,
				age,
			});
			await onSuccess?.(updated as unknown as PatientResponse);
			reset();
			onClose();
		} else {
			const created = await createPatient({
				...data,
				age,
			});
			await onSuccess?.(created);
			reset();
			if (continueAdding) return;
			onClose();
		}
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), {
		enabled: open && !readOnly,
		conflictBehavior: "replace",
	});

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
					className="w-full sm:max-w-xl! gap-0 flex flex-col p-0 border-r"
					dir="rtl"
					onInteractOutside={(e) => {
						if (ownerDialogOpen || confirmDiscardOpen) {
							e.preventDefault();
							return;
						}
						e.preventDefault();
						handleCloseAttempt();
					}}
				>
					{/* رأس النموذج المخصص والمطابق تماماً للتصميم */}
					<div className="flex items-center justify-between border-b px-4 py-3">
						<SheetTitle className="text-base font-bold text-foreground">
							{readOnly ? "بيانات الطفل" : isEdit ? "تعديل بيانات الطفل" : "إضافة طفل جديد"}
						</SheetTitle>
						<button
							type="button"
							onClick={handleCloseAttempt}
							className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
						>
							<IconX className="size-4" />
							<span className="sr-only">إغلاق</span>
						</button>
					</div>

					{/* شريط نسبة الإنجاز والتقدم */}
					<div className="flex flex-col gap-1.5 border-b px-4 py-2.5 bg-muted/20">
						<div className="flex items-center justify-between text-xs">
							<span className="font-bold text-emerald-600">
								{requiredFieldsProgress.percentage}%
							</span>
							<span className="text-muted-foreground">
								{requiredFieldsProgress.completed} من {requiredFieldsProgress.total} حقول
								مطلوبة
							</span>
						</div>
						<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
							<div
								className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
								style={{ width: `${requiredFieldsProgress.percentage}%` }}
							/>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto px-4 py-4">
						<form
							id="add-patient-form"
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col gap-6"
						>
							<PatientFormContent
								control={control}
								register={register}
								errors={errors}
								watch={watch}
								setValue={setValue}
								isPending={isPending}
								readOnly={readOnly}
								owners={owners}
								ownersLoading={ownersLoading}
								ownerSelectOpen={ownerSelectOpen}
								setOwnerSelectOpen={setOwnerSelectOpen}
								onAddOwnerClick={() => setOwnerDialogOpen(true)}
								showAdvanced={showAdvanced}
								setShowAdvanced={setShowAdvanced}
								idPrefix="sheet-patient"
							/>
						</form>
					</div>

					<FormFooter
						continueAdding={isEdit || readOnly ? undefined : continueAdding}
						onContinueAddingChange={isEdit || readOnly ? undefined : setContinueAdding}
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
								form="add-patient-form"
								size="sm"
								disabled={isPending}
								className="gap-1.5"
							>
								{isPending && <IconLoader2 className="size-4 animate-spin" />}
								{isEdit ? (
									<>
										<IconPencil className="size-4" />
										حفظ التعديلات
									</>
								) : (
									<>
										<IconPlus className="size-4" />
										إضافة الطفل
									</>
								)}
							</Button>
						)}
					</FormFooter>
				</SheetContent>
			</Sheet>

			<DiscardConfirmDialog
				open={confirmDiscardOpen}
				filledFields={filledFields}
				fieldLabels={PATIENT_FIELD_LABELS}
				resumeLabel={isEdit ? "متابعة التعديل" : "متابعة إضافة الطفل"}
				onDiscard={handleConfirmDiscard}
				onResume={() => setConfirmDiscardOpen(false)}
			/>

			<AddOwnerDialog
				open={ownerDialogOpen}
				onClose={() => setOwnerDialogOpen(false)}
				onSuccess={(newOwnerId) => {
					setValue("ownerId", newOwnerId, { shouldValidate: true });
					const found = owners.find((o) => o.id === newOwnerId);
					if (found) {
						setValue("guardianName", found.name, { shouldValidate: true });
						if (found.phone) setValue("guardianPhone", found.phone, { shouldValidate: true });
						if (found.email) setValue("guardianEmail", found.email);
					}
				}}
			/>
		</>
	);
}

export { AddPatientSheet as PatientSheet };
