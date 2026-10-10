import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	RadiologyAddendumResponse,
	RadiologyPriorExamResponse,
	RadiologyTatMetrics,
	RadiologyTemplateFormValues,
	RadiologyTemplateResponse,
} from "@/server/radiology/radiology.type";

// خطّافات الإضافات: قوالب التقارير، ملاحق التقرير، الدراسات السابقة،
// ومؤشّرات زمن الإنجاز. كلها تقرأ من /api/radiology.

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

// ── قوالب التقارير ─────────────────────────────────────────────────────────

/** القوالب المطابقة لفحص بعينه (قوالبه ثم قوالب طريقة تصويره) */
export const useRadiologyTemplatesFor = (params: {
	serviceId?: string | null;
	modality?: string | null;
	enabled?: boolean;
}) => {
	const { data, isLoading } = useQuery({
		queryKey: ["radiology-report-templates", params.serviceId, params.modality],
		enabled: params.enabled !== false && !!(params.serviceId || params.modality),
		staleTime: 1000 * 60 * 5,
		queryFn: async (): Promise<RadiologyTemplateResponse[]> => {
			const res = await api.radiology.templates.get({
				query: {
					serviceId: params.serviceId ?? undefined,
					modality: params.modality ?? undefined,
				},
			});
			if (res.error) throw new Error("تعذّر تحميل قوالب التقارير");
			return res.data;
		},
	});
	return { templates: data ?? [], isLoading };
};

/** كل قوالب الأكاديمية — شاشة الإعدادات */
export const useAllRadiologyTemplates = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["radiology-report-templates", "all"],
		staleTime: 1000 * 60,
		queryFn: async (): Promise<RadiologyTemplateResponse[]> => {
			const res = await api.radiology.templates.get({ query: { all: "1" } });
			if (res.error) throw new Error("تعذّر تحميل القوالب");
			return res.data;
		},
	});
	return { templates: data ?? [], isLoading };
};

export const useRadiologyTemplateMutations = () => {
	const queryClient = useQueryClient();
	const invalidate = () =>
		void queryClient.invalidateQueries({ queryKey: ["radiology-report-templates"] });

	const createM = useMutation({
		mutationFn: async (input: RadiologyTemplateFormValues) => {
			const res = await api.radiology.templates.post(input);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ القالب"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const updateM = useMutation({
		mutationFn: async ({ id, ...input }: RadiologyTemplateFormValues & { id: string }) => {
			const res = await api.radiology.templates({ templateId: id }).put(input);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تعديل القالب"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const deleteM = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.radiology.templates({ templateId: id }).delete();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حذف القالب"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const saveTemplate = (input: RadiologyTemplateFormValues & { id?: string }) => {
		const p = input.id
			? updateM.mutateAsync({ ...input, id: input.id })
			: createM.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: input.id ? "تم تعديل القالب" : "تمت إضافة القالب",
			error: (err: Error) => err.message || "فشل حفظ القالب",
		});
		return p;
	};

	const removeTemplate = (id: string) => {
		const p = deleteM.mutateAsync(id);
		toast.promise(p, {
			loading: "جارٍ الحذف...",
			success: "حُذف القالب",
			error: (err: Error) => err.message || "فشل الحذف",
		});
		return p;
	};

	return {
		saveTemplate,
		removeTemplate,
		isPending: createM.isPending || updateM.isPending || deleteM.isPending,
	};
};

// ── ملاحق التقرير ──────────────────────────────────────────────────────────

export const useRadiologyAddenda = (itemId: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: ["radiology-addenda", itemId],
		enabled: !!itemId,
		queryFn: async (): Promise<RadiologyAddendumResponse[]> => {
			const res = await api.radiology.items({ itemId: itemId as string }).addenda.get();
			if (res.error) throw new Error("تعذّر تحميل ملاحق التقرير");
			return res.data;
		},
	});
	return { addenda: data ?? [], isLoading };
};

export const useAddRadiologyAddendum = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			text,
			mentionedStaffIds,
			attachments,
		}: {
			itemId: string;
			text: string;
			mentionedStaffIds?: string[];
			attachments?: {
				fileKey: string;
				fileName: string;
				mimeType: string | null;
				sizeBytes: number | null;
			}[];
		}) => {
			const res = await api.radiology.items({ itemId }).addenda.post({
				text,
				mentionedStaffIds: mentionedStaffIds ?? [],
				attachments: attachments ?? [],
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إضافة الملحق"));
			return res.data;
		},
		onSuccess: (d, v) => {
			void queryClient.invalidateQueries({ queryKey: ["radiology"] });
			void queryClient.invalidateQueries({ queryKey: ["radiology-addenda", v.itemId] });
			if (d?.id) void queryClient.invalidateQueries({ queryKey: ["radiology-order", d.id] });
		},
	});

	const addAddendum = (input: {
		itemId: string;
		text: string;
		mentionedStaffIds?: string[];
		attachments?: {
			fileKey: string;
			fileName: string;
			mimeType: string | null;
			sizeBytes: number | null;
		}[];
	}) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الإضافة...",
			success: "أُضيف الملحق إلى التقرير",
			error: (err: Error) => err.message || "فشل إضافة الملحق",
		});
		return p;
	};

	return { addAddendum, isPending: mutation.isPending };
};

// ── الدراسات السابقة ───────────────────────────────────────────────────────

export const useRadiologyPriors = (itemId: string | null, enabled = true) => {
	const { data, isLoading } = useQuery({
		queryKey: ["radiology-priors", itemId],
		enabled: enabled && !!itemId,
		staleTime: 1000 * 60,
		queryFn: async (): Promise<RadiologyPriorExamResponse[]> => {
			const res = await api.radiology.items({ itemId: itemId as string }).priors.get();
			if (res.error) throw new Error("تعذّر تحميل الدراسات السابقة");
			return res.data;
		},
	});
	return { priors: data ?? [], isLoading };
};

// ── مؤشّرات زمن الإنجاز ────────────────────────────────────────────────────

export const useRadiologyMetrics = (enabled = true) => {
	const { data, isLoading } = useQuery({
		queryKey: ["radiology-metrics"],
		enabled,
		staleTime: 1000 * 60,
		queryFn: async (): Promise<RadiologyTatMetrics> => {
			const res = await api.radiology.metrics.get();
			if (res.error) throw new Error("تعذّر تحميل المؤشّرات");
			return res.data as RadiologyTatMetrics;
		},
	});
	return { metrics: data ?? null, isLoading };
};
