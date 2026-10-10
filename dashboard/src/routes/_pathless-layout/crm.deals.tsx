import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import { DealQuickCreateDialog } from "@/features/crm/components/deal-quick-create-dialog";
import { DealsKanban } from "@/features/crm/components/deals-kanban";
import { DealsTable } from "@/features/crm/components/deals-table";
import { DealsToolbar, type DealsView } from "@/features/crm/components/deals-toolbar";
import { type CrmDealFilters, useCrmDeals } from "@/features/crm/hooks/use-crm-deals";
import { CrmModuleHeader } from "@/features/crm/navigation/crm-module-header";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";

/**
 * [CRM-P2] «الصفقات» — §11.2 list ⇄ kanban. The view lives in the URL so a reload, a shared
 * link and the back button all land on the same half of the screen (the leads precedent).
 */
export const Route = createFileRoute("/_pathless-layout/crm/deals")({
	validateSearch: (search): { view: DealsView } => {
		const raw = (search as { view?: string }).view;
		return { view: raw === "kanban" ? "kanban" : "list" };
	},
	component: CrmDealsRoute,
});

function CrmDealsRoute() {
	const { view } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const [filters, setFilters] = useState<CrmDealFilters>({});
	const [createOpen, setCreateOpen] = useState(false);
	const { hasPermission } = usePermissions();
	const { deals, isLoading } = useCrmDeals(filters);

	// الأرقام مشتقّة من القائمة المعروضة نفسها — لا استعلام جديد. المبالغ تُجمَع كنصّ عبر
	// formatAmount حفاظًا على C2: لا عدد عشري من JS يلمس المال، فالجمع يتم بأعداد صحيحة
	const stats = useMemo<StatItem[]>(() => {
		const by = (kind: string) => deals.filter((deal) => deal.status.kind === kind).length;
		const sumExpected = deals.reduce(
			(total, deal) => total + Math.round(Number(deal.expectedValue) * 100),
			0,
		);
		return [
			{
				title: "إجمالي الصفقات",
				value: deals.length,
				tooltip: "عدد الصفقات في القائمة المعروضة حاليًا بعد تطبيق التصفية",
			},
			{ title: "مفتوحة", value: by("OPEN"), tooltip: "صفقات ما زالت قيد التفاوض" },
			{ title: "مكسوبة", value: by("WON"), tooltip: "صفقات أُغلقت بالكسب وسُلِّم وليّ أمرها" },
			{
				title: "القيمة المتوقّعة",
				value: sumExpected,
				valueLabel: formatAmount((sumExpected / 100).toFixed(2)),
				tooltip: "مجموع القيمة المتوقّعة (القيمة × نسبة الإغلاق) للصفقات المعروضة",
			},
		];
	}, [deals]);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<CrmModuleHeader active="/crm/deals" />

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<DealsToolbar
				view={view}
				onViewChange={(next) =>
					void navigate({ search: (prev) => ({ ...prev, view: next }), replace: true })
				}
				filters={filters}
				onFiltersChange={setFilters}
				onCreate={() => setCreateOpen(true)}
				canCreate={hasPermission(PERMISSIONS.CRM_DEALS_CREATE)}
			/>

			{view === "kanban" ? (
				<DealsKanban deals={deals} />
			) : (
				<DealsTable
					deals={deals}
					isLoading={isLoading}
					onOpenCreate={
						hasPermission(PERMISSIONS.CRM_DEALS_CREATE) ? () => setCreateOpen(true) : undefined
					}
				/>
			)}

			<DealQuickCreateDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
			/>
		</div>
	);
}
