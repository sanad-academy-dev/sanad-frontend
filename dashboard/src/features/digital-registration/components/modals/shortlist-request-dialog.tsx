import { useState } from "react";
import {
	IconArrowRight,
	IconCheck,
	IconChevronDown,
	IconClock,
	IconSchool,
	IconSparkles,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useShortlistRequest } from "../../hooks/use-digital-registration";
import { generateShortlistMessage } from "../../utils/ai-templates";

interface ShortlistRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
}

const CLASS_OPTIONS = [
	"النجوم",
	"براعم النور",
	"الصف التمهيدي",
	"الروضة الأولى (KG1)",
	"الروضة الثانية (KG2)",
	"عباقرة الغد",
];

export function ShortlistRequestDialog({
	request,
	open,
	onOpenChange,
	campaignId = "",
}: ShortlistRequestDialogProps) {
	const [enableMessage, setEnableMessage] = useState(true);
	const [messageText, setMessageText] = useState("");
	const [selectedClass, setSelectedClass] = useState<string | null>(request?.targetClass || null);
	const [notifyEmail, setNotifyEmail] = useState(false);

	const [classPopoverOpen, setClassPopoverOpen] = useState(false);

	const shortlistMutation = useShortlistRequest(campaignId);

	if (!request) return null;

	const handleGenerateAI = () => {
		const generated = generateShortlistMessage({
			studentName: request.patientName,
			guardianName: request.guardianName,
			targetClass: selectedClass || request.targetClass,
		});
		setMessageText(generated);
		toast.success("تمت إضافة مسودة رسالة قابلة للتعديل");
	};

	const handleSubmit = () => {
		shortlistMutation.mutate(
			{
				requestId: request.id,
				data: {
					targetClass: selectedClass,
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
				<div className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain sanad-scrollbar">
					{/* سويتش إضافة / إغلاق رسالة */}
					<div className="flex items-center justify-between pt-1">
						<label
							htmlFor="enable-msg-shortlist"
							className="text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
						>
							{enableMessage ? "إغلاق رسالة" : "إضافة رسالة"}
						</label>
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

				{/* شريط الإجراءات والفوتر السفلي (مطابق للصورة 93b113b5) */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-2 shrink-0">
					{/* صف أدوات التعيين السريعة */}
					<div className="flex items-center gap-1.5 flex-wrap">
						{/* اختيار الفصل */}
						<Popover open={classPopoverOpen} onOpenChange={setClassPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-7 text-[11px] border-zinc-200 dark:border-zinc-800 gap-1"
								>
									<IconSchool className="size-3 text-zinc-500" />
									<span>{selectedClass || "تعيين فصل"}</span>
									<IconChevronDown className="size-2.5 opacity-60" />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-48 p-1.5" dir="rtl">
								<p className="text-[11px] font-bold text-muted-foreground p-1.5">اختر الفصل</p>
								{CLASS_OPTIONS.map((cls) => (
									<button
										key={cls}
										type="button"
										onClick={() => {
											setSelectedClass(cls);
											setClassPopoverOpen(false);
										}}
										className="w-full text-right text-xs px-2 py-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
									>
										{cls}
									</button>
								))}
							</PopoverContent>
						</Popover>

						<Badge variant="outline" className="h-7 text-[11px] border-zinc-200 dark:border-zinc-800 gap-1 text-muted-foreground">
							<IconClock className="size-3" />
							<span>سيُنقل للقائمة المختصرة</span>
						</Badge>

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
							<span>{shortlistMutation.isPending ? "جاري الإرسال..." : "إرسال قبول الطلب"}</span>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
