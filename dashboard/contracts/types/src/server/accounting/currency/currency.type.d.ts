import type { Prisma } from "@/generated/prisma/client";
export declare const currencySelect: {
    readonly code: true;
    readonly name: true;
    readonly nameAr: true;
    readonly symbol: true;
    readonly fractionUnits: true;
    readonly smallestUnit: true;
    readonly fractionNameEn: true;
    readonly fractionNameAr: true;
    readonly enabled: true;
};
export type CurrencyResponse = Prisma.CurrencyGetPayload<{
    select: typeof currencySelect;
}>;
