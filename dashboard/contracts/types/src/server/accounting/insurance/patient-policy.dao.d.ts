import { type PatientPolicyFormInput, type PatientPolicyResponse } from "@/server/accounting/insurance/patient-policy.type";
export declare const patientPolicyDao: {
    list(clinicId: string, filter?: {
        patientId?: string;
    }): Promise<PatientPolicyResponse[]>;
    find(clinicId: string, id: string): Promise<PatientPolicyResponse | null>;
    create(clinicId: string, input: PatientPolicyFormInput): Promise<PatientPolicyResponse>;
    update(clinicId: string, id: string, input: PatientPolicyFormInput): Promise<PatientPolicyResponse>;
    /**
     * خطوة المهمة اليومية (MI §8.3: «EXPIRED تُشتق — المهمة اليومية + عند القراءة»):
     * مزامنة المخزَّن مع المشتق. القراءات صحيحة بدونها (الاشتقاق عند القراءة)، لكنها
     * تجعل الاستعلامات المخزَّنة (BR-I8.3.1 والمحلِّل) تقرأ الحقيقة نفسها.
     */
    expireDuePolicies(clinicId: string, today: Date): Promise<number>;
};
