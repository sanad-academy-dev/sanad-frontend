import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";

export type { FilterGroup };

export function TrainingFiltersMenu({ groups }: { groups: FilterGroup[] }) {
	return <FiltersMenu groups={groups} />;
}
