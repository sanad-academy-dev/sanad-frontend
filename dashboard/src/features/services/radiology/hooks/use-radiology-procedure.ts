import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type {
	RadiologyAcquisitionFormValues,
	RadiologyImageQcFormValues,
	RadiologyPrepFormValues,
	RadiologySafetyFormValues,
} from "@/server/radiology/radiology-procedure.type";

// حفظ خطوات التحضير والتصوير — كل خطوة تحفظ حقولها تدريجيًا (upsert على الخادم)

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

const useInvalidateRadiology = () => {
	const queryClient = useQueryClient();
	return (id?: string) => {
		void queryClient.invalidateQueries({ queryKey: ["radiology"] });
		if (id) void queryClient.invalidateQueries({ queryKey: ["radiology-order", id] });
	};
};

/** ① فحص السلامة — على مستوى الطلب (خاص بالطفل لا بالفحص) */
export const useSaveRadiologySafety = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({
			orderId,
			...input
		}: RadiologySafetyFormValues & { orderId: string }) => {
			const res = await api.radiology({ id: orderId }).safety.patch({
				fastingStatus: input.fastingStatus ?? null,
				fastingHours: input.fastingHours ?? null,
				medications: input.medications ?? [],
				pregnancyPossible: input.pregnancyPossible ?? null,
				metalImplants: input.metalImplants ?? null,
				implantNotes: input.implantNotes ?? null,
				priorContrastReaction: input.priorContrastReaction ?? null,
				allergies: input.allergies ?? null,
				asaClass: input.asaClass ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ فحص السلامة"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const saveSafety = (input: RadiologySafetyFormValues & { orderId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ فحص السلامة",
			error: (err: Error) => err.message || "فشل حفظ فحص السلامة",
		});
		return p;
	};

	return { saveSafety, isPending: mutation.isPending };
};

/** ② تجهيز الطفل — الوضعية والتهدئة (على مستوى الفحص) */
export const useSaveRadiologyPrep = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({ itemId, ...input }: RadiologyPrepFormValues & { itemId: string }) => {
			const res = await api.radiology.items({ itemId }).prep.patch({
				positioning: input.positioning ?? null,
				sedationUsed: input.sedationUsed ?? null,
				sedationAgent: input.sedationAgent ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ التجهيز"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const savePrep = (input: RadiologyPrepFormValues & { itemId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ تجهيز الطفل",
			error: (err: Error) => err.message || "فشل حفظ التجهيز",
		});
		return p;
	};

	return { savePrep, isPending: mutation.isPending };
};

/** ⑤ الالتقاط — الإسقاطات ومعاملات التعريض والجرعة والتباين */
export const useSaveRadiologyAcquisition = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			...input
		}: RadiologyAcquisitionFormValues & { itemId: string }) => {
			const res = await api.radiology.items({ itemId }).acquisition.patch({
				performedById: input.performedById ?? null,
				viewsPerformed: input.viewsPerformed ?? [],
				exposuresCount: input.exposuresCount ?? null,
				retakeCount: input.retakeCount ?? null,
				kvp: input.kvp ?? null,
				mas: input.mas ?? null,
				doseDap: input.doseDap ?? null,
				ctdiVol: input.ctdiVol ?? null,
				dlp: input.dlp ?? null,
				contrastUsed: input.contrastUsed ?? null,
				contrastAgent: input.contrastAgent ?? null,
				contrastRoute: input.contrastRoute ?? null,
				contrastVolumeMl: input.contrastVolumeMl ?? null,
				contrastLot: input.contrastLot ?? null,
				executionNotes: input.executionNotes ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ بيانات الالتقاط"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const saveAcquisition = (input: RadiologyAcquisitionFormValues & { itemId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ بيانات الالتقاط",
			error: (err: Error) => err.message || "فشل حفظ بيانات الالتقاط",
		});
		return p;
	};

	return { saveAcquisition, isPending: mutation.isPending };
};

/** ⑦ فحص جودة الصور */
export const useSaveRadiologyImageQc = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			...input
		}: RadiologyImageQcFormValues & { itemId: string }) => {
			const res = await api.radiology.items({ itemId })["image-qc"].patch({
				imageQuality: input.imageQuality,
				qcNotes: input.qcNotes ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ تقييم الجودة"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const saveImageQc = (input: RadiologyImageQcFormValues & { itemId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ تقييم جودة الصور",
			error: (err: Error) => err.message || "فشل حفظ تقييم الجودة",
		});
		return p;
	};

	return { saveImageQc, isPending: mutation.isPending };
};
