import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/** بند الوصفة كما يُعاد للعميل */
export declare const prescriptionItemSelect: {
    id: true;
    idx: true;
    inventoryItemId: true;
    catalogProductId: true;
    nameSnapshot: true;
    doseAmount: true;
    doseUnit: true;
    route: true;
    frequency: true;
    durationDays: true;
    quantity: true;
    quantityUnit: true;
    prn: true;
    instructionsAr: true;
    refillsAllowed: true;
    refillsUsed: true;
    doseSource: true;
    overrideReasonAr: true;
    dispenseEvents: {
        select: {
            quantity: true;
        };
    };
};
export declare const prescriptionSelect: {
    id: true;
    code: true;
    status: true;
    patientId: true;
    appointmentId: true;
    inpatientStayId: true;
    prescriberId: true;
    weightKgSnapshot: true;
    weightRecordedAt: true;
    notesAr: true;
    issuedAt: true;
    cancelledAt: true;
    cancelReasonAr: true;
    createdAt: true;
    patient: {
        select: {
            id: true;
            code: true;
            name: true;
        };
    };
    prescriber: {
        select: {
            id: true;
            name: true;
        };
    };
    items: {
        select: {
            id: true;
            idx: true;
            inventoryItemId: true;
            catalogProductId: true;
            nameSnapshot: true;
            doseAmount: true;
            doseUnit: true;
            route: true;
            frequency: true;
            durationDays: true;
            quantity: true;
            quantityUnit: true;
            prn: true;
            instructionsAr: true;
            refillsAllowed: true;
            refillsUsed: true;
            doseSource: true;
            overrideReasonAr: true;
            dispenseEvents: {
                select: {
                    quantity: true;
                };
            };
        };
    };
};
export type PrescriptionResponse = Prisma.PrescriptionGetPayload<{
    select: typeof prescriptionSelect;
}>;
export type PrescriptionItemResponse = Prisma.PrescriptionItemGetPayload<{
    select: typeof prescriptionItemSelect;
}>;
/** قائمة مختصرة — لا بنود، فطابور الصرف يعرض عشرات الصفوف */
export declare const prescriptionListSelect: {
    id: true;
    code: true;
    status: true;
    issuedAt: true;
    createdAt: true;
    patient: {
        select: {
            id: true;
            code: true;
            name: true;
        };
    };
    prescriber: {
        select: {
            id: true;
            name: true;
        };
    };
    _count: {
        select: {
            items: true;
        };
    };
};
export type PrescriptionListResponse = Prisma.PrescriptionGetPayload<{
    select: typeof prescriptionListSelect;
}>;
export type CreatePrescriptionInput = Pick<Prisma.PrescriptionUncheckedCreateInput, "clinicId" | "patientId"> & Partial<Pick<Prisma.PrescriptionUncheckedCreateInput, "appointmentId" | "inpatientStayId" | "notesAr">>;
export type CreatePrescriptionItemInput = Pick<Prisma.PrescriptionItemUncheckedCreateInput, "nameSnapshot" | "quantity" | "quantityUnit" | "instructionsAr"> & Partial<Pick<Prisma.PrescriptionItemUncheckedCreateInput, "inventoryItemId" | "catalogProductId" | "doseAmount" | "doseUnit" | "route" | "frequency" | "durationDays" | "prn" | "refillsAllowed" | "doseSource" | "overrideReasonAr">>;
export declare const createPrescriptionSchema: z.ZodObject<{
    patientId: z.ZodString;
    appointmentId: z.ZodOptional<z.ZodString>;
    notesAr: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreatePrescriptionFormInput = z.infer<typeof createPrescriptionSchema>;
export declare const prescriptionItemSchema: z.ZodObject<{
    nameSnapshot: z.ZodString;
    inventoryItemId: z.ZodOptional<z.ZodString>;
    catalogProductId: z.ZodOptional<z.ZodString>;
    doseAmount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    doseUnit: z.ZodOptional<z.ZodString>;
    route: z.ZodOptional<z.ZodString>;
    frequency: z.ZodOptional<z.ZodString>;
    durationDays: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    quantity: z.ZodCoercedNumber<unknown>;
    quantityUnit: z.ZodString;
    prn: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    instructionsAr: z.ZodString;
    refillsAllowed: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    overrideReasonAr: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PrescriptionItemFormInput = z.infer<typeof prescriptionItemSchema>;
