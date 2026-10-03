import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	LabParameterFormValues,
	LabTestParameterResponse,
	LabTestTemplateResponse,
} from "@/server/lab-test-parameters/lab-test-parameters.type";

const EMPTY_TEMPLATES: LabTestTemplateResponse[] = [];
const EMPTY_PARAMS: LabTestParameterResponse[] = [];

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

/** كل قوالب التحاليل (دورات فئة "التحاليل" مع مُحلِّلاتها) */
export const useLabTemplates = () => {
	const { data, isLoading } = useQuery<LabTestTemplateResponse[]>({
		queryKey: ["lab-templates"],
		queryFn: async () => {
			const res = await api["lab-test-parameters"].templates.get();
			if (res.error) throw new Error("فشل جلب قوالب التحاليل");
			return res.data as LabTestTemplateResponse[];
		},
	});

	return { templates: data ?? EMPTY_TEMPLATES, isLoading };
};

/** مُحلِّلات تحليل معيّن — تُستخدم لتعبئة جدول إدخال النتائج */
export const useLabParameters = (serviceId: string | null) => {
	const { data, isLoading } = useQuery<LabTestParameterResponse[]>({
		queryKey: ["lab-parameters", serviceId],
		enabled: !!serviceId,
		queryFn: async () => {
			const res = await api["lab-test-parameters"]
				.service({
					serviceId: serviceId as string,
				})
				.get();
			if (res.error) throw new Error("فشل جلب مُحلِّلات التحليل");
			return res.data as LabTestParameterResponse[];
		},
	});

	return { parameters: data ?? EMPTY_PARAMS, isLoading };
};

export const useLabParameterMutations = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		void queryClient.invalidateQueries({ queryKey: ["lab-templates"] });
		void queryClient.invalidateQueries({ queryKey: ["lab-parameters"] });
	};

	const createMutation = useMutation({
		mutationFn: async (input: LabParameterFormValues & { serviceId: string }) => {
			const res = await api["lab-test-parameters"].post({
				serviceId: input.serviceId,
				name: input.name,
				unit: input.unit ?? null,
				type: input.type,
				refLow: input.refLow ?? null,
				refHigh: input.refHigh ?? null,
				order: input.order,
				active: input.active,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إضافة المُحلِّل"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({ id, ...input }: Partial<LabParameterFormValues> & { id: string }) => {
			const res = await api["lab-test-parameters"]({ id }).patch({
				name: input.name,
				unit: input.unit ?? null,
				type: input.type,
				refLow: input.refLow ?? null,
				refHigh: input.refHigh ?? null,
				order: input.order,
				active: input.active,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تعديل المُحلِّل"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api["lab-test-parameters"]({ id }).delete();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حذف المُحلِّل"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	// نعيد وعد الطفرة نفسه (لا نتيجة toast.promise) حتى ينتظره المستدعي فعلًا
	const createParameter = (input: LabParameterFormValues & { serviceId: string }) => {
		const p = createMutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الإضافة...",
			success: "تمت إضافة المُحلِّل",
			error: (err: Error) => err.message || "فشل إضافة المُحلِّل",
		});
		return p;
	};

	const updateParameter = (input: Partial<LabParameterFormValues> & { id: string }) => {
		const p = updateMutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ المُحلِّل",
			error: (err: Error) => err.message || "فشل حفظ المُحلِّل",
		});
		return p;
	};

	const deleteParameter = (id: string) => {
		const p = deleteMutation.mutateAsync(id);
		toast.promise(p, {
			loading: "جارٍ الحذف...",
			success: "تم حذف المُحلِّل",
			error: (err: Error) => err.message || "فشل حذف المُحلِّل",
		});
		return p;
	};

	return {
		createParameter,
		updateParameter,
		deleteParameter,
		isPending:
			createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
	};
};
