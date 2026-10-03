import type { Prisma } from "@/generated/prisma/client";
export type { CarePlanEnrollmentStatus, CarePlanEnrollmentVisitStatus, CarePlanIntervalUnit, CarePlanStatus, } from "@/generated/prisma/enums";
declare const carePlanSelect: {
    id: true;
    code: true;
    clinicId: true;
    name: true;
    notes: true;
    visitDurationMins: true;
    price: true;
    durationDays: true;
    status: true;
    usageCount: true;
    subscribersCount: true;
    ratingSum: true;
    ratingCount: true;
    editsCount: true;
    createdAt: true;
    updatedAt: true;
    service: {
        select: {
            id: true;
            name: true;
            parentId: true;
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
    visits: {
        select: {
            id: true;
            service: {
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
        };
        orderBy: {
            order: "asc";
        };
    };
};
export declare const carePlanSelectShape: {
    id: true;
    code: true;
    clinicId: true;
    name: true;
    notes: true;
    visitDurationMins: true;
    price: true;
    durationDays: true;
    status: true;
    usageCount: true;
    subscribersCount: true;
    ratingSum: true;
    ratingCount: true;
    editsCount: true;
    createdAt: true;
    updatedAt: true;
    service: {
        select: {
            id: true;
            name: true;
            parentId: true;
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
    visits: {
        select: {
            id: true;
            service: {
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
        };
        orderBy: {
            order: "asc";
        };
    };
};
export type CarePlanResponse = Prisma.CarePlanGetPayload<{
    select: typeof carePlanSelect;
}>;
export type CarePlanListItemResponse = CarePlanResponse & {
    type: string;
    includedServices: string[];
    visitsCount: number;
};
declare const carePlanDetailSelect: {
    medications: {
        select: {
            id: true;
            inventoryItemId: true;
            nameSnapshot: true;
            priceSnapshot: true;
            quantity: true;
            freeQuantity: true;
            fullyFree: true;
        };
    };
    visits: {
        select: {
            id: true;
            order: true;
            serviceId: true;
            service: {
                select: {
                    id: true;
                    name: true;
                };
            };
            consultationTypeId: true;
            consultationType: {
                select: {
                    id: true;
                    name: true;
                };
            };
            durationMins: true;
            details: true;
            intervalUnit: true;
            intervalValue: true;
            vaccinationProtocolDoseId: true;
            vaccinationProtocolDose: {
                select: {
                    id: true;
                    label: true;
                    antigenCode: true;
                    protocolId: true;
                };
            };
            medications: {
                select: {
                    id: true;
                    inventoryItemId: true;
                    nameSnapshot: true;
                    priceSnapshot: true;
                    quantity: true;
                    freeQuantity: true;
                    fullyFree: true;
                };
            };
        };
        orderBy: {
            order: "asc";
        };
    };
    id: true;
    code: true;
    clinicId: true;
    name: true;
    notes: true;
    visitDurationMins: true;
    price: true;
    durationDays: true;
    status: true;
    usageCount: true;
    subscribersCount: true;
    ratingSum: true;
    ratingCount: true;
    editsCount: true;
    createdAt: true;
    updatedAt: true;
    service: {
        select: {
            id: true;
            name: true;
            parentId: true;
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
export declare const carePlanDetailSelectShape: {
    medications: {
        select: {
            id: true;
            inventoryItemId: true;
            nameSnapshot: true;
            priceSnapshot: true;
            quantity: true;
            freeQuantity: true;
            fullyFree: true;
        };
    };
    visits: {
        select: {
            id: true;
            order: true;
            serviceId: true;
            service: {
                select: {
                    id: true;
                    name: true;
                };
            };
            consultationTypeId: true;
            consultationType: {
                select: {
                    id: true;
                    name: true;
                };
            };
            durationMins: true;
            details: true;
            intervalUnit: true;
            intervalValue: true;
            vaccinationProtocolDoseId: true;
            vaccinationProtocolDose: {
                select: {
                    id: true;
                    label: true;
                    antigenCode: true;
                    protocolId: true;
                };
            };
            medications: {
                select: {
                    id: true;
                    inventoryItemId: true;
                    nameSnapshot: true;
                    priceSnapshot: true;
                    quantity: true;
                    freeQuantity: true;
                    fullyFree: true;
                };
            };
        };
        orderBy: {
            order: "asc";
        };
    };
    id: true;
    code: true;
    clinicId: true;
    name: true;
    notes: true;
    visitDurationMins: true;
    price: true;
    durationDays: true;
    status: true;
    usageCount: true;
    subscribersCount: true;
    ratingSum: true;
    ratingCount: true;
    editsCount: true;
    createdAt: true;
    updatedAt: true;
    service: {
        select: {
            id: true;
            name: true;
            parentId: true;
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
export type CarePlanDetailResponse = Prisma.CarePlanGetPayload<{
    select: typeof carePlanDetailSelect;
}>;
export type CarePlanStatsResponse = {
    total: number;
    revenue: number;
    scheduledVisits: number;
    subscribedPatients: number;
    usages: number;
    averageRating: number | null;
};
export type CarePlanMedicationInput = {
    inventoryItemId: string;
    quantity: number;
    freeQuantity: number;
    fullyFree: boolean;
};
export type CarePlanVisitInput = {
    serviceId?: string | null;
    consultationTypeId?: string | null;
    durationMins?: number | null;
    details?: string | null;
    intervalUnit: "DAY" | "WEEK";
    intervalValue: number;
    vaccinationProtocolDoseId?: string | null;
    medications: CarePlanMedicationInput[];
};
export type CreateCarePlanInput = Pick<Prisma.CarePlanUncheckedCreateInput, "name" | "serviceId" | "animalTypeId" | "animalStrainId" | "notes" | "visitDurationMins"> & {
    price: number;
    visits?: CarePlanVisitInput[];
    medications?: CarePlanMedicationInput[];
};
export type UpdateCarePlanInput = Partial<CreateCarePlanInput>;
declare const enrollmentSelect: {
    id: true;
    code: true;
    clinicId: true;
    priceSnapshot: true;
    status: true;
    startedAt: true;
    completedAt: true;
    notes: true;
    createdAt: true;
    updatedAt: true;
    carePlan: {
        select: {
            id: true;
            code: true;
            name: true;
        };
    };
    patient: {
        select: {
            id: true;
            code: true;
            name: true;
            ownerId: true;
        };
    };
    visits: {
        select: {
            id: true;
            order: true;
            serviceId: true;
            serviceName: true;
            consultationTypeId: true;
            consultationTypeName: true;
            scheduledAt: true;
            status: true;
            completedAt: true;
            appointmentId: true;
            medications: {
                select: {
                    id: true;
                    inventoryItemId: true;
                    nameSnapshot: true;
                    priceSnapshot: true;
                    quantity: true;
                    freeQuantity: true;
                    fullyFree: true;
                };
            };
            appointment: {
                select: {
                    id: true;
                    code: true;
                    status: true;
                    startsAt: true;
                    staff: {
                        select: {
                            id: true;
                            name: true;
                            prefix: true;
                        };
                    };
                    invoice: {
                        select: {
                            id: true;
                            status: true;
                            total: true;
                        };
                    };
                };
            };
        };
        orderBy: {
            order: "asc";
        };
    };
};
export declare const enrollmentSelectShape: {
    id: true;
    code: true;
    clinicId: true;
    priceSnapshot: true;
    status: true;
    startedAt: true;
    completedAt: true;
    notes: true;
    createdAt: true;
    updatedAt: true;
    carePlan: {
        select: {
            id: true;
            code: true;
            name: true;
        };
    };
    patient: {
        select: {
            id: true;
            code: true;
            name: true;
            ownerId: true;
        };
    };
    visits: {
        select: {
            id: true;
            order: true;
            serviceId: true;
            serviceName: true;
            consultationTypeId: true;
            consultationTypeName: true;
            scheduledAt: true;
            status: true;
            completedAt: true;
            appointmentId: true;
            medications: {
                select: {
                    id: true;
                    inventoryItemId: true;
                    nameSnapshot: true;
                    priceSnapshot: true;
                    quantity: true;
                    freeQuantity: true;
                    fullyFree: true;
                };
            };
            appointment: {
                select: {
                    id: true;
                    code: true;
                    status: true;
                    startsAt: true;
                    staff: {
                        select: {
                            id: true;
                            name: true;
                            prefix: true;
                        };
                    };
                    invoice: {
                        select: {
                            id: true;
                            status: true;
                            total: true;
                        };
                    };
                };
            };
        };
        orderBy: {
            order: "asc";
        };
    };
};
export type CarePlanEnrollmentResponse = Prisma.CarePlanEnrollmentGetPayload<{
    select: typeof enrollmentSelect;
}>;
export type CarePlanEnrollmentListItemResponse = CarePlanEnrollmentResponse & {
    visitsTotal: number;
    visitsCompleted: number;
};
export type EnrollCarePlanInput = {
    patientId: string;
    startedAt?: string;
    notes?: string | null;
    sourceAppointmentId?: string;
};
