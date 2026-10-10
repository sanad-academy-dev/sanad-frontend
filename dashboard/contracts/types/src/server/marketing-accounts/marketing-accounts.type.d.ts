import type { Prisma } from "@/generated/prisma/client";
declare const accountSelect: {
    readonly id: true;
    readonly platform: true;
    readonly name: true;
    readonly externalId: true;
    readonly connectedAt: true;
};
export declare const marketingAccountSelect: {
    readonly id: true;
    readonly platform: true;
    readonly name: true;
    readonly externalId: true;
    readonly connectedAt: true;
};
export type MarketingAccountResponse = Prisma.MarketingSocialAccountGetPayload<{
    select: typeof accountSelect;
}>;
export {};
