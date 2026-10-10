import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	ChangeDealStatusFormInput,
	CreateDealFormInput,
	CrmDealDetailResponse,
	CrmDealListResponse,
	DealProductsFormInput,
} from "@/server/crm/crm-deals/crm-deals.type";
import type { CrmStatusLogResponse } from "@/server/crm/crm-leads/crm-leads.type";

/** [CRM-P2] Data hooks for deals (BRD §4, §6, §7, §11.2, §11.5). */

const QUERY_KEY = ["crm", "deals"] as const;
const deals = api.crm.deals;

/** Server messages are already Arabic (§0.2) — surface them rather than a generic string. */
const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export type CrmDealFilters = {
	statusId?: string;
	sourceId?: string;
	ownerUserId?: string;
	search?: string;
	mine?: boolean;
};

export const useCrmDeals = (filters: CrmDealFilters = {}) => {
	const { data, isLoading, refetch } = useQuery<CrmDealListResponse[]>({
		// filters belong in the key: the server filters (§11.2), so a changed filter is a
		// different resource rather than a client-side slice of one cache entry
		queryKey: [...QUERY_KEY, filters],
		queryFn: async () => {
			const { data, error } = await deals.get({ query: filters });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الصفقات"));
			return data as CrmDealListResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { deals: data ?? [], isLoading, refetch };
};

export const useCrmDeal = (id: string | null) => {
	const { data, isLoading } = useQuery<CrmDealDetailResponse>({
		queryKey: [...QUERY_KEY, "detail", id],
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await deals({ id: id as string }).get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الصفقة"));
			return data as CrmDealDetailResponse;
		},
	});
	return { deal: data ?? null, isLoading };
};

export const useCrmDealStatusLog = (id: string | null) => {
	const { data, isLoading } = useQuery<CrmStatusLogResponse[]>({
		queryKey: [...QUERY_KEY, "status-log", id],
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await deals({ id: id as string })["status-log"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل سجلّ الحالات"));
			return data as CrmStatusLogResponse[];
		},
	});
	return { statusLog: data ?? [], isLoading };
};

export const useCreateDeal = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: CreateDealFormInput) => {
			const { data, error } = await deals.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء الصفقة"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	});

	const createDeal = (input: CreateDealFormInput) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ إنشاء الصفقة...",
			success: "أُنشئت الصفقة",
			error: (error: Error) => error.message,
		});

	return { createDeal, isCreating: isPending };
};

export const useChangeDealStatus = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({ id, ...body }: ChangeDealStatusFormInput & { id: string }) => {
			const { data, error } = await deals({ id }).status.post(body);
			// BR-C4.1 — «مكسوبة» ترفض من هنا برسالة تدلّ على زرّ الفوز؛ نعرضها كما جاءت
			if (error) throw new Error(errorMessage(error, "تعذّر تغيير الحالة"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	});

	return { changeStatus: mutateAsync, isChangingStatus: isPending };
};

/** [CRM-P6] §10.3 — «تم الرد» اليدويّ على الصفقة، نظير `useMarkLeadResponded` (§17.2 صفّ ٢٩). */
export const useMarkDealResponded = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await deals({ id })["mark-responded"].post();
			if (error) throw new Error(errorMessage(error, "تعذّر تسجيل الرد"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	});

	const markResponded = (id: string) =>
		toast.promise(mutateAsync(id), {
			loading: "جارٍ تسجيل الرد...",
			success: "سُجّل الرد",
			error: (error: Error) => error.message,
		});

	return { markResponded, isMarkingResponded: isPending };
};

export const useAssignDeal = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({ id, ownerUserId }: { id: string; ownerUserId: string | null }) => {
			const { data, error } = await deals({ id }).assign.post({ ownerUserId });
			if (error) throw new Error(errorMessage(error, "تعذّر الإسناد"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	});

	const assignDeal = (input: { id: string; ownerUserId: string | null }) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ الإسناد...",
			success: input.ownerUserId ? "أُسنِدت الصفقة" : "أُلغي الإسناد",
			error: (error: Error) => error.message,
		});

	return { assignDeal, isAssigning: isPending };
};

/** BR-C4.2 — النسبة لها مسارها لأن تعديلها يرفع علم التجاوز، وإعادتها تخفضه. */
export const useSetDealProbability = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({
			id,
			...body
		}: {
			id: string;
			probability?: number;
			reset?: boolean;
		}) => {
			const { data, error } = await deals({ id }).probability.post(body);
			if (error) throw new Error(errorMessage(error, "تعذّر تحديث نسبة النجاح"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	});

	const setProbability = (input: { id: string; probability?: number; reset?: boolean }) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ التحديث...",
			success: input.reset ? "أُعيدت النسبة إلى افتراضي المرحلة" : "حُدِّثت نسبة النجاح",
			error: (error: Error) => error.message,
		});

	return { setProbability, isSettingProbability: isPending };
};

/** §6 — المحرّر يحفظ القائمة كاملة؛ الخادم يشتقّ القيمة منها (BR-C6.1). */
export const useSaveDealProducts = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({ id, ...body }: DealProductsFormInput & { id: string }) => {
			const { data, error } = await deals({ id }).products.put(body);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ البنود"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	});

	const saveProducts = (input: DealProductsFormInput & { id: string }) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ حفظ البنود...",
			success: "حُفظت البنود",
			error: (error: Error) => error.message,
		});

	return { saveProducts, isSavingProducts: isPending };
};

/** §7 — الفوز. النجاح قد يحمل دعوة عضوية، وهي بيانات تعرضها الشاشة لا فعلٌ تلقائي. */
export const useWinDeal = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({
			id,
			...body
		}: {
			id: string;
			statusId: string;
			ownerId?: string;
		}) => {
			const { data, error } = await deals({ id }).win.post(body);
			if (error) throw new Error(errorMessage(error, "تعذّر كسب الصفقة"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	});

	return { winDeal: mutateAsync, isWinning: isPending };
};

/** §5 — معاينة التحويل: اللقطة المقترحة ومرشّح وليّ الأمر (BR-C5.3)، قبل فتح النافذة. */
export const useConversionPreview = (leadId: string | null, enabled: boolean) => {
	const { data, isLoading } = useQuery({
		queryKey: ["crm", "leads", "convert-preview", leadId],
		enabled: !!leadId && enabled,
		queryFn: async () => {
			const { data, error } = await api.crm
				.leads({ id: leadId as string })
				["convert-preview"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل بيانات التحويل"));
			return data;
		},
	});
	return { preview: data ?? null, isLoading };
};

export const useConvertLead = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({ leadId, ...body }: { leadId: string } & Record<string, unknown>) => {
			const { data, error } = await api.crm
				.leads({ id: leadId })
				// biome-ignore lint/suspicious/noExplicitAny: Treaty body type is the §5 modal shape
				.convert.post(body as any);
			if (error) throw new Error(errorMessage(error, "تعذّر تحويل العميل المحتمل"));
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});

	return { convertLead: mutateAsync, isConverting: isPending };
};
