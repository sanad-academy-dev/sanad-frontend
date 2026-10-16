import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CreatePatientFormInput,
	createPatientSchema,
} from "@sanad/contracts/runtime/server/patients/patients.type";
import { IconLoader2, IconPlus, IconX } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useMemo, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";

import { FormFooter } from "@/components/common/form-footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AddOwnerDialog } from "@/features/services/patients/components/add-owner-dialog";
import { DiscardConfirmDialog } from "@/features/services/patients/components/discard-confirm-dialog";
import { PatientFormContent } from "@/features/services/patients/components/patient-form-content";
import {
	calculatePatientProgress,
	getPatientFilledFields,
	INITIAL_PATIENT_FORM_VALUES,
	PATIENT_FIELD_LABELS,
} from "@/features/services/patients/data/patient-form-constants";
import { useCreatePatient } from "@/features/services/patients/hooks/use-create-patient";
import { useOwners } from "@/features/services/patients/hooks/use-owners";

export interface AddPatientDialogProps {
	open: boolean;
	onClose: () => void;
	onSuccess?: (patientId: string) => void;
	defaultOwnerId?: string;
	defaultGuardianName?: string;
	defaultGuardianPhone?: string;
	defaultGuardianEmail?: string;
}

export function AddPatientDialog({
	open,
	onClose,
	onSuccess,
	defaultOwnerId,
	defaultGuardianName,
	defaultGuardianPhone,
	defaultGuardianEmail,
}: AddPatientDialogProps) {
	const { createPatient, isPending } = useCreatePatient();
	const { owners, isLoading: ownersLoading } = useOwners();

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
		formState: { errors },
	} = useForm<CreatePatientFormInput>({
		resolver: zodResolver(createPatientSchema) as Resolver<CreatePatientFormInput>,
		defaultValues: {
			...INITIAL_PATIENT_FORM_VALUES,
			ownerId: defaultOwnerId ?? "",
			guardianName: defaultGuardianName ?? "",
			guardianPhone: defaultGuardianPhone ?? "",
			guardianEmail: defaultGuardianEmail ?? "",
		},
	});

	const values = watch();

	useEffect(() => {
		if (!open) return;

		let initialGuardianName = defaultGuardianName ?? "";
		let initialGuardianPhone = defaultGuardianPhone ?? "";
		let initialGuardianEmail = defaultGuardianEmail ?? "";

		if (defaultOwnerId && owners.length > 0) {
			const found = owners.find((o) => o.id === defaultOwnerId);
			if (found) {
				initialGuardianName = found.name;
				if (found.phone) initialGuardianPhone = found.phone;
				if (found.email) initialGuardianEmail = found.email;
			}
		}

		reset({
			...INITIAL_PATIENT_FORM_VALUES,
			ownerId: defaultOwnerId ?? "",
			guardianName: initialGuardianName,
			guardianPhone: initialGuardianPhone,
			guardianEmail: initialGuardianEmail,
		});
		setShowAdvanced(false);
	}, [
		open,
		defaultOwnerId,
		defaultGuardianName,
		defaultGuardianPhone,
		defaultGuardianEmail,
		owners,
		reset,
	]);

	const requiredFieldsProgress = useMemo(() => calculatePatientProgress(values), [values]);

	const filledFields = useMemo(() => getPatientFilledFields(values), [values]);

	const handleCloseAttempt = () => {
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

		const patient = await createPatient({
			...data,
			age,
		});
		onSuccess?.(patient.id);
		reset();
		if (continueAdding) return;
		onClose();
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), {
		enabled: open,
		conflictBehavior: "replace",
	});

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(isOpen) => {
					if (!isOpen) handleCloseAttempt();
				}}
			>
				<DialogContent
					showCloseButton={false}
					className="w-full sm:max-w-xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden"
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
					{/* رأس النموذج المخصص والمطابق لنموذج الأطفال */}
					<div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
						<DialogTitle className="text-base font-bold text-foreground">
							إضافة طفل جديد
						</DialogTitle>
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
					<div className="flex flex-col gap-1.5 border-b px-4 py-2.5 bg-muted/20 shrink-0">
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

					<div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
						<form
							id="add-patient-dialog-form"
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
								owners={owners}
								ownersLoading={ownersLoading}
								ownerSelectOpen={ownerSelectOpen}
								setOwnerSelectOpen={setOwnerSelectOpen}
								onAddOwnerClick={() => setOwnerDialogOpen(true)}
								showAdvanced={showAdvanced}
								setShowAdvanced={setShowAdvanced}
								idPrefix="dialog-patient"
							/>
						</form>
					</div>

					<FormFooter
						continueAdding={continueAdding}
						onContinueAddingChange={setContinueAdding}
						disabled={isPending}
						showShortcut
						className="shrink-0"
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
							form="add-patient-dialog-form"
							size="sm"
							disabled={isPending}
							className="gap-1.5"
						>
							{isPending && <IconLoader2 className="size-4 animate-spin" />}
							<IconPlus className="size-4" />
							إضافة الطفل
						</Button>
					</FormFooter>
				</DialogContent>
			</Dialog>

			<DiscardConfirmDialog
				open={confirmDiscardOpen}
				filledFields={filledFields}
				fieldLabels={PATIENT_FIELD_LABELS}
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
