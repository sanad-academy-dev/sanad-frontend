"use client";

import Link from "next/link";
import { AlertCircle, MessageCircle, Phone, ArrowLeft } from "lucide-react";
import type { PaymentViewData } from "../types";

export function ExpiredView({ data }: { data: PaymentViewData }) {
	const clinicPhone = data.clinic.phone || "+201000000000";
	const cleanPhone = clinicPhone.replace(/[^0-9]/g, "");
	const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
		`السلام عليكم، أود تجديد رابط سداد الرسوم للطالب: ${data.studentName} (طلب رقم #${data.code})`
	)}`;

	return (
		<div className="space-y-6 text-center">
			<div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-8 backdrop-blur-md">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
					<AlertCircle className="h-9 w-9" />
				</div>
				<h2 className="mt-4 text-lg font-bold text-foreground sm:text-xl">
					انتهت مهلة صلاحية رابط السداد
				</h2>
				<p className="mt-2 text-xs text-muted-foreground sm:text-sm max-w-md mx-auto leading-relaxed">
					عزيزي ولي أمر الطالب <span className="font-semibold text-foreground">{data.studentName}</span>، لقد انتهت مهلة الـ 72 ساعة المخصصة لسداد الرسوم وحجز المقعد الدراسي لهذا الرابط.
				</p>
			</div>

			<div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm text-right space-y-4">
				<h3 className="text-sm font-bold text-foreground">كيف يمكنك تجديد الحجز؟</h3>
				<p className="text-xs text-muted-foreground leading-relaxed">
					يرجى التواصل مباشرة مع فريق القبول وشؤون الطلاب في الأكاديمية لتمديد مهلة الحجز وإعادة إرسال رابط سداد جديد ومفعل.
				</p>

				<div className="flex flex-col gap-3 sm:flex-row pt-2">
					<a
						href={whatsappUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
					>
						<MessageCircle className="h-4 w-4 shrink-0" />
						<span>طلب تجديد الرابط عبر واتساب</span>
					</a>

					<a
						href={`tel:${clinicPhone}`}
						className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs font-bold text-foreground hover:bg-muted/70 transition-colors shadow-sm"
					>
						<Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
						<span>الاتصال بالأكاديمية</span>
					</a>
				</div>
			</div>

			<div>
				<Link
					href="/"
					className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold text-primary hover:underline"
				>
					<span>العودة لصفحة الأكاديمية الرئيسية</span>
					<ArrowLeft className="h-3.5 w-3.5 shrink-0" />
				</Link>
			</div>
		</div>
	);
}
