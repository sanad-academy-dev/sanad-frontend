import type { CarePlanEnrollmentListItemResponse, CarePlanEnrollmentResponse, EnrollCarePlanInput } from "@/server/care-plans/care-plans.type";
type DaoResult<T> = T | "not-found";
export declare const carePlanEnrollmentsDao: {
    enroll(clinicId: string, carePlanId: string, input: EnrollCarePlanInput, authorUserId: string): Promise<CarePlanEnrollmentResponse | "plan-not-found" | "patient-not-found" | "patient-no-owner">;
    list(clinicId: string): Promise<CarePlanEnrollmentListItemResponse[]>;
    getById(id: string, clinicId: string): Promise<DaoResult<CarePlanEnrollmentListItemResponse>>;
    cancel(id: string, clinicId: string): Promise<DaoResult<CarePlanEnrollmentResponse>>;
};
export {};
