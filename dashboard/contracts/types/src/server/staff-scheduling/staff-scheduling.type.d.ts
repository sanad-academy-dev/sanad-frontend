import type { Prisma } from "@/generated/prisma/client";
import { StaffShift, Weekday } from "@/generated/prisma/enums";
export { StaffShift, Weekday };
export declare const staffSchedulingSettingsSelect: {
    id: true;
    staffId: true;
    shift: true;
    morningStartMinute: true;
    morningEndMinute: true;
    eveningStartMinute: true;
    eveningEndMinute: true;
    onlineBookingEnabled: true;
    inClinicAppointmentsEnabled: true;
    mobileClinicAppointmentsEnabled: true;
};
export type StaffSchedulingSettingsResponse = Prisma.StaffSchedulingSettingsGetPayload<{
    select: typeof staffSchedulingSettingsSelect;
}>;
export declare const staffWorkingHourSelect: {
    id: true;
    staffId: true;
    weekday: true;
    isWorking: true;
    startMinute: true;
    endMinute: true;
};
export type StaffWorkingHourResponse = Prisma.StaffWorkingHourGetPayload<{
    select: typeof staffWorkingHourSelect;
}>;
export type StaffSchedulingResponse = {
    settings: StaffSchedulingSettingsResponse;
    workingHours: StaffWorkingHourResponse[];
};
export type UpdateStaffSchedulingSettingsInput = Partial<Omit<StaffSchedulingSettingsResponse, "id" | "staffId">>;
export type UpdateStaffWorkingHourInput = Partial<Pick<StaffWorkingHourResponse, "isWorking" | "startMinute" | "endMinute">>;
export declare const DEFAULT_START_MINUTE = 480;
export declare const DEFAULT_END_MINUTE = 1020;
