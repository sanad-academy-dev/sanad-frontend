import type { Prisma } from "@/generated/prisma/client";
export declare const staffServiceSelect: {
    id: true;
    staffId: true;
    serviceId: true;
    isActive: true;
    usageCount: true;
    createdAt: true;
    service: {
        select: {
            id: true;
            name: true;
            parentId: true;
            parent: {
                select: {
                    id: true;
                    name: true;
                    parentId: true;
                    parent: {
                        select: {
                            id: true;
                            name: true;
                            order: true;
                        };
                    };
                    order: true;
                };
            };
        };
    };
};
type StaffServiceBase = Prisma.StaffServiceGetPayload<{
    select: typeof staffServiceSelect;
}>;
export type StaffServiceResponse = Omit<StaffServiceBase, "service"> & {
    serviceName: string;
    categoryName: string;
    categoryOrder: number;
    duration: number | null;
    price: number | null;
    clinicActive: boolean;
};
export type AddStaffServiceInput = {
    serviceId: string;
};
export type UpdateStaffServiceInput = {
    isActive: boolean;
};
export {};
