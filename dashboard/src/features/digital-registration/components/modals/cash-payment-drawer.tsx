import { useEffect, useMemo, useRef, useState } from "react";
import {
	IconArrowBarLeft,
	IconCash,
	IconCheck,
	IconInfoCircle,
	IconLoader2,
	IconNotes,
	IconPackage,
	IconReceipt,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { cn } from "@/lib/utils";
import {
	useConfirmPaymentManually,
	useDigitalRegistrationCapabilities,
} from "../../hooks/use-digital-registration";
import type {
	CampaignRequestItem,
	RegistrationPaymentReceiptData,
} from "../../types/campaign-request.types";
import {
	formatMoneyNumber,
	normalizeDigitsToLatin,
	resolveClinicCurrencySymbol,
} from "../../utils/payment-helpers";

interface CashPaymentDrawerProps {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	campaignId?: string;
	isExpanded?: boolean;
	onOpenAssignPlan?: () => void;
	onPaymentSuccess?: (receipt: RegistrationPaymentReceiptData) => void;
}

export function CashPaymentDrawer({
	request,
	open,
	onOpenChange,
	campaignId = "",
	isExpanded = false,
	onOpenAssignPlan,
	onPaymentSuccess,
}: CashPaymentDrawerProps) {
	const [amountInput, setAmountInput] = useState("");
	const [notes, setNotes] = useState("");
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { clinicInfo } = useClinicInfo();
	const currency = resolveClinicCurrencySymbol(clinicInfo?.currencyCode);
	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);
	const confirmPaymentMutation = useConfirmPaymentManually(campaignId);

	useEffect(() => {
		if (open && request) {
			setAmountInput("");
			setNotes("");
		}
	}, [open, request?.id]);

	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !confirmPaymentMutation.isPending) {
				onOpenChange(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, onOpenChange, confirmPaymentMutation.isPending]);

	const expectedTotal = useMemo(() => {
		if (!request?.subscriptionAmount) return 0;
		const parsed = Number(request.subscriptionAmount);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
	}, [request?.subscriptionAmount]);

	const hasValidPlan = Boolean(
		(request?.subscriptionPlanId || request?.subscriptionPlanName) && expectedTotal > 0,
	);

	const normalizedInput = normalizeDigitsToLatin(amountInput);
	const enteredNumber = normalizedInput === "" ? NaN : Number(normalizedInput);
	const isEnteredValidNumber = Number.isFinite(enteredNumber) && enteredNumber > 0;
	const isUnderpaid = isEnteredValidNumber && enteredNumber + 0.001 < expectedTotal;
	const isValidForSubmit =
		hasValidPlan &&
		isEnteredValidNumber &&
		enteredNumber + 0.001 >= expectedTotal &&
		capabilities.canEdit &&
		!request?.paidAt;

	const changeAmount =
		hasValidPlan && isEnteredValidNumber && enteredNumber > expectedTotal
			? Math.round((enteredNumber - expectedTotal) * 100) / 100
			: 0;

	const handleDrawerWheel = (e: React.WheelEvent<HTMLElement>) => {
		const target = e.target as HTMLElement | null;
		if (target?.tagName === "TEXTAREA") return;
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop += e.deltaY;
		}
	};

	if (!open || !request) return null;

	const studentName = request.patientName || request.name || "الطالب";
	const formattedExpected = formatMoneyNumber(expectedTotal);

	const handleSubmit = () => {
		if (!isValidForSubmit) {
			if (!hasValidPlan) {
				toast.error("يجب تحديد باقة الاشتراك وسعرها أولاً");
			} else if (!isEnteredValidNumber) {
				toast.error("يرجى إدخال المبلغ المستلم من ولي الأمر");
			} else if (isUnderpaid) {
				toast.error(`المبلغ المدخل أقل من قيمة الباقة (${formattedExpected} ${currency})`);
			}
			return;
		}

		confirmPaymentMutation.mutate(
			{
				requestId: request.id,
				method: "CASH",
				gateway: "ACADEMY_CASH_DESK",
				amount: expectedTotal,
				receivedAmount: Math.round(enteredNumber * 100) / 100,
				notes: notes.trim() || undefined,
			},
			{
				onSuccess: (res: any) => {
					toast.success("تم تأكيد استلام المبلغ نقداً وقبول الطالب بنجاح");
					const receipt: RegistrationPaymentReceiptData = {
						requestId: res.requestId || request.id,
						code: res.code || request.code || request.id,
						studentName: res.studentName || studentName,
						studentCode: res.studentCode || request.convertedPatientCode || null,
						guardianName: res.guardianName || request.guardianName,
						planId: res.planId ?? request.subscriptionPlanId ?? null,
						planName: res.planName || request.subscriptionPlanName || "الباقة الأكاديمية",
						includeMeals: Boolean(res.includeMeals ?? request.includeMeals),
						enableDailyStipend: Boolean(res.enableDailyStipend ?? request.enableDailyStipend),
						paidAt: res.paidAt || new Date().toISOString(),
						paymentReference: res.paymentReference || `CASH-${request.code || request.id}`,
						paymentGateway: res.paymentGateway || "ACADEMY_CASH_DESK",
						paymentMethodType: res.paymentMethodType || "CASH",
						amount: Number(res.amount ?? expectedTotal),
						cashReceived: Number(res.cashReceived ?? enteredNumber),
						changeAmount: Number(res.changeAmount ?? changeAmount),
						discountAmount: Number(res.discountAmount ?? 0),
						currency: res.currency || currency,
						collectedBy: res.collectedBy || null,
						notes: res.notes ?? (notes.trim() || null),
						clinicName: res.clinicName || clinicInfo?.name || "أكاديمية سند التعليمية",
					};
					onPaymentSuccess?.(receipt);
				},
				onError: (err: any) => {
					toast.error(err?.message || "فشل تأكيد الدفع النقدي");
				},
			},
		);
	};

	return (
		<aside
			data-slot="cash-payment-drawer"
			onWheel={handleDrawerWheel}
			className={cn(
				"fixed z-50 w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]! lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2! rounded-lg animate-in fade-in-0 duration-200 select-text",
				isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!",
			)}
			dir="rtl"
		>
			{/* رأس اللوحة مطابق لتصميم الكاش */}
			<div className="p-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 shrink-0">
				<div className="flex items-center gap-2 min-w-0">
					<span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">كاش</span>
					<span className="text-xs text-muted-foreground truncate">• {studentName}</span>
				</div>

				<button
					type="button"
					onClick={() => !confirmPaymentMutation.isPending && onOpenChange(false)}
					disabled={confirmPaymentMutation.isPending}
					className="size-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
					title="إغلاق"
				>
					<IconArrowBarLeft className="size-3.5" />
				</button>
			</div>

			{/* محتوى اللوحة */}
			<div
				ref={scrollContainerRef}
				className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto scrollbar-thin select-text"
				style={{ touchAction: "pan-y" }}
			>
				{/* صف الإجمالي الظاهر أعلى البطاقة */}
				<div className="flex items-center justify-between px-0.5">
					<span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
						الإجمالي: {formattedExpected} {currency}
					</span>
					{request.code && (
						<span className="text-[11px] font-mono text-muted-foreground" dir="ltr">
							#{request.code}
						</span>
					)}
				</div>

				{/* ملخص الباقة ومشمولاتها */}
				{hasValidPlan ? (
					<div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-3 space-y-2">
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center gap-1.5 min-w-0">
								<IconPackage className="size-4 text-primary shrink-0" />
								<span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
									{request.subscriptionPlanName}
								</span>
							</div>
							<span className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100 shrink-0">
								{formattedExpected} {currency}
							</span>
						</div>

						{(request.includeMeals || request.enableDailyStipend) && (
							<div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/70">
								{request.includeMeals && (
									<Badge
										variant="secondary"
										className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
									>
										✓ يشمل الوجبات
									</Badge>
								)}
								{request.enableDailyStipend && (
									<Badge
										variant="secondary"
										className="text-[10px] font-medium bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
									>
										✓ يشمل المصروف اليومي
									</Badge>
								)}
							</div>
						)}
					</div>
				) : (
					<div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 p-3 space-y-2">
						<p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
							لم يتم تحديد باقة اشتراك أو سعر صالح لهذا الطلب بعد.
						</p>
						{onOpenAssignPlan && (
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={onOpenAssignPlan}
								className="h-7 text-xs bg-white dark:bg-zinc-900 cursor-pointer"
							>
								تعيين الباقة الآن
							</Button>
						)}
					</div>
				)}

				{/* بطاقة إدخال المبلغ الكاش مطابق للتصميم */}
				<div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3.5 shadow-2xs">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<IconReceipt className="size-4 text-zinc-500" />
							<span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">كاش</span>
						</div>

						{hasValidPlan && (
							<button
								type="button"
								onClick={() => setAmountInput(String(expectedTotal))}
								className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
							>
								المبلغ كاملاً ({formattedExpected} {currency})
							</button>
						)}
					</div>

					<div className="space-y-1.5">
						<div className="flex items-center gap-1.5">
							<label
								htmlFor="registration-cash-amount-input"
								className="text-xs font-bold text-zinc-900 dark:text-zinc-100"
							>
								ادخل المبلغ
							</label>
							<span className="inline-flex items-center rounded bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
								مطلوب
							</span>
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										type="button"
										className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-help"
										aria-label="توضيح المبلغ"
									>
										<IconInfoCircle className="size-3.5" />
									</button>
								</TooltipTrigger>
								<TooltipContent side="top" className="text-xs max-w-[220px]">
									أدخل المبلغ النقدي المستلم من ولي الأمر؛ يجب ألا يقل عن قيمة الباقة ({formattedExpected} {currency}).
								</TooltipContent>
							</Tooltip>
						</div>

						<Input
							id="registration-cash-amount-input"
							type="text"
							inputMode="decimal"
							autoFocus
							value={amountInput}
							onChange={(e) => {
								const raw = e.target.value;
								const cleaned = raw.replace(/[^0-9٠-٩۰-۹.٫]/g, "");
								setAmountInput(cleaned);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" && isValidForSubmit && !confirmPaymentMutation.isPending) {
									e.preventDefault();
									handleSubmit();
								}
							}}
							placeholder={`مثال: ${formattedExpected} ${currency}`}
							disabled={!hasValidPlan || confirmPaymentMutation.isPending}
							className={cn(
								"h-10 text-right text-sm font-medium bg-background",
								isUnderpaid && "border-destructive focus-visible:ring-destructive/30",
							)}
						/>

						{normalizedInput !== "" && !isEnteredValidNumber && (
							<p className="text-[11px] font-medium text-destructive">
								يرجى إدخال مبلغ صحيح أكبر من صفر
							</p>
						)}

						{isUnderpaid && (
							<p className="text-[11px] font-medium text-destructive">
								المبلغ المدخل أقل من قيمة الباقة المطلوبة ({formattedExpected} {currency})
							</p>
						)}

						{changeAmount > 0 && (
							<div className="rounded-lg border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 px-2.5 py-2 flex items-center justify-between text-xs">
								<span className="font-medium text-emerald-800 dark:text-emerald-300">
									الباقي لولي الأمر:
								</span>
								<span className="font-bold font-mono text-emerald-700 dark:text-emerald-300">
									{formatMoneyNumber(changeAmount)} {currency}
								</span>
							</div>
						)}
					</div>

					{/* ملاحظة أو رقم إيصال ورقي اختياري */}
					<div className="space-y-1 pt-1 border-t border-zinc-100 dark:border-zinc-800">
						<label
							htmlFor="registration-cash-notes-input"
							className="text-[11px] font-medium text-muted-foreground flex items-center gap-1"
						>
							<IconNotes className="size-3.5" />
							<span>رقم إيصال ورقي أو ملاحظة تحصيل (اختياري)</span>
						</label>
						<Input
							id="registration-cash-notes-input"
							type="text"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="مثال: إيصال دفتر رقم 104..."
							disabled={confirmPaymentMutation.isPending}
							className="h-8 text-xs"
						/>
					</div>
				</div>
			</div>

			{/* التذييل المثبت مع زر الدفع */}
			<div className="p-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 mt-auto">
				<Button
					type="button"
					onClick={handleSubmit}
					disabled={!isValidForSubmit || confirmPaymentMutation.isPending}
					className={cn(
						"h-9 px-5 text-xs font-bold gap-1.5 shadow-2xs transition-all cursor-pointer",
						isValidForSubmit
							? "bg-[#4f6ae0] hover:bg-[#435bc4] text-white"
							: "bg-[#4f6ae0]/45 text-white cursor-not-allowed hover:bg-[#4f6ae0]/45",
					)}
				>
					{confirmPaymentMutation.isPending ? (
						<IconLoader2 className="size-3.5 animate-spin" />
					) : (
						<span className="size-4 rounded bg-white/25 flex items-center justify-center">
							<IconCheck className="size-3 stroke-[2.5]" />
						</span>
					)}
					<span>
						{confirmPaymentMutation.isPending
							? "جاري تأكيد الدفع..."
							: `دفع ${formattedExpected} ${currency}`}
					</span>
					<IconCash className="size-3.5 opacity-90" />
				</Button>
			</div>
		</aside>
	);
}
