import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconCalendarPlus,
	IconCircle,
	IconClockHour4,
	IconDoor,
	IconDots,
	IconInfoCircle,
	IconMapPinFilled,
	IconPaperclip,
	IconPlus,
	IconStethoscope,
	IconX,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { arSA, enUS } from "date-fns/locale";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { FieldLabel } from "@/components/common/field-label";
import { FormHeader } from "@/components/common/form-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
	FileUpload,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemPreview,
	FileUploadList,
	FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LOCATION_OPTIONS } from "@/features/appointments/data/location-options";
import { PRIORITY_OPTIONS } from "@/features/appointments/data/status-meta";
import { useAddAppointment } from "@/features/appointments/hooks/use-add-appointment";
import { useAppointmentSlots } from "@/features/appointments/hooks/use-appointment-slots";
import { usePatientsByOwner } from "@/features/appointments/hooks/use-patients-by-owner";
import { useStaffForBooking } from "@/features/appointments/hooks/use-staff-for-booking";
import {
	type AddAppointmentFormInput,
	type AddAppointmentFormValues,
	addAppointmentSchema,
	REPEAT_UNITS,
} from "@/features/appointments/types/appointment.types";
import { minutesToTimeLabel } from "@/features/appointments/utils/time";
import { formatFileSize, trimFileName } from "@/features/dashboard/utils/file";
import { AddOwnerSheet } from "@/features/services/owners/components/add-owner-sheet";
import { AddPatientSheet } from "@/features/services/patients/components/add-patient-sheet";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { useConsultationTypes } from "@/features/settings/consultation-types/hooks/use-consultation-types";
import { AppointmentLocation, AppointmentStatus } from "@/generated/prisma/enums";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
	DEFAULT_CONSULTATION_DURATION_MINUTES,
	REPEAT_UNIT_LABELS,
} from "@sanad/contracts/runtime/server/appointments/appointments.type";

// الزيارة تولد "مجدول" (الافتراضي) أو "طابور" فقط — بقية الحالات تُبلغ عبر سير العمل
// (docs/appointments-workflow.md). الطابور للحجز الأونلاين أو عند امتلاء الجدول.
const STATUS_OPTIONS = [
	{
		value: AppointmentStatus.SCHEDULED,
		label: "مجدول",
		icon: IconCircle,
		iconClassName: "text-muted-foreground",
	},
	{
		value: AppointmentStatus.WAITING,
		label: "الطابور",
		icon: IconClockHour4,
		iconClassName: "text-slate-400",
	},
] as const;

const FORM_DEFAULTS: AddAppointmentFormInput = {
	branchId: undefined,
	ownerId: "",
	patientId: "",
	staffId: "",
	serviceIds: [],
	date: undefined as unknown as Date,
	startMinute: undefined as unknown as number,
	roomId: undefined,
	location: AppointmentLocation.IN_CLINIC,
	status: AppointmentStatus.SCHEDULED,
	priority: null,
	isEmergency: false,
	consultationTypeId: "",
	clinicalNotes: "",
	whatsappReminderEnabled: false,
	whatsappNotification: false,
	repeat: false,
	repeatCount: undefined,
	repeatUnit: "WEEK",
	images: [],
};

interface AddAppointmentModalProps {
	trigger?: ReactNode;
	defaultOwnerId?: string;
	defaultPatientId?: string;
	defaultDate?: Date;
	// عند الحجز من "بدء الزيارة" داخل اشتراك خطة رعاية — يربط الموعد الناتج بالزيارة
	enrollmentVisitId?: string;
	// تحكّم خارجي بحالة الفتح (بديل عن الاعتماد على trigger الداخلي)
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function AddAppointmentModal({
	trigger,
	defaultOwnerId,
	defaultPatientId,
	defaultDate,
	enrollmentVisitId,
	open: openProp,
	onOpenChange: onOpenChangeProp,
}: AddAppointmentModalProps) {
	const { lang, isRtl } = useI18n();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const dir = isRtl ? "rtl" : "ltr";
	const textAlignClass = isRtl ? "text-right" : "text-left";
	const calendarLocale = lang === "ar" ? arSA : enUS;

	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const isControlled = openProp !== undefined;
	const open = isControlled ? openProp : uncontrolledOpen;
	const setOpen = isControlled ? (onOpenChangeProp ?? (() => {})) : setUncontrolledOpen;
	const [ownerSheetOpen, setOwnerSheetOpen] = useState(false);
	const [patientSheetOpen, setPatientSheetOpen] = useState(false);
	const [ownerComboOpen, setOwnerComboOpen] = useState(false);
	const [patientComboOpen, setPatientComboOpen] = useState(false);
	const [datePopoverOpen, setDatePopoverOpen] = useState(false);
	const [roomPopoverOpen, setRoomPopoverOpen] = useState(false);
	const [reasonPopoverOpen, setReasonPopoverOpen] = useState(false);
	const [_expanded, _setExpanded] = useState(false);

	const { owners, isLoading: ownersLoading } = useOwners();
	const { branchId: activeBranchId, queueEnabled } = useAppointmentBranch();
	// تفعيل الطابور = عمود الطابور الحر مخفي من اللوحة، فتُخفى حالة «الطابور» من الإنشاء أيضًا
	const statusOptions = queueEnabled
		? STATUS_OPTIONS.filter((o) => o.value !== AppointmentStatus.WAITING)
		: STATUS_OPTIONS;
	const { addAppointment, isPending } = useAddAppointment();
	const { types: consultationTypes } = useConsultationTypes();
	const activeConsultationTypes = consultationTypes.filter((t) => t.active);

	const initialDefaults = useMemo<AddAppointmentFormInput>(
		() => ({
			...FORM_DEFAULTS,
			ownerId: defaultOwnerId ?? FORM_DEFAULTS.ownerId,
			patientId: defaultPatientId ?? FORM_DEFAULTS.patientId,
			date: defaultDate ?? FORM_DEFAULTS.date,
		}),
		[defaultOwnerId, defaultPatientId, defaultDate],
	);

	const form = useForm<AddAppointmentFormInput, unknown, AddAppointmentFormValues>({
		resolver: zodResolver(addAppointmentSchema),
		mode: "onChange",
		defaultValues: initialDefaults,
	});

	const formValues = form.watch();
	const formProgress = useFormProgress({ schema: addAppointmentSchema, values: formValues });

	const ownerId = form.watch("ownerId");
	const patientId = form.watch("patientId");
	const staffId = form.watch("staffId");
	const date = form.watch("date");
	const startMinute = form.watch("startMinute");
	const location = form.watch("location");
	const status = form.watch("status");
	const priority = form.watch("priority");
	const roomId = form.watch("roomId");
	const consultationTypeId = form.watch("consultationTypeId");

	const totalDuration = consultationTypeId ? DEFAULT_CONSULTATION_DURATION_MINUTES : 0;

	const selectedConsultationType = consultationTypes.find((t) => t.id === consultationTypeId);
	const totalPrice = selectedConsultationType?.price ?? 0;

	const now = new Date();
	const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const isSelectedDateToday =
		date instanceof Date &&
		date.getFullYear() === todayStart.getFullYear() &&
		date.getMonth() === todayStart.getMonth() &&
		date.getDate() === todayStart.getDate();
	const currentMinuteOfDay = now.getHours() * 60 + now.getMinutes();

	const { patients: filteredPatients, isLoading: patientsLoading } =
		usePatientsByOwner(ownerId);
	const { staff, isLoading: staffLoading } = useStaffForBooking();
	const { slots, isLoading: slotsLoading } = useAppointmentSlots({
		staffId,
		date,
		durationMinutes: totalDuration,
	});
	const visibleSlots = slots.filter(
		(slot) => !(isSelectedDateToday && slot.startMinute <= currentMinuteOfDay),
	);

	const selectedOwner = owners.find((o) => o.id === ownerId);
	const selectedPatient = filteredPatients.find((p) => p.id === patientId);
	const selectedStaff = staff.find((s) => s.id === staffId);
	const selectedLocation = LOCATION_OPTIONS.find((o) => o.value === location);
	const selectedStatus = STATUS_OPTIONS.find((o) => o.value === status);
	const selectedPriority = PRIORITY_OPTIONS.find((o) => o.value === priority);

	const dateLabel = date
		? new Intl.DateTimeFormat(isRtl ? "ar-SA" : "en-US", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}).format(date)
		: undefined;
	const timeLabel =
		typeof startMinute === "number" ? minutesToTimeLabel(startMinute, lang) : undefined;

	const isTimePickerEnabled = !!staffId && !!date && totalDuration > 0;

	useEffect(() => {
		if (!activeBranchId || form.getValues("branchId")) return;
		form.setValue("branchId", activeBranchId);
	}, [activeBranchId, form]);

	useEffect(() => {
		if (open) form.reset(initialDefaults);
		if (!open) {
			setDatePopoverOpen(false);
			setRoomPopoverOpen(false);
		}
	}, [open, initialDefaults, form]);

	const onSubmit = async (data: AddAppointmentFormValues) => {
		await addAppointment(data, enrollmentVisitId ? { enrollmentVisitId } : undefined);
		setOpen(false);
		form.reset(initialDefaults);
	};

	const submitForm = form.handleSubmit(onSubmit);
	const isSubmitDisabled = isPending || !form.formState.isValid;

	const missingFieldLabels = [
		!ownerId && "وليّ الأمر",
		!patientId && "الطفل",
		!consultationTypeId && "سبب الزيارة",
		!staffId && "المدرّب",
		!date && "التاريخ",
		typeof startMinute !== "number" && "الوقت",
	].filter((label): label is string => !!label);

	// سبب تعطيل زر الحجز — يظهر كتلميح عند محاولة الضغط عليه فقط
	const missingFieldsReason = missingFieldLabels.length
		? `أكمل الحقول التالية لتفعيل الحجز: ${missingFieldLabels.join("، ")}`
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
		<>
			<Dialog
				open={open}
				onOpenChange={setOpen}
			>
				{(trigger || !isControlled) && (
					<DialogTrigger asChild>
						{trigger ?? (
							<Button>
								<IconPlus />
								إضافة زيارة جديدة
							</Button>
						)}
					</DialogTrigger>
				)}

				<DialogContent
					dir={dir}
					className={cn("p-0 gap-0 max-w-4xl!")}
					showCloseButton={false}
				>
					<FormHeader
						variant="dialog"
						title="حجز زيارة جديدة"
						progress={formProgress}
						onClose={() => setOpen(false)}
						titleActions={
							<Controller
								control={form.control}
								name="location"
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={field.onChange}
									>
										<SelectTrigger
											dir={dir}
											className="h-8 w-auto gap-1.5 px-3"
											aria-label="مكان الزيارة"
										>
											{selectedLocation && (
												<div className="flex items-center gap-1.5">
													<selectedLocation.icon className="size-4" />
													<span className="font-medium">{selectedLocation.label}</span>
												</div>
											)}
										</SelectTrigger>
										<SelectContent
											dir={dir}
											position="popper"
										>
											<SelectGroup>
												{LOCATION_OPTIONS.map(({ value, label, icon: Icon }) => (
													<SelectItem
														key={value}
														value={value}
														textValue={label}
													>
														<Icon className="size-4" />
														<span>{label}</span>
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
						<Controller
							control={form.control}
							name="images"
							render={({ field }) => (
								<FileUpload
									dir={dir}
									value={field.value ?? []}
									onValueChange={field.onChange}
									accept="image/*"
									maxFiles={5}
									maxSize={4 * 1024 * 1024}
									multiple
									disabled={isPending}
									onFileReject={(file, message) => toast(message, { description: file.name })}
								>
									<div className="p-4 space-y-4">
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
															open={ownerComboOpen}
															onOpenChange={setOwnerComboOpen}
															value={field.value ?? ""}
															onValueChange={(value) => {
																const next = typeof value === "string" ? value : "";
																field.onChange(next);
																form.setValue("patientId", "");
															}}
														>
															<ComboboxTrigger
																className={cn(
																	"flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm",
																	textAlignClass,
																)}
																disabled={ownersLoading}
															>
																<ComboboxValue
																	placeholder="اختر وليّ الأمر..."
																	className="truncate"
																>
																	{selectedOwner?.name}
																</ComboboxValue>
															</ComboboxTrigger>
															<ComboboxContent dir={dir}>
																<div className="flex w-full justify-start p-1.5">
																	<Button
																		type="button"
																		variant="ghost"
																		size="sm"
																		className="h-7 w-full gap-1 text-xs"
																		onClick={() => {
																			setOwnerComboOpen(false);
																			setOwnerSheetOpen(true);
																		}}
																	>
																		<IconPlus className="size-3.5" />
																		إضافة وليّ أمر جديد
																	</Button>
																</div>
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
																disabled={!ownerId || patientsLoading}
															>
																<ComboboxValue
																	placeholder={
																		ownerId ? "اختر الطفل..." : "اختر وليّ الأمر أولًا..."
																	}
																	className="truncate"
																>
																	{selectedPatient?.name}
																</ComboboxValue>
															</ComboboxTrigger>
															<ComboboxContent dir={dir}>
																<div className="flex w-full justify-start p-1.5">
																	<Button
																		type="button"
																		variant="ghost"
																		size="sm"
																		className="h-7 w-full gap-1 text-xs"
																		onClick={() => {
																			setPatientComboOpen(false);
																			setPatientSheetOpen(true);
																		}}
																	>
																		<IconPlus className="size-3.5" />
																		إضافة طفل جديد
																	</Button>
																</div>
																<ComboboxList>
																	{!ownerId ? (
																		<ComboboxEmpty>اختر وليّ الأمر أولًا</ComboboxEmpty>
																	) : filteredPatients.length === 0 ? (
																		<ComboboxEmpty>لا يوجد أطفال لهذا وليّ الأمر</ComboboxEmpty>
																	) : (
																		filteredPatients.map((p) => (
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

										<FieldGroup>
											<Field data-invalid={!!form.formState.errors.consultationTypeId}>
												<FieldLabel required>سبب الزيارة</FieldLabel>
												<Popover
													open={reasonPopoverOpen}
													onOpenChange={setReasonPopoverOpen}
												>
													<PopoverTrigger asChild>
														<Button
															type="button"
															variant="outline"
															className="w-full justify-start gap-2 font-normal"
														>
															<IconStethoscope className="size-4" />
															<span className="truncate">
																{selectedConsultationType
																	? selectedConsultationType.name
																	: "اختر سبب الزيارة..."}
															</span>
														</Button>
													</PopoverTrigger>
													<PopoverContent
														align="start"
														dir={dir}
														className="w-(--radix-popover-trigger-width) p-0"
													>
														<Controller
															name="consultationTypeId"
															control={form.control}
															render={({ field }) => (
																<div className="max-h-72 space-y-1 overflow-y-auto p-2">
																	{activeConsultationTypes.length === 0 ? (
																		<p className="py-4 text-center text-sm text-muted-foreground">
																			لا توجد أسباب زيارة مُعرّفة
																		</p>
																	) : (
																		activeConsultationTypes.map((t) => {
																			const checked = field.value === t.id;
																			return (
																				<button
																					key={t.id}
																					type="button"
																					onClick={() => {
																						field.onChange(checked ? "" : t.id);
																						form.setValue(
																							"startMinute",
																							undefined as unknown as number,
																						);
																						setReasonPopoverOpen(false);
																					}}
																					className="flex w-full items-center justify-between gap-2 rounded-md p-2 text-start text-sm hover:bg-accent"
																				>
																					<span className="flex items-center gap-2">
																						<Checkbox
																							checked={checked}
																							onCheckedChange={() => undefined}
																						/>
																						{t.name}
																					</span>
																					{t.price != null && (
																						<span className="text-xs text-blue-500 tabular-nums">
																							{t.price.toLocaleString()} ر.س
																						</span>
																					)}
																				</button>
																			);
																		})
																	)}
																</div>
															)}
														/>
													</PopoverContent>
												</Popover>
												{selectedConsultationType?.price != null && (
													<p className="mt-1 text-xs text-muted-foreground">
														رسوم الكشف:{" "}
														<span className="font-mono font-medium text-foreground">
															{selectedConsultationType.price.toLocaleString()} ر.س
														</span>
													</p>
												)}
												<FieldError errors={[form.formState.errors.consultationTypeId]} />
											</Field>
										</FieldGroup>

										<FieldGroup>
											<Field>
												<Label className="text-sm text-muted-foreground">
													ملاحظات (اختياري)
												</Label>
												<Textarea
													className="min-h-20"
													placeholder="أضف أي ملاحظات سريرية..."
													{...form.register("clinicalNotes")}
												/>
											</Field>
										</FieldGroup>

										<FileUploadList>
											{(field.value ?? []).map((file) => (
												<FileUploadItem
													key={`${file.name}-${file.lastModified}`}
													value={file}
													className="min-w-0 gap-3 overflow-hidden"
												>
													<div className="flex min-w-0 w-full items-center gap-3 overflow-hidden">
														<FileUploadItemPreview className="size-11 rounded-md" />
														<div className="min-w-0 flex-1 overflow-hidden">
															<span
																className="block truncate font-medium text-sm"
																dir="ltr"
																title={file.name}
															>
																{trimFileName(file.name)}
															</span>
															<span
																className="block truncate text-muted-foreground text-xs"
																dir="ltr"
															>
																{formatFileSize(file.size)}
															</span>
														</div>
														<FileUploadItemDelete asChild>
															<Button
																variant="ghost"
																size="icon"
																className="size-8 shrink-0"
																aria-label="حذف المرفق"
															>
																<IconX className="size-4" />
															</Button>
														</FileUploadItemDelete>
													</div>
												</FileUploadItem>
											))}
										</FileUploadList>
									</div>

									<Separator />

									{/* Toolbar */}
									<div className="flex flex-wrap gap-1 p-2">
										{/* Staff select */}
										<Controller
											control={form.control}
											name="staffId"
											render={({ field }) => {
												if (staffLoading) {
													return (
														<Button
															type="button"
															variant="outline"
															size="sm"
															className="h-8 gap-2 px-3"
															disabled
														>
															<IconStethoscope className="size-4" />
															<span>المدرّب</span>
														</Button>
													);
												}

												if (staff.length === 0) {
													return (
														<Popover>
															<PopoverTrigger asChild>
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	className="h-9 gap-2 px-3"
																>
																	<IconStethoscope className="size-4" />
																	<span>المدرّب</span>
																</Button>
															</PopoverTrigger>
															<PopoverContent
																align="start"
																dir={dir}
																className="w-52 p-3 space-y-2"
															>
																<p className="text-center text-sm text-muted-foreground">
																	لا يوجد مدرّبين متاحون
																</p>
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	className="w-full gap-1 text-xs"
																	onClick={() => {
																		setOpen(false);
																		void navigate({ to: "/services/staff" });
																	}}
																>
																	<IconPlus className="size-3.5" />
																	إضافة مدرّب جديد
																</Button>
															</PopoverContent>
														</Popover>
													);
												}

												return (
													<Select
														value={field.value || ""}
														onValueChange={(value) => {
															field.onChange(value || "");
															form.setValue("startMinute", undefined as unknown as number);
														}}
													>
														<SelectTrigger
															dir={dir}
															className="h-9 w-auto gap-2 px-3"
														>
															{selectedStaff ? (
																<div className="flex items-center gap-2">
																	<Avatar className="size-5">
																		<AvatarFallback className="text-xs">
																			{selectedStaff.name.charAt(0)}
																		</AvatarFallback>
																	</Avatar>
																	<span className="truncate font-medium">
																		{selectedStaff.name}
																	</span>
																</div>
															) : (
																<div className="flex items-center gap-2">
																	<IconStethoscope className="size-4" />
																	<SelectValue placeholder="المدرّب" />
																</div>
															)}
														</SelectTrigger>
														<SelectContent
															dir={dir}
															position="popper"
														>
															<div className="flex justify-start w-full p-1.5">
																<Button
																	type="button"
																	variant="ghost"
																	size="sm"
																	className="h-7 gap-1 text-xs w-full"
																	onClick={(e) => {
																		e.preventDefault();
																		setOpen(false);
																		void navigate({ to: "/services/staff" });
																	}}
																>
																	<IconPlus className="size-3.5" />
																	إضافة مدرّب جديد
																</Button>
															</div>
															<SelectGroup>
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
															</SelectGroup>
														</SelectContent>
													</Select>
												);
											}}
										/>

										{/* Date + Time popover */}
										<Popover
											open={datePopoverOpen}
											onOpenChange={(nextOpen) => {
												setDatePopoverOpen(nextOpen);
												if (nextOpen) setRoomPopoverOpen(false);
											}}
										>
											<PopoverTrigger asChild>
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="h-9 gap-2"
												>
													<IconCalendarPlus className="size-4" />
													{dateLabel ? (
														<span className="truncate">
															{dateLabel}
															{timeLabel ? ` · ${timeLabel}` : ""}
														</span>
													) : (
														"تاريخ الزيارة"
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent
												align={isRtl ? "end" : "start"}
												dir={dir}
												className="w-[340px] space-y-2 p-3"
											>
												<Controller
													control={form.control}
													name="date"
													render={({ field }) => (
														<Calendar
															mode="single"
															className="w-full p-0"
															selected={field.value as Date | undefined}
															onSelect={(d) => {
																field.onChange(d);
																form.setValue("startMinute", undefined as unknown as number);
															}}
															disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
															locale={calendarLocale}
														/>
													)}
												/>

												<div className="space-y-1.5">
													<div className="flex items-center justify-between">
														<Label className="text-xs font-medium">وقت الإتاحة</Label>
														{totalDuration > 0 && (
															<span className="text-xs text-muted-foreground">
																المدة: {totalDuration} دقيقة
															</span>
														)}
													</div>
													<div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto">
														{!isTimePickerEnabled ? (
															<p className="col-span-3 text-center text-xs text-muted-foreground py-2">
																اختر المدرّب والتاريخ
															</p>
														) : slotsLoading ? (
															<p className="col-span-3 text-center text-xs text-muted-foreground py-2">
																جاري التحميل...
															</p>
														) : visibleSlots.length === 0 ? (
															<p className="col-span-3 text-center text-xs text-muted-foreground py-2">
																لا توجد أوقات متاحة
															</p>
														) : (
															visibleSlots.map((slot) => {
																const selected = startMinute === slot.startMinute;
																return (
																	<Controller
																		key={slot.startMinute}
																		control={form.control}
																		name="startMinute"
																		render={({ field }) => (
																			<Button
																				type="button"
																				variant={selected ? "default" : "outline"}
																				size="sm"
																				disabled={!slot.available}
																				onClick={() => {
																					field.onChange(slot.startMinute);
																					setDatePopoverOpen(false);
																				}}
																				className={cn(
																					"h-8 text-xs",
																					!slot.available && "opacity-50",
																				)}
																			>
																				{minutesToTimeLabel(slot.startMinute, lang)}
																			</Button>
																		)}
																	/>
																);
															})
														)}
													</div>
												</div>

												<Separator />

												<div className="space-y-1.5">
													<Controller
														control={form.control}
														name="whatsappReminderEnabled"
														render={({ field }) => (
															<div className="flex items-center justify-between gap-2">
																<Label
																	htmlFor="reminders"
																	className="text-sm"
																>
																	تفعيل التذكيرات
																</Label>
																<Switch
																	checked={field.value}
																	onCheckedChange={field.onChange}
																	id="reminders"
																/>
															</div>
														)}
													/>

													<Controller
														control={form.control}
														name="repeat"
														render={({ field }) => (
															<div className="space-y-1.5">
																<div className="flex items-center justify-between gap-2">
																	<Label
																		htmlFor="repeat"
																		className="text-sm"
																	>
																		تفعيل التكرار
																	</Label>
																	<Switch
																		checked={field.value}
																		onCheckedChange={(v) => {
																			field.onChange(v);
																			if (!v) {
																				form.setValue("repeatCount", undefined);
																			} else {
																				form.setValue("repeatCount", 2);
																			}
																		}}
																		id="repeat"
																	/>
																</div>

																{field.value && (
																	<div className="flex items-center gap-2 pt-1">
																		<IconInfoCircle className="size-4 shrink-0 text-muted-foreground" />
																		<span className="text-xs text-muted-foreground">
																			تكرار كل
																		</span>
																		<Controller
																			control={form.control}
																			name="repeatCount"
																			render={({ field: countField }) => (
																				<Select
																					value={String(countField.value ?? 2)}
																					onValueChange={(v) => countField.onChange(Number(v))}
																				>
																					<SelectTrigger
																						dir={dir}
																						className="h-8 w-16"
																						size="sm"
																					>
																						<SelectValue />
																					</SelectTrigger>
																					<SelectContent
																						dir={dir}
																						position="popper"
																					>
																						<SelectGroup>
																							{Array.from({ length: 9 }, (_, i) => i + 2).map(
																								(n) => (
																									<SelectItem
																										key={n}
																										value={String(n)}
																									>
																										{n}
																									</SelectItem>
																								),
																							)}
																						</SelectGroup>
																					</SelectContent>
																				</Select>
																			)}
																		/>
																		<Controller
																			control={form.control}
																			name="repeatUnit"
																			render={({ field: unitField }) => (
																				<Select
																					value={unitField.value ?? "week"}
																					onValueChange={unitField.onChange}
																				>
																					<SelectTrigger
																						dir={dir}
																						className="h-8 flex-1"
																						size="sm"
																					>
																						<SelectValue />
																					</SelectTrigger>
																					<SelectContent
																						dir={dir}
																						position="popper"
																					>
																						<SelectGroup>
																							{REPEAT_UNITS.map((u) => (
																								<SelectItem
																									key={u}
																									value={u}
																								>
																									{REPEAT_UNIT_LABELS[u]}
																								</SelectItem>
																							))}
																						</SelectGroup>
																					</SelectContent>
																				</Select>
																			)}
																		/>
																		<button
																			type="button"
																			onClick={() => {
																				field.onChange(false);
																				form.setValue("repeatCount", undefined);
																			}}
																			className="rounded-full p-0.5 my-0 text-muted-foreground hover:text-destructive"
																			aria-label="إلغاء التكرار"
																		>
																			<IconX className="size-4" />
																		</button>
																	</div>
																)}
															</div>
														)}
													/>
												</div>

												<div className="flex justify-end">
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="h-7 text-xs text-muted-foreground"
														onClick={() => {
															form.setValue("date", undefined as unknown as Date);
															form.setValue("startMinute", undefined as unknown as number);
														}}
													>
														إعادة الضبط
													</Button>
												</div>
											</PopoverContent>
										</Popover>

										{/* Room popover */}
										<Controller
											control={form.control}
											name="roomId"
											render={({ field }) => (
												<Popover
													open={roomPopoverOpen}
													onOpenChange={(nextOpen) => {
														setRoomPopoverOpen(nextOpen);
														if (nextOpen) setDatePopoverOpen(false);
													}}
												>
													<PopoverTrigger asChild>
														<Button
															type="button"
															variant="outline"
															size="sm"
															className="h-9 gap-2"
														>
															<IconMapPinFilled className="size-4" />
															<span className="truncate">
																{roomId ? "قاعة محددة" : "القاعة"}
															</span>
														</Button>
													</PopoverTrigger>
													<PopoverContent
														align="start"
														dir={dir}
														className="z-[100] w-64 p-2"
													>
														<Label className="text-xs text-muted-foreground px-1">
															اختر القاعة...
														</Label>
														<div className="mt-1 max-h-60 overflow-y-auto">
															<RoomList
																branchId={activeBranchId}
																selectedId={field.value ?? null}
																onSelect={(id) => {
																	field.onChange(id ?? undefined);
																	setRoomPopoverOpen(false);
																}}
															/>
														</div>
													</PopoverContent>
												</Popover>
											)}
										/>

										{/* Status */}
										<Controller
											control={form.control}
											name="status"
											render={({ field }) => (
												<Select
													value={field.value ?? AppointmentStatus.WAITING}
													onValueChange={field.onChange}
													onOpenChange={(nextOpen) => {
														if (nextOpen) setDatePopoverOpen(false);
													}}
												>
													<SelectTrigger
														dir={dir}
														className="h-9 w-auto gap-2 px-3"
													>
														{selectedStatus && (
															<div className="flex items-center gap-2">
																<selectedStatus.icon
																	className={cn("size-4", selectedStatus.iconClassName)}
																/>
																<span className="font-medium">{selectedStatus.label}</span>
															</div>
														)}
													</SelectTrigger>
													<SelectContent
														dir={dir}
														position="popper"
														className="z-[100]"
													>
														<SelectGroup>
															{statusOptions.map(
																({ value, label, icon: Icon, iconClassName }) => (
																	<SelectItem
																		key={value}
																		value={value}
																		textValue={label}
																	>
																		<Icon className={cn("size-4", iconClassName)} />
																		<span className="font-medium">{label}</span>
																	</SelectItem>
																),
															)}
														</SelectGroup>
													</SelectContent>
												</Select>
											)}
										/>

										{/* Priority */}
										<Controller
											control={form.control}
											name="priority"
											render={({ field }) => (
												<Select
													value={field.value ?? "NONE"}
													onValueChange={(value) =>
														field.onChange(value === "NONE" ? null : value)
													}
													onOpenChange={(nextOpen) => {
														if (nextOpen) setDatePopoverOpen(false);
													}}
												>
													<SelectTrigger
														dir={dir}
														className="h-9 w-auto gap-2 px-3"
													>
														{selectedPriority ? (
															<div className="flex items-center gap-2">
																<selectedPriority.icon
																	className={cn("size-4", selectedPriority.iconClassName)}
																/>
																<span className="font-medium">{selectedPriority.label}</span>
															</div>
														) : (
															<div className="flex items-center gap-2 text-muted-foreground">
																<IconDots className="size-4" />
																<span>بدون أولوية</span>
															</div>
														)}
													</SelectTrigger>
													<SelectContent
														dir={dir}
														position="popper"
														className="z-[100]"
													>
														<SelectGroup>
															<SelectItem
																value="NONE"
																textValue="بدون أولوية"
															>
																<IconDots className="size-4" />
																<span>بدون أولوية</span>
															</SelectItem>
															{PRIORITY_OPTIONS.map(
																({ value, label, icon: Icon, iconClassName }) => (
																	<SelectItem
																		key={value}
																		value={value}
																		textValue={label}
																	>
																		<Icon className={cn("size-4", iconClassName)} />
																		<span className="font-medium">{label}</span>
																	</SelectItem>
																),
															)}
														</SelectGroup>
													</SelectContent>
												</Select>
											)}
										/>

										<FileUploadTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												size="icon-lg"
												aria-label="إرفاق ملفات"
											>
												<IconPaperclip className="size-5" />
											</Button>
										</FileUploadTrigger>
									</div>

									{totalDuration > 0 && (
										<div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground flex justify-between">
											<span className="font-medium text-foreground">
												الإجمالي: {totalPrice.toLocaleString()} ر.س
											</span>
											<span>المدة: {totalDuration} دقيقة</span>
										</div>
									)}

									<Separator />

									<div className="flex items-center justify-between pb-2 px-3.5">
										<div className="flex items-center gap-3">
											<Controller
												control={form.control}
												name="isEmergency"
												render={({ field }) => (
													<div className="flex items-center gap-2">
														<Checkbox
															id="emergency"
															checked={field.value}
															onCheckedChange={(v) => field.onChange(v === true)}
														/>
														<Label
															htmlFor="emergency"
															className="text-sm"
														>
															حالة طوارئ
														</Label>
													</div>
												)}
											/>

											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => form.reset(initialDefaults)}
											>
												إعادة الضبط
											</Button>
										</div>

										<div className="flex items-center gap-3">
											<Controller
												control={form.control}
												name="whatsappNotification"
												render={({ field }) => (
													<div className="flex items-center gap-2">
														<Switch
															id="whatsapp"
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
														<Label
															htmlFor="whatsapp"
															className="text-sm"
														>
															إشعار عبر الواتساب
														</Label>
													</div>
												)}
											/>

											<DisabledReasonTooltip reason={missingFieldsReason}>
												<Button
													type="submit"
													size="sm"
													disabled={isSubmitDisabled}
												>
													<Kbd className="text-white">⌘↵</Kbd>
													<span>تأكيد حجز الزيارة</span>
												</Button>
											</DisabledReasonTooltip>
										</div>
									</div>
								</FileUpload>
							)}
						/>
					</form>
				</DialogContent>
			</Dialog>

			<AddOwnerSheet
				open={ownerSheetOpen}
				onClose={() => setOwnerSheetOpen(false)}
				onSuccess={async (owner) => {
					await queryClient.invalidateQueries({ queryKey: ["owners"] });
					await queryClient.invalidateQueries({ queryKey: ["patients"] });
					form.setValue("ownerId", owner.id, { shouldValidate: true });
					form.setValue("patientId", owner.patients[0]?.id ?? "", {
						shouldValidate: true,
					});
				}}
			/>
			<AddPatientSheet
				open={patientSheetOpen}
				onClose={() => setPatientSheetOpen(false)}
				defaultOwnerId={ownerId || undefined}
				onSuccess={async (patient) => {
					await queryClient.invalidateQueries({ queryKey: ["patients"] });
					form.setValue("ownerId", patient.owner?.id ?? ownerId, { shouldValidate: true });
					form.setValue("patientId", patient.id, { shouldValidate: true });
				}}
			/>
		</>
	);
}

function RoomList({
	branchId,
	selectedId,
	onSelect,
}: {
	branchId: string | undefined;
	selectedId: string | null;
	onSelect: (id: string | null) => void;
}) {
	const { rooms } = useRoomsHook(branchId);
	if (rooms.length === 0) {
		return (
			<p className="px-2 py-3 text-center text-xs text-muted-foreground">لا توجد غرف متاحة</p>
		);
	}
	return (
		<div className="space-y-0.5">
			{rooms.map((r) => {
				const checked = selectedId === r.id;
				return (
					<button
						key={r.id}
						type="button"
						onClick={() => onSelect(checked ? null : r.id)}
						className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
					>
						<Checkbox
							checked={checked}
							onCheckedChange={() => undefined}
						/>
						<IconDoor className="size-4 text-muted-foreground" />
						<span className="flex-1 truncate text-start">{r.name}</span>
					</button>
				);
			})}
		</div>
	);
}

function useAppointmentBranch() {
	const { branches } = useBranchesList();
	const branch = branches.find((item) => item.type === "PRIMARY") ?? branches[0];
	const queueEnabled = branch ? parseBranchSettings(branch.settings).queue.enabled : false;
	return { branchId: branch?.id, queueEnabled };
}

// Import-deferred hooks (avoid circular issues from re-export above)
import { useBranches as useBranchesList } from "@/features/settings/branches/hooks/use-branches";
import { useRooms as useRoomsHook } from "@/features/settings/branches/hooks/use-rooms";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";
