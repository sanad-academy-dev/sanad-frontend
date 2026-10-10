import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { CatalogSpecies } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { CatalogProductListResponse } from "@/server/drug-catalog/drug-catalog.type";

type CatalogQuery = {
	q?: string;
	species?: CatalogSpecies;
	dosageForm?: string;
	therapeuticClass?: string;
	page?: number;
	pageSize?: number;
	enabled?: boolean;
};

const EMPTY: CatalogProductListResponse = { items: [], total: 0, page: 1, pageSize: 25 };

export const useDrugCatalog = ({
	q,
	species,
	dosageForm,
	therapeuticClass,
	page = 1,
	pageSize = 25,
	enabled = true,
}: CatalogQuery) => {
	const { data, isLoading, isFetching } = useQuery<CatalogProductListResponse>({
		queryKey: [
			"drug-catalog",
			"products",
			{ q, species, dosageForm, therapeuticClass, page, pageSize },
		],
		enabled,
		// paging shouldn't blank the list out from under the user
		placeholderData: keepPreviousData,
		queryFn: async () => {
			const res = await api["drug-catalog"].products.get({
				query: {
					...(q ? { q } : {}),
					...(species ? { species } : {}),
					...(dosageForm ? { dosageForm } : {}),
					...(therapeuticClass ? { therapeuticClass } : {}),
					page,
					pageSize,
				},
			});
			if (res.error) throw new Error("فشل البحث في كتالوج الأدوية");
			return res.data as CatalogProductListResponse;
		},
	});

	return {
		products: data?.items ?? EMPTY.items,
		total: data?.total ?? 0,
		page: data?.page ?? page,
		pageSize: data?.pageSize ?? pageSize,
		isLoading,
		isFetching,
	};
};
