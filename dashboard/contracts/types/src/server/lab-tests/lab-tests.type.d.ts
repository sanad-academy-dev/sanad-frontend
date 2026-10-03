import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { LabActivityType, LabResultFlag, LabTestStatus } from "@/generated/prisma/enums";
declare const labResultSelect: {
    readonly id: true;
    readonly parameterId: true;
    readonly section: true;
    readonly name: true;
    readonly unit: true;
    readonly refLow: true;
    readonly refHigh: true;
    readonly value: true;
    readonly numericValue: true;
    readonly flag: true;
    readonly notes: true;
    readonly order: true;
};
export type LabResultResponse = Prisma.LabTestResultGetPayload<{
    select: typeof labResultSelect;
}>;
declare const labItemSelect: {
    readonly id: true;
    readonly orderId: true;
    readonly serviceId: true;
    readonly priceSnapshot: true;
    readonly status: true;
    readonly sampleStage: true;
    readonly scheduledAt: true;
    readonly report: true;
    readonly reviewedAt: true;
    readonly rejectedAt: true;
    readonly rejectionReason: true;
    readonly completedAt: true;
    readonly paidAt: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly assignedTo: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly reviewedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly rejectedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly results: {
        readonly select: {
            readonly id: true;
            readonly parameterId: true;
            readonly section: true;
            readonly name: true;
            readonly unit: true;
            readonly refLow: true;
            readonly refHigh: true;
            readonly value: true;
            readonly numericValue: true;
            readonly flag: true;
            readonly notes: true;
            readonly order: true;
        };
    };
    readonly reportMentions: {
        readonly select: {
            readonly staff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly sampleCollection: {
        readonly select: {
            readonly id: true;
            readonly itemId: true;
            readonly tubeType: true;
            readonly drawSite: true;
            readonly volumeMl: true;
            readonly attempts: true;
            readonly collectedAt: true;
            readonly quality: true;
            readonly collectionNotes: true;
            readonly analyzerId: true;
            readonly analyzerName: true;
            readonly handedOverAt: true;
            readonly labelsPrinted: true;
            readonly collectedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
};
export type LabTestItemResponse = Prisma.LabTestOrderItemGetPayload<{
    select: typeof labItemSelect;
}>;
declare const labInvoiceSelect: {
    readonly currencyCode: true;
    readonly labOrderId: true;
    readonly id: true;
    readonly code: true;
    readonly clinicId: true;
    readonly appointmentId: true;
    readonly subtotal: true;
    readonly vatRate: true;
    readonly vatAmount: true;
    readonly discount: true;
    readonly total: true;
    readonly amountPaid: true;
    readonly status: true;
    readonly membershipId: true;
    readonly paymentMethod: true;
    readonly paidAt: true;
    readonly refundedAt: true;
    readonly refundReason: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly membershipAdjustments: {
        select: {
            id: true;
            lineRef: true;
            benefitType: true;
            amount: true;
            unitsConsumed: true;
        };
        orderBy: {
            idx: "asc";
        };
    };
};
export type LabInvoiceResponse = Prisma.InvoiceGetPayload<{
    select: typeof labInvoiceSelect;
}>;
declare const labActivitySelect: {
    readonly id: true;
    readonly itemId: true;
    readonly type: true;
    readonly detail: true;
    readonly createdAt: true;
    readonly author: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type LabActivityResponse = Prisma.LabTestActivityGetPayload<{
    select: typeof labActivitySelect;
}>;
declare const labCommentSelect: {
    readonly id: true;
    readonly body: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly author: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly mentions: {
        readonly select: {
            readonly staff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
};
export type LabCommentResponse = Prisma.LabTestCommentGetPayload<{
    select: typeof labCommentSelect;
}>;
declare const labPriorResultSelect: {
    readonly id: true;
    readonly orderId: true;
    readonly completedAt: true;
    readonly reviewedAt: true;
    readonly createdAt: true;
    readonly report: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly results: {
        readonly select: {
            readonly id: true;
            readonly parameterId: true;
            readonly section: true;
            readonly name: true;
            readonly unit: true;
            readonly refLow: true;
            readonly refHigh: true;
            readonly value: true;
            readonly numericValue: true;
            readonly flag: true;
            readonly notes: true;
            readonly order: true;
        };
    };
    readonly order: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly createdAt: true;
        };
    };
};
export type LabPriorResultResponse = Prisma.LabTestOrderItemGetPayload<{
    select: typeof labPriorResultSelect;
}>;
export declare const labPriorResultSelectShape: {
    readonly id: true;
    readonly orderId: true;
    readonly completedAt: true;
    readonly reviewedAt: true;
    readonly createdAt: true;
    readonly report: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly results: {
        readonly select: {
            readonly id: true;
            readonly parameterId: true;
            readonly section: true;
            readonly name: true;
            readonly unit: true;
            readonly refLow: true;
            readonly refHigh: true;
            readonly value: true;
            readonly numericValue: true;
            readonly flag: true;
            readonly notes: true;
            readonly order: true;
        };
    };
    readonly order: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly createdAt: true;
        };
    };
};
declare const labOrderSelect: {
    readonly id: true;
    readonly code: true;
    readonly clinicId: true;
    readonly branchId: true;
    readonly patientId: true;
    readonly ownerId: true;
    readonly appointmentId: true;
    readonly isUrgent: true;
    readonly priority: true;
    readonly notes: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
            readonly gender: true;
            readonly age: true;
            readonly animalType: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                };
            };
            readonly animalStrain: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                };
            };
        };
    };
    readonly qcReviewedAt: true;
    readonly qcRules: true;
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
    readonly branch: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly requestedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
    readonly qcReviewedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly inpatientStayId: true;
    readonly appointment: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly startsAt: true;
        };
    };
    readonly items: {
        readonly select: {
            readonly id: true;
            readonly orderId: true;
            readonly serviceId: true;
            readonly priceSnapshot: true;
            readonly status: true;
            readonly sampleStage: true;
            readonly scheduledAt: true;
            readonly report: true;
            readonly reviewedAt: true;
            readonly rejectedAt: true;
            readonly rejectionReason: true;
            readonly completedAt: true;
            readonly paidAt: true;
            readonly createdAt: true;
            readonly updatedAt: true;
            readonly service: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly assignedTo: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly reviewedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly rejectedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly results: {
                readonly select: {
                    readonly id: true;
                    readonly parameterId: true;
                    readonly section: true;
                    readonly name: true;
                    readonly unit: true;
                    readonly refLow: true;
                    readonly refHigh: true;
                    readonly value: true;
                    readonly numericValue: true;
                    readonly flag: true;
                    readonly notes: true;
                    readonly order: true;
                };
            };
            readonly reportMentions: {
                readonly select: {
                    readonly staff: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
            readonly sampleCollection: {
                readonly select: {
                    readonly id: true;
                    readonly itemId: true;
                    readonly tubeType: true;
                    readonly drawSite: true;
                    readonly volumeMl: true;
                    readonly attempts: true;
                    readonly collectedAt: true;
                    readonly quality: true;
                    readonly collectionNotes: true;
                    readonly analyzerId: true;
                    readonly analyzerName: true;
                    readonly handedOverAt: true;
                    readonly labelsPrinted: true;
                    readonly collectedBy: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
        };
    };
    readonly invoice: {
        readonly select: {
            readonly currencyCode: true;
            readonly labOrderId: true;
            readonly id: true;
            readonly code: true;
            readonly clinicId: true;
            readonly appointmentId: true;
            readonly subtotal: true;
            readonly vatRate: true;
            readonly vatAmount: true;
            readonly discount: true;
            readonly total: true;
            readonly amountPaid: true;
            readonly status: true;
            readonly membershipId: true;
            readonly paymentMethod: true;
            readonly paidAt: true;
            readonly refundedAt: true;
            readonly refundReason: true;
            readonly createdAt: true;
            readonly updatedAt: true;
            readonly membershipAdjustments: {
                select: {
                    id: true;
                    lineRef: true;
                    benefitType: true;
                    amount: true;
                    unitsConsumed: true;
                };
                orderBy: {
                    idx: "asc";
                };
            };
        };
    };
    readonly preAnalytical: {
        readonly select: {
            readonly id: true;
            readonly orderId: true;
            readonly fastingStatus: true;
            readonly fastingHours: true;
            readonly medications: true;
            readonly ivFluids24h: true;
            readonly vitalsRecordId: true;
            readonly vitalsRecord: {
                readonly select: {
                    id: true;
                    code: true;
                    patientId: true;
                    branchId: true;
                    recordedAt: true;
                    source: true;
                    appointmentId: true;
                    labOrderId: true;
                    radiologyOrderId: true;
                    operationId: true;
                    weight: true;
                    temperature: true;
                    heartRate: true;
                    respiratoryRate: true;
                    oxygenSaturation: true;
                    bloodPressure: true;
                    painScore: true;
                    bodyConditionScore: true;
                    capillaryRefillSec: true;
                    mucousMembrane: true;
                    notes: true;
                    correctsId: true;
                    editsCount: true;
                    createdAt: true;
                    updatedAt: true;
                    recordedBy: {
                        select: {
                            id: true;
                            name: true;
                        };
                    };
                    correction: {
                        select: {
                            id: true;
                            code: true;
                            recordedAt: true;
                        };
                    };
                };
            };
        };
    };
    readonly activity: {
        readonly select: {
            readonly id: true;
            readonly itemId: true;
            readonly type: true;
            readonly detail: true;
            readonly createdAt: true;
            readonly author: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly comments: {
        readonly select: {
            readonly id: true;
            readonly body: true;
            readonly createdAt: true;
            readonly updatedAt: true;
            readonly author: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly mentions: {
                readonly select: {
                    readonly staff: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
        };
        readonly orderBy: {
            readonly createdAt: "desc";
        };
    };
};
export type LabTestOrderResponse = Prisma.LabTestOrderGetPayload<{
    select: typeof labOrderSelect;
}>;
export declare const labOrderSelectShape: {
    readonly id: true;
    readonly code: true;
    readonly clinicId: true;
    readonly branchId: true;
    readonly patientId: true;
    readonly ownerId: true;
    readonly appointmentId: true;
    readonly isUrgent: true;
    readonly priority: true;
    readonly notes: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
            readonly gender: true;
            readonly age: true;
            readonly animalType: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                };
            };
            readonly animalStrain: {
                readonly select: {
                    readonly id: true;
                    readonly arName: true;
                };
            };
        };
    };
    readonly qcReviewedAt: true;
    readonly qcRules: true;
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
    readonly branch: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly requestedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly phone: true;
        };
    };
    readonly qcReviewedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly inpatientStayId: true;
    readonly appointment: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly startsAt: true;
        };
    };
    readonly items: {
        readonly select: {
            readonly id: true;
            readonly orderId: true;
            readonly serviceId: true;
            readonly priceSnapshot: true;
            readonly status: true;
            readonly sampleStage: true;
            readonly scheduledAt: true;
            readonly report: true;
            readonly reviewedAt: true;
            readonly rejectedAt: true;
            readonly rejectionReason: true;
            readonly completedAt: true;
            readonly paidAt: true;
            readonly createdAt: true;
            readonly updatedAt: true;
            readonly service: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly assignedTo: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly reviewedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly rejectedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly results: {
                readonly select: {
                    readonly id: true;
                    readonly parameterId: true;
                    readonly section: true;
                    readonly name: true;
                    readonly unit: true;
                    readonly refLow: true;
                    readonly refHigh: true;
                    readonly value: true;
                    readonly numericValue: true;
                    readonly flag: true;
                    readonly notes: true;
                    readonly order: true;
                };
            };
            readonly reportMentions: {
                readonly select: {
                    readonly staff: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
            readonly sampleCollection: {
                readonly select: {
                    readonly id: true;
                    readonly itemId: true;
                    readonly tubeType: true;
                    readonly drawSite: true;
                    readonly volumeMl: true;
                    readonly attempts: true;
                    readonly collectedAt: true;
                    readonly quality: true;
                    readonly collectionNotes: true;
                    readonly analyzerId: true;
                    readonly analyzerName: true;
                    readonly handedOverAt: true;
                    readonly labelsPrinted: true;
                    readonly collectedBy: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
        };
    };
    readonly invoice: {
        readonly select: {
            readonly currencyCode: true;
            readonly labOrderId: true;
            readonly id: true;
            readonly code: true;
            readonly clinicId: true;
            readonly appointmentId: true;
            readonly subtotal: true;
            readonly vatRate: true;
            readonly vatAmount: true;
            readonly discount: true;
            readonly total: true;
            readonly amountPaid: true;
            readonly status: true;
            readonly membershipId: true;
            readonly paymentMethod: true;
            readonly paidAt: true;
            readonly refundedAt: true;
            readonly refundReason: true;
            readonly createdAt: true;
            readonly updatedAt: true;
            readonly membershipAdjustments: {
                select: {
                    id: true;
                    lineRef: true;
                    benefitType: true;
                    amount: true;
                    unitsConsumed: true;
                };
                orderBy: {
                    idx: "asc";
                };
            };
        };
    };
    readonly preAnalytical: {
        readonly select: {
            readonly id: true;
            readonly orderId: true;
            readonly fastingStatus: true;
            readonly fastingHours: true;
            readonly medications: true;
            readonly ivFluids24h: true;
            readonly vitalsRecordId: true;
            readonly vitalsRecord: {
                readonly select: {
                    id: true;
                    code: true;
                    patientId: true;
                    branchId: true;
                    recordedAt: true;
                    source: true;
                    appointmentId: true;
                    labOrderId: true;
                    radiologyOrderId: true;
                    operationId: true;
                    weight: true;
                    temperature: true;
                    heartRate: true;
                    respiratoryRate: true;
                    oxygenSaturation: true;
                    bloodPressure: true;
                    painScore: true;
                    bodyConditionScore: true;
                    capillaryRefillSec: true;
                    mucousMembrane: true;
                    notes: true;
                    correctsId: true;
                    editsCount: true;
                    createdAt: true;
                    updatedAt: true;
                    recordedBy: {
                        select: {
                            id: true;
                            name: true;
                        };
                    };
                    correction: {
                        select: {
                            id: true;
                            code: true;
                            recordedAt: true;
                        };
                    };
                };
            };
        };
    };
    readonly activity: {
        readonly select: {
            readonly id: true;
            readonly itemId: true;
            readonly type: true;
            readonly detail: true;
            readonly createdAt: true;
            readonly author: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly comments: {
        readonly select: {
            readonly id: true;
            readonly body: true;
            readonly createdAt: true;
            readonly updatedAt: true;
            readonly author: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly mentions: {
                readonly select: {
                    readonly staff: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
        };
        readonly orderBy: {
            readonly createdAt: "desc";
        };
    };
};
export declare const labItemSelectShape: {
    readonly id: true;
    readonly orderId: true;
    readonly serviceId: true;
    readonly priceSnapshot: true;
    readonly status: true;
    readonly sampleStage: true;
    readonly scheduledAt: true;
    readonly report: true;
    readonly reviewedAt: true;
    readonly rejectedAt: true;
    readonly rejectionReason: true;
    readonly completedAt: true;
    readonly paidAt: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly assignedTo: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly reviewedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly rejectedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly results: {
        readonly select: {
            readonly id: true;
            readonly parameterId: true;
            readonly section: true;
            readonly name: true;
            readonly unit: true;
            readonly refLow: true;
            readonly refHigh: true;
            readonly value: true;
            readonly numericValue: true;
            readonly flag: true;
            readonly notes: true;
            readonly order: true;
        };
    };
    readonly reportMentions: {
        readonly select: {
            readonly staff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly sampleCollection: {
        readonly select: {
            readonly id: true;
            readonly itemId: true;
            readonly tubeType: true;
            readonly drawSite: true;
            readonly volumeMl: true;
            readonly attempts: true;
            readonly collectedAt: true;
            readonly quality: true;
            readonly collectionNotes: true;
            readonly analyzerId: true;
            readonly analyzerName: true;
            readonly handedOverAt: true;
            readonly labelsPrinted: true;
            readonly collectedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
};
export declare const labResultSelectShape: {
    readonly id: true;
    readonly parameterId: true;
    readonly section: true;
    readonly name: true;
    readonly unit: true;
    readonly refLow: true;
    readonly refHigh: true;
    readonly value: true;
    readonly numericValue: true;
    readonly flag: true;
    readonly notes: true;
    readonly order: true;
};
export declare const labInvoiceSelectShape: {
    readonly currencyCode: true;
    readonly labOrderId: true;
    readonly id: true;
    readonly code: true;
    readonly clinicId: true;
    readonly appointmentId: true;
    readonly subtotal: true;
    readonly vatRate: true;
    readonly vatAmount: true;
    readonly discount: true;
    readonly total: true;
    readonly amountPaid: true;
    readonly status: true;
    readonly membershipId: true;
    readonly paymentMethod: true;
    readonly paidAt: true;
    readonly refundedAt: true;
    readonly refundReason: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly membershipAdjustments: {
        select: {
            id: true;
            lineRef: true;
            benefitType: true;
            amount: true;
            unitsConsumed: true;
        };
        orderBy: {
            idx: "asc";
        };
    };
};
export declare const labActivitySelectShape: {
    readonly id: true;
    readonly itemId: true;
    readonly type: true;
    readonly detail: true;
    readonly createdAt: true;
    readonly author: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export declare const labCommentSelectShape: {
    readonly id: true;
    readonly body: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly author: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly mentions: {
        readonly select: {
            readonly staff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
};
export type CreateLabTestOrderInput = Pick<Prisma.LabTestOrderUncheckedCreateInput, "clinicId" | "branchId" | "patientId" | "ownerId"> & Partial<Pick<Prisma.LabTestOrderUncheckedCreateInput, "appointmentId" | "inpatientStayId" | "requestedById" | "priority" | "isUrgent" | "notes">> & {
    serviceIds: string[];
    assignedToId?: string | null;
    origin?: LabOrderOrigin;
};
export type UpdateLabItemInput = Partial<Pick<Prisma.LabTestOrderItemUncheckedUpdateInput, "status" | "sampleStage" | "assignedToId" | "scheduledAt">>;
/**
 * مصدر الطلب يحدّد حالته الأولى:
 * - VISIT: طلبه المدرّب من داخل زيارة → يدخل «الطابور» لمراجعة المختبر
 * - DIRECT: أُنشئ من حوار «طلب تحاليل جديد» → يبدأ «مجدول» مباشرةً
 * الافتراض «الزيارة» لأنه الأكثر تحفّظًا (يمرّ بموافقة بشرية).
 */
export declare const LAB_ORDER_ORIGINS: readonly ["VISIT", "DIRECT"];
export type LabOrderOrigin = (typeof LAB_ORDER_ORIGINS)[number];
export declare const createLabTestSchema: z.ZodObject<{
    branchId: z.ZodString;
    patientId: z.ZodString;
    ownerId: z.ZodString;
    serviceIds: z.ZodArray<z.ZodString>;
    appointmentId: z.ZodOptional<z.ZodString>;
    assignedToId: z.ZodOptional<z.ZodString>;
    requestedById: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly LOW: "LOW";
        readonly MEDIUM: "MEDIUM";
        readonly HIGH: "HIGH";
        readonly URGENT: "URGENT";
    }>>>;
    isUrgent: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
    origin: z.ZodDefault<z.ZodEnum<{
        VISIT: "VISIT";
        DIRECT: "DIRECT";
    }>>;
}, z.core.$strip>;
export type CreateLabTestFormInput = z.input<typeof createLabTestSchema>;
export type CreateLabTestFormValues = z.output<typeof createLabTestSchema>;
export declare const labResultEntrySchema: z.ZodObject<{
    parameterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    section: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    refLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    refHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    value: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    order: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const saveLabResultsSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        parameterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        section: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        refLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        refHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        value: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        order: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type LabResultEntryInput = z.infer<typeof labResultEntrySchema>;
export type SaveLabResultsInput = z.infer<typeof saveLabResultsSchema>;
export declare const rejectLabTestSchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export type RejectLabTestFormInput = z.infer<typeof rejectLabTestSchema>;
/**
 * تأكيد طلب من الطابور → مجدول، مع تعيين فنّي المختبر والأولوية وملاحظة اختيارية.
 * كلها اختيارية: التأكيد وحده كافٍ لنقل الطلب.
 */
export declare const confirmLabTestSchema: z.ZodObject<{
    assignedToId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priority: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly LOW: "LOW";
        readonly MEDIUM: "MEDIUM";
        readonly HIGH: "HIGH";
        readonly URGENT: "URGENT";
    }>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type ConfirmLabTestFormInput = z.input<typeof confirmLabTestSchema>;
export type ConfirmLabTestFormValues = z.output<typeof confirmLabTestSchema>;
/**
 * اعتماد مراجعة ضبط الجودة — معرّفات قواعد Westgard التي اجتازها شوط الجهاز.
 * القواعد المتاحة تأتي من إعدادات فرع الطلب، والتحقّق من تطابقها يجري هناك.
 */
export declare const reviewLabQcSchema: z.ZodObject<{
    rules: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type ReviewLabQcFormInput = z.infer<typeof reviewLabQcSchema>;
/** رفض طلب من الطابور — يُلغى الطلب ويُشعَر المدرّب الطالب بالسبب */
export declare const declineLabTestSchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export type DeclineLabTestFormInput = z.infer<typeof declineLabTestSchema>;
/** تقرير المراجعة — مطلوب قبل اعتماد النتائج، مع إشارات (@) اختيارية */
export declare const approveLabTestSchema: z.ZodObject<{
    report: z.ZodString;
    mentionedStaffIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type ApproveLabTestFormInput = z.input<typeof approveLabTestSchema>;
export type ApproveLabTestFormValues = z.output<typeof approveLabTestSchema>;
/** تعليق داخلي على الطلب — نصّ مطلوب وإشارات (@) اختيارية */
export declare const labCommentSchema: z.ZodObject<{
    body: z.ZodString;
    mentionedStaffIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type LabCommentFormInput = z.input<typeof labCommentSchema>;
export type LabCommentFormValues = z.output<typeof labCommentSchema>;
export declare const parseNumeric: (value: string | null | undefined) => number | null;
export declare const computeResultFlag: (value: string | null | undefined, refLow: number | null | undefined, refHigh: number | null | undefined) => LabResultFlag;
export declare const isCriticalFlag: (flag: LabResultFlag) => boolean;
export declare const LAB_FLAG_LABELS: Record<LabResultFlag, string>;
/**
 * «تنويم»: الطلب مكتوب من داخل إقامة، فلا فاتورة له هنا ولا بوّابة سداد —
 * بندُه يدخل فاتورة الإقامة حين يكتمل ويُسدَّد مع الخروج. ليس «مدفوعًا» (لم
 * يُدفع شيء) وليس «غير مفوتر» (المنع هناك مقصود)، فهو حالة ثالثة باسمها.
 */
export type LabPaymentStatus = "PAID" | "UNPAID" | "UNBILLED" | "INPATIENT";
/** دالة نقية تُستخدم في الخادم والواجهة معًا */
export declare const labPaymentStatus: (order: {
    invoice: {
        status: string;
        paidAt: Date | string | null;
    } | null;
    inpatientStayId?: string | null;
}) => LabPaymentStatus;
/**
 * لا يتقدّم التحليل إلا مسدَّدًا. «غير مفوتر» ممنوع أيضًا —
 * الطلب بلا فاتورة يجب أن يُفوتَر ويُسدَّد أولًا.
 */
export declare const canLeaveQueue: (status: LabPaymentStatus) => boolean;
/**
 * الحالات التي لا يتقدّم منها التحليل قبل السداد. «مجدول» منها لأن الطلب
 * المنشأ من حوار «طلب تحاليل جديد» يبدأ مجدولًا فلا يمرّ بالطابور أصلًا —
 * ولولا ذلك لتخطّى البوابة كلها.
 */
export declare const isPaymentGatedStatus: (status: LabTestStatus) => boolean;
export declare const LAB_PAYMENT_META: Record<LabPaymentStatus, {
    label: string;
    className: string;
}>;
export declare const UNPAID_BLOCK_MESSAGE = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u0645\u0636\u064A\u0651 \u0641\u064A \u0627\u0644\u062A\u062D\u0627\u0644\u064A\u0644 \u0642\u0628\u0644 \u0633\u062F\u0627\u062F \u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u0637\u0644\u0628";
export declare const UNBILLED_BLOCK_MESSAGE = "\u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0641\u0648\u062A\u0631 \u2014 \u0623\u0635\u062F\u0650\u0631 \u0641\u0627\u062A\u0648\u0631\u062A\u0647 \u0648\u0633\u062F\u0650\u0651\u062F\u0647\u0627 \u0642\u0628\u0644 \u0627\u0644\u0645\u0636\u064A\u0651 \u0641\u064A \u0627\u0644\u062A\u062D\u0627\u0644\u064A\u0644";
/** رسالة المنع المناسبة لحالة السداد */
export declare const paymentBlockMessage: (status: LabPaymentStatus) => string;
export declare const LAB_ACTIVITY_LABELS: Record<LabActivityType, string>;
export type LabTestsPeriod = "day" | "week" | "all";
export type LabTestsView = "all" | "for-me";
export declare const LAB_SAMPLE_STAGES: ("NOT_COLLECTED" | "COLLECTED" | "QUALITY_CHECK" | "LABEL_PRINT" | "ANALYZER_ASSIGNMENT" | "HANDOVER_SUMMARY" | "ANALYZING" | "RESULTS_READY")[];
export declare const LAB_TEST_STATUSES: ("CANCELLED" | "COMPLETED" | "SCHEDULED" | "QUEUE" | "SAMPLE_COLLECTION" | "IN_LAB" | "UNDER_REVIEW")[];
export {};
