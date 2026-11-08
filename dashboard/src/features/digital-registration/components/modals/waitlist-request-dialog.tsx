import { useState, useEffect, useRef } from "react";
import {
	IconArrowRight,
	IconCheck,
	IconChevronDown,
	IconFileText,
	IconSparkles,
	IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import {
	RegistrationDrawerHeader,
	RegistrationDrawerGuardianCard,
} from "./registration-drawer-header";

interface WaitlistRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	onSuccess?: () => void;
	isExpanded?: boolean;
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
	onSuccess,
	isExpanded = false,
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

	const scrollContainerRef = useRef<HTMLDivElement>(null);

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

	if (!open || !request) return null;

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
		toast.success("تم توليد نص الرسالة وقابل للتعديل");
	};

	const handleSubmit = () => {
		waitlistMutation.mutate(
			{
				requestId: request.id,
				data: {
					priority: priority !== "بدون أولوية" ? priority : null,
					assignedStaffId,
					reason,
					subject: `إدراج في قائمة الانتظار - #${request.code || request.id}`,
					customMessage: enableMessage ? messageText.trim() : undefined,
					notifyEmail,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تم إدراج الطالب "${request.patientName}" في قائمة الانتظار بنجاح`);
					onOpenChange(false);
					onSuccess?.();
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل إدراج الطالب في قائمة الانتظار");
				},
			},
		);
	};

	return (
		<aside
			data-slot="waitlist-drawer"
			onWheel={handleDrawerWheel}
			className={cn("fixed z-50 w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]!  lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2! rounded-lg animate-in fade-in-0 duration-200 select-text", isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!")}
			dir="rtl"
		>
				{/* 1. رأس اللوحة الموحد */}
				<RegistrationDrawerHeader
					title="نقل إلى قائمة الانتظار"
					patientName={request.patientName}
					code={request.code}
					onClose={() => onOpenChange(false)}
				/>

				{/* 2. محتوى اللوحة القابل للتمرير */}
				<div
					ref={scrollContainerRef}
					className="p-4 space-y-3.5 flex-1 min-h-0 overflow-y-auto scrollbar-thin select-text"
					style={{ touchAction: "pan-y" }}
				>
					{/* بطاقة ولي الأمر الموحدة */}
					<RegistrationDrawerGuardianCard
						guardianName={request.guardianName}
						guardianPhone={request.guardianPhone}
						guardianEmail={request.guardianEmail}
						patientName={request.patientName}
					/>

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

				{/* 3. شريط أدوات التعيين والخيارات السريعة فوق الفوتر */}
				<div className="p-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
					<div className="flex items-center gap-1.5 flex-wrap">
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
												{staff.find((s) => s.id === assignedStaffId)?.name
													? `إسناد: ${staff.find((s) => s.id === assignedStaffId)?.name}`
													: "تعيين مراجع..."}
											</span>
										</span>
										<IconChevronDown className="size-3 opacity-60 shrink-0" />
									</Button>
								</PopoverTrigger>
								<PopoverContent align="start" className="w-56 p-1.5 z-50 bg-popover border border-border shadow-xl rounded-xl" dir="rtl">
									<p className="text-[10.5px] font-bold text-zinc-900 dark:text-zinc-100 p-1 border-b border-border/50">
										إسناد الملف إلى...
									</p>
									<div className="max-h-48 overflow-y-auto space-y-0.5 pt-1">
										{isStaffLoading ? (
											<p className="text-[10px] p-2 text-center text-muted-foreground">جاري التحميل...</p>
										) : staff.length === 0 ? (
											<p className="text-[10px] p-2 text-center text-muted-foreground">لا يوجد موظفون متاحون</p>
										) : (
											<>
												<button
													type="button"
													onClick={() => {
														setAssignedStaffId(null);
														setStaffPopoverOpen(false);
													}}
													className="w-full text-right text-xs p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground transition-colors cursor-pointer"
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
														className="w-full text-right text-xs p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors cursor-pointer"
													>
														<div className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs">
															{s.name.slice(0, 1)}
														</div>
														<span className="truncate font-medium text-[11px]">{s.name}</span>
													</button>
												))}
											</>
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

				{/* 4. صف الإرسال والإلغاء مع إشعار البريد (فوتر مثبت) */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 mt-auto">
					<div className="flex items-center gap-2">
						<Switch
							id="notify-email-waitlist"
							checked={notifyEmail}
							onCheckedChange={setNotifyEmail}
						/>
						<label
							htmlFor="notify-email-waitlist"
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
							disabled={waitlistMutation.isPending}
							className="h-8 text-xs cursor-pointer"
						>
							إلغاء
						</Button>
						<Button
							size="sm"
							onClick={handleSubmit}
							disabled={waitlistMutation.isPending}
							className="h-8 text-xs font-semibold px-4 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-2xs cursor-pointer"
						>
							<IconCheck className="size-3.5" />
							<span>{waitlistMutation.isPending ? "جاري الحفظ..." : "تأكيد الإدراج بالانتظار"}</span>
						</Button>
					</div>
				</div>
		</aside>
	);
}
