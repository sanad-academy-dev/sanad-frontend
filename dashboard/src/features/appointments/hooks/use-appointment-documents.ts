import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AppointmentDocumentResponse } from "@/server/appointments/appointments.type";

const EMPTY: AppointmentDocumentResponse[] = [];

export const useAppointmentDocuments = (appointmentId: string | null) => {
	const { data, isLoading } = useQuery<AppointmentDocumentResponse[]>({
		queryKey: ["appointment-documents", appointmentId],
		queryFn: async () => {
			if (!appointmentId) throw new Error("no id");
			const res = await api.appointments({ id: appointmentId }).documents.get();
			if (res.error) throw new Error("تعذّر جلب المستندات");
			return (res.data ?? []) as AppointmentDocumentResponse[];
		},
		enabled: !!appointmentId,
	});

	return { documents: data ?? EMPTY, isLoading };
};
