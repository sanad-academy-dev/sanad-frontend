import { useEffect, useRef } from "react";
import {
	IconCheck,
	IconDownload,
	IconPrinter,
	IconReceipt2,
	IconX,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { RegistrationPaymentReceiptData } from "../../types/campaign-request.types";
import {
	formatMoneyNumber,
	formatPaymentMethodLabelArabic,
} from "../../utils/payment-helpers";
import {
	downloadPaymentReceiptDirect,
	printOrSavePaymentReceipt,
} from "../../utils/payment-receipt-print";

interface PaymentReceiptDrawerProps {
	receipt: RegistrationPaymentReceiptData | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isExpanded?: boolean;
}

export function PaymentReceiptDrawer({
	receipt,
	open,
	onOpenChange,
	isExpanded = false,
}: PaymentReceiptDrawerProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

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

	const handleDrawerWheel = (e: React.WheelEvent<HTMLElement>) => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop += e.deltaY;
		}
	};

	if (!open || !receipt) return null;

	const paidDateLabel = (() => {
		const parsed = new Date(receipt.paidAt);
		if (Number.isNaN(parsed.getTime())) return receipt.paidAt;
		return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
			day: "numeric",
			month: "long",
			year: "numeric",
		}).format(parsed);
	})();

	const methodLabel = formatPaymentMethodLabelArabic(
		receipt.paymentMethodType,
		receipt.paymentGateway,
	);
	const formattedAmount = `${formatMoneyNumber(receipt.amount)} ${receipt.currency}`;
	const formattedDiscount = `${formatMoneyNumber(receipt.discountAmount)} ${receipt.currency}`;
	const formattedCashReceived = `${formatMoneyNumber(receipt.cashReceived)} ${receipt.currency}`;
	const formattedChange = `${formatMoneyNumber(receipt.changeAmount)} ${receipt.currency}`;

	return (
		<aside
			data-slot="payment-receipt-drawer"
			onWheel={handleDrawerWheel}
			className={cn(
				"fixed z-50 w-[300px]! min-w-[300px]! max-w-[calc(100vw-1rem)]! h-[500px]! max-h-[calc(100dvh-1rem)]! top-auto! bottom-2! left-2! right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background rounded-xl animate-in fade-in-0 duration-200 select-text",
				isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!",
			)}
			dir="rtl"
		>
			{/* زر الإغلاق العلوي يساراً مطابق للتصميم */}
			<div className="px-3 pt-2.5 pb-0.5 flex items-center justify-end shrink-0">
				<button
					type="button"
					onClick={() => onOpenChange(false)}
					className="size-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
					title="إغلاق"
				>
					<IconX className="size-3.5" />
				</button>
			</div>

			{/* محتوى الإيصال */}
			<div
				ref={scrollContainerRef}
				className="px-4 pb-3.5 space-y-3.5 flex-1 min-h-0 overflow-y-auto scrollbar-thin select-text"
				style={{ touchAction: "pan-y" }}
			>
				{/* قسم النجاح المركزي مطابق تماماً للتصميم المرجعي */}
				<div className="flex flex-col items-center gap-1.5 text-center">
					<div className="relative flex items-center justify-center pb-0.5">
						<img
							src="/Bold Duotone/School/Diploma Verified.png"
							alt="تم الدفع بنجاح"
							className="size-14 object-contain"
							onError={(e) => {
								e.currentTarget.style.display = "none";
								const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
								if (fallback) fallback.style.display = "flex";
							}}
						/>
						<div className="hidden size-13 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 items-center justify-center relative">
							<IconReceipt2 className="size-7 text-[#4f6ae0]" />
							<span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
								<IconCheck className="size-3 stroke-[3]" />
							</span>
						</div>
					</div>

					<h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
						تم الدفع بنجاح
					</h3>

					<div className="space-y-0">
						<p className="text-[11px] text-muted-foreground">للمبلغ</p>
						<p className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
							{formattedAmount}
						</p>
					</div>

					<div className="space-y-0.5 text-[11px] text-muted-foreground leading-snug pt-0.5">
						<p>
							ولي الأمر: {receipt.guardianName} · للطالب: {receipt.studentName}
						</p>
						<p>
							معرف الفاتورة <span dir="ltr">{receipt.paymentReference}</span> · {paidDateLabel}
						</p>
					</div>
				</div>

				{/* بطاقة ملخص الخدمة / الاشتراك */}
				<div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 space-y-2.5 shadow-2xs">
					<h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
						ملخص الخدمة
					</h4>

					<Separator />

					{/* سطر الباقة */}
					<div className="space-y-1.5">
						<div className="flex items-center justify-between gap-2">
							<span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
								{receipt.planName}
							</span>
							<span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
								الإجمالي: {formattedAmount}
							</span>
						</div>

						{(receipt.includeMeals || receipt.enableDailyStipend) && (
							<div className="flex flex-wrap items-center gap-1.5">
								{receipt.includeMeals && (
									<span className="text-[10px] rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 font-medium">
										✓ يشمل الوجبات
									</span>
								)}
								{receipt.enableDailyStipend && (
									<span className="text-[10px] rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 font-medium">
										✓ يشمل المصروف اليومي
									</span>
								)}
							</div>
						)}
					</div>

					<Separator />

					{/* تفاصيل المعاملة (بدون ضريبة مضافة) */}
					<div className="space-y-1.5">
						<p className="text-[10.5px] font-medium text-muted-foreground">
							تفاصيل المعاملة
						</p>

						<div className="flex items-center justify-between text-xs">
							<span className="text-zinc-700 dark:text-zinc-300 font-medium">
								قيمة الباقة
							</span>
							<span className="font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
								{formattedAmount}
							</span>
						</div>

						<div className="flex items-center justify-between text-xs">
							<span className="text-zinc-700 dark:text-zinc-300 font-medium">
								الخصم
							</span>
							<span className="font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
								{formattedDiscount}
							</span>
						</div>

						<div className="flex items-center justify-between text-xs">
							<span className="text-zinc-700 dark:text-zinc-300 font-medium">
								وسيلة الدفع
							</span>
							<span className="font-bold text-zinc-900 dark:text-zinc-100">
								{methodLabel}
							</span>
						</div>

						{receipt.changeAmount > 0 && (
							<>
								<div className="flex items-center justify-between text-[11px] pt-1 border-t border-dashed border-zinc-200 dark:border-zinc-800">
									<span className="text-muted-foreground">المبلغ المستلم نقداً</span>
									<span className="font-semibold tabular-nums">{formattedCashReceived}</span>
								</div>
								<div className="flex items-center justify-between text-[11px]">
									<span className="text-emerald-700 dark:text-emerald-400 font-medium">
										الباقي المرتجع لولي الأمر
									</span>
									<span className="font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
										{formattedChange}
									</span>
								</div>
							</>
						)}

						{receipt.notes && (
							<div className="flex items-center justify-between gap-2 text-[11px] pt-1 border-t border-dashed border-zinc-200 dark:border-zinc-800">
								<span className="text-muted-foreground shrink-0">ملاحظات</span>
								<span className="text-zinc-700 dark:text-zinc-300 text-left truncate">
									{receipt.notes}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* أزرار تحميل (مباشر) وطباعة الفاتورة */}
				<div className="flex items-center justify-start gap-2 pt-0.5">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => downloadPaymentReceiptDirect(receipt)}
						className="h-8 text-xs font-semibold gap-1.5 px-2.5 flex-1 cursor-pointer"
					>
						<IconDownload className="size-3.5" />
						<span>تحميل الفاتورة</span>
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => printOrSavePaymentReceipt(receipt)}
						className="h-8 text-xs font-semibold gap-1.5 px-2.5 flex-1 cursor-pointer"
					>
						<IconPrinter className="size-3.5" />
						<span>طباعة الفاتورة</span>
					</Button>
				</div>
			</div>
		</aside>
	);
}
