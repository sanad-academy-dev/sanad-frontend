"use client";

import Link from "next/link";
import { CheckCircle2, Printer, ArrowLeft } from "lucide-react";
import type { PaymentViewData } from "../types";

export function ReceiptSuccessView({
	data,
	confirmationResult,
}: {
	data: PaymentViewData;
	confirmationResult?: any;
}) {
	const studentCode = confirmationResult?.studentCode || data.code;
	const ref = confirmationResult?.paymentReference || data.paymentReference || "PAY-CONFIRMED";
	const amount = confirmationResult?.amount || data.pricing.totalAmount;
	const methodType = (confirmationResult?.paymentMethodType || data.paymentMethodType || "").toUpperCase();
	const methodLabel =
		methodType === "CASH"
			? "كاش (خزينة الأكاديمية)"
			: methodType === "CARD"
			? "بطاقة بنكية"
			: methodType === "WALLET"
			? "محفظة إلكترونية"
			: "الدفع الإلكتروني المباشر";
	const currency = confirmationResult?.currency || data.pricing.currency || "ج.م";
	const formattedAmount = Number(amount || 0).toLocaleString("en-US", {
		maximumFractionDigits: 2,
	});
	const paidDateSource = confirmationResult?.paidAt || data.paidAt;
	const paidDate = paidDateSource
		? new Date(paidDateSource).toLocaleDateString("ar-EG-u-nu-latn", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
		  })
		: new Date().toLocaleDateString("ar-EG-u-nu-latn", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
		  });

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	return (
		<div className="space-y-6">
			{/* Top Success Badge */}
			<div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center backdrop-blur-md">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
					<CheckCircle2 className="h-9 w-9" />
				</div>
				<h2 className="mt-4 text-lg font-extrabold text-foreground sm:text-xl">
					تم سداد الرسوم الأكاديمية بنجاح!
				</h2>
				<p className="mt-1 text-xs text-muted-foreground sm:text-sm">
					تهانينا! تم تأكيد حجز المقعد واعتماد قيد الطالب رسمياً في {data.clinic.name}.
				</p>
			</div>

			{/* Official Printable Voucher */}
			<div id="payment-voucher" className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm">
				<div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0 space-y-0.5">
						<span className="block text-xs font-semibold text-primary">{data.clinic.name}</span>
						<h3 className="text-base font-bold text-foreground">إيصال سداد رسوم أكاديمية رسمي</h3>
					</div>
					<div className="min-w-0 shrink-0 rounded-xl bg-muted/35 px-3 py-2 sm:bg-transparent sm:p-0 sm:text-left">
						<span className="block text-[11px] text-muted-foreground">مرجع العملية</span>
						<bdi dir="ltr" className="font-mono text-xs font-bold text-foreground break-all">
							{ref}
						</bdi>
					</div>
				</div>

				<div className="mt-5 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4 sm:gap-4 border-b border-border/60 pb-5">
					<div className="min-w-0 rounded-xl bg-muted/30 p-3">
						<span className="block text-[11px] text-muted-foreground">اسم الطالب</span>
						<span className="mt-0.5 block font-bold text-foreground truncate">{data.studentName}</span>
					</div>

					<div className="min-w-0 rounded-xl bg-muted/30 p-3">
						<span className="block text-[11px] text-muted-foreground">رقم القيد الأكاديمي</span>
						<bdi dir="ltr" className="mt-0.5 block font-mono font-bold text-primary truncate">
							{studentCode}
						</bdi>
					</div>

					<div className="min-w-0 rounded-xl bg-muted/30 p-3">
						<span className="block text-[11px] text-muted-foreground">ولي الأمر</span>
						<span className="mt-0.5 block font-semibold text-foreground truncate">{data.guardianName}</span>
					</div>

					<div className="min-w-0 rounded-xl bg-muted/30 p-3">
						<span className="block text-[11px] text-muted-foreground">تاريخ السداد</span>
						<span className="mt-0.5 block font-medium text-foreground leading-snug break-words">{paidDate}</span>
					</div>
				</div>

				<div className="mt-5 space-y-2.5 text-xs">
					<div className="flex items-center justify-between gap-3 py-1">
						<span className="text-muted-foreground">الباقة المختارة:</span>
						<span className="min-w-0 text-left font-semibold text-foreground">{data.pricing.planName}</span>
					</div>
					<div className="flex items-center justify-between gap-3 py-1">
						<span className="text-muted-foreground">وسيلة الدفع:</span>
						<span className="min-w-0 text-left font-semibold text-foreground">{methodLabel}</span>
					</div>
					{data.pricing.includeMeals && (
						<div className="flex items-center justify-between gap-3 py-1">
							<span className="text-muted-foreground">خدمة الوجبات:</span>
							<span className="font-semibold text-emerald-600 dark:text-emerald-400">مشمولة ضمن الباقة</span>
						</div>
					)}
					{data.pricing.enableDailyStipend && (
						<div className="flex items-center justify-between gap-3 py-1">
							<span className="text-muted-foreground">المصروف اليومي:</span>
							<span className="font-semibold text-blue-600 dark:text-blue-400">مشمول ضمن الباقة</span>
						</div>
					)}
					<div className="flex items-center justify-between gap-3 border-t border-dashed border-border pt-3">
						<span className="text-sm font-bold text-foreground">المبلغ الإجمالي المسدد:</span>
						<span className="inline-flex items-baseline gap-1.5 font-mono text-base font-extrabold text-primary tabular-nums whitespace-nowrap">
							<span>{formattedAmount}</span>
							<span>{currency}</span>
						</span>
					</div>
				</div>

				<div className="mt-6 rounded-2xl bg-muted/20 p-4 text-xs text-muted-foreground leading-relaxed">
					<p className="font-semibold text-foreground mb-1.5">الخطوات التالية:</p>
					<ul className="list-disc list-inside space-y-1">
						<li>تم تفعيل السجل الرسمي للطالب وولي الأمر بنجاح.</li>
						<li>تم إرسال نسخة من إشعار السداد إلى بريدكم الإلكتروني المسجل.</li>
						<li>سيتواصل معكم فريق القبول وشؤون الطلاب لتسليم البطاقة والجدول الدراسي.</li>
					</ul>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col-reverse gap-3 sm:flex-row print:hidden">
				<button
					type="button"
					onClick={handlePrint}
					className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-xs font-bold text-foreground hover:bg-muted/50 transition-colors shadow-sm"
				>
					<Printer className="h-4 w-4 shrink-0 text-muted-foreground" />
					<span>طباعة / حفظ الإيصال كـ PDF</span>
				</button>

				<Link
					href="/"
					className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground hover:opacity-95 transition-opacity shadow-md shadow-primary/20"
				>
					<span>العودة لصفحة الأكاديمية</span>
					<ArrowLeft className="h-4 w-4 shrink-0" />
				</Link>
			</div>
		</div>
	);
}
