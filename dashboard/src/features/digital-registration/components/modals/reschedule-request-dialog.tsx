import { useEffect, useRef, useState } from "react";
import {
	IconArrowRight,
	IconCheck,
	IconBuildingCommunity,
	IconChevronDown,
	IconClock,
	IconMail,
	IconPhone,
	IconSparkles,
	IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
} from "@/components/ui/sheet";
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
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import {
	useRegistrationReviewers,
	useRescheduleRequest,
} from "../../hooks/use-digital-registration";
import { generateRescheduleMessage } from "../../utils/ai-templates";

interface RescheduleRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	/** Staff ID selected from the request sidebar; it is only committed with the schedule. */
	initialStaffId?: string | null;
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
}: RescheduleRequestDialogProps) {
	const [reason, setReason] = useState<string>("المراجع لم يحضر في الموعد");
	const [customReason, setCustomReason] = useState("");
	const [newDate, setNewDate] = useState("");
	const [staffId, setStaffId] = useState<string | null>(request?.assessmentAppointment?.staffId || null);
	const [interviewMode, setInterviewMode] = useState<"IN_CLINIC" | "REMOTE">(
		request?.interviewMode === "REMOTE" ? "REMOTE" : "IN_CLINIC",
	);
	const [roomName, setRoomName] = useState(request?.roomName || "الغرفة");
	const [roomId, setRoomId] = useState<string | null>(request?.roomId || null);
	const [subject, setSubject] = useState(
		request ? `إعادة جدولة موعد المقابلة - طلب #${request.code}` : "",
	);
	const [messageText, setMessageText] = useState("");
	const [notifyEmail, setNotifyEmail] = useState(false);

	const [staffPopoverOpen, setStaffPopoverOpen] = useState(false);
	const appliedInitialStaffIdRef = useRef<string | null>(null);

	// لا نعرض جميع موظفي المنشأة هنا: القائمة نفسها هي المراجعين الذين يملكون
	// can_edit في فريق التسجيل ولهم Staff نشط قابل للحجز.
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
			setSubject(`إعادة جدولة موعد المقابلة - طلب #${request.code}`);
			const requestInterviewMode = request.interviewMode === "REMOTE" ? "REMOTE" : "IN_CLINIC";
			setInterviewMode(requestInterviewMode);
			setRoomName(requestInterviewMode === "IN_CLINIC" ? request.roomName || "الغرفة" : "الغرفة");
			setRoomId(requestInterviewMode === "IN_CLINIC" ? request.roomId || null : null);
		}
	}, [open, request]);

	// لا نعيد ضبط اختيار المستخدم عند إعادة جلب القائمة؛ نحدّثه فقط إن كان
	// المراجع السابق لم يعد مؤهلاً أو لم يكن له Staff صالح من الأساس.
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
			const requestedStaffId = request.assessmentAppointment?.staffId || request.assignedStaffId;
			return staff.find((member) => member.staffId === requestedStaffId || member.userId === requestedStaffId)?.staffId || staff[0].staffId;
		});
	}, [initialStaffId, open, request, staff]);

	if (!request) return null;

	const handleGenerateAI = () => {
		if (!newDate || Number.isNaN(new Date(newDate).getTime())) {
			toast.error("اختر تاريخ ووقت الموعد الجديد أولاً");
			return;
		}
		const activeReason = reason === "سبب آخر" ? customReason || "ظروف طارئة" : reason;
		const formattedDate = new Date(newDate).toLocaleDateString("ar-EG", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
		const generated = generateRescheduleMessage({
			studentName: request.patientName,
			guardianName: request.guardianName,
			reason: activeReason,
			newDate: formattedDate,
		});
		setMessageText(generated);
		toast.success("تمت إضافة مسودة رسالة قابلة للتعديل");
	};

	const handleSubmit = () => {
		const activeReason = reason === "سبب آخر" ? customReason.trim() : reason;
		if (!activeReason) {
			toast.error("يرجى تحديد أو كتابة سبب إعادة الجدولة");
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

		rescheduleMutation.mutate(
			{
				requestId: request.id,
				data: {
					reason,
					customReason: reason === "سبب آخر" ? customReason.trim() : undefined,
					newAppointmentDate: appointmentDate.toISOString(),
					staffId,
					interviewMode:
						interviewMode !== (request.interviewMode === "REMOTE" ? "REMOTE" : "IN_CLINIC")
							? interviewMode
							: undefined,
					roomId: interviewMode === "IN_CLINIC" ? roomId : undefined,
					subject: subject.trim(),
					customMessage: messageText.trim() ? messageText.trim() : undefined,
					notifyEmail,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تمت إعادة جدولة موعد الطالب "${request.patientName}" بنجاح`);
					onOpenChange(false);
				},
				onError: (err: unknown) => {
					toast.error(err instanceof Error ? err.message : "فشل إعادة جدولة الموعد");
				},
			},
		);
	};

	const selectedStaffMember = staff.find((s) => s.staffId === staffId);
	const formattedNewDate = newDate ? new Date(newDate).toLocaleDateString("ar-EG", {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}) : "لم يُحدد بعد";

	return (
		<Sheet modal={false} open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="left"
				showOverlay={false}
				showCloseButton={false}
				onPointerDownOutside={(e) => {
					const target = e.target as HTMLElement | null;
					if (
						target?.closest('[data-slot="sheet-content"]') ||
						target?.closest('[role="dialog"]') ||
						target?.closest('[role="menu"]') ||
						target?.closest('[data-radix-portal]') ||
						target?.closest('[data-radix-popper-content-wrapper]')
					) {
						e.preventDefault();
					}
				}}
				onFocusOutside={(e) => e.preventDefault()}
				onInteractOutside={(e) => {
					const target = e.target as HTMLElement | null;
					if (
						target?.closest('[data-radix-portal]') ||
						target?.closest('[data-radix-popper-content-wrapper]') ||
						target?.closest('[role="dialog"]') ||
						target?.closest('[role="menu"]')
					) {
						e.preventDefault();
					}
				}}
				className="w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]! lg:left-[calc(60vw+0.75rem)]! lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background z-50 h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2!"
				dir="rtl"
			>
				{/* 1. رأس اللوحة مطابق للترتيب المرجعي مع زر الرجوع ومعلومات الطالب وكود الطلب */}
				<div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-right bg-white dark:bg-zinc-900 shrink-0">
					<div className="flex items-center gap-1.5 min-w-0">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="size-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
							title="رجوع"
						>
							<IconArrowRight className="size-4" />
						</button>
						<span className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
							إعادة جدولة موعد المقابلة
						</span>
					</div>

					<div className="flex items-center gap-1.5 shrink-0">
						<div className="size-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
							{(request.patientName || "ط").slice(0, 1)}
						</div>
						<span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 max-w-[100px] truncate">
							{request.patientName}
						</span>
						<Badge
							variant="outline"
							className="font-mono text-[9px] px-1 py-0 h-4 border-zinc-200 dark:border-zinc-700 text-zinc-500"
						>
							#{request.code}
						</Badge>
					</div>
				</div>

				{/* 2. محتوى اللوحة القابل للتمرير بالسجل الرسمي وثبات الفوتر */}
				<div className="p-3.5 space-y-3.5 flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-thin text-right">
					{/* كارت هوية ولي الأمر في أعلى المحتوى مطابق تماماً للصورة المرجعية */}
					<div className="rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-2.5 flex items-center justify-between gap-2 shadow-2xs">
						<div className="flex items-center gap-2 min-w-0">
							<div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
								{(request.guardianName || "و").slice(0, 2)}
							</div>
							<div className="min-w-0">
								<p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
									{request.guardianName}
								</p>
								<span className="text-[10px] text-muted-foreground block truncate">
									ولي أمر الطالب: {request.patientName}
								</span>
							</div>
						</div>

						<div className="text-left text-[10px] font-mono text-muted-foreground space-y-0.5 shrink-0" dir="ltr">
							{request.guardianPhone && (
								<div className="flex items-center gap-1 justify-end">
									<span>{request.guardianPhone}</span>
									<IconPhone className="size-3 text-zinc-400" />
								</div>
							)}
							{request.guardianEmail && (
								<div className="flex items-center gap-1 justify-end truncate max-w-[120px]">
									<span className="truncate">{request.guardianEmail}</span>
									<IconMail className="size-3 text-zinc-400 shrink-0" />
								</div>
							)}
						</div>
					</div>

					{/* حقل 1: سبب إعادة الجدولة */}
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

					{/* حقل 2: الموضوع */}
					<div className="space-y-1.5">
						<div className="flex items-center gap-1.5">
							<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
								الموضوع
							</label>
							<span className="text-[9px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-1 py-0 rounded">
								مطلوب
							</span>
						</div>
						<Input
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							placeholder="موضوع الرسالة..."
							className="h-8 text-xs bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 font-sans"
						/>
					</div>

					{/* حقل 3: نص الرسالة مع اقتراح مسودة قابلة للتعديل */}
					<div className="space-y-1.5">
						<div className="flex items-center justify-between">
							<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
								نص رسالة
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
							placeholder="اكتب نص الإشعار بموعد المقابلة الجديد أو انقر على «صياغة تلقائية للرسالة»..."
							className="min-h-24 text-xs leading-relaxed resize-none font-sans bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
						/>
					</div>

					{/* بانر معلومات الموعد المعتمد الجديد */}
					<div className="rounded-lg bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/80 p-2.5 flex items-center justify-between text-xs">
						<div className="flex items-center gap-2 min-w-0">
							<IconClock className="size-4 text-purple-600 shrink-0" />
							<div className="min-w-0">
								<span className="text-[9.5px] text-muted-foreground block truncate">موعد المقابلة المحدد:</span>
								<span className="font-bold text-purple-950 dark:text-purple-200 text-[11px] block truncate">
									{formattedNewDate}
								</span>
							</div>
						</div>
						{selectedStaffMember && (
							<Badge
								variant="outline"
								className="text-[9.5px] bg-white dark:bg-zinc-800 border-purple-200 text-purple-700 dark:text-purple-300 font-semibold shrink-0"
							>
								{selectedStaffMember.name}
							</Badge>
						)}
					</div>
				</div>

				{/* شريط أدوات إعادة الجدولة: أخصائي الموعد وتاريخ الموعد مثبت فوق الفوتر */}
				<div className="border-t border-zinc-100 bg-background px-3.5 py-2.5 dark:border-zinc-800 flex items-center gap-1.5 flex-wrap shrink-0">
					{/* نوع المقابلة جزء من إعادة الجدولة حتى يتغير الموعد ومكانه في معاملة واحدة. */}
					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-7 text-[11px] border-zinc-200 dark:border-zinc-800 gap-1 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer shadow-2xs"
							>
								{interviewMode === "REMOTE" ? (
									<IconPhone className="size-3 text-emerald-600 shrink-0" />
								) : (
									<IconBuildingCommunity className="size-3 text-blue-600 shrink-0" />
								)}
								<span>{interviewMode === "REMOTE" ? "عبر اتصال" : "في الأكاديمية"}</span>
								<IconChevronDown className="size-2.5 opacity-60 shrink-0" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-44 p-1" dir="rtl">
							<DropdownMenuItem
								onClick={() => setInterviewMode("IN_CLINIC")}
								className="text-xs cursor-pointer gap-2"
							>
								<IconBuildingCommunity className="size-3.5 text-blue-600" />
								في الأكاديمية
								{interviewMode === "IN_CLINIC" && <IconCheck className="size-3 ms-auto text-primary" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setInterviewMode("REMOTE")}
								className="text-xs cursor-pointer gap-2"
							>
								<IconPhone className="size-3.5 text-emerald-600" />
								عبر اتصال
								{interviewMode === "REMOTE" && <IconCheck className="size-3 ms-auto text-primary" />}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* 1. إسناد الموعد إلى مسؤول مع قائمة الأعضاء والأفاتار */}
					<Popover open={staffPopoverOpen} onOpenChange={setStaffPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-7 text-[11px] border-zinc-200 dark:border-zinc-800 gap-1 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer shadow-2xs"
							>
								<IconUser className="size-3 text-zinc-500 shrink-0" />
								<span className="truncate max-w-[100px]">
									{selectedStaffMember?.name ? `إسناد: ${selectedStaffMember.name}` : "إسناد إلى..."}
								</span>
								<IconChevronDown className="size-2.5 opacity-60 shrink-0" />
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

					<AppointmentPickerPopover
						value={newDate ? formattedNewDate : "تاريخ الموعد"}
						isoValue={newDate || null}
						onChange={(_label, isoDate) => setNewDate(isoDate || "")}
						reviewerName={selectedStaffMember?.name || "المراجع"}
						reviewerId={staffId || undefined}
						className="h-7 text-[11px]"
					/>

					{interviewMode === "IN_CLINIC" && (
						<RoomPickerPopover
							value={roomName}
							appointmentDate={newDate}
							excludeAppointmentId={request.assessmentAppointment?.id || request.appointmentId || null}
							onChange={(name, id) => {
								setRoomName(name);
								setRoomId(id || null);
							}}
							className="h-7 text-[11px]"
						/>
					)}
				</div>

				{/* 3. فوتر اللوحة السفلي المثبت دائماً بدون انقطاع أو خروج عن الإطار */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 mt-auto">
					<div className="flex items-center gap-2">
						<Switch
							id="notify-email-reschedule"
							checked={notifyEmail}
							onCheckedChange={setNotifyEmail}
						/>
						<label
							htmlFor="notify-email-reschedule"
							className="text-[11px] text-muted-foreground cursor-pointer font-medium"
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
						{/* زر التأكيد بخلفية بنفسجية رسمية موحدة طبقاً لطلب المستخدم */}
						<Button
							size="sm"
							onClick={handleSubmit}
							disabled={rescheduleMutation.isPending}
							className="text-xs h-8 font-semibold px-4 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-2xs cursor-pointer"
						>
							<IconCheck className="size-3.5" />
							<span>{rescheduleMutation.isPending ? "جاري الإرسال..." : "إرسال"}</span>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
