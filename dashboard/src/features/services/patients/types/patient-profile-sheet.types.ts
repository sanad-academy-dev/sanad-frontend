import type { PatientResponse } from "@/server/patients/patients.type";

export interface PatientProfileSheetProps {
	patient: PatientResponse | null;
	open: boolean;
	onClose: () => void;
}
