import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconStethoscope } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { FieldLabel } from "@/components/common/field-label";
import { FormHeader } from "@/components/common/form-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Kbd } from "@/components/ui/kbd";
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
import { Textarea } from "@/components/ui/textarea";
import {
	ACUITY_META,
	MONITORING_PRESETS,
	STAY_KIND_META,
} from "@/features/care/inpatients/data/inpatients-data";
import { useRequestInpatient } from "@/features/care/inpatients/hooks/use-inpatients";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import type { InpatientAcuity, InpatientStayKind } from "@/generated/prisma/enums";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
	type AdmitInpatientFormInput,
	type AdmitInpatientFormValues,
	admitInpatientSchema,
} from "@sanad/contracts/runtime/server/inpatients/inpatients.type";
import {
	DEFAULT_ACUITY_BY_KIND,
	defaultMonitoringIntervalMinutes,
} from "@sanad/contracts/runtime/server/inpatients/inpatients.workflow";

/**
 * نافذة **طلب** التنويم.
 *
 * لا قفص هنا عن قصد: الطلب قرارٌ سريري يكتبه المدرّب، والقفص قرارٌ تشغيليّ يملكه
 * العنبر. سؤال المدرّب عن رقم قفصٍ لا يعرف شغوره كان أصل فوضى هذا المسار.
 *
 * تتبع نموذج «حجز زيارة جديدة» عنصرًا بعنصر — `FormHeader` بشريط تقدّم، و`Field`
 * مع `FieldLabel`/`FieldError`، و`Combobox` للبحث في القوائم الطويلة، و`Controller`
 * لكل مُدخل مُتحكَّم به، وتعطيلُ الحفظ بسبب مقروء لا بزرّ صامت. الاتّجاه يأتي من
 * `useI18n` لا من `dir="rtl"` مثبَّت، فالنموذج يعمل في اللغتين كما تعمل الزيارة.
 *
 * الاقتراحات تتحرّك مع الاختيار: «عناية مركّزة» ترفع درجة الحرجية وتضيّق دورية
 * المراقبة — لأن ذلك ما يعنيه الاختيار فعلًا، وتركُ الحقول عند قيمها الافتراضية
 * يُنتج حالة حرجة تُراقَب كل أربع ساعات. وكلّها تبقى قابلة للتعديل.
 */

const FORM_DEFAULTS: AdmitInpatientFormInput = {
	patientId: "",
	branchId: "",
	attendingStaffId: "",
	kind: "MEDICAL",
	acuity: "MEDIUM",
	appointmentId: null,
	operationCaseId: null,
	presentingComplaint: "",
	admissionDiagnosis: "",
	isolationReason: "",
	monitoringIntervalMinutes: 240,
	dailyRateServiceId: null,
	expectedDischargeAt: null,
};

type PatientRow = { id: string; name: string; code: string };
type StaffRow = { id: string; name: string };

export function AdmitInpatientDialog({
	open: controlledOpen,
	onOpenChange,
	defaultPatientId,
	appointmentId,
	operationCaseId,
	trigger,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	defaultPatientId?: string;
	appointmentId?: string;
	operationCaseId?: string;
	trigger?: React.ReactNode;
}) {
	const { isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";
	const textAlignClass = isRtl ? "text-right" : "text-left";

	const isControlled = controlledOpen !== undefined;
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const open = isControlled ? controlledOpen : uncontrolledOpen;
	const setOpen = (next: boolean) => {
		if (isControlled) onOpenChange?.(next);
		else setUncontrolledOpen(next);
	};

	const { mutate: submitRequest, isPending } = useRequestInpatient();
	const { patients } = usePatients();
	const { staff } = useStaff();
	const { branches } = useBranches();

	const [patientComboOpen, setPatientComboOpen] = useState(false);

	const initialDefaults = useMemo<AdmitInpatientFormInput>(
		() => ({
			...FORM_DEFAULTS,
			patientId: defaultPatientId ?? "",
			appointmentId: appointmentId ?? null,
			operationCaseId: operationCaseId ?? null,
			kind: operationCaseId ? "SURGICAL" : "MEDICAL",
		}),
		[defaultPatientId, appointmentId, operationCaseId],
	);

	const form = useForm<AdmitInpatientFormInput, unknown, AdmitInpatientFormValues>({
		resolver: zodResolver(admitInpatientSchema),
		mode: "onChange",
		defaultValues: initialDefaults,
	});

	const formValues = form.watch();
	const formProgress = useFormProgress({ schema: admitInpatientSchema, values: formValues });

	const patientId = form.watch("patientId");
	const branchId = form.watch("branchId");
	const attendingStaffId = form.watch("attendingStaffId");
	const kind = form.watch("kind");
	const acuity = form.watch("acuity");
	const monitoring = form.watch("monitoringIntervalMinutes");

	const patientRows = patients as unknown as PatientRow[];
	const staffRows = staff as unknown as StaffRow[];

	const selectedPatient = patientRows.find((p) => p.id === patientId);
	const selectedStaff = staffRows.find((s) => s.id === attendingStaffId);

	// أوّل فرع افتراضيًا — الأكاديمية ذات الفرع الواحد لا تُسأل عن الفرع
	useEffect(() => {
		if (!branchId && branches.length > 0) form.setValue("branchId", branches[0].id);
	}, [branches, branchId, form]);

	// النوع يقترح الحرجية، والحرجية تقترح الدورية — سلسلة تُبقي الثلاثة متّسقة
	useEffect(() => {
		const suggested = DEFAULT_ACUITY_BY_KIND[kind];
		form.setValue("acuity", suggested);
		form.setValue(
			"monitoringIntervalMinutes",
			defaultMonitoringIntervalMinutes(suggested, kind),
		);
	}, [kind, form]);

	useEffect(() => {
		if (open) form.reset(initialDefaults);
	}, [open, initialDefaults, form]);

	// إقامة العزل لا تُسكن إلا في قاعة عزل — الفلترة هنا تمنع الاختيار الذي سيرفضه الخادم

	const onSubmit = (data: AdmitInpatientFormValues) => {
		submitRequest(
			{
				...data,
				presentingComplaint: data.presentingComplaint || null,
				admissionDiagnosis: data.admissionDiagnosis || null,
				isolationReason: kind === "ISOLATION" ? data.isolationReason || null : null,
				importPostOpOrders: Boolean(operationCaseId),
			},
			{ onSuccess: () => setOpen(false) },
		);
	};

	const submitForm = form.handleSubmit(onSubmit);
	const isSubmitDisabled = isPending || !form.formState.isValid;

	const missingFieldLabels = [
		!patientId && "الطفل",
		!branchId && "الفرع",
		!attendingStaffId && "المدرّب المعالج",
	].filter((label): label is string => !!label);

	const missingFieldsReason = missingFieldLabels.length
		? `أكمل الحقول التالية لتسجيل الطلب: ${missingFieldLabels.join("، ")}`
		: null;

	useHotkey(
		"Mod+Enter",
		() => {
			if (isSubmitDisabled) return;
			void submitForm();
		},
		{ enabled: open },
	);

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			{(trigger || !isControlled) && (
				<DialogTrigger asChild>
					{trigger ?? (
						<Button>
							<IconPlus />
							طلب تنويم
						</Button>
					)}
				</DialogTrigger>
			)}

			<DialogContent
				dir={dir}
				className={cn("max-w-3xl! gap-0 p-0")}
				showCloseButton={false}
			>
				<FormHeader
					variant="dialog"
					title="طلب تنويم"
					progress={formProgress}
					onClose={() => setOpen(false)}
				/>

				<form
					dir={dir}
					className={textAlignClass}
					onSubmit={submitForm}
				>
					<div className="max-h-[65vh] space-y-4 overflow-y-auto p-4">
						<div className="grid grid-cols-2 gap-3">
							<Field data-invalid={!!form.formState.errors.patientId}>
								<FieldLabel required>
									<Label>اختر الطفل</Label>
								</FieldLabel>
								<Controller
									control={form.control}
									name="patientId"
									render={({ field }) => (
										<Combobox
											open={patientComboOpen}
											onOpenChange={setPatientComboOpen}
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
												disabled={isPending}
											>
												<ComboboxValue
													placeholder="اختر الطفل..."
													className="truncate"
												>
													{selectedPatient?.name}
												</ComboboxValue>
											</ComboboxTrigger>
											<ComboboxContent dir={dir}>
												<ComboboxList>
													{patientRows.length === 0 ? (
														<ComboboxEmpty>لا يوجد أطفال</ComboboxEmpty>
													) : (
														patientRows.map((p) => (
															<ComboboxItem
																key={p.id}
																value={p.id}
															>
																<span className="truncate">{p.name}</span>
																<span className="ms-auto text-muted-foreground text-xs">
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

							<Field data-invalid={!!form.formState.errors.attendingStaffId}>
								<FieldLabel required>
									<Label>المدرّب المعالج</Label>
								</FieldLabel>
								<Controller
									control={form.control}
									name="attendingStaffId"
									render={({ field }) => (
										<Select
											value={field.value || ""}
											onValueChange={(value) => field.onChange(value || "")}
											disabled={isPending}
										>
											{/* نفس شكل مُنتقي المدرّب في نموذج الزيارة: صورة رمزية واسم
											    عند الاختيار، وأيقونة السمّاعة مع نائبٍ نصّي قبله */}
											<SelectTrigger
												dir={dir}
												className="w-full"
											>
												{selectedStaff ? (
													<div className="flex items-center gap-2">
														<Avatar className="size-5">
															<AvatarFallback className="text-xs">
																{selectedStaff.name.charAt(0)}
															</AvatarFallback>
														</Avatar>
														<span className="truncate font-medium">{selectedStaff.name}</span>
													</div>
												) : (
													<div className="flex items-center gap-2">
														<IconStethoscope className="size-4" />
														<SelectValue placeholder="اختر المدرّب" />
													</div>
												)}
											</SelectTrigger>
											{/* position="popper" إلزامي — الافتراضي يخرج عن الشاشة في RTL */}
											<SelectContent
												dir={dir}
												position="popper"
											>
												<SelectGroup>
													{staffRows.map((member) => (
														<SelectItem
															key={member.id}
															value={member.id}
														>
															<Avatar className="size-5">
																<AvatarFallback className="text-xs">
																	{member.name.charAt(0)}
																</AvatarFallback>
															</Avatar>
															{member.name}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									)}
								/>
								<FieldError errors={[form.formState.errors.attendingStaffId]} />
								<p className="text-[11px] text-muted-foreground">إليه تُصعَّد القراءات الحرجة</p>
							</Field>
						</div>

						<Separator />

						<div className="grid grid-cols-2 gap-3">
							<Field data-invalid={!!form.formState.errors.branchId}>
								<FieldLabel required>
									<Label>الفرع</Label>
								</FieldLabel>
								<Controller
									control={form.control}
									name="branchId"
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={isPending}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="اختر الفرع" />
											</SelectTrigger>
											{/* position="popper" إلزامي — الافتراضي يخرج عن الشاشة في RTL */}
											<SelectContent
												position="popper"
												dir={dir}
											>
												<SelectGroup>
													{branches.map((b) => (
														<SelectItem
															key={b.id}
															value={b.id}
														>
															{b.name}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									)}
								/>
								<FieldError errors={[form.formState.errors.branchId]} />
							</Field>
						</div>

						<Field>
							<FieldLabel required>
								<Label>نوع التنويم</Label>
							</FieldLabel>
							<Controller
								control={form.control}
								name="kind"
								render={({ field }) => (
									<div className="flex flex-wrap gap-1.5">
										{Object.entries(STAY_KIND_META)
											// الإقامة الفندقية خارج هذا الإصدار (القرار D2) — لا تُعرض أصلًا
											.filter(([value]) => value !== "BOARDING")
											.map(([value, meta]) => {
												const Icon = meta.icon;
												const isActive = field.value === value;
												return (
													<button
														key={value}
														type="button"
														disabled={isPending}
														onClick={() => field.onChange(value as InpatientStayKind)}
														className={cn(
															"inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
															isActive
																? "border-primary bg-primary/10 font-medium text-primary"
																: "border-input text-muted-foreground hover:bg-accent",
														)}
													>
														<Icon className="size-4" />
														{meta.label}
													</button>
												);
											})}
									</div>
								)}
							/>
						</Field>

						{kind === "ISOLATION" && (
							<Field>
								<FieldLabel>
									<Label>سبب العزل</Label>
								</FieldLabel>
								<Controller
									control={form.control}
									name="isolationReason"
									render={({ field }) => (
										<Textarea
											rows={2}
											placeholder="اشتباه بارفو / سعار / …"
											value={field.value ?? ""}
											onChange={field.onChange}
											disabled={isPending}
										/>
									)}
								/>
							</Field>
						)}

						<div className="grid grid-cols-2 gap-3">
							<Field data-invalid={!!form.formState.errors.acuity}>
								<FieldLabel required>
									<Label>درجة الحرجية</Label>
								</FieldLabel>
								<Controller
									control={form.control}
									name="acuity"
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={(v) => {
												field.onChange(v as InpatientAcuity);
												form.setValue(
													"monitoringIntervalMinutes",
													defaultMonitoringIntervalMinutes(v as InpatientAcuity, kind),
												);
											}}
											disabled={isPending}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent
												position="popper"
												dir={dir}
											>
												<SelectGroup>
													{Object.entries(ACUITY_META).map(([value, meta]) => (
														<SelectItem
															key={value}
															value={value}
														>
															<span
																className={cn("size-2 rounded-full", meta.dot)}
																aria-hidden
															/>
															{meta.label}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									)}
								/>
								<FieldError errors={[form.formState.errors.acuity]} />
							</Field>

							<Field data-invalid={!!form.formState.errors.monitoringIntervalMinutes}>
								<FieldLabel required>
									<Label>دورية المراقبة</Label>
								</FieldLabel>
								<Controller
									control={form.control}
									name="monitoringIntervalMinutes"
									render={({ field }) => (
										<div className="flex flex-wrap gap-1.5">
											{MONITORING_PRESETS.map((preset) => (
												<button
													key={preset.minutes}
													type="button"
													disabled={isPending}
													onClick={() => field.onChange(preset.minutes)}
													className={cn(
														"rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
														Number(field.value) === preset.minutes
															? "border-primary bg-primary/10 font-medium text-primary"
															: "border-input text-muted-foreground hover:bg-accent",
													)}
												>
													{preset.label}
												</button>
											))}
										</div>
									)}
								/>
								<FieldError errors={[form.formState.errors.monitoringIntervalMinutes]} />
								<p className="text-[11px] text-muted-foreground">
									اقتُرحت من درجة الحرجية ({ACUITY_META[acuity].label} — كل {Number(monitoring)}{" "}
									دقيقة)
								</p>
							</Field>
						</div>

						<Separator />

						<div className="grid grid-cols-2 gap-3">
							<Field>
								<FieldLabel>
									<Label>الشكوى</Label>
								</FieldLabel>
								<Controller
									control={form.control}
									name="presentingComplaint"
									render={({ field }) => (
										<Textarea
											rows={2}
											value={field.value ?? ""}
											onChange={field.onChange}
											disabled={isPending}
										/>
									)}
								/>
							</Field>

							<Field>
								<FieldLabel>
									<Label>تشخيص الدخول</Label>
								</FieldLabel>
								<Controller
									control={form.control}
									name="admissionDiagnosis"
									render={({ field }) => (
										<Textarea
											rows={2}
											value={field.value ?? ""}
											onChange={field.onChange}
											disabled={isPending}
										/>
									)}
								/>
							</Field>
						</div>

						{operationCaseId && (
							<p className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
								ستُستورد أوامر ما بعد العملية إلى ورقة العلاج تلقائيًا.
							</p>
						)}
					</div>

					<Separator />

					<div className="flex items-center justify-between gap-2 px-4 py-2">
						<DisabledReasonTooltip reason={isSubmitDisabled ? missingFieldsReason : null}>
							<Button
								type="submit"
								size="sm"
								disabled={isSubmitDisabled}
							>
								تسجيل الطلب
								<Kbd>⌘↵</Kbd>
							</Button>
						</DisabledReasonTooltip>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							disabled={isPending}
							onClick={() => setOpen(false)}
						>
							إلغاء
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
