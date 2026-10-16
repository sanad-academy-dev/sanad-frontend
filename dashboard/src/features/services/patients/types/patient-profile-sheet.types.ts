import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";

export interface PatientProfileSheetProps {
	patient: PatientResponse | null;
	open: boolean;
	onClose: () => void;
	onPatientChange?: (patient: PatientResponse) => void;
}
