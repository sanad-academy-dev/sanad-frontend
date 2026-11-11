import { useState } from "react";
import {
	IconCoins,
	IconCreditCard,
	IconPlus,
	IconToolsKitchen2,
	IconWallet,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useQuickUpdateRequest } from "../../hooks/use-digital-registration";
import {
	useRegistrationSubscriptionPlans,
	type SubscriptionPlanCardItem,
} from "../../hooks/use-registration-plans";
import { resolveClinicCurrencySymbol } from "../../utils/payment-helpers";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";

interface RequestFinancialServicesProps {
	request: CampaignRequestItem;
	campaignId?: string;
}

export function RequestFinancialServices({
	request,
	campaignId = "",
}: RequestFinancialServicesProps) {
	const [planPopoverOpen, setPlanPopoverOpen] = useState(false);
	const { plans } = useRegistrationSubscriptionPlans();
	const { clinicInfo } = useClinicInfo();
	const currency = resolveClinicCurrencySymbol(clinicInfo?.currencyCode);
	const quickUpdateMutation = useQuickUpdateRequest(campaignId);

	const handleAssignPlan = (plan: SubscriptionPlanCardItem) => {
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: {
					subscriptionPlanId: plan.id,
					subscriptionPlanName: plan.name,
					subscriptionAmount: plan.price,
				},
			},
			{
				onSuccess: () => {
					toast.success(`تم تعيين ${plan.name} بمبلغ ${plan.price} ${currency}`);
					setPlanPopoverOpen(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل تعيين الباقة");
				},
			},
		);
	};

	const handleToggleMeals = (val: boolean) => {
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: { includeMeals: val },
			},
			{
				onSuccess: () => {
					toast.success(val ? "تم تفعيل تضمين الوجبات" : "تم إلغاء تضمين الوجبات");
				},
			},
		);
	};

	const handleToggleStipend = (val: boolean) => {
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: { enableDailyStipend: val },
			},
			{
				onSuccess: () => {
					toast.success(val ? "تم تفعيل المصروف اليومي" : "تم إلغاء المصروف اليومي");
				},
			},
		);
	};

	const currentAmountFormatted = request.subscriptionAmount
		? `${request.subscriptionAmount} ${currency}`
		: `0 ${currency}`;

	return (
		<div
			className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 space-y-1.5 font-sans shadow-2xs"
			dir="rtl"
		>
			<h4 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
				<IconCreditCard className="size-3.5 text-emerald-600" />
				<span>الاشتراك</span>
			</h4>

			<div className="space-y-1.5 text-xs">
				{/* اختيار الباقة */}
				<div className="flex items-center justify-between py-0.5 border-b border-zinc-100 dark:border-zinc-800/60">
					<span className="text-zinc-500 dark:text-zinc-400 text-[10px]">اختيار الباقة</span>
					<Popover open={planPopoverOpen} onOpenChange={setPlanPopoverOpen}>
						<PopoverTrigger asChild>
							{request.subscriptionPlanName ? (
								<Button
									variant="outline"
									size="sm"
									className="h-5 px-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100"
								>
									<span>{request.subscriptionPlanName}</span>
								</Button>
							) : (
								<Button
									variant="outline"
									size="sm"
									className="h-5 px-1.5 text-[9.5px] border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary gap-0.5"
								>
									<IconPlus className="size-2.5 text-primary" />
									<span>تعيين إشتراك</span>
								</Button>
							)}
						</PopoverTrigger>
						<PopoverContent align="end" className="w-56 p-1.5" dir="rtl">
							<p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5">
								اختر باقة الاشتراك الأكاديمية
							</p>
							<div className="space-y-0.5 mt-0.5 max-h-48 overflow-y-auto">
								{plans.map((p) => (
									<button
										key={p.id}
										type="button"
										onClick={() => handleAssignPlan(p)}
										className="w-full flex items-center justify-between p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-right transition-colors"
									>
										<span className="text-[10.5px] font-semibold text-zinc-800 dark:text-zinc-200">
											{p.name}
										</span>
										<span className="text-[10.5px] font-bold text-emerald-600 font-mono">
											{p.price} {currency}
										</span>
									</button>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</div>

				{/* المبلغ المحسوب */}
				<div className="flex items-center justify-between py-0.5 border-b border-zinc-100 dark:border-zinc-800/60">
					<span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 text-[10px]">
						<IconCoins className="size-3 text-zinc-400" />
						<span>المبلغ</span>
					</span>
					<span className="font-bold text-zinc-800 dark:text-zinc-200 text-[10.5px] font-mono">
						{currentAmountFormatted}
					</span>
				</div>

				{/* مفتاح تضمين الوجبات */}
				<div className="flex items-center justify-between py-0.5">
					<span className="font-medium text-zinc-700 dark:text-zinc-300 text-[10px] flex items-center gap-1">
						<IconToolsKitchen2 className="size-3 text-amber-500" />
						<span>تضمين الوجبات</span>
					</span>
					<Switch
						checked={request.includeMeals ?? false}
						onCheckedChange={handleToggleMeals}
						disabled={quickUpdateMutation.isPending}
						className="scale-85"
					/>
				</div>

				{/* مفتاح المصروف اليومي */}
				<div className="flex items-center justify-between py-0.5 border-t border-zinc-100 dark:border-zinc-800/60 pt-1">
					<span className="font-medium text-zinc-700 dark:text-zinc-300 text-[10px] flex items-center gap-1">
						<IconWallet className="size-3 text-blue-500" />
						<span>المصروف اليومي</span>
					</span>
					<Switch
						checked={request.enableDailyStipend ?? false}
						onCheckedChange={handleToggleStipend}
						disabled={quickUpdateMutation.isPending}
						className="scale-85"
					/>
				</div>
			</div>
		</div>
	);
}
