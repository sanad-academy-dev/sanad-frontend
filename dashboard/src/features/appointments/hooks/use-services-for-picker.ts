import { useMemo } from "react";

import {
	type FlatServiceItem,
	flattenServiceItems,
} from "@/features/appointments/utils/services";
import { useServicesTree } from "@/features/settings/services/hooks/use-services-tree";
import type { ServiceCategoryResponse } from "@/server/services/services.type";

const EMPTY_TREE: ServiceCategoryResponse[] = [];
const EMPTY_SERVICES: FlatServiceItem[] = [];
const EMPTY_GROUPS: AccordionGroup[] = [];

export type AccordionGroup = {
	id: string;
	name: string;
	items: FlatServiceItem[];
};

export const useServicesForPicker = () => {
	const { tree, isLoading } = useServicesTree();
	const services = useMemo(() => flattenServiceItems(tree), [tree]);

	const accordionGroups = useMemo<AccordionGroup[]>(
		() =>
			tree.map((cat) => ({
				id: cat.id,
				name: cat.name,
				items: cat.children.flatMap((sub) =>
					sub.children.map((item) => ({
						...item,
						categoryName: cat.name,
						subcategoryName: sub.name,
					})),
				),
			})),
		[tree],
	);

	return {
		tree: tree.length > 0 ? tree : EMPTY_TREE,
		services: services.length > 0 ? services : EMPTY_SERVICES,
		accordionGroups: accordionGroups.length > 0 ? accordionGroups : EMPTY_GROUPS,
		isLoading,
	};
};
