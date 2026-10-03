import { z } from "zod";
import type { Branch, Prisma } from "@/generated/prisma/client";
export type BranchWriteFields = Omit<Branch, "id" | "branchCode" | "createdAt" | "updatedAt">;
export declare const createBranchSchema: z.ZodObject<{
    name: z.ZodString;
    branchCode: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        PRIMARY: "PRIMARY";
        SUB: "SUB";
    }>;
    managerIds: z.ZodArray<z.ZodString>;
    email: z.ZodString;
    city: z.ZodString;
    address: z.ZodString;
    active: z.ZodBoolean;
    enableWarehouse: z.ZodBoolean;
}, z.core.$strip>;
export type CreateBranchFormInput = z.infer<typeof createBranchSchema>;
export type CreateBranchInput = Pick<BranchWriteFields, "clinicId" | "name" | "address" | "type"> & Partial<Pick<BranchWriteFields, "managerId" | "email" | "city" | "phone" | "active" | "icon">> & {
    branchCode?: Branch["branchCode"] | null;
    managerIds?: string[];
    enableWarehouse?: boolean;
};
export type UpdateBranchInput = Partial<Omit<BranchWriteFields, "clinicId" | "settings">>;
export declare const updateBranchSchema: z.ZodObject<{
    name: z.ZodString;
    icon: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    type: z.ZodOptional<z.ZodEnum<{
        PRIMARY: "PRIMARY";
        SUB: "SUB";
    }>>;
    active: z.ZodOptional<z.ZodBoolean>;
    emergencyNotifications: z.ZodOptional<z.ZodBoolean>;
    managerId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodEmail>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    city: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateBranchFormInput = z.infer<typeof updateBranchSchema>;
export type BranchWithManager = Prisma.BranchGetPayload<{
    include: {
        manager: {
            select: {
                id: true;
                name: true;
                email: true;
                image: true;
                phone: true;
            };
        };
        managers: {
            select: {
                id: true;
                name: true;
                email: true;
                image: true;
            };
        };
        warehouses: {
            select: {
                id: true;
                active: true;
            };
        };
        _count: {
            select: {
                rooms: true;
                branchUsers: true;
            };
        };
    };
}>;
export declare const branchSettingsSchema: z.ZodObject<{
    queue: z.ZodPrefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        medicalPriority: z.ZodDefault<z.ZodBoolean>;
        emergencyToFront: z.ZodDefault<z.ZodBoolean>;
        mentions: z.ZodDefault<z.ZodBoolean>;
        responsibleIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        statusLabels: z.ZodPipe<z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>, z.ZodTransform<{
            [x: string]: string;
        }, Record<string, string>>>;
    }, z.core.$strip>>;
    tasks: z.ZodPrefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        comments: z.ZodDefault<z.ZodBoolean>;
        mentions: z.ZodDefault<z.ZodBoolean>;
        autoCloseMain: z.ZodDefault<z.ZodBoolean>;
        autoCloseSub: z.ZodDefault<z.ZodBoolean>;
        autoCloseStale: z.ZodDefault<z.ZodBoolean>;
        creatorIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        approverIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        assigneeIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        statusLabels: z.ZodPipe<z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>, z.ZodTransform<{
            [x: string]: string;
        }, Record<string, string>>>;
    }, z.core.$strip>>;
    warehouse: z.ZodPrefault<z.ZodObject<{
        purchaseOrders: z.ZodDefault<z.ZodBoolean>;
        requireApprovalOnOrder: z.ZodDefault<z.ZodBoolean>;
        interBranchTransfer: z.ZodDefault<z.ZodBoolean>;
        periodicCount: z.ZodDefault<z.ZodBoolean>;
        periodicCountInterval: z.ZodDefault<z.ZodEnum<{
            WEEKLY: "WEEKLY";
            MONTHLY: "MONTHLY";
            QUARTERLY: "QUARTERLY";
        }>>;
        stockAlerts: z.ZodDefault<z.ZodBoolean>;
        purchaseResponsibleIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        receiveResponsibleIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    emergency: z.ZodPrefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        redFastWalk: z.ZodDefault<z.ZodBoolean>;
        requireTriageBeforeService: z.ZodDefault<z.ZodBoolean>;
        deferPaymentUx: z.ZodDefault<z.ZodBoolean>;
        untriagedAlertMinutes: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        defaultDurationMinutes: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        defaultVetStaffId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        consultationTypeId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        afterHoursServiceId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        bayRoomIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
        crashCartWarehouseId: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        allowUnidentifiedPatients: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    services: z.ZodPrefault<z.ZodObject<{
        labTests: z.ZodDefault<z.ZodBoolean>;
        radiology: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    labTests: z.ZodPrefault<z.ZodObject<{
        analyzers: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            category: z.ZodString;
            connected: z.ZodDefault<z.ZodBoolean>;
            slots: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        }, z.core.$strip>>>;
        ai: z.ZodPrefault<z.ZodObject<{
            autoInterpretation: z.ZodDefault<z.ZodBoolean>;
            duplicateDetection: z.ZodDefault<z.ZodBoolean>;
            criticalAlerts: z.ZodDefault<z.ZodBoolean>;
            trendAnalysis: z.ZodDefault<z.ZodBoolean>;
            predictiveMaintenance: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        westgardRules: z.ZodDefault<z.ZodArray<z.ZodString>>;
        lis: z.ZodDefault<z.ZodBoolean>;
        barcode: z.ZodPrefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            labelSize: z.ZodDefault<z.ZodString>;
            printerModel: z.ZodDefault<z.ZodString>;
            copies: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    radiology: z.ZodPrefault<z.ZodObject<{
        machines: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            modality: z.ZodString;
            room: z.ZodDefault<z.ZodString>;
            connected: z.ZodDefault<z.ZodBoolean>;
            slots: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        }, z.core.$strip>>>;
        ai: z.ZodPrefault<z.ZodObject<{
            autoDraftReport: z.ZodDefault<z.ZodBoolean>;
            criticalAlerts: z.ZodDefault<z.ZodBoolean>;
            doseOutlierDetection: z.ZodDefault<z.ZodBoolean>;
            autoQualityCheck: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        dose: z.ZodPrefault<z.ZodObject<{
            trackDose: z.ZodDefault<z.ZodBoolean>;
            requireForXray: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        pacs: z.ZodPrefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            aeTitle: z.ZodDefault<z.ZodString>;
            host: z.ZodDefault<z.ZodString>;
            port: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    petPortal: z.ZodPrefault<z.ZodObject<{
        timelineVaccinations: z.ZodDefault<z.ZodBoolean>;
        timelineVitals: z.ZodDefault<z.ZodBoolean>;
        timelineCarePlans: z.ZodDefault<z.ZodBoolean>;
        timelineGrooming: z.ZodDefault<z.ZodBoolean>;
        reportServices: z.ZodDefault<z.ZodBoolean>;
        reportProducts: z.ZodDefault<z.ZodBoolean>;
        reportVitals: z.ZodDefault<z.ZodBoolean>;
        reportVaccinations: z.ZodDefault<z.ZodBoolean>;
        reportInvoice: z.ZodDefault<z.ZodBoolean>;
        showPrices: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BranchSettings = z.infer<typeof branchSettingsSchema>;
export type PetPortalDisplay = BranchSettings["petPortal"];
/** يقرأ العمود Json ويعيد إعدادات كاملة بالقيم الافتراضية عند النقص أو التلف */
export declare const parseBranchSettings: (raw: unknown) => BranchSettings;
export type BranchUserWithUser = Prisma.BranchUserGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                name: true;
                email: true;
                image: true;
            };
        };
    };
}>;
export type BranchUserWithDetails = Prisma.BranchUserGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                name: true;
                email: true;
                image: true;
                phone: true;
                clinicUsers: {
                    select: {
                        role: true;
                    };
                };
            };
        };
    };
}> & {
    inviteAccepted: boolean;
};
