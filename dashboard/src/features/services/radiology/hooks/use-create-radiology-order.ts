import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { CreateRadiologyOrderFormValues } from "@/server/radiology/radiology.type";

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

/** إنشاء طلب أشعة — المباشر يبدأ مجدولًا وطلب الزيارة يدخل الطلبات */
export const useCreateRadiologyOrder = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (
			input: CreateRadiologyOrderFormValues & { inpatientStayId?: string | null },
		) => {
			const res = await api.radiology.post({
				branchId: input.branchId,
				patientId: input.patientId,
				ownerId: input.ownerId,
				serviceIds: input.serviceIds,
				appointmentId: input.appointmentId || undefined,
				inpatientStayId: input.inpatientStayId || undefined,
				assignedToId: input.assignedToId || undefined,
				requestedById: input.requestedById || undefined,
				priority: input.priority ?? null,
				isUrgent: input.isUrgent,
				clinicalInfo: input.clinicalInfo,
				notes: input.notes || undefined,
				bodyPart: input.bodyPart ?? null,
				laterality: input.laterality ?? null,
				views: input.views,
				withContrast: input.withContrast ?? null,
				origin: input.origin,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إنشاء طلب الأشعة"));
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["radiology"] });
		},
	});

	const createOrder = (
		input: CreateRadiologyOrderFormValues & { inpatientStayId?: string | null },
	) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ إنشاء الطلب...",
			success: "تم إنشاء طلب الأشعة",
			error: (err: Error) => err.message || "فشل إنشاء الطلب",
		});
		return p;
	};

	return {
		createOrder,
		createOrderAsync: mutation.mutateAsync,
		isPending: mutation.isPending,
	};
};
