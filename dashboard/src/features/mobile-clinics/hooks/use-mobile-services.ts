import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	MobileCatalogEntryResponse,
	MobileVisitServiceResponse,
	UpsertCatalogEntryFormInput,
} from "@/server/mobile-clinics/mobile-services/mobile-services.type";

/**
 * ثوابت فارغة مشتركة — نفس نمط `use-mobile-units`.
 *
 * مرجع جديد في كل تصيير يُبطل `useMemo` و`useEffect` التي تعتمد على القائمة، و`Array.isArray`
 * بدل `?? []` لأنّ Treaty قد يسلّم كائن خطأ لا مصفوفة: عندها `?? []` يمرّره كما هو.
 */
const EMPTY_ENTRIES: MobileCatalogEntryResponse[] = [];
const EMPTY_VISIT_SERVICES: MobileVisitServiceResponse[] = [];
const EMPTY_CANDIDATES: never[] = [];

const errMsg = (e: unknown, fallback: string) =>
	(e as { value?: { message?: string } })?.value?.message || fallback;

/** [MC10.1] سجلّ الدورات المسموح بها للمركبات. */
export const useMobileServiceCatalog = () => {
	const { data, isLoading } = useQuery<MobileCatalogEntryResponse[]>({
		queryKey: ["mobile-service-catalog"],
		queryFn: async () => {
			const res = await api["mobile-services"].get();
			if (res.error) throw new Error("فشل جلب الدورات المتنقلة");
			return res.data as MobileCatalogEntryResponse[];
		},
		staleTime: 1000 * 60,
	});

	return { entries: Array.isArray(data) ? data : EMPTY_ENTRIES, isLoading };
};

/** الدورات المرشَّحة للإضافة — تُجلب عند فتح نافذة الإضافة فقط. */
export const useMobileServiceCandidates = (enabled: boolean) => {
	const { data, isLoading } = useQuery({
		queryKey: ["mobile-service-candidates"],
		enabled,
		queryFn: async () => {
			const res = await api["mobile-services"].candidates.get();
			if (res.error) throw new Error("فشل جلب الدورات المتاحة");
			return res.data;
		},
	});

	return { candidates: Array.isArray(data) ? data : EMPTY_CANDIDATES, isLoading };
};

export const useMobileServiceMutations = () => {
	const queryClient = useQueryClient();

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["mobile-service-catalog"] });
		queryClient.invalidateQueries({ queryKey: ["mobile-service-candidates"] });
	};

	const upsertMut = useMutation({
		mutationFn: async (data: UpsertCatalogEntryFormInput) => {
			const res = await api["mobile-services"].post(data);
			if (res.error) throw new Error(errMsg(res.error, "فشل حفظ الدورة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const bulkAddMut = useMutation({
		mutationFn: async (serviceIds: string[]) => {
			const res = await api["mobile-services"].bulk.post({ serviceIds });
			if (res.error) throw new Error(errMsg(res.error, "فشل إضافة الدورات"));
			return res.data as { added: number };
		},
		onSuccess: invalidate,
	});

	const removeMut = useMutation({
		mutationFn: async (id: string) => {
			const res = await api["mobile-services"]({ id }).delete();
			if (res.error) throw new Error(errMsg(res.error, "فشل إزالة الدورة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const saveEntry = (data: UpsertCatalogEntryFormInput) => {
		const p = upsertMut.mutateAsync(data);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ الدورة المتنقلة",
			error: (e: Error) => e.message || "فشل حفظ الدورة",
		});
		return p;
	};

	const addServices = (serviceIds: string[]) => {
		const p = bulkAddMut.mutateAsync(serviceIds);
		toast.promise(p, {
			loading: "جارٍ الإضافة...",
			success: (r) => `أُضيفت ${r.added} دورة إلى الأكاديمية المتنقلة`,
			error: (e: Error) => e.message || "فشل إضافة الدورات",
		});
		return p;
	};

	const removeEntry = (id: string) => {
		const p = removeMut.mutateAsync(id);
		toast.promise(p, {
			loading: "جارٍ الإزالة...",
			success: "أُزيلت الدورة من الأكاديمية المتنقلة",
			error: (e: Error) => e.message || "فشل إزالة الدورة",
		});
		return p;
	};

	return {
		saveEntry,
		addServices,
		removeEntry,
		isSaving: upsertMut.isPending,
		isAdding: bulkAddMut.isPending,
		isRemoving: removeMut.isPending,
	};
};

/** [MC10.2] ما نُفِّذ فعلًا في زيارة بعينها. */
export const useVisitServices = (visitId: string | null) => {
	const { data, isLoading } = useQuery<MobileVisitServiceResponse[]>({
		queryKey: ["mobile-visit-services", visitId],
		enabled: Boolean(visitId),
		queryFn: async () => {
			const res = await api["mobile-services"].visits({ visitId: visitId as string }).get();
			if (res.error) throw new Error("فشل جلب الدورات المنفَّذة");
			return res.data as MobileVisitServiceResponse[];
		},
	});

	return { services: Array.isArray(data) ? data : EMPTY_VISIT_SERVICES, isLoading };
};
