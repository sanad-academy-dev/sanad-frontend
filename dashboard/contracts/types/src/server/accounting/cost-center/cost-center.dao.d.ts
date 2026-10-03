export declare const costCenterDao: {
    listTree(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        clinicId: string;
        disabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        isGroup: boolean;
        lft: number;
        rgt: number;
        costCenterName: string;
        costCenterNumber: string | null;
        parentCostCenterId: string | null;
    }[]>;
    findById(clinicId: string, id: string): import("../../../../generated/prisma/models").Prisma__CostCenterClient<{
        id: string;
        clinicId: string;
        disabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        isGroup: boolean;
        lft: number;
        rgt: number;
        costCenterName: string;
        costCenterNumber: string | null;
        parentCostCenterId: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
};
