import type { AppointmentCardData } from "@/features/appointments/types/appointment.types";

export interface AppointmentSheetProps {
	card: AppointmentCardData | null;
	open: boolean;
	onClose: () => void;
}
