import { useNavigate } from "@tanstack/react-router";

import { DeferredTab } from "@/features/accounting/extended/components/deferred-tab";
import { DunningTab } from "@/features/accounting/extended/components/dunning-tab";
import { PosShiftsTab } from "@/features/accounting/extended/components/pos-shifts-tab";
import { RepostTab } from "@/features/accounting/extended/components/repost-tab";
import { StatementsTab } from "@/features/accounting/extended/components/statements-tab";
import { SubscriptionsTab } from "@/features/accounting/extended/components/subscriptions-tab";
import { WithholdingTab } from "@/features/accounting/extended/components/withholding-tab";
import { cn } from "@/lib/utils";

/**
 * [P12.14] ONE «العمليات الممتدّة» hub (contract §7.8 hub rule) — the Phase-12 Extended
 * features, which shipped server-side only and were until now unreachable through the
 * product.
 *
 * WHY ONE HUB AND NOT SEVEN SCREENS. Each of these is a periodic or exceptional operation an
 * owner touches monthly at most: recognise deferred revenue, bill subscriptions, chase
 * overdue invoices, mail statements, check the till, review withholding, repost a corrected
 * document. Seven top-level entries would bury the daily screens they sit beside, and they
 * genuinely belong together — they are the things you do when closing a month, not when
 * serving a patient.
 *
 * ORDER IS BY HOW OFTEN A CLINIC TOUCHES THEM, not by phase number: the till is checked
 * daily, subscriptions and deferred revenue monthly, and reposting is the rare correction
 * nobody wants to reach for first.
 */

export const EXTENDED_TABS = [
	{ value: "pos-shifts", label: "ورديات نقطة البيع" },
	{ value: "subscriptions", label: "الاشتراكات" },
	{ value: "deferred", label: "الاستحقاق المؤجل" },
	{ value: "dunning", label: "المطالبات" },
	{ value: "statements", label: "كشوف الحسابات" },
	{ value: "withholding", label: "الاستقطاع الضريبي" },
	{ value: "repost", label: "إعادة الترحيل" },
] as const;

export type ExtendedTab = (typeof EXTENDED_TABS)[number]["value"];
export const isExtendedTab = (value: unknown): value is ExtendedTab =>
	EXTENDED_TABS.some((tab) => tab.value === value);

export const ExtendedPage = ({ tab }: { tab: ExtendedTab }) => {
	const navigate = useNavigate();
	const setTab = (next: ExtendedTab) =>
		navigate({ to: "/management/accounting/extended", search: { tab: next } });

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">العمليات الممتدّة</h1>
				<p className="text-muted-foreground text-sm">
					عمليات الإقفال الدوري والحالات الاستثنائية: ورديات الكاشير، الفوترة الدوريّة، الاعتراف
					المؤجل، المطالبات، كشوف الحسابات، الاستقطاع، وإعادة ترحيل الدفتر.
				</p>
			</div>

			{/* the hub's in-page tab strip (§7.8 hub rule) — the الحوكمة pill treatment */}
			<nav
				className="flex flex-wrap items-center gap-[3.49px] border-t px-4 py-2"
				dir="rtl"
			>
				{EXTENDED_TABS.map((entry) => (
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

			{tab === "pos-shifts" && <PosShiftsTab />}
			{tab === "subscriptions" && <SubscriptionsTab />}
			{tab === "deferred" && <DeferredTab />}
			{tab === "dunning" && <DunningTab />}
			{tab === "statements" && <StatementsTab />}
			{tab === "withholding" && <WithholdingTab />}
			{tab === "repost" && <RepostTab />}
		</div>
	);
};
