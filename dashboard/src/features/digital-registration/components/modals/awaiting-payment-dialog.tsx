import { useEffect, useRef, useState } from "react";
import {
	IconCheck,
	IconChevronDown,
	IconCopy,
	IconExternalLink,
	IconLoader2,
	IconRefresh,
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
import { PriorityPickerPopover } from "../priority-picker-popover";
import {
	RegistrationDrawerHeader,
	RegistrationDrawerGuardianCard,
} from "./registration-drawer-header";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import {
	useAwaitingPaymentRequest,
	useRenewPaymentToken,
	useDigitalRegistrationCapabilities,
	useRegistrationReviewers,
} from "../../hooks/use-digital-registration";
import { generateAwaitingPaymentMessage, getPublicPaymentUrl } from "../../utils/ai-templates";
import { cn } from "@/lib/utils";

interface AwaitingPaymentDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	onSuccess?: () => void;
	isExpanded?: boolean;
}

export function AwaitingPaymentDialog({
	request,
	open,
	onOpenChange,
	campaignId = "",
	onSuccess,
	isExpanded = false,
}: AwaitingPaymentDialogProps) {
	const [enableMessage, setEnableMessage] = useState<boolean>(true);
	const [messageText, setMessageText] = useState<string>("");
	const [priority, setPriority] = useState<string>("بدون أولوية");
	const [assignedStaffId, setAssignedStaffId] = useState<string | null>(null);
	const [notifyEmail, setNotifyEmail] = useState<boolean>(false);

	const [staffPopoverOpen, setStaffPopoverOpen] = useState<boolean>(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);
	const { data: staff = [], isLoading: isStaffLoading } = useRegistrationReviewers();
	const awaitingPaymentMutation = useAwaitingPaymentRequest(campaignId);
	const renewMutation = useRenewPaymentToken(campaignId);

	// استرجاع وضبط بيانات الطلب الحالي فور فتح اللوحة
	useEffect(() => {
		if (open && request) {
			setPriority(request.priority || "بدون أولوية");
			setAssignedStaffId(request.assignedStaff?.id || request.assignedStaffId || null);
			setEnableMessage(true);
			setNotifyEmail(false);
			const initialMsg = generateAwaitingPaymentMessage({
				studentName: request.patientName || request.name || "الطالب",
				guardianName: request.guardianName,
				planName: request.subscriptionPlanName,
				amount: request.subscriptionAmount ? Number(request.subscriptionAmount) : null,
				paymentToken: request.paymentToken,
			});
			setMessageText(initialMsg);
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

	// معالج تمرير الماوس بالـ wheel لضمان التمرير السلس دائماً داخل اللوحة
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

	const handleGenerateAI = () => {
		const generated = generateAwaitingPaymentMessage({
			studentName: request.patientName || request.name || "الطالب",
			guardianName: request.guardianName,
			planName: request.subscriptionPlanName,
			amount: request.subscriptionAmount ? Number(request.subscriptionAmount) : null,
			paymentToken: request.paymentToken,
		});
		setMessageText(generated);
		toast.success("تم توليد نص الرسالة متضمناً رابط السداد الذكي");
	};

	const handleRenewLink = () => {
		renewMutation.mutate(
			{ requestId: request.id, hours: 72 },
			{
				onSuccess: (res: any) => {
					toast.success("تم تجديد وتمديد صلاحية رابط السداد لـ 72 ساعة إضافية");
					if (res.paymentToken) {
						request.paymentToken = res.paymentToken;
						request.paymentTokenExpiresAt = res.paymentTokenExpiresAt;
						const updatedMsg = generateAwaitingPaymentMessage({
							studentName: request.patientName || request.name || "الطالب",
							guardianName: request.guardianName,
							planName: request.subscriptionPlanName,
							amount: request.subscriptionAmount ? Number(request.subscriptionAmount) : null,
							paymentToken: res.paymentToken,
						});
						setMessageText(updatedMsg);
					}
				},
				onError: (err: any) => {
					toast.error(err?.message || "فشل تجديد رابط السداد");
				},
			}
		);
	};

	const handleSubmit = () => {
		if (!capabilities.canChangeStatus) {
			toast.error("ليس لديك صلاحية لتحديث حالة الطلب");
			return;
		}

		if (enableMessage && !messageText.trim()) {
			toast.error("يرجى كتابة نص الرسالة لولي الأمر أو إلغاء تفعيل خيار التضمين");
			return;
		}

		awaitingPaymentMutation.mutate(
			{
				requestId: request.id,
				data: {
					subscriptionPlanId: request.subscriptionPlanId || undefined,
					subscriptionPlanName: request.subscriptionPlanName || undefined,
					subscriptionAmount: request.subscriptionAmount ? Number(request.subscriptionAmount) : undefined,
					includeMeals: request.includeMeals,
					enableDailyStipend: request.enableDailyStipend,
					priority: priority !== "بدون أولوية" ? priority : null,
					assignedStaffId: assignedStaffId || undefined,
					subject: `بانتظار سداد الرسوم الأكاديمية - طلب #${request.code || request.id}`,
					customMessage: enableMessage ? messageText.trim() || undefined : undefined,
					notifyEmail,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تم نقل طلب الطالب "${request.patientName || request.name}" إلى بانتظار الدفع بنجاح`);
					onOpenChange(false);
					onSuccess?.();
				},
				onError: (err: unknown) => {
					toast.error(err instanceof Error ? err.message : "فشل نقل الطلب إلى بانتظار الدفع");
				},
			},
		);
	};

	return (
		<aside
			data-slot="awaiting-payment-drawer"
			onWheel={handleDrawerWheel}
			className={cn("fixed z-50 w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]!  lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2! rounded-lg animate-in fade-in-0 duration-200 select-text", isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!")}
			dir="rtl"
		>
			{/* 1. رأس اللوحة الموحد */}
			<RegistrationDrawerHeader
				title="نقل إلى بانتظار الدفع"
				patientName={request.patientName || request.name}
				code={request.code}
				onClose={() => onOpenChange(false)}
			/>

			{/* 2. محتوى اللوحة القابل للتمرير */}
			<div
				ref={scrollContainerRef}
				className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto scrollbar-thin select-text"
				style={{ touchAction: "pan-y" }}
			>
				{/* بطاقة ولي الأمر الموحدة */}
				<RegistrationDrawerGuardianCard
					guardianName={request.guardianName}
					guardianPhone={request.guardianPhone}
					guardianEmail={request.guardianEmail}
					patientName={request.patientName || request.name}
				/>

				{/* بطاقة رابط السداد الإلكتروني الذكي */}
				{request.paymentToken && (
					<div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5 text-xs font-bold text-primary">
								<IconSparkles className="h-4 w-4" />
								<span>رابط سداد الرسوم الإلكتروني المخصص</span>
							</div>
							<span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
								مشفر وصالح
							</span>
						</div>
						<div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/80 px-2.5 py-1.5 text-xs font-mono text-muted-foreground truncate select-all" dir="ltr">
							<span className="truncate flex-1">{getPublicPaymentUrl(request.paymentToken)}</span>
						</div>
						<div className="flex items-center justify-between gap-2 pt-0.5">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => {
									navigator.clipboard.writeText(getPublicPaymentUrl(request.paymentToken!));
									toast.success("تم نسخ رابط الدفع المباشر بنجاح");
								}}
								className="h-7 text-xs gap-1.5 flex-1"
							>
								<IconCopy className="h-3.5 w-3.5" />
								<span>نسخ الرابط</span>
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={renewMutation.isPending}
								onClick={handleRenewLink}
								className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
							>
								{renewMutation.isPending ? (
									<IconLoader2 className="h-3.5 w-3.5 animate-spin" />
								) : (
									<IconRefresh className="h-3.5 w-3.5" />
								)}
								<span>تجديد الصلاحية</span>
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => window.open(getPublicPaymentUrl(request.paymentToken!), "_blank")}
								className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground px-2"
							>
								<IconExternalLink className="h-3.5 w-3.5" />
							</Button>
						</div>
					</div>
				)}

				{/* سويتش تضمين رسالة لولي الأمر */}
				<div className="flex items-center justify-between pt-1">
					<div className="flex flex-col gap-0.5">
						<label
							htmlFor="enable-msg-awaiting-payment"
							className="text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
						>
							تضمين رسالة لولي الأمر
						</label>
						<span className="text-[10px] text-muted-foreground">
							{enableMessage ? "سيتم حفظ الرسالة وإشعار ولي الأمر" : "لن يتم إرسال أي نص مكتوب"}
						</span>
					</div>
					<Switch
						id="enable-msg-awaiting-payment"
						checked={enableMessage}
						onCheckedChange={setEnableMessage}
					/>
				</div>

				{enableMessage && (
					<div className="space-y-3">
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<label className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
									نص رسالة <span className="text-destructive font-bold">*</span>
								</label>
								<button
									type="button"
									onClick={handleGenerateAI}
									className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1 transition-colors cursor-pointer"
								>
									<IconSparkles className="size-3.5 text-primary" />
									<span>صياغة تلقائية للرسالة</span>
								</button>
							</div>
							<Textarea
								value={messageText}
								onChange={(e) => setMessageText(e.target.value)}
								placeholder="مرحباً، يسعدنا إبلاغكم باجتياز الطالب مرحلة المقابلة..."
								className="min-h-36 text-xs leading-relaxed resize-none font-sans"
							/>
						</div>
					</div>
				)}
			</div>

			{/* 3. شريط أدوات التعيين والخيارات السريعة فوق الفوتر */}
			<div className="p-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
				<div className="grid grid-cols-4 gap-2 w-full">
					<div className="min-w-0">
						<Popover open={staffPopoverOpen} onOpenChange={setStaffPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									title={
										staff.find((s) => s.id === assignedStaffId || s.staffId === assignedStaffId)?.name
											? `إسناد: ${staff.find((s) => s.id === assignedStaffId || s.staffId === assignedStaffId)?.name}`
											: "تعيين مراجع..."
									}
									className="w-full h-8 text-xs border-zinc-200 dark:border-zinc-800 gap-1.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-normal cursor-pointer shadow-2xs justify-between"
								>
									<span className="flex items-center gap-1.5 truncate">
										<IconUser className="size-3.5 text-zinc-500 shrink-0" />
										<span className="truncate">
											{staff.find((s) => s.id === assignedStaffId || s.staffId === assignedStaffId)?.name
												? `إسناد: ${staff.find((s) => s.id === assignedStaffId || s.staffId === assignedStaffId)?.name}`
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
												className={cn(
													"w-full text-right text-xs p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground flex items-center justify-between transition-colors cursor-pointer",
													!assignedStaffId && "bg-zinc-100 dark:bg-zinc-800 font-semibold text-foreground",
												)}
											>
												<span>بدون مراجع (إلغاء التعيين)</span>
												{!assignedStaffId && <IconCheck className="size-3.5 text-zinc-600 dark:text-zinc-400 shrink-0" />}
											</button>
											{staff.map((s) => {
												const isSelected = (s.id && s.id === assignedStaffId) || (s.staffId && s.staffId === assignedStaffId);
												return (
													<button
														key={s.id || s.staffId}
														type="button"
														onClick={() => {
															setAssignedStaffId(s.id || s.staffId);
															setStaffPopoverOpen(false);
														}}
														className={cn(
															"w-full text-right text-xs p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between gap-2 transition-colors cursor-pointer",
															isSelected && "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold",
														)}
													>
														<div className="flex items-center gap-2 min-w-0 flex-1">
															<div
																className={cn(
																	"size-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs",
																	isSelected ? "bg-blue-600" : "bg-blue-600/80",
																)}
															>
																{s.name.slice(0, 1)}
															</div>
															<span className="truncate text-[11px]">{s.name}</span>
														</div>
														{isSelected && (
															<IconCheck className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
														)}
													</button>
												);
											})}
										</>
									)}
								</div>
							</PopoverContent>
						</Popover>
					</div>

					<div className="min-w-0">
						<PriorityPickerPopover
							value={priority}
							onChange={setPriority}
							showChevron
							className="w-full h-8 text-xs border-zinc-200 dark:border-zinc-800 font-normal shadow-2xs justify-between bg-white dark:bg-zinc-900"
						/>
					</div>
				</div>
			</div>

			{/* 4. صف الإرسال والإلغاء مع إشعار البريد (فوتر مثبت) */}
			<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 mt-auto">
				<div className="flex items-center gap-2">
					<Switch
						id="notify-email-awaiting-payment"
						checked={notifyEmail}
						onCheckedChange={setNotifyEmail}
					/>
					<label
						htmlFor="notify-email-awaiting-payment"
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
						disabled={awaitingPaymentMutation.isPending}
						className="h-8 text-xs cursor-pointer"
					>
						إلغاء
					</Button>
					<Button
						size="sm"
						onClick={handleSubmit}
						disabled={awaitingPaymentMutation.isPending || (enableMessage && !messageText.trim())}
						className="h-8 text-xs font-semibold px-4 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{awaitingPaymentMutation.isPending ? (
							<IconLoader2 className="size-3.5 animate-spin" />
						) : (
							<IconCheck className="size-3.5" />
						)}
						<span>
							{awaitingPaymentMutation.isPending ? "جاري الحفظ..." : "تأكيد النقل لبانتظار الدفع"}
						</span>
					</Button>
				</div>
			</div>
		</aside>
	);
}
