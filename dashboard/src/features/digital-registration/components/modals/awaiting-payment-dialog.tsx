import { useEffect, useRef, useState } from "react";
import {
	IconArrowRight,
	IconCheck,
	IconCoin,
	IconChevronDown,
	IconLoader2,
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
import { PriorityPickerPopover } from "../priority-picker-popover";
import {
	RegistrationDrawerHeader,
	RegistrationDrawerGuardianCard,
} from "./registration-drawer-header";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import {
	useAwaitingPaymentRequest,
	useDigitalRegistrationCapabilities,
	useRegistrationReviewers,
} from "../../hooks/use-digital-registration";
import { generateAwaitingPaymentMessage } from "../../utils/ai-templates";
import { cn } from "@/lib/utils";

interface AwaitingPaymentDialogProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	onSuccess?: () => void;
	isExpanded?: boolean;
}

const SUBSCRIPTION_PLANS = [
	{ id: "BASIC", name: "الباقة الأساسية (نصف دوام)", price: 800 },
	{ id: "COMPREHENSIVE", name: "الباقة الشاملة (دوام كامل + أنشطة)", price: 1500 },
	{ id: "PREMIUM", name: "الباقة المتميزة (VIP ورعاية خاصة)", price: 2200 },
];

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
	const [subscriptionPlanId, setSubscriptionPlanId] = useState<string>("BASIC");
	const [subscriptionPlanName, setSubscriptionPlanName] = useState<string>("الباقة الأساسية (نصف دوام)");
	const [subscriptionAmount, setSubscriptionAmount] = useState<number | string>(800);
	const [includeMeals, setIncludeMeals] = useState<boolean>(false);
	const [enableDailyStipend, setEnableDailyStipend] = useState<boolean>(false);

	const [staffPopoverOpen, setStaffPopoverOpen] = useState<boolean>(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);
	const { data: staff = [], isLoading: isStaffLoading } = useRegistrationReviewers();
	const awaitingPaymentMutation = useAwaitingPaymentRequest(campaignId);

	// استرجاع وضبط بيانات الطلب الحالي فور فتح اللوحة
	useEffect(() => {
		if (open && request) {
			setPriority(request.priority || "بدون أولوية");
			setAssignedStaffId(request.assignedStaff?.id || request.assignedStaffId || null);
			setEnableMessage(true);
			setNotifyEmail(false);
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
		});
		setMessageText(generated);
		toast.success("تم توليد نص الرسالة وقابل للتعديل");
	};

	const handleSubmit = () => {
		if (!capabilities.canChangeStatus) {
			toast.error("ليس لديك صلاحية لتحديث حالة الطلب");
			return;
		}

		awaitingPaymentMutation.mutate(
			{
				requestId: request.id,
				data: {
					subscriptionPlanId: subscriptionPlanId || undefined,
					subscriptionPlanName: subscriptionPlanName || undefined,
					subscriptionAmount: subscriptionAmount ? Number(subscriptionAmount) : undefined,
					includeMeals,
					enableDailyStipend,
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
				{/* بطاقة الخطة المالية والرسوم المقررة */}
				<div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 space-y-3 shadow-2xs">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
							<IconCoin className="size-3.5 text-amber-500" />
							<span>الخطة المالية والرسوم المقررة</span>
						</span>
						<span className="text-[10px] text-muted-foreground font-medium">سداد مقعد</span>
					</div>

					{/* اختيار الباقة */}
					<div className="space-y-1.5">
						<label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
							الباقة الأكاديمية
						</label>
						<div className="grid grid-cols-1 gap-1.5">
							{SUBSCRIPTION_PLANS.map((plan) => {
								const isSelected = subscriptionPlanId === plan.id;
								return (
									<button
										key={plan.id}
										type="button"
										onClick={() => {
											setSubscriptionPlanId(plan.id);
											setSubscriptionPlanName(plan.name);
											setSubscriptionAmount(plan.price);
										}}
										className={cn(
											"flex items-center justify-between p-2 rounded-md border text-right transition-all cursor-pointer text-xs",
											isSelected
												? "border-primary bg-primary/5 text-primary font-bold shadow-2xs"
												: "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
										)}
									>
										<span className="truncate">{plan.name}</span>
										<span className="font-mono text-[11px] shrink-0 font-semibold">{plan.price} ج.م</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* المبلغ الفعلي المحدد */}
					<div className="space-y-1">
						<label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
							المبلغ المطلوب سداده (ج.م)
						</label>
						<Input
							type="number"
							value={subscriptionAmount}
							onChange={(e) => setSubscriptionAmount(e.target.value)}
							className="h-8 text-xs font-mono"
							placeholder="المبلغ بالجنية المصري"
						/>
					</div>

					{/* مفاتيح التفعيل الإضافية: الوجبات والمصروف */}
					<div className="pt-1 space-y-2 border-t border-zinc-100 dark:border-zinc-800">
						<div className="flex items-center justify-between">
							<label htmlFor="modal-include-meals" className="text-[11px] text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
								تشمل الوجبات الغذائية
							</label>
							<Switch
								id="modal-include-meals"
								checked={includeMeals}
								onCheckedChange={setIncludeMeals}
							/>
						</div>
						<div className="flex items-center justify-between">
							<label htmlFor="modal-daily-stipend" className="text-[11px] text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
								تفعيل المصروف اليومي
							</label>
							<Switch
								id="modal-daily-stipend"
								checked={enableDailyStipend}
								onCheckedChange={setEnableDailyStipend}
							/>
						</div>
					</div>
				</div>


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
									نص رسالة
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
												className="w-full text-right text-xs p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground transition-colors cursor-pointer"
											>
												بدون مراجع (إلغاء التعيين)
											</button>
											{staff.map((s) => (
												<button
													key={s.id || s.staffId}
													type="button"
													onClick={() => {
														setAssignedStaffId(s.id || s.staffId);
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
						disabled={awaitingPaymentMutation.isPending}
						className="h-8 text-xs font-semibold px-4 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-2xs cursor-pointer"
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
