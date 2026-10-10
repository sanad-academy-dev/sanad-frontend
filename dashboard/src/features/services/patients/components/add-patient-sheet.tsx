import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { useCreatePatient } from "@/features/services/patients/hooks/use-create-patient";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { useAnimalStrains } from "@/features/settings/animals/hooks/use-animal-strains";
import { useAnimalTypes } from "@/features/settings/animals/hooks/use-animal-types";
import { useFormProgress } from "@/hooks/use-form-progress";
import {
	type CreatePatientFormInput,
	createPatientSchema,
	type PatientResponse,
} from "@sanad/contracts/runtime/server/patients/patients.type";

export function AddPatientSheet({
	open,
	onClose,
	defaultOwnerId,
	onSuccess,
}: {
	open: boolean;
	onClose: () => void;
	defaultOwnerId?: string;
	onSuccess?: (patient: PatientResponse) => void | Promise<void>;
}) {
	const { animalTypes, isLoading: typesLoading } = useAnimalTypes();
	const { strains, isLoading: strainsLoading } = useAnimalStrains();
	const { owners, isLoading: ownersLoading } = useOwners();
	const { createPatient, isPending } = useCreatePatient();

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
		formState: { errors },
	} = useForm({
		resolver: zodResolver(createPatientSchema),
		defaultValues: { active: true },
	});

	const values = watch();

	useEffect(() => {
		if (!open || !defaultOwnerId) return;
		setValue("ownerId", defaultOwnerId, { shouldValidate: true });
	}, [defaultOwnerId, open, setValue]);

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

	const handleCloseAttempt = () => {
		if (filledFields.length > 0) {
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

	const filteredStrains = values.animalTypeId
		? strains.filter((s) => s.animalTypeId === values.animalTypeId)
		: [];

	const formProgress = useFormProgress({ schema: createPatientSchema, values });

	const onSubmit = async (data: CreatePatientFormInput) => {
		const patient = await createPatient(data);
		await onSuccess?.(patient);
		reset();
		if (continueAdding) return;
		onClose();
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), { enabled: open });

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
						title="إضافة طفل جديد"
						progress={formProgress}
						onClose={handleCloseAttempt}
					/>

					<div className="flex-1 overflow-y-auto">
						<form
							id="add-patient-form"
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col gap-0"
							dir="rtl"
						>
							<div className="px-4 pt-4 pb-2">
								<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
									معلومات الطفل
								</p>
							</div>

							<div className="flex flex-col gap-4 px-4 pb-6">
								<div className="flex flex-col gap-1.5">
									<FieldLabel required>
										<Label
											className="text-sm font-medium"
											htmlFor="patient-name"
										>
											اسم الطفل
										</Label>
									</FieldLabel>
									<Field data-invalid={!!errors.name}>
										<Input
											id="patient-name"
											placeholder="مثال: بسبوسة"
											className="text-sm"
											aria-invalid={!!errors.name}
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
													>
														ذكر
													</TabsTrigger>
													<TabsTrigger
														value="FEMALE"
														className="flex-1 border border-border h-9"
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
														disabled={typesLoading}
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
													disabled={!values.animalTypeId || strainsLoading}
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
									<FieldLabel required>
										<Label className="text-sm font-medium">وليّ الأمر</Label>
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
													onValueChange={field.onChange}
													disabled={ownersLoading}
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
														<div className="flex w-full justify-start p-1.5">
															<Button
																type="button"
																variant="ghost"
																size="sm"
																className="h-7 w-full gap-1 text-xs"
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
											htmlFor="patient-age"
										>
											العمر (سنوات)
										</Label>
										<Field data-invalid={!!errors.age}>
											<Input
												id="patient-age"
												type="number"
												min={0}
												placeholder="مثال: 3"
												className="text-sm"
												aria-invalid={!!errors.age}
												{...register("age")}
											/>
											<FieldError errors={[errors.age]} />
										</Field>
									</div>

									<div className="flex flex-col gap-1.5">
										<Label
											className="text-sm font-medium"
											htmlFor="patient-weight"
										>
											الوزن (كيلو)
										</Label>
										<Field data-invalid={!!errors.weight}>
											<Input
												id="patient-weight"
												type="number"
												min={0}
												step="0.1"
												placeholder="مثال: 4.5"
												className="text-sm"
												aria-invalid={!!errors.weight}
												{...register("weight")}
											/>
											<FieldError errors={[errors.weight]} />
										</Field>
									</div>
								</div>

								{/* تاريخ الميلاد ليس تكرارًا للعمر: العمر رقم حرّ يشيخ في مكانه، وجدولة
								    التطعيم بالعمر («الجرعة الأولى في الأسبوع السادس») لا تُشتق إلا من تاريخ.
								    ولهذا هو مطلوب: ملف بلا تاريخ ميلاد لا يدخل محرّك الاستحقاق أصلًا. */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel required>
										<Label
											className="text-sm font-medium"
											htmlFor="patient-birth-date"
										>
											تاريخ الميلاد
										</Label>
									</FieldLabel>
									<Field data-invalid={!!errors.birthDate}>
										<Input
											id="patient-birth-date"
											type="date"
											max={new Date().toISOString().slice(0, 10)}
											className="text-sm"
											aria-invalid={!!errors.birthDate}
											{...register("birthDate")}
										/>
										<FieldError errors={[errors.birthDate]} />
									</Field>
								</div>

								<div className="flex flex-col gap-1.5">
									<Label
										className="text-sm font-medium"
										htmlFor="patient-notes"
									>
										ملاحظات
									</Label>
									<Textarea
										id="patient-notes"
										placeholder="أي ملاحظات إضافية..."
										className="text-sm min-h-24 resize-none"
										{...register("notes")}
									/>
								</div>
							</div>
						</form>
					</div>

					<FormFooter
						continueAdding={continueAdding}
						onContinueAddingChange={setContinueAdding}
						disabled={isPending}
					>
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={isPending}
							onClick={handleCloseAttempt}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							form="add-patient-form"
							size="sm"
							disabled={isPending}
						>
							أضف الطفل
						</Button>
					</FormFooter>
				</SheetContent>
			</Sheet>

			<AddOwnerDialog
				open={ownerDialogOpen}
				onClose={() => setOwnerDialogOpen(false)}
				onSuccess={(ownerId) => setValue("ownerId", ownerId)}
			/>

			<DiscardConfirmDialog
				open={confirmDiscardOpen}
				filledFields={filledFields}
				onDiscard={handleConfirmDiscard}
				onResume={() => setConfirmDiscardOpen(false)}
			/>
		</>
	);
}
