"use client";

import Link from "next/link";
import { CheckCircle2, Printer, ArrowRight, ShieldCheck, Download } from "lucide-react";
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
	const paidDate = data.paidAt ? new Date(data.paidAt).toLocaleDateString("ar-EG", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}) : new Date().toLocaleDateString("ar-EG", {
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
			<div id="payment-voucher" className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
				<div className="flex items-center justify-between border-b border-border/60 pb-4">
					<div>
						<span className="text-xs font-semibold text-primary">{data.clinic.name}</span>
						<h3 className="text-base font-bold text-foreground">إيصال سداد رسوم أكاديمية رسمي</h3>
					</div>
					<div className="text-left font-mono">
						<span className="block text-[10px] text-muted-foreground">مرجع العملية</span>
						<span className="text-xs font-bold text-foreground" dir="ltr">{ref}</span>
					</div>
				</div>

				<div className="mt-5 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4 border-b border-border/60 pb-5">
					<div className="rounded-xl bg-muted/30 p-3">
						<span className="block text-[10px] text-muted-foreground">اسم الطالب</span>
						<span className="font-bold text-foreground truncate block">{data.studentName}</span>
					</div>

					<div className="rounded-xl bg-muted/30 p-3">
						<span className="block text-[10px] text-muted-foreground">رقم القيد الأكاديمي</span>
						<span className="font-mono font-bold text-primary block" dir="ltr">{studentCode}</span>
					</div>

					<div className="rounded-xl bg-muted/30 p-3">
						<span className="block text-[10px] text-muted-foreground">ولي الأمر</span>
						<span className="font-semibold text-foreground truncate block">{data.guardianName}</span>
					</div>

					<div className="rounded-xl bg-muted/30 p-3">
						<span className="block text-[10px] text-muted-foreground">تاريخ السداد</span>
						<span className="font-medium text-foreground block">{paidDate}</span>
					</div>
				</div>

				<div className="mt-5 space-y-2.5 text-xs">
					<div className="flex justify-between py-1">
						<span className="text-muted-foreground">الباقة المختارة:</span>
						<span className="font-semibold text-foreground">{data.pricing.planName}</span>
					</div>
					{data.pricing.includeMeals && (
						<div className="flex justify-between py-1">
							<span className="text-muted-foreground">خدمة الوجبات:</span>
							<span className="font-semibold text-foreground">مشمولة في الاشتراك</span>
						</div>
					)}
					{data.pricing.enableDailyStipend && (
						<div className="flex justify-between py-1">
							<span className="text-muted-foreground">المصروف اليومي:</span>
							<span className="font-semibold text-foreground">مفعل</span>
						</div>
					)}
					<div className="flex justify-between border-t border-dashed border-border pt-3">
						<span className="text-sm font-bold text-foreground">المبلغ الإجمالي المسدد:</span>
						<span className="text-base font-extrabold text-primary font-mono">
							{amount.toLocaleString("ar-EG")} {data.pricing.currency}
						</span>
					</div>
				</div>

				<div className="mt-6 rounded-2xl bg-muted/20 p-4 text-[11px] text-muted-foreground leading-relaxed">
					<p className="font-semibold text-foreground mb-1">الخطوات التالية:</p>
					<ul className="list-disc list-inside space-y-1">
						<li>تم تفعيل السجل الرسمي للطالب وولي الأمر بنجاح.</li>
						<li>تم إرسال نسخة من إشعار السداد إلى بريدكم الإلكتروني المسجل.</li>
						<li>سيتواصل معكم فريق القبول وشؤون الطلاب لتسليم البطاقة والجدول الدراسي.</li>
					</ul>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col gap-3 sm:flex-row print:hidden">
				<button
					type="button"
					onClick={handlePrint}
					className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-xs font-bold text-foreground hover:bg-muted/50 transition-colors shadow-sm"
				>
					<Printer className="h-4 w-4 text-muted-foreground" />
					<span>طباعة / حفظ الإيصال كـ PDF</span>
				</button>

				<Link
					href="/"
					className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground hover:opacity-95 transition-opacity shadow-md shadow-primary/20"
				>
					<span>العودة لصفحة الأكاديمية</span>
					<ArrowRight className="h-4 w-4" />
				</Link>
			</div>
		</div>
	);
}
