import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { AttendanceStatus } from "@/generated/prisma/enums";
export { AttendanceStatus };
export declare const attendanceSelect: {
    readonly id: true;
    readonly staffId: true;
    readonly date: true;
    readonly checkIn: true;
    readonly checkOut: true;
    readonly status: true;
    readonly hours: true;
    readonly notes: true;
};
export type AttendanceResponse = Prisma.AttendanceGetPayload<{
    select: typeof attendanceSelect;
}>;
export declare const upsertAttendanceSchema: z.ZodObject<{
    staffId: z.ZodString;
    date: z.ZodString;
    status: z.ZodEnum<{
        readonly PRESENT: "PRESENT";
        readonly ABSENT: "ABSENT";
        readonly LATE: "LATE";
        readonly LEAVE: "LEAVE";
        readonly MISSION: "MISSION";
        readonly OVERTIME: "OVERTIME";
    }>;
    hours: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    checkIn: z.ZodOptional<z.ZodString>;
    checkOut: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpsertAttendanceFormInput = z.infer<typeof upsertAttendanceSchema>;
export type UpsertAttendanceInput = Pick<Prisma.AttendanceUncheckedCreateInput, "clinicId" | "staffId" | "date" | "status" | "hours" | "checkIn" | "checkOut" | "notes">;
