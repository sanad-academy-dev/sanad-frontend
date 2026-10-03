import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	AppointmentProductResponse,
	CreateAppointmentProductInput,
	UpdateAppointmentProductInput,
} from "@/server/appointments/appointments.type";

export const useAppointmentProducts = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery<AppointmentProductResponse[]>({
		queryKey: ["appointment-products", appointmentId],
		queryFn: async () => {
			const res = await api.appointments({ id: appointmentId }).products.get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الأصناف");
			}
			return (res.data as AppointmentProductResponse[]) ?? [];
		},
		enabled: !!appointmentId,
		staleTime: 30 * 1000,
	});

	const invalidate = () => {
		void queryClient.invalidateQueries({
			queryKey: ["appointment-products", appointmentId],
		});
		void queryClient.invalidateQueries({ queryKey: ["invoice", appointmentId] });
		void queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
	};

	const addMutation = useMutation({
		mutationFn: async (input: CreateAppointmentProductInput) => {
			const res = await api.appointments({ id: appointmentId }).products.post(input);
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إضافة الصنف");
			}
			return res.data;
		},
		onSuccess: invalidate,
	});

	const deleteMutation = useMutation({
		mutationFn: async (productRowId: string) => {
			const res = await api
				.appointments({ id: appointmentId })
				.products({ productRowId })
				.delete();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر حذف الصنف");
			}
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({
			productRowId,
			...input
		}: UpdateAppointmentProductInput & { productRowId: string }) => {
			const res = await api
				.appointments({ id: appointmentId })
				.products({ productRowId })
				.patch(input);
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر تحديث الصنف");
			}
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addProduct = (input: CreateAppointmentProductInput) =>
		toast.promise(addMutation.mutateAsync(input), {
			loading: "جارٍ الإضافة...",
			success: "تمت إضافة الصنف",
			error: (err: Error) => err.message || "فشل الإضافة",
		});

	const deleteProduct = (productRowId: string) =>
		toast.promise(deleteMutation.mutateAsync(productRowId), {
			loading: "جارٍ الحذف...",
			success: "تم حذف الصنف",
			error: (err: Error) => err.message || "فشل الحذف",
		});

	const updateProduct = (productRowId: string, input: UpdateAppointmentProductInput) =>
		toast.promise(updateMutation.mutateAsync({ productRowId, ...input }), {
			loading: "جارٍ الحفظ...",
			success: "تم تحديث الصنف",
			error: (err: Error) => err.message || "فشل الحفظ",
		});

	return {
		products: data ?? [],
		isLoading,
		addProduct,
		deleteProduct,
		updateProduct,
		isAdding: addMutation.isPending,
		isDeleting: deleteMutation.isPending,
		isUpdating: updateMutation.isPending,
	};
};
