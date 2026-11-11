"use client";

import { useState } from "react";
import { CreditCard, Lock, Loader2, ArrowLeft, Wallet } from "lucide-react";
import type { PaymentViewData } from "../types";

interface OnlinePaymentTabProps {
	data: PaymentViewData;
	onPaymentSuccess: (result: any) => void;
}

export function OnlinePaymentTab({ data, onPaymentSuccess }: OnlinePaymentTabProps) {
	const [selectedMethod, setSelectedMethod] = useState<"CARD" | "WALLET">("CARD");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const currency = data.pricing.currency || "ج.م";
	const formattedAmount = Number(data.pricing.totalAmount || 0).toLocaleString("en-US", {
		maximumFractionDigits: 2,
	});

	const handlePayNow = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// 1. بدء جلسة الدفع من الخادم (Paymob الحقيقي أو المحاكاة)
			const checkoutRes = await fetch("/api/pay/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token: data.paymentToken,
					method: selectedMethod,
				}),
			});

			const checkoutData = await checkoutRes.json();
			if (!checkoutRes.ok) {
				throw new Error(checkoutData.message || "فشل بدء جلسة الدفع الإلكتروني");
			}

			// 2. إذا رجعت بوابة Paymob رابط دفع حقيقي، نحوّل ولي الأمر إليها مباشرة
			if (checkoutData.isSimulated === false && checkoutData.checkoutUrl) {
				window.location.href = checkoutData.checkoutUrl;
				return;
			}

			// 3. في وضع المحاكاة المؤقت لحين تفعيل مفاتيح Paymob
			const confirmRes = await fetch("/api/pay/simulate-success", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token: data.paymentToken,
					reference: checkoutData.reference,
					method: selectedMethod,
					amount: checkoutData.amount,
				}),
			});

			const confirmData = await confirmRes.json();
			if (!confirmRes.ok) {
				throw new Error(confirmData.message || "تعذر إتمام عملية السداد");
			}

			onPaymentSuccess(confirmData);
		} catch (err: any) {
			setError(err?.message || "حدث خطأ أثناء معالجة الدفع، يرجى المحاولة لاحقاً");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			{error && (
				<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-600 dark:text-red-400">
					{error}
				</div>
			)}

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<button
					type="button"
					onClick={() => setSelectedMethod("CARD")}
					className={`flex min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all ${
						selectedMethod === "CARD"
							? "border-primary bg-primary/10 shadow-sm"
							: "border-border/80 bg-card/40 hover:bg-muted/40"
					}`}
				>
					<div
						className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
							selectedMethod === "CARD"
								? "bg-primary/15 text-primary"
								: "bg-muted/60 text-muted-foreground"
						}`}
					>
						<CreditCard className="h-5 w-5" />
					</div>
					<div className="min-w-0 space-y-0.5">
						<span className="block text-xs font-bold text-foreground">بطاقة بنكية</span>
						<span className="block text-[11px] font-medium text-muted-foreground" dir="ltr">
							Visa • Mastercard • Meeza
						</span>
					</div>
					<span className="text-[11px] text-muted-foreground">بطاقات الخصم والائتمان وميزة</span>
				</button>

				<button
					type="button"
					onClick={() => setSelectedMethod("WALLET")}
					className={`flex min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all ${
						selectedMethod === "WALLET"
							? "border-primary bg-primary/10 shadow-sm"
							: "border-border/80 bg-card/40 hover:bg-muted/40"
					}`}
				>
					<div
						className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
							selectedMethod === "WALLET"
								? "bg-primary/15 text-primary"
								: "bg-muted/60 text-muted-foreground"
						}`}
					>
						<Wallet className="h-5 w-5" />
					</div>
					<div className="min-w-0 space-y-0.5">
						<span className="block text-xs font-bold text-foreground">المحافظ الإلكترونية</span>
						<span className="block text-[11px] font-medium text-muted-foreground">
							دفع فوري عبر الهاتف
						</span>
					</div>
					<span className="text-[11px] text-muted-foreground">فودافون كاش والمحافظ الذكية</span>
				</button>
			</div>

			<div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
				<div className="flex items-start gap-2.5 text-xs font-semibold text-foreground sm:items-center">
					<Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 sm:mt-0" />
					<span className="leading-relaxed">معالجة دفع إلكتروني مباشر وآمن بنسبة 100%</span>
				</div>
				<p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
					تتم معالجة السداد مباشرة عبر بوابة الدفع المعتمدة وتأكيد حجز المقعد الأكاديمي فورياً دون حفظ بيانات بطاقات.
				</p>
			</div>

			<button
				type="button"
				onClick={handlePayNow}
				disabled={isLoading || data.pricing.totalAmount <= 0}
				className="flex min-h-[48px] w-full flex-wrap items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
			>
				{isLoading ? (
					<>
						<Loader2 className="h-4 w-4 shrink-0 animate-spin" />
						<span>جاري معالجة وتأكيد السداد...</span>
					</>
				) : (
					<>
						<span>سداد الرسوم وتأكيد الحجز النهائي</span>
						<span className="inline-flex items-baseline gap-1 font-mono text-sm tabular-nums whitespace-nowrap">
							<span>({formattedAmount}</span>
							<span>{currency})</span>
						</span>
						<ArrowLeft className="h-4 w-4 shrink-0" />
					</>
				)}
			</button>
		</div>
	);
}
