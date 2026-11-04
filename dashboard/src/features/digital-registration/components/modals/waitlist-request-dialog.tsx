import { useState, useEffect } from "react";
import {
	IconAlertCircle,
	IconArrowRight,
	IconCheck,
	IconChevronDown,
	IconClock,
	IconFileText,
	IconSparkles,
	IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
} from "@/components/ui/sheet";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useRegistrationReviewers, useWaitlistRequest } from "../../hooks/use-digital-registration";
import { generateWaitlistMessage } from "../../utils/ai-templates";
import { PriorityPickerPopover } from "../priority-picker-popover";

interface WaitlistRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
}

const WAITLIST_REASONS = [
	"عدم توفر مقاعد شاغرة حالياً",
	"اكتمال الطاقة الاستيعابية للفصل المطلوب",
	"رغبة ولي الأمر في تأجيل موعد الالتحاق",
	"سن الطالب دون المرحلة المطلوبة بأشهر",
	"أسباب إدارية أخرى",
];

export function WaitlistRequestDialog({
	request,
	open,
	onOpenChange,
	campaignId = "",
}: WaitlistRequestDialogProps) {
	const [enableMessage, setEnableMessage] = useState(true);
	const [messageText, setMessageText] = useState("");
	const [priority, setPriority] = useState<string>(request?.priority || "بدون أولوية");
	const [assignedStaffId, setAssignedStaffId] = useState<string | null>(
		request?.assignedStaff?.id || request?.assignedStaffId || null,
	);
	const [reason, setReason] = useState<string>(WAITLIST_REASONS[0]);
	const [notifyEmail, setNotifyEmail] = useState(false);

	const [staffPopoverOpen, setStaffPopoverOpen] = useState(false);
	const [reasonPopoverOpen, setReasonPopoverOpen] = useState(false);

	const { data: staff = [], isLoading: isStaffLoading } = useRegistrationReviewers();
	const waitlistMutation = useWaitlistRequest(campaignId);

	useEffect(() => {
		if (open && request) {
			setPriority(request.priority || "بدون أولوية");
			setAssignedStaffId(request?.assignedStaff?.id || request?.assignedStaffId || null);
			setReason(WAITLIST_REASONS[0]);
			setMessageText("");
		}
	}, [open, request]);

	if (!request) return null;

	const queueRank = request.queueRank ?? null;
	const estimatedWait = request.estimatedWait ?? null;

	const handleGenerateAI = () => {
		const generated = generateWaitlistMessage({
			studentName: request.patientName,
			guardianName: request.guardianName,
			targetClass: request.targetClass,
			queueRank,
			estimatedWait,
		});
		setMessageText(generated);
		toast.success("تمت إضافة مسودة رسالة قابلة للتعديل");
	};

	const handleSubmit = () => {
		waitlistMutation.mutate(
			{
				requestId: request.id,
				data: {
					priority: priority !== "بدون أولوية" ? priority : null,
					assignedStaffId,
					reason,
					subject: `إدراج في قائمة الانتظار - #${request.code || request.requestNumber}`,
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

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
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
				className="w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]! lg:left-[calc(60vw+0.75rem)]! lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background z-50 h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2!"
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
							إدراج في قائمة الانتظار
						</span>
					</div>

					<div className="flex items-center gap-1.5 text-xs min-w-0">
						<span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
							{request.patientName}
						</span>
					</div>
				</div>

				{/* محتوى اللوحة القابل للتمرير */}
				<div className="p-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto overscroll-contain sanad-scrollbar">
					{/* بانر قائمة الانتظار الأزرق (مطابق للصورة 3) */}
					<div className="rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 p-2.5 space-y-1.5 text-xs text-blue-900 dark:text-blue-300">
						<div className="flex items-center gap-1.5 font-bold">
							<IconAlertCircle className="size-4 text-blue-600 shrink-0" />
							<span>
								{queueRank
									? `ترتيب الطالب المسجل في قائمة الانتظار هو #${queueRank}، وسيتم إشعار المراجع وولي الأمر عند توفر مقعد شاغر.`
									: "لا توجد مقاعد شاغرة حالياً. سيُحتسب ترتيب الطالب تلقائياً عند تأكيد إدراجه في قائمة الانتظار."}
							</span>
						</div>
						{estimatedWait && (
							<div className="flex items-center gap-1 text-[11px] text-blue-700 dark:text-blue-400 pr-5">
								<IconClock className="size-3" />
								<span>الوقت المتوقع للانتظار: {estimatedWait}</span>
							</div>
						)}
					</div>

					{/* سويتش تضمين رسالة لولي الأمر */}
					<div className="flex items-center justify-between pt-1">
						<div className="flex flex-col gap-0.5">
							<label
								htmlFor="enable-msg-waitlist"
								className="text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
							>
								تضمين رسالة لولي الأمر
							</label>
							<span className="text-[10px] text-muted-foreground">
								{enableMessage ? "سيتم توثيق الرسالة وإشعار ولي الأمر بالترتيب" : "لن يتم إرسال أي نص مكتوب"}
							</span>
						</div>
						<Switch
							id="enable-msg-waitlist"
							checked={enableMessage}
							onCheckedChange={setEnableMessage}
						/>
					</div>

					{enableMessage && (
						<div className="space-y-3">
							<p className="rounded-md bg-muted/60 px-2.5 py-2 text-[10px] text-muted-foreground">
								سيكون المستلم ولي الأمر: <span className="font-mono" dir="ltr">{request.guardianPhone || "غير محدد"}</span>
							</p>

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
										<span>صياغة تلقائية للرسالة</span>
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

					{/* سبب الإدراج في قائمة الانتظار (تحت نص الرسالة مباشرة وبنفس عرض الصندوق) */}
					<div className="space-y-1.5 pt-1 pb-4">
						<label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
							سبب الإدراج في قائمة الانتظار
						</label>
						<Popover open={reasonPopoverOpen} onOpenChange={setReasonPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full h-8.5 justify-between text-xs border-zinc-200 dark:border-zinc-800 font-normal px-2.5 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-850"
								>
									<span className="flex items-center gap-2 truncate">
										<IconFileText className="size-3.5 text-zinc-500 shrink-0" />
										<span className="truncate text-zinc-800 dark:text-zinc-200">{reason}</span>
									</span>
									<IconChevronDown className="size-3 opacity-60 shrink-0" />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1.5" dir="rtl">
								<p className="text-[11px] font-bold text-muted-foreground p-1.5">اختر سبب الإدراج بالانتظار</p>
								<div className="space-y-0.5">
									{WAITLIST_REASONS.map((r) => (
										<button
											key={r}
											type="button"
											onClick={() => {
												setReason(r);
												setReasonPopoverOpen(false);
											}}
											className={cn(
												"w-full flex items-center justify-between text-right text-xs px-2.5 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
												reason === r && "bg-muted font-bold text-primary",
											)}
										>
											<span>{r}</span>
											{reason === r && <IconCheck className="size-3 text-primary shrink-0" />}
										</button>
									))}
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				{/* شريط أدوات التعيين السريعة */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-1.5 shrink-0">
					{/* اختيار الأولوية بالاعتماد على المكون الجاهز */}
					<PriorityPickerPopover
						value={priority}
						onChange={setPriority}
						className="h-7 text-[11px] border-zinc-200 dark:border-zinc-800"
					/>

					{/* اختيار المراجع الأكاديمي */}
					<Popover open={staffPopoverOpen} onOpenChange={setStaffPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-7 text-[11px] border-zinc-200 dark:border-zinc-800 gap-1 max-w-[140px] font-normal"
							>
								<IconUser className="size-3 text-zinc-500 shrink-0" />
								<span className="truncate">
									{staff.find((s) => s.id === assignedStaffId)?.name || "تعيين مراجع"}
								</span>
								<IconChevronDown className="size-2.5 opacity-60 shrink-0" />
							</Button>
						</PopoverTrigger>
						<PopoverContent align="start" className="w-56 p-1.5" dir="rtl">
							<p className="text-[11px] font-bold text-muted-foreground p-1.5">اختر المراجع المسؤول</p>
							{isStaffLoading ? (
								<div className="p-2 text-center text-xs text-muted-foreground">جاري التحميل...</div>
							) : staff.length === 0 ? (
								<div className="p-2 text-center text-xs text-muted-foreground">لا يوجد موظفون متاحون</div>
							) : (
								<div className="space-y-0.5 max-h-48 overflow-y-auto sanad-scrollbar">
									<button
										type="button"
										onClick={() => {
											setAssignedStaffId(null);
											setStaffPopoverOpen(false);
										}}
										className="w-full text-right text-xs px-2 py-1.5 rounded text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
									>
										بدون مراجع (إلغاء التعيين)
									</button>
									{staff.map((s) => (
										<button
											key={s.id}
											type="button"
											onClick={() => {
												setAssignedStaffId(s.id);
												setStaffPopoverOpen(false);
											}}
											className={cn(
												"w-full flex items-center gap-2 text-xs px-2 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-right cursor-pointer",
												assignedStaffId === s.id && "bg-muted font-bold",
											)}
										>
											<Avatar className="size-5 shrink-0">
												<AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
													{s.name.slice(0, 2)}
												</AvatarFallback>
											</Avatar>
											<div className="flex flex-col min-w-0">
												<span className="truncate">{s.name}</span>
												{s.role && <span className="text-[9px] text-muted-foreground truncate">{s.role}</span>}
											</div>
										</button>
									))}
								</div>
							)}
						</PopoverContent>
					</Popover>
				</div>

				{/* صف الإرسال والإلغاء مع إشعار البريد (فوتر مثبت) */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 mt-auto">
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
							className="h-8 text-xs cursor-pointer"
						>
							إلغاء
						</Button>
						<Button
							size="sm"
							onClick={handleSubmit}
							disabled={waitlistMutation.isPending}
							className="h-8 text-xs font-semibold px-3 gap-1 bg-primary text-primary-foreground cursor-pointer"
						>
							<IconCheck className="size-3" />
							<span>{waitlistMutation.isPending ? "جاري الحفظ..." : "تأكيد الإدراج بالانتظار"}</span>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
