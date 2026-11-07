import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import {
	IconArrowRight,
	IconCheck,
	IconBuildingCommunity,
	IconChevronDown,
	IconClock,
	IconLoader2,
	IconPhone,
	IconSparkles,
	IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AppointmentPickerPopover } from "../appointment-picker-popover";
import { RoomPickerPopover } from "../room-picker-popover";
import { PriorityPickerPopover } from "../priority-picker-popover";
import {
	RegistrationDrawerHeader,
	RegistrationDrawerGuardianCard,
} from "./registration-drawer-header";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import {
	useDigitalRegistrationCapabilities,
	useRegistrationReviewers,
	useRescheduleRequest,
} from "../../hooks/use-digital-registration";
import {
	generateRescheduleMessage,
	generateScheduleMessage,
} from "../../utils/ai-templates";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import {
	formatAppointmentDateTime,
	formatAppointmentDate,
	DEFAULT_CLINIC_TIMEZONE,
} from "../../utils/date-format";

interface RescheduleRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	/** Staff ID selected from the request sidebar; it is only committed with the schedule. */
	initialStaffId?: string | null;
	onSuccess?: () => void;
	isExpanded?: boolean;
}

const RESCHEDULE_REASONS = [
	"المراجع لم يحضر في الموعد",
	"أجازة في المركز",
	"عدم توافر مقاعد شاغرة حالياً",
	"طلب ولي الأمر تأجيل الموعد",
	"ظروف طارئة للأخصائي المتابع",
	"سبب آخر",
];

export function RescheduleRequestDialog({
	request,
	open,
	onOpenChange,
	campaignId = "",
	initialStaffId = null,
	onSuccess,
	isExpanded = false,
}: RescheduleRequestDialogProps) {
	const hasExistingAppointment = Boolean(
		request?.appointmentDate ||
		(request?.assessmentAppointment && request.assessmentAppointment.status !== "CANCELLED") ||
		request?.appointmentId
	);
	const isReschedule = hasExistingAppointment;

	const [enableMessage, setEnableMessage] = useState(true);
	const [reason, setReason] = useState<string>("المراجع لم يحضر في الموعد");
	const [customReason, setCustomReason] = useState("");
	const [priority, setPriority] = useState<string>(request?.priority || "بدون أولوية");
	const [newDate, setNewDate] = useState("");
	const [staffId, setStaffId] = useState<string | null>(
		request?.assessmentAppointment?.staffId || request?.assignedStaff?.id || request?.assignedStaffId || null,
	);
	const [interviewMode, setInterviewMode] = useState<"IN_CLINIC" | "REMOTE">(
		request?.interviewMode === "REMOTE" ? "REMOTE" : "IN_CLINIC",
	);
	const [roomName, setRoomName] = useState(request?.roomName || "الغرفة");
	const [roomId, setRoomId] = useState<string | null>(request?.roomId || null);
	const [messageText, setMessageText] = useState("");
	const [notifyEmail, setNotifyEmail] = useState(false);

	const [staffPopoverOpen, setStaffPopoverOpen] = useState(false);
	const appliedInitialStaffIdRef = useRef<string | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { clinicInfo } = useClinicInfo();
	const clinicTimezone = clinicInfo?.timezone || DEFAULT_CLINIC_TIMEZONE;
	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);

	const { data: staff = [], isLoading: staffLoading } = useRegistrationReviewers();
	const rescheduleMutation = useRescheduleRequest(campaignId);

	useEffect(() => {
		if (open && request) {
			const rawDate = request?.appointmentDate || request?.assessmentAppointment?.startsAt;
			if (rawDate) {
				const d = new Date(rawDate);
				if (!Number.isNaN(d.getTime()) && d > new Date()) {
					setNewDate(d.toISOString().slice(0, 16));
				} else {
					setNewDate("");
				}
			} else {
				setNewDate("");
			}
			const requestInterviewMode = request.interviewMode === "REMOTE" ? "REMOTE" : "IN_CLINIC";
			setInterviewMode(requestInterviewMode);
			setRoomName(requestInterviewMode === "IN_CLINIC" ? request.roomName || "الغرفة" : "الغرفة");
			setRoomId(requestInterviewMode === "IN_CLINIC" ? request.roomId || null : null);
			setPriority(request.priority || "بدون أولوية");
			setCustomReason("");
			setReason(RESCHEDULE_REASONS[0]);
			setMessageText("");
			setEnableMessage(true);
			setNotifyEmail(false);
		}
	}, [open, request]);

	// إغلاق اللوحة عند الضغط على مفتاح Escape
	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onOpenChange(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, onOpenChange]);

	// معالج تمرير الماوس بالـ wheel لضمان التمرير السلس دائماً عبر عجلة الماوس
	const handleDrawerWheel = (e: React.WheelEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement | null;
		if (target?.tagName === "TEXTAREA") {
			const isTextareaScrollable = target.scrollHeight > target.clientHeight;
			if (isTextareaScrollable) return;
		}
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop += e.deltaY;
		}
	};

	useEffect(() => {
		if (!open) appliedInitialStaffIdRef.current = null;
	}, [open]);

	useEffect(() => {
		if (!open || !request || staff.length === 0) return;
		setStaffId((currentStaffId) => {
			if (
				initialStaffId &&
				appliedInitialStaffIdRef.current !== initialStaffId &&
				staff.some((member) => member.staffId === initialStaffId)
			) {
				appliedInitialStaffIdRef.current = initialStaffId;
				return initialStaffId;
			}
			if (currentStaffId && staff.some((member) => member.staffId === currentStaffId)) {
				return currentStaffId;
			}
			const requestedStaffId = request.assessmentAppointment?.staffId || request.assignedStaff?.id || request.assignedStaffId;
			return staff.find((member) => member.staffId === requestedStaffId || member.userId === requestedStaffId)?.staffId || staff[0].staffId;
		});
	}, [initialStaffId, open, request, staff]);

	if (!open || !request) return null;

	const selectedStaffMember = staff.find((s) => s.staffId === staffId);

	const formattedNewDate = newDate
		? formatAppointmentDateTime(newDate, clinicTimezone)
		: "لم يُحدد بعد";

	const formattedOldDate = request.appointmentDate
		? formatAppointmentDateTime(request.appointmentDate, clinicTimezone)
		: null;

	const handleGenerateAI = () => {
		if (!newDate || Number.isNaN(new Date(newDate).getTime())) {
			toast.error("اختر تاريخ ووقت الموعد أولاً");
			return;
		}
		const formattedDate = formatAppointmentDate(newDate, clinicTimezone, "ar-EG", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

		if (isReschedule) {
			const activeReason = reason === "سبب آخر" ? customReason.trim() || "ظروف طارئة" : reason;
			const generated = generateRescheduleMessage({
				studentName: request.patientName,
				guardianName: request.guardianName,
				reason: activeReason,
				newDate: formattedDate,
			});
			setMessageText(generated);
		} else {
			const generated = generateScheduleMessage({
				studentName: request.patientName,
				guardianName: request.guardianName,
				appointmentDate: formattedDate,
				interviewMode,
			});
			setMessageText(generated);
		}
		toast.success("تم توليد نص الرسالة وقابل للتعديل");
	};

	const handleSubmit = () => {
		if (!capabilities.canSchedule) {
			toast.error("ليس لديك صلاحية جدولة أو إعادة جدولة المواعيد");
			return;
		}

		const appointmentDate = new Date(newDate);
		if (!newDate || Number.isNaN(appointmentDate.getTime()) || appointmentDate <= new Date()) {
			toast.error("يرجى اختيار تاريخ ووقت مستقبليين للموعد");
			return;
		}

		if (interviewMode === "IN_CLINIC" && !roomId) {
			toast.error("اختر الغرفة قبل حفظ موعد المقابلة في الأكاديمية");
			return;
		}

		const activeReason = isReschedule
			? (reason === "سبب آخر" ? customReason.trim() : reason)
			: undefined;

		if (isReschedule && reason === "سبب آخر" && !customReason.trim()) {
			toast.error("يرجى كتابة سبب إعادة الجدولة بالتفصيل");
			return;
		}

		const autoSubject = isReschedule
			? `إعادة جدولة موعد المقابلة - طلب #${request.code || request.id}`
			: `تثبيت موعد المقابلة - طلب #${request.code || request.id}`;

		rescheduleMutation.mutate(
			{
				requestId: request.id,
				data: {
					reason: activeReason,
					customReason: isReschedule && reason === "سبب آخر" ? customReason.trim() : undefined,
					newAppointmentDate: appointmentDate.toISOString(),
					staffId,
					interviewMode:
						interviewMode !== (request.interviewMode === "REMOTE" ? "REMOTE" : "IN_CLINIC")
							? interviewMode
							: undefined,
					roomId: interviewMode === "IN_CLINIC" ? roomId : undefined,
					subject: autoSubject,
					customMessage: enableMessage ? messageText.trim() || undefined : undefined,
					notifyEmail,
					priority: priority !== "بدون أولوية" ? priority : null,
				},
			},
			{
				onSuccess: () => {
					toast.success(
						isReschedule
							? `تمت إعادة جدولة موعد الطالب "${request.patientName}" بنجاح`
							: `تم تثبيت موعد مقابلة الطالب "${request.patientName}" بنجاح`,
					);
					onOpenChange(false);
					onSuccess?.();
				},
				onError: (err: unknown) => {
					toast.error(err instanceof Error ? err.message : "فشلت معالجة موعد المقابلة");
				},
			},
		);
	};

	return (
		<aside
			data-slot="reschedule-drawer"
			onWheel={handleDrawerWheel}
			className={cn("fixed z-50 w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]!  lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2! rounded-lg animate-in fade-in-0 duration-200 select-text", isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!")}
			dir="rtl"
		>
			{/* 1. رأس اللوحة الموحد */}
			<RegistrationDrawerHeader
				title={isReschedule ? "إعادة جدولة موعد المقابلة" : "تثبيت موعد المقابلة"}
				patientName={request.patientName}
				code={request.code}
				onClose={() => onOpenChange(false)}
			/>

			{/* 2. محتوى اللوحة القابل للتمرير بعجلة الماوس */}
			<div
				ref={scrollContainerRef}
				className="p-3.5 space-y-3.5 flex-1 min-h-0 overflow-y-auto scrollbar-thin select-text text-right"
				style={{ touchAction: "pan-y" }}
			>
				{/* بطاقة ولي الأمر الموحدة */}
				<RegistrationDrawerGuardianCard
					guardianName={request.guardianName}
					guardianPhone={request.guardianPhone}
					guardianEmail={request.guardianEmail}
					patientName={request.patientName}
				/>
				{/* قسم سبب إعادة الجدولة (يظهر فقط إذا كان للطلب موعد مسبق) */}
				{isReschedule && (
					<div className="space-y-1.5">
						<div className="flex items-center gap-1.5">
							<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
								سبب إعادة الجدولة
							</label>
							<span className="text-[9px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-1 py-0 rounded">
								مطلوب
							</span>
						</div>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-between h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 cursor-pointer"
								>
									<span className="truncate">{reason}</span>
									<IconChevronDown className="size-3.5 opacity-60 shrink-0" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] p-1" align="start">
								<p className="text-[10px] text-muted-foreground font-semibold px-2 py-1">اختر السبب...</p>
								{RESCHEDULE_REASONS.map((r) => (
									<DropdownMenuItem
										key={r}
										onClick={() => setReason(r)}
										className="text-xs cursor-pointer flex items-center justify-between"
									>
										<span>{r}</span>
										{reason === r && <IconCheck className="size-3 text-primary" />}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{reason === "سبب آخر" && (
							<Input
								value={customReason}
								onChange={(e) => setCustomReason(e.target.value)}
								placeholder="اكتب سبب إعادة الجدولة بالتفصيل..."
								className="h-8 text-xs mt-1"
							/>
						)}
					</div>
				)}

				{/* سويتش تضمين رسالة لولي الأمر */}
				<div className="flex items-center justify-between pt-1">
					<div className="flex flex-col gap-0.5">
						<label
							htmlFor="enable-msg-schedule"
							className="text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
						>
							تضمين رسالة لولي الأمر
						</label>
						<span className="text-[10px] text-muted-foreground">
							{enableMessage ? "سيتم حفظ الرسالة وإشعار ولي الأمر بالموعد" : "لن يتم إرسال أي نص مكتوب لولي الأمر"}
						</span>
					</div>
					<Switch
						id="enable-msg-schedule"
						checked={enableMessage}
						onCheckedChange={setEnableMessage}
					/>
				</div>

				{/* حقل نص الرسالة مع اقتراح مسودة الذكاء الاصطناعي */}
				{enableMessage && (
					<div className="space-y-1.5 animate-in fade-in-0 duration-150">
						<div className="flex items-center justify-between">
							<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
								نص الرسالة
							</label>
							<button
								type="button"
								onClick={handleGenerateAI}
								className="text-[10.5px] text-primary hover:underline font-bold flex items-center gap-1 transition-colors cursor-pointer"
							>
								<IconSparkles className="size-3 text-primary" />
								<span>صياغة تلقائية للرسالة</span>
							</button>
						</div>
						<Textarea
							value={messageText}
							onChange={(e) => setMessageText(e.target.value)}
							placeholder="اكتب نص الإشعار بموعد المقابلة أو انقر على «صياغة تلقائية للرسالة»..."
							className="min-h-24 text-xs leading-relaxed resize-none font-sans bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
						/>
					</div>
				)}

				{/* بانر ملخص الموعد المقارن المعتمد (يظهر فقط في إعادة الجدولة لعرض المقارنة بين الموعد السابق والجديد) */}
				{isReschedule && formattedOldDate && (
					<div className="rounded-lg bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/80 p-2.5 flex items-center justify-between text-xs gap-2">
						<div className="flex items-center gap-2 min-w-0">
							<IconClock className="size-4 text-purple-600 dark:text-purple-400 shrink-0" />
							<div className="min-w-0">
								<span className="text-[9.5px] text-muted-foreground block truncate">
									الموعد الحالي والمقترح:
								</span>
								<span className="font-bold text-purple-950 dark:text-purple-200 text-[11px] block truncate">
									<span className="line-through text-zinc-400 dark:text-zinc-500 font-normal">{formattedOldDate}</span>
									<span className="mx-1 text-purple-600 dark:text-purple-400">←</span>
									<span>{formattedNewDate}</span>
								</span>
							</div>
						</div>
						{selectedStaffMember && (
							<Badge
								variant="outline"
								className="text-[9.5px] bg-white dark:bg-zinc-800 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold shrink-0"
							>
								{selectedStaffMember.name}
							</Badge>
						)}
					</div>
				)}

			</div>

			{/* 3. شريط أدوات الجدولة السريع المنظم فوق الفوتر */}
			<div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3.5 py-2.5 flex flex-col gap-2 shrink-0">
				{/* الصف الأول: تاريخ ووقت الموعد + القاعة (حضوري) + نوع المقابلة */}
				<div className="flex items-center gap-2 w-full">
					<div className="flex-1 min-w-0">
						<AppointmentPickerPopover
							value={newDate ? formattedNewDate : "تاريخ ووقت الموعد"}
							isoValue={newDate || null}
							onChange={(_label, isoDate) => setNewDate(isoDate || "")}
							reviewerName={selectedStaffMember?.name || "المراجع"}
							reviewerId={staffId || undefined}
							className="w-full h-8 text-xs justify-between font-normal shadow-2xs"
						/>
					</div>

					{interviewMode === "IN_CLINIC" && (
						<div className="shrink-0">
							<RoomPickerPopover
								value={roomName}
								appointmentDate={newDate}
								excludeAppointmentId={request.assessmentAppointment?.id || request.appointmentId || null}
								onChange={(name, id) => {
									setRoomName(name);
									setRoomId(id || null);
								}}
								className="h-8 text-xs px-2.5 font-normal shadow-2xs"
							/>
						</div>
					)}

					<div className="shrink-0">
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-8 text-xs border-zinc-200 dark:border-zinc-800 gap-1.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer shadow-2xs"
								>
									{interviewMode === "REMOTE" ? (
										<IconPhone className="size-3.5 text-emerald-600 shrink-0" />
									) : (
										<IconBuildingCommunity className="size-3.5 text-blue-600 shrink-0" />
									)}
									<span>{interviewMode === "REMOTE" ? "عبر اتصال" : "في الأكاديمية"}</span>
									<IconChevronDown className="size-3 opacity-60 shrink-0" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-44 p-1">
								<DropdownMenuItem
									onClick={() => setInterviewMode("IN_CLINIC")}
									className="text-xs cursor-pointer gap-2"
								>
									<IconBuildingCommunity className="size-3.5 text-blue-600" />
									في الأكاديمية
									{interviewMode === "IN_CLINIC" && <IconCheck className="size-3 ms-auto text-primary" />}
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										setInterviewMode("REMOTE");
										setRoomId(null);
										setRoomName("الغرفة");
									}}
									className="text-xs cursor-pointer gap-2"
								>
									<IconPhone className="size-3.5 text-emerald-600" />
									عبر اتصال
									{interviewMode === "REMOTE" && <IconCheck className="size-3 ms-auto text-primary" />}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* الصف الثاني: إسناد المراجع + تحديد الأولوية */}
				<div className="flex items-center gap-2 w-full">
					<div className="flex-1 min-w-0">
						<Popover open={staffPopoverOpen} onOpenChange={setStaffPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="w-full h-8 text-xs border-zinc-200 dark:border-zinc-800 gap-1.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-normal cursor-pointer shadow-2xs justify-between"
								>
									<span className="flex items-center gap-1.5 truncate">
										<IconUser className="size-3.5 text-zinc-500 shrink-0" />
										<span className="truncate">
											{selectedStaffMember?.name ? `إسناد: ${selectedStaffMember.name}` : "تعيين مراجع..."}
										</span>
									</span>
									<IconChevronDown className="size-3 opacity-60 shrink-0" />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-56 p-1.5 z-50 bg-popover border border-border shadow-xl rounded-xl" dir="rtl">
								<p className="text-[10.5px] font-bold text-zinc-900 dark:text-zinc-100 p-1 border-b border-border/50">
									إسناد الموعد إلى...
								</p>
								<div className="max-h-48 overflow-y-auto space-y-0.5 pt-1">
									{staffLoading ? (
										<p className="text-[10px] p-2 text-center text-muted-foreground">جاري التحميل...</p>
									) : staff.length === 0 ? (
										<p className="text-[10px] p-2 text-center text-muted-foreground">لا يوجد موظفون متاحون</p>
									) : (
										staff.map((s) => (
											<button
												key={s.id}
												type="button"
												onClick={() => {
													setStaffId(s.staffId);
													setStaffPopoverOpen(false);
												}}
												className="w-full text-right text-xs p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors cursor-pointer"
											>
												<div className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs">
													{s.name.slice(0, 1)}
												</div>
												<span className="truncate font-medium text-[11px]">{s.name}</span>
											</button>
										))
									)}
								</div>
							</PopoverContent>
						</Popover>
					</div>

					<div className="shrink-0">
						<PriorityPickerPopover
							value={priority}
							onChange={setPriority}
							className="h-8 text-xs border-zinc-200 dark:border-zinc-800 font-normal shadow-2xs"
						/>
					</div>
				</div>
			</div>

			{/* 4. فوتر اللوحة السفلي المثبت دائماً */}
			<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 mt-auto">
				<div className="flex items-center gap-2">
					<Switch
						id="notify-email-reschedule"
						checked={notifyEmail}
						onCheckedChange={setNotifyEmail}
					/>
					<label
						htmlFor="notify-email-reschedule"
						className="text-[11px] text-muted-foreground cursor-pointer font-medium select-none"
					>
						إشعار عبر البريد
					</label>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onOpenChange(false)}
						disabled={rescheduleMutation.isPending}
						className="text-xs h-8 cursor-pointer"
					>
						إلغاء
					</Button>
					<Button
						size="sm"
						onClick={handleSubmit}
						disabled={rescheduleMutation.isPending}
						className="text-xs h-8 font-semibold px-4 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-2xs cursor-pointer"
					>
						{rescheduleMutation.isPending ? (
							<IconLoader2 className="size-3.5 animate-spin" />
						) : (
							<IconCheck className="size-3.5" />
						)}
						<span>
							{rescheduleMutation.isPending
								? "جاري الحفظ..."
								: isReschedule
								? "تأكيد إعادة الجدولة"
								: "تأكيد تثبيت الموعد"}
						</span>
					</Button>
				</div>
			</div>
		</aside>
	);
}
