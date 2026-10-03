import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CrmSavedViewFormInput,
	CrmSavedViewResponse,
} from "@/server/crm/crm-sla/crm-sla.type";

/**
 * [CRM-P6] §11.3 — العروض المحفوظة.
 *
 * المسارات الأربعة شُحنت في [CRM-P5.5] بلا مستهلك، تمامًا كما حدث لمساري الإسناد
 * (§17.2 صفّ ٢٦). هذه الخطّافات وقائمة `SavedViewsMenu` هي نصفها العميل.
 */

const VIEWS_KEY = ["crm", "saved-views"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useCrmSavedViews = (entity: "LEAD" | "DEAL") => {
	const { data, isLoading } = useQuery<CrmSavedViewResponse[]>({
		queryKey: [...VIEWS_KEY, entity],
		queryFn: async () => {
			const { data, error } = await api.crm.views.get({ query: { entity } });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل العروض المحفوظة"));
			return data as CrmSavedViewResponse[];
		},
	});
	return { views: data ?? [], isLoading };
};

export const useCrmSavedViewActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: VIEWS_KEY });

	const createMutation = useMutation({
		mutationFn: async (input: CrmSavedViewFormInput) => {
			const { data, error } = await api.crm.views.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ العرض"));
			return data;
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({ id, ...input }: CrmSavedViewFormInput & { id: string }) => {
			const { data, error } = await api.crm.views({ id }).patch(input);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل العرض"));
			return data;
		},
		onSuccess: invalidate,
	});

	const removeMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.crm.views({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف العرض"));
			return data;
		},
		onSuccess: invalidate,
	});

	const saveView = (input: CrmSavedViewFormInput) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "حُفظ العرض",
			// رسالة الخادم هي الرسالة: رفض النشر (§17.2 صفّ ٢٣) يقول ما ينقص بالضبط
			error: (error: Error) => error.message,
		});

	const updateView = (input: CrmSavedViewFormInput & { id: string }) =>
		toast.promise(updateMutation.mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "حُدِّث العرض",
			error: (error: Error) => error.message,
		});

	const removeView = (id: string) =>
		toast.promise(removeMutation.mutateAsync(id), {
			loading: "جارٍ الحذف...",
			success: "حُذف العرض",
			error: (error: Error) => error.message,
		});

	return {
		saveView,
		updateView,
		removeView,
		isSaving: createMutation.isPending || updateMutation.isPending,
	};
};
