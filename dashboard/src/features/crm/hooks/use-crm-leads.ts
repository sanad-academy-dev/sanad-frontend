import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	ChangeLeadStatusFormInput,
	CreateLeadFormInput,
	CrmLeadDetailResponse,
	CrmLeadListResponse,
	CrmStatusLogResponse,
} from "@/server/crm/crm-leads/crm-leads.type";

/** [CRM-P1] Data hooks for leads (BRD §3, §11.2, §11.4). */

const QUERY_KEY = ["crm", "leads"] as const;
const leads = api.crm.leads;

/** Server messages are already Arabic (§0.2) — surface them rather than a generic string. */
const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export type CrmLeadFilters = {
	statusId?: string;
	sourceId?: string;
	ownerUserId?: string;
	search?: string;
	mine?: boolean;
};

export const useCrmLeads = (filters: CrmLeadFilters = {}) => {
	const { data, isLoading, refetch } = useQuery<CrmLeadListResponse[]>({
		// filters are part of the key: the server does the filtering (§11.2), so a changed
		// filter is a different resource, not a client-side slice of one cache entry.
		queryKey: [...QUERY_KEY, filters],
		queryFn: async () => {
			const { data, error } = await leads.get({ query: filters });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل العملاء المحتملين"));
			return data as CrmLeadListResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { leads: data ?? [], isLoading, refetch };
};

export const useCrmLead = (id: string | null) => {
	const { data, isLoading } = useQuery<CrmLeadDetailResponse>({
		queryKey: [...QUERY_KEY, "detail", id],
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await leads({ id: id as string }).get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل العميل المحتمل"));
			return data as CrmLeadDetailResponse;
		},
	});
	return { lead: data ?? null, isLoading };
};

export const useCrmLeadStatusLog = (id: string | null) => {
	const { data, isLoading } = useQuery<CrmStatusLogResponse[]>({
		queryKey: [...QUERY_KEY, "status-log", id],
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await leads({ id: id as string })["status-log"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل سجلّ الحالات"));
			return data as CrmStatusLogResponse[];
		},
	});
	return { statusLog: data ?? [], isLoading };
};

/**
 * [CRM-P6] §10.3 — «تم الرد» اليدويّ، وهو المسار الذي لم يستدعِه شيء.
 *
 * وُجد في [CRM-P5.3] بتعليقٍ يشرح ضرورته: «أكثر الردود في هذه الأكاديميات تقع خارج النظام —
 * مكالمة، أو رسالة من هاتف الموظّف». وبلا مستدعٍ كان أثرُه أنّ كلّ ردٍّ خارج النظام
 * يُسجَّل **خرقًا دائمًا**: أي أنّ أرقام §12 تخطئ منهجيًّا في الحالة عينها التي بُني
 * المسار لأجلها (§17.2 صفّ ٢٩).
 *
 * والتسجيل متعادل على الخادم (`markFirstResponse` يرشّح على `firstRespondedAt: null`)،
 * فضغطةٌ ثانية لا تحرّك الوقت المسجَّل أوّل مرّة.
 */
export const useMarkLeadResponded = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await leads({ id })["mark-responded"].post();
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

/**
 * [CRM-P6] BR-C3.2 — فحص التكرار **قبل** الحفظ.
 *
 * الرسالة بعد الإنشاء كانت تُسمّي المطابِق ولا تربطه، والقاعدة تقول «تحذير **مع ربط**
 * العميل المحتمل القائم». والمسار موجودٌ منذ CRM-P1 بلا مستدعٍ، فالنموذج الآن يسأله
 * أثناء الكتابة ويعرض رابطًا — فيرى موظّف الاستقبال المطابِق قبل أن يصنع نسخةً ثانية،
 * لا بعدها.
 */
export const useLeadDuplicateCheck = (mobile: string) => {
	const trimmed = mobile.trim();
	const { data } = useQuery({
		queryKey: [...QUERY_KEY, "duplicate-check", trimmed],
		// رقمٌ أقصر من ذلك يطابق نصف الأكاديمية، والسؤال عنه ضجيجٌ لا تحذير
		enabled: trimmed.length >= 6,
		queryFn: async () => {
			const { data, error } = await leads["duplicate-check"].get({
				query: { search: trimmed },
			});
			if (error) return null;
			return data;
		},
		staleTime: 1000 * 30,
	});
	return { duplicate: data ?? null };
};

export const useCreateLead = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: CreateLeadFormInput) => {
			const { data, error } = await leads.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء العميل المحتمل"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	});

	const createLead = (input: CreateLeadFormInput) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ إنشاء العميل المحتمل...",
			// BR-C3.2 — a duplicate mobile is a WARNING, not a refusal: the row is created and
			// the match is surfaced, because refusing pushes reception into faking the number.
			success: (result) =>
				result?.duplicateWarning
					? `أُنشئ العميل المحتمل — تنبيه: رقم مطابق لـ«${result.duplicateWarning.duplicateOf.fullName}»`
					: "أُنشئ العميل المحتمل",
			error: (error: Error) => error.message,
		});

	return { createLead, isCreating: isPending };
};

export const useChangeLeadStatus = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({ id, ...body }: ChangeLeadStatusFormInput & { id: string }) => {
			const { data, error } = await leads({ id }).status.post(body);
			if (error) throw new Error(errorMessage(error, "تعذّر تغيير الحالة"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	});

	return { changeStatus: mutateAsync, isChangingStatus: isPending };
};

export const useAssignLead = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({ id, ownerUserId }: { id: string; ownerUserId: string | null }) => {
			const { data, error } = await leads({ id }).assign.post({ ownerUserId });
			if (error) throw new Error(errorMessage(error, "تعذّر الإسناد"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
	});

	const assignLead = (input: { id: string; ownerUserId: string | null }) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ الإسناد...",
			success: input.ownerUserId ? "أُسنِد العميل المحتمل" : "أُلغي الإسناد",
			error: (error: Error) => error.message,
		});

	return { assignLead, isAssigning: isPending };
};
