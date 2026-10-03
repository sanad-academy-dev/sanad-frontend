import type { Weekday } from "@/generated/prisma/enums";
import { type UpdateStaffSchedulingSettingsInput, type UpdateStaffWorkingHourInput } from "@/server/staff-scheduling/staff-scheduling.type";
export declare const staffSchedulingDao: {
    get(staffId: string, clinicId: string): Promise<{
        settings: {
            shift: import("@/generated/prisma/enums").StaffShift | null;
            id: string;
            staffId: string;
            morningStartMinute: number | null;
            morningEndMinute: number | null;
            eveningStartMinute: number | null;
            eveningEndMinute: number | null;
            onlineBookingEnabled: boolean;
            inClinicAppointmentsEnabled: boolean;
            mobileClinicAppointmentsEnabled: boolean;
        };
        workingHours: {
            id: string;
            staffId: string;
            weekday: Weekday;
            isWorking: boolean;
            startMinute: number | null;
            endMinute: number | null;
        }[];
    } | null>;
    updateSettings(staffId: string, clinicId: string, data: UpdateStaffSchedulingSettingsInput): Promise<{
        shift: import("@/generated/prisma/enums").StaffShift | null;
        id: string;
        staffId: string;
        morningStartMinute: number | null;
        morningEndMinute: number | null;
        eveningStartMinute: number | null;
        eveningEndMinute: number | null;
        onlineBookingEnabled: boolean;
        inClinicAppointmentsEnabled: boolean;
        mobileClinicAppointmentsEnabled: boolean;
    } | null>;
    updateWorkingHour(staffId: string, clinicId: string, weekday: Weekday, data: UpdateStaffWorkingHourInput): Promise<{
        id: string;
        staffId: string;
        weekday: Weekday;
        isWorking: boolean;
        startMinute: number | null;
        endMinute: number | null;
    } | null>;
};
