"use client";

import { useState } from "react";
import { CreditCard, ShieldCheck, Lock, Loader2, ArrowRight } from "lucide-react";
import type { PaymentViewData } from "../types";

interface OnlinePaymentTabProps {
	data: PaymentViewData;
	onPaymentSuccess: (result: any) => void;
}

export function OnlinePaymentTab({ data, onPaymentSuccess }: OnlinePaymentTabProps) {
	const [selectedMethod, setSelectedMethod] = useState<"CARD" | "WALLET">("CARD");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handlePayNow = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// 1. Initiate checkout session
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

			// 2. Process simulated/gateway payment confirmation
			// In production, you would redirect: window.location.href = checkoutData.checkoutUrl;
			// For testing / instant verification:
			const confirmRes = await fetch("/api/pay/simulate-success", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token: data.paymentToken,
					reference: checkoutData.reference,
					gateway: "SANAD_PAY",
					method: selectedMethod,
					amount: checkoutData.amount,
					status: "SUCCESS",
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

			<div className="grid grid-cols-2 gap-3">
				<button
					type="button"
					onClick={() => setSelectedMethod("CARD")}
					className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all ${
						selectedMethod === "CARD"
							? "border-primary bg-primary/10 shadow-sm"
							: "border-border/80 bg-card/40 hover:bg-muted/40"
					}`}
				>
					<CreditCard className={`h-6 w-6 ${selectedMethod === "CARD" ? "text-primary" : "text-muted-foreground"}`} />
					<span className="text-xs font-bold text-foreground">بطاقة بنكية (Visa / MC)</span>
					<span className="text-[10px] text-muted-foreground">بطاقات الخصم والائتمان وميزة</span>
				</button>

				<button
					type="button"
					onClick={() => setSelectedMethod("WALLET")}
					className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all ${
						selectedMethod === "WALLET"
							? "border-primary bg-primary/10 shadow-sm"
							: "border-border/80 bg-card/40 hover:bg-muted/40"
					}`}
				>
					<div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
						W
					</div>
					<span className="text-xs font-bold text-foreground">المحافظ الإلكترونية</span>
					<span className="text-[10px] text-muted-foreground">فودافون كاش والمحافظ الذكية</span>
				</button>
			</div>

			<div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
				<div className="flex items-center gap-2 text-xs font-semibold text-foreground">
					<Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
					<span>معالجة دفع بنكية مشفرة وآمنة بنسبة 100%</span>
				</div>
				<p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
					تتم جميع المعاملات عبر بوابة الدفع المعتمدة بتشفير مصرفي 256-bit SSL. لا يتم تخزين أي بيانات للبطاقات على خوادم الأكاديمية.
				</p>
			</div>

			<button
				type="button"
				onClick={handlePayNow}
				disabled={isLoading}
				className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
			>
				{isLoading ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>جاري معالجة وتأكيد السداد...</span>
					</>
				) : (
					<>
						<span>سداد الرسوم وتأكيد الحجز النهائي ({data.pricing.totalAmount.toLocaleString("ar-EG")} {data.pricing.currency})</span>
						<ArrowRight className="h-4 w-4" />
					</>
				)}
			</button>
		</div>
	);
}
