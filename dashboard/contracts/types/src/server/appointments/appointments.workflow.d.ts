import type { BookingHourOption } from "@/generated/prisma/enums";
import { AppointmentStatus } from "@/generated/prisma/enums";
import type { ClinicSchedulingSettingsResponse } from "@/server/scheduling/scheduling.type";
export declare const STATUS_LABELS: Record<AppointmentStatus, string>;
export declare const ALLOWED_TRANSITIONS: Record<AppointmentStatus, readonly AppointmentStatus[]>;
export declare const UNDO_TRANSITIONS: ReadonlyArray<readonly [AppointmentStatus, AppointmentStatus]>;
export declare const TERMINAL_STATUSES: readonly ["DONE", "CANCELLED"];
export declare const CREATABLE_STATUSES: readonly ["SCHEDULED", "WAITING"];
export declare const isTerminalStatus: (status: AppointmentStatus) => boolean;
export declare const canTransition: (from: AppointmentStatus, to: AppointmentStatus) => boolean;
export declare const isUndoTransition: (from: AppointmentStatus, to: AppointmentStatus) => boolean;
export declare const invalidTransitionMessage: (from: AppointmentStatus, to: AppointmentStatus) => string;
export declare const LOCATION_LOCKED_STATUSES: readonly ["CHECK_IN", "IN_SERVICE", "HOSPITALIZED", "AWAITING_PAYMENT", "DONE", "CANCELLED"];
export declare const isLocationLocked: (status: AppointmentStatus) => boolean;
export declare const BOOKING_HOUR_VALUES: Record<BookingHourOption, number>;
export type RescheduleNoticeSettings = Pick<ClinicSchedulingSettingsResponse, "bookingRulesEnabled" | "rescheduleNoticeEnabled" | "rescheduleNoticeHours">;
export declare const rescheduleNoticeHours: (settings: RescheduleNoticeSettings | null | undefined) => number | null;
export type LocationChangeBlock = {
    reason: "status";
    status: AppointmentStatus;
} | {
    reason: "notice";
    hours: number;
};
export declare const locationChangeBlock: ({ status, startsAt, noticeHours, now, }: {
    status: AppointmentStatus;
    startsAt: Date;
    noticeHours: number | null;
    now: Date;
}) => LocationChangeBlock | null;
export declare const locationChangeBlockMessage: (block: LocationChangeBlock) => string;
