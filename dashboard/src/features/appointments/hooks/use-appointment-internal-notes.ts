import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AppointmentInternalNoteResponse } from "@/server/appointments/appointments.type";

const EMPTY: AppointmentInternalNoteResponse[] = [];

export const useAppointmentInternalNotes = (appointmentId: string | null) => {
	const { data, isLoading } = useQuery<AppointmentInternalNoteResponse[]>({
		queryKey: ["appointment-internal-notes", appointmentId],
		queryFn: async () => {
			if (!appointmentId) throw new Error("no id");
			const res = await api.appointments({ id: appointmentId })["internal-notes"].get();
			if (res.error) throw new Error("تعذّر جلب الملاحظات");
			return (res.data ?? []) as AppointmentInternalNoteResponse[];
		},
		enabled: !!appointmentId,
	});

	return { notes: data ?? EMPTY, isLoading };
};
