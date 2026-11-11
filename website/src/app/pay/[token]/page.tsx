"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, CreditCard, Banknote, AlertCircle, Loader2 } from "lucide-react";
import type { PaymentViewData } from "./types";
import { StudentPlanCard } from "./components/student-plan-card";
import { CountdownTimer } from "./components/countdown-timer";
import { PricingBreakdown } from "./components/pricing-breakdown";
import { OnlinePaymentTab } from "./components/online-payment-tab";
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
	const [isVerifyingCallback, setIsVerifyingCallback] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [confirmationResult, setConfirmationResult] = useState<any>(null);

	const fetchPaymentData = async (silent = false): Promise<PaymentViewData | null> => {
		try {
			if (!silent) setIsLoading(true);
			setError(null);

			const res = await fetch(`/api/pay/${encodeURIComponent(token)}`, {
				cache: "no-store",
			});

			const json = await res.json();
			if (!res.ok) {
				throw new Error(json.message || "رابط الدفع غير صحيح أو غير موجود");
			}

			setData(json);
			return json as PaymentViewData;
		} catch (err: any) {
			if (!silent) {
				setError(err?.message || "تعذر تحميل بيانات الفاتورة");
			}
			return null;
		} finally {
			if (!silent) setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!token) return;
		let cancelled = false;

		const init = async () => {
			const loaded = await fetchPaymentData(false);
			if (cancelled) return;

			const isCallback =
				typeof window !== "undefined" &&
				new URLSearchParams(window.location.search).get("payment") === "callback";

			if (isCallback && loaded && loaded.status === "AWAITING_PAYMENT") {
				setIsVerifyingCallback(true);
				for (let attempt = 0; attempt < 5; attempt++) {
					await new Promise((r) => setTimeout(r, 1500));
					if (cancelled) return;
					const refreshed = await fetchPaymentData(true);
					if (refreshed?.status === "PAID") break;
				}
				if (!cancelled) setIsVerifyingCallback(false);
			}
		};

		void init();
		return () => {
			cancelled = true;
		};
	}, [token]);

	const isPaidState = Boolean(data && (data.status === "PAID" || confirmationResult));
	const isExpiredState = Boolean(data && !isPaidState && (data.status === "EXPIRED" || data.isExpired));
	const isCancelledState = Boolean(data && !isPaidState && data.status === "CANCELLED");

	const headerBadgeLabel = isPaidState
		? "تم اعتماد السداد والحجز بنجاح"
		: isExpiredState
		? "انتهت صلاحية رابط السداد"
		: isCancelledState
		? "طلب غير متاح للسداد"
		: "دفع إلكتروني آمن 256-bit";

	const headerTitle = isPaidState
		? "تأكيد السداد وإيصال القبول"
		: isExpiredState
		? "انتهت مهلة صلاحية الرابط"
		: isCancelledState
		? "حالة طلب التسجيل"
		: "بوابة سداد الرسوم وحجز المقعد";

	const headerSubtitle = isPaidState
		? "تم توثيق عملية الدفع واعتماد القبول بنجاح، يمكنك حفظ أو طباعة الإيصال أدناه."
		: isExpiredState
		? "انتهت المهلة المحددة لهذا الرابط؛ تواصل مع إدارة الأكاديمية لتجديده."
		: isCancelledState
		? "تعذر متابعة السداد عبر هذا الرابط في الوقت الحالي."
		: "أكمل سداد الرسوم لتأكيد اعتماد قيد الطالب وحجز مقعده للعام الدراسي.";

	return (
		<div
			className="w-full flex-1 bg-muted/25 pt-20 pb-28 sm:pt-24 sm:pb-16 px-4 sm:px-6"
			dir="rtl"
			style={{ fontFamily: "var(--font-thmanyah), ui-sans-serif, system-ui, sans-serif" }}
		>
			<div className="mx-auto max-w-[660px] min-w-0">
				{/* Top Security & Contextual Page Header */}
				<header className="mb-6 text-center space-y-2.5">
					<div className="inline-flex items-center justify-center">
						<span
							className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
								isPaidState
									? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
									: isExpiredState || isCancelledState
									? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
									: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
							}`}
						>
							<ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
							<span>{headerBadgeLabel}</span>
						</span>
					</div>
					<h1 className="text-xl font-bold text-foreground sm:text-2xl text-balance">
						{headerTitle}
					</h1>
					<p className="text-xs text-muted-foreground sm:text-sm max-w-md mx-auto leading-relaxed text-pretty">
						{headerSubtitle}
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
						) : isVerifyingCallback ? (
							<div className="rounded-3xl border border-primary/30 bg-card p-10 text-center shadow-sm space-y-3">
								<Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
								<h2 className="text-base font-bold text-foreground">جاري تأكيد عملية السداد مع البوابة...</h2>
								<p className="text-xs text-muted-foreground">
									لحظات وسيتم إصدار إيصال السداد واعتماد القيد تلقائياً.
								</p>
							</div>
						) : data.status === "CANCELLED" ? (
							<div className="rounded-3xl border border-border/80 bg-card p-8 text-center shadow-sm space-y-3">
								<AlertCircle className="mx-auto h-9 w-9 text-amber-500" />
								<h2 className="text-base font-bold text-foreground">تم إلغاء طلب التسجيل</h2>
								<p className="text-xs text-muted-foreground">
									لم يعد هذا الرابط متاحاً للسداد؛ يرجى التواصل مع إدارة {data.clinic.name}.
								</p>
							</div>
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

								{/* Direct Online Payment Container */}
								<div className="rounded-3xl border border-border/80 bg-card/60 p-5 shadow-sm backdrop-blur-md space-y-5">
									<div className="flex items-center justify-between border-b border-border/60 pb-3">
										<div className="flex items-center gap-2">
											<CreditCard className="h-5 w-5 text-primary" />
											<h3 className="text-sm font-bold text-foreground sm:text-base">
												الدفع الإلكتروني المباشر
											</h3>
										</div>
										<span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
											تأكيد فوري
										</span>
									</div>

									<OnlinePaymentTab
										data={data}
										onPaymentSuccess={(result) => {
											setConfirmationResult(result);
											setData((prev) => (prev ? { ...prev, status: "PAID", paidAt: result?.paidAt || new Date().toISOString() } : prev));
										}}
									/>
								</div>

								{/* In-Academy Cash Guidance */}
								<div className="rounded-2xl border border-border/80 bg-card/80 p-4 sm:p-5 flex items-start gap-3">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
										<Banknote className="h-5 w-5" aria-hidden="true" />
									</div>
									<div className="min-w-0 flex-1 text-xs leading-relaxed space-y-1">
										<p className="font-bold text-foreground">هل تفضل الدفع نقداً (كاش)؟</p>
										<p className="text-muted-foreground text-pretty">
											يمكنك التوجه إلى مقر {data.clinic.name} وسداد الرسوم نقداً باستخدام كود الطلب{" "}
											<bdi dir="ltr" className="inline-block font-mono font-bold text-foreground mx-0.5">
												#{data.code}
											</bdi>
											{data.clinic.address ? ` (${data.clinic.address})` : ""}.
										</p>
									</div>
								</div>

								{/* Footer Help Note */}
								<footer className="text-center text-xs text-muted-foreground pt-2 pb-1">
									<span>تواجه أي مشكلة في السداد؟ </span>
									<a
										href={`tel:${data.clinic.phone || "+201000000000"}`}
										className="inline-flex min-h-[32px] items-center font-semibold text-primary hover:underline px-1"
									>
										تواصل مع الدعم الفني للأكاديمية
									</a>
								</footer>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
