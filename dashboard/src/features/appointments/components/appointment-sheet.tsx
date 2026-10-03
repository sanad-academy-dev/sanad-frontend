import {
	IconBookmark,
	IconCalendarCheck,
	IconCalendarRepeat,
	IconCalendarX,
	IconChevronRight,
	IconClock,
	IconCopy,
	IconCreditCard,
	IconDoor,
	IconDots,
	IconFlag,
	IconLink,
	IconLock,
	IconMessage,
	IconPlus,
	IconPrinter,
	IconRefresh,
	IconUser,
	IconVideo,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { OwnerMembershipBadge } from "@/features/accounting/memberships/components/owner-membership-badge";
import { CancelAppointmentDialog } from "@/features/appointments/components/cancel-appointment-dialog";
import { EditRecurrenceDialog } from "@/features/appointments/components/edit-recurrence-dialog";
import { ReferAppointmentDialog } from "@/features/appointments/components/refer-appointment-dialog";
import { RescheduleAppointmentDialog } from "@/features/appointments/components/reschedule-appointment-dialog";
import { InvoiceTab } from "@/features/appointments/components/tabs/invoice-tab";
import { VisitInfoTab } from "@/features/appointments/components/tabs/visit-info-tab";
import { VisitRecordTab } from "@/features/appointments/components/tabs/visit-record-tab";
import { VisitSummarySheet } from "@/features/appointments/components/visit-summary-sheet";
import { CLIENT_TICK_MS } from "@/features/appointments/data/alert-thresholds";
import { LOCATION_OPTIONS } from "@/features/appointments/data/location-options";
import { STATUS_ACTION_CONFIG, STATUS_META } from "@/features/appointments/data/status-meta";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import { useUpdateAppointmentLocation } from "@/features/appointments/hooks/use-update-appointment-location";
import { useUpdateAppointmentStatus } from "@/features/appointments/hooks/use-update-appointment-status";
import type { AppointmentSheetProps } from "@/features/appointments/types/appointment-sheet.types";
import { AdmitInpatientDialog } from "@/features/care/inpatients/components/admit-inpatient-dialog";
import { useSchedulingSettings } from "@/features/settings/scheduling/hooks/use-scheduling-settings";
import { SessionPrejoinDialog } from "@/features/video-calls/components/session-prejoin-dialog";
import type { AppointmentLocation } from "@/generated/prisma/enums";
import { AppointmentStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { REPEAT_UNIT_LABELS } from "@sanad/contracts/runtime/server/appointments/appointments.type";
import {
	canTransition,
	invalidTransitionMessage,
	isTerminalStatus,
	locationChangeBlock,
	locationChangeBlockMessage,
	rescheduleNoticeHours,
} from "@sanad/contracts/runtime/server/appointments/appointments.workflow";

const DUMMY_PHONE = "0567011406";
const DUMMY_REGISTRATION_DATE = "1/01/2025";

function Initials({ name, className }: { name: string; className?: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div
			className={
				className ??
				"flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white"
			}
		>
			{initials}
		</div>
	);
}

export function AppointmentSheet({ card, open, onClose }: AppointmentSheetProps) {
	const { isRtl } = useI18n();
	const side = isRtl ? "left" : "right";
	const { appointment } = useAppointment(card?.id ?? null);
	const { updateStatus, isPending: isUpdatingStatus } = useUpdateAppointmentStatus();
	const { updateLocation, isPending: isUpdatingLocation } = useUpdateAppointmentLocation(
		card?.id ?? "",
	);

	const [rescheduleOpen, setRescheduleOpen] = useState(false);
	const [cancelOpen, setCancelOpen] = useState(false);
	const [summaryOpen, setSummaryOpen] = useState(false);
	// [IP1] «تنويم» يفتح نافذة الإدخال بعد نقل الحالة — النقل وحده كان يترك
	// الزيارة بلافتة «منوَّم» بلا إقامة ولا ورقة علاج ولا قفص.
	const [admitOpen, setAdmitOpen] = useState(false);
	const [prejoinOpen, setPrejoinOpen] = useState(false);
	const [nowMs, setNowMs] = useState(() => Date.now());

	useEffect(() => {
		if (!open) return;
		const id = setInterval(() => setNowMs(Date.now()), CLIENT_TICK_MS);
		return () => clearInterval(id);
	}, [open]);

	// تبديل نوع الزيارة: نفس حارس الخادم (appointments.workflow) — الحالة + أدنى مدة لتبديل الحجز.
	// nowMs يتحدّث دوريًا، فيُقفل الحقل تلقائيًا عند دخول المهلة والزيارة مفتوحة.
	const { schedulingSettings } = useSchedulingSettings();
	const locationBlock = appointment
		? locationChangeBlock({
				status: appointment.status,
				startsAt: new Date(appointment.startsAt),
				noticeHours: rescheduleNoticeHours(schedulingSettings),
				now: new Date(nowMs),
			})
		: null;

	const statusMeta = appointment ? STATUS_META[appointment.status] : null;
	const StatusIcon = statusMeta?.icon ?? null;
	const action = appointment ? STATUS_ACTION_CONFIG[appointment.status] : undefined;

	// الزيارة عن بعد: الدفع أولًا — على "مجدول" نعرض رابط الدفع (ينقلها لتسجيل دخول)،
	// وزر "دخول الجلسة" يبدأ من "تسجيل دخول" ويحل محل "بدء الفحص"،
	// وأثناء "جاري الدورة" يظهر بجانب "إنهاء الزيارة" لإعادة الدخول للمكالمة
	const showPaymentLink =
		!!appointment &&
		appointment.location === "REMOTE" &&
		appointment.status === AppointmentStatus.SCHEDULED;
	const canEnterRemoteSession =
		!!appointment &&
		appointment.location === "REMOTE" &&
		(
			[AppointmentStatus.CHECK_IN, AppointmentStatus.IN_SERVICE] as AppointmentStatus[]
		).includes(appointment.status);
	const enterSessionReplacesAction =
		canEnterRemoteSession && appointment.status === AppointmentStatus.CHECK_IN;

	const copyPaymentLink = async () => {
		if (!appointment) return;
		const room = `${appointment.clinicId}:${appointment.id}`;
		await navigator.clipboard.writeText(
			`${window.location.origin}/pay/${encodeURIComponent(room)}`,
		);
		toast.success("تم نسخ رابط الدفع");
	};

	// إظهار التبويبات حسب مرحلة سير العمل:
	// - الفحص السريري يظهر بعد "بدء الفحص" (IN_SERVICE فأحدث)
	// - الفاتورة تظهر دائمًا (في كل مراحل الزيارة) طالما الزيارة محمّلة
	const showClinicalExamTab =
		!!appointment &&
		(
			[
				AppointmentStatus.IN_SERVICE,
				AppointmentStatus.HOSPITALIZED,
				AppointmentStatus.AWAITING_PAYMENT,
				AppointmentStatus.DONE,
			] as AppointmentStatus[]
		).includes(appointment.status);
	const showInvoiceTab = !!appointment;

	// التبويب النشط متحكَّم به حتى لا يبقى مفتوحًا على تبويب أُخفي بتغيّر الحالة
	const cardId = card?.id ?? null;
	const [activeTab, setActiveTab] = useState("visit-info");
	// ابدأ دائمًا على "معلومات الزيارة" عند فتح موعد آخر
	// biome-ignore lint/correctness/useExhaustiveDependencies: نُعيد الضبط عند تغيّر الموعد فقط
	useEffect(() => {
		setActiveTab("visit-info");
	}, [cardId]);
	useEffect(() => {
		if (activeTab === "clinical-exam" && !showClinicalExamTab) setActiveTab("visit-info");
		if (activeTab === "invoice" && !showInvoiceTab) setActiveTab("visit-info");
	}, [activeTab, showClinicalExamTab, showInvoiceTab]);

	// حارس "تمت" (نسخة الواجهة — الخادم هو المرجع): فحص مكتمل + فاتورة مسدَّدة.
	// بدون فاتورة بعد، نقرّب المستحق من بنود الدورات + رسم الكشف (الأصناف يحسمها الخادم).
	const isInvoiceSettled = (() => {
		if (!appointment) return false;
		if (appointment.invoice) {
			return appointment.invoice.status === "PAID" || Number(appointment.invoice.total) <= 0;
		}
		const approxDue =
			appointment.services.reduce(
				(sum, row) => sum + Number(row.priceSnapshot) * row.quantity,
				0,
			) + Number(appointment.consultationFeeSnapshot ?? 0);
		return approxDue <= 0;
	})();
	// "إنهاء الزيارة/التنويم" (→ بإنتظار الدفع) و"تأكيد الدفع" (→ تمت) يتطلبان اكتمال الفحص السريري
	const isExamIncompleteForFinish =
		!!action &&
		(action.nextStatus === AppointmentStatus.AWAITING_PAYMENT ||
			action.nextStatus === AppointmentStatus.DONE) &&
		!appointment?.clinicalExam?.completedAt;
	const isPaymentPendingForDone =
		!!action &&
		action.nextStatus === AppointmentStatus.DONE &&
		!isExamIncompleteForFinish &&
		!isInvoiceSettled;
	const actionDisabledReason = isExamIncompleteForFinish
		? "أكمل الفحص السريري أولاً"
		: isPaymentPendingForDone
			? "سدِّد الفاتورة أولاً"
			: null;

	const delayMinutes =
		card?.column === "scheduled" ? Math.floor((nowMs - card.startsAt.getTime()) / 60_000) : 0;
	const isLate = delayMinutes > 0;

	const copyPhone = () => {
		navigator.clipboard.writeText(DUMMY_PHONE);
		toast.success("تم النسخ");
	};

	const handleAction = () => {
		if (!appointment || !action) return;
		// "إنهاء الزيارة" (جاري الدورة → انتظار الدفع) يفتح ملخّص الزيارة أولاً
		// لمراجعة/تعديل الأصناف المستدورة قبل المضي إلى الدفع، بدل الإنهاء المباشر.
		if (
			appointment.status === AppointmentStatus.IN_SERVICE &&
			action.nextStatus === AppointmentStatus.AWAITING_PAYMENT
		) {
			setSummaryOpen(true);
			return;
		}
		void updateStatus({ id: appointment.id, status: action.nextStatus });
	};

	const handleStatusChange = (value: string) => {
		if (!appointment) return;
		const next = value as AppointmentStatus;
		if (next === appointment.status) return;
		if (!canTransition(appointment.status, next)) {
			toast.error(invalidTransitionMessage(appointment.status, next));
			return;
		}
		if (
			next === AppointmentStatus.AWAITING_PAYMENT &&
			!appointment.clinicalExam?.completedAt
		) {
			toast.error("أكمل الفحص السريري أولاً");
			return;
		}
		if (next === AppointmentStatus.DONE) {
			if (!appointment.clinicalExam?.completedAt) {
				toast.error("أكمل الفحص السريري أولاً");
				return;
			}
			if (!isInvoiceSettled) {
				toast.error("سدِّد الفاتورة أولاً");
				return;
			}
		}
		// باب الدخول إلى التنويم: تُنقل الزيارة ثم تُفتح نافذة الإدخال فورًا
		if (next === AppointmentStatus.HOSPITALIZED) {
			void Promise.resolve(updateStatus({ id: appointment.id, status: next })).then(() =>
				setAdmitOpen(true),
			);
			return;
		}
		void updateStatus({ id: appointment.id, status: next });
	};

	return (
		<>
			<Sheet
				open={open}
				onOpenChange={(isOpen) => {
					if (!isOpen) onClose();
				}}
			>
				<SheetContent
					side={side}
					showCloseButton={false}
					className="max-w-2/3! w-full gap-0"
					dir="rtl"
				>
					<SheetHeader className="p-0">
						<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
							<SheetTitle className="flex items-center gap-2 font-bold text-lg">
								<p>الزيارات</p>
								<IconChevronRight className="size-4 rotate-180" />
								{card && (
									<>
										<p>{card.patientName}</p>
										<span className="text-xs font-normal tabular-nums text-muted-foreground">
											{card.code}
										</span>
									</>
								)}
								<DropdownMenu dir="rtl">
									<DropdownMenuTrigger asChild>
										<Button
											size="icon"
											variant="ghost"
											className="size-7"
										>
											<IconDots className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">
										{appointment &&
											!isTerminalStatus(appointment.status) &&
											new Date(appointment.startsAt).getTime() - Date.now() >=
												24 * 60 * 60 * 1000 && (
												<DropdownMenuItem onSelect={() => setRescheduleOpen(true)}>
													<IconCalendarRepeat className="size-4" />
													إعادة جدولة
												</DropdownMenuItem>
											)}
										{appointment &&
											canTransition(appointment.status, AppointmentStatus.CANCELLED) && (
												<DropdownMenuItem
													className="text-destructive focus:text-destructive"
													onSelect={() => setCancelOpen(true)}
												>
													<IconCalendarX className="size-4" />
													إلغاء الزيارة
												</DropdownMenuItem>
											)}
										<DropdownMenuItem>
											<IconPrinter className="size-4" />
											طباعة
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SheetTitle>

							<div className="flex items-center gap-1.5">
								{showPaymentLink && (
									<Button
										size="sm"
										variant="outline"
										className="gap-1.5 text-foreground"
										onClick={() => void copyPaymentLink()}
									>
										<IconCreditCard className="size-3.5" />
										نسخ رابط الدفع
									</Button>
								)}
								{canEnterRemoteSession && (
									<Button
										size="sm"
										className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
										onClick={() => setPrejoinOpen(true)}
									>
										<IconVideo className="size-3.5" />
										دخول الجلسة
									</Button>
								)}
								{action &&
									!enterSessionReplacesAction &&
									(actionDisabledReason ? (
										<Tooltip>
											<TooltipTrigger asChild>
												<span>
													<Button
														size="sm"
														className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
														disabled
													>
														<IconBookmark className="size-3.5" />
														{action.label}
													</Button>
												</span>
											</TooltipTrigger>
											<TooltipContent>
												<p>{actionDisabledReason}</p>
											</TooltipContent>
										</Tooltip>
									) : (
										<Button
											size="sm"
											className="gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
											onClick={handleAction}
											disabled={isUpdatingStatus}
										>
											<IconBookmark className="size-3.5" />
											{action.label}
										</Button>
									))}
								<Button
									size="icon"
									variant="ghost"
									className="size-8"
								>
									<IconLink className="size-4" />
								</Button>
								{appointment?.status === AppointmentStatus.WAITING && (
									<DropdownMenu dir="rtl">
										<DropdownMenuTrigger asChild>
											<Button
												size="icon"
												variant="ghost"
												className="size-8"
											>
												<IconCalendarCheck className="size-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() =>
													void updateStatus({
														id: appointment.id,
														status: AppointmentStatus.SCHEDULED,
													})
												}
												disabled={isUpdatingStatus}
											>
												<IconCalendarCheck className="size-4" />
												قبول الزيارة
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-destructive focus:text-destructive"
												onSelect={() => setCancelOpen(true)}
											>
												<IconCalendarX className="size-4" />
												رفض الزيارة
											</DropdownMenuItem>
											<DropdownMenuItem onSelect={() => setRescheduleOpen(true)}>
												<IconCalendarRepeat className="size-4" />
												إعادة الجدولة
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								)}
								<Button
									size="icon"
									variant="ghost"
									className="size-8"
									onClick={onClose}
								>
									<IconX className="size-4" />
								</Button>
							</div>
						</div>
					</SheetHeader>

					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex flex-1 flex-col gap-0 overflow-hidden"
					>
						<div className="px-3 py-2">
							<TabsList className="w-full justify-end">
								{showInvoiceTab && (
									<TabsTrigger
										className="flex-none px-2.5 py-2"
										value="invoice"
									>
										الفاتورة
										{appointment && appointment.services.length > 0 && (
											<span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
												{appointment.services.length}
											</span>
										)}
									</TabsTrigger>
								)}

								{showClinicalExamTab && (
									<TabsTrigger
										className="flex-none px-2.5 py-2"
										value="clinical-exam"
									>
										الفحص السريري
									</TabsTrigger>
								)}

								<TabsTrigger
									className="flex-none px-2.5 py-2"
									value="visit-info"
								>
									معلومات الزيارة
								</TabsTrigger>
							</TabsList>
						</div>

						<Separator />

						<div className="grid min-h-0 flex-1 grid-cols-10 overflow-hidden">
							<div
								className="col-span-2 flex flex-col gap-6 overflow-y-auto border-s p-4"
								dir="rtl"
							>
								<div className="flex flex-col gap-3">
									<p className="font-semibold text-sm">التفاصيل</p>

									{locationBlock ? (
										// مقفول: سطر ثابت مثل بقية التفاصيل + قفل وتلميح يشرح السبب
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="flex h-7 w-fit cursor-default items-center gap-1.5">
													{(() => {
														const selected =
															LOCATION_OPTIONS.find(
																(o) => o.value === appointment?.location,
															) ?? LOCATION_OPTIONS[0];
														return (
															<>
																<selected.icon className="size-4 text-muted-foreground" />
																<span className="text-sm">{selected.label}</span>
															</>
														);
													})()}
													<IconLock className="size-3.5 text-muted-foreground" />
												</div>
											</TooltipTrigger>
											<TooltipContent>
												{locationChangeBlockMessage(locationBlock)}
											</TooltipContent>
										</Tooltip>
									) : (
										<Select
											dir="rtl"
											value={appointment?.location ?? "IN_CLINIC"}
											onValueChange={(v) => void updateLocation(v as AppointmentLocation)}
											disabled={!appointment || isUpdatingLocation}
										>
											<SelectTrigger className="h-7 w-fit gap-1.5 border-none bg-transparent p-0 text-sm shadow-none">
												{(() => {
													const selected =
														LOCATION_OPTIONS.find((o) => o.value === appointment?.location) ??
														LOCATION_OPTIONS[0];
													return (
														<div className="flex items-center gap-1.5">
															<selected.icon className="size-4 text-muted-foreground" />
															<span className="text-sm">{selected.label}</span>
														</div>
													);
												})()}
											</SelectTrigger>
											{/* popper إجباري: تموضع item-aligned الافتراضي يظهر خارج الشاشة في RTL */}
											<SelectContent
												dir="rtl"
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

									<div className="flex items-center gap-1.5">
										<IconDoor className="size-4 text-muted-foreground" />
										<span className="text-sm">{appointment?.room?.name ?? "بدون قاعة"}</span>
									</div>

									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-1.5">
											<IconClock className="size-4 text-muted-foreground" />
											<span className="text-sm">{card?.dateLabel ?? "اليوم"}</span>
										</div>
										{appointment &&
											new Date(appointment.startsAt).getTime() - Date.now() >=
												24 * 60 * 60 * 1000 && (
												<RescheduleAppointmentDialog
													appointmentId={appointment.id}
													appointmentCode={appointment.code}
													patientName={appointment.patient.name}
													staffId={appointment.staffId}
													durationMinutes={appointment.durationMinutes}
													startsAt={new Date(appointment.startsAt)}
													trigger={
														<Button
															size="xs"
															variant="outline"
															className="h-7 text-xs"
														>
															إعادة الجدولة
														</Button>
													}
												/>
											)}
										{appointment && (
											<RescheduleAppointmentDialog
												open={rescheduleOpen}
												onOpenChange={setRescheduleOpen}
												appointmentId={appointment.id}
												appointmentCode={appointment.code}
												patientName={appointment.patient.name}
												staffId={appointment.staffId}
												durationMinutes={appointment.durationMinutes}
												startsAt={new Date(appointment.startsAt)}
											/>
										)}
										{appointment && (
											<CancelAppointmentDialog
												open={cancelOpen}
												onOpenChange={setCancelOpen}
												appointmentId={appointment.id}
												appointmentCode={appointment.code}
												patientName={appointment.patient.name}
											/>
										)}
									</div>

									{appointment?.recurringGroupId && appointment.repeatUnit && (
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-1.5">
												<IconRefresh className="size-4 text-muted-foreground" />
												<span className="text-sm">
													{`مرة كل ${REPEAT_UNIT_LABELS[appointment.repeatUnit]}`}
													{appointment.recurringIndex != null &&
														appointment.recurringTotal != null &&
														` (${appointment.recurringIndex}/${appointment.recurringTotal})`}
												</span>
											</div>
											<EditRecurrenceDialog
												appointmentId={appointment.id}
												recurringGroupId={appointment.recurringGroupId}
												currentRepeatUnit={appointment.repeatUnit}
												currentRepeatTotal={appointment.recurringTotal ?? 1}
												trigger={
													<Button
														size="xs"
														variant="outline"
														className="h-7 text-xs"
													>
														تعديل التكرار
													</Button>
												}
											/>
										</div>
									)}

									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-1.5">
											<IconClock className="size-4 text-muted-foreground" />
											<span className="text-sm">{card?.duration ?? "20 دقيقة"}</span>
										</div>
										{isLate && (
											<span className="text-sm font-medium text-red-500">
												تأخر {delayMinutes} دقيقة
											</span>
										)}
									</div>

									{appointment && statusMeta && StatusIcon && (
										<div className="flex items-center gap-1.5">
											<IconFlag className="size-4 shrink-0 text-red-500" />
											<span className="text-sm text-muted-foreground">تغيير الحالة:</span>
											<Select
												dir="rtl"
												value={appointment.status}
												onValueChange={handleStatusChange}
												disabled={
													isUpdatingStatus || appointment.status === AppointmentStatus.WAITING
												}
											>
												<SelectTrigger className="h-7 w-auto gap-1.5 border-0 bg-transparent p-0 shadow-none focus:ring-0">
													<div className={`flex items-center gap-1.5 ${statusMeta.color}`}>
														<StatusIcon className="size-4 shrink-0" />
														<span className="text-sm font-medium">{statusMeta.label}</span>
													</div>
												</SelectTrigger>
												<SelectContent
													position="popper"
													className="z-[100]"
												>
													{Object.entries(STATUS_META)
														.filter(
															([value]) =>
																value === appointment.status ||
																canTransition(appointment.status, value as AppointmentStatus),
														)
														.map(([value, meta]) => {
															const Icon = meta.icon;
															return (
																<SelectItem
																	key={value}
																	value={value}
																>
																	<div className={`flex items-center gap-1.5 ${meta.color}`}>
																		<Icon className="size-4 shrink-0" />
																		<span>{meta.label}</span>
																	</div>
																</SelectItem>
															);
														})}
												</SelectContent>
											</Select>
										</div>
									)}
								</div>

								{/* Owner */}
								{card && (
									<div className="flex flex-col gap-3">
										<div className="flex items-center justify-between gap-2">
											<div className="flex flex-col gap-1.5">
												<div className="flex items-center gap-1.5">
													<Initials name={card.ownerName} />
													<span className="text-sm font-medium">{card.ownerName}</span>
												</div>
												{/* [MI-P2] شارة عضوية وليّ الأمر — لا تعرض شيئًا لغير الأعضاء */}
												<OwnerMembershipBadge ownerId={card.ownerId} />
											</div>
											<Button
												asChild
												size="xs"
												variant="outline"
												className="h-7 text-xs"
											>
												<a href={`sms:${DUMMY_PHONE}`}>
													<IconMessage className="size-3" />
													إرسال رسالة
												</a>
											</Button>
										</div>

										<div className="flex items-center justify-between gap-2">
											<span
												className="text-sm tabular-nums"
												dir="ltr"
											>
												{DUMMY_PHONE}
											</span>
											<Button
												size="xs"
												variant="outline"
												className="h-7 text-xs"
												onClick={copyPhone}
											>
												<IconCopy className="size-3" />
												نسخ
											</Button>
										</div>
									</div>
								)}

								{/* Doctor */}
								{card && (
									<div className="flex flex-col gap-3">
										<p className="font-semibold text-sm">المدرّب</p>
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-1.5">
												<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
													{card.doctorInitials}
												</div>
												<span className="text-sm font-medium">{card.doctorName}</span>
											</div>
											<Button
												asChild
												size="xs"
												variant="outline"
												className="h-7 text-xs"
											>
												<a href={`sms:${DUMMY_PHONE}`}>
													<IconMessage className="size-3" />
													إرسال رسالة
												</a>
											</Button>
										</div>

										<div className="flex items-center justify-between gap-2">
											<span
												className="text-sm tabular-nums"
												dir="ltr"
											>
												{DUMMY_PHONE}
											</span>
											<Button
												size="xs"
												variant="outline"
												className="h-7 text-xs"
												onClick={copyPhone}
											>
												<IconCopy className="size-3" />
												نسخ
											</Button>
										</div>
									</div>
								)}

								{appointment &&
									appointment.status !== AppointmentStatus.DONE &&
									appointment.status !== AppointmentStatus.CANCELLED && (
										<div className="flex flex-col gap-3">
											<p className="font-semibold text-sm">إحالة</p>
											<ReferAppointmentDialog
												appointmentId={appointment.id}
												appointmentCode={appointment.code}
												patientName={appointment.patient.name}
												currentStaffId={appointment.staffId}
												trigger={
													<Button
														variant="outline"
														size="sm"
														className="h-8 w-fit gap-1.5"
													>
														<IconPlus className="size-3.5" />
														إحالة إلى مدرّب
													</Button>
												}
											/>
										</div>
									)}

								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-1.5">
										<IconUser className="size-4 text-muted-foreground" />
										<span className="text-sm font-medium">وقت التسجيل للزيارة</span>
									</div>
									<span
										className="text-sm tabular-nums"
										dir="ltr"
									>
										{DUMMY_REGISTRATION_DATE}
									</span>
								</div>
							</div>

							<div className="col-span-8 flex flex-col overflow-hidden">
								{card && (
									<>
										<VisitInfoTab appointmentId={card.id} />
										{showClinicalExamTab && <VisitRecordTab appointmentId={card.id} />}
										{showInvoiceTab && <InvoiceTab appointmentId={card.id} />}
									</>
								)}
							</div>
						</div>
					</Tabs>
				</SheetContent>
			</Sheet>

			<VisitSummarySheet
				appointmentId={card?.id ?? null}
				open={summaryOpen}
				onOpenChange={setSummaryOpen}
			/>

			{appointment && (
				<AdmitInpatientDialog
					open={admitOpen}
					onOpenChange={setAdmitOpen}
					defaultPatientId={appointment.patient.id}
					appointmentId={appointment.id}
				/>
			)}

			{appointment && (
				<SessionPrejoinDialog
					appointmentId={appointment.id}
					status={appointment.status}
					patientName={appointment.patient.name}
					open={prejoinOpen}
					onOpenChange={setPrejoinOpen}
				/>
			)}
		</>
	);
}
