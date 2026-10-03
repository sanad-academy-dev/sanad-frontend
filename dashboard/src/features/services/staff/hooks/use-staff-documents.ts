import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
	StaffDocumentCategory,
	StaffDocumentResponse,
} from "@/server/staff-documents/staff-documents.type";

export const staffDocumentsQueryKey = (staffId: string, category: StaffDocumentCategory) =>
	["staff", staffId, "documents", category] as const;

export const useStaffDocuments = (staffId: string, category: StaffDocumentCategory) => {
	const { data, isLoading } = useQuery<StaffDocumentResponse[]>({
		queryKey: staffDocumentsQueryKey(staffId, category),
		queryFn: async () => {
			const res = await api.staff({ id: staffId }).documents.get({ query: { category } });
			if (res.error) throw new Error("فشل تحميل المستندات");
			return res.data as StaffDocumentResponse[];
		},
		enabled: !!staffId,
		staleTime: 1000 * 60 * 5,
	});

	return { documents: data ?? [], isLoading };
};
