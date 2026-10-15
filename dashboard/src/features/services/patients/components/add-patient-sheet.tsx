import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CreatePatientFormInput,
	createPatientSchema,
	type PatientResponse,
} from "@sanad/contracts/runtime/server/patients/patients.type";
import {
	IconCalendar,
	IconChevronDown,
	IconChevronUp,
	IconPlus,
	IconStar,
	IconX,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
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
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { AddOwnerDialog } from "@/features/services/patients/components/add-owner-dialog";
import { DiscardConfirmDialog } from "@/features/services/patients/components/discard-confirm-dialog";
import { useCreatePatient } from "@/features/services/patients/hooks/use-create-patient";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { cn } from "@/lib/utils";

const CLASSROOM_OPTIONS = ["النجوم", "القمر", "الشمس", "الزهور", "النحل"];

const BLOOD_TYPE_OPTIONS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const RELATIONSHIP_OPTIONS = [
	{ value: "FATHER", label: "أب" },
	{ value: "MOTHER", label: "أم" },
	{ value: "GUARDIAN", label: "وصي / كفيل" },
	{ value: "OTHER", label: "أخرى" },
];

const TRANSPORT_OPTIONS = [
	"حافلة الأكاديمية (ذهاب وعودة)",
	"حافلة الأكاديمية (ذهاب فقط)",
	"حافلة الأكاديمية (عودة فقط)",
	"سيارة خاصة / مع ولي الأمر",
];

const FEE_TYPE_OPTIONS = [
	"رسوم شهرية",
	"رسوم فصلية",
	"رسوم سنوية",
	"منحة كاملة",
	"أخرى",
];

const ALLERGY_CHIPS = ["حليب البقر", "فول سوداني", "بيض", "قمح (جلوتين)", "لا يوجد"];

const HEALTH_CHIPS = ["لا يوجد", "ربو", "حساسية جلدية", "فرط حركة"];

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
	const { owners, isLoading: ownersLoading } = useOwners();
	const { createPatient, isPending } = useCreatePatient();

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
	} = useForm<z.input<typeof createPatientSchema>, any, CreatePatientFormInput>({
		resolver: zodResolver(createPatientSchema),
		defaultValues: {
			active: true,
			status: "ACTIVE",
			developmentStatus: "NORMAL",
			pocketMoneyEnabled: true,
			classroom: "النجوم",
			allergies: "لا يوجد",
			bloodType: "A+",
		},
	});

	const values = watch();

	useEffect(() => {
		if (!open || !defaultOwnerId) return;
		setValue("ownerId", defaultOwnerId, { shouldValidate: true });
		const found = owners.find((o) => o.id === defaultOwnerId);
		if (found) {
			setValue("guardianName", found.name, { shouldValidate: true });
			if (found.phone) setValue("guardianPhone", found.phone, { shouldValidate: true });
			if (found.email) setValue("guardianEmail", found.email);
		}
	}, [defaultOwnerId, open, setValue, owners]);

	// حساب نسبة الحقول المطلوبة (6 حقول رئيسية مطابقة للتصميم)
	const requiredFieldsProgress = useMemo(() => {
		const checks = [
			Boolean(values.name?.trim()),
			Boolean(values.birthDate?.trim()),
			Boolean(values.gender),
			Boolean(values.classroom?.trim()),
			Boolean(values.guardianName?.trim() || values.ownerId),
			Boolean(values.guardianPhone?.trim()),
		];
		const completed = checks.filter(Boolean).length;
		const total = 6;
		const percentage = Math.round((completed / total) * 100);
		return { completed, total, percentage };
	}, [values]);

	const filledCount = Object.values(values).filter(
		(v) => v !== undefined && v !== null && v !== "" && v !== true,
	).length;

	const handleCloseAttempt = () => {
		if (filledCount > 2) {
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
		let age: number | undefined = undefined;
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
		await onSuccess?.(patient);
		reset();
		if (continueAdding) return;
		onClose();
	};

	const handleChipClick = (
		field: "allergies" | "healthConditions",
		chip: string,
	) => {
		const current = watch(field) || "";
		if (chip === "لا يوجد") {
			setValue(field, "لا يوجد", { shouldValidate: true });
			return;
		}
		if (!current.trim() || current === "لا يوجد") {
			setValue(field, chip, { shouldValidate: true });
			return;
		}
		if (current.includes(chip)) return;
		setValue(field, `${current}، ${chip}`, { shouldValidate: true });
	};

	useHotkey("Mod+Enter", () => handleSubmit(onSubmit)(), {
		enabled: open,
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
					{/* رأس النموذج المخصص والمطابق تماماً للصورة 4 */}
					<div className="flex items-center justify-between border-b px-4 py-3">
						<SheetTitle className="text-base font-bold text-foreground">
							إضافة طفل جديد
						</SheetTitle>
						<button
							type="button"
							onClick={handleCloseAttempt}
							className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
								{requiredFieldsProgress.completed} من {requiredFieldsProgress.total} حقول مطلوبة
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
							{/* ── 1. المعلومات الأساسية ── */}
							<div className="flex flex-col gap-4">
								<h3 className="text-sm font-semibold text-foreground border-b pb-1.5">
									المعلومات الأساسية
								</h3>

								{/* اسم الطفل */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel required info="اسم الطفل الرباعي أو الثلاثي كما هو مسجل في الهوية">
										<Label className="text-sm font-medium">اسم الطفل</Label>
									</FieldLabel>
									<Field data-invalid={!!errors.name}>
										<Input
											placeholder="مثال: سارة أحمد"
											className="text-sm"
											aria-invalid={!!errors.name}
											{...register("name")}
										/>
										<FieldError errors={[errors.name]} />
									</Field>
								</div>

								{/* تاريخ الميلاد */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel required info="تاريخ ميلاد الطفل لحساب العمر الدقيق وتحديد الفصل">
										<Label className="text-sm font-medium">تاريخ الميلاد</Label>
									</FieldLabel>
									<Field data-invalid={!!errors.birthDate}>
										<div className="relative">
											<Input
												type="date"
												className="text-sm pe-9 text-right"
												aria-invalid={!!errors.birthDate}
												{...register("birthDate")}
											/>
											<IconCalendar className="absolute end-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
										</div>
										<FieldError errors={[errors.birthDate]} />
									</Field>
								</div>

								{/* الجنس */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel required>
										<Label className="text-sm font-medium">الجنس</Label>
									</FieldLabel>
									<Controller
										name="gender"
										control={control}
										render={({ field }) => (
											<Field data-invalid={!!errors.gender}>
												<Select
													value={field.value}
													onValueChange={field.onChange}
													dir="rtl"
												>
													<SelectTrigger className="w-full text-right text-sm">
														<SelectValue placeholder="اختر..." />
													</SelectTrigger>
													<SelectContent dir="rtl">
														<SelectItem value="FEMALE">أنثى</SelectItem>
														<SelectItem value="MALE">ذكر</SelectItem>
													</SelectContent>
												</Select>
												<FieldError errors={[errors.gender]} />
											</Field>
										)}
									/>
								</div>

								{/* رقم الهوية / الإقامة */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel info="رقم الهوية الوطنية أو الإقامة (10 أرقام)">
										<Label className="text-sm font-medium">رقم الهوية / الإقامة</Label>
									</FieldLabel>
									<Input
										placeholder="1xxxxxxxxx"
										className="text-sm font-mono text-right"
										{...register("nationalId")}
									/>
								</div>

								{/* الفصل */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel required info="المجموعة أو الصف الدراسي المسجل به الطفل">
										<Label className="text-sm font-medium">الفصل</Label>
									</FieldLabel>
									<Controller
										name="classroom"
										control={control}
										render={({ field }) => (
											<Field data-invalid={!!errors.classroom}>
												<Select
													value={field.value || "النجوم"}
													onValueChange={field.onChange}
													dir="rtl"
												>
													<SelectTrigger className="w-full text-right text-sm">
														<div className="flex items-center gap-2">
															<IconStar className="size-3.5 text-amber-500 fill-amber-500" />
															<SelectValue placeholder="اختر الفصل..." />
														</div>
													</SelectTrigger>
													<SelectContent dir="rtl">
														{CLASSROOM_OPTIONS.map((cls) => (
															<SelectItem key={cls} value={cls}>
																{cls}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FieldError errors={[errors.classroom]} />
											</Field>
										)}
									/>
								</div>
							</div>

							{/* ── 2. بيانات ولي الأمر ── */}
							<div className="flex flex-col gap-4">
								<h3 className="text-sm font-semibold text-foreground border-b pb-1.5">
									بيانات ولي الأمر
								</h3>

								{/* ولي الأمر */}
								<div className="flex flex-col gap-1.5">
									<div className="flex items-center justify-between">
										<FieldLabel required info="اسم ولي الأمر المسؤول عن الطفل للمتابعة والتواصل">
											<Label className="text-sm font-medium">ولي الأمر</Label>
										</FieldLabel>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="h-6 gap-1 text-xs text-primary px-1.5 hover:bg-primary/10 font-normal"
											onClick={() => setOwnerDialogOpen(true)}
										>
											<IconPlus className="size-3.5" />
											إضافة ولي أمر جديد
										</Button>
									</div>

									<Controller
										name="ownerId"
										control={control}
										render={({ field }) => (
											<Field data-invalid={!!errors.ownerId || !!errors.guardianName}>
												<Select
													open={ownerSelectOpen}
													onOpenChange={setOwnerSelectOpen}
													value={field.value ?? ""}
													onValueChange={(val) => {
														field.onChange(val);
														const selectedOwner = owners.find((o) => o.id === val);
														if (selectedOwner) {
															setValue("guardianName", selectedOwner.name, { shouldValidate: true });
															if (selectedOwner.phone) {
																setValue("guardianPhone", selectedOwner.phone, { shouldValidate: true });
															}
															if (selectedOwner.email) {
																setValue("guardianEmail", selectedOwner.email, { shouldValidate: true });
															}
														}
													}}
													disabled={ownersLoading || isPending}
													dir="rtl"
												>
													<SelectTrigger
														aria-invalid={!!errors.ownerId || !!errors.guardianName}
														className="w-full text-right text-sm"
													>
														<SelectValue placeholder="اختر وليّ الأمر..." />
													</SelectTrigger>
													<SelectContent
														dir="rtl"
														position="popper"
													>
														<div className="flex w-full justify-start p-1.5 border-b">
															<Button
																type="button"
																variant="ghost"
																size="sm"
																className="h-7 w-full justify-start gap-1 text-xs font-semibold text-primary"
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
														{owners.map((owner) => (
															<SelectItem
																key={owner.id}
																value={owner.id}
																className="text-right"
															>
																<div className="flex items-center justify-between w-full gap-2">
																	<span>{owner.name}</span>
																	{owner.phone && (
																		<span className="text-muted-foreground text-xs font-mono">
																			({owner.phone})
																		</span>
																	)}
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FieldError errors={[errors.ownerId, errors.guardianName]} />
											</Field>
										)}
									/>
								</div>

								{/* صلة القرابة */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-sm font-medium">صلة القرابة</Label>
									</FieldLabel>
									<Controller
										name="guardianRelationship"
										control={control}
										render={({ field }) => (
											<Select
												value={field.value || "FATHER"}
												onValueChange={field.onChange}
												dir="rtl"
											>
												<SelectTrigger className="w-full text-right text-sm">
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{RELATIONSHIP_OPTIONS.map((opt) => (
														<SelectItem key={opt.value} value={opt.label}>
															{opt.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								{/* رقم التواصل */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel required info="رقم الجوال الأساسي للتواصل وإرسال الإشعارات">
										<Label className="text-sm font-medium">رقم التواصل</Label>
									</FieldLabel>
									<Field data-invalid={!!errors.guardianPhone}>
										<Input
											type="tel"
											placeholder="05xxxxxxxx"
											className="text-sm font-mono text-right"
											{...register("guardianPhone")}
										/>
										<FieldError errors={[errors.guardianPhone]} />
									</Field>
								</div>

								{/* البريد الإلكتروني */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel info="البريد الإلكتروني لإرسال التقارير والفواتير الدورية">
										<Label className="text-sm font-medium">البريد الإلكتروني</Label>
									</FieldLabel>
									<Input
										type="email"
										placeholder="parent@email.com"
										className="text-sm text-right"
										{...register("guardianEmail")}
									/>
								</div>

								{/* رقم الطوارئ */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel info="رقم هاتف بديل يُتصل به في الحالات الطارئة">
										<Label className="text-sm font-medium">رقم الطوارئ</Label>
									</FieldLabel>
									<Input
										type="tel"
										placeholder="05xxxxxxxx"
										className="text-sm font-mono text-right"
										{...register("emergencyContactPhone")}
									/>
								</div>

								{/* اسم جهة الطوارئ */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-sm font-medium">اسم جهة الطوارئ</Label>
									</FieldLabel>
									<Input
										placeholder="مثال: الجدة - فاطمة"
										className="text-sm"
										{...register("emergencyContactName")}
									/>
								</div>
							</div>

							{/* ── 3. بيانات إضافية ── */}
							<div className="flex flex-col gap-4">
								<h3 className="text-sm font-semibold text-foreground border-b pb-1.5">
									بيانات إضافية
								</h3>

								{/* وسيلة النقل */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel>
										<Label className="text-sm font-medium">وسيلة النقل</Label>
									</FieldLabel>
									<Controller
										name="transportation"
										control={control}
										render={({ field }) => (
											<Select
												value={field.value || ""}
												onValueChange={field.onChange}
												dir="rtl"
											>
												<SelectTrigger className="w-full text-right text-sm">
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{TRANSPORT_OPTIONS.map((opt) => (
														<SelectItem key={opt} value={opt}>
															{opt}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								{/* نوع الرسوم */}
								<div className="flex flex-col gap-1.5">
									<FieldLabel info="جدول خطة تسديد الرسوم والاشتراكات">
										<Label className="text-sm font-medium">نوع الرسوم</Label>
									</FieldLabel>
									<Controller
										name="feeType"
										control={control}
										render={({ field }) => (
											<Select
												value={field.value || ""}
												onValueChange={field.onChange}
												dir="rtl"
											>
												<SelectTrigger className="w-full text-right text-sm">
													<SelectValue placeholder="اختر..." />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{FEE_TYPE_OPTIONS.map((opt) => (
														<SelectItem key={opt} value={opt}>
															{opt}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								{/* زر طي/بسط الإعدادات المتقدمة بنمط الحاشية المتقطعة */}
								<button
									type="button"
									onClick={() => setShowAdvanced((v) => !v)}
									className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
								>
									{showAdvanced ? (
										<>
											<IconChevronUp className="size-4" />
											إخفاء الإعدادات المتقدمة
										</>
									) : (
										<>
											<IconChevronDown className="size-4" />
											إظهار الإعدادات المتقدمة
										</>
									)}
								</button>
							</div>

							{/* ── 4. الإعدادات المتقدمة (البيانات الصحية) ── */}
							{showAdvanced && (
								<div className="flex flex-col gap-4 rounded-lg bg-muted/15 p-3 border">
									{/* الحساسيات */}
									<div className="flex flex-col gap-1.5">
										<FieldLabel info="أي أطعمة أو أدوية تسبب حساسية للطفل">
											<Label className="text-sm font-medium">الحساسيات</Label>
										</FieldLabel>
										<Textarea
											rows={2}
											placeholder="أي حساسيات معروفة..."
											className="text-sm resize-none"
											{...register("allergies")}
										/>
										{/* رقاقات سريعة */}
										<div className="flex flex-wrap items-center gap-1.5 pt-1">
											{ALLERGY_CHIPS.map((chip) => (
												<button
													key={chip}
													type="button"
													onClick={() => handleChipClick("allergies", chip)}
													className="rounded-md border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
												>
													{chip}
												</button>
											))}
										</div>
									</div>

									{/* فصيلة الدم */}
									<div className="flex flex-col gap-1.5">
										<FieldLabel>
											<Label className="text-sm font-medium">فصيلة الدم</Label>
										</FieldLabel>
										<Controller
											name="bloodType"
											control={control}
											render={({ field }) => (
												<Select
													value={field.value || "+A"}
													onValueChange={field.onChange}
													dir="rtl"
												>
													<SelectTrigger className="w-full text-right text-sm">
														<SelectValue placeholder="اختر..." />
													</SelectTrigger>
													<SelectContent dir="rtl">
														{BLOOD_TYPE_OPTIONS.map((bt) => (
															<SelectItem key={bt} value={bt}>
																{bt}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
									</div>

									{/* حالات صحية */}
									<div className="flex flex-col gap-1.5">
										<FieldLabel info="أي أمراض مزمنة أو رعاية خاصة تتطلب انتباه المعلمات">
											<Label className="text-sm font-medium">حالات صحية</Label>
										</FieldLabel>
										<Textarea
											rows={2}
											placeholder="أي حالات صحية تتطلب اهتمام خاص..."
											className="text-sm resize-none"
											{...register("healthConditions")}
										/>
										{/* رقاقات سريعة */}
										<div className="flex flex-wrap items-center gap-1.5 pt-1">
											{HEALTH_CHIPS.map((chip) => (
												<button
													key={chip}
													type="button"
													onClick={() => handleChipClick("healthConditions", chip)}
													className="rounded-md border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
												>
													{chip}
												</button>
											))}
										</div>
									</div>

									{/* الحضانة السابقة */}
									<div className="flex flex-col gap-1.5">
										<FieldLabel>
											<Label className="text-sm font-medium">الحضانة السابقة</Label>
										</FieldLabel>
										<Input
											placeholder="اسم الحضانة السابقة إن وجدت"
											className="text-sm"
											{...register("previousNursery")}
										/>
									</div>

									{/* ملاحظات */}
									<div className="flex flex-col gap-1.5">
										<FieldLabel>
											<Label className="text-sm font-medium">ملاحظات</Label>
										</FieldLabel>
										<Textarea
											rows={2}
											placeholder="ملاحظات إضافية..."
											className="text-sm resize-none"
											{...register("notes")}
										/>
									</div>
								</div>
							)}
						</form>
					</div>

					<FormFooter
						formId="add-patient-form"
						isPending={isPending}
						onCancel={handleCloseAttempt}
						submitLabel="حفظ الطفل"
						continueAdding={continueAdding}
						onContinueAddingChange={setContinueAdding}
					/>
				</SheetContent>
			</Sheet>

			<DiscardConfirmDialog
				open={confirmDiscardOpen}
				filledFields={[]}
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
