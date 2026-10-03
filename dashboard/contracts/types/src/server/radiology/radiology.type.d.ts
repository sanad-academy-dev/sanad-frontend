import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { RadiologyActivityType, RadiologyLaterality, RadiologyStatus } from "@/generated/prisma/enums";
declare const radiologyReportSelect: {
    readonly id: true;
    readonly itemId: true;
    readonly technique: true;
    readonly comparison: true;
    readonly findings: true;
    readonly impression: true;
    readonly recommendations: true;
    readonly criticalFinding: true;
    readonly criticalNotifiedAt: true;
    readonly criticalNotifiedTo: true;
    readonly criticalNotifiedToId: true;
    readonly aiDrafted: true;
    readonly updatedAt: true;
    readonly authoredBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type RadiologyReportResponse = Prisma.RadiologyReportGetPayload<{
    select: typeof radiologyReportSelect;
}>;
declare const radiologyItemSelect: {
    readonly id: true;
    readonly orderId: true;
    readonly serviceId: true;
    readonly accession: true;
    readonly priceSnapshot: true;
    readonly status: true;
    readonly stage: true;
    readonly modality: true;
    readonly bodyPart: true;
    readonly laterality: true;
    readonly views: true;
    readonly withContrast: true;
    readonly scheduledAt: true;
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
    readonly execution: {
        readonly select: {
            readonly id: true;
            readonly itemId: true;
            readonly machineId: true;
            readonly machineName: true;
            readonly roomName: true;
            readonly positioning: true;
            readonly sedationUsed: true;
            readonly sedationAgent: true;
            readonly readyAt: true;
            readonly startedAt: true;
            readonly finishedAt: true;
            readonly viewsPerformed: true;
            readonly exposuresCount: true;
            readonly retakeCount: true;
            readonly kvp: true;
            readonly mas: true;
            readonly doseDap: true;
            readonly ctdiVol: true;
            readonly dlp: true;
            readonly contrastUsed: true;
            readonly contrastAgent: true;
            readonly contrastRoute: true;
            readonly contrastVolumeMl: true;
            readonly contrastLot: true;
            readonly imageQuality: true;
            readonly qcNotes: true;
            readonly executionNotes: true;
            readonly performedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly report: {
        readonly select: {
            readonly id: true;
            readonly itemId: true;
            readonly technique: true;
            readonly comparison: true;
            readonly findings: true;
            readonly impression: true;
            readonly recommendations: true;
            readonly criticalFinding: true;
            readonly criticalNotifiedAt: true;
            readonly criticalNotifiedTo: true;
            readonly criticalNotifiedToId: true;
            readonly aiDrafted: true;
            readonly updatedAt: true;
            readonly authoredBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly studies: {
        readonly select: {
            readonly id: true;
            readonly itemId: true;
            readonly studyUid: true;
            readonly description: true;
            readonly studyDate: true;
            readonly modality: true;
            readonly createdAt: true;
            readonly uploadedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly series: {
                readonly select: {
                    readonly id: true;
                    readonly seriesUid: true;
                    readonly seriesNumber: true;
                    readonly modalityCode: true;
                    readonly description: true;
                    readonly bodyPart: true;
                    readonly instances: {
                        readonly select: {
                            readonly id: true;
                            readonly sopUid: true;
                            readonly instanceNumber: true;
                            readonly kind: true;
                            readonly fileName: true;
                            readonly sizeBytes: true;
                            readonly mimeType: true;
                            readonly transferSyntax: true;
                            readonly rows: true;
                            readonly columns: true;
                            readonly frames: true;
                        };
                        readonly orderBy: {
                            readonly instanceNumber: "asc";
                        };
                    };
                };
                readonly orderBy: {
                    readonly seriesNumber: "asc";
                };
            };
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
};
export type RadiologyItemResponse = Prisma.RadiologyOrderItemGetPayload<{
    select: typeof radiologyItemSelect;
}>;
declare const radiologyInvoiceSelect: {
    readonly currencyCode: true;
    readonly radiologyOrderId: true;
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
export type RadiologyInvoiceResponse = Prisma.InvoiceGetPayload<{
    select: typeof radiologyInvoiceSelect;
}>;
declare const radiologyActivitySelect: {
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
export type RadiologyActivityResponse = Prisma.RadiologyActivityGetPayload<{
    select: typeof radiologyActivitySelect;
}>;
declare const radiologyCommentSelect: {
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
export type RadiologyCommentResponse = Prisma.RadiologyCommentGetPayload<{
    select: typeof radiologyCommentSelect;
}>;
declare const radiologyOrderSelect: {
    readonly id: true;
    readonly code: true;
    readonly clinicId: true;
    readonly branchId: true;
    readonly patientId: true;
    readonly ownerId: true;
    readonly appointmentId: true;
    readonly isUrgent: true;
    readonly priority: true;
    readonly clinicalInfo: true;
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
            readonly accession: true;
            readonly priceSnapshot: true;
            readonly status: true;
            readonly stage: true;
            readonly modality: true;
            readonly bodyPart: true;
            readonly laterality: true;
            readonly views: true;
            readonly withContrast: true;
            readonly scheduledAt: true;
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
            readonly execution: {
                readonly select: {
                    readonly id: true;
                    readonly itemId: true;
                    readonly machineId: true;
                    readonly machineName: true;
                    readonly roomName: true;
                    readonly positioning: true;
                    readonly sedationUsed: true;
                    readonly sedationAgent: true;
                    readonly readyAt: true;
                    readonly startedAt: true;
                    readonly finishedAt: true;
                    readonly viewsPerformed: true;
                    readonly exposuresCount: true;
                    readonly retakeCount: true;
                    readonly kvp: true;
                    readonly mas: true;
                    readonly doseDap: true;
                    readonly ctdiVol: true;
                    readonly dlp: true;
                    readonly contrastUsed: true;
                    readonly contrastAgent: true;
                    readonly contrastRoute: true;
                    readonly contrastVolumeMl: true;
                    readonly contrastLot: true;
                    readonly imageQuality: true;
                    readonly qcNotes: true;
                    readonly executionNotes: true;
                    readonly performedBy: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
            readonly report: {
                readonly select: {
                    readonly id: true;
                    readonly itemId: true;
                    readonly technique: true;
                    readonly comparison: true;
                    readonly findings: true;
                    readonly impression: true;
                    readonly recommendations: true;
                    readonly criticalFinding: true;
                    readonly criticalNotifiedAt: true;
                    readonly criticalNotifiedTo: true;
                    readonly criticalNotifiedToId: true;
                    readonly aiDrafted: true;
                    readonly updatedAt: true;
                    readonly authoredBy: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
            readonly studies: {
                readonly select: {
                    readonly id: true;
                    readonly itemId: true;
                    readonly studyUid: true;
                    readonly description: true;
                    readonly studyDate: true;
                    readonly modality: true;
                    readonly createdAt: true;
                    readonly uploadedBy: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                    readonly series: {
                        readonly select: {
                            readonly id: true;
                            readonly seriesUid: true;
                            readonly seriesNumber: true;
                            readonly modalityCode: true;
                            readonly description: true;
                            readonly bodyPart: true;
                            readonly instances: {
                                readonly select: {
                                    readonly id: true;
                                    readonly sopUid: true;
                                    readonly instanceNumber: true;
                                    readonly kind: true;
                                    readonly fileName: true;
                                    readonly sizeBytes: true;
                                    readonly mimeType: true;
                                    readonly transferSyntax: true;
                                    readonly rows: true;
                                    readonly columns: true;
                                    readonly frames: true;
                                };
                                readonly orderBy: {
                                    readonly instanceNumber: "asc";
                                };
                            };
                        };
                        readonly orderBy: {
                            readonly seriesNumber: "asc";
                        };
                    };
                };
                readonly orderBy: {
                    readonly createdAt: "asc";
                };
            };
        };
    };
    readonly invoice: {
        readonly select: {
            readonly currencyCode: true;
            readonly radiologyOrderId: true;
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
    readonly safetyScreening: {
        readonly select: {
            readonly id: true;
            readonly orderId: true;
            readonly fastingStatus: true;
            readonly fastingHours: true;
            readonly medications: true;
            readonly pregnancyPossible: true;
            readonly metalImplants: true;
            readonly implantNotes: true;
            readonly priorContrastReaction: true;
            readonly allergies: true;
            readonly asaClass: true;
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
            readonly createdAt: "asc";
        };
    };
};
export type RadiologyOrderResponse = Prisma.RadiologyOrderGetPayload<{
    select: typeof radiologyOrderSelect;
}>;
declare const radiologyStudyDetailSelect: {
    readonly item: {
        readonly select: {
            readonly id: true;
            readonly accession: true;
            readonly modality: true;
            readonly bodyPart: true;
            readonly laterality: true;
            readonly service: {
                readonly select: {
                    readonly name: true;
                };
            };
            readonly order: {
                readonly select: {
                    readonly id: true;
                    readonly code: true;
                    readonly clinicalInfo: true;
                    readonly patient: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                            readonly code: true;
                            readonly gender: true;
                            readonly age: true;
                            readonly animalType: {
                                readonly select: {
                                    readonly arName: true;
                                };
                            };
                        };
                    };
                    readonly owner: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
        };
    };
    readonly id: true;
    readonly itemId: true;
    readonly studyUid: true;
    readonly description: true;
    readonly studyDate: true;
    readonly modality: true;
    readonly createdAt: true;
    readonly uploadedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly series: {
        readonly select: {
            readonly id: true;
            readonly seriesUid: true;
            readonly seriesNumber: true;
            readonly modalityCode: true;
            readonly description: true;
            readonly bodyPart: true;
            readonly instances: {
                readonly select: {
                    readonly id: true;
                    readonly sopUid: true;
                    readonly instanceNumber: true;
                    readonly kind: true;
                    readonly fileName: true;
                    readonly sizeBytes: true;
                    readonly mimeType: true;
                    readonly transferSyntax: true;
                    readonly rows: true;
                    readonly columns: true;
                    readonly frames: true;
                };
                readonly orderBy: {
                    readonly instanceNumber: "asc";
                };
            };
        };
        readonly orderBy: {
            readonly seriesNumber: "asc";
        };
    };
};
export type RadiologyStudyDetailResponse = Prisma.RadiologyStudyGetPayload<{
    select: typeof radiologyStudyDetailSelect;
}>;
export declare const radiologyStudyDetailSelectShape: {
    readonly item: {
        readonly select: {
            readonly id: true;
            readonly accession: true;
            readonly modality: true;
            readonly bodyPart: true;
            readonly laterality: true;
            readonly service: {
                readonly select: {
                    readonly name: true;
                };
            };
            readonly order: {
                readonly select: {
                    readonly id: true;
                    readonly code: true;
                    readonly clinicalInfo: true;
                    readonly patient: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                            readonly code: true;
                            readonly gender: true;
                            readonly age: true;
                            readonly animalType: {
                                readonly select: {
                                    readonly arName: true;
                                };
                            };
                        };
                    };
                    readonly owner: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
        };
    };
    readonly id: true;
    readonly itemId: true;
    readonly studyUid: true;
    readonly description: true;
    readonly studyDate: true;
    readonly modality: true;
    readonly createdAt: true;
    readonly uploadedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly series: {
        readonly select: {
            readonly id: true;
            readonly seriesUid: true;
            readonly seriesNumber: true;
            readonly modalityCode: true;
            readonly description: true;
            readonly bodyPart: true;
            readonly instances: {
                readonly select: {
                    readonly id: true;
                    readonly sopUid: true;
                    readonly instanceNumber: true;
                    readonly kind: true;
                    readonly fileName: true;
                    readonly sizeBytes: true;
                    readonly mimeType: true;
                    readonly transferSyntax: true;
                    readonly rows: true;
                    readonly columns: true;
                    readonly frames: true;
                };
                readonly orderBy: {
                    readonly instanceNumber: "asc";
                };
            };
        };
        readonly orderBy: {
            readonly seriesNumber: "asc";
        };
    };
};
export declare const radiologyOrderSelectShape: {
    readonly id: true;
    readonly code: true;
    readonly clinicId: true;
    readonly branchId: true;
    readonly patientId: true;
    readonly ownerId: true;
    readonly appointmentId: true;
    readonly isUrgent: true;
    readonly priority: true;
    readonly clinicalInfo: true;
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
            readonly accession: true;
            readonly priceSnapshot: true;
            readonly status: true;
            readonly stage: true;
            readonly modality: true;
            readonly bodyPart: true;
            readonly laterality: true;
            readonly views: true;
            readonly withContrast: true;
            readonly scheduledAt: true;
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
            readonly execution: {
                readonly select: {
                    readonly id: true;
                    readonly itemId: true;
                    readonly machineId: true;
                    readonly machineName: true;
                    readonly roomName: true;
                    readonly positioning: true;
                    readonly sedationUsed: true;
                    readonly sedationAgent: true;
                    readonly readyAt: true;
                    readonly startedAt: true;
                    readonly finishedAt: true;
                    readonly viewsPerformed: true;
                    readonly exposuresCount: true;
                    readonly retakeCount: true;
                    readonly kvp: true;
                    readonly mas: true;
                    readonly doseDap: true;
                    readonly ctdiVol: true;
                    readonly dlp: true;
                    readonly contrastUsed: true;
                    readonly contrastAgent: true;
                    readonly contrastRoute: true;
                    readonly contrastVolumeMl: true;
                    readonly contrastLot: true;
                    readonly imageQuality: true;
                    readonly qcNotes: true;
                    readonly executionNotes: true;
                    readonly performedBy: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
            readonly report: {
                readonly select: {
                    readonly id: true;
                    readonly itemId: true;
                    readonly technique: true;
                    readonly comparison: true;
                    readonly findings: true;
                    readonly impression: true;
                    readonly recommendations: true;
                    readonly criticalFinding: true;
                    readonly criticalNotifiedAt: true;
                    readonly criticalNotifiedTo: true;
                    readonly criticalNotifiedToId: true;
                    readonly aiDrafted: true;
                    readonly updatedAt: true;
                    readonly authoredBy: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
            readonly studies: {
                readonly select: {
                    readonly id: true;
                    readonly itemId: true;
                    readonly studyUid: true;
                    readonly description: true;
                    readonly studyDate: true;
                    readonly modality: true;
                    readonly createdAt: true;
                    readonly uploadedBy: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                    readonly series: {
                        readonly select: {
                            readonly id: true;
                            readonly seriesUid: true;
                            readonly seriesNumber: true;
                            readonly modalityCode: true;
                            readonly description: true;
                            readonly bodyPart: true;
                            readonly instances: {
                                readonly select: {
                                    readonly id: true;
                                    readonly sopUid: true;
                                    readonly instanceNumber: true;
                                    readonly kind: true;
                                    readonly fileName: true;
                                    readonly sizeBytes: true;
                                    readonly mimeType: true;
                                    readonly transferSyntax: true;
                                    readonly rows: true;
                                    readonly columns: true;
                                    readonly frames: true;
                                };
                                readonly orderBy: {
                                    readonly instanceNumber: "asc";
                                };
                            };
                        };
                        readonly orderBy: {
                            readonly seriesNumber: "asc";
                        };
                    };
                };
                readonly orderBy: {
                    readonly createdAt: "asc";
                };
            };
        };
    };
    readonly invoice: {
        readonly select: {
            readonly currencyCode: true;
            readonly radiologyOrderId: true;
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
    readonly safetyScreening: {
        readonly select: {
            readonly id: true;
            readonly orderId: true;
            readonly fastingStatus: true;
            readonly fastingHours: true;
            readonly medications: true;
            readonly pregnancyPossible: true;
            readonly metalImplants: true;
            readonly implantNotes: true;
            readonly priorContrastReaction: true;
            readonly allergies: true;
            readonly asaClass: true;
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
            readonly createdAt: "asc";
        };
    };
};
export declare const radiologyItemSelectShape: {
    readonly id: true;
    readonly orderId: true;
    readonly serviceId: true;
    readonly accession: true;
    readonly priceSnapshot: true;
    readonly status: true;
    readonly stage: true;
    readonly modality: true;
    readonly bodyPart: true;
    readonly laterality: true;
    readonly views: true;
    readonly withContrast: true;
    readonly scheduledAt: true;
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
    readonly execution: {
        readonly select: {
            readonly id: true;
            readonly itemId: true;
            readonly machineId: true;
            readonly machineName: true;
            readonly roomName: true;
            readonly positioning: true;
            readonly sedationUsed: true;
            readonly sedationAgent: true;
            readonly readyAt: true;
            readonly startedAt: true;
            readonly finishedAt: true;
            readonly viewsPerformed: true;
            readonly exposuresCount: true;
            readonly retakeCount: true;
            readonly kvp: true;
            readonly mas: true;
            readonly doseDap: true;
            readonly ctdiVol: true;
            readonly dlp: true;
            readonly contrastUsed: true;
            readonly contrastAgent: true;
            readonly contrastRoute: true;
            readonly contrastVolumeMl: true;
            readonly contrastLot: true;
            readonly imageQuality: true;
            readonly qcNotes: true;
            readonly executionNotes: true;
            readonly performedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly report: {
        readonly select: {
            readonly id: true;
            readonly itemId: true;
            readonly technique: true;
            readonly comparison: true;
            readonly findings: true;
            readonly impression: true;
            readonly recommendations: true;
            readonly criticalFinding: true;
            readonly criticalNotifiedAt: true;
            readonly criticalNotifiedTo: true;
            readonly criticalNotifiedToId: true;
            readonly aiDrafted: true;
            readonly updatedAt: true;
            readonly authoredBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly studies: {
        readonly select: {
            readonly id: true;
            readonly itemId: true;
            readonly studyUid: true;
            readonly description: true;
            readonly studyDate: true;
            readonly modality: true;
            readonly createdAt: true;
            readonly uploadedBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
            readonly series: {
                readonly select: {
                    readonly id: true;
                    readonly seriesUid: true;
                    readonly seriesNumber: true;
                    readonly modalityCode: true;
                    readonly description: true;
                    readonly bodyPart: true;
                    readonly instances: {
                        readonly select: {
                            readonly id: true;
                            readonly sopUid: true;
                            readonly instanceNumber: true;
                            readonly kind: true;
                            readonly fileName: true;
                            readonly sizeBytes: true;
                            readonly mimeType: true;
                            readonly transferSyntax: true;
                            readonly rows: true;
                            readonly columns: true;
                            readonly frames: true;
                        };
                        readonly orderBy: {
                            readonly instanceNumber: "asc";
                        };
                    };
                };
                readonly orderBy: {
                    readonly seriesNumber: "asc";
                };
            };
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
};
export declare const radiologyReportSelectShape: {
    readonly id: true;
    readonly itemId: true;
    readonly technique: true;
    readonly comparison: true;
    readonly findings: true;
    readonly impression: true;
    readonly recommendations: true;
    readonly criticalFinding: true;
    readonly criticalNotifiedAt: true;
    readonly criticalNotifiedTo: true;
    readonly criticalNotifiedToId: true;
    readonly aiDrafted: true;
    readonly updatedAt: true;
    readonly authoredBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export declare const radiologyInvoiceSelectShape: {
    readonly currencyCode: true;
    readonly radiologyOrderId: true;
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
export declare const radiologyActivitySelectShape: {
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
export type CreateRadiologyOrderInput = Pick<Prisma.RadiologyOrderUncheckedCreateInput, "clinicId" | "branchId" | "patientId" | "ownerId"> & Partial<Pick<Prisma.RadiologyOrderUncheckedCreateInput, "appointmentId" | "inpatientStayId" | "requestedById" | "priority" | "isUrgent" | "clinicalInfo" | "notes">> & {
    serviceIds: string[];
    assignedToId?: string | null;
    origin?: RadiologyOrderOrigin;
    bodyPart?: string | null;
    laterality?: RadiologyLaterality | null;
    views?: string[];
    withContrast?: boolean | null;
    scheduledAt?: Date | null;
};
export type UpdateRadiologyItemInput = Partial<Pick<Prisma.RadiologyOrderItemUncheckedUpdateInput, "status" | "stage" | "assignedToId" | "scheduledAt">>;
declare const radiologyTemplateSelect: {
    readonly id: true;
    readonly name: true;
    readonly modality: true;
    readonly serviceId: true;
    readonly technique: true;
    readonly comparison: true;
    readonly findings: true;
    readonly impression: true;
    readonly recommendations: true;
    readonly isDefault: true;
    readonly active: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type RadiologyTemplateResponse = Prisma.RadiologyReportTemplateGetPayload<{
    select: typeof radiologyTemplateSelect;
}>;
export declare const radiologyTemplateSelectShape: {
    readonly id: true;
    readonly name: true;
    readonly modality: true;
    readonly serviceId: true;
    readonly technique: true;
    readonly comparison: true;
    readonly findings: true;
    readonly impression: true;
    readonly recommendations: true;
    readonly isDefault: true;
    readonly active: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
declare const radiologyAddendumSelect: {
    readonly id: true;
    readonly reportId: true;
    readonly text: true;
    readonly createdAt: true;
    readonly authoredBy: {
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
    readonly attachments: {
        readonly select: {
            readonly id: true;
            readonly fileKey: true;
            readonly fileName: true;
            readonly mimeType: true;
            readonly sizeBytes: true;
        };
    };
};
export type RadiologyAddendumResponse = Prisma.RadiologyReportAddendumGetPayload<{
    select: typeof radiologyAddendumSelect;
}>;
export declare const radiologyAddendumSelectShape: {
    readonly id: true;
    readonly reportId: true;
    readonly text: true;
    readonly createdAt: true;
    readonly authoredBy: {
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
    readonly attachments: {
        readonly select: {
            readonly id: true;
            readonly fileKey: true;
            readonly fileName: true;
            readonly mimeType: true;
            readonly sizeBytes: true;
        };
    };
};
/** فحص سابق للطفل نفسه — ما يكفي لعرضه في المقارنة وفتح صوره */
declare const priorExamSelect: {
    readonly id: true;
    readonly accession: true;
    readonly modality: true;
    readonly bodyPart: true;
    readonly laterality: true;
    readonly completedAt: true;
    readonly createdAt: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly report: {
        readonly select: {
            readonly findings: true;
            readonly impression: true;
            readonly criticalFinding: true;
        };
    };
    readonly studies: {
        readonly select: {
            readonly id: true;
            readonly description: true;
            readonly studyDate: true;
            readonly series: {
                readonly select: {
                    readonly id: true;
                    readonly instances: {
                        readonly select: {
                            readonly id: true;
                        };
                    };
                };
            };
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly order: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly clinicalInfo: true;
        };
    };
};
export type RadiologyPriorExamResponse = Prisma.RadiologyOrderItemGetPayload<{
    select: typeof priorExamSelect;
}>;
export declare const radiologyPriorExamSelectShape: {
    readonly id: true;
    readonly accession: true;
    readonly modality: true;
    readonly bodyPart: true;
    readonly laterality: true;
    readonly completedAt: true;
    readonly createdAt: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly report: {
        readonly select: {
            readonly findings: true;
            readonly impression: true;
            readonly criticalFinding: true;
        };
    };
    readonly studies: {
        readonly select: {
            readonly id: true;
            readonly description: true;
            readonly studyDate: true;
            readonly series: {
                readonly select: {
                    readonly id: true;
                    readonly instances: {
                        readonly select: {
                            readonly id: true;
                        };
                    };
                };
            };
        };
        readonly orderBy: {
            readonly createdAt: "asc";
        };
    };
    readonly order: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly clinicalInfo: true;
        };
    };
};
/**
 * زمن الإنجاز يُقاس على الفحوصات المكتملة وحدها: من إنشاء الطلب إلى اعتماد
 * التقرير. الوسيط أصدق من المتوسّط هنا لأن فحصًا واحدًا منسيًّا أسبوعًا
 * يجرّ المتوسّط وحده.
 */
export type RadiologyTatMetrics = {
    completedCount: number;
    /** بالدقائق */
    medianMinutes: number | null;
    p90Minutes: number | null;
    /** الفحوصات القائمة التي تجاوزت عتبة التنبيه */
    overdueCount: number;
    /** توزيع الفحوصات القائمة على الحالات */
    openByStatus: Record<string, number>;
    /** أطول الفحوصات القائمة انتظارًا */
    oldestOpen: {
        itemId: string;
        orderId: string;
        accession: string;
        serviceName: string;
        patientName: string;
        status: string;
        waitingMinutes: number;
    }[];
};
/**
 * مصدر الطلب يحدّد حالته الأولى:
 * - VISIT: طلبه المدرّب من داخل زيارة → يدخل «الطلبات» لمراجعة قسم الأشعة
 * - DIRECT: أُنشئ من حوار «طلب أشعة جديد» → يبدأ «مجدول» مباشرةً
 * الافتراض «الزيارة» لأنه الأكثر تحفّظًا (يمرّ بموافقة بشرية).
 */
export declare const RADIOLOGY_ORDER_ORIGINS: readonly ["VISIT", "DIRECT"];
export type RadiologyOrderOrigin = (typeof RADIOLOGY_ORDER_ORIGINS)[number];
export declare const createRadiologyOrderSchema: z.ZodObject<{
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
    clinicalInfo: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
    bodyPart: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    laterality: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NONE: "NONE";
        readonly LEFT: "LEFT";
        readonly RIGHT: "RIGHT";
        readonly BILATERAL: "BILATERAL";
    }>>>;
    views: z.ZodDefault<z.ZodArray<z.ZodString>>;
    withContrast: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    origin: z.ZodDefault<z.ZodEnum<{
        VISIT: "VISIT";
        DIRECT: "DIRECT";
    }>>;
    scheduledAt: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
}, z.core.$strip>;
export type CreateRadiologyOrderFormInput = z.input<typeof createRadiologyOrderSchema>;
export type CreateRadiologyOrderFormValues = z.output<typeof createRadiologyOrderSchema>;
/** حفظ التقرير — أقسام التقرير القياسية، كلها اختيارية ليُحفظ تدريجيًا */
export declare const radiologyReportSchema: z.ZodObject<{
    technique: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    comparison: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    findings: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    impression: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    recommendations: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    criticalFinding: z.ZodDefault<z.ZodBoolean>;
    criticalNotifiedTo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    criticalNotifiedToId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RadiologyReportFormInput = z.input<typeof radiologyReportSchema>;
export type RadiologyReportFormValues = z.output<typeof radiologyReportSchema>;
export declare const rejectRadiologySchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export type RejectRadiologyFormInput = z.infer<typeof rejectRadiologySchema>;
/**
 * تأكيد طلب من الطلبات → مجدول، مع تعيين فنّي الأشعة والأولوية وملاحظة اختيارية.
 * الموعد وحده إلزامي: «مجدول» بلا موعد حالة بلا معنى، والفحص يبقى فيها حتى
 * يحين موعده (isRadiologyDue).
 */
export declare const confirmRadiologySchema: z.ZodObject<{
    scheduledAt: z.ZodCoercedDate<unknown>;
    assignedToId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priority: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly LOW: "LOW";
        readonly MEDIUM: "MEDIUM";
        readonly HIGH: "HIGH";
        readonly URGENT: "URGENT";
    }>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type ConfirmRadiologyFormInput = z.input<typeof confirmRadiologySchema>;
export type ConfirmRadiologyFormValues = z.output<typeof confirmRadiologySchema>;
/** إعادة جدولة فحص مجدول — الموعد إلزامي والسبب اختياري ويُسجَّل في النشاط */
export declare const rescheduleRadiologySchema: z.ZodObject<{
    scheduledAt: z.ZodCoercedDate<unknown>;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RescheduleRadiologyFormInput = z.input<typeof rescheduleRadiologySchema>;
export type RescheduleRadiologyFormValues = z.output<typeof rescheduleRadiologySchema>;
/** رفض طلب من الطلبات — يُلغى الطلب ويُشعَر المدرّب الطالب بالسبب */
export declare const declineRadiologySchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export type DeclineRadiologyFormInput = z.infer<typeof declineRadiologySchema>;
/** اعتماد التقرير — ملاحظة اختيارية للمراجع؛ التقرير نفسه محفوظ مسبقًا */
export declare const approveRadiologySchema: z.ZodObject<{
    note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type ApproveRadiologyFormInput = z.infer<typeof approveRadiologySchema>;
/** قالب تقرير — الاسم إلزامي وبقيّة الأقسام اختيارية */
export declare const radiologyTemplateSchema: z.ZodObject<{
    name: z.ZodString;
    modality: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly XRAY: "XRAY";
        readonly CT: "CT";
        readonly MRI: "MRI";
        readonly ULTRASOUND: "ULTRASOUND";
        readonly FLUOROSCOPY: "FLUOROSCOPY";
        readonly MAMMOGRAPHY: "MAMMOGRAPHY";
        readonly NUCLEAR: "NUCLEAR";
        readonly PET: "PET";
        readonly DENTAL: "DENTAL";
        readonly OTHER: "OTHER";
    }>>>;
    serviceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    technique: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    comparison: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    findings: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    impression: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    recommendations: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
    active: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type RadiologyTemplateFormInput = z.input<typeof radiologyTemplateSchema>;
export type RadiologyTemplateFormValues = z.output<typeof radiologyTemplateSchema>;
/** ملحق تقرير — النص إلزامي إلا إذا رُفع ملف، فالملحق الفارغ تمامًا لا معنى له */
export declare const radiologyAddendumSchema: z.ZodObject<{
    text: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    mentionedStaffIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    attachments: z.ZodDefault<z.ZodArray<z.ZodObject<{
        fileKey: z.ZodString;
        fileName: z.ZodString;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/** تعليق على الطلب — نقاش الفريق، بإشارات اختيارية */
export declare const radiologyCommentSchema: z.ZodObject<{
    body: z.ZodString;
    mentionedStaffIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type RadiologyCommentFormInput = z.infer<typeof radiologyCommentSchema>;
export type RadiologyAddendumFormInput = z.infer<typeof radiologyAddendumSchema>;
/**
 * «تنويم»: الطلب مكتوب من داخل إقامة، فلا فاتورة له هنا ولا بوّابة سداد —
 * بندُه يدخل فاتورة الإقامة حين يكتمل ويُسدَّد مع الخروج. ليس «مدفوعًا» (لم
 * يُدفع شيء) وليس «غير مفوتر» (المنع هناك مقصود)، فهو حالة ثالثة باسمها.
 */
export type RadiologyPaymentStatus = "PAID" | "UNPAID" | "UNBILLED" | "INPATIENT";
/** دالة نقية تُستخدم في الخادم والواجهة معًا */
export declare const radiologyPaymentStatus: (order: {
    invoice: {
        status: string;
        paidAt: Date | string | null;
    } | null;
    inpatientStayId?: string | null;
}) => RadiologyPaymentStatus;
/**
 * لا يتقدّم الفحص إلا مسدَّدًا. «غير مفوتر» ممنوع أيضًا —
 * الطلب بلا فاتورة يجب أن يُفوتَر ويُسدَّد أولًا.
 */
export declare const canLeaveRadiologyQueue: (status: RadiologyPaymentStatus) => boolean;
/**
 * الحالات التي لا يتقدّم منها الفحص قبل السداد. «مجدول» منها لأن الطلب
 * المنشأ من حوار «طلب أشعة جديد» يبدأ مجدولًا فلا يمرّ بالطلبات أصلًا —
 * ولولا ذلك لتخطّى البوابة كلها.
 */
export declare const isRadiologyPaymentGatedStatus: (status: RadiologyStatus) => boolean;
export declare const RADIOLOGY_PAYMENT_META: Record<RadiologyPaymentStatus, {
    label: string;
    className: string;
}>;
export declare const RADIOLOGY_UNPAID_BLOCK_MESSAGE = "\u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u0645\u0636\u064A\u0651 \u0641\u064A \u0627\u0644\u0641\u062D\u0648\u0635\u0627\u062A \u0642\u0628\u0644 \u0633\u062F\u0627\u062F \u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u0637\u0644\u0628";
export declare const RADIOLOGY_UNBILLED_BLOCK_MESSAGE = "\u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0641\u0648\u062A\u0631 \u2014 \u0623\u0635\u062F\u0650\u0631 \u0641\u0627\u062A\u0648\u0631\u062A\u0647 \u0648\u0633\u062F\u0650\u0651\u062F\u0647\u0627 \u0642\u0628\u0644 \u0627\u0644\u0645\u0636\u064A\u0651 \u0641\u064A \u0627\u0644\u0641\u062D\u0648\u0635\u0627\u062A";
/** رسالة المنع المناسبة لحالة السداد */
export declare const radiologyPaymentBlockMessage: (status: RadiologyPaymentStatus) => string;
export declare const LATERALITY_LABELS: Record<RadiologyLaterality, string>;
export declare const RADIOLOGY_ACTIVITY_LABELS: Record<RadiologyActivityType, string>;
export type RadiologyPeriod = "day" | "week" | "all";
export type RadiologyView = "all" | "for-me";
export declare const RADIOLOGY_STAGES: ("SAFETY_SCREENING" | "PATIENT_PREP" | "ROOM_ASSIGNMENT" | "READY_CHECK" | "ACQUISITION" | "IMAGE_UPLOAD" | "IMAGE_QC")[];
export declare const RADIOLOGY_STATUSES: ("CANCELLED" | "COMPLETED" | "SCHEDULED" | "QUEUE" | "UNDER_REVIEW" | "PREPARATION" | "IMAGING" | "REPORTING")[];
export {};
