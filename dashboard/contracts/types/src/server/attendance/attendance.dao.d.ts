import { AttendanceStatus } from "@/generated/prisma/enums";
import { type UpsertAttendanceInput } from "@/server/attendance/attendance.type";
export declare const ANNUAL_LEAVE_DAYS = 21;
export declare const attendanceDao: {
    leaveBalance(clinicId: string, staffId: string, year: number): Promise<{
        allowance: number;
        taken: number;
        remaining: number;
        compensatoryMinutes: number;
        compensatoryDays: number;
    }>;
    listRange(clinicId: string, start: Date, end: Date): import("../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        date: Date;
        id: string;
        notes: string | null;
        status: AttendanceStatus;
        staffId: string;
        hours: number;
        checkIn: Date | null;
        checkOut: Date | null;
    }[]>;
    upsert(input: UpsertAttendanceInput): import("../../../generated/prisma/models").Prisma__AttendanceClient<{
        date: Date;
        id: string;
        notes: string | null;
        status: AttendanceStatus;
        staffId: string;
        hours: number;
        checkIn: Date | null;
        checkOut: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
};
