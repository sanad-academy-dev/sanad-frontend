import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";
export { DocStatus };
/** [P10.1] Accounting Period types (BRD FR-12.2). */
export declare const accountingPeriodSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly periodName: true;
    readonly startDate: true;
    readonly endDate: true;
    readonly docstatus: true;
    readonly amendedFromId: true;
    readonly createdById: true;
    readonly submittedAt: true;
    readonly submittedById: true;
    readonly cancelledAt: true;
    readonly cancelledById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly closedDocuments: {
        readonly orderBy: {
            readonly documentType: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly documentType: true;
            readonly closed: true;
        };
    };
};
export type AccountingPeriodResponse = Prisma.AccountingPeriodGetPayload<{
    select: typeof accountingPeriodSelect;
}>;
export declare const createAccountingPeriodSchema: z.ZodObject<{
    periodName: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
    closedDocumentTypes: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type CreateAccountingPeriodFormInput = z.infer<typeof createAccountingPeriodSchema>;
export type CreateAccountingPeriodInput = Pick<Prisma.AccountingPeriodUncheckedCreateInput, "clinicId" | "periodName" | "createdById"> & {
    startDate: Date;
    endDate: Date;
    closedDocumentTypes: string[];
};
