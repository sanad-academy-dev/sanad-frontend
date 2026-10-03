import type { StaffDocumentCategory } from "@/generated/prisma/enums";
import { type CreateStaffDocumentInput, type StaffDocumentResponse } from "@/server/staff-documents/staff-documents.type";
export declare const staffDocumentsDao: {
    list(staffId: string, clinicId: string, category?: StaffDocumentCategory): Promise<StaffDocumentResponse[] | null>;
    create(staffId: string, clinicId: string, authorUserId: string, input: CreateStaffDocumentInput): Promise<StaffDocumentResponse | null>;
    remove(staffId: string, clinicId: string, documentId: string): Promise<"ok" | "not-found">;
};
