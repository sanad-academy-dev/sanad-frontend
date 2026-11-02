import { useState } from "react";
import {
	IconAlertCircle,
	IconArrowRight,
	IconCalendar,
	IconCheck,
	IconChevronDown,
	IconClock,
	IconFlag,
	IconHourglass,
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
import { useWaitlistRequest } from "../../hooks/use-digital-registration";
import { generateWaitlistMessage } from "../../utils/ai-templates";

interface WaitlistRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
}

const PRIORITY_OPTIONS = [
	{ id: "بدون أولوية", label: "بدون أولوية", count: 0 },
	{ id: "عاجلة", label: "عاجلة", count: 1 },
	{ id: "مرتفعة", label: "مرتفعة", count: 2 },
	{ id: "متوسطة", label: "متوسطة", count: 3 },
	{ id: "منخفضة", label: "منخفضة", count: 4 },
];

export function WaitlistRequestDialog({
	request,
	open,
	onOpenChange,
	campaignId = "",
}: WaitlistRequestDialogProps) {
	const [enableMessage, setEnableMessage] = useState(true);
	const [subject, setSubject] = useState(
		request ? `إرسال تسجيل في قائمة الانتظار - #${request.code}` : "",
	);
	const [messageText, setMessageText] = useState("");
	const [assignedStaffId, setAssignedStaffId] = useState<string | null>(request?.assignedStaffId || null);
	const [selectedPriority, setSelectedPriority] = useState<string>("بدون أولوية");
	const [notifyEmail, setNotifyEmail] = useState(false);

	const [staffPopoverOpen, setStaffPopoverOpen] = useState(false);
	const [priorityPopoverOpen, setPriorityPopoverOpen] = useState(false);

	const { staff, isLoading: staffLoading } = useStaffForBooking();
	const waitlistMutation = useWaitlistRequest(campaignId);

	if (!request) return null;

	const queueRank = request.queueRank ?? 3;
	const estimatedWait = request.estimatedWait || "2-4 أسابيع";

	const handleGenerateAI = () => {
		const generated = generateWaitlistMessage({
			studentName: request.patientName,
			guardianName: request.guardianName,
			targetClass: request.targetClass,
			queueRank,
			estimatedWait,
		});
		setMessageText(generated);
		toast.success("تم إنشاء رسالة قائمة الانتظار بالذكاء الاصطناعي ✨");
	};

	const handleSubmit = () => {
		waitlistMutation.mutate(
			{
				requestId: request.id,
				data: {
					assignedStaffId,
					subject: subject.trim(),
					customMessage: enableMessage ? messageText.trim() : undefined,
					notifyEmail,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تم إدراج الطالب "${request.patientName}" في قائمة الانتظار بنجاح`);
					onOpenChange(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل إدراج الطالب في قائمة الانتظار");
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
							إرسال تسجيل في قائمة الانتظار للطلب
						</span>
					</div>

					<div className="flex items-center gap-1.5 text-xs min-w-0">
						<span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
							{request.patientName}
						</span>
					</div>
				</div>

				{/* محتوى اللوحة القابل للتمرير */}
				<div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
					{/* بانر قائمة الانتظار الأزرق (مطابق للصورة 3) */}
					<div className="rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-2.5 space-y-1.5 text-xs text-blue-900 dark:text-blue-300">
						<div className="flex items-center gap-1.5 font-bold">
							<IconAlertCircle className="size-4 text-blue-600 shrink-0" />
							<span>
								لا توجد مقاعد شاغرة حالياً، ترتيب الطالب في قائمة الانتظار #{queueRank}، وسيتم إشعار المراجع وولي الأمر عند توفر مقعد شاغر.
							</span>
						</div>
						<div className="flex items-center gap-1 text-[11px] text-blue-700 dark:text-blue-400 pr-5">
							<IconClock className="size-3" />
							<span>أوقات التوقع للانتظار: {estimatedWait}</span>
						</div>
					</div>

					{/* كارت هوية ولي الأمر */}
					<div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-3 flex items-center justify-between gap-3 shadow-2xs">
						<div className="flex items-center gap-2.5 min-w-0">
							<Avatar className="size-9 border border-primary/20 shrink-0">
								<AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
									{request.guardianName.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0">
								<p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
									{request.guardianName}
								</p>
								<span className="text-[10px] text-muted-foreground block truncate">
									ولي أمر الطالب • {request.patientName}
								</span>
							</div>
						</div>

						<div className="text-left text-[11px] font-mono text-muted-foreground space-y-0.5" dir="ltr">
							<div className="flex items-center gap-1">
								<span>{request.guardianPhone}</span>
								<IconPhone className="size-3 text-zinc-400" />
							</div>
							{request.guardianEmail && (
								<div className="flex items-center gap-1 truncate max-w-[150px]">
									<span className="truncate">{request.guardianEmail}</span>
									<IconMail className="size-3 text-zinc-400 shrink-0" />
								</div>
							)}
						</div>
					</div>

					{/* سويتش إضافة / إغلاق رسالة */}
					<div className="flex items-center justify-between pt-1">
						<label
							htmlFor="enable-msg-waitlist"
							className="text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
						>
							{enableMessage ? "إغلاق رسالة" : "إضافة رسالة"}
						</label>
						<Switch
							id="enable-msg-waitlist"
							checked={enableMessage}
							onCheckedChange={setEnableMessage}
						/>
					</div>

					{enableMessage && (
						<div className="space-y-3">
							{/* حقل الموضوع */}
							<div className="space-y-1">
								<div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
									<span>الموضوع</span>
									<span className="text-[10px] text-rose-500 font-normal">مطلوب</span>
								</div>
								<Input
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
									className="h-8 text-xs font-sans"
								/>
							</div>

							{/* مربع نص الرسالة */}
							<div className="space-y-1">
								<div className="flex items-center justify-between text-xs">
									<span className="font-bold text-zinc-800 dark:text-zinc-200">نص رسالة</span>
									<button
										type="button"
										onClick={handleGenerateAI}
										className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
									>
										<IconSparkles className="size-3.5 text-primary" />
										<span>إنشاء بالذكاء الاصطناعي</span>
									</button>
								</div>
								<Textarea
									value={messageText}
									onChange={(e) => setMessageText(e.target.value)}
									placeholder="السلام عليكم، نود إحاطتكم بإدراج طلبكم في قائمة الانتظار..."
									className="min-h-36 text-xs leading-relaxed resize-none font-sans"
								/>
							</div>
						</div>
					)}
				</div>

				{/* شريط الإجراءات والفوتر السفلي */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-2 shrink-0">
					{/* صف أدوات التعيين */}
					<div className="flex items-center gap-1.5 flex-wrap">
						{/* اختيار الأخصائي المسند إليه */}
						<Popover open={staffPopoverOpen} onOpenChange={setStaffPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-7 text-[11px] border-zinc-200 dark:border-zinc-800 gap-1"
								>
									<IconUser className="size-3 text-zinc-500" />
									<span>{selectedStaffMember?.name || "إسناد إلى..."}</span>
									<IconChevronDown className="size-2.5 opacity-60" />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-52 p-1" dir="rtl">
								<p className="text-[10px] text-muted-foreground px-2 py-1 font-semibold">المراجع المكلف</p>
								<div className="max-h-40 overflow-y-auto space-y-0.5">
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
												className="w-full text-right text-xs px-2 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5"
											>
												<Avatar className="size-5">
													<AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
														{s.name.slice(0, 2)}
													</AvatarFallback>
												</Avatar>
												<span className="truncate flex-1">{s.name}</span>
											</button>
										))
									)}
								</div>
							</PopoverContent>
						</Popover>

						{/* اختيار الأولوية */}
						<Popover open={priorityPopoverOpen} onOpenChange={setPriorityPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-7 text-[11px] border-zinc-200 dark:border-zinc-800 gap-1"
								>
									<IconFlag className="size-3 text-zinc-500" />
									<span>{selectedPriority}</span>
									<IconChevronDown className="size-2.5 opacity-60" />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-44 p-1" dir="rtl">
								<p className="text-[10px] text-muted-foreground px-2 py-1 font-semibold">حدد أولوية...</p>
								{PRIORITY_OPTIONS.map((p) => (
									<button
										key={p.id}
										type="button"
										onClick={() => {
											setSelectedPriority(p.label);
											setPriorityPopoverOpen(false);
										}}
										className="w-full flex items-center justify-between text-xs px-2 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
									>
										<span className="font-medium text-foreground">{p.label}</span>
										<span className="font-mono text-[10px] text-muted-foreground">{p.count}</span>
									</button>
								))}
							</PopoverContent>
						</Popover>

						<Button
							variant="outline"
							size="sm"
							className="h-7 text-[11px] border-zinc-200 dark:border-zinc-800 gap-1 text-muted-foreground"
						>
							<IconCalendar className="size-3" />
							<span>تاريخ الموعد</span>
						</Button>
					</div>

					{/* صف الإرسال والإلغاء مع إشعار البريد */}
					<div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
						<div className="flex items-center gap-1.5">
							<Switch
								id="notify-email-waitlist"
								checked={notifyEmail}
								onCheckedChange={setNotifyEmail}
							/>
							<label
								htmlFor="notify-email-waitlist"
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
								disabled={waitlistMutation.isPending}
								className="h-7 text-xs"
							>
								إلغاء
							</Button>
							<Button
								size="sm"
								onClick={handleSubmit}
								disabled={waitlistMutation.isPending}
								className="h-7 text-xs font-semibold px-3 gap-1 bg-primary text-primary-foreground"
							>
								<IconCheck className="size-3" />
								<span>{waitlistMutation.isPending ? "جاري الإرسال..." : "إرسال"}</span>
							</Button>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
