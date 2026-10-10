import { type ClinicalExamResponse, type UpsertDiagnosisInput, type UpsertSymptomsHistoryInput, type UpsertTreatmentPlanInput, type UpsertVitalsInput } from "@/server/clinical-exams/clinical-exams.type";
export declare const clinicalExamsDao: {
    findByAppointmentId(appointmentId: string, clinicId: string): Promise<ClinicalExamResponse | "not-found" | null>;
    upsertSymptomsHistory(appointmentId: string, clinicId: string, authorUserId: string, input: UpsertSymptomsHistoryInput): Promise<ClinicalExamResponse | "not-found">;
    upsertVitals(appointmentId: string, clinicId: string, authorUserId: string, input: UpsertVitalsInput): Promise<ClinicalExamResponse | "not-found">;
    upsertDiagnosis(appointmentId: string, clinicId: string, authorUserId: string, input: UpsertDiagnosisInput): Promise<ClinicalExamResponse | "not-found">;
    upsertTreatmentPlan(appointmentId: string, clinicId: string, authorUserId: string, input: UpsertTreatmentPlanInput): Promise<ClinicalExamResponse | "not-found">;
};
