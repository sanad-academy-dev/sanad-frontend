import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { CatalogSpecies } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	CatalogProductListResponse,
	DrugStandardResponse,
} from "@/server/drug-catalog/drug-catalog.type";

type StandardProductsResponse = CatalogProductListResponse & {
	standard: DrugStandardResponse | null;
};

type StandardProductsQuery = {
	standardId: string;
	q?: string;
	species?: CatalogSpecies;
	dosageForm?: string;
	therapeuticClass?: string;
	includeSuspended?: boolean;
	page?: number;
	pageSize?: number;
};

/**
 * Browses one standard's catalog from settings. Unlike the inventory picker this
 * works whether or not the clinic has the standard enabled — the point is to see
 * what a catalog contains before deciding.
 */
export const useStandardProducts = ({
	standardId,
	q,
	species,
	dosageForm,
	therapeuticClass,
	includeSuspended = false,
	page = 1,
	pageSize = 25,
}: StandardProductsQuery) => {
	const { data, isLoading, isFetching } = useQuery<StandardProductsResponse>({
		queryKey: [
			"drug-catalog",
			"standard-products",
			{
				standardId,
				q,
				species,
				dosageForm,
				therapeuticClass,
				includeSuspended,
				page,
				pageSize,
			},
		],
		placeholderData: keepPreviousData,
		queryFn: async () => {
			// biome-ignore lint/suspicious/noExplicitAny: Eden Treaty uses function-call syntax for dynamic path segments — no typed alternative
			const res = await (api["drug-catalog"].standards as any)({
				id: standardId,
			}).products.get({
				query: {
					...(q ? { q } : {}),
					...(species ? { species } : {}),
					...(dosageForm ? { dosageForm } : {}),
					...(therapeuticClass ? { therapeuticClass } : {}),
					...(includeSuspended ? { includeSuspended: true } : {}),
					page,
					pageSize,
				},
			});
			if (res.error) throw new Error("فشل جلب مستحضرات المعيار");
			return res.data as StandardProductsResponse;
		},
	});

	return {
		products: data?.items ?? [],
		standard: data?.standard ?? null,
		total: data?.total ?? 0,
		isLoading,
		isFetching,
	};
};
