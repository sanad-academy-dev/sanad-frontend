import { useState, useEffect, useRef } from "react";
import {
	IconArrowsExchange,
	IconCheck,
	IconChevronDown,
	IconFileText,
	IconInfoCircle,
	IconSparkles,
	IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useReferRequest, useRegistrationReviewers } from "../../hooks/use-digital-registration";
import {
	RegistrationDrawerHeader,
	RegistrationDrawerGuardianCard,
} from "./registration-drawer-header";
import { generateReferralMessage } from "../../utils/ai-templates";

export const REFERRAL_REASONS = [
	"إعادة توزيع أعباء العمل والمتابعة الأكاديمية",
	"طلب فحص وتقييم تخصصي إضافي",
	"عدم توافق جدول المراجع الحالي مع المواعيد المتاحة",
	"سبب آخر",
];

interface ReferRequestDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	onSuccess?: () => void;
	isExpanded?: boolean;
}

export function ReferRequestDialog({
	request,
	open,
	onOpenChange,
	campaignId = "",
	onSuccess,
	isExpanded = false,
}: ReferRequestDialogProps) {
	const [reason, setReason] = useState<string>(REFERRAL_REASONS[0]);
	const [customReason, setCustomReason] = useState<string>("");
	const [reasonPopoverOpen, setReasonPopoverOpen] = useState(false);
	const [staffPopoverOpen, setStaffPopoverOpen] = useState(false);
	const [referredToStaffId, setReferredToStaffId] = useState<string | null>(null);
	const [notifyEmail, setNotifyEmail] = useState(false);
	const [enableMessage, setEnableMessage] = useState(false);
	const [messageText, setMessageText] = useState("");

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { data: staff = [], isLoading: staffLoading } = useRegistrationReviewers();
	const referMutation = useReferRequest(campaignId);

	useEffect(() => {
		if (open && request) {
			setReason(REFERRAL_REASONS[0]);
			setCustomReason("");
			setReasonPopoverOpen(false);
			setStaffPopoverOpen(false);
			setReferredToStaffId(null);
			setNotifyEmail(false);
			setEnableMessage(false);
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

	const selectedStaffMember = staff.find((s) => s.id === referredToStaffId);
	const currentReviewerName = request.assignedStaff?.name || request.reviewerName || "غير معيّن";

	const handleGenerateAI = (targetName?: string) => {
		const sName = targetName || selectedStaffMember?.name || "المراجع الجديد";
		const generated = generateReferralMessage({
			studentName: request.patientName || request.name || "الطالب",
			guardianName: request.guardianName,
			staffName: sName,
		});
		setMessageText(generated);
		toast.success("تم توليد نص الرسالة بنجاح");
	};

	const handleSubmit = () => {
		if (!referredToStaffId) {
			toast.error("يرجى اختيار الأخصائي أو المعلم المحال إليه ملف الطالب");
			return;
		}

		const finalReason =
			reason === "سبب آخر"
				? customReason.trim()
				: reason;

		if (!finalReason) {
			toast.error(reason === "سبب آخر" ? "يرجى كتابة سبب الإحالة" : "يرجى تحديد سبب الإحالة");
			return;
		}

		referMutation.mutate(
			{
				requestId: request.id,
				data: {
					referredToStaffId,
					reason: finalReason,
					notifyEmail,
					notifyGuardian: enableMessage,
					customMessage: enableMessage && messageText.trim() ? messageText.trim() : undefined,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تمت إحالة وإسناد ملف الطالب "${request.patientName || request.name}" بنجاح`);
					onOpenChange(false);
					onSuccess?.();
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل إحالة الطالب");
				},
			},
		);
	};

	return (
		<aside
			data-slot="refer-drawer"
			onWheel={handleDrawerWheel}
			className={cn("fixed z-50 w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]!  lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2! rounded-lg animate-in fade-in-0 duration-200 select-text", isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!")}
			dir="rtl"
		>
			{/* 1. رأس اللوحة الموحد */}
			<RegistrationDrawerHeader
				title="إحالة ملف الطالب"
				patientName={request.patientName || request.name}
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
					patientName={request.patientName || request.name}
				/>

				{/* سكشن 1: اختيار الأخصائي / المراجع المحال إليه */}
				<div className="space-y-1.5 pt-1">
					<div className="flex items-center justify-between text-xs">
						<label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
							إحالة إلى (الأخصائي أو المراجع) <span className="text-destructive">*</span>
						</label>
						<span className="text-[10px] text-muted-foreground">
							الحالي: <strong className="text-foreground">{currentReviewerName}</strong>
						</span>
					</div>

					<Popover open={staffPopoverOpen} onOpenChange={setStaffPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-full justify-between h-9 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 cursor-pointer"
							>
								<span className="flex items-center gap-2 truncate">
									<IconUser className="size-3.5 text-zinc-400 shrink-0" />
									<span className="truncate">
										{selectedStaffMember ? selectedStaffMember.name : "اختر الأخصائي المستهدف..."}
									</span>
								</span>
								<IconChevronDown className="size-3.5 opacity-60 shrink-0" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1.5" align="start" dir="rtl">
							{staffLoading ? (
								<div className="p-2 text-center text-xs text-muted-foreground">جاري التحميل...</div>
							) : staff.length === 0 ? (
								<div className="p-2 text-center text-xs text-muted-foreground">لا يوجد موظفون متاحون</div>
							) : (
								<div className="max-h-48 overflow-y-auto space-y-0.5">
									{staff.map((s) => (
										<button
											key={s.id}
											type="button"
											onClick={() => {
												setReferredToStaffId(s.id);
												setStaffPopoverOpen(false);
											}}
											className={cn(
												"w-full flex items-center justify-between gap-2 text-xs p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-right transition-colors cursor-pointer",
												referredToStaffId === s.id && "bg-muted font-bold text-primary",
											)}
										>
											<div className="flex items-center gap-2 min-w-0 flex-1">
												<Avatar className="size-6 shrink-0">
													<AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
														{s.name.slice(0, 2)}
													</AvatarFallback>
												</Avatar>
												<div className="flex flex-col min-w-0">
													<span className="truncate font-semibold text-zinc-800 dark:text-zinc-200">{s.name}</span>
													{s.phone && (
														<span className="text-[9px] text-muted-foreground font-mono" dir="ltr">
															{s.phone}
														</span>
													)}
												</div>
											</div>
											{referredToStaffId === s.id && <IconCheck className="size-3 text-primary shrink-0" />}
										</button>
									))}
								</div>
							)}
						</PopoverContent>
					</Popover>
				</div>

				{/* سكشن 2: سبب الإحالة (قائمة منسدلة مطابقة للصورة تماماً) */}
				<div className="space-y-1.5 pt-1">
					<label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
						سبب الإحالة <span className="text-destructive">*</span>
					</label>
					<Popover open={reasonPopoverOpen} onOpenChange={setReasonPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-full h-8.5 justify-between text-xs border-zinc-200 dark:border-zinc-800 font-normal px-2.5 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-850 cursor-pointer"
							>
								<span className="flex items-center gap-2 truncate">
									<IconFileText className="size-3.5 text-zinc-500 shrink-0" />
									<span className="truncate text-zinc-800 dark:text-zinc-200">{reason}</span>
								</span>
								<IconChevronDown className="size-3 opacity-60 shrink-0" />
							</Button>
						</PopoverTrigger>
						<PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1.5" dir="rtl">
							<p className="text-[11px] font-bold text-muted-foreground p-1.5">اختر سبب وتفاصيل الإحالة</p>
							<div className="space-y-0.5">
								{REFERRAL_REASONS.map((r) => (
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

					{/* يظهر حقل إدخال السبب فقط إذا تم اختيار "سبب آخر" */}
					{reason === "سبب آخر" && (
						<div className="pt-1">
							<Input
								value={customReason}
								onChange={(e) => setCustomReason(e.target.value)}
								placeholder="اكتب سبب الإحالة هنا..."
								className="h-8.5 text-xs bg-background"
								autoFocus
							/>
						</div>
					)}
				</div>

				{/* سكشن 3: سويتش تضمين رسالة لولي الأمر (نفس تصميم باقي الـ Drawers تماماً) */}
				<div className="flex items-center justify-between pt-1">
					<div className="flex flex-col gap-0.5">
						<label
							htmlFor="enable-msg-refer"
							className="text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
						>
							تضمين رسالة لولي الأمر
						</label>
						<span className="text-[10px] text-muted-foreground">
							{enableMessage ? "سيتم توثيق الرسالة وإشعار ولي الأمر بتغيير المراجع" : "لن يتم إرسال أي نص مكتوب"}
						</span>
					</div>
					<Switch
						id="enable-msg-refer"
						checked={enableMessage}
						onCheckedChange={setEnableMessage}
					/>
				</div>

				{enableMessage && (
					<div className="space-y-3">
						{/* مربع نص الرسالة */}
						<div className="space-y-1">
							<div className="flex items-center justify-between text-xs">
								<span className="font-bold text-zinc-800 dark:text-zinc-200">نص رسالة الإحالة</span>
								<button
									type="button"
									onClick={() => handleGenerateAI()}
									className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
								>
									<IconSparkles className="size-3.5 text-primary" />
									<span>صياغة تلقائية للرسالة</span>
								</button>
							</div>
							<Textarea
								value={messageText}
								onChange={(e) => setMessageText(e.target.value)}
								placeholder="السلام عليكم، نود إحاطتكم بأنه تم تحويل ومتابعة ملف الطالب إلى الأخصائي/المراجع..."
								className="min-h-32 text-xs leading-relaxed resize-none font-sans"
							/>
						</div>
					</div>
				)}

				{/* سكشن 4: بطاقة الإجراءات الآلية المعتمدة */}
				<div className="rounded-lg border border-purple-200/70 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 p-2.5 space-y-1.5 text-xs">
					<div className="flex items-center gap-1.5 font-bold text-purple-950 dark:text-purple-200 text-[11px]">
						<IconInfoCircle className="size-3.5 text-purple-600 shrink-0" />
						<span>إجراءات الإشعار الآلية المعتمدة:</span>
					</div>
					<ul className="space-y-1 text-zinc-600 dark:text-zinc-400 text-[10px] list-disc list-inside pr-1">
						<li>إشعار المراجع الجديد بالملف المحال وتفاصيل الإحالة.</li>
						<li>إشعار المراجع السابق بإخلاء مسؤوليته عن الطلب.</li>
						<li>تحديث جدول المواعيد الرسمي تلقائياً ليكون باسم المراجع الجديد.</li>
					</ul>
				</div>
			</div>

			{/* 3. فوتر اللوحة الموحد */}
			<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 mt-auto">
				<div className="flex items-center gap-2">
					<Switch
						id="notify-email-refer"
						checked={notifyEmail}
						onCheckedChange={setNotifyEmail}
					/>
					<label
						htmlFor="notify-email-refer"
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
						disabled={referMutation.isPending}
						className="text-xs h-8 cursor-pointer"
					>
						إلغاء
					</Button>
					<Button
						size="sm"
						onClick={handleSubmit}
						disabled={referMutation.isPending}
						className="text-xs h-8 font-semibold px-4 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-2xs cursor-pointer"
					>
						<IconArrowsExchange className="size-3.5" />
						<span>{referMutation.isPending ? "جاري الإسناد..." : "تأكيد الإحالة ونقل المسؤولية"}</span>
					</Button>
				</div>
			</div>
		</aside>
	);
}
