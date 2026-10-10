import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { GeocodeSource, MobileDispatchStage, MobileVisitFailureReason } from "@/generated/prisma/enums";
export { GeocodeSource, MobileDispatchStage, MobileVisitFailureReason };
export declare class MobileVisitValidationError extends Error {
    constructor(message: string);
}
export declare class MobileVisitConflictError extends Error {
    constructor(message: string);
}
export declare const serviceAddressSelect: {
    readonly id: true;
    readonly label: true;
    readonly line1: true;
    readonly district: true;
    readonly city: true;
    readonly landmark: true;
    readonly lat: true;
    readonly lng: true;
    readonly accessNotes: true;
    readonly isDefault: true;
};
export type ServiceAddressResponse = Prisma.ServiceAddressGetPayload<{
    select: typeof serviceAddressSelect;
}>;
export declare const mobileVisitSelect: {
    readonly id: true;
    readonly appointmentId: true;
    readonly mobileUnitId: true;
    readonly shiftId: true;
    readonly sequence: true;
    readonly windowStart: true;
    readonly windowEnd: true;
    readonly etaAt: true;
    readonly dispatchStage: true;
    readonly enRouteAt: true;
    readonly arrivedAt: true;
    readonly departedAt: true;
    readonly arrivalDriftM: true;
    readonly distanceKm: true;
    readonly travelMinutes: true;
    readonly travelFee: true;
    readonly failureReason: true;
    readonly failureNote: true;
    readonly trackingToken: true;
    readonly serviceAddress: {
        readonly select: {
            readonly id: true;
            readonly label: true;
            readonly line1: true;
            readonly district: true;
            readonly city: true;
            readonly landmark: true;
            readonly lat: true;
            readonly lng: true;
            readonly accessNotes: true;
            readonly isDefault: true;
        };
    };
    readonly mobileUnit: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
            readonly status: true;
        };
    };
    readonly appointment: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly status: true;
            readonly startsAt: true;
            readonly durationMinutes: true;
            readonly reason: true;
            readonly owner: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly phone: true;
                };
            };
            readonly patient: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly animalType: {
                        readonly select: {
                            readonly arName: true;
                        };
                    };
                };
            };
            readonly staff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly services: {
                readonly select: {
                    readonly id: true;
                    readonly service: {
                        readonly select: {
                            readonly name: true;
                        };
                    };
                };
            };
        };
    };
};
export type MobileVisitResponse = Prisma.MobileVisitGetPayload<{
    select: typeof mobileVisitSelect;
}>;
export declare const serviceAddressSchema: z.ZodObject<{
    line1: z.ZodString;
    label: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    district: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    city: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    landmark: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    accessNotes: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    lat: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    lng: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type ServiceAddressFormInput = z.infer<typeof serviceAddressSchema>;
export declare const assignVisitSchema: z.ZodObject<{
    mobileUnitId: z.ZodString;
    sequence: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    windowStart: z.ZodOptional<z.ZodString>;
    windowEnd: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AssignVisitFormInput = z.infer<typeof assignVisitSchema>;
export declare const stageChangeSchema: z.ZodObject<{
    stage: z.ZodEnum<{
        readonly PENDING: "PENDING";
        readonly ASSIGNED: "ASSIGNED";
        readonly EN_ROUTE: "EN_ROUTE";
        readonly ARRIVED: "ARRIVED";
        readonly IN_SERVICE: "IN_SERVICE";
        readonly COMPLETED: "COMPLETED";
        readonly FAILED: "FAILED";
        readonly CANCELLED: "CANCELLED";
    }>;
    reason: z.ZodOptional<z.ZodEnum<{
        readonly NO_ANSWER: "NO_ANSWER";
        readonly ADDRESS_NOT_FOUND: "ADDRESS_NOT_FOUND";
        readonly ACCESS_DENIED: "ACCESS_DENIED";
        readonly PET_UNAVAILABLE: "PET_UNAVAILABLE";
        readonly OWNER_CANCELLED: "OWNER_CANCELLED";
        readonly VEHICLE_ISSUE: "VEHICLE_ISSUE";
        readonly WEATHER: "WEATHER";
        readonly OTHER: "OTHER";
    }>>;
    note: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    lat: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    lng: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    at: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type StageChangeFormInput = z.infer<typeof stageChangeSchema>;
