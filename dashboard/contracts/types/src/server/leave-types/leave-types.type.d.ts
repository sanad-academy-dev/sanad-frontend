import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const leaveTypeSelect: {
    id: true;
    slug: true;
    name: true;
    entitlementDays: true;
    payPercent: true;
};
export type LeaveTypeResponse = Prisma.ClinicLeaveTypeGetPayload<{
    select: typeof leaveTypeSelect;
}>;
export declare const UNKNOWN_LEAVE_TYPE_PAY_PERCENT = 100;
export declare const DEFAULT_LEAVE_TYPES: {
    slug: string;
    name: string;
    entitlementDays: number | null;
    payPercent: number;
}[];
export declare const updateLeaveTypeSchema: z.ZodObject<{
    name: z.ZodString;
    entitlementDays: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    payPercent: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type UpdateLeaveTypeFormInput = z.input<typeof updateLeaveTypeSchema>;
export type UpdateLeaveTypeFormValues = z.output<typeof updateLeaveTypeSchema>;
export type UpdateLeaveTypeInput = Partial<Pick<Prisma.ClinicLeaveTypeUncheckedCreateInput, "name" | "entitlementDays" | "payPercent">>;
