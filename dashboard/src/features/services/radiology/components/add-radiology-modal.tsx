import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconBodyScan,
	IconCalendar,
	IconPlus,
	IconStethoscope,
	IconUser,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DateTimePopover, nextQuarterHourDate } from "@/components/common/date-time-popover";
import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { ToggleChip } from "@/components/common/toggle-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PRIORITY_META } from "@/features/appointments/data/status-meta";
import { useAppointmentsList } from "@/features/appointments/hooks/use-appointments-list";
import { usePatientsByOwner } from "@/features/appointments/hooks/use-patients-by-owner";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { useCreateRadiologyOrder } from "@/features/services/radiology/hooks/use-create-radiology-order";
import { useRadiologyTemplates } from "@/features/services/radiology/hooks/use-radiology-templates";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { useActiveBranchStore } from "@/features/settings/branches/stores/active-branch.store";
import { RadiologyLaterality, TaskPriority } from "@/generated/prisma/enums";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
	type CreateRadiologyOrderFormInput,
	type CreateRadiologyOrderFormValues,
	createRadiologyOrderSchema,
	LATERALITY_LABELS,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";
import { modalityCapabilities } from "@sanad/contracts/runtime/server/radiology/radiology-modality";
import { BODY_PART_OPTIONS, MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

/** Radix لا يقبل قيمة فارغة لعنصر Select — نستخدم رمزًا للخيار "بدون" */
const NONE = "__none__";

const appointmentDateLabel = (value: Date | string) =>
	new Date(value).toLocaleDateString("ar-EG", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

/** [IP2] انظر `LabRequestPreset` — نفس المبدأ: نموذج طلب واحد لا نسخة ثانية */
export type RadiologyRequestPreset = {
	patientId: string;
	ownerId: string;
	branchId: string;
	inpatientStayId?: string;
};

export function AddRadiologyModal({
	trigger,
	preset,
	open: controlledOpen,
	onOpenChange,
}: {
	trigger?: ReactNode;
	preset?: RadiologyRequestPreset;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const { isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";
	const textAlignClass = isRtl ? "text-right" : "text-left";

	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = (next: boolean) => {
		if (onOpenChange) onOpenChange(next);
		else setUncontrolledOpen(next);
	};
	const [continueAdding, setContinueAdding] = useState(false);
	const { owners, isLoading: ownersLoading } = useOwners();
	const { branches } = useBranches();
	const { templates } = useRadiologyTemplates();
	const { activeBranchId } = useActiveBranchStore();
	const { createOrder, isPending } = useCreateRadiologyOrder();

	// لقطة واحدة عند أول رسم — لولاها لتغيّر مرجع initialDefaults كل ثانية
	const [initialSchedule] = useState(nextQuarterHourDate);

	// مرجع ثابت — لولا useMemo لأعاد تأثير الضبط أدناه تصفير النموذج في كل رسم
	const initialDefaults = useMemo<CreateRadiologyOrderFormInput>(
		() => ({
			branchId: preset?.branchId ?? "",
			ownerId: preset?.ownerId ?? "",
			patientId: preset?.patientId ?? "",
			serviceIds: [],
			isUrgent: false,
			clinicalInfo: "",
			notes: "",
			views: [],
			// الطلب المنشأ من هنا يبدأ «مجدول» — يبقى محكومًا ببوابة السداد
			origin: "DIRECT",
			scheduledAt: initialSchedule,
		}),
		// الطفل المحدَّد مسبقًا جزء من الافتراضيات — تغيّره يعيد بناءها
		[initialSchedule, preset?.branchId, preset?.ownerId, preset?.patientId],
	);

	const form = useForm<CreateRadiologyOrderFormInput, unknown, CreateRadiologyOrderFormValues>(
		{
			resolver: zodResolver(createRadiologyOrderSchema),
			defaultValues: initialDefaults,
			mode: "onChange",
		},
	);

	const values = form.watch();
	const formProgress = useFormProgress({ schema: createRadiologyOrderSchema, values });

	const ownerId = form.watch("ownerId");
	const patientId = form.watch("patientId");
	const serviceIds = form.watch("serviceIds");
	const branchId = form.watch("branchId");
	const clinicalInfo = form.watch("clinicalInfo");
	const requestedById = form.watch("requestedById");
	const assignedToId = form.watch("assignedToId");
	const appointmentId = form.watch("appointmentId");
	const selectedViews = form.watch("views") ?? [];
	const { patients, isLoading: patientsLoading } = usePatientsByOwner(ownerId || undefined);
	const { users, isLoading: usersLoading } = useClinicUsers();
	// زيارات الطفل المختار — للربط الاختياري بزيارة قائمة
	const { appointments } = useAppointmentsList("all", "all");

	const selectedOwner = owners.find((o) => o.id === ownerId);
	const selectedPatient = patients.find((p) => p.id === patientId);
	// لا يُعرض في المُنشئ إلا المفعّل وذو السعر — بلا سعر تصدر فاتورة صفرية
	// تعبر بوابة السداد فارغةً، وغير المفعّل أوقفته الأكاديمية من الإعدادات عمدًا
	const orderableTemplates = templates.filter((t) => t.isActive && t.price != null);
	const selectedTemplate = templates.find((t) => serviceIds.includes(t.serviceId)) ?? null;
	const definition = selectedTemplate?.definition ?? null;
	// القدرات تتبع الطريقة الفعّالة (المعرَّفة أو المستنتَجة من الاسم) — فحص
	// المقطعية يعرض خصائص مقطعية ولو لم يفتح أحد لوحة تعريفه بعد
	const effectiveModality = selectedTemplate?.effectiveModality ?? null;
	const caps = effectiveModality ? modalityCapabilities(effectiveModality) : null;
	const selectedRequester = users.find((u) => u.id === requestedById);
	const selectedAssignee = users.find((u) => u.id === assignedToId);
	const patientAppointments = useMemo(
		() => (patientId ? appointments.filter((a) => a.patientId === patientId) : []),
		[appointments, patientId],
	);
	const selectedAppointment = patientAppointments.find((a) => a.id === appointmentId);

	// الفرع النشط إن كان ضمن فروع الأكاديمية الحالية، وإلا أول فرع
	const resolvedBranchId =
		branches.find((b) => b.id === activeBranchId)?.id ?? branches[0]?.id ?? "";

	// فتح النافذة يبدأ من نموذج نظيف — يجب أن يسبق تعبئة الفرع أدناه وإلا محاها
	useEffect(() => {
		if (open) form.reset(initialDefaults);
	}, [open, initialDefaults, form.reset]);

	// الفرع يُملأ تلقائيًا (ويُعاد المحاولة إن وصلت الفروع بعد الفتح)
	useEffect(() => {
		if (!open || !resolvedBranchId || form.getValues("branchId")) return;
		form.setValue("branchId", resolvedBranchId, { shouldValidate: true });
	}, [open, resolvedBranchId, form]);

	// اختيار الفحص يُسقط خصائص تعريفه على النموذج (قابلة للتعديل قبل الإرسال)
	// biome-ignore lint/correctness/useExhaustiveDependencies: نتفاعل مع تغيّر الفحص المختار فقط
	useEffect(() => {
		if (!selectedTemplate) return;
		form.setValue("bodyPart", definition?.bodyPart ?? null);
		form.setValue("views", definition?.defaultViews ?? []);
		form.setValue("withContrast", definition?.contrastDefault ?? false);
		form.setValue(
			"laterality",
			definition?.lateralityRequired ? null : RadiologyLaterality.NONE,
		);
	}, [selectedTemplate?.serviceId]);

	const onSubmit = async (formValues: CreateRadiologyOrderFormValues) => {
		// الجهة إلزامية حين يشترطها تعريف الفحص (الأطراف مثلًا)
		if (
			definition?.lateralityRequired &&
			(!formValues.laterality || formValues.laterality === RadiologyLaterality.NONE)
		) {
			form.setError("laterality", { message: "حدّد جهة التصوير لهذا الفحص" });
			return;
		}
		try {
			// الربط بالإقامة يجعل البند يدخل فاتورة التنويم عند اكتماله
			await createOrder({ ...formValues, inpatientStayId: preset?.inpatientStayId ?? null });
		} catch {
			return; // الفشل يُبقي النافذة مفتوحة والبيانات كما هي (التوست يعرض السبب)
		}
		// «حفظ ومتابعة الإضافة» — نُفرّغ النموذج ونُبقي النافذة مفتوحة لطلب جديد
		if (!continueAdding) setOpen(false);
		form.reset(initialDefaults);
	};

	const submitForm = form.handleSubmit(onSubmit);

	useHotkey("Mod+Enter", () => submitForm(), { enabled: open });

	// الفرع يُسجَّل تلقائيًا من الفرع النشط — لا يظهر كحقل، ويُذكر فقط إن تعذّر تحديده
	const missingFieldLabels = [
		!ownerId && "وليّ الأمر",
		!patientId && "الطفل",
		serviceIds.length === 0 && "الفحص المطلوب",
		!clinicalInfo?.trim() && "السبب السريري",
		!branchId && "الفرع (لا يوجد فرع نشط)",
	].filter((label): label is string => !!label);

	const isSubmitDisabled = isPending || missingFieldLabels.length > 0;

	// سبب تعطيل زر الإنشاء — يظهر كتلميح عند محاولة الضغط عليه فقط
	const missingFieldsReason = missingFieldLabels.length
		? `أكمل الحقول التالية لتفعيل الطلب: ${missingFieldLabels.join("، ")}`
		: null;

	const toggleView = (view: string, checked: boolean) => {
		form.setValue(
			"views",
			checked ? [...selectedViews, view] : selectedViews.filter((v) => v !== view),
		);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			{/* المتحكَّم بها من الخارج (ورقة التنويم) تفتح بزرّ صاحبها؛ رسمُ زرّ هنا
			    أيضًا كان يُظهر زرّين لكل طلب */}
			{controlledOpen === undefined && (
				<DialogTrigger asChild>
					{trigger ?? (
						<Button>
							<IconPlus />
							طلب أشعة جديد
						</Button>
					)}
				</DialogTrigger>
			)}

			<DialogContent
				dir={dir}
				className={cn("max-w-4xl! gap-0 p-0")}
				showCloseButton={false}
			>
				<FormHeader
					variant="dialog"
					title="طلب أشعة جديد"
					progress={formProgress}
					onClose={() => setOpen(false)}
					actions={
						/* كل طلب يبدأ مجدولًا بفاتورته — فلا خيار للحالة، بل للأولوية */
						<Controller
							control={form.control}
							name="priority"
							render={({ field }) => (
								<Select
									value={field.value ?? NONE}
									onValueChange={(value) =>
										field.onChange(value === NONE ? null : (value as TaskPriority))
									}
								>
									<SelectTrigger
										dir={dir}
										className="h-8 w-auto gap-1.5 px-3"
										aria-label="الأولوية"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent
										dir={dir}
										position="popper"
									>
										<SelectGroup>
											<SelectItem value={NONE}>بدون أولوية</SelectItem>
											{Object.values(TaskPriority).map((value) => (
												<SelectItem
													key={value}
													value={value}
												>
													{PRIORITY_META[value].label}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							)}
						/>
					}
				/>

				<form
					dir={dir}
					className={textAlignClass}
					onSubmit={submitForm}
				>
					<div className="max-h-[65vh] space-y-4 overflow-y-auto p-4">
						<div className="grid grid-cols-2 gap-3">
							<Field data-invalid={!!form.formState.errors.ownerId}>
								<FieldLabel required>
									<Label>اختر وليّ الأمر</Label>
								</FieldLabel>
								<Controller
									control={form.control}
									name="ownerId"
									render={({ field }) => (
										<Combobox
											value={field.value ?? ""}
											onValueChange={(value) => {
												field.onChange(typeof value === "string" ? value : "");
												// الأطفال مرتبطون بوليّ الأمر — تبديله يُبطل اختيار الطفل
												form.setValue("patientId", "");
											}}
										>
											<ComboboxTrigger
												className={cn(
													"flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm",
													textAlignClass,
												)}
												disabled={ownersLoading || isPending}
											>
												<ComboboxValue
													placeholder="اختر وليّ الأمر..."
													className="truncate"
												>
													{selectedOwner?.name}
												</ComboboxValue>
											</ComboboxTrigger>
											<ComboboxContent dir={dir}>
												<ComboboxList>
													{owners.length === 0 ? (
														<ComboboxEmpty>لا يوجد ملاك</ComboboxEmpty>
													) : (
														owners.map((o) => (
															<ComboboxItem
																key={o.id}
																value={o.id}
															>
																<span className="truncate">{o.name}</span>
																<span className="ms-auto text-xs text-muted-foreground">
																	{o.phone}
																</span>
															</ComboboxItem>
														))
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
									)}
								/>
								<FieldError errors={[form.formState.errors.ownerId]} />
							</Field>

							<Field data-invalid={!!form.formState.errors.patientId}>
								<FieldLabel required>
									<Label>اختر الطفل</Label>
								</FieldLabel>
								<Controller
									control={form.control}
									name="patientId"
									render={({ field }) => (
										<Combobox
											value={field.value ?? ""}
											onValueChange={(value) =>
												field.onChange(typeof value === "string" ? value : "")
											}
										>
											<ComboboxTrigger
												className={cn(
													"flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm",
													textAlignClass,
												)}
												disabled={!ownerId || patientsLoading || isPending}
											>
												<ComboboxValue
													placeholder={ownerId ? "اختر الطفل..." : "اختر وليّ الأمر أولاً"}
													className="truncate"
												>
													{selectedPatient?.name}
												</ComboboxValue>
											</ComboboxTrigger>
											<ComboboxContent dir={dir}>
												<ComboboxList>
													{patients.length === 0 ? (
														<ComboboxEmpty>لا يوجد أطفال لهذا وليّ الأمر</ComboboxEmpty>
													) : (
														patients.map((p) => (
															<ComboboxItem
																key={p.id}
																value={p.id}
															>
																<span className="truncate">{p.name}</span>
																<span className="ms-auto text-xs text-muted-foreground">
																	{p.code}
																</span>
															</ComboboxItem>
														))
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
									)}
								/>
								<FieldError errors={[form.formState.errors.patientId]} />
							</Field>
						</div>

						<div className="grid grid-cols-2 gap-3">
							{/* طلب واحد لكل فحص — تعدّد الفحوصات يعني تعدّد الطلبات،
							    فلكلٍّ بطاقته على اللوحة وسير عمله وفاتورته */}
							<Field data-invalid={!!form.formState.errors.serviceIds}>
								<FieldLabel required>
									<Label>الفحص المطلوب</Label>
								</FieldLabel>
								<Controller
									control={form.control}
									name="serviceIds"
									render={({ field }) => (
										<Combobox
											value={field.value?.[0] ?? ""}
											onValueChange={(value) =>
												field.onChange(typeof value === "string" && value ? [value] : [])
											}
										>
											<ComboboxTrigger
												className={cn(
													"flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm",
													textAlignClass,
												)}
												disabled={isPending}
											>
												<ComboboxValue
													placeholder="اختر الفحص..."
													className="truncate"
												>
													{selectedTemplate?.name}
												</ComboboxValue>
											</ComboboxTrigger>
											<ComboboxContent dir={dir}>
												<ComboboxList>
													{orderableTemplates.length === 0 ? (
														<ComboboxEmpty>
															{templates.length === 0
																? "لا توجد فحوصات معرّفة"
																: "لا توجد فحوصات مفعّلة بسعر محدّد — راجع إعدادات الأشعة"}
														</ComboboxEmpty>
													) : (
														orderableTemplates.map((t) => (
															<ComboboxItem
																key={t.serviceId}
																value={t.serviceId}
															>
																<span className="truncate">{t.name}</span>
																<span className="ms-auto text-xs text-muted-foreground">
																	{Number(t.price).toLocaleString()} ر.س
																	{` · ${MODALITY_META[t.effectiveModality].label}`}
																</span>
															</ComboboxItem>
														))
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
									)}
								/>
								<FieldError errors={[form.formState.errors.serviceIds]} />
							</Field>

							<Field data-invalid={!!form.formState.errors.clinicalInfo}>
								<FieldLabel required>
									<Label htmlFor="radiology-clinical-info">السبب السريري</Label>
								</FieldLabel>
								{/* إلزامي مهنيًا — كاتب التقرير يفسّر الصور في ضوئه */}
								<Input
									id="radiology-clinical-info"
									disabled={isPending}
									placeholder="مثال: عرج على الطرف الخلفي الأيمن منذ أسبوع"
									aria-invalid={!!form.formState.errors.clinicalInfo}
									{...form.register("clinicalInfo")}
								/>
								<FieldError errors={[form.formState.errors.clinicalInfo]} />
							</Field>
						</div>

						{/* خصائص الفحص — تُملأ من تعريفه وتبقى قابلة للتخصيص لهذا الطلب */}
						{selectedTemplate && (
							<div className="flex flex-col gap-3 rounded-md border bg-muted/20 p-3">
								<div className="flex items-center gap-1.5">
									<IconBodyScan className="size-4 text-muted-foreground" />
									<span className="text-sm font-semibold">خصائص الفحص</span>
									{effectiveModality && (
										<Badge
											variant="outline"
											className="text-[10px]"
											title={
												selectedTemplate?.modalityInferred
													? "طريقة مستنتَجة من اسم الفحص — ثبّتها من تعريف الفحص في الإعدادات"
													: undefined
											}
										>
											{MODALITY_META[effectiveModality].label}
											{selectedTemplate?.modalityInferred ? " (مستنتَجة)" : ""}
										</Badge>
									)}
								</div>

								<div className="grid grid-cols-2 gap-3">
									<Field>
										<Label className="text-xs">منطقة التصوير</Label>
										<Controller
											control={form.control}
											name="bodyPart"
											render={({ field }) => (
												<Select
													value={field.value ?? ""}
													onValueChange={(v) => field.onChange(v || null)}
													disabled={isPending}
												>
													<SelectTrigger dir={dir}>
														<SelectValue placeholder="اختر المنطقة" />
													</SelectTrigger>
													<SelectContent
														dir={dir}
														position="popper"
													>
														<SelectGroup>
															{BODY_PART_OPTIONS.map((part) => (
																<SelectItem
																	key={part}
																	value={part}
																>
																	{part}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
											)}
										/>
									</Field>

									<Field data-invalid={!!form.formState.errors.laterality}>
										<Label className="text-xs">
											جهة التصوير
											{definition?.lateralityRequired && (
												<span className="ms-1 text-destructive">*</span>
											)}
										</Label>
										<Controller
											control={form.control}
											name="laterality"
											render={({ field }) => (
												<Select
													value={field.value ?? ""}
													onValueChange={(v) =>
														field.onChange((v || null) as RadiologyLaterality | null)
													}
													disabled={isPending}
												>
													<SelectTrigger dir={dir}>
														<SelectValue placeholder="اختر الجهة" />
													</SelectTrigger>
													<SelectContent
														dir={dir}
														position="popper"
													>
														{Object.values(RadiologyLaterality).map((value) => (
															<SelectItem
																key={value}
																value={value}
															>
																{LATERALITY_LABELS[value]}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
										<FieldError errors={[form.formState.errors.laterality]} />
									</Field>
								</div>

								{(definition?.defaultViews.length ?? 0) > 0 && (
									<div className="flex flex-col gap-1.5">
										<Label className="text-xs">
											{caps?.protocolLabel ?? "الإسقاطات"} المطلوبة
										</Label>
										<div className="flex flex-wrap gap-1.5">
											{definition?.defaultViews.map((view) => (
												<ToggleChip
													key={view}
													active={selectedViews.includes(view)}
													disabled={isPending}
													onClick={() => toggleView(view, !selectedViews.includes(view))}
												>
													{view}
												</ToggleChip>
											))}
										</div>
									</div>
								)}

								<div className="flex items-center justify-between gap-3">
									{/* التباين يظهر لطرق التصوير التي تقبله وحدها */}
									{caps?.contrast ? (
										<Controller
											control={form.control}
											name="withContrast"
											render={({ field }) => (
												<ToggleChip
													active={field.value === true}
													disabled={isPending}
													onClick={() => field.onChange(field.value !== true)}
												>
													بالتباين
												</ToggleChip>
											)}
										/>
									) : (
										<span className="text-[11px] text-muted-foreground">
											لا يستخدم هذا الفحص مادة تباين
										</span>
									)}
									{definition?.prepNotes && (
										<p className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-800">
											التحضير: {definition.prepNotes}
										</p>
									)}
								</div>
							</div>
						)}

						<Field>
							<FieldLabel>
								<Label htmlFor="radiology-notes">ملاحظات لقسم الأشعة</Label>
							</FieldLabel>
							<Input
								id="radiology-notes"
								disabled={isPending}
								placeholder="ملاحظات اختيارية"
								{...form.register("notes")}
							/>
						</Field>
					</div>

					<Separator />

					{/* شريط التفاصيل — المدرّب الطالب وفنّي الأشعة والزيارة المرتبطة */}
					<div className="flex flex-wrap gap-1 p-3.5">
						<Controller
							control={form.control}
							name="requestedById"
							render={({ field }) => (
								<Select
									value={field.value || NONE}
									onValueChange={(v) => field.onChange(v === NONE ? "" : v)}
									disabled={isPending || usersLoading}
								>
									<SelectTrigger
										dir={dir}
										className="h-9 w-auto gap-2 px-3"
									>
										<div className="flex items-center gap-2">
											<IconStethoscope className="size-4" />
											<span className="truncate">
												{selectedRequester ? selectedRequester.name : "المدرّب الطالب"}
											</span>
										</div>
									</SelectTrigger>
									<SelectContent
										dir={dir}
										position="popper"
									>
										<SelectGroup>
											<SelectItem value={NONE}>أنا (مستخدم الجلسة)</SelectItem>
											{users.map((u) => (
												<SelectItem
													key={u.id}
													value={u.id}
												>
													{u.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							)}
						/>

						<Controller
							control={form.control}
							name="assignedToId"
							render={({ field }) => (
								<Select
									value={field.value || NONE}
									onValueChange={(v) => field.onChange(v === NONE ? "" : v)}
									disabled={isPending || usersLoading}
								>
									<SelectTrigger
										dir={dir}
										className="h-9 w-auto gap-2 px-3"
									>
										<div className="flex items-center gap-2">
											<IconUser className="size-4" />
											<span className="truncate">
												{selectedAssignee ? selectedAssignee.name : "فنّي الأشعة"}
											</span>
										</div>
									</SelectTrigger>
									<SelectContent
										dir={dir}
										position="popper"
									>
										<SelectGroup>
											<SelectItem value={NONE}>بدون تعيين</SelectItem>
											{users.map((u) => (
												<SelectItem
													key={u.id}
													value={u.id}
												>
													{u.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							)}
						/>

						<Controller
							control={form.control}
							name="appointmentId"
							render={({ field }) => (
								<Select
									value={field.value || NONE}
									onValueChange={(v) => field.onChange(v === NONE ? "" : v)}
									disabled={isPending || !patientId}
								>
									<SelectTrigger
										dir={dir}
										className="h-9 w-auto gap-2 px-3"
									>
										<div className="flex items-center gap-2">
											<IconCalendar className="size-4" />
											<span className="truncate">
												{selectedAppointment
													? `زيارة ${selectedAppointment.code}`
													: patientId
														? "الزيارة المرتبطة"
														: "اختر الطفل أولاً"}
											</span>
										</div>
									</SelectTrigger>
									<SelectContent
										dir={dir}
										position="popper"
									>
										<SelectGroup>
											<SelectItem value={NONE}>بدون ربط بزيارة</SelectItem>
											{patientAppointments.map((a) => (
												<SelectItem
													key={a.id}
													value={a.id}
												>
													{a.code} — {appointmentDateLabel(a.startsAt)}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							)}
						/>

						{/* موعد الفحص — بجوار الزيارة المرتبطة: كلاهما «متى وأين يقع الطلب» */}
						<Controller
							control={form.control}
							name="scheduledAt"
							render={({ field }) => (
								<DateTimePopover
									value={(field.value as Date | null) ?? null}
									onChange={field.onChange}
									placeholder="موعد الفحص"
									disabled={isPending}
									invalid={!!form.formState.errors.scheduledAt}
									timeLabel="وقت الفحص"
								/>
							)}
						/>
					</div>

					{/* شريط ملخّص الفحص المختار — الإجمالي هنا هو ما ستحمله فاتورة الطلب */}
					{selectedTemplate && (
						<div className="flex justify-between border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
							<div className="flex flex-wrap items-center gap-3">
								<span className="flex items-center gap-1.5 font-medium text-foreground">
									<IconBodyScan className="size-3.5" />
									{selectedTemplate.name}
									<Badge
										variant="outline"
										className="text-[10px] font-normal"
									>
										{MODALITY_META[selectedTemplate.effectiveModality].label}
									</Badge>
								</span>
							</div>
							<div className="flex shrink-0 items-center gap-3">
								<span>
									الإجمالي: {Number(selectedTemplate.price ?? 0).toLocaleString()} ر.س
								</span>
							</div>
						</div>
					)}

					<Separator />

					<FormFooter
						continueAdding={continueAdding}
						onContinueAddingChange={setContinueAdding}
						disabled={isPending}
						extra={
							<Controller
								control={form.control}
								name="isUrgent"
								render={({ field }) => (
									<Label className="flex cursor-pointer items-center gap-2 font-normal text-muted-foreground">
										<Checkbox
											checked={field.value}
											onCheckedChange={(v) => field.onChange(v === true)}
											disabled={isPending}
										/>
										فحص عاجل
									</Label>
								)}
							/>
						}
					>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={isPending}
							onClick={() => form.reset(initialDefaults)}
						>
							إعادة الضبط
						</Button>
						<DisabledReasonTooltip reason={missingFieldsReason}>
							<Button
								type="submit"
								size="sm"
								disabled={isSubmitDisabled}
							>
								إنشاء الطلب
							</Button>
						</DisabledReasonTooltip>
					</FormFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
