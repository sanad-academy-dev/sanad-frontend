import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { Gender } from "@/generated/prisma/enums";
import type { vitalSignsSelectShape } from "@/server/vital-signs/vital-signs.type";
export type { Gender };
export declare const createPatientSchema: z.ZodObject<{
    name: z.ZodString;
    gender: z.ZodEnum<{
        readonly MALE: "MALE";
        readonly FEMALE: "FEMALE";
        readonly UNKNOWN: "UNKNOWN";
    }>;
    animalTypeId: z.ZodString;
    animalStrainId: z.ZodOptional<z.ZodString>;
    ownerId: z.ZodString;
    age: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    birthDate: z.ZodString;
    weight: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    notes: z.ZodOptional<z.ZodString>;
    active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CreatePatientFormInput = z.infer<typeof createPatientSchema>;
export type CreatePatientInput = Pick<Prisma.PatientUncheckedCreateInput, "clinicId" | "name" | "gender" | "animalTypeId" | "ownerId" | "animalStrainId" | "age" | "birthDate" | "weight" | "notes" | "active">;
export type UpdatePatientInput = Partial<Omit<CreatePatientInput, "clinicId">>;
export type PatientResponse = Prisma.PatientGetPayload<{
    select: {
        id: true;
        code: true;
        name: true;
        gender: true;
        age: true;
        birthDate: true;
        weight: true;
        notes: true;
        active: true;
        editsCount: true;
        createdAt: true;
        updatedAt: true;
        owner: {
            select: {
                id: true;
                code: true;
                name: true;
                phone: true;
                email: true;
            };
        };
        animalType: {
            select: {
                id: true;
                arName: true;
                enName: true;
            };
        };
        animalStrain: {
            select: {
                id: true;
                arName: true;
                enName: true;
            };
        };
    };
}>;
export declare const transferPatientOwnershipSchema: z.ZodObject<{
    ownerId: z.ZodString;
    comment: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
}, z.core.$strip>;
export type TransferPatientOwnershipFormInput = z.input<typeof transferPatientOwnershipSchema>;
export type TransferPatientOwnershipFormValues = z.output<typeof transferPatientOwnershipSchema>;
export type PatientActivityResponse = Prisma.PatientActivityGetPayload<{
    select: {
        id: true;
        type: true;
        body: true;
        metadata: true;
        createdAt: true;
        author: {
            select: {
                id: true;
                name: true;
            };
        };
    };
}>;
/**
 * انتقاء الزيارة يضم — عمدًا — كل حقول `dashboardAppointmentSelect`، فبطاقة
 * الزيارة تُبنى من هذه الاستجابة عبر `mapDashboardAppointmentToCard` بلا مُحوِّل ثالث.
 */
declare const historyVisitSelect: {
    id: true;
    code: true;
    startsAt: true;
    durationMinutes: true;
    status: true;
    queueStatus: true;
    priority: true;
    isEmergency: true;
    location: true;
    reason: true;
    symptoms: true;
    clinicalNotes: true;
    owner: {
        select: {
            id: true;
            name: true;
        };
    };
    staff: {
        select: {
            id: true;
            name: true;
            prefix: true;
        };
    };
    patient: {
        select: {
            id: true;
            name: true;
            animalType: {
                select: {
                    enName: true;
                };
            };
        };
    };
    room: {
        select: {
            id: true;
            name: true;
        };
    };
    consultationType: {
        select: {
            id: true;
            name: true;
        };
    };
    clinicalExam: {
        select: {
            id: true;
            completedAt: true;
        };
    };
    invoice: {
        select: {
            id: true;
            code: true;
            total: true;
            amountPaid: true;
            status: true;
        };
    };
    services: {
        select: {
            id: true;
            quantity: true;
            service: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
        orderBy: {
            id: "asc";
        };
    };
    _count: {
        select: {
            products: true;
            labTestOrders: true;
            radiologyOrders: true;
        };
    };
};
declare const historyLabSelect: {
    id: true;
    code: true;
    createdAt: true;
    priority: true;
    isUrgent: true;
    notes: true;
    appointmentId: true;
    requestedBy: {
        select: {
            id: true;
            name: true;
        };
    };
    invoice: {
        select: {
            id: true;
            code: true;
            total: true;
            amountPaid: true;
            status: true;
        };
    };
    items: {
        select: {
            id: true;
            status: true;
            sampleStage: true;
            completedAt: true;
            service: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
        orderBy: {
            id: "asc";
        };
    };
};
declare const historyRadiologySelect: {
    id: true;
    code: true;
    createdAt: true;
    priority: true;
    isUrgent: true;
    clinicalInfo: true;
    notes: true;
    appointmentId: true;
    requestedBy: {
        select: {
            id: true;
            name: true;
        };
    };
    invoice: {
        select: {
            id: true;
            code: true;
            total: true;
            amountPaid: true;
            status: true;
        };
    };
    items: {
        select: {
            id: true;
            status: true;
            stage: true;
            accession: true;
            modality: true;
            bodyPart: true;
            laterality: true;
            completedAt: true;
            service: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
        orderBy: {
            id: "asc";
        };
    };
};
declare const historyCarePlanSelect: {
    id: true;
    code: true;
    startedAt: true;
    completedAt: true;
    status: true;
    priceSnapshot: true;
    notes: true;
    carePlan: {
        select: {
            id: true;
            name: true;
            durationDays: true;
        };
    };
    _count: {
        select: {
            visits: true;
        };
    };
};
export type PatientHistoryVisit = Prisma.AppointmentGetPayload<{
    select: typeof historyVisitSelect;
}>;
export type PatientHistoryLabOrder = Prisma.LabTestOrderGetPayload<{
    select: typeof historyLabSelect;
}>;
export type PatientHistoryRadiologyOrder = Prisma.RadiologyOrderGetPayload<{
    select: typeof historyRadiologySelect;
}>;
export type PatientHistoryVitals = Prisma.VitalSignsRecordGetPayload<{
    select: typeof vitalSignsSelectShape;
}>;
export type PatientHistoryCarePlan = Prisma.CarePlanEnrollmentGetPayload<{
    select: typeof historyCarePlanSelect;
}>;
export declare const patientHistorySelectShapes: {
    readonly visit: {
        id: true;
        code: true;
        startsAt: true;
        durationMinutes: true;
        status: true;
        queueStatus: true;
        priority: true;
        isEmergency: true;
        location: true;
        reason: true;
        symptoms: true;
        clinicalNotes: true;
        owner: {
            select: {
                id: true;
                name: true;
            };
        };
        staff: {
            select: {
                id: true;
                name: true;
                prefix: true;
            };
        };
        patient: {
            select: {
                id: true;
                name: true;
                animalType: {
                    select: {
                        enName: true;
                    };
                };
            };
        };
        room: {
            select: {
                id: true;
                name: true;
            };
        };
        consultationType: {
            select: {
                id: true;
                name: true;
            };
        };
        clinicalExam: {
            select: {
                id: true;
                completedAt: true;
            };
        };
        invoice: {
            select: {
                id: true;
                code: true;
                total: true;
                amountPaid: true;
                status: true;
            };
        };
        services: {
            select: {
                id: true;
                quantity: true;
                service: {
                    select: {
                        id: true;
                        name: true;
                    };
                };
            };
            orderBy: {
                id: "asc";
            };
        };
        _count: {
            select: {
                products: true;
                labTestOrders: true;
                radiologyOrders: true;
            };
        };
    };
    readonly lab: {
        id: true;
        code: true;
        createdAt: true;
        priority: true;
        isUrgent: true;
        notes: true;
        appointmentId: true;
        requestedBy: {
            select: {
                id: true;
                name: true;
            };
        };
        invoice: {
            select: {
                id: true;
                code: true;
                total: true;
                amountPaid: true;
                status: true;
            };
        };
        items: {
            select: {
                id: true;
                status: true;
                sampleStage: true;
                completedAt: true;
                service: {
                    select: {
                        id: true;
                        name: true;
                    };
                };
            };
            orderBy: {
                id: "asc";
            };
        };
    };
    readonly radiology: {
        id: true;
        code: true;
        createdAt: true;
        priority: true;
        isUrgent: true;
        clinicalInfo: true;
        notes: true;
        appointmentId: true;
        requestedBy: {
            select: {
                id: true;
                name: true;
            };
        };
        invoice: {
            select: {
                id: true;
                code: true;
                total: true;
                amountPaid: true;
                status: true;
            };
        };
        items: {
            select: {
                id: true;
                status: true;
                stage: true;
                accession: true;
                modality: true;
                bodyPart: true;
                laterality: true;
                completedAt: true;
                service: {
                    select: {
                        id: true;
                        name: true;
                    };
                };
            };
            orderBy: {
                id: "asc";
            };
        };
    };
    readonly carePlan: {
        id: true;
        code: true;
        startedAt: true;
        completedAt: true;
        status: true;
        priceSnapshot: true;
        notes: true;
        carePlan: {
            select: {
                id: true;
                name: true;
                durationDays: true;
            };
        };
        _count: {
            select: {
                visits: true;
            };
        };
    };
};
/** أنواع الأحداث في الخط الزمني — الفلاتر والأيقونات تشتقّ منه */
export declare const PATIENT_HISTORY_KINDS: readonly ["VISIT", "LAB", "RADIOLOGY", "VITALS", "CARE_PLAN"];
export type PatientHistoryKind = (typeof PATIENT_HISTORY_KINDS)[number];
/**
 * مغلّف الحدث: النوع ولحظة الوقوع فقط، والسجل الأصلي كما هو من Prisma.
 * `occurredAt` يختلف مصدره بين النوعين (موعد الزيارة مقابل وقت إنشاء الطلب)،
 * فيُوحَّد هنا ليصير الترتيب والتجميع باليوم منطقًا واحدًا لا خمسة.
 */
export type PatientHistoryEntry = {
    kind: "VISIT";
    id: string;
    occurredAt: Date;
    record: PatientHistoryVisit;
} | {
    kind: "LAB";
    id: string;
    occurredAt: Date;
    record: PatientHistoryLabOrder;
} | {
    kind: "RADIOLOGY";
    id: string;
    occurredAt: Date;
    record: PatientHistoryRadiologyOrder;
} | {
    kind: "VITALS";
    id: string;
    occurredAt: Date;
    record: PatientHistoryVitals;
} | {
    kind: "CARE_PLAN";
    id: string;
    occurredAt: Date;
    record: PatientHistoryCarePlan;
};
