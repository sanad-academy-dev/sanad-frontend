import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";
export { DocStatus };
/** [P10.2] Period Closing Voucher types (BRD FR-12.3, §5.3). */
export declare const periodClosingVoucherSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly postingDate: true;
    readonly amendedFromId: true;
    readonly fiscalYear: true;
    readonly periodStartDate: true;
    readonly periodEndDate: true;
    readonly closingAccountHeadId: true;
    readonly remarks: true;
    readonly granularByDimensions: true;
    readonly gleProcessingStatus: true;
    readonly errorMessage: true;
    readonly createdById: true;
    readonly submittedAt: true;
    readonly submittedById: true;
    readonly cancelledAt: true;
    readonly cancelledById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly closingAccountHead: {
        readonly select: {
            readonly accountName: true;
            readonly accountNumber: true;
            readonly rootType: true;
        };
    };
};
export type PeriodClosingVoucherResponse = Prisma.PeriodClosingVoucherGetPayload<{
    select: typeof periodClosingVoucherSelect;
}>;
export declare const createPeriodClosingVoucherSchema: z.ZodObject<{
    periodStartDate: z.ZodString;
    periodEndDate: z.ZodString;
    closingAccountHeadId: z.ZodString;
    remarks: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    granularByDimensions: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CreatePeriodClosingVoucherFormInput = z.infer<typeof createPeriodClosingVoucherSchema>;
export type CreatePeriodClosingVoucherInput = Pick<Prisma.PeriodClosingVoucherUncheckedCreateInput, "clinicId" | "closingAccountHeadId" | "remarks" | "createdById"> & {
    periodStartDate: Date;
    periodEndDate: Date;
    granularByDimensions?: boolean;
};
