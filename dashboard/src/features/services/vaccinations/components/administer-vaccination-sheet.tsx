import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import {
	useAdministerVaccination,
	usePatientVaccinationStatus,
	useVaccineBatches,
	useVaccines,
} from "@/features/services/vaccinations/hooks/use-vaccinations";
import { useSession } from "@/lib/auth/client";
import {
	ADVERSE_REACTION_LABELS,
	administerVaccinationSchema,
	DOSE_KIND_LABELS,
	INJECTION_SITE_LABELS,
	VACCINE_ROUTE_LABELS,
} from "@sanad/contracts/runtime/server/vaccinations/vaccinations.type";

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const toDateInput = (d: Date) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function AdministerVaccinationSheet({
	open,
	onOpenChange,
	patientId,
	dueAntigenCodes,
	appointmentId,
	branchId,
	onSaved,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** يُمرَّر من ملف الطفل أو من الفحص السريري — يُثبِّت الطفل ويخفي مُنتقيه */
	patientId?: string;
	/** المُستضِدّات المستحقة لهذا الطفل — تُرتّب اللقاحات وتُقترح المطابق منها */
	dueAntigenCodes?: string[];
	appointmentId?: string;
	branchId?: string;
	onSaved?: () => void;
}) {
	const { patients } = usePatients();
	const { staff } = useStaff();
	const { data: session } = useSession();
	// من يسجّل الجرعة هو من أعطاها في الغالب — سؤاله كل مرة عملٌ بلا عائد. اقتراح لا
	// قفل: القائمة تبقى مفتوحة لتصحيحه حين يسجّل موظّف الاستقبال نيابةً عن المدرّب.
	const currentStaffId = staff.find((m) => m.user?.id === session?.user?.id)?.id;
	const { vaccines } = useVaccines({});
	const { administer, isPending } = useAdministerVaccination();

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		reset,
		formState: { errors },
		// بلا وسيط نوع صريح: المخطّط يستعمل z.coerce فيختلف نوع الدخل عن الخرج،
		// وفرض نوع الخرج على الدخل يكسر الـ resolver. الاستنتاج يتكفّل بالطرفين.
	} = useForm({
		resolver: zodResolver(administerVaccinationSchema),
		defaultValues: {
			patientId: patientId ?? "",
			vaccineId: "",
			// نص YYYY-MM-DD لا كائن Date: <input type="date"> لا يعرض كائنًا فيظهر
			// الحقل فارغًا. المخطّط z.coerce.date يتكفّل بالتحويل عند التحقّق.
			administeredAt: toDateInput(new Date()),
			doseNumber: 1,
			doseKind: "PRIMARY" as const,
			route: "SUBCUTANEOUS" as const,
			adverseReaction: "NONE" as const,
			allowExpiredBatch: false,
		},
	});

	const selectedPatientId = watch("patientId");
	const selectedVaccineId = watch("vaccineId");
	const selectedBatchId = watch("batchId");
	const allowExpired = watch("allowExpiredBatch");
	const adverseReaction = watch("adverseReaction");

	/**
	 * اللقاحات مرتّبةً بتغطيتها للمستحق. صف الطابور يعرف أي مرض تأخّر، ومع ذلك كانت
	 * القائمة تُعرض أبجديًا فيُترك للمستخدم أن يستنتج أن DHPPi يغطّي الديستمبر والغدّي
	 * والبارفو. الحساب موجود أصلًا — فليُعرض.
	 */
	const ranked = useMemo(() => {
		const due = new Set(dueAntigenCodes ?? []);
		return vaccines
			.map((v) => {
				const codes = v.antigens.map((a) => a.antigenCode);
				return { vaccine: v, covers: codes.filter((c) => due.has(c)).length };
			})
			.sort(
				(a, b) => b.covers - a.covers || a.vaccine.name.localeCompare(b.vaccine.name, "ar"),
			);
	}, [vaccines, dueAntigenCodes]);

	const vaccine = vaccines.find((v) => v.id === selectedVaccineId);
	// z.coerce.date() يجعل نوع دخل النموذج غير محدَّد — والقيمة الواصلة من
	// <input type="date"> نصّ دائمًا، فيُقرأ نصًّا ويُتحقَّق منه قبل الاستعمال
	const administeredAtValue = watch("administeredAt") as unknown;
	// null لا استثناء: الحقل نصّ حرّ حتى يكتمل، والتاريخ الناقص لا يُعرض له وعد
	const protectiveFrom = (() => {
		if (!vaccine || typeof administeredAtValue !== "string" || !administeredAtValue)
			return null;
		const at = new Date(administeredAtValue);
		if (Number.isNaN(at.getTime())) return null;
		at.setDate(at.getDate() + vaccine.immunityOnsetDays);
		return at;
	})();
	const { batches } = useVaccineBatches(selectedVaccineId || undefined, branchId ?? null);
	const { status } = usePatientVaccinationStatus(selectedPatientId || undefined);

	// اللقاح يملأ القيم الافتراضية للطريق والموضع — المدرّب يعدّلها عند الحاجة
	useEffect(() => {
		if (!vaccine) return;
		setValue("route", vaccine.defaultRoute);
		if (vaccine.defaultSite) setValue("site", vaccine.defaultSite);
		if (vaccine.defaultDoseVolumeMl != null) {
			setValue("doseVolumeMl", Number(vaccine.defaultDoseVolumeMl));
		}
		setValue("batchId", undefined);
	}, [vaccine, setValue]);

	useEffect(() => {
		if (!open) return;
		reset({
			patientId: patientId ?? "",
			vaccineId: "",
			administeredAt: toDateInput(new Date()),
			doseNumber: 1,
			doseKind: "PRIMARY",
			route: "SUBCUTANEOUS",
			adverseReaction: "NONE",
			allowExpiredBatch: false,
			administeredById: currentStaffId,
		});
	}, [open, patientId, reset, currentStaffId]);

	// اختيار تلقائي حين يوجد مرشّح واحد فقط يغطّي المستحق — اقتراح لا قفل، والمستخدم
	// يبدّله بحرّية. أكثر من مرشّح يعني قرارًا سريريًا لا يصحّ أن تحسمه الواجهة.
	const soleMatch = ranked.filter((r) => r.covers > 0);
	useEffect(() => {
		if (!open || selectedVaccineId || soleMatch.length !== 1) return;
		setValue("vaccineId", soleMatch[0].vaccine.id);
	}, [open, selectedVaccineId, soleMatch, setValue]);

	const tracksBatches = vaccine?.inventoryItem?.tracksBatches ?? false;
	const hasInventoryLink = Boolean(vaccine?.inventoryItem);
	const selectedBatch = batches.find((b) => b.id === selectedBatchId);

	/**
	 * رقم الجرعة المقترح: عدد ما أُعطي من مُستضِدّات هذا اللقاح + 1. اقتراح لا فرض —
	 * الطفل قد يصل بسجل خارجي أو بجرعة أُعطيت في أكاديمية أخرى.
	 */
	const suggestedDose = useMemo(() => {
		if (!vaccine || !status) return null;
		const codes = vaccine.antigens.map((a) => a.antigenCode);
		const projection = status.projections.find((p) => codes.includes(p.antigenCode));
		return projection ?? null;
	}, [vaccine, status]);

	useEffect(() => {
		if (suggestedDose) setValue("doseNumber", suggestedDose.nextDoseNumber);
	}, [suggestedDose, setValue]);

	const onSubmit = handleSubmit((values) => {
		void administer(
			{
				...values,
				administeredAt: new Date(values.administeredAt).toISOString(),
				appointmentId: appointmentId ?? values.appointmentId,
				branchId: branchId ?? values.branchId,
				protocolDoseId: suggestedDose?.dose?.id ?? values.protocolDoseId,
			},
			{
				onSuccess: () => {
					onOpenChange(false);
					onSaved?.();
				},
			},
		);
	});

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="w-full gap-0 p-0 sm:max-w-xl!"
			>
				<FormHeader
					title="تسجيل جرعة تطعيم"
					onClose={() => onOpenChange(false)}
				/>

				<form
					onSubmit={onSubmit}
					className="flex min-h-0 flex-1 flex-col"
				>
					<div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
						{!patientId && (
							<Controller
								name="patientId"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.patientId}>
										<FieldLabel required>
											<Label>الطفل</Label>
										</FieldLabel>
										<Combobox
											value={field.value}
											onValueChange={(v) => field.onChange(typeof v === "string" ? v : "")}
										>
											<ComboboxTrigger className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input px-3 text-sm">
												<ComboboxValue
													placeholder="اختر الطفل"
													className="truncate"
												>
													{patients.find((p) => p.id === field.value)?.name}
												</ComboboxValue>
											</ComboboxTrigger>
											<ComboboxContent dir="rtl">
												<ComboboxList>
													{patients.length === 0 ? (
														<ComboboxEmpty>لا أطفال مسجّلة</ComboboxEmpty>
													) : (
														patients.map((p) => (
															<ComboboxItem
																key={p.id}
																value={p.id}
															>
																<span className="truncate">
																	{p.name} — {p.code}
																</span>
															</ComboboxItem>
														))
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
										<FieldError errors={[errors.patientId]} />
									</Field>
								)}
							/>
						)}

						{/* غياب تاريخ الميلاد يُقال صراحةً: الجرعة تُسجَّل، لكن جدولة ما بعدها
						    تحتاج مرساة عمر. إخفاء ذلك يُنتج «محدَّث» كاذبًا لاحقًا. */}
						{status && !status.birthDate && (
							<p className="flex items-start gap-2 rounded-[4px] bg-muted px-3 py-2 text-xs text-muted-foreground">
								<IconAlertTriangle className="mt-0.5 size-4 shrink-0" />
								تاريخ ميلاد هذا الطفل غير مسجَّل. ستُحفظ الجرعة، لكن جدولة الجرعة الأولى لكل
								مُستضِدّ لم يُعطَ بعد تحتاج تاريخ الميلاد — أضِفه من ملف الطفل.
							</p>
						)}

						<Controller
							name="vaccineId"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.vaccineId}>
									<FieldLabel required>
										<Label>اللقاح</Label>
									</FieldLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isPending || vaccines.length === 0}
									>
										<SelectTrigger className="w-full">
											<SelectValue
												placeholder={
													vaccines.length === 0 ? "لا لقاحات في الكتالوج" : "اختر اللقاح"
												}
											/>
										</SelectTrigger>
										{/* المرتَّب حسب التغطية أولًا — الشارة توفّر على المستخدم أن يحفظ
										    أي لقاح يقابل أي مرض */}
										<SelectContent position="popper">
											{ranked.map(({ vaccine: v, covers }) => (
												<SelectItem
													key={v.id}
													value={v.id}
												>
													<span className="flex items-center gap-2">
														<span className="truncate">
															{v.name}
															{v.manufacturerName ? ` — ${v.manufacturerName}` : ""}
														</span>
														{covers > 0 && (
															<Badge
																variant="primary"
																className="shrink-0"
															>
																يغطّي المستحق
															</Badge>
														)}
													</span>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[errors.vaccineId]} />
									{/* قائمة فارغة صامتة تُقرأ عطلًا لا نقصَ إعداد — السبب والخطوة التالية
									    يُقالان هنا بدل أن يبحث المستخدم عنهما */}
									{vaccines.length === 0 && (
										<p className="flex items-start gap-2 text-xs text-muted-foreground">
											<IconAlertTriangle className="mt-0.5 size-3.5 shrink-0" />
											لا لقاحات في الكتالوج بعد. أضِفه من تبويب «اللقاحات» في شاشة التطعيمات،
											واربطه بصنف مخزون متتبَّع بالدُفعات ليمكن تسجيل رقم الدفعة.
										</p>
									)}
								</Field>
							)}
						/>

						{vaccine && !hasInventoryLink && (
							<p className="flex items-start gap-2 rounded-[4px] bg-destructive/10 px-3 py-2 text-xs text-destructive">
								<IconAlertTriangle className="mt-0.5 size-4 shrink-0" />
								هذا اللقاح غير مرتبط بصنف مخزون، فلا دفعة له ولا تتبّع لرقمها. اربطه بصنف من
								شاشة اللقاحات قبل التسجيل.
							</p>
						)}

						{hasInventoryLink && (
							<Controller
								name="batchId"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.batchId}>
										<FieldLabel required={tracksBatches}>
											<Label>الدفعة</Label>
										</FieldLabel>
										<Select
											value={field.value ?? ""}
											onValueChange={field.onChange}
											disabled={isPending || batches.length === 0}
										>
											<SelectTrigger className="w-full">
												<SelectValue
													placeholder={
														batches.length === 0
															? "لا دفعات متاحة في المخزون"
															: "اختر الدفعة التي في يدك"
													}
												/>
											</SelectTrigger>
											{/* الترتيب FEFO يصل من الخادم؛ الاختيار للمستخدم لأن رقم الدفعة
											    يجب أن يطابق العبوة الفعلية لا أقربها انتهاءً حسابيًا */}
											<SelectContent position="popper">
												{batches.map((b) => (
													<SelectItem
														key={b.id}
														value={b.id}
														disabled={b.isExpired && !allowExpired}
													>
														<span dir="ltr">{b.batchNo}</span>
														{" — "}
														{b.expiryDate
															? `تنتهي ${dateFmt.format(new Date(b.expiryDate))}`
															: "بلا تاريخ انتهاء"}
														{` — متبقٍّ ${b.qty}`}
														{b.isExpired ? " — منتهية" : ""}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.batchId]} />
									</Field>
								)}
							/>
						)}

						{selectedBatch?.isExpired && (
							<div className="space-y-2 rounded-[4px] border border-destructive/40 bg-destructive/5 p-3">
								<Label className="flex items-center gap-2 text-destructive">
									<input
										type="checkbox"
										{...register("allowExpiredBatch")}
										className="size-4"
									/>
									تأكيد الصرف من دفعة منتهية الصلاحية
								</Label>
								<Field data-invalid={!!errors.expiredBatchReason}>
									<Input
										placeholder="سبب الصرف من دفعة منتهية *"
										{...register("expiredBatchReason")}
										disabled={!allowExpired}
									/>
									<FieldError errors={[errors.expiredBatchReason]} />
								</Field>
							</div>
						)}

						<div className="grid grid-cols-2 gap-3">
							<Field data-invalid={!!errors.administeredAt}>
								<FieldLabel required>
									<Label>تاريخ الإعطاء</Label>
								</FieldLabel>
								<Input
									type="date"
									{...register("administeredAt")}
									disabled={isPending}
								/>
								{/* تاريخ الإعطاء ليس تاريخ الحماية. عرض الفرق هنا — قبل الحفظ — يمنع
								    الوعد الخاطئ للوليّ أمر، وهو نفس الرقم الذي تقرأه بوابة قبول التجميل. */}
								{protectiveFrom && (
									<p className="text-muted-foreground text-xs leading-relaxed">
										تبدأ الحماية يوم{" "}
										<span className="font-medium text-foreground">
											{dateFmt.format(protectiveFrom)}
										</span>{" "}
										— بعد {vaccine?.immunityOnsetDays} يومًا من الإعطاء (فترة اكتساب المناعة).
									</p>
								)}
								<FieldError errors={[errors.administeredAt]} />
							</Field>

							<Field data-invalid={!!errors.doseNumber}>
								<FieldLabel>
									<Label>رقم الجرعة</Label>
								</FieldLabel>
								<Input
									type="number"
									min={1}
									{...register("doseNumber")}
									disabled={isPending}
								/>
								<FieldError errors={[errors.doseNumber]} />
							</Field>
						</div>

						{suggestedDose?.dose && (
							<p className="text-xs text-muted-foreground">
								البروتوكول يتوقّع «{suggestedDose.dose.label}» لهذا المُستضِدّ
								{suggestedDose.dueAt
									? ` — مستحقة ${dateFmt.format(new Date(suggestedDose.dueAt))}`
									: ""}
								.
							</p>
						)}

						<div className="grid grid-cols-2 gap-3">
							<Controller
								name="doseKind"
								control={control}
								render={({ field }) => (
									<Field>
										<FieldLabel>
											<Label>نوع الجرعة</Label>
										</FieldLabel>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={isPending}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent position="popper">
												{Object.entries(DOSE_KIND_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>

							<Controller
								name="route"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.route}>
										<FieldLabel required>
											<Label>طريق الإعطاء</Label>
										</FieldLabel>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={isPending}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent position="popper">
												{Object.entries(VACCINE_ROUTE_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.route]} />
									</Field>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<Controller
								name="site"
								control={control}
								render={({ field }) => (
									<Field>
										{/* الموضع ليس تفصيلًا: ترصّد ساركوما موضع الحقن في القطط يقوم عليه */}
										<FieldLabel>
											<Label>موضع الحقن</Label>
										</FieldLabel>
										<Select
											value={field.value ?? ""}
											onValueChange={field.onChange}
											disabled={isPending}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="اختر الموضع" />
											</SelectTrigger>
											<SelectContent position="popper">
												{Object.entries(INJECTION_SITE_LABELS).map(([value, label]) => (
													<SelectItem
														key={value}
														value={value}
													>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>

							<Field>
								<FieldLabel>
									<Label>الحجم (مل)</Label>
								</FieldLabel>
								<Input
									type="number"
									step="0.01"
									min={0}
									{...register("doseVolumeMl")}
									disabled={isPending}
								/>
							</Field>
						</div>

						<Controller
							name="administeredById"
							control={control}
							render={({ field }) => (
								<Field>
									<FieldLabel>
										<Label>المدرّب المُعطي</Label>
									</FieldLabel>
									<Select
										value={field.value ?? ""}
										onValueChange={field.onChange}
										disabled={isPending}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="اختر المدرّب" />
										</SelectTrigger>
										<SelectContent position="popper">
											{staff.map((s) => (
												<SelectItem
													key={s.id}
													value={s.id}
												>
													{s.prefix ? `${s.prefix} ` : ""}
													{s.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						<Controller
							name="adverseReaction"
							control={control}
							render={({ field }) => (
								<Field>
									<FieldLabel>
										<Label>التفاعل العكسي</Label>
									</FieldLabel>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isPending}
									>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent position="popper">
											{Object.entries(ADVERSE_REACTION_LABELS).map(([value, label]) => (
												<SelectItem
													key={value}
													value={value}
												>
													{label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						{adverseReaction !== "NONE" && (
							<Field>
								<FieldLabel>
									<Label>وصف التفاعل</Label>
								</FieldLabel>
								<Textarea
									rows={3}
									placeholder="الأعراض، وقت ظهورها، والتدبير المتّخذ"
									{...register("adverseReactionNotes")}
									disabled={isPending}
								/>
							</Field>
						)}

						<Field>
							<FieldLabel>
								<Label>ملاحظات</Label>
							</FieldLabel>
							<Textarea
								rows={2}
								{...register("notes")}
								disabled={isPending}
							/>
						</Field>
					</div>

					<FormFooter disabled={isPending}>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={
								isPending || vaccines.length === 0 || (Boolean(vaccine) && !hasInventoryLink)
							}
						>
							تسجيل الجرعة
						</Button>
					</FormFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
