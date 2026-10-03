import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { vitalSignsKeys } from "@/features/services/vital-signs/hooks/use-vital-signs";
import { api } from "@/lib/api";
import type {
	CreateVitalSignsFormValues,
	VitalsAttachTarget,
} from "@/server/vital-signs/vital-signs.type";

type MutationError = { message?: string; details?: unknown };

const messageOf = (error: unknown, fallback: string) => {
	const e = error as MutationError;
	if (typeof e?.details === "string" && e.details) return e.details;
	return e?.message || fallback;
};

/** الحقول القياسية فقط — recordedAt يُرسل كنص ISO، والباقي أرقام أو null */
const toBody = (values: CreateVitalSignsFormValues) => ({
	patientId: values.patientId,
	recordedAt: values.recordedAt ? new Date(values.recordedAt).toISOString() : undefined,
	branchId: values.branchId ?? null,
	weight: values.weight ?? null,
	temperature: values.temperature ?? null,
	heartRate: values.heartRate ?? null,
	respiratoryRate: values.respiratoryRate ?? null,
	oxygenSaturation: values.oxygenSaturation ?? null,
	bloodPressure: values.bloodPressure ?? null,
	painScore: values.painScore ?? null,
	bodyConditionScore: values.bodyConditionScore ?? null,
	capillaryRefillSec: values.capillaryRefillSec ?? null,
	mucousMembrane: values.mucousMembrane ?? null,
	notes: values.notes ?? null,
});

export const useCreateVitalSigns = (patientId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: {
			values: CreateVitalSignsFormValues;
			attachTo?: VitalsAttachTarget;
		}) => {
			const res = await api["vital-signs"].post({
				...toBody(input.values),
				attachTo: input.attachTo,
			});
			if (res.error) throw new Error(messageOf(res.error.value, "تعذّر حفظ القياس"));
			return res.data;
		},
		onSuccess: () => invalidate(queryClient, patientId),
	});

	// نحتفظ بالوعد ونعيده — المتصل يحتاج السجل الناتج ليربطه أو يعرضه
	const createVitalSigns = (
		values: CreateVitalSignsFormValues,
		attachTo?: VitalsAttachTarget,
	) => {
		const p = mutation.mutateAsync({ values, attachTo });
		toast.promise(p, {
			loading: "جارٍ حفظ القياس...",
			success: "تم حفظ القياس",
			error: (e: Error) => e.message || "فشل حفظ القياس",
		});
		return p;
	};

	return { createVitalSigns, isPending: mutation.isPending };
};

export const useUpdateVitalSigns = (patientId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: { id: string; values: CreateVitalSignsFormValues }) => {
			const { patientId: _ignored, ...body } = toBody(input.values);
			const res = await api["vital-signs"]({ id: input.id }).patch(body);
			if (res.error) throw new Error(messageOf(res.error.value, "تعذّر تعديل القياس"));
			return res.data;
		},
		onSuccess: () => invalidate(queryClient, patientId),
	});

	/**
	 * الخادم يقرّر: القياس غير المرتبط يُعدَّل في مكانه، والمرتبط يُنشأ له تصحيح.
	 * الرسالة تُبيّن أيّ الأمرين وقع حتى لا يظن المستخدم أنه غيّر مستندًا قديمًا.
	 */
	const updateVitalSigns = (id: string, values: CreateVitalSignsFormValues) => {
		const p = mutation.mutateAsync({ id, values });
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: (record) =>
				record?.correctsId
					? "تم إنشاء سجل تصحيح — القياس الأصلي بقي كما هو"
					: "تم حفظ التعديل",
			error: (e: Error) => e.message || "فشل التعديل",
		});
		return p;
	};

	return { updateVitalSigns, isPending: mutation.isPending };
};

export const useDeleteVitalSigns = (patientId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api["vital-signs"]({ id }).delete();
			if (res.error) throw new Error(messageOf(res.error.value, "تعذّر حذف القياس"));
			return res.data;
		},
		onSuccess: () => invalidate(queryClient, patientId),
	});

	const deleteVitalSigns = (id: string) => {
		const p = mutation.mutateAsync(id);
		toast.promise(p, {
			loading: "جارٍ الحذف...",
			success: "تم حذف القياس",
			error: (e: Error) => e.message || "فشل الحذف",
		});
		return p;
	};

	return { deleteVitalSigns, isPending: mutation.isPending };
};

/** ربط قياس قائم بمستند — «استخدام هذا القياس» و«اختيار من السجل» */
export const useAttachVitalSigns = (patientId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: { id: string; target: VitalsAttachTarget }) => {
			const res = await api["vital-signs"]({ id: input.id }).attach.post({
				target: input.target,
			});
			if (res.error) throw new Error(messageOf(res.error.value, "تعذّر ربط القياس"));
			return res.data;
		},
		onSuccess: () => invalidate(queryClient, patientId),
	});

	const attachVitalSigns = (id: string, target: VitalsAttachTarget) => {
		const p = mutation.mutateAsync({ id, target });
		toast.promise(p, {
			loading: "جارٍ الربط...",
			success: "تم ربط القياس",
			error: (e: Error) => e.message || "فشل الربط",
		});
		return p;
	};

	return { attachVitalSigns, isPending: mutation.isPending };
};

// كل كتابة تمسّ سجل الطفل وآخر قياس له، إضافةً إلى المستند الذي رُبط به
function invalidate(queryClient: ReturnType<typeof useQueryClient>, patientId: string) {
	void queryClient.invalidateQueries({ queryKey: vitalSignsKeys.patient(patientId) });
	void queryClient.invalidateQueries({ queryKey: vitalSignsKeys.latest(patientId) });
	void queryClient.invalidateQueries({ queryKey: ["patients"] });
	void queryClient.invalidateQueries({ queryKey: ["clinical-exam"] });
	void queryClient.invalidateQueries({ queryKey: ["lab-tests"] });
	void queryClient.invalidateQueries({ queryKey: ["radiology"] });
}
