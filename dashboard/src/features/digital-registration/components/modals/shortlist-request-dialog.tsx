import { useState, useEffect } from "react";
import {
	IconArrowRight,
	IconCheck,
	IconChevronDown,
	IconSparkles,
	IconUser,
	IconX,
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
import { useRegistrationReviewers, useShortlistRequest } from "../../hooks/use-digital-registration";
import { generateShortlistMessage } from "../../utils/ai-templates";
import { PriorityPickerPopover } from "../priority-picker-popover";

interface ShortlistRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
}

export function ShortlistRequestDialog({
	request,
	open,
	onOpenChange,
	campaignId = "",
}: ShortlistRequestDialogProps) {
	const [enableMessage, setEnableMessage] = useState(true);
	const [messageText, setMessageText] = useState("");
	const [priority, setPriority] = useState<string>(request?.priority || "بدون أولوية");
	const [assignedStaffId, setAssignedStaffId] = useState<string | null>(
		request?.assignedStaff?.id || request?.assignedStaffId || null,
	);
	const [notifyEmail, setNotifyEmail] = useState(false);

	const [staffPopoverOpen, setStaffPopoverOpen] = useState(false);

	const { data: staff = [], isLoading: isStaffLoading } = useRegistrationReviewers();
	const shortlistMutation = useShortlistRequest(campaignId);

	useEffect(() => {
		if (open && request) {
			setPriority(request.priority || "بدون أولوية");
			setAssignedStaffId(request?.assignedStaff?.id || request?.assignedStaffId || null);
		}
	}, [open, request]);

	if (!request) return null;

	const handleGenerateAI = () => {
		const generated = generateShortlistMessage({
			studentName: request.patientName,
			guardianName: request.guardianName,
			targetClass: request.targetClass,
		});
		setMessageText(generated);
		toast.success("تمت إضافة مسودة رسالة قابلة للتعديل");
	};

	const handleSubmit = () => {
		shortlistMutation.mutate(
			{
				requestId: request.id,
				data: {
					targetClass: request.targetClass,
					priority: priority !== "بدون أولوية" ? priority : null,
					assignedStaffId,
					customMessage: enableMessage ? messageText.trim() : undefined,
					notifyEmail,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تم ترشيح الطالب "${request.patientName}" للقائمة المختصرة بنجاح`);
					onOpenChange(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل تسجيل الطالب بالقائمة المختصرة");
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
							تسجيل طالب بالقائمة المختصرة
						</span>
					</div>

					<div className="flex items-center gap-1.5 text-xs min-w-0">
						<span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
							{request.patientName}
						</span>
					</div>
				</div>

				{/* محتوى اللوحة القابل للتمرير */}
				<div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-thin">
					{/* سويتش تضمين رسالة لولي الأمر */}
					<div className="flex items-center justify-between pt-1">
						<div className="flex flex-col gap-0.5">
							<label
								htmlFor="enable-msg-shortlist"
								className="text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
							>
								تضمين رسالة لولي الأمر
							</label>
							<span className="text-[10px] text-muted-foreground">
								{enableMessage ? "سيتم حفظ الرسالة وإشعار ولي الأمر" : "لن يتم إرسال أي نص مكتوب"}
							</span>
						</div>
						<Switch
							id="enable-msg-shortlist"
							checked={enableMessage}
							onCheckedChange={setEnableMessage}
						/>
					</div>

					{enableMessage && (
						<div className="space-y-3">
							<p className="rounded-md bg-muted/60 px-2.5 py-2 text-[10px] text-muted-foreground">
								ستُسجل الرسالة ضمن الطلب لإرسالها إلى ولي الأمر: <span className="font-mono" dir="ltr">{request.guardianPhone || "غير محدد"}</span>
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
									placeholder="مرحباً، لقد قمنا بإضافة ابنك للقائمة المختصرة..."
									className="min-h-36 text-xs leading-relaxed resize-none font-sans"
								/>
							</div>
						</div>
					)}
				</div>

				{/* شريط الإجراءات والفوتر السفلي */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-2 shrink-0">
					{/* صف أدوات التعيين السريعة */}
					<div className="flex items-center gap-1.5 flex-wrap">
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
									className="h-7 text-[11px] border-zinc-200 dark:border-zinc-800 gap-1 max-w-[130px] font-normal"
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
									<div className="space-y-0.5 max-h-48 overflow-y-auto scrollbar-thin">
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
				</div>

				{/* صف الإرسال والإلغاء مع إشعار البريد (فوتر مثبت) */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 mt-auto">
					<div className="flex items-center gap-1.5">
						<Switch
							id="notify-email-shortlist"
							checked={notifyEmail}
							onCheckedChange={setNotifyEmail}
						/>
						<label
							htmlFor="notify-email-shortlist"
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
							disabled={shortlistMutation.isPending}
							className="h-8 text-xs cursor-pointer"
						>
							إلغاء
						</Button>
						<Button
							size="sm"
							onClick={handleSubmit}
							disabled={shortlistMutation.isPending}
							className="h-8 text-xs font-semibold px-3 gap-1 bg-primary text-primary-foreground cursor-pointer"
						>
							<IconCheck className="size-3" />
							<span>{shortlistMutation.isPending ? "جاري الحفظ..." : "تأكيد الإضافة للمختصرة"}</span>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
