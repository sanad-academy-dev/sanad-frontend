import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

import { Stats } from "@/components/common/stats";
import { AccountingPeriodsTab } from "@/features/accounting/governance/components/accounting-periods-tab";
import { AdaptersTab } from "@/features/accounting/governance/components/adapters-tab";
import { BudgetsTab } from "@/features/accounting/governance/components/budgets-tab";
import { DimensionsTab } from "@/features/accounting/governance/components/dimensions-tab";
import { OpeningTab } from "@/features/accounting/governance/components/opening-tab";
import { PeriodClosingTab } from "@/features/accounting/governance/components/period-closing-tab";
import { ReadinessTab } from "@/features/accounting/governance/components/readiness-tab";
import { useAccountingDimensions } from "@/features/accounting/governance/hooks/use-accounting-dimensions";
import { useAccountingPeriods } from "@/features/accounting/governance/hooks/use-accounting-periods";
import { useAccountingReadiness } from "@/features/accounting/governance/hooks/use-accounting-readiness";
import { useBudgets } from "@/features/accounting/governance/hooks/use-budgets";
import { usePeriodClosingVouchers } from "@/features/accounting/governance/hooks/use-period-closing-vouchers";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { cn } from "@/lib/utils";

/**
 * [P11.6] ONE «الحوكمة» hub (contract §10.3 placement + §7.8 hub rule): the four
 * governance instruments — accounting periods (FR-12.2), period closing (FR-12.3),
 * budgets (§13), accounting dimensions (§4.5) — as an in-page `?tab=` strip in the
 * legacy pill style, per the الضرائب precedent.
 */

export const GOVERNANCE_TABS = [
	// [P12C.2] الجاهزية أولًا عمدًا: هي أول ما يحتاجه من فتح المحاسبة لتوّه، ولا معنى
	// لبقية التبويبات قبل أن تستطيع الأكاديمية ترحيل مستند أصلًا (contract KL-7)
	{ value: "readiness", label: "الجاهزية" },
	{ value: "periods", label: "الفترات المحاسبية" },
	{ value: "closing", label: "إقفال الفترة" },
	{ value: "budgets", label: "الموازنات" },
	{ value: "dimensions", label: "الأبعاد" },
	// [P12A.1] the FR-17.3 migration grid joins the hub — one-time setup work lives here
	{ value: "opening", label: "الافتتاح" },
	// [P12A.2e] §C3 run-control joins governance
	{ value: "adapters", label: "المحولات" },
] as const;
export type GovernanceTab = (typeof GOVERNANCE_TABS)[number]["value"];
export const isGovernanceTab = (value: unknown): value is GovernanceTab =>
	GOVERNANCE_TABS.some((tab) => tab.value === value);

export const GovernancePage = ({ tab }: { tab: GovernanceTab }) => {
	const navigate = useNavigate();
	const setTab = (next: GovernanceTab) =>
		navigate({ to: "/management/accounting/governance", search: { tab: next } });

	// the tabs' own hooks share these query keys — React Query dedupes the fetches
	const { periods } = useAccountingPeriods();
	const { vouchers } = usePeriodClosingVouchers();
	const { budgets } = useBudgets();
	const { dimensions } = useAccountingDimensions();
	const { readiness } = useAccountingReadiness();

	const stats = useMemo<StatItem[]>(
		() => [
			{
				// [P12C.2] أول بطاقة: لا معنى لبقية الأرقام قبل أن تستطيع الأكاديمية الترحيل
				title: "جاهزية الترحيل",
				value: readiness?.doneCount ?? 0,
				// `valueLabel` لأن «٣ من ٥» أوضح من «٣» وحدها هنا
				valueLabel: readiness ? `${readiness.doneCount}/${readiness.totalCount}` : "—",
				tooltip:
					"خطوات التهيئة المكتملة. الخطوات المانعة تُرفض عندها كل مستند حتى تُستكمل (KL-7).",
			},
			{
				title: "الفترات المعتمدة",
				value: periods.filter((row) => row.docstatus === "SUBMITTED").length,
				tooltip: "فترات محاسبية معتمدة تقفل أنواع مستندات داخل مداها (FR-12.2).",
			},
			{
				title: "سندات الإقفال",
				value: vouchers.length,
				tooltip: "سندات إقفال الفترة — الترحيل يجري كمهمة خلفية (FR-12.3).",
			},
			{
				title: "الموازنات السارية",
				value: budgets.filter((row) => row.docstatus === "SUBMITTED").length,
				tooltip: "موازنات معتمدة تفرض حدود الإنفاق عند الترحيل (§13).",
			},
			{
				title: "الأبعاد المُعرَّفة",
				value: dimensions.filter((row) => !row.disabled).length,
				tooltip: "خانات الأبعاد التحليلية الفعّالة من أصل 4 (§4.5).",
			},
		],
		[periods, vouchers, budgets, dimensions, readiness],
	);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">الحوكمة</h1>
				<p className="text-muted-foreground text-sm">
					جاهزية الترحيل وأدوات ضبط الدفاتر: الفترات المحاسبية، إقفال الفترة، الموازنات،
					والأبعاد التحليلية (KL-7 / FR-12 / §13 / §4.5).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-5"
				stats={stats}
			/>

			{/* the hub's in-page tab strip (§7.8 hub rule) — legacy pill treatment */}
			<nav
				className="flex items-center gap-[3.49px] border-t px-4 py-2"
				dir="rtl"
			>
				{GOVERNANCE_TABS.map((entry) => (
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

			{tab === "readiness" && <ReadinessTab />}
			{tab === "periods" && <AccountingPeriodsTab />}
			{tab === "closing" && <PeriodClosingTab />}
			{tab === "budgets" && <BudgetsTab />}
			{tab === "dimensions" && <DimensionsTab />}
			{tab === "opening" && <OpeningTab />}
			{tab === "adapters" && <AdaptersTab />}
		</div>
	);
};
