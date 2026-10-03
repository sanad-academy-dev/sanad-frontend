import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { LeadQuickCreateDialog } from "@/features/crm/components/lead-quick-create-dialog";
import { LeadsKanban } from "@/features/crm/components/leads-kanban";
import { LeadsTable } from "@/features/crm/components/leads-table";
import { LeadsToolbar, type LeadsView } from "@/features/crm/components/leads-toolbar";
import { type CrmLeadFilters, useCrmLeads } from "@/features/crm/hooks/use-crm-leads";
import { CrmModuleHeader } from "@/features/crm/navigation/crm-module-header";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";

/** [CRM-P1] «العملاء المحتملون» — §11.2 list ⇄ kanban. The view lives in the URL so a
 * reload, a shared link and the back button all land on the same half of the screen. */
export const Route = createFileRoute("/_pathless-layout/crm/leads")({
	validateSearch: (search): { view: LeadsView } => {
		const raw = (search as { view?: string }).view;
		return { view: raw === "kanban" ? "kanban" : "list" };
	},
	component: CrmLeadsRoute,
});

function CrmLeadsRoute() {
	const { view } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const [filters, setFilters] = useState<CrmLeadFilters>({});
	const [createOpen, setCreateOpen] = useState(false);
	const { hasPermission } = usePermissions();
	const { leads, isLoading } = useCrmLeads(filters);

	// الأرقام مشتقّة من القائمة المعروضة نفسها — لا استعلام جديد ولا نقطة نهاية جديدة،
	// ولذلك تعكس ما تصفّيه الفلاتر الحالية، وهو ما تقوله التلميحات صراحةً
	const stats = useMemo<StatItem[]>(() => {
		const by = (kind: string) => leads.filter((lead) => lead.status.kind === kind).length;
		return [
			{
				title: "إجمالي العملاء المحتملين",
				value: leads.length,
				tooltip: "عدد العملاء المحتملين في القائمة المعروضة حاليًا بعد تطبيق التصفية",
			},
			{ title: "مفتوح", value: by("OPEN"), tooltip: "عملاء ما زال مسارهم مفتوحًا" },
			{ title: "محوَّل", value: by("CONVERTED"), tooltip: "عملاء حُوِّلوا إلى صفقات" },
			{ title: "مفقود", value: by("LOST"), tooltip: "عملاء أُغلقوا بسبب فقدان مسجَّل" },
		];
	}, [leads]);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<CrmModuleHeader active="/crm/leads" />

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<LeadsToolbar
				view={view}
				onViewChange={(next) =>
					void navigate({ search: (prev) => ({ ...prev, view: next }), replace: true })
				}
				filters={filters}
				onFiltersChange={setFilters}
				onCreate={() => setCreateOpen(true)}
				canCreate={hasPermission(PERMISSIONS.CRM_LEADS_CREATE)}
			/>

			{view === "kanban" ? (
				<LeadsKanban leads={leads} />
			) : (
				<LeadsTable
					leads={leads}
					isLoading={isLoading}
					onOpenCreate={
						hasPermission(PERMISSIONS.CRM_LEADS_CREATE) ? () => setCreateOpen(true) : undefined
					}
				/>
			)}

			<LeadQuickCreateDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
			/>
		</div>
	);
}
