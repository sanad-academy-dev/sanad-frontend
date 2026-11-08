"use client";

import { Sparkles, Utensils, Wallet, Receipt } from "lucide-react";
import type { PaymentViewData } from "../types";

export function PricingBreakdown({ pricing }: { pricing: PaymentViewData["pricing"] }) {
	const currency = pricing.currency || "ج.م";

	return (
		<div className="rounded-3xl border border-border/80 bg-card/60 p-5 shadow-sm backdrop-blur-md">
			<div className="flex items-center justify-between border-b border-border/60 pb-3">
				<div className="flex items-center gap-2">
					<Receipt className="h-5 w-5 text-primary" />
					<h3 className="text-sm font-bold text-foreground sm:text-base">تفاصيل الخطة المالية والرسوم</h3>
				</div>
				<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
					{pricing.planName}
				</span>
			</div>

			<div className="mt-4 space-y-3">
				<div className="flex items-center justify-between text-xs sm:text-sm">
					<span className="flex items-center gap-2 text-muted-foreground">
						<Sparkles className="h-3.5 w-3.5 text-primary/70" />
						رسوم الباقة التعليمية الأساسية
					</span>
					<span className="font-semibold text-foreground">
						{pricing.baseAmount.toLocaleString("ar-EG")} {currency}
					</span>
				</div>

				{pricing.includeMeals && (
					<div className="flex items-center justify-between text-xs sm:text-sm">
						<span className="flex items-center gap-2 text-muted-foreground">
							<Utensils className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
							برنامج الوجبات الغذائية المعتمد
						</span>
						<span className="font-semibold text-foreground">
							{pricing.mealsAmount.toLocaleString("ar-EG")} {currency}
						</span>
					</div>
				)}

				{pricing.enableDailyStipend && (
					<div className="flex items-center justify-between text-xs sm:text-sm">
						<span className="flex items-center gap-2 text-muted-foreground">
							<Wallet className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
							خدمة رصيد المصروف اليومي
						</span>
						<span className="font-semibold text-foreground">
							{pricing.stipendAmount.toLocaleString("ar-EG")} {currency}
						</span>
					</div>
				)}

				<div className="mt-4 border-t border-dashed border-border/80 pt-3">
					<div className="flex items-center justify-between">
						<div>
							<span className="block text-sm font-bold text-foreground sm:text-base">الإجمالي المستحق للسداد</span>
							<span className="block text-[11px] text-muted-foreground">شامل كافة الرسوم لحجز المقعد الدراسي</span>
						</div>
						<div className="text-left">
							<span className="text-xl font-extrabold text-primary sm:text-2xl font-mono">
								{pricing.totalAmount.toLocaleString("ar-EG")}
							</span>
							<span className="mr-1 text-xs font-semibold text-muted-foreground">{currency}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
