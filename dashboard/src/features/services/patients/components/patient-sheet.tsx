import {
	AddPatientSheet,
	type AddPatientSheetProps,
} from "@/features/services/patients/components/add-patient-sheet";

export type PatientSheetProps = AddPatientSheetProps;

/**
 * لوحة الطفل الموحّدة (إضافة / تعديل / عرض)
 * ترتبط بنموذج الطفل الشامل مع دعم جميع الحقول الأكاديمية والطبية.
 */
export function PatientSheet(props: PatientSheetProps) {
	return <AddPatientSheet {...props} />;
}
