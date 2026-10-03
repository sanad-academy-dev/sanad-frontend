import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { AddAppointmentFormValues } from "@/features/appointments/types/appointment.types";
import { uploadFiles } from "@/hooks/use-upload-files";
import { api } from "@/lib/api";

interface AddAppointmentExtra {
	// عند الحجز من "بدء الزيارة" داخل اشتراك خطة رعاية — يربط الموعد الناتج بالزيارة
	enrollmentVisitId?: string;
}

export const useAddAppointment = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			data,
			extra,
		}: {
			data: AddAppointmentFormValues;
			extra?: AddAppointmentExtra;
		}) => {
			const {
				date,
				startMinute,
				images,
				whatsappNotification: _whatsappNotification,
				repeat,
				repeatCount,
				repeatUnit,
				priority,
				...rest
			} = data;

			const startsAt = new Date(date);
			startsAt.setHours(0, 0, 0, 0);
			startsAt.setMinutes(startMinute);

			const imagePaths = images.length > 0 ? await uploadFiles(images) : [];

			const res = await api.appointments.post({
				...rest,
				// زيارة "دورات فقط" بلا كشف — لا نرسل سلسلة فارغة كمعرّف
				consultationTypeId: rest.consultationTypeId || undefined,
				priority: priority ?? null,
				images: imagePaths,
				startsAt: startsAt.toISOString(),
				...(repeat && repeatCount && repeatCount >= 2
					? { repeatCount, repeatUnit: repeatUnit ?? "WEEK" }
					: {}),
				...(extra?.enrollmentVisitId ? { enrollmentVisitId: extra.enrollmentVisitId } : {}),
			});

			if (res.error) {
				const data = res.error.value as { message?: string } | undefined;
				throw new Error(data?.message ?? "تعذّر حجز الزيارة");
			}
			return res.data;
		},
		onSuccess: (_result, { extra }) => {
			void queryClient.invalidateQueries({ queryKey: ["appointments"] });
			if (extra?.enrollmentVisitId) {
				void queryClient.invalidateQueries({ queryKey: ["care-plan-enrollments"] });
			}
		},
	});

	const addAppointment = async (data: AddAppointmentFormValues, extra?: AddAppointmentExtra) =>
		toast.promise(mutation.mutateAsync({ data, extra }), {
			loading: "جارٍ حجز الزيارة...",
			success: (result) => {
				if (!result) return "تم حجز الزيارة بنجاح";
				const { appointments, skippedDates } = result as {
					appointments: unknown[];
					skippedDates: unknown[];
				};
				if (appointments.length > 1 && skippedDates.length > 0) {
					return `تم حجز ${appointments.length} زيارات، وتم تخطي ${skippedDates.length} بسبب تعارض`;
				}
				if (appointments.length > 1) {
					return `تم حجز ${appointments.length} زيارات متكررة بنجاح`;
				}
				return "تم حجز الزيارة بنجاح";
			},
			error: (err: Error) => err.message || "فشل حجز الزيارة",
		});

	return { addAppointment, isPending: mutation.isPending };
};
