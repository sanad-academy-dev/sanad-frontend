import { zodResolver } from "@hookform/resolvers/zod";
import { IconClock, IconDoor, IconScissors, IconVaccine } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DateTimePopover } from "@/components/common/date-time-popover";
import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { usePatientsByOwner } from "@/features/appointments/hooks/use-patients-by-owner";
import { useStaffForBooking } from "@/features/appointments/hooks/use-staff-for-booking";
import { useOperationProcedureTemplates } from "@/features/services/operations/hooks/use-operation-procedures";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { OperationUrgency } from "@/generated/prisma/enums";
import { useFormProgress } from "@/hooks/use-form-progress";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
	type CreateOperationFormInput,
	type CreateOperationFormValues,
	createOperationSchema,
} from "@sanad/contracts/runtime/server/operations/operations.type";
import {
	maxOperationTier,
	OPERATION_TIER_LABELS,
	OPERATION_URGENCY_LABELS,
} from "@sanad/contracts/runtime/server/operations/operations.workflow";
import { SEDATION_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// غرف العمليات والفحص المتاحة — من نقطة theatres في وحدة العمليات
const useOperationTheatres = () => {
	const { data } = useQuery({
		queryKey: ["operations", "theatres"],
		queryFn: async () => {
			const res = await api.operations.theatres.get();
			if (res.error) throw new Error("فشل جلب غرف العمليات");
			return res.data;
		},
		staleTime: 60_000,
	});
	return { theatres: data ?? [] };
};

const FORM_DEFAULTS: CreateOperationFormInput = {
	patientId: "",
	procedures: [],
	surgeonStaffId: "",
	anesthetistStaffId: null,
	urgency: OperationUrgency.ELECTIVE,
	scheduledAt: null,
	estimatedDurationMin: 60,
	roomId: null,
	diagnosis: null,
};

export function CreateOperationDialog({
	open,
	onOpenChange,
	onCreate,
	isPending,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreate: (values: CreateOperationFormValues) => Promise<unknown>;
	isPending: boolean;
}) {
	const { owners, isLoading: ownersLoading } = useOwners();
	const { staff } = useStaffForBooking();
	const { templates } = useOperationProcedureTemplates();
	const { theatres } = useOperationTheatres();
	// الأطفال مرتبطون بوليّ الأمر — نمط نموذج طلب الأشعة نفسه
	const [ownerId, setOwnerId] = useState("");
	const { patients, isLoading: patientsLoading } = usePatientsByOwner(ownerId || undefined);
	const [continueAdding, setContinueAdding] = useState(false);

	const form = useForm<CreateOperationFormInput, unknown, CreateOperationFormValues>({
		resolver: zodResolver(createOperationSchema),
		defaultValues: FORM_DEFAULTS,
	});
	const {
		control,
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = form;

	const values = watch();
	const formProgress = useFormProgress({ schema: createOperationSchema, values });

	const selectedOwner = owners.find((o) => o.id === ownerId) ?? null;
	const selectedPatient = patients.find((p) => p.id === values.patientId) ?? null;
	const selectedServiceIds = (values.procedures ?? []).map((p) => p.serviceId);
	// لا يُعرض إلا المسعّر — إجراء بلا سعر مُعدّ سيُفوتر صفرًا بصمت
	const pricedTemplates = templates.filter((t) => t.isActive && (t.price ?? 0) > 0);
	const selectedTemplates = templates.filter((t) => selectedServiceIds.includes(t.serviceId));
	// الدرجة المتوقعة تظهر فور اختيار الإجراءات — الحاسم لدى الخادم لقطات التعريف
	const previewTier =
		selectedTemplates.length > 0
			? maxOperationTier(selectedTemplates.map((t) => t.effectiveTier))
			: null;
	const totalPrice = selectedTemplates.reduce((sum, t) => sum + (t.price ?? 0), 0);
	const totalDuration = selectedTemplates.reduce((sum, t) => sum + (t.duration ?? 0), 0);

	const selectedSurgeon = staff.find((s) => s.id === values.surgeonStaffId) ?? null;
	const selectedAnesthetist = staff.find((s) => s.id === values.anesthetistStaffId) ?? null;
	const selectedRoom = theatres.find((room) => room.id === values.roomId) ?? null;

	// زر معطّل بلا تفسير لغز — نفس تلميح نموذج حجز الزيارة
	const missingFieldLabels = [
		!ownerId && "وليّ الأمر",
		!values.patientId && "الطفل",
		selectedServiceIds.length === 0 && "الإجراءات",
		!values.surgeonStaffId && "الجرّاح",
	].filter((label): label is string => !!label);
	const missingFieldsReason = missingFieldLabels.length
		? `أكمل الحقول التالية لإنشاء الحالة: ${missingFieldLabels.join("، ")}`
		: null;

	const resetAll = () => {
		reset(FORM_DEFAULTS);
		setOwnerId("");
	};

	const onSubmit = handleSubmit(async (formValues) => {
		try {
			await onCreate({
				...formValues,
				scheduledAt: formValues.scheduledAt
					? new Date(formValues.scheduledAt).toISOString()
					: null,
			});
			resetAll();
			if (!continueAdding) onOpenChange(false);
		} catch {
			// التوست يُدار داخل الخطّاف — يبقى النموذج مفتوحًا للتصحيح
		}
	});

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="max-w-4xl! gap-0 p-0"
				showCloseButton={false}
			>
				<FormHeader
					variant="dialog"
					title="عملية جديدة"
					progress={formProgress}
					onClose={() => onOpenChange(false)}
					titleActions={
						previewTier && (
							<Badge
								variant="outline"
								className="text-[10px]"
							>
								{OPERATION_TIER_LABELS[previewTier]}
							</Badge>
						)
					}
					actions={
						// الأولوية بتصنيف NCEPOD — في الترويسة كما في نموذج طلب الأشعة
						<Controller
							control={control}
							name="urgency"
							render={({ field }) => (
								<Select
									value={field.value ?? OperationUrgency.ELECTIVE}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										dir="rtl"
										className="h-8 w-auto gap-1.5 px-3"
										aria-label="الأولوية"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent
										dir="rtl"
										position="popper"
									>
										{Object.values(OperationUrgency).map((u) => (
											<SelectItem
												key={u}
												value={u}
											>
												{OPERATION_URGENCY_LABELS[u]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					}
				/>

				<form
					dir="rtl"
					onSubmit={onSubmit}
				>
					<div className="max-h-[65vh] space-y-4 overflow-y-auto p-4">
						{/* وليّ الأمر ثم الطفل — الأطفال يتبعون وليّ الأمر المختار */}
						<div className="grid grid-cols-2 gap-3">
							<Field>
								<FieldLabel required>
									<Label>اختر وليّ الأمر</Label>
								</FieldLabel>
								<Combobox
									value={ownerId}
									onValueChange={(value) => {
										setOwnerId(typeof value === "string" ? value : "");
										form.setValue("patientId", "");
									}}
								>
									<ComboboxTrigger
										className="flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
										disabled={ownersLoading || isPending}
									>
										<ComboboxValue
											placeholder="اختر وليّ الأمر..."
											className="truncate"
										>
											{selectedOwner?.name}
										</ComboboxValue>
									</ComboboxTrigger>
									<ComboboxContent dir="rtl">
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
							</Field>

							<Field data-invalid={!!errors.patientId}>
								<FieldLabel required>
									<Label>اختر الطفل</Label>
								</FieldLabel>
								<Controller
									control={control}
									name="patientId"
									render={({ field }) => (
										<Combobox
											value={field.value ?? ""}
											onValueChange={(value) =>
												field.onChange(typeof value === "string" ? value : "")
											}
										>
											<ComboboxTrigger
												className="flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
												disabled={!ownerId || patientsLoading || isPending}
											>
												<ComboboxValue
													placeholder={ownerId ? "اختر الطفل..." : "اختر وليّ الأمر أولًا"}
													className="truncate"
												>
													{selectedPatient?.name}
												</ComboboxValue>
											</ComboboxTrigger>
											<ComboboxContent dir="rtl">
												<ComboboxList>
													{patients.length === 0 ? (
														<ComboboxEmpty>لا أطفال لهذا وليّ الأمر</ComboboxEmpty>
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
								<FieldError errors={[errors.patientId]} />
							</Field>
						</div>

						{/* الإجراءات الجراحية */}
						<Field data-invalid={!!errors.procedures}>
							<FieldLabel required>
								<Label>الإجراءات الجراحية</Label>
							</FieldLabel>
							<Controller
								control={control}
								name="procedures"
								render={({ field }) => (
									<Combobox
										multiple
										value={selectedServiceIds}
										onValueChange={(value) => {
											const ids = Array.isArray(value) ? value : [];
											field.onChange(ids.map((serviceId) => ({ serviceId })));
										}}
									>
										<ComboboxTrigger
											className="flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
											disabled={isPending}
										>
											<ComboboxValue
												placeholder="اختر الإجراءات..."
												className="truncate"
											>
												{selectedTemplates.length > 0
													? selectedTemplates.map((t) => t.name).join("، ")
													: undefined}
											</ComboboxValue>
										</ComboboxTrigger>
										<ComboboxContent dir="rtl">
											<ComboboxList>
												{pricedTemplates.length === 0 ? (
													<ComboboxEmpty>
														لا إجراءات مسعّرة — حدّد أسعار الإجراءات في الكتالوج أولًا
													</ComboboxEmpty>
												) : (
													pricedTemplates.map((t) => (
														<ComboboxItem
															key={t.serviceId}
															value={t.serviceId}
														>
															<span className="truncate">{t.name}</span>
															<span className="ms-auto flex items-center gap-1 text-xs text-muted-foreground">
																{OPERATION_TIER_LABELS[t.effectiveTier]}
																<span>·</span>
																{t.subcategoryName}
															</span>
														</ComboboxItem>
													))
												)}
											</ComboboxList>
										</ComboboxContent>
									</Combobox>
								)}
							/>
							<FieldError errors={[errors.procedures as { message?: string } | undefined]} />
						</Field>

						<Field>
							<Label>التشخيص / دواعي الجراحة</Label>
							<Textarea
								rows={2}
								placeholder="مثال: كتلة جلدية في الطرف الخلفي الأيمن"
								disabled={isPending}
								{...register("diagnosis")}
							/>
						</Field>
					</div>

					<Separator />

					{/* شريط التفاصيل — الفريق والموعد والمدة والقاعة (نمط شريط حجز الزيارة) */}
					<div className="flex flex-wrap gap-1 p-3.5">
						{/* الجرّاح الأساسي */}
						<Controller
							control={control}
							name="surgeonStaffId"
							render={({ field }) => (
								<Select
									value={field.value || ""}
									onValueChange={(v) => field.onChange(v || "")}
									disabled={isPending}
								>
									<SelectTrigger
										dir="rtl"
										className={cn(
											"h-9 w-auto gap-2 px-3",
											errors.surgeonStaffId && "border-destructive",
										)}
										aria-label="الجرّاح الأساسي"
									>
										{selectedSurgeon ? (
											<div className="flex items-center gap-2">
												<Avatar className="size-5">
													<AvatarFallback className="text-xs">
														{selectedSurgeon.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<span className="truncate font-medium">{selectedSurgeon.name}</span>
											</div>
										) : (
											<div className="flex items-center gap-2">
												<IconScissors className="size-4" />
												<span>الجرّاح</span>
											</div>
										)}
									</SelectTrigger>
									<SelectContent
										position="popper"
										dir="rtl"
									>
										{staff.map((s) => (
											<SelectItem
												key={s.id}
												value={s.id}
												textValue={s.name}
											>
												<Avatar className="size-6">
													<AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
												</Avatar>
												<span className="font-medium">{s.name}</span>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>

						{/* مدرّب التخدير — اختياري */}
						<Controller
							control={control}
							name="anesthetistStaffId"
							render={({ field }) => (
								<Select
									value={field.value ?? "NONE"}
									onValueChange={(v) => field.onChange(v === "NONE" ? null : v)}
									disabled={isPending}
								>
									<SelectTrigger
										dir="rtl"
										className="h-9 w-auto gap-2 px-3"
										aria-label="مدرّب التخدير"
									>
										<div className="flex items-center gap-2">
											<IconVaccine className="size-4" />
											<span className="truncate">
												{selectedAnesthetist ? selectedAnesthetist.name : "مدرّب التخدير"}
											</span>
										</div>
									</SelectTrigger>
									<SelectContent
										position="popper"
										dir="rtl"
									>
										<SelectItem value="NONE">بلا مخدّر</SelectItem>
										{staff.map((s) => (
											<SelectItem
												key={s.id}
												value={s.id}
												textValue={s.name}
											>
												{s.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>

						{/* موعد العملية */}
						<Controller
							name="scheduledAt"
							control={control}
							render={({ field }) => (
								<DateTimePopover
									value={field.value ? new Date(field.value) : null}
									onChange={(d) => field.onChange(d.toISOString())}
									placeholder="موعد العملية"
									disabled={isPending}
									invalid={!!errors.scheduledAt}
									timeLabel="وقت العملية"
								/>
							)}
						/>

						{/* المدة المتوقعة */}
						<Controller
							control={control}
							name="estimatedDurationMin"
							render={({ field }) => (
								<Select
									value={String(Number(field.value ?? 60))}
									onValueChange={(v) => field.onChange(Number(v))}
									disabled={isPending}
								>
									<SelectTrigger
										dir="rtl"
										className="h-9 w-auto gap-2 px-3"
										aria-label="المدة المتوقعة"
									>
										<div className="flex items-center gap-2">
											<IconClock className="size-4" />
											<span>المدة: {Number(field.value ?? 60)} دقيقة</span>
										</div>
									</SelectTrigger>
									<SelectContent
										position="popper"
										dir="rtl"
									>
										{[15, 30, 45, 60, 90, 120, 150, 180, 240].map((minutes) => (
											<SelectItem
												key={minutes}
												value={String(minutes)}
											>
												{minutes} دقيقة
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>

						{/* قاعة العمليات */}
						<Controller
							control={control}
							name="roomId"
							render={({ field }) => (
								<Select
									value={field.value ?? "NONE"}
									onValueChange={(v) => field.onChange(v === "NONE" ? null : v)}
									disabled={isPending}
								>
									<SelectTrigger
										dir="rtl"
										className="h-9 w-auto gap-2 px-3"
										aria-label="قاعة العمليات"
									>
										<div className="flex items-center gap-2">
											<IconDoor className="size-4" />
											<span className="truncate">
												{selectedRoom ? selectedRoom.name : "قاعة العمليات"}
											</span>
										</div>
									</SelectTrigger>
									<SelectContent
										position="popper"
										dir="rtl"
									>
										<SelectItem value="NONE">بلا قاعة</SelectItem>
										{theatres.map((room) => (
											<SelectItem
												key={room.id}
												value={room.id}
											>
												{room.name}
												{room.type === "EXAMINATION" ? " (فحص)" : ""} — {room.branch.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					{/* ملخص الاختيار — نمط شريط ملخص طلب الأشعة */}
					{selectedTemplates.length > 0 && (
						<div className="flex justify-between border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
							<span className="flex min-w-0 items-center gap-1.5 truncate font-medium text-foreground">
								<IconScissors className="size-3.5 shrink-0" />
								{selectedTemplates.map((t) => t.name).join("، ")}
								{previewTier && (
									<Badge
										variant="outline"
										className="text-[10px] font-normal"
									>
										{OPERATION_TIER_LABELS[previewTier]}
									</Badge>
								)}
								{selectedTemplates.some((t) => t.definition) && (
									<Badge
										variant="outline"
										className="text-[10px] font-normal"
									>
										{
											SEDATION_LABELS[
												selectedTemplates.find((t) => t.definition)?.definition
													?.defaultAnesthesia ?? "GENERAL_ANESTHESIA"
											]
										}
									</Badge>
								)}
							</span>
							<span className="shrink-0">
								الإجمالي: {totalPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
								ر.س
								{totalDuration > 0 ? ` · المدة: ${totalDuration} دقيقة` : ""}
							</span>
						</div>
					)}

					<Separator />

					<FormFooter
						continueAdding={continueAdding}
						onContinueAddingChange={setContinueAdding}
						disabled={isPending}
					>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={isPending}
							onClick={resetAll}
						>
							إعادة الضبط
						</Button>
						<DisabledReasonTooltip reason={missingFieldsReason}>
							<Button
								type="submit"
								size="sm"
								disabled={isPending || !!missingFieldsReason}
							>
								إنشاء الحالة
							</Button>
						</DisabledReasonTooltip>
					</FormFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
