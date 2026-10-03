import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ChecklistItemResponse, SopDomain } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { SopRunResponse, SopRunTarget } from "@/server/sops/sops.type";

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

/** الهدف كاستعلام — عمود واحد فقط يُملأ */
const targetQuery = (target: SopRunTarget) => ({
	labItemId: "labItemId" in target ? target.labItemId : undefined,
	radiologyItemId: "radiologyItemId" in target ? target.radiologyItemId : undefined,
	operationCaseId: "operationCaseId" in target ? target.operationCaseId : undefined,
});

/** مفتاح ثابت للهدف — يُبقي ذاكرة الاستعلام مستقرة بين إعادات الرسم */
const targetKey = (target: SopRunTarget) => Object.values(targetQuery(target)).join("|");

/**
 * التشغيل أو null — لا يُقبل كائن بلا steps. Eden Treaty يحوّل جسم الاستجابة
 * الفارغ إلى {}، وهو كائن صادق بلا خطوات، فيصير `run.steps.length` انهيارًا.
 * الخادم يغلّف الآن بـ { run }، وهذا الحارس شبكة أمان لكل مسارات الكتابة.
 */
const asRun = (value: unknown): SopRunResponse | null => {
	const run = value as SopRunResponse | null | undefined;
	return run && Array.isArray(run.steps) ? run : null;
};

/**
 * تشغيل البروتوكول على هدف. الاستعلام يقرأ التشغيل القائم فقط؛ الإنشاء يتم
 * بـ startRun عند فتح اللوحة أول مرة، فلا يُنشئ مجرّد العرض سجلًّا.
 */
export const useSopRun = (target: SopRunTarget, enabled = true) => {
	const { data, isLoading } = useQuery<SopRunResponse | null>({
		queryKey: ["sop-run", targetKey(target)],
		enabled,
		queryFn: async () => {
			const res = await api.sops.runs.get({ query: targetQuery(target) });
			if (res.error) throw new Error("فشل جلب تقدّم البروتوكول");
			return asRun((res.data as { run?: SopRunResponse | null } | null)?.run);
		},
	});

	return { run: data ?? null, isLoading };
};

/** بدء التشغيل — مُتماثل الاستدعاء، يعيد التشغيل القائم إن وُجد */
export const useStartSopRun = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: {
			domain: SopDomain;
			serviceId: string;
			target: SopRunTarget;
		}) => {
			const res = await api.sops.runs.post({
				domain: input.domain,
				serviceId: input.serviceId,
				...targetQuery(input.target),
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر بدء البروتوكول"));
			return res.data as SopRunResponse;
		},
		onSuccess: (data, variables) => {
			queryClient.setQueryData(["sop-run", targetKey(variables.target)], asRun(data));
		},
	});

	return { startRun: mutation.mutateAsync, isPending: mutation.isPending };
};

/** استجابة خطوة — التشغيل المكتمل مصون فلا يقبل تعديلًا */
export const useRespondSopStep = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: {
			runId: string;
			stepId: string;
			target: SopRunTarget;
			response: ChecklistItemResponse | null;
			valueText?: string | null;
			valueNumber?: number | null;
		}) => {
			const res = await api.sops
				.runs({ runId: input.runId })
				.steps({ stepId: input.stepId })
				.post({
					response: input.response,
					valueText: input.valueText ?? null,
					valueNumber: input.valueNumber ?? null,
				});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ الخطوة"));
			return res.data as SopRunResponse;
		},
		onSuccess: (data, variables) => {
			queryClient.setQueryData(["sop-run", targetKey(variables.target)], asRun(data));
		},
		onError: (error: Error) => {
			// الخطوة وحدها لا تستحق toast.promise — الخطأ فقط يستحق الإظهار
			toast.error(error.message || "تعذّر حفظ الخطوة");
		},
	});

	return { respondStep: mutation.mutateAsync, isPending: mutation.isPending };
};

/** إقفال التشغيل — كل خطوة إلزامية يجب أن تحمل استجابة */
export const useCompleteSopRun = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: { runId: string; target: SopRunTarget }) => {
			const res = await api.sops.runs({ runId: input.runId }).complete.post();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إقفال البروتوكول"));
			return res.data as SopRunResponse;
		},
		onSuccess: (data, variables) => {
			queryClient.setQueryData(["sop-run", targetKey(variables.target)], asRun(data));
		},
	});

	const completeRun = (input: { runId: string; target: SopRunTarget }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الإقفال...",
			success: "أُقفل البروتوكول",
			error: (err: Error) => err.message || "فشل إقفال البروتوكول",
		});
		return p;
	};

	return { completeRun, isPending: mutation.isPending };
};
