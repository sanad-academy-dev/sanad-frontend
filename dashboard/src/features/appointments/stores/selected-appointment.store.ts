import { create } from "zustand";

import type { AppointmentCardData } from "@/features/appointments/types/appointment.types";

interface SelectedAppointmentStore {
	selected: AppointmentCardData | null;
	select: (card: AppointmentCardData | null) => void;
	close: () => void;
}

export const useSelectedAppointmentStore = create<SelectedAppointmentStore>()((set) => ({
	selected: null,
	select: (card) => set({ selected: card }),
	close: () => set({ selected: null }),
}));
