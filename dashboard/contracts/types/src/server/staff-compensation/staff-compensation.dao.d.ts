import { type UpsertStaffCompensationInput } from "@/server/staff-compensation/staff-compensation.type";
export declare const staffCompensationDao: {
    get(staffId: string, clinicId: string): Promise<{
        id: string;
        updatedAt: Date;
        notes: string | null;
        staffId: string;
        iban: string | null;
        bankName: string | null;
        baseSalary: import("@prisma/client-runtime-utils").Decimal;
        allowances: {
            type: import("@/server/staff-compensation/staff-compensation.type").AllowanceType;
            id: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            note: string | null;
        }[];
        defaultPaymentMethod: import("@/server/staff-compensation/staff-compensation.type").PayrollPaymentMethod;
        effectiveFrom: Date | null;
    } | null>;
    upsert(staffId: string, clinicId: string, input: UpsertStaffCompensationInput): Promise<{
        id: string;
        updatedAt: Date;
        notes: string | null;
        staffId: string;
        iban: string | null;
        bankName: string | null;
        baseSalary: import("@prisma/client-runtime-utils").Decimal;
        allowances: {
            type: import("@/server/staff-compensation/staff-compensation.type").AllowanceType;
            id: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            note: string | null;
        }[];
        defaultPaymentMethod: import("@/server/staff-compensation/staff-compensation.type").PayrollPaymentMethod;
        effectiveFrom: Date | null;
    } | null>;
};
