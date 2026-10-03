import type { Weekday } from "@/generated/prisma/enums";
export declare const WEEKDAYS: Weekday[];
export type AppointmentSlot = {
    startMinute: number;
    available: boolean;
    conflictType?: "STAFF_BUSY" | "OUTSIDE_HOURS";
};
export type WorkingHourWindow = {
    isWorking: boolean;
    startMinute: number | null;
    endMinute: number | null;
};
export type OccupiedRange = {
    startMin: number;
    endMin: number;
};
export declare function weekdayForDate(date: Date): Weekday;
export declare function computeSlots(workingHour: WorkingHourWindow | null, occupiedRanges: OccupiedRange[], durationMinutes: number): AppointmentSlot[];
export declare function appointmentsToOccupiedRanges(appts: {
    startsAt: Date;
    durationMinutes: number;
}[]): OccupiedRange[];
export declare function dayBounds(date: Date): {
    dayStart: Date;
    dayEnd: Date;
};
