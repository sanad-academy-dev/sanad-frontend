export declare const modeOfPaymentDao: {
    list(clinicId: string, includeDisabled?: boolean): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        type: import("@/server/accounting/mode-of-payment/mode-of-payment.type").ModeOfPaymentType;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        enabled: boolean;
        modeOfPaymentName: string;
        defaultAccountId: string | null;
        defaultAccount: {
            id: string;
            accountName: string;
            accountNumber: string | null;
        } | null;
    }[]>;
    findById(clinicId: string, id: string): import("../../../../generated/prisma/models").Prisma__ModeOfPaymentClient<{
        type: import("@/server/accounting/mode-of-payment/mode-of-payment.type").ModeOfPaymentType;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        enabled: boolean;
        modeOfPaymentName: string;
        defaultAccountId: string | null;
        defaultAccount: {
            id: string;
            accountName: string;
            accountNumber: string | null;
        } | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
};
