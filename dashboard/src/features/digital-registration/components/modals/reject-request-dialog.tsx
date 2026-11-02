import { useState } from "react";
import {
	IconArrowRight,
	IconChevronDown,
	IconMail,
	IconPhone,
	IconSparkles,
	IconTrash,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useRejectRequest } from "../../hooks/use-digital-registration";
import { generateRejectMessage } from "../../utils/ai-templates";

interface RejectRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
}

const REJECTION_REASONS = [
	"عدم استيفاء شروط القبول بالبرنامج",
	"عدم حضور موعد التقييم أو المقابلة",
	"عدم توافر مقاعد شاغرة في البرنامج",
	"المرحلة العمرية غير مطابقة لشروط القبول",
	"التقرير الطبي/النفسي يتطلب برنامج رعاية خاص",
	"طلب ولي الأمر إلغاء التسجيل",
	"سبب آخر",
];

export function RejectRequestDialog({
	request,
	open,
	onOpenChange,
	campaignId = "",
}: RejectRequestDialogProps) {
	const [reason, setReason] = useState<string>("عدم استيفاء شروط القبول بالبرنامج");
	const [customReason, setCustomReason] = useState("");
	const [subject, setSubject] = useState(
		request ? `إشعار بخصوص طلب الالتحاق - #${request.code}` : "",
	);
	const [messageText, setMessageText] = useState("");
	const [enableMessage, setEnableMessage] = useState(true);
	const [notifyEmail, setNotifyEmail] = useState(false);

	const rejectMutation = useRejectRequest(campaignId);

	if (!request) return null;

	const handleGenerateAI = () => {
		const activeReason = reason === "سبب آخر" ? customReason || "شروط القبول" : reason;
		const generated = generateRejectMessage({
			studentName: request.patientName,
			guardianName: request.guardianName,
			reason: activeReason,
		});
		setMessageText(generated);
		toast.success("تمت إضافة مسودة رسالة قابلة للتعديل");
	};

	const handleSubmit = () => {
		const activeReason = reason === "سبب آخر" ? customReason.trim() : reason;
		if (!activeReason) {
			toast.error("يرجى تحديد أو كتابة سبب الرفض");
			return;
		}

		rejectMutation.mutate(
			{
				requestId: request.id,
				data: {
					reason,
					customReason: reason === "سبب آخر" ? customReason.trim() : undefined,
					subject: subject.trim(),
					customMessage: enableMessage ? messageText.trim() : undefined,
					notifyEmail,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تم تسجيل رفض طلب الطالب "${request.patientName}"`);
					onOpenChange(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل تسجيل رفض الطلب");
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
				{/* رأس اللوحة مع زر الرجوع واسم الطالب بدون كود الطلب المكدس */}
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
						<span className="text-xs font-bold text-red-600 dark:text-red-400">
							رفض طلب التسجيل والاعتذار
						</span>
					</div>

					<div className="flex items-center gap-1.5 text-xs min-w-0">
						<span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
							{request.patientName}
						</span>
					</div>
				</div>

				{/* محتوى اللوحة */}
				<div className="p-3.5 space-y-3.5 flex-1 min-h-0 overflow-y-auto overscroll-contain sanad-scrollbar">
					{/* سبب الرفض */}
					<div className="space-y-1.5">
						<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">
							سبب الرفض والاعتذار <span className="text-destructive">*</span>
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
								{REJECTION_REASONS.map((r) => (
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
								placeholder="اكتب سبب الرفض بالتفصيل..."
								className="h-8 text-xs mt-1"
							/>
						)}
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
							htmlFor="enable-msg-reject"
							className="text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
						>
							{enableMessage ? "إغلاق رسالة" : "إضافة رسالة"}
						</label>
						<Switch
							id="enable-msg-reject"
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
									<label className="text-[10.5px] text-muted-foreground block font-medium">نص رسالة الاعتذار</label>
									<button
										type="button"
										onClick={handleGenerateAI}
										className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1 transition-colors"
									>
										<IconSparkles className="size-3 text-primary" />
										<span>صياغة تلقائية للرسالة</span>
									</button>
								</div>
								<Textarea
									value={messageText}
									onChange={(e) => setMessageText(e.target.value)}
									placeholder="اكتب نص الاعتذار أو انقر على «صياغة تلقائية للرسالة»..."
									className="min-h-24 text-xs leading-relaxed resize-none font-sans"
								/>
							</div>
						</div>
					)}
				</div>

				{/* فوتر اللوحة */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 mt-auto">
					<div className="flex items-center gap-2">
						<Switch
							id="notify-email-reject"
							checked={notifyEmail}
							onCheckedChange={setNotifyEmail}
						/>
						<label
							htmlFor="notify-email-reject"
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
							disabled={rejectMutation.isPending}
							className="text-xs h-8"
						>
							إلغاء
						</Button>
						<Button
							size="sm"
							onClick={handleSubmit}
							disabled={rejectMutation.isPending}
							variant="destructive"
							className="text-xs h-8 font-semibold px-4 gap-1.5"
						>
							<IconTrash className="size-3.5" />
							<span>{rejectMutation.isPending ? "جاري الحفظ..." : "تأكيد الرفض"}</span>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
