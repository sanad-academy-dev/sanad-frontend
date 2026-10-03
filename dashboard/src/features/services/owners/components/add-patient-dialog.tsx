import { zodResolver } from "@hookform/resolvers/zod";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePatientDialog } from "@/features/services/owners/hooks/use-create-patient-dialog";
import { useAnimalStrains } from "@/features/settings/animals/hooks/use-animal-strains";
import { useAnimalTypes } from "@/features/settings/animals/hooks/use-animal-types";
import { useFormProgress } from "@/hooks/use-form-progress";
import { createPatientSchema } from "@sanad/contracts/runtime/server/patients/patients.type";

const addPatientDialogSchema = createPatientSchema.omit({ ownerId: true });

interface AddPatientDialogProps {
	open: boolean;
	onClose: () => void;
	onSuccess?: (patientId: string) => void;
}

export function AddPatientDialog({ open, onClose, onSuccess }: AddPatientDialogProps) {
	const { createPatient, isPending } = useCreatePatientDialog();
	const { animalTypes, isLoading: typesLoading } = useAnimalTypes();
	const { strains, isLoading: strainsLoading } = useAnimalStrains();

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(addPatientDialogSchema),
		defaultValues: { active: true },
	});

	const values = watch();
	const formProgress = useFormProgress({ schema: addPatientDialogSchema, values });

	const animalTypeId = values.animalTypeId;
	const filteredStrains = animalTypeId
		? strains.filter((s) => s.animalTypeId === animalTypeId)
		: [];

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

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), { enabled: open });

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
							<Label className="text-sm font-medium">الجنس</Label>
						</FieldLabel>
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

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label className="text-sm font-medium">نوع الطفل</Label>
							</FieldLabel>
							<Controller
								name="animalTypeId"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.animalTypeId}>
										<Select
											value={field.value ?? ""}
											onValueChange={field.onChange}
											disabled={typesLoading || isPending}
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
										onValueChange={field.onChange}
										disabled={!animalTypeId || strainsLoading || isPending}
										dir="rtl"
									>
										<SelectTrigger className="w-full text-right text-sm">
											<SelectValue
												placeholder={animalTypeId ? "اختر السلالة..." : "اختر النوع أولاً"}
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
