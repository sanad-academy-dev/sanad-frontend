import type { DocStatus } from "@/generated/prisma/enums";
export type ListCostCenterAllocationFilter = {
    docstatus?: DocStatus;
    limit?: number;
};
export declare const costCenterAllocationDao: {
    list(clinicId: string, filter?: ListCostCenterAllocationFilter): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
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
    }[]>;
    findById(clinicId: string, id: string): import("../../../../generated/prisma/models").Prisma__CostCenterAllocationClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
};
