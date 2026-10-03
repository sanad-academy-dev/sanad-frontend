import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CrmSlaPolicyFormInput,
	CrmSlaPolicyResponse,
} from "@/server/crm/crm-sla/crm-sla.type";

/** [CRM-P5] §10.1 — سياسات الاستجابة. */

const POLICIES_KEY = ["crm", "sla", "policies"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useCrmSlaPolicies = (includeInactive = false) => {
	const { data, isLoading } = useQuery<CrmSlaPolicyResponse[]>({
		queryKey: [...POLICIES_KEY, includeInactive],
		queryFn: async () => {
			const { data, error } = await api.crm["sla-policies"].get({
				query: { includeInactive: includeInactive ? "true" : "false" },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل سياسات الاستجابة"));
			return data as CrmSlaPolicyResponse[];
		},
	});
	return { policies: data ?? [], isLoading };
};

export const useCrmSlaPolicyActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: POLICIES_KEY });

	const createMutation = useMutation({
		mutationFn: async (input: CrmSlaPolicyFormInput) => {
			const { data, error } = await api.crm["sla-policies"].post(input);
			if (error) throw new Error(errorMessage(error, "تعذّرت إضافة السياسة"));
			return data;
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({ id, ...input }: CrmSlaPolicyFormInput & { id: string }) => {
			const { data, error } = await api.crm["sla-policies"]({ id }).patch(input);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل السياسة"));
			return data;
		},
		onSuccess: invalidate,
	});

	const removeMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.crm["sla-policies"]({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف السياسة"));
			return data;
		},
		onSuccess: invalidate,
	});

	const createPolicy = (input: CrmSlaPolicyFormInput) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "أُضيفت السياسة",
			error: (error: Error) => error.message,
		});

	const updatePolicy = (input: CrmSlaPolicyFormInput & { id: string }) =>
		toast.promise(updateMutation.mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "حُدِّثت السياسة",
			error: (error: Error) => error.message,
		});

	const removePolicy = (id: string) =>
		toast.promise(removeMutation.mutateAsync(id), {
			loading: "جارٍ الحذف...",
			success: "حُذفت السياسة",
			error: (error: Error) => error.message,
		});

	return {
		createPolicy,
		updatePolicy,
		removePolicy,
		isSaving: createMutation.isPending || updateMutation.isPending,
	};
};
