import type { PaymentMethod } from "@/generated/prisma/enums";
import type { AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
export declare class PosShiftError extends Error {
    constructor(message: string);
}
export declare function openShift(params: {
    clinicId: string;
    profileId: string;
    cashierUserId: string;
    balances: {
        paymentMethod: PaymentMethod;
        amount: string;
    }[];
}): Promise<{
    id: string;
    status: import("@/generated/prisma/enums").PosShiftStatus;
    openedAt: Date;
    balances: {
        id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: PaymentMethod;
        openingId: string;
    }[];
}>;
export type ShiftExpectation = {
    paymentMethod: PaymentMethod;
    openingAmount: string;
    salesAmount: string;
    expectedAmount: string;
};
/**
 * What the drawer SHOULD hold, per method: opening float + this shift's paid sales, minus
 * refunds. A refunded sale gave the money back, so counting it would accuse every honest
 * cashier of a shortfall equal to the refunds they processed.
 */
export declare function shiftExpectation(clinicId: string, openingId: string): Promise<ShiftExpectation[]>;
export declare function closeShift(params: {
    clinicId: string;
    openingId: string;
    counted: {
        paymentMethod: PaymentMethod;
        countedAmount: string;
    }[];
    actor: AccountingActor;
}): Promise<{
    id: string;
    balances: {
        id: string;
        paymentMethod: PaymentMethod;
        difference: import("@prisma/client-runtime-utils").Decimal;
        expectedAmount: import("@prisma/client-runtime-utils").Decimal;
        countedAmount: import("@prisma/client-runtime-utils").Decimal;
        closingId: string;
    }[];
    closedAt: Date;
    totalDifference: import("@prisma/client-runtime-utils").Decimal;
}>;
/** [P12.4] POS Register — one row per shift with its takings and its drawer difference. */
export declare function posRegisterReport(params: {
    clinicId: string;
    fromDate?: Date | null;
    toDate?: Date | null;
}): Promise<{
    openingId: string;
    profileName: string;
    cashierName: string;
    openedAt: Date;
    closedAt: Date | null;
    status: import("@/generated/prisma/enums").PosShiftStatus;
    saleCount: number;
    salesTotal: string;
    totalDifference: string | null;
    balances: {
        paymentMethod: PaymentMethod;
        difference: import("@prisma/client-runtime-utils").Decimal;
        expectedAmount: import("@prisma/client-runtime-utils").Decimal;
        countedAmount: import("@prisma/client-runtime-utils").Decimal;
    }[];
}[]>;
