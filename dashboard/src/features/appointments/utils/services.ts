import type {
	ServiceCategoryResponse,
	ServiceItemResponse,
} from "@/server/services/services.type";

export type FlatServiceItem = ServiceItemResponse & {
	categoryName: string;
	subcategoryName: string;
};

export const flattenServiceItems = (tree: ServiceCategoryResponse[]): FlatServiceItem[] =>
	tree.flatMap((category) =>
		category.children.flatMap((sub) =>
			sub.children.map((item) => ({
				...item,
				categoryName: category.name,
				subcategoryName: sub.name,
			})),
		),
	);

export const sumDuration = (items: FlatServiceItem[]) =>
	items.reduce((acc, item) => acc + (item.duration ?? 0), 0);

export const sumPrice = (items: FlatServiceItem[]) =>
	items.reduce((acc, item) => acc + (item.price ?? 0), 0);
