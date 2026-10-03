import { type ClinicDocumentResponse, type ClinicDocumentSummary, type CreateClinicDocumentInput, type UpdateClinicDocumentInput } from "@/server/clinic-documents/clinic-documents.type";
import { type BranchScope, type ListClinicDocumentsFilters } from "@/server/clinic-documents/clinic-documents.where";
export type { BranchScope, ListClinicDocumentsFilters };
export declare const clinicDocumentsDao: {
    list(clinicId: string, scope: BranchScope, filters?: ListClinicDocumentsFilters): Promise<ClinicDocumentResponse[]>;
    summary(clinicId: string, scope: BranchScope): Promise<ClinicDocumentSummary>;
    create(clinicId: string, authorUserId: string, input: CreateClinicDocumentInput): Promise<ClinicDocumentResponse | "branch-not-found">;
    update(clinicId: string, scope: BranchScope, documentId: string, input: UpdateClinicDocumentInput): Promise<ClinicDocumentResponse | "not-found" | "branch-not-found">;
    remove(clinicId: string, scope: BranchScope, documentId: string): Promise<"ok" | "not-found">;
};
