import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	AppointmentServiceResponse,
	CreateAppointmentServiceInput,
	UpdateAppointmentServiceInput,
} from "@/server/appointments/appointments.type";

export const useAppointmentServices = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery<AppointmentServiceResponse[]>({
		queryKey: ["appointment-services", appointmentId],
		queryFn: async () => {
			const res = await api.appointments({ id: appointmentId }).services.get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الدورات");
			}
			return (res.data as AppointmentServiceResponse[]) ?? [];
		},
		enabled: !!appointmentId,
		staleTime: 30 * 1000,
	});

	const invalidate = () => {
		void queryClient.invalidateQueries({
			queryKey: ["appointment-services", appointmentId],
		});
		void queryClient.invalidateQueries({ queryKey: ["invoice", appointmentId] });
		void queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
	};

	const addMutation = useMutation({
		mutationFn: async (input: CreateAppointmentServiceInput) => {
			const res = await api.appointments({ id: appointmentId }).services.post(input);
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إضافة الدورة");
			}
			return res.data;
		},
		onSuccess: invalidate,
	});

	const deleteMutation = useMutation({
		mutationFn: async (serviceRowId: string) => {
			const res = await api
				.appointments({ id: appointmentId })
				.services({ serviceRowId })
				.delete();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر حذف الدورة");
			}
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({
			serviceRowId,
			...input
		}: UpdateAppointmentServiceInput & { serviceRowId: string }) => {
			const res = await api
				.appointments({ id: appointmentId })
				.services({ serviceRowId })
				.patch(input);
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر تحديث الدورة");
			}
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addService = (input: CreateAppointmentServiceInput) =>
		toast.promise(addMutation.mutateAsync(input), {
			loading: "جارٍ الإضافة...",
			success: "تمت إضافة الدورة",
			error: (err: Error) => err.message || "فشل الإضافة",
		});

	const deleteService = (serviceRowId: string) =>
		toast.promise(deleteMutation.mutateAsync(serviceRowId), {
			loading: "جارٍ الحذف...",
			success: "تم حذف الدورة",
			error: (err: Error) => err.message || "فشل الحذف",
		});

	const updateService = (serviceRowId: string, input: UpdateAppointmentServiceInput) =>
		toast.promise(updateMutation.mutateAsync({ serviceRowId, ...input }), {
			loading: "جارٍ الحفظ...",
			success: "تم تحديث الدورة",
			error: (err: Error) => err.message || "فشل الحفظ",
		});

	return {
		services: data ?? [],
		isLoading,
		addService,
		deleteService,
		updateService,
		isAdding: addMutation.isPending,
		isDeleting: deleteMutation.isPending,
		isUpdating: updateMutation.isPending,
	};
};
