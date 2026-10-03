import { type UpdateLeaveTypeInput } from "@/server/leave-types/leave-types.type";
export declare const leaveTypesDao: {
    ensureDefaults(clinicId: string): Promise<void>;
    list(clinicId: string): Promise<{
        name: string;
        id: string;
        slug: string;
        entitlementDays: number | null;
        payPercent: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    payPercentBySlug(clinicId: string): Promise<Map<string, number>>;
    update(clinicId: string, slug: string, data: UpdateLeaveTypeInput): Promise<{
        name: string;
        id: string;
        slug: string;
        entitlementDays: number | null;
        payPercent: import("@prisma/client-runtime-utils").Decimal;
    } | null>;
};
