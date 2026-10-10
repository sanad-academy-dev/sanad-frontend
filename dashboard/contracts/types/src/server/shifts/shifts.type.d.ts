import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { ShiftType } from "@/generated/prisma/enums";
export { ShiftType };
export declare const shiftSelect: {
    readonly id: true;
    readonly staffId: true;
    readonly date: true;
    readonly type: true;
    readonly startMinute: true;
    readonly endMinute: true;
    readonly hours: true;
    readonly notes: true;
};
export type ShiftAssignmentResponse = Prisma.ShiftAssignmentGetPayload<{
    select: typeof shiftSelect;
}>;
export declare const upsertShiftSchema: z.ZodObject<{
    staffId: z.ZodString;
    date: z.ZodString;
    type: z.ZodEnum<{
        readonly MORNING: "MORNING";
        readonly EVENING: "EVENING";
        readonly NIGHT: "NIGHT";
    }>;
    startMinute: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    endMinute: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    hours: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpsertShiftFormInput = z.infer<typeof upsertShiftSchema>;
export type UpsertShiftInput = Pick<Prisma.ShiftAssignmentUncheckedCreateInput, "clinicId" | "staffId" | "date" | "type" | "startMinute" | "endMinute" | "hours" | "notes">;
export declare const aiShiftOptionsSchema: z.ZodObject<{
    workdays: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perShift: z.ZodOptional<z.ZodObject<{
        MORNING: z.ZodOptional<z.ZodNumber>;
        EVENING: z.ZodOptional<z.ZodNumber>;
        NIGHT: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    maxDaysPerStaff: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    replaceExisting: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type AiShiftOptions = z.infer<typeof aiShiftOptionsSchema>;
export declare const aiShiftSuggestionSchema: z.ZodObject<{
    staffId: z.ZodCatch<z.ZodString>;
    date: z.ZodCatch<z.ZodString>;
    type: z.ZodCatch<z.ZodEnum<{
        readonly MORNING: "MORNING";
        readonly EVENING: "EVENING";
        readonly NIGHT: "NIGHT";
    }>>;
    startMinute: z.ZodCatch<z.ZodCoercedNumber<unknown>>;
    endMinute: z.ZodCatch<z.ZodCoercedNumber<unknown>>;
    hours: z.ZodCatch<z.ZodCoercedNumber<unknown>>;
    reason: z.ZodCatch<z.ZodString>;
}, z.core.$strip>;
export type AiShiftSuggestion = z.infer<typeof aiShiftSuggestionSchema>;
export declare const aiShiftPlanSchema: z.ZodObject<{
    summary: z.ZodCatch<z.ZodString>;
    shifts: z.ZodCatch<z.ZodArray<z.ZodObject<{
        staffId: z.ZodCatch<z.ZodString>;
        date: z.ZodCatch<z.ZodString>;
        type: z.ZodCatch<z.ZodEnum<{
            readonly MORNING: "MORNING";
            readonly EVENING: "EVENING";
            readonly NIGHT: "NIGHT";
        }>>;
        startMinute: z.ZodCatch<z.ZodCoercedNumber<unknown>>;
        endMinute: z.ZodCatch<z.ZodCoercedNumber<unknown>>;
        hours: z.ZodCatch<z.ZodCoercedNumber<unknown>>;
        reason: z.ZodCatch<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type AiShiftPlan = z.infer<typeof aiShiftPlanSchema>;
