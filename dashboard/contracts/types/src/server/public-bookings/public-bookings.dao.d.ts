import type { CreatePublicBookingFailure, CreatePublicBookingInput, CreatePublicBookingResult } from "@/server/public-bookings/public-bookings.type";
export declare const publicBookingsDao: {
    create(input: CreatePublicBookingInput): Promise<{
        ok: true;
        data: CreatePublicBookingResult;
    } | {
        ok: false;
        failure: CreatePublicBookingFailure;
    }>;
};
export declare class SlotUnavailableError extends Error {
    constructor();
}
