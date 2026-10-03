import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { CreateLabTestFormValues } from "@/server/lab-tests/lab-tests.type";

export const useCreateLabTest = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (
			input: CreateLabTestFormValues & { inpatientStayId?: string | null },
		) => {
			const res = await api["lab-tests"].post({
				branchId: input.branchId,
				patientId: input.patientId,
				ownerId: input.ownerId,
				serviceIds: input.serviceIds,
				appointmentId: input.appointmentId ?? null,
				inpatientStayId: input.inpatientStayId ?? null,
				assignedToId: input.assignedToId ?? null,
				requestedById: input.requestedById ?? null,
				priority: input.priority ?? null,
				isUrgent: input.isUrgent,
				notes: input.notes ?? null,
				origin: input.origin,
			});
			if (res.error) {
				const data = res.error.value as { message?: string } | undefined;
				throw new Error(data?.message ?? "تعذّر إنشاء طلب التحليل");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["lab-tests"] });
		},
	});

	// نعيد وعد الطفرة نفسه (لا نتيجة toast.promise) حتى ينتظره المستدعي فعلًا
	const createLabTest = (
		input: CreateLabTestFormValues & { inpatientStayId?: string | null },
	) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ إنشاء طلب التحليل...",
			success: "تم إنشاء طلب التحليل",
			error: (err: Error) => err.message || "فشل إنشاء طلب التحليل",
		});
		return p;
	};

	return { createLabTest, isPending: mutation.isPending };
};
