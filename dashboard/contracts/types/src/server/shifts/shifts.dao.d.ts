import { type UpsertShiftInput } from "@/server/shifts/shifts.type";
export declare const shiftsDao: {
    listRange(clinicId: string, start: Date, end: Date): import("../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        type: import("@/server/shifts/shifts.type").ShiftType;
        date: Date;
        id: string;
        notes: string | null;
        staffId: string;
        startMinute: number | null;
        endMinute: number | null;
        hours: number;
    }[]>;
    upsert(input: UpsertShiftInput): import("../../../generated/prisma/models").Prisma__ShiftAssignmentClient<{
        type: import("@/server/shifts/shifts.type").ShiftType;
        date: Date;
        id: string;
        notes: string | null;
        staffId: string;
        startMinute: number | null;
        endMinute: number | null;
        hours: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    remove(clinicId: string, staffId: string, date: Date): Promise<{
        success: boolean;
    }>;
};
