import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useMemo } from "react";
import {
	IconArrowRight,
	IconCheck,
	IconBuildingCommunity,
	IconChevronDown,
	IconClock,
	IconCopy,
	IconInfoCircle,
	IconLoader2,
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
import { SanadLogo } from "@/components/common/sanad-logo";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import {
	useDigitalRegistrationCapabilities,
	useRegistrationReviewers,
	useRescheduleRequest,
} from "../../hooks/use-digital-registration";
import {
	generateRescheduleMessage,
	generateScheduleMessage,
	getChildAssessmentUrl,
} from "../../utils/ai-templates";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import {
	formatAppointmentDateTime,
	formatAppointmentDate,
	DEFAULT_CLINIC_TIMEZONE,
} from "../../utils/date-format";
import { getWhatsAppUrl } from "../../utils/phone-format";

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
	// لا يعتبر الطلب "إعادة جدولة" إلا إذا كان الطلب في مرحلة المقابلة بالفعل وله موعد نشط غير ملغي
	const hasActiveAppointment = Boolean(
		request?.status === "INTERVIEW" &&
		request?.assessmentAppointment &&
		request.assessmentAppointment.status !== "CANCELLED"
	);
	const isReschedule = hasActiveAppointment;

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

	const isAssessmentDone = Boolean(
		request?.assessmentData ||
		(request?.notes && request.notes.includes("إجابات التقييم:"))
	);

	const evaluationUrl = useMemo(() => {
		return getChildAssessmentUrl(request?.code);
	}, [request?.code]);

	const meetingUrl = useMemo(() => {
		if (request?.meetingUrl) return request.meetingUrl;
		const sessionIdentifier = request?.code || (request?.id ? `SA-${request.id.slice(0, 8).toUpperCase()}` : "SA-SESSION");
		return `https://meet.sanad-academy.com/session/${sessionIdentifier}`;
	}, [request?.meetingUrl, request?.code, request?.id]);

	const currentAppointmentDate = useMemo(() => {
		if (!isReschedule) return null;
		return (
			request?.assessmentAppointment?.startsAt ||
			request?.interviewAppointmentDate ||
			request?.appointmentDate ||
			null
		);
	}, [isReschedule, request]);

	useEffect(() => {
		if (open && request) {
			// في إعادة الجدولة نبدأ الحقل فارغاً ليختار المستخدم موعداً جديداً ومختلفاً،
			// والـ popover يفتح تلقائياً على يوم الموعد الحالي مع تمييزه بشارة "الحالي" وتعطيل اختياره مجدداً.
			setNewDate("");
			const requestInterviewMode = request.interviewMode === "REMOTE" ? "REMOTE" : "IN_CLINIC";
			setInterviewMode(requestInterviewMode);
			setRoomName(requestInterviewMode === "IN_CLINIC" ? request.roomName || "الغرفة" : "الغرفة");
			setRoomId(requestInterviewMode === "IN_CLINIC" ? request.roomId || null : null);
			const initialStaff = initialStaffId || request.assessmentAppointment?.staffId || request.assignedStaff?.id || request.assignedStaffId || null;
			setStaffId(initialStaff);
			setPriority(request.priority || "بدون أولوية");
			setCustomReason("");
			setReason(RESCHEDULE_REASONS[0]);
			setMessageText("");
			setEnableMessage(true);
			setNotifyEmail(false);
		}
	}, [open, request, isReschedule]);

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
			if (requestedStaffId) {
				return staff.find((member) => member.staffId === requestedStaffId || member.userId === requestedStaffId)?.staffId || null;
			}
			return null;
		});
	}, [initialStaffId, open, request, staff]);

	if (!open || !request) return null;

	const selectedStaffMember = staff.find((s) => s.staffId === staffId);

	const formattedNewDate = newDate
		? formatAppointmentDateTime(newDate, clinicTimezone)
		: "لم يُحدد بعد";

	const formattedOldDate = currentAppointmentDate
		? formatAppointmentDateTime(currentAppointmentDate, clinicTimezone)
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
				interviewMode,
				meetingUrl: interviewMode === "REMOTE" ? meetingUrl : undefined,
				roomName: interviewMode === "IN_CLINIC" ? (roomName && roomName !== "الغرفة" ? roomName : undefined) : undefined,
			});
			setMessageText(generated);
		} else {
			const generated = generateScheduleMessage({
				studentName: request.patientName,
				guardianName: request.guardianName,
				appointmentDate: formattedDate,
				interviewMode,
				meetingUrl: interviewMode === "REMOTE" ? meetingUrl : undefined,
				roomName: interviewMode === "IN_CLINIC" ? (roomName && roomName !== "الغرفة" ? roomName : undefined) : undefined,
				assessmentUrl: isAssessmentDone ? undefined : evaluationUrl,
				isAssessmentDone,
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

		if (isReschedule && currentAppointmentDate) {
			const originalTime = new Date(currentAppointmentDate).getTime();
			if (Math.abs(appointmentDate.getTime() - originalTime) < 60_000) {
				toast.error("يرجى اختيار موعد جديد يختلف عن موعد الطالب الحالي");
				return;
			}
		}

		if (!staffId) {
			toast.error("يرجى اختيار المراجع لإسناد المقابلة أولاً");
			return;
		}

		if (interviewMode === "IN_CLINIC" && (!roomId || !roomName || roomName === "الغرفة")) {
			toast.error("يرجى تحديد الغرفة قبل حفظ موعد المقابلة في الأكاديمية");
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
			: `جدولة مقابلة - طلب #${request.code || request.id}`;

		if (enableMessage && !messageText.trim()) {
			toast.error("يرجى كتابة نص الرسالة لولي الأمر أو إلغاء تفعيل خيار التضمين");
			return;
		}

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
							: `تمت جدولة مقابلة الطالب "${request.patientName}" بنجاح`,
					);

					// إذا تم تفعيل خيار تضمين الرسالة، يتم فتح تطبيق الواتساب مباشرة مع ولي الأمر بالرسالة الجاهزة
					if (enableMessage && messageText.trim() && request.guardianPhone) {
						const waUrl = getWhatsAppUrl(request.guardianPhone, messageText.trim());
						if (waUrl) {
							window.open(waUrl, "_blank");
						}
					}

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
				title={isReschedule ? "إعادة جدولة موعد المقابلة" : "جدولة مقابلة"}
				patientName={request.patientName}
				code={request.code}
				onClose={() => onOpenChange(false)}
			/>

			{/* 2. محتوى اللوحة القابل للتمرير بعجلة الماوس */}
			<div
				ref={scrollContainerRef}
				className="p-3.5 space-y-3 flex-1 min-h-0 overflow-y-auto scrollbar-thin select-text text-right"
				style={{ touchAction: "pan-y" }}
			>
				{/* بطاقة ولي الأمر الموحدة */}
				<RegistrationDrawerGuardianCard
					guardianName={request.guardianName}
					guardianPhone={request.guardianPhone}
					guardianEmail={request.guardianEmail}
					patientName={request.patientName}
				/>

				{/* بطاقة الموعد الحالي عند إعادة الجدولة */}
				{isReschedule && formattedOldDate && (
					<div className="rounded-xl border border-amber-200/80 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20 p-2.5 text-right flex items-center justify-between text-xs shadow-2xs">
						<div className="flex items-center gap-2">
							<span className="size-2 rounded-full bg-amber-500 shrink-0" />
							<span className="text-amber-800 dark:text-amber-300 font-semibold">الموعد الحالي المحجوز:</span>
						</div>
						<span className="font-bold text-amber-900 dark:text-amber-200">{formattedOldDate}</span>
					</div>
				)}

				{/* 1. حالة ورابط التقييم الأولي للطالب */}
				{isAssessmentDone ? (
					<div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20 p-2.5 text-right flex items-center justify-between text-xs shadow-2xs">
						<div className="flex items-center gap-2">
							<span className="size-2 rounded-full bg-emerald-500 shrink-0" />
							<span className="text-emerald-800 dark:text-emerald-300 font-semibold">
								التقييم الأولي مكتمل ومسجل بالطلب ✓
							</span>
						</div>
						<Badge
							variant="outline"
							className="bg-white/80 dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] font-medium"
						>
							لا يتطلب إرسال رابط
						</Badge>
					</div>
				) : (
					<div className="space-y-1.5">
						<div className="flex items-center justify-between text-xs">
							<div className="flex items-center gap-1 font-bold text-zinc-800 dark:text-zinc-200">
								<span>رابط التقييم الأولي المخصص للطالب</span>
								<IconInfoCircle className="size-3.5 text-zinc-400" />
							</div>
							<span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-1.5 py-0.5 rounded">
								بانتظار تعبئة ولي الأمر
							</span>
						</div>
						<div className="flex items-center justify-between border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 bg-white dark:bg-zinc-900 shadow-2xs group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
							<span
								onClick={() => window.open(evaluationUrl, "_blank")}
								className="text-xs font-mono text-blue-600 dark:text-blue-400 truncate flex-1 text-right cursor-pointer hover:underline select-all"
								title={evaluationUrl}
							>
								{evaluationUrl}
							</span>
							<button
								type="button"
								onClick={() => {
									navigator.clipboard.writeText(evaluationUrl);
									toast.success("تم نسخ رابط التقييم المخصص للطالب بنجاح");
								}}
								title="نسخ رابط التقييم"
								className="text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded cursor-pointer shrink-0"
							>
								<IconCopy className="size-4" />
							</button>
						</div>
					</div>
				)}

				{/* 2. مكان المقابلة */}
				<div>
					<div className="flex items-center justify-between gap-2 text-xs mb-2">
						<div className="flex items-center gap-1 font-bold text-zinc-800 dark:text-zinc-200 shrink-0">
							<span>مكان المقابلة</span>
							<IconInfoCircle className="size-3.5 text-zinc-400" />
						</div>

						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1.5 text-xs select-none">
								{interviewMode === "REMOTE" ? (
									<span className="size-2.5 rounded-full bg-emerald-600 inline-block shrink-0 shadow-2xs ring-2 ring-emerald-600/20" />
								) : (
									<span className="size-2.5 rounded-full border border-zinc-300 dark:border-zinc-600 inline-block shrink-0" />
								)}
								<span
									className={cn(
										"text-xs transition-colors",
										interviewMode === "REMOTE"
											? "font-bold text-zinc-900 dark:text-zinc-100"
											: "text-zinc-400 dark:text-zinc-500",
									)}
								>
									مكالمة عبر تطبيق الويب
								</span>
							</div>

							<div className="flex items-center gap-1.5 text-xs select-none">
								{interviewMode === "IN_CLINIC" ? (
									<span className="size-2.5 rounded-full bg-emerald-600 inline-block shrink-0 shadow-2xs ring-2 ring-emerald-600/20" />
								) : (
									<span className="size-2.5 rounded-full border border-zinc-300 dark:border-zinc-600 inline-block shrink-0" />
								)}
								<span
									className={cn(
										"text-xs transition-colors",
										interviewMode === "IN_CLINIC"
											? "font-bold text-zinc-900 dark:text-zinc-100"
											: "text-zinc-400 dark:text-zinc-500",
									)}
								>
									داخل الأكاديمية
								</span>
							</div>
						</div>
					</div>

					{/* بطاقة تفاصيل مكان المقابلة */}
					<div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-[#F9F9FD] dark:bg-zinc-900/60 p-3 flex items-center justify-between gap-3 shadow-2xs">
						<div className="flex items-center gap-2.5 min-w-0 flex-1">
							<div className="size-9 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
								<SanadLogo iconOnly className="size-6 object-contain" />
							</div>
							<div className="min-w-0 flex-1 text-right">
								<p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
									{interviewMode === "REMOTE" ? "مكالمة عبر تطبيق الويب" : "داخل الأكاديمية"}
								</p>
								<p
									className={cn(
										"truncate mt-0.5 select-all",
										interviewMode === "REMOTE"
											? "text-[11px] font-mono text-zinc-500 dark:text-zinc-400"
											: "text-[10.5px] font-sans text-zinc-500 dark:text-zinc-400 leading-normal",
									)}
									dir={interviewMode === "REMOTE" ? "ltr" : "rtl"}
									title={
										interviewMode === "REMOTE"
											? meetingUrl
											: roomName && roomName !== "الغرفة"
												? `مقر أكاديمية سند - ${roomName}`
												: "مقر أكاديمية سند - القاعة الرئيسية للتقييم"
									}
								>
									{interviewMode === "REMOTE"
										? meetingUrl
										: roomName && roomName !== "الغرفة"
											? `مقر الأكاديمية - ${roomName}`
											: "مقر الأكاديمية - القاعة الرئيسية للتقييم"}
								</p>
							</div>
						</div>

						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => {
								const textToCopy =
									interviewMode === "REMOTE"
										? meetingUrl
										: roomName && roomName !== "الغرفة"
											? `مقر أكاديمية سند - ${roomName}`
											: "مقر أكاديمية سند - القاعة الرئيسية للتقييم";
								navigator.clipboard.writeText(textToCopy);
								toast.success(
									interviewMode === "REMOTE"
										? "تم نسخ رابط المقابلة بنجاح"
										: "تم نسخ مكان الجلسة بنجاح",
								);
							}}
							className="h-7 px-3 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-medium rounded-md shadow-2xs cursor-pointer shrink-0"
						>
							نسخ
						</Button>
					</div>
				</div>

				{/* سويتش تضمين رسالة لولي الأمر */}
				<div className="flex items-center justify-between -mt-1">
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
								نص الرسالة <span className="text-destructive font-bold">*</span>
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

				{/* قسم سبب إعادة الجدولة (يظهر فقط إذا كان للطلب موعد مسبق، بعد تضمين الرسالة) */}
				{isReschedule && (
					<div className="space-y-1.5 animate-in fade-in-0 duration-150">
						<div className="flex items-center gap-1">
							<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
								سبب إعادة الجدولة
							</label>
							<span className="text-destructive font-bold text-xs">*</span>
						</div>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-between h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 cursor-pointer"
								>
									<span className="truncate text-right flex-1">{reason}</span>
									<IconChevronDown className="size-3.5 opacity-60 shrink-0 mr-1.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
								className="w-(--radix-dropdown-menu-trigger-width) min-w-(--radix-dropdown-menu-trigger-width) p-1"
								align="start"
							>
								<p className="text-[10px] text-muted-foreground font-semibold px-2 py-1">اختر السبب...</p>
								{RESCHEDULE_REASONS.map((r) => (
									<DropdownMenuItem
										key={r}
										onClick={() => setReason(r)}
										className="text-xs cursor-pointer flex items-center justify-between w-full"
									>
										<span>{r}</span>
										{reason === r && <IconCheck className="size-3 text-primary shrink-0" />}
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

			</div>

			{/* 3. شريط أدوات الجدولة السريع المنظم فوق الفوتر */}
			<div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3.5 py-1.5 shrink-0">
				{/* ترتيب العناصر: 1. تاريخ الموعد (إجباري) | 2. اختيار المراجع (إجباري إذا لم يُحدد مسبقاً) | 3. الغرفة (تظهر فقط في الأكاديمية وهي إجبارية) | 4. الأولوية */}
				<div className="grid grid-cols-4 gap-2 w-full">
					{/* 1. تاريخ ووقت الموعد (إجباري) */}
					<div className="min-w-0">
						<AppointmentPickerPopover
							value={newDate ? formattedNewDate : (isReschedule ? "تحديد موعد جديد *" : "تاريخ الموعد *")}
							isoValue={newDate || null}
							onChange={(_label, isoDate) => setNewDate(isoDate || "")}
							reviewerName={selectedStaffMember?.name || "المراجع"}
							reviewerId={staffId || undefined}
							excludeAppointmentId={isReschedule ? (request.assessmentAppointment?.id || request.appointmentId || null) : null}
							excludeRequestId={isReschedule ? request.id : null}
							currentAppointmentDate={currentAppointmentDate}
							className="w-full h-8 text-[11px] justify-between font-normal shadow-2xs whitespace-nowrap bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
						/>
					</div>

					{/* 2. اختيار المراجع (إجباري إذا لم يكن محدداً مسبقاً) */}
					<div className="min-w-0">
						<Popover open={staffPopoverOpen} onOpenChange={setStaffPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									title={
										selectedStaffMember?.name
											? `إسناد: ${selectedStaffMember.name}`
											: "تعيين مراجع *"
									}
									className="w-full h-8 text-xs border-zinc-200 dark:border-zinc-800 gap-1 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-normal cursor-pointer shadow-2xs justify-between px-2"
								>
									<span className="flex items-center gap-1 min-w-0 truncate">
										<IconUser className="size-3.5 text-zinc-500 shrink-0" />
										<span className="truncate">
											{selectedStaffMember?.name ? `إسناد: ${selectedStaffMember.name}` : "تعيين مراجع *"}
										</span>
									</span>
									<IconChevronDown className="size-3 opacity-60 shrink-0" />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-56 p-1.5 z-50 bg-popover border border-border shadow-xl rounded-xl" dir="rtl">
								<p className="text-[10.5px] font-bold text-zinc-900 dark:text-zinc-100 p-1 border-b border-border/50">
									إسناد المقابلة إلى مراجع...
								</p>
								<div className="max-h-48 overflow-y-auto space-y-0.5 pt-1">
									{staffLoading ? (
										<p className="text-[10px] p-2 text-center text-muted-foreground">جاري التحميل...</p>
									) : staff.length === 0 ? (
										<p className="text-[10px] p-2 text-center text-muted-foreground">لا يوجد موظفون متاحون</p>
									) : (
										staff.map((s) => {
											const isSelected = s.staffId === staffId;
											return (
												<button
													key={s.id}
													type="button"
													onClick={() => {
														setStaffId(s.staffId);
														setStaffPopoverOpen(false);
													}}
													className={cn(
														"w-full text-right text-xs p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between gap-2 transition-colors cursor-pointer",
														isSelected && "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold",
													)}
												>
													<div className="flex items-center gap-2 min-w-0 flex-1">
														<div
															className={cn(
																"size-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs",
																isSelected ? "bg-blue-600" : "bg-blue-600/80",
															)}
														>
															{s.name.slice(0, 1)}
														</div>
														<span className="truncate text-[11px]">{s.name}</span>
													</div>
													{isSelected && (
														<IconCheck className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
													)}
												</button>
											);
										})
									)}
								</div>
							</PopoverContent>
						</Popover>
					</div>

					{/* 3. الغرفة (تظهر فقط في الأكاديمية وهي إجبارية) */}
					{interviewMode === "IN_CLINIC" && (
						<div className="min-w-0">
							<RoomPickerPopover
								value={roomName && roomName !== "الغرفة" ? roomName : "الغرفة *"}
								appointmentDate={newDate}
								excludeAppointmentId={isReschedule ? (request.assessmentAppointment?.id || request.appointmentId || null) : null}
								onChange={(name, id) => {
									setRoomName(name);
									setRoomId(id || null);
								}}
								className="w-full h-8 text-[11px] px-2 font-normal shadow-2xs justify-between bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 min-w-0 truncate"
							/>
						</div>
					)}

					{/* 4. الأولوية (تأتي في الأخير دائماً) */}
					<div className="min-w-0">
						<PriorityPickerPopover
							value={priority}
							onChange={setPriority}
							showChevron
							className="w-full h-8 text-xs border-zinc-200 dark:border-zinc-800 font-normal shadow-2xs justify-between bg-white dark:bg-zinc-900 px-2"
						/>
					</div>
				</div>
			</div>

			{/* 4. فوتر اللوحة السفلي المثبت دائماً */}
			<div className="px-3.5 py-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 mt-auto">
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
						disabled={rescheduleMutation.isPending || (enableMessage && !messageText.trim())}
						className="text-xs h-8 font-semibold px-4 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
								: "تأكيد جدولة المقابلة"}
						</span>
					</Button>
				</div>
			</div>
		</aside>
	);
}
