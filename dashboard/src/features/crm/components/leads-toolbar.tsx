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
import type { CrmLeadFilters } from "@/features/crm/hooks/use-crm-leads";
import { useCrmLeadSources, useCrmLeadStatuses } from "@/features/crm/hooks/use-crm-masters";
import { useSession } from "@/lib/auth/client";

export type LeadsView = "list" | "kanban";

/** Sentinel for «الكل» — an empty SelectItem value is not allowed by Radix. */
const ALL = "__all__";

// ترتيب DOM في RTL: «جدول» يمينًا و«لوحة» يسارًا — نفس ترتيب شاشة الموظفين
const VIEW_OPTIONS = [
	{ value: "list" as const, label: "جدول", Icon: ViewListIcon },
	{ value: "kanban" as const, label: "لوحة", Icon: ViewGridIcon },
];

/**
 * [CRM-P1] §11.2 — server-driven filters + the list⇄kanban toggle.
 *
 * [UI] Rebuilt on `TableToolbar` (the `/services/staff` contract). The search field is the
 * toolbar's own and stays WIRED, because `filters.search` already goes to the server — it is
 * a real filter, not a client-side slice of the loaded page. The status/source selects keep
 * their single-select server semantics and simply move into `leftExtra`; `FiltersMenu` was
 * not used because it is multi-select by construction and that would change what the screen
 * asks the server for.
 */
export const LeadsToolbar = ({
	view,
	onViewChange,
	filters,
	onFiltersChange,
	onCreate,
	canCreate,
}: {
	view: LeadsView;
	onViewChange: (view: LeadsView) => void;
	filters: CrmLeadFilters;
	onFiltersChange: (filters: CrmLeadFilters) => void;
	onCreate: () => void;
	canCreate: boolean;
}) => {
	const { statuses } = useCrmLeadStatuses();
	const { sources } = useCrmLeadSources();

	const { data: session } = useSession();

	const patch = (next: Partial<CrmLeadFilters>) => onFiltersChange({ ...filters, ...next });

	// §11.3 — تطبيق عرضٍ محفوظ يستبدل المرشّحات كلّها ولا يدمجها: عرضٌ يترك مرشّحًا
	// سابقًا قائمًا يعرض شيئًا آخر غير الذي حُفظ، وهو أسوأ من ألّا يُطبَّق
	const applyView = (view: { filters: unknown; layout: "LIST" | "KANBAN" }) => {
		onFiltersChange((view.filters ?? {}) as CrmLeadFilters);
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
			// البدائل الفعليّة موجودة في leftExtra، فتُخفى الأزرار القياسية (كشاشة الموظفين)
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
							<SelectValue placeholder="الحالة" />
						</SelectTrigger>
						<SelectContent dir="rtl">
							<SelectItem value={ALL}>كل الحالات</SelectItem>
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
						عملائي
					</Button>

					{/* ترتيب DOM في RTL: يأتي بعد الفلاتر فيظهر على يسارها */}
					<SavedViewsMenu
						entity="LEAD"
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
						عميل محتمل
					</Button>
				) : null
			}
		/>
	);
};
