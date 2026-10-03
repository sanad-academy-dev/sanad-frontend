import { useNavigate } from "@tanstack/react-router";

import { InsurersTab } from "@/features/accounting/insurance/components/insurers-tab";
import { PoliciesTab } from "@/features/accounting/insurance/components/policies-tab";
import { ProductsTab } from "@/features/accounting/insurance/components/products-tab";
import { cn } from "@/lib/utils";

/**
 * [MI-P3] ONE «التأمين» hub (MI BRD §11 — inside المالية, no new sidebar group):
 * insurers + products + policies. Claims («المطالبات التأمينية») arrive in MI-P4 as
 * their own list — deliberately NOT a tab here, §11 places them separately.
 */

export const INSURANCE_TABS = [
	{ value: "policies", label: "بوالص الأطفال" },
	{ value: "products", label: "المنتجات" },
	{ value: "insurers", label: "الشركات" },
] as const;

export type InsuranceTab = (typeof INSURANCE_TABS)[number]["value"];
export const isInsuranceTab = (value: unknown): value is InsuranceTab =>
	INSURANCE_TABS.some((tab) => tab.value === value);

export const InsurancePage = ({ tab }: { tab: InsuranceTab }) => {
	const navigate = useNavigate();
	const setTab = (next: InsuranceTab) =>
		navigate({ to: "/management/accounting/insurance", search: { tab: next } });

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">التأمين</h1>
				<p className="text-muted-foreground text-sm">
					شركات التأمين ومنتجاتها وبوالص الأطفال — بيانات التغطية فقط: تقسيم الفواتير والمطالبات
					يصلان في المرحلة القادمة، ولا شيء هنا يمسّ التسعير أو القيود.
				</p>
			</div>

			{/* the hub's in-page tab strip (§7.8 hub rule) — the same pill treatment */}
			<nav
				className="flex flex-wrap items-center gap-[3.49px] border-t px-4 py-2"
				dir="rtl"
			>
				{INSURANCE_TABS.map((entry) => (
					<button
						key={entry.value}
						type="button"
						onClick={() => setTab(entry.value)}
						className={cn(
							"flex h-[25px] items-center justify-center rounded-[4px] px-[14px] font-medium text-[11px] leading-[16px]",
							tab === entry.value
								? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"
								: "text-[#6B7280]",
						)}
					>
						{entry.label}
					</button>
				))}
			</nav>

			{tab === "policies" && <PoliciesTab />}
			{tab === "products" && <ProductsTab />}
			{tab === "insurers" && <InsurersTab />}
		</div>
	);
};
