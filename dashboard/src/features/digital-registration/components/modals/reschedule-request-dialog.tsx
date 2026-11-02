import { useState } from "react";
import {
	IconArrowRight,
	IconCalendar,
	IconCalendarEvent,
	IconCheck,
	IconChevronDown,
	IconClock,
	IconMail,
	IconPhone,
	IconSparkles,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useStaffForBooking } from "@/features/appointments/hooks/use-staff-for-booking";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useRescheduleRequest } from "../../hooks/use-digital-registration";
import { generateRescheduleMessage } from "../../utils/ai-templates";

interface RescheduleRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
}

const RESCHEDULE_REASONS = [
	"عدم حضور الطالب أو ولي الأمر في الموعد",
	"إجازة في الأكاديمية",
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
}: RescheduleRequestDialogProps) {
	const [reason, setReason] = useState<string>("عدم حضور الطالب أو ولي الأمر في الموعد");
	const [customReason, setCustomReason] = useState("");
	const [newDate, setNewDate] = useState(() => {
		const d = new Date();
		d.setDate(d.getDate() + 2);
		d.setHours(10, 0, 0, 0);
		return d.toISOString().slice(0, 16);
	});
	const [assignedStaffId, setAssignedStaffId] = useState<string | null>(request?.assignedStaffId || null);
	const [subject, setSubject] = useState(
		request ? `إعادة جدولة موعد المقابلة - طلب #${request.code}` : "",
	);
	const [messageText, setMessageText] = useState("");
	const [enableMessage, setEnableMessage] = useState(true);
	const [notifyEmail, setNotifyEmail] = useState(false);
	const [staffPopoverOpen, setStaffPopoverOpen] = useState(false);

	const { staff, isLoading: staffLoading } = useStaffForBooking();
	const rescheduleMutation = useRescheduleRequest(campaignId);

	if (!request) return null;

	const handleGenerateAI = () => {
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
		toast.success("تم توليد رسالة إعادة الجدولة بالذكاء الاصطناعي ✨");
	};

	const handleSubmit = () => {
		const activeReason = reason === "سبب آخر" ? customReason.trim() : reason;
		if (!activeReason) {
			toast.error("يرجى تحديد أو كتابة سبب إعادة الجدولة");
			return;
		}

		rescheduleMutation.mutate(
			{
				requestId: request.id,
				data: {
					reason,
					customReason: reason === "سبب آخر" ? customReason.trim() : undefined,
					newAppointmentDate: new Date(newDate).toISOString(),
					assignedStaffId,
					subject: subject.trim(),
					customMessage: enableMessage ? messageText.trim() : undefined,
					notifyEmail,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تمت إعادة جدولة موعد الطالب "${request.patientName}" بنجاح`);
					onOpenChange(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل إعادة جدولة الموعد");
				},
			},
		);
	};

	const selectedStaffMember = staff.find((s) => s.id === assignedStaffId);

	return (
		<Sheet open={open} onOpenChange={onOpenChange} modal={false}>
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
				className="w-full sm:w-[28vw]! md:w-[28vw]! lg:w-[28vw]! sm:max-w-none! left-[calc(60vw+0.75rem)]! right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background z-50"
				dir="rtl"
			>
				{/* رأس اللوحة مع زر الرجوع والعنوان واسم الطالب بدون كود الطلب المكدس */}
				<div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-right bg-white dark:bg-zinc-900 shrink-0">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="size-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
							title="رجوع"
						>
							<IconArrowRight className="size-4" />
						</button>
						<span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
							إعادة جدولة موعد المقابلة
						</span>
					</div>

					<div className="flex items-center gap-1.5 text-xs min-w-0">
						<span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
							{request.patientName}
						</span>
					</div>
				</div>

				{/* محتوى اللوحة القابل للتمرير */}
				<div className="p-3.5 space-y-3.5 flex-1 overflow-y-auto">
					{/* سبب إعادة الجدولة */}
					<div className="space-y-1.5">
						<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">
							سبب إعادة الجدولة <span className="text-destructive">*</span>
						</label>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-between h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
								>
									<span className="truncate">{reason}</span>
									<IconChevronDown className="size-3.5 opacity-60 shrink-0" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
								{RESCHEDULE_REASONS.map((r) => (
									<DropdownMenuItem key={r} onClick={() => setReason(r)} className="text-xs">
										{r}
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

					{/* تحديد الموعد الجديد */}
					<div className="space-y-1.5">
						<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">
							التاريخ والوقت الجديد <span className="text-destructive">*</span>
						</label>
						<Input
							type="datetime-local"
							value={newDate}
							onChange={(e) => setNewDate(e.target.value)}
							className="h-8 text-xs font-mono"
						/>
					</div>

					{/* كارت هوية ولي الأمر */}
					<div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-2.5 flex items-center justify-between gap-2.5 shadow-2xs">
						<div className="flex items-center gap-2 min-w-0">
							<Avatar className="size-8 border border-primary/20 shrink-0">
								<AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
									{request.guardianName.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0">
								<p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
									{request.guardianName}
								</p>
								<span className="text-[9.5px] text-muted-foreground block truncate">
									ولي أمر الطالب • {request.patientName}
								</span>
							</div>
						</div>

						<div className="text-left text-[10px] font-mono text-muted-foreground space-y-0.5" dir="ltr">
							<div className="flex items-center gap-1">
								<span>{request.guardianPhone}</span>
								<IconPhone className="size-2.5 text-zinc-400" />
							</div>
							{request.guardianEmail && (
								<div className="flex items-center gap-1 truncate max-w-[130px]">
									<span className="truncate">{request.guardianEmail}</span>
									<IconMail className="size-2.5 text-zinc-400 shrink-0" />
								</div>
							)}
						</div>
					</div>

					{/* سويتش الرسالة */}
					<div className="flex items-center justify-between pt-0.5">
						<label
							htmlFor="enable-msg-reschedule"
							className="text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
						>
							{enableMessage ? "إغلاق رسالة" : "إضافة رسالة"}
						</label>
						<Switch
							id="enable-msg-reschedule"
							checked={enableMessage}
							onCheckedChange={setEnableMessage}
						/>
					</div>

					{enableMessage && (
						<div className="space-y-2">
							<div className="space-y-1">
								<label className="text-[10.5px] text-muted-foreground block font-medium">الموضوع</label>
								<Input
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
									placeholder="موضوع الرسالة..."
									className="h-8 text-xs"
								/>
							</div>

							<div className="space-y-1">
								<div className="flex items-center justify-between">
									<label className="text-[10.5px] text-muted-foreground block font-medium">نص الرسالة</label>
									<button
										type="button"
										onClick={handleGenerateAI}
										className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1 transition-colors"
									>
										<IconSparkles className="size-3 text-primary" />
										<span>إنشاء بالذكاء الاصطناعي</span>
									</button>
								</div>
								<Textarea
									value={messageText}
									onChange={(e) => setMessageText(e.target.value)}
									placeholder="اكتب نص الإشعار بموعد المقابلة الجديد أو انقر على 'إنشاء بالذكاء الاصطناعي'..."
									className="min-h-24 text-xs leading-relaxed resize-none font-sans"
								/>
							</div>
						</div>
					)}

					{/* إسناد الموعد إلى مسؤول */}
					<div className="pt-1">
						<Popover open={staffPopoverOpen} onOpenChange={setStaffPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-8 text-xs border-zinc-200 dark:border-zinc-800 gap-1.5 w-full justify-between bg-zinc-50/50 dark:bg-zinc-900/50"
								>
									<span className="flex items-center gap-1.5 truncate">
										<IconUser className="size-3.5 text-zinc-500 shrink-0" />
										<span className="truncate">{selectedStaffMember?.name || "إسناد الموعد إلى مسؤول..."}</span>
									</span>
									<IconChevronDown className="size-3 opacity-60 shrink-0" />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-64 p-1.5" dir="rtl">
								<p className="text-[11px] font-bold text-muted-foreground p-1.5">اختر الأخصائي / المراجع</p>
								<div className="max-h-48 overflow-y-auto space-y-1">
									{staffLoading ? (
										<p className="text-xs p-2 text-center text-muted-foreground">جاري التحميل...</p>
									) : (
										staff.map((s) => (
											<button
												key={s.id}
												type="button"
												onClick={() => {
													setAssignedStaffId(s.id);
													setStaffPopoverOpen(false);
												}}
												className="w-full text-right text-xs px-2 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
											>
												<Avatar className="size-6">
													<AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
														{s.name.slice(0, 2)}
													</AvatarFallback>
												</Avatar>
												<span className="truncate">{s.name}</span>
											</button>
										))
									)}
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				{/* فوتر اللوحة السفلي */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
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
							className="text-xs h-8"
						>
							إلغاء
						</Button>
						<Button
							size="sm"
							onClick={handleSubmit}
							disabled={rescheduleMutation.isPending}
							className="text-xs h-8 font-semibold px-4 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
						>
							<IconCheck className="size-3.5" />
							<span>{rescheduleMutation.isPending ? "جاري الحفظ..." : "تأكيد إعادة الجدولة"}</span>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
