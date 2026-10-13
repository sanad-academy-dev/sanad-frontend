import { zodResolver } from "@hookform/resolvers/zod";
import { createPatientSchema } from "@sanad/contracts/runtime/server/patients/patients.type";
import { useHotkey } from "@tanstack/react-hotkeys";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreatePatientDialog } from "@/features/services/owners/hooks/use-create-patient-dialog";
import { useFormProgress } from "@/hooks/use-form-progress";

const addPatientDialogSchema = createPatientSchema.omit({ ownerId: true });

interface AddPatientDialogProps {
	open: boolean;
	onClose: () => void;
	onSuccess?: (patientId: string) => void;
}

export function AddPatientDialog({ open, onClose, onSuccess }: AddPatientDialogProps) {
	const { createPatient, isPending } = useCreatePatientDialog();

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm<
		z.input<typeof addPatientDialogSchema>,
		any,
		z.infer<typeof addPatientDialogSchema>
	>({
		resolver: zodResolver(addPatientDialogSchema),
		defaultValues: { active: true },
	});

	const values = watch();
	const formProgress = useFormProgress({ schema: addPatientDialogSchema, values });

	const onSubmit = async (data: z.infer<typeof addPatientDialogSchema>) => {
		const patient = await createPatient(data);
		reset();
		onClose();
		onSuccess?.(patient.id);
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), {
		enabled: open,
		conflictBehavior: "replace",
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) handleClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-xl p-0 gap-0"
				dir="rtl"
			>
				<FormHeader
					variant="dialog"
					title="إضافة طفل جديد"
					progress={formProgress}
					onClose={handleClose}
				/>

				<form
					id="add-patient-dialog-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4 px-4 py-4"
				>
					<div className="flex flex-col gap-1.5">
						<FieldLabel required>
							<Label
								className="text-sm font-medium"
								htmlFor="dialog-patient-name"
							>
								اسم الطفل
							</Label>
						</FieldLabel>
						<Field data-invalid={!!errors.name}>
							<Input
								id="dialog-patient-name"
								placeholder="مثال: بسبوسة"
								className="text-sm"
								aria-invalid={!!errors.name}
								disabled={isPending}
								{...register("name")}
							/>
							<FieldError errors={[errors.name]} />
						</Field>
					</div>

					<div className="flex flex-col gap-1.5">
						<FieldLabel required>
							<Label
								className="text-sm font-medium"
								htmlFor="dialog-patient-gender"
							>
								الجنس
							</Label>
						</FieldLabel>
						<Controller
							name="gender"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.gender}>
									<Select
										value={field.value ?? ""}
										onValueChange={field.onChange}
										dir="rtl"
										disabled={isPending}
									>
										<SelectTrigger
											id="dialog-patient-gender"
											aria-invalid={!!errors.gender}
											className="w-full text-right text-sm"
										>
											<SelectValue placeholder="اختر الجنس..." />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
										>
											<SelectItem
												value="MALE"
												className="text-right"
											>
												ذكر
											</SelectItem>
											<SelectItem
												value="FEMALE"
												className="text-right"
											>
												أنثى
											</SelectItem>
											<SelectItem
												value="UNKNOWN"
												className="text-right"
											>
												غير معروف
											</SelectItem>
										</SelectContent>
									</Select>
									<FieldError errors={[errors.gender]} />
								</Field>
							)}
						/>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label
								className="text-sm font-medium"
								htmlFor="dialog-patient-age"
							>
								العمر (سنوات)
							</Label>
							<Field data-invalid={!!errors.age}>
								<Input
									id="dialog-patient-age"
									type="number"
									min={0}
									placeholder="مثال: 3"
									className="text-sm"
									aria-invalid={!!errors.age}
									disabled={isPending}
									{...register("age")}
								/>
								<FieldError errors={[errors.age]} />
							</Field>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								className="text-sm font-medium"
								htmlFor="dialog-patient-weight"
							>
								الوزن (كيلو)
							</Label>
							<Field data-invalid={!!errors.weight}>
								<Input
									id="dialog-patient-weight"
									type="number"
									min={0}
									step="0.1"
									placeholder="مثال: 4.5"
									className="text-sm"
									aria-invalid={!!errors.weight}
									disabled={isPending}
									{...register("weight")}
								/>
								<FieldError errors={[errors.weight]} />
							</Field>
						</div>
					</div>

					{/* تاريخ الميلاد مطلوب: منه وحده تُشتق جدولة التطعيم بالعمر، والعمر رقم
					    حرّ يشيخ في مكانه فلا يصلح بديلًا. */}
					<div className="flex flex-col gap-1.5">
						<FieldLabel required>
							<Label
								className="text-sm font-medium"
								htmlFor="dialog-patient-birth-date"
							>
								تاريخ الميلاد
							</Label>
						</FieldLabel>
						<Field data-invalid={!!errors.birthDate}>
							<Input
								id="dialog-patient-birth-date"
								type="date"
								max={new Date().toISOString().slice(0, 10)}
								className="text-sm"
								aria-invalid={!!errors.birthDate}
								disabled={isPending}
								{...register("birthDate")}
							/>
							<FieldError errors={[errors.birthDate]} />
						</Field>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label
							className="text-sm font-medium"
							htmlFor="dialog-patient-notes"
						>
							ملاحظات
						</Label>
						<Textarea
							id="dialog-patient-notes"
							placeholder="أي ملاحظات إضافية..."
							className="text-sm min-h-20 resize-none"
							disabled={isPending}
							{...register("notes")}
						/>
					</div>
				</form>

				<FormFooter>
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
						form="add-patient-dialog-form"
						size="sm"
						disabled={isPending}
					>
						إضافة الطفل
					</Button>
				</FormFooter>
			</DialogContent>
		</Dialog>
	);
}
