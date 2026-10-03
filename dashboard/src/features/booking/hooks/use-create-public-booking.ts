import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CreatePublicBookingResult } from "@/server/public-bookings/public-bookings.type";

export type CreatePublicBookingPayload = {
	clinicSlug: string;
	staffId: string;
	serviceId: string;
	date: string;
	startMinute: number;
	consultationTypeId: string;
	reason?: string;
	symptoms?: string;
	clinicalNotes?: string;
	whatsappReminderEnabled: boolean;
	isEmergency: boolean;
	ownerName: string;
	ownerPhone: string;
	ownerEmail?: string;
	patientName: string;
	patientAnimalTypeId: string;
	attachments: File[];
};

export type CreatePublicBookingError = {
	status: number;
	message: string;
};

const SUBMIT_ERROR = "تعذّر إرسال الطلب، حاول مرة أخرى";

export const useCreatePublicBooking = () => {
	const mutation = useMutation<
		CreatePublicBookingResult,
		CreatePublicBookingError,
		CreatePublicBookingPayload
	>({
		mutationFn: async (payload) => {
			const res = await api["public-bookings"].post({
				clinicSlug: payload.clinicSlug,
				staffId: payload.staffId,
				serviceId: payload.serviceId,
				date: payload.date,
				startMinute: payload.startMinute,
				consultationTypeId: payload.consultationTypeId,
				reason: payload.reason,
				symptoms: payload.symptoms,
				clinicalNotes: payload.clinicalNotes,
				whatsappReminderEnabled: payload.whatsappReminderEnabled,
				isEmergency: payload.isEmergency,
				ownerName: payload.ownerName,
				ownerPhone: payload.ownerPhone,
				ownerEmail: payload.ownerEmail,
				patientName: payload.patientName,
				patientAnimalTypeId: payload.patientAnimalTypeId,
				attachments: payload.attachments.length > 0 ? payload.attachments : undefined,
			});
			if (res.error) {
				const value = res.error.value as { message?: string } | undefined;
				throw {
					status: res.status ?? 500,
					message: value?.message ?? SUBMIT_ERROR,
				} satisfies CreatePublicBookingError;
			}
			return res.data as CreatePublicBookingResult;
		},
	});

	return mutation;
};
