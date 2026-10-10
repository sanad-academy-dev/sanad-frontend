import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { AppointmentStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

export const useUpdateAppointmentStatus = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
			const res = await api.appointments({ id }).status.patch({ status });
			if (res.error) {
				const data = res.error.value as { message?: string } | undefined;
				throw new Error(data?.message ?? "تعذّر تحديث حالة الزيارة");
			}
			return res.data;
		},
		onSuccess: (_data, variables) => {
			void queryClient.invalidateQueries({ queryKey: ["appointments"] });
			void queryClient.invalidateQueries({ queryKey: ["appointment", variables.id] });
			void queryClient.invalidateQueries({
				queryKey: ["appointment-activity", variables.id],
			});
		},
		// عند رفض الخادم (انتقال غير مسموح / فاتورة غير مسدّدة) نعيد جلب القائمة
		// حتى ترجع البطاقة المنقولة تفاؤليًا في اللوحة إلى عمودها الصحيح
		onError: (_err, variables) => {
			void queryClient.invalidateQueries({ queryKey: ["appointments"] });
			void queryClient.invalidateQueries({ queryKey: ["appointment", variables.id] });
		},
	});

	const updateStatus = async (input: { id: string; status: AppointmentStatus }) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ تحديث الحالة...",
			success: "تم تحديث الحالة",
			error: (err: Error) => err.message || "فشل تحديث الحالة",
		});

	return { updateStatus, isPending: mutation.isPending };
};
