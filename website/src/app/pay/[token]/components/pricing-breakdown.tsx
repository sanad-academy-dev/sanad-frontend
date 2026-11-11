"use client";

import { Sparkles, Utensils, Wallet, Receipt, Check } from "lucide-react";
import type { PaymentViewData } from "../types";

function formatMoney(value: number): string {
	return Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function PricingBreakdown({ pricing }: { pricing: PaymentViewData["pricing"] }) {
	const currency = pricing.currency || "ج.م";

	return (
		<div className="rounded-3xl border border-border/80 bg-card p-5">
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3.5">
				<div className="flex items-center gap-2 min-w-0">
					<Receipt className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
					<h3 className="text-sm font-bold text-foreground sm:text-base">تفاصيل الخطة المالية والرسوم</h3>
				</div>
				<span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
					{pricing.planName}
				</span>
			</div>

			<div className="mt-4 space-y-3">
				<div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
					<span className="flex items-center gap-2 text-muted-foreground min-w-0">
						<Sparkles className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden="true" />
						<span>قيمة الباقة التعليمية المعتمدة</span>
					</span>
					<span className="inline-flex items-baseline gap-1.5 whitespace-nowrap shrink-0 font-semibold text-foreground tabular-nums">
						<span>{formatMoney(pricing.baseAmount)}</span>
						<span className="text-xs text-muted-foreground">{currency}</span>
					</span>
				</div>

				{pricing.includeMeals && (
					<div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
						<span className="flex items-center gap-2 text-muted-foreground min-w-0">
							<Utensils className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
							<span>برنامج الوجبات الغذائية</span>
						</span>
						<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
							<Check className="h-3 w-3" aria-hidden="true" />
							<span>مشمول ضمن الباقة</span>
						</span>
					</div>
				)}

				{pricing.enableDailyStipend && (
					<div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
						<span className="flex items-center gap-2 text-muted-foreground min-w-0">
							<Wallet className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
							<span>خدمة المصروف اليومي</span>
						</span>
						<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
							<Check className="h-3 w-3" aria-hidden="true" />
							<span>مشمول ضمن الباقة</span>
						</span>
					</div>
				)}

				<div className="mt-4 border-t border-dashed border-border/80 pt-3.5">
					<div className="flex items-center justify-between gap-4">
						<div className="min-w-0">
							<span className="block text-sm font-bold text-foreground sm:text-base">الإجمالي المستحق للسداد</span>
							<span className="block text-[11px] text-muted-foreground mt-0.5">السعر النهائي للباقة شامل كافة المزايا</span>
						</div>
						<div className="inline-flex items-baseline gap-1.5 whitespace-nowrap shrink-0">
							<span className="text-xl font-extrabold text-primary sm:text-2xl tabular-nums">
								{formatMoney(pricing.totalAmount)}
							</span>
							<span className="text-xs font-bold text-muted-foreground sm:text-sm">{currency}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
