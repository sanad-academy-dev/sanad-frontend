export declare const currencyDao: {
    list(includeDisabled?: boolean): Promise<{
        symbol: string | null;
        name: string;
        code: string;
        nameAr: string;
        fractionUnits: number;
        fractionNameEn: string | null;
        fractionNameAr: string | null;
        smallestUnit: import("@prisma/client-runtime-utils").Decimal;
        enabled: boolean;
    }[]>;
    findByCode(code: string): Promise<{
        symbol: string | null;
        name: string;
        code: string;
        nameAr: string;
        fractionUnits: number;
        fractionNameEn: string | null;
        fractionNameAr: string | null;
        smallestUnit: import("@prisma/client-runtime-utils").Decimal;
        enabled: boolean;
    } | null>;
};
