import { IconPlus } from "@tabler/icons-react";

import { TableToolbar } from "@/components/common/table-toolbar";
import {
	ViewGridIcon,
	ViewListIcon,
	ViewOptionsMenu,
} from "@/components/common/view-options-menu";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SavedViewsMenu } from "@/features/crm/components/saved-views-menu";
import type { CrmDealFilters } from "@/features/crm/hooks/use-crm-deals";
import { useCrmDealStatuses, useCrmLeadSources } from "@/features/crm/hooks/use-crm-masters";
import { useSession } from "@/lib/auth/client";

export type DealsView = "list" | "kanban";

/** Sentinel for «الكل» — an empty SelectItem value is not allowed by Radix. */
const ALL = "__all__";

// ترتيب DOM في RTL: «جدول» يمينًا و«لوحة» يسارًا — نفس ترتيب شاشة الموظفين
const VIEW_OPTIONS = [
	{ value: "list" as const, label: "جدول", Icon: ViewListIcon },
	{ value: "kanban" as const, label: "لوحة", Icon: ViewGridIcon },
];

/**
 * [CRM-P2] §11.2 — the deals toolbar: search, stage, source, «صفقاتي», list⇄kanban.
 *
 * The source filter reads the SAME `crm_lead_source` master the leads toolbar reads —
 * one list of sources for the module, so a funnel that follows a source from lead to deal
 * is comparing one thing and not two (§12).
 *
 * [UI] Rebuilt on `TableToolbar`, mirroring the leads toolbar exactly: the search stays wired
 * because `filters.search` is a real server filter, and the selects keep their single-select
 * server semantics inside `leftExtra`.
 */
export const DealsToolbar = ({
	view,
	onViewChange,
	filters,
	onFiltersChange,
	onCreate,
	canCreate,
}: {
	view: DealsView;
	onViewChange: (view: DealsView) => void;
	filters: CrmDealFilters;
	onFiltersChange: (filters: CrmDealFilters) => void;
	onCreate: () => void;
	canCreate: boolean;
}) => {
	const { statuses } = useCrmDealStatuses();
	const { sources } = useCrmLeadSources();
	const { data: session } = useSession();

	const patch = (next: Partial<CrmDealFilters>) => onFiltersChange({ ...filters, ...next });

	// §11.3 — تطبيق عرضٍ محفوظ يستبدل المرشّحات كلّها ولا يدمجها: عرضٌ يترك مرشّحًا
	// سابقًا قائمًا يعرض شيئًا آخر غير الذي حُفظ، وهو أسوأ من ألّا يُطبَّق
	const applyView = (view: { filters: unknown; layout: "LIST" | "KANBAN" }) => {
		onFiltersChange((view.filters ?? {}) as CrmDealFilters);
		onViewChange(view.layout === "KANBAN" ? "kanban" : "list");
	};

	return (
		<TableToolbar
			className="border-t"
			searchPlaceholder="بحث بالاسم أو الجوال"
			searchValue={filters.search ?? ""}
			onSearchChange={(value) => patch({ search: value || undefined })}
			searchClassName="w-56"
			buttonSize="xs"
			showFilter={false}
			showView={false}
			showExport={false}
			leftExtra={
				<>
					<Select
						value={filters.statusId ?? ALL}
						onValueChange={(value) => patch({ statusId: value === ALL ? undefined : value })}
					>
						<SelectTrigger className="h-6 w-40 text-[12px]">
							<SelectValue placeholder="المرحلة" />
						</SelectTrigger>
						<SelectContent dir="rtl">
							<SelectItem value={ALL}>كل المراحل</SelectItem>
							{[...statuses]
								.filter((status) => status.active)
								.sort((a, b) => a.order - b.order)
								.map((status) => (
									<SelectItem
										key={status.id}
										value={status.id}
									>
										{status.name}
									</SelectItem>
								))}
						</SelectContent>
					</Select>

					<Select
						value={filters.sourceId ?? ALL}
						onValueChange={(value) => patch({ sourceId: value === ALL ? undefined : value })}
					>
						<SelectTrigger className="h-6 w-40 text-[12px]">
							<SelectValue placeholder="المصدر" />
						</SelectTrigger>
						<SelectContent dir="rtl">
							<SelectItem value={ALL}>كل المصادر</SelectItem>
							{sources
								.filter((source) => source.active)
								.map((source) => (
									<SelectItem
										key={source.id}
										value={source.id}
									>
										{source.name}
									</SelectItem>
								))}
						</SelectContent>
					</Select>

					<Button
						type="button"
						variant={filters.mine ? "default" : "outline"}
						size="xs"
						className="gap-1.5 px-2"
						onClick={() => patch({ mine: filters.mine ? undefined : true })}
					>
						صفقاتي
					</Button>

					{/* ترتيب DOM في RTL: يأتي بعد الفلاتر فيظهر على يسارها */}
					<SavedViewsMenu
						entity="DEAL"
						currentUserId={session?.user.id ?? null}
						filters={filters}
						layout={view === "kanban" ? "KANBAN" : "LIST"}
						onApply={applyView}
					/>

					<ViewOptionsMenu
						options={VIEW_OPTIONS}
						view={view}
						onViewChange={onViewChange}
					/>
				</>
			}
			actions={
				canCreate ? (
					<Button
						size="sm"
						onClick={onCreate}
					>
						<IconPlus />
						صفقة
					</Button>
				) : null
			}
		/>
	);
};
