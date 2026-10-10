export declare const currencyExchangeDao: {
    list(clinicId: string, limit?: number): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        date: Date;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
        fromCurrencyCode: string;
        toCurrencyCode: string;
        forBuying: boolean;
        forSelling: boolean;
    }[]>;
    findById(clinicId: string, id: string): import("../../../../generated/prisma/models").Prisma__CurrencyExchangeClient<{
        date: Date;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
        fromCurrencyCode: string;
        toCurrencyCode: string;
        forBuying: boolean;
        forSelling: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
};
