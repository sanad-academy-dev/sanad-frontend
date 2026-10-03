import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CrmDealStatusFormInput,
	CrmDealStatusResponse,
	CrmFlatMasterFormInput,
	CrmIndustryResponse,
	CrmLeadSourceResponse,
	CrmLeadStatusFormInput,
	CrmLeadStatusResponse,
	CrmLostReasonResponse,
	CrmMasterKind,
} from "@/server/crm/crm-masters/crm-masters.type";

/**
 * [CRM-P1] The masters the lead screens read (§2). Statuses drive the kanban columns, so
 * they are ordered by `order` server-side — the pipeline is DATA, never an enum (§2).
 */

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

/** Masters change rarely; a longer stale time keeps drag-drop from refetching columns. */
const STALE = 1000 * 60 * 5;

export const useCrmLeadStatuses = (includeInactive = false) => {
	const { data, isLoading } = useQuery<CrmLeadStatusResponse[]>({
		queryKey: ["crm", "lead-statuses", includeInactive],
		queryFn: async () => {
			const { data, error } = await api.crm["lead-statuses"].get({
				query: { includeInactive },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل حالات العملاء المحتملين"));
			return data as CrmLeadStatusResponse[];
		},
		staleTime: STALE,
	});
	return { statuses: data ?? [], isLoading };
};

/** [CRM-P2] §2.1 — حالات الصفقة، ومعها `defaultProbability` الذي تبني عليه BR-C4.2. */
export const useCrmDealStatuses = (includeInactive = false) => {
	const { data, isLoading } = useQuery<CrmDealStatusResponse[]>({
		queryKey: ["crm", "deal-statuses", includeInactive],
		queryFn: async () => {
			const { data, error } = await api.crm["deal-statuses"].get({
				query: { includeInactive },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل حالات الصفقات"));
			return data as CrmDealStatusResponse[];
		},
		staleTime: STALE,
	});
	return { statuses: data ?? [], isLoading };
};

export const useCrmLeadSources = (includeInactive = false) => {
	const { data, isLoading } = useQuery<CrmLeadSourceResponse[]>({
		queryKey: ["crm", "lead-sources", includeInactive],
		queryFn: async () => {
			const { data, error } = await api.crm["lead-sources"].get({
				query: { includeInactive },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل مصادر العملاء المحتملين"));
			return data as CrmLeadSourceResponse[];
		},
		staleTime: STALE,
	});
	return { sources: data ?? [], isLoading };
};

export const useCrmLostReasons = (includeInactive = false) => {
	const { data, isLoading } = useQuery<CrmLostReasonResponse[]>({
		queryKey: ["crm", "lost-reasons", includeInactive],
		queryFn: async () => {
			const { data, error } = await api.crm["lost-reasons"].get({
				query: { includeInactive },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل أسباب الفقد"));
			return data as CrmLostReasonResponse[];
		},
		staleTime: STALE,
	});
	return { lostReasons: data ?? [], isLoading };
};

/** [CRM-P6] §2.2 — القطاعات: نوعٌ اختياري لم يكن له مستهلكٌ قبل شاشة الإعدادات. */
export const useCrmIndustries = (includeInactive = false) => {
	const { data, isLoading } = useQuery<CrmIndustryResponse[]>({
		queryKey: ["crm", "industries", includeInactive],
		queryFn: async () => {
			const { data, error } = await api.crm.industries.get({
				query: { includeInactive },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل القطاعات"));
			return data as CrmIndustryResponse[];
		},
		staleTime: STALE,
	});
	return { industries: data ?? [], isLoading };
};

/**
 * [CRM-P6] الكتابة على الأنواع الخمسة (§2).
 *
 * المسودّة **اتحادٌ مميَّز بالنوع**، لا شكلٌ واحد فضفاض: كلّ فرعٍ في `switch` يستدعي عقدة
 * Treaty حقيقية بجسمها المطابق، فلا يوجد `as` واحد على حدود الشبكة هنا. فهرسةُ
 * `api.crm[kind]` بمفتاحٍ اتحاديّ كانت ستُنتج اتحاد عُقَدٍ لا يُستدعى، وتُصلَح بقالبٍ
 * يُبطِل بالضبط التحققَ الذي نبني عليه.
 */
export type CrmMasterDraft =
	| { kind: "lead-statuses"; values: CrmLeadStatusFormInput }
	| { kind: "deal-statuses"; values: CrmDealStatusFormInput }
	| { kind: "lead-sources" | "lost-reasons" | "industries"; values: CrmFlatMasterFormInput };

const postMaster = (draft: CrmMasterDraft) => {
	switch (draft.kind) {
		case "lead-statuses":
			return api.crm["lead-statuses"].post(draft.values);
		case "deal-statuses":
			return api.crm["deal-statuses"].post(draft.values);
		case "lead-sources":
			return api.crm["lead-sources"].post(draft.values);
		case "lost-reasons":
			return api.crm["lost-reasons"].post(draft.values);
		default:
			return api.crm.industries.post(draft.values);
	}
};

const patchMaster = (id: string, draft: CrmMasterDraft) => {
	switch (draft.kind) {
		case "lead-statuses":
			return api.crm["lead-statuses"]({ id }).patch(draft.values);
		case "deal-statuses":
			return api.crm["deal-statuses"]({ id }).patch(draft.values);
		case "lead-sources":
			return api.crm["lead-sources"]({ id }).patch(draft.values);
		case "lost-reasons":
			return api.crm["lost-reasons"]({ id }).patch(draft.values);
		default:
			return api.crm.industries({ id }).patch(draft.values);
	}
};

const deleteMaster = (id: string, kind: CrmMasterKind) => {
	switch (kind) {
		case "lead-statuses":
			return api.crm["lead-statuses"]({ id }).delete();
		case "deal-statuses":
			return api.crm["deal-statuses"]({ id }).delete();
		case "lead-sources":
			return api.crm["lead-sources"]({ id }).delete();
		case "lost-reasons":
			return api.crm["lost-reasons"]({ id }).delete();
		default:
			return api.crm.industries({ id }).delete();
	}
};

export const useCrmMasterActions = () => {
	const queryClient = useQueryClient();
	// المفتاح بادئةٌ بلا `includeInactive`، فيُبطِل النسختين — المعروضة والمخفيّة — معًا
	const invalidate = (kind: CrmMasterKind) =>
		queryClient.invalidateQueries({ queryKey: ["crm", kind] });

	const createMutation = useMutation({
		mutationFn: async (draft: CrmMasterDraft) => {
			const { data, error } = await postMaster(draft);
			if (error) throw new Error(errorMessage(error, "تعذّرت الإضافة"));
			return data;
		},
		onSuccess: (_data, draft) => invalidate(draft.kind),
	});

	const updateMutation = useMutation({
		mutationFn: async ({ id, draft }: { id: string; draft: CrmMasterDraft }) => {
			const { data, error } = await patchMaster(id, draft);
			if (error) throw new Error(errorMessage(error, "تعذّر التعديل"));
			return data;
		},
		onSuccess: (_data, variables) => invalidate(variables.draft.kind),
	});

	const removeMutation = useMutation({
		mutationFn: async ({ id, kind }: { id: string; kind: CrmMasterKind }) => {
			const { data, error } = await deleteMaster(id, kind);
			// الرفض هنا قاعدةُ عملٍ غالبًا (BR-C2.1.2، أو صفٌّ مستعمَل) — فرسالة الخادم هي
			// الرسالة، والافتراضيّة لا تُستعمل إلا حين لا يصل شيء
			if (error) throw new Error(errorMessage(error, "تعذّر الحذف"));
			return data;
		},
		onSuccess: (_data, variables) => invalidate(variables.kind),
	});

	const createMaster = (draft: CrmMasterDraft) =>
		toast.promise(createMutation.mutateAsync(draft), {
			loading: "جارٍ الحفظ...",
			success: "تمت الإضافة",
			error: (error: Error) => error.message,
		});

	const updateMaster = (id: string, draft: CrmMasterDraft) =>
		toast.promise(updateMutation.mutateAsync({ id, draft }), {
			loading: "جارٍ الحفظ...",
			success: "تم الحفظ",
			error: (error: Error) => error.message,
		});

	const removeMaster = (id: string, kind: CrmMasterKind) =>
		toast.promise(removeMutation.mutateAsync({ id, kind }), {
			loading: "جارٍ الحذف...",
			success: "تم الحذف",
			error: (error: Error) => error.message,
		});

	return {
		createMaster,
		updateMaster,
		removeMaster,
		isSaving: createMutation.isPending || updateMutation.isPending,
	};
};
