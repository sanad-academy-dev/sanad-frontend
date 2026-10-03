import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
	ClinicDocumentCategory,
	ClinicDocumentResponse,
	DocumentKind,
	ExpiryFilter,
} from "@/server/clinic-documents/clinic-documents.type";

export type ClinicDocumentFilters = {
	category?: ClinicDocumentCategory;
	branchId?: string;
	expiry?: ExpiryFilter;
	search?: string;
	kind?: DocumentKind;
};

export const clinicDocumentsQueryKey = (filters: ClinicDocumentFilters) =>
	["clinic-documents", filters] as const;

export const useClinicDocuments = (filters: ClinicDocumentFilters = {}) => {
	const { data, isLoading, error, refetch } = useQuery<ClinicDocumentResponse[]>({
		queryKey: clinicDocumentsQueryKey(filters),
		queryFn: async () => {
			const res = await api["clinic-documents"].get({ query: filters });
			if (res.error) throw new Error("فشل تحميل المستندات");
			return res.data as ClinicDocumentResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { documents: data ?? [], isLoading, error, refetch };
};
