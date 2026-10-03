import type { Prisma } from "@/generated/prisma/client";
export declare const WORK_DAY_MINUTES: number;
export declare const COMPENSATORY_LEAVE_TYPE = "\u0625\u062C\u0627\u0632\u0629 \u062A\u0639\u0648\u064A\u0636\u064A\u0629";
export declare const compensatorySelect: {
    readonly id: true;
    readonly staffId: true;
    readonly minutes: true;
    readonly source: true;
    readonly reason: true;
    readonly date: true;
    readonly createdAt: true;
};
export type CompensatoryEntryResponse = Prisma.CompensatoryEntryGetPayload<{
    select: typeof compensatorySelect;
}>;
export type CompensatorySource = "shift_extension" | "leave" | "manual";
