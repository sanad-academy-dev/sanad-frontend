import { DocStatus } from "@/generated/prisma/enums";
import { type CostCenterAllocationVoucher, type CreateCostCenterAllocationInput, type UpdateCostCenterAllocationInput } from "@/server/accounting/cost-center-allocation/cost-center-allocation.type";
import { type VoucherActor, type VoucherConfig } from "@/server/accounting/voucher/voucher.service";
/** Create a Draft allocation with its child rows (no ledger impact, no number yet). */
export declare function createCostCenterAllocation(input: CreateCostCenterAllocationInput): Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    documentNo: string | null;
    percentages: {
        costCenter: {
            costCenterName: string;
            costCenterNumber: string | null;
        };
        id: string;
        costCenterId: string;
        percentage: import("@prisma/client-runtime-utils").Decimal;
    }[];
    mainCostCenterId: string;
    validFrom: Date;
    mainCostCenter: {
        id: string;
        costCenterName: string;
        costCenterNumber: string | null;
    };
}>;
/**
 * Replace a Draft allocation's fields and rows. Only Drafts are editable (AR-1: nothing is
 * whitelisted after submit); the rows are a nested collection, so they are swapped wholesale
 * rather than through the generic field-diff `updateVoucher`.
 */
export declare function updateCostCenterAllocation(clinicId: string, id: string, data: UpdateCostCenterAllocationInput): Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    documentNo: string | null;
    percentages: {
        costCenter: {
            costCenterName: string;
            costCenterNumber: string | null;
        };
        id: string;
        costCenterId: string;
        percentage: import("@prisma/client-runtime-utils").Decimal;
    }[];
    mainCostCenterId: string;
    validFrom: Date;
    mainCostCenter: {
        id: string;
        costCenterName: string;
        costCenterNumber: string | null;
    };
}>;
export declare const costCenterAllocationConfig: VoucherConfig<CostCenterAllocationVoucher>;
export declare const submitCostCenterAllocation: (id: string, actor: VoucherActor) => Promise<CostCenterAllocationVoucher>;
export declare const cancelCostCenterAllocation: (id: string, actor: VoucherActor) => Promise<CostCenterAllocationVoucher>;
export declare const amendCostCenterAllocation: (id: string, actor: VoucherActor) => Promise<CostCenterAllocationVoucher>;
