import { useState } from "react";
import {
	IconAlertCircle,
	IconArrowRight,
	IconCheck,
	IconClock,
	IconSparkles,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useWaitlistRequest } from "../../hooks/use-digital-registration";
import { generateWaitlistMessage } from "../../utils/ai-templates";

interface WaitlistRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
}

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
	const [notifyEmail, setNotifyEmail] = useState(false);
	const waitlistMutation = useWaitlistRequest(campaignId);

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
							<p className="rounded-md bg-muted/60 px-2.5 py-2 text-[10px] text-muted-foreground">
								سيكون المستلم ولي الأمر: <span className="font-mono" dir="ltr">{request.guardianPhone || "غير محدد"}</span>
							</p>
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
				</div>

				{/* شريط الإجراءات والفوتر السفلي */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-2 shrink-0 mt-auto">
					{/* صف الإرسال والإلغاء مع إشعار البريد */}
					<div className="flex items-center justify-between">
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
