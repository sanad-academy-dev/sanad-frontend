"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, CreditCard, Building2, AlertCircle, Loader2 } from "lucide-react";
import type { PaymentViewData } from "./types";
import { StudentPlanCard } from "./components/student-plan-card";
import { CountdownTimer } from "./components/countdown-timer";
import { PricingBreakdown } from "./components/pricing-breakdown";
import { OnlinePaymentTab } from "./components/online-payment-tab";
import { ManualBankTab } from "./components/manual-bank-tab";
import { ReceiptSuccessView } from "./components/receipt-success-view";
import { ExpiredView } from "./components/expired-view";

export default function PaymentPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const resolvedParams = use(params);
	const token = resolvedParams.token;

	const [data, setData] = useState<PaymentViewData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<"ONLINE" | "BANK">("ONLINE");
	const [confirmationResult, setConfirmationResult] = useState<any>(null);

	const fetchPaymentData = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const res = await fetch(`/api/pay/${encodeURIComponent(token)}`, {
				cache: "no-store",
			});

			const json = await res.json();
			if (!res.ok) {
				throw new Error(json.message || "رابط الدفع غير صحيح أو غير موجود");
			}

			setData(json);
		} catch (err: any) {
			setError(err?.message || "تعذر تحميل بيانات الفاتورة");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			fetchPaymentData();
		}
	}, [token]);

	return (
		<main className="min-h-screen bg-muted/30 px-4 py-8 sm:py-12" dir="rtl">
			<div className="mx-auto max-w-[620px]">
				{/* Top Branding & Security Header */}
				<header className="mb-6 text-center">
					<div className="flex items-center justify-center gap-2">
						<Link
							href="/"
							className="text-base font-extrabold text-primary hover:underline sm:text-lg"
						>
							أكاديمية سند التعليمية
						</Link>
						<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
							<ShieldCheck className="h-3.5 w-3.5" />
							دفع آمن 256-bit
						</span>
					</div>
					<h1 className="mt-2 text-xl font-extrabold text-foreground sm:text-2xl">
						بوابة سداد الرسوم وحجز المقعد
					</h1>
					<p className="mt-1 text-xs text-muted-foreground sm:text-sm">
						أكمل سداد الرسوم لتأكيد اعتماد قيد الطالب وحجز مقعده للعام الدراسي.
					</p>
				</header>

				{/* Loading State */}
				{isLoading && (
					<div className="rounded-3xl border border-border/80 bg-card p-12 text-center shadow-sm">
						<Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
						<p className="mt-3 text-xs font-semibold text-muted-foreground">
							جاري التحقق من صلاحية رابط السداد واسترجاع الفاتورة...
						</p>
					</div>
				)}

				{/* Error State */}
				{!isLoading && error && (
					<div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center backdrop-blur-md">
						<AlertCircle className="mx-auto h-10 w-10 text-red-500" />
						<h2 className="mt-3 text-base font-bold text-foreground">تعذر العثور على الفاتورة</h2>
						<p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">{error}</p>
						<div className="mt-5">
							<Link
								href="/"
								className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95"
							>
								العودة للرئيسية
							</Link>
						</div>
					</div>
				)}

				{/* Data Loaded Successfully */}
				{!isLoading && data && (
					<div className="space-y-5">
						{/* If Already Paid or Just Paid */}
						{data.status === "PAID" || confirmationResult ? (
							<ReceiptSuccessView
								data={data}
								confirmationResult={confirmationResult}
							/>
						) : data.status === "EXPIRED" || data.isExpired ? (
							/* If Expired */
							<ExpiredView data={data} />
						) : (
							/* Active Payment Invoice */
							<>
								{/* Countdown Timer */}
								<CountdownTimer
									expiresAt={data.expiresAt}
									onExpired={() => {
										setData((prev) => (prev ? { ...prev, isExpired: true, status: "EXPIRED" } : prev));
									}}
								/>

								{/* Student Info Card */}
								<StudentPlanCard data={data} />

								{/* Itemized Pricing Breakdown */}
								<PricingBreakdown pricing={data.pricing} />

								{/* Payment Method Tabs & Checkout Container */}
								<div className="rounded-3xl border border-border/80 bg-card/60 p-5 shadow-sm backdrop-blur-md">
									{/* Tab Switcher */}
									<div className="flex rounded-2xl bg-muted/60 p-1 mb-5">
										<button
											type="button"
											onClick={() => setActiveTab("ONLINE")}
											className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
												activeTab === "ONLINE"
													? "bg-card text-foreground shadow-sm"
													: "text-muted-foreground hover:text-foreground"
											}`}
										>
											<CreditCard className="h-4 w-4" />
											<span>الدفع الإلكتروني المباشر</span>
										</button>

										<button
											type="button"
											onClick={() => setActiveTab("BANK")}
											className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
												activeTab === "BANK"
													? "bg-card text-foreground shadow-sm"
													: "text-muted-foreground hover:text-foreground"
											}`}
										>
											<Building2 className="h-4 w-4" />
											<span>التحويل البنكي / إنستاباي</span>
										</button>
									</div>

									{/* Tab Content */}
									{activeTab === "ONLINE" ? (
										<OnlinePaymentTab
											data={data}
											onPaymentSuccess={(result) => {
												setConfirmationResult(result);
												setData((prev) => (prev ? { ...prev, status: "PAID", paidAt: new Date().toISOString() } : prev));
											}}
										/>
									) : (
										<ManualBankTab data={data} />
									)}
								</div>

								{/* Footer Help Note */}
								<footer className="text-center text-[11px] text-muted-foreground pt-2">
									<span>تواجه أي مشكلة في السداد؟ </span>
									<a
										href={`tel:${data.clinic.phone || "+201000000000"}`}
										className="font-semibold text-primary hover:underline"
									>
										تواصل مع الدعم الفني للأكاديمية
									</a>
								</footer>
							</>
						)}
					</div>
				)}
			</div>
		</main>
	);
}
