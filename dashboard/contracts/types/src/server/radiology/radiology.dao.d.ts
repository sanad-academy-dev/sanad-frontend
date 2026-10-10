import { Prisma } from "@/generated/prisma/client";
import { RadiologyActivityType, type RadiologyModality, RadiologyStage, RadiologyStatus, TaskPriority } from "@/generated/prisma/enums";
import { type CreateRadiologyOrderInput, type RadiologyPeriod, type RadiologyTatMetrics } from "@/server/radiology/radiology.type";
import type { RegisterStudyInput } from "@/server/radiology/radiology-procedure.type";
/** مدخل قالب التقرير — نفس الحقول للإنشاء والتعديل */
type TemplateInput = {
    name: string;
    modality?: string | null;
    serviceId?: string | null;
    technique?: string | null;
    comparison?: string | null;
    findings?: string | null;
    impression?: string | null;
    recommendations?: string | null;
    isDefault?: boolean;
    active?: boolean;
};
declare const orderByItem: (itemId: string) => Promise<{
    comments: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        body: string;
        author: {
            name: string;
            id: string;
        };
        mentions: {
            staff: {
                name: string;
                id: string;
            };
        }[];
    }[];
    branch: {
        name: string;
        id: string;
    };
    owner: {
        name: string;
        id: string;
        phone: string;
    };
    patient: {
        animalType: {
            id: string;
            arName: string;
        };
        animalStrain: {
            id: string;
            arName: string;
        } | null;
        name: string;
        id: string;
        code: string;
        gender: import("@/generated/prisma/enums").Gender;
        age: number | null;
    };
    appointment: {
        id: string;
        code: string;
        startsAt: Date;
    } | null;
    invoice: {
        discount: import("@prisma/client-runtime-utils").Decimal;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        vatRate: import("@prisma/client-runtime-utils").Decimal;
        currencyCode: string;
        code: string;
        status: import("@/generated/prisma/enums").InvoiceStatus;
        total: import("@prisma/client-runtime-utils").Decimal;
        vatAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
        paidAt: Date | null;
        appointmentId: string | null;
        radiologyOrderId: string | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
        membershipId: string | null;
        refundedAt: Date | null;
        refundReason: string | null;
        membershipAdjustments: {
            id: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            lineRef: string;
            benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
            unitsConsumed: number;
        }[];
    } | null;
    priority: TaskPriority | null;
    id: string;
    clinicId: string;
    createdAt: Date;
    updatedAt: Date;
    code: string;
    branchId: string;
    notes: string | null;
    items: {
        service: {
            name: string;
            id: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        report: {
            id: string;
            updatedAt: Date;
            itemId: string;
            authoredBy: {
                name: string;
                id: string;
            } | null;
            findings: string | null;
            technique: string | null;
            comparison: string | null;
            impression: string | null;
            recommendations: string | null;
            criticalFinding: boolean;
            criticalNotifiedAt: Date | null;
            criticalNotifiedTo: string | null;
            criticalNotifiedToId: string | null;
            aiDrafted: boolean;
        } | null;
        status: RadiologyStatus;
        serviceId: string;
        paidAt: Date | null;
        rejectionReason: string | null;
        completedAt: Date | null;
        orderId: string;
        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
        scheduledAt: Date | null;
        reviewedAt: Date | null;
        rejectedAt: Date | null;
        assignedTo: {
            name: string;
            id: string;
        } | null;
        reviewedBy: {
            name: string;
            id: string;
        } | null;
        rejectedBy: {
            name: string;
            id: string;
        } | null;
        accession: string;
        stage: RadiologyStage;
        modality: RadiologyModality;
        bodyPart: string | null;
        laterality: import("@/generated/prisma/enums").RadiologyLaterality;
        views: string[];
        withContrast: boolean;
        execution: {
            id: string;
            startedAt: Date | null;
            finishedAt: Date | null;
            itemId: string;
            performedBy: {
                name: string;
                id: string;
            } | null;
            readyAt: Date | null;
            machineId: string | null;
            machineName: string | null;
            roomName: string | null;
            positioning: string | null;
            sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
            sedationAgent: string | null;
            viewsPerformed: string[];
            exposuresCount: number | null;
            retakeCount: number | null;
            kvp: import("@prisma/client-runtime-utils").Decimal | null;
            mas: import("@prisma/client-runtime-utils").Decimal | null;
            doseDap: import("@prisma/client-runtime-utils").Decimal | null;
            ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
            dlp: import("@prisma/client-runtime-utils").Decimal | null;
            contrastUsed: boolean | null;
            contrastAgent: string | null;
            contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
            contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
            contrastLot: string | null;
            imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
            qcNotes: string | null;
            executionNotes: string | null;
        } | null;
        studies: {
            id: string;
            createdAt: Date;
            description: string | null;
            itemId: string;
            modality: RadiologyModality | null;
            series: {
                id: string;
                description: string | null;
                bodyPart: string | null;
                seriesUid: string;
                seriesNumber: number | null;
                modalityCode: string | null;
                instances: {
                    id: string;
                    rows: number | null;
                    fileName: string | null;
                    kind: import("@/generated/prisma/enums").RadiologyImageKind;
                    mimeType: string | null;
                    sizeBytes: number | null;
                    sopUid: string;
                    instanceNumber: number | null;
                    transferSyntax: string | null;
                    columns: number | null;
                    frames: number | null;
                }[];
            }[];
            studyUid: string;
            studyDate: Date | null;
            uploadedBy: {
                name: string;
                id: string;
            } | null;
        }[];
    }[];
    appointmentId: string | null;
    inpatientStayId: string | null;
    patientId: string;
    ownerId: string;
    activity: {
        type: RadiologyActivityType;
        id: string;
        createdAt: Date;
        detail: string | null;
        itemId: string | null;
        author: {
            name: string;
            id: string;
        } | null;
    }[];
    isUrgent: boolean;
    requestedBy: {
        name: string;
        id: string;
        phone: string | null;
    } | null;
    clinicalInfo: string | null;
    safetyScreening: {
        id: string;
        vitalsRecordId: string | null;
        vitalsRecord: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            branchId: string | null;
            notes: string | null;
            editsCount: number;
            operationId: string | null;
            appointmentId: string | null;
            labOrderId: string | null;
            radiologyOrderId: string | null;
            patientId: string;
            source: import("@/generated/prisma/enums").VitalSignsSource;
            weight: import("@prisma/client-runtime-utils").Decimal | null;
            recordedAt: Date;
            temperature: import("@prisma/client-runtime-utils").Decimal | null;
            heartRate: number | null;
            respiratoryRate: number | null;
            oxygenSaturation: number | null;
            bloodPressure: string | null;
            painScore: number | null;
            bodyConditionScore: number | null;
            capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
            mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
            correctsId: string | null;
            recordedBy: {
                name: string;
                id: string;
            } | null;
            correction: {
                id: string;
                code: string;
                recordedAt: Date;
            } | null;
        } | null;
        orderId: string;
        fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
        fastingHours: number | null;
        medications: string[];
        pregnancyPossible: boolean | null;
        metalImplants: boolean | null;
        implantNotes: string | null;
        priorContrastReaction: boolean | null;
        allergies: string | null;
        asaClass: number | null;
    } | null;
} | null>;
export declare const radiologyDao: {
    list(clinicId: string, options?: {
        period?: RadiologyPeriod;
        assignedToId?: string;
        branchId?: string;
        appointmentId?: string;
    }): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    }[]>;
    /** هل يشترط أي من هذه الفحوصات تحديد الجهة؟ (من تعريفاتها في الأكاديمية) */
    requiresLaterality(serviceIds: string[], clinicId: string): Promise<boolean>;
    findById(id: string, clinicId: string): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    findItem(itemId: string, clinicId: string): Promise<{
        service: {
            name: string;
            id: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        report: {
            id: string;
            updatedAt: Date;
            itemId: string;
            authoredBy: {
                name: string;
                id: string;
            } | null;
            findings: string | null;
            technique: string | null;
            comparison: string | null;
            impression: string | null;
            recommendations: string | null;
            criticalFinding: boolean;
            criticalNotifiedAt: Date | null;
            criticalNotifiedTo: string | null;
            criticalNotifiedToId: string | null;
            aiDrafted: boolean;
        } | null;
        status: RadiologyStatus;
        serviceId: string;
        paidAt: Date | null;
        rejectionReason: string | null;
        completedAt: Date | null;
        orderId: string;
        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
        scheduledAt: Date | null;
        reviewedAt: Date | null;
        rejectedAt: Date | null;
        assignedTo: {
            name: string;
            id: string;
        } | null;
        reviewedBy: {
            name: string;
            id: string;
        } | null;
        rejectedBy: {
            name: string;
            id: string;
        } | null;
        accession: string;
        stage: RadiologyStage;
        modality: RadiologyModality;
        bodyPart: string | null;
        laterality: import("@/generated/prisma/enums").RadiologyLaterality;
        views: string[];
        withContrast: boolean;
        execution: {
            id: string;
            startedAt: Date | null;
            finishedAt: Date | null;
            itemId: string;
            performedBy: {
                name: string;
                id: string;
            } | null;
            readyAt: Date | null;
            machineId: string | null;
            machineName: string | null;
            roomName: string | null;
            positioning: string | null;
            sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
            sedationAgent: string | null;
            viewsPerformed: string[];
            exposuresCount: number | null;
            retakeCount: number | null;
            kvp: import("@prisma/client-runtime-utils").Decimal | null;
            mas: import("@prisma/client-runtime-utils").Decimal | null;
            doseDap: import("@prisma/client-runtime-utils").Decimal | null;
            ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
            dlp: import("@prisma/client-runtime-utils").Decimal | null;
            contrastUsed: boolean | null;
            contrastAgent: string | null;
            contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
            contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
            contrastLot: string | null;
            imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
            qcNotes: string | null;
            executionNotes: string | null;
        } | null;
        studies: {
            id: string;
            createdAt: Date;
            description: string | null;
            itemId: string;
            modality: RadiologyModality | null;
            series: {
                id: string;
                description: string | null;
                bodyPart: string | null;
                seriesUid: string;
                seriesNumber: number | null;
                modalityCode: string | null;
                instances: {
                    id: string;
                    rows: number | null;
                    fileName: string | null;
                    kind: import("@/generated/prisma/enums").RadiologyImageKind;
                    mimeType: string | null;
                    sizeBytes: number | null;
                    sopUid: string;
                    instanceNumber: number | null;
                    transferSyntax: string | null;
                    columns: number | null;
                    frames: number | null;
                }[];
            }[];
            studyUid: string;
            studyDate: Date | null;
            uploadedBy: {
                name: string;
                id: string;
            } | null;
        }[];
    } | null>;
    /**
     * إنشاء طلب أشعة: الطلب + عناصره بلقطات أسعارها وخصائص فحوصاتها من
     * التعريفات + فاتورته + قيد الإنشاء. لكل فحص رقم وصول (Accession) فريد.
     */
    create(input: CreateRadiologyOrderInput): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /** تغيير حالة فحص واحد؛ الرفض/القبول لهما دوال مخصّصة أدناه */
    updateItemStatus(itemId: string, clinicId: string, status: RadiologyStatus, userId?: string | null): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    updateItemStage(itemId: string, clinicId: string, stage: RadiologyStage, userId?: string | null): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /**
     * إعادة جدولة فحص. مسموحة ما دام الفحص لم يبدأ فعليًا (الطلبات/مجدول):
     * بعد بدء التحضير صار الموعد تاريخًا لا خطة، فتعديله يزوّر السجل.
     */
    rescheduleItem(itemId: string, clinicId: string, scheduledAt: Date, reason: string | null, userId?: string | null): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | {
        error: "لا يمكن تغيير موعد فحص بدأ العمل عليه";
    } | null>;
    /** قوالب الأكاديمية، مرتّبة: قوالب الفحص أولًا ثم قوالب طريقة التصوير */
    listTemplates(clinicId: string, filter?: {
        serviceId?: string;
        modality?: string;
    }): Promise<{
        service: {
            name: string;
            id: string;
        } | null;
        name: string;
        id: string;
        isDefault: boolean;
        active: boolean;
        serviceId: string | null;
        modality: RadiologyModality | null;
        findings: string | null;
        technique: string | null;
        comparison: string | null;
        impression: string | null;
        recommendations: string | null;
    }[]>;
    /** كل القوالب بما فيها المعطّلة — لشاشة الإعدادات */
    listAllTemplates(clinicId: string): Promise<{
        service: {
            name: string;
            id: string;
        } | null;
        name: string;
        id: string;
        isDefault: boolean;
        active: boolean;
        serviceId: string | null;
        modality: RadiologyModality | null;
        findings: string | null;
        technique: string | null;
        comparison: string | null;
        impression: string | null;
        recommendations: string | null;
    }[]>;
    createTemplate(clinicId: string, input: TemplateInput): Promise<{
        service: {
            name: string;
            id: string;
        } | null;
        name: string;
        id: string;
        isDefault: boolean;
        active: boolean;
        serviceId: string | null;
        modality: RadiologyModality | null;
        findings: string | null;
        technique: string | null;
        comparison: string | null;
        impression: string | null;
        recommendations: string | null;
    }>;
    updateTemplate(id: string, clinicId: string, input: TemplateInput): Promise<{
        service: {
            name: string;
            id: string;
        } | null;
        name: string;
        id: string;
        isDefault: boolean;
        active: boolean;
        serviceId: string | null;
        modality: RadiologyModality | null;
        findings: string | null;
        technique: string | null;
        comparison: string | null;
        impression: string | null;
        recommendations: string | null;
    } | null>;
    deleteTemplate(id: string, clinicId: string): Promise<boolean>;
    /**
     * إلحاق نص بتقرير معتمد. التقرير الأصل لا يُمسّ — الملحق سطر مستقل
     * مؤرَّخ وموقَّع، وهذا هو الفرق بين التصحيح والتزوير.
     */
    addAddendum(itemId: string, clinicId: string, input: {
        text: string;
        mentionedStaffIds?: string[];
        attachments?: {
            fileKey: string;
            fileName: string;
            mimeType?: string | null;
            sizeBytes?: number | null;
        }[];
    }, userId?: string | null): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | {
        error: "الملحق يُضاف بعد اعتماد التقرير فقط";
    } | {
        error: "لا يوجد تقرير لإلحاقه";
    } | null>;
    /** تعليق على الطلب — نقاش الفريق حوله، بإشارات تُخطر أصحابها */
    addComment(orderId: string, clinicId: string, authorUserId: string, body: string, mentionedStaffIds?: string[]): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    deleteComment(commentId: string, clinicId: string, userId: string): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | {
        error: "لا يمكنك حذف تعليق غيرك";
    } | null>;
    listAddenda(itemId: string, clinicId: string): Promise<{
        text: string;
        attachments: {
            id: string;
            fileName: string;
            mimeType: string | null;
            sizeBytes: number | null;
            fileKey: string;
        }[];
        id: string;
        createdAt: Date;
        mentions: {
            staff: {
                name: string;
                id: string;
            };
        }[];
        authoredBy: {
            name: string;
            id: string;
        } | null;
        reportId: string;
    }[] | null>;
    /**
     * فحوصات سابقة لنفس الطفل — للمقارنة. المطابقة في طريقة التصوير أو
     * المنطقة تُقدَّم، فالمقارنة المفيدة هي بين المِثل ومِثله.
     */
    listPriorExams(itemId: string, clinicId: string, limit?: number): Promise<{
        service: {
            name: string;
            id: string;
        };
        id: string;
        createdAt: Date;
        report: {
            findings: string | null;
            impression: string | null;
            criticalFinding: boolean;
        } | null;
        order: {
            id: string;
            code: string;
            clinicalInfo: string | null;
        };
        completedAt: Date | null;
        accession: string;
        modality: RadiologyModality;
        bodyPart: string | null;
        laterality: import("@/generated/prisma/enums").RadiologyLaterality;
        studies: {
            id: string;
            description: string | null;
            series: {
                id: string;
                instances: {
                    id: string;
                }[];
            }[];
            studyDate: Date | null;
        }[];
    }[] | null>;
    /** زمن الإنجاز والفحوصات المتأخّرة — يقرؤها تبويب المؤشّرات على اللوحة */
    tatMetrics(clinicId: string, overdueHours?: number): Promise<RadiologyTatMetrics>;
    assignItem(itemId: string, clinicId: string, assignedToId: string | null, userId?: string | null): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /**
     * فحص السلامة — على مستوى الطلب (خاص بالطفل لا بالفحص)،
     * فلا يُعاد سؤاله لكل فحص داخل الطلب نفسه.
     */
    saveSafetyScreening(orderId: string, clinicId: string, data: Prisma.RadiologySafetyScreeningUncheckedUpdateInput & Partial<Prisma.RadiologySafetyScreeningUncheckedCreateInput>): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /**
     * بيانات تنفيذ فحص بعينه (التجهيز/الالتقاط/جودة الصور).
     * upsert لأن السجل يُنشأ عند أول حفظ ثم يُحدَّث تدريجيًا عبر الخطوات.
     */
    saveExecution(itemId: string, clinicId: string, data: Prisma.RadiologyExamExecutionUncheckedUpdateInput & Partial<Prisma.RadiologyExamExecutionUncheckedCreateInput>): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /**
     * تعيين جهاز التصوير للفحص. الإتاحة يتحقّق منها الخادم (موصول + مكان
     * شاغر) فلا يكفي تعطيل الخيار في الواجهة.
     */
    assignMachine(itemId: string, clinicId: string, machineId: string | null, userId?: string | null): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | {
        readonly error: string;
    } | null>;
    /**
     * حفظ بيانات الالتقاط — أول حفظ يختم بداية التصوير، وكل حفظ يجدّد نهايته.
     */
    saveAcquisition(itemId: string, clinicId: string, data: Prisma.RadiologyExamExecutionUncheckedUpdateInput & Partial<Prisma.RadiologyExamExecutionUncheckedCreateInput>): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /**
     * تسجيل دراسة DICOM مرفوعة: الدراسة والسلاسل تُثبَّت بمعرّفاتها العالمية
     * (upsert) والصور تُضاف بلا تكرار — فإعادة رفع الملفات نفسها آمنة.
     */
    registerStudy(itemId: string, clinicId: string, userId: string | null, input: RegisterStudyInput): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | {
        readonly error: "هذه الدراسة مسجّلة على فحص آخر — تحقّق من الملفات المرفوعة";
    } | null>;
    /** عدد صور الفحص — بوابة مغادرة مرحلة رفع الصور */
    countInstances(itemId: string): Promise<number>;
    /**
     * حفظ التقرير (upsert) دون تغيير الحالة. تفعيل «نتيجة حرجة» أول مرة
     * يختم وقت التبليغ ويقيّده في سجل النشاط — التوثيق الزمني جزء من المعيار.
     */
    saveReport(itemId: string, clinicId: string, userId: string | null, data: {
        technique?: string | null;
        comparison?: string | null;
        findings?: string | null;
        impression?: string | null;
        recommendations?: string | null;
        criticalFinding?: boolean;
        criticalNotifiedTo?: string | null;
        criticalNotifiedToId?: string | null;
        aiDrafted?: boolean;
    }): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /** اعتماد المراجعة → مكتملة (ويُمسح أثر الرفض السابق) */
    approve(itemId: string, clinicId: string, reviewerId: string | null, note?: string | null): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /** رفض المراجعة → العودة إلى كتابة التقرير مع شارة "تم رفضها" */
    reject(itemId: string, clinicId: string, reviewerId: string | null, reason: string): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /**
     * تغيير أولوية الطلب وحدها. isUrgent يُشتق منها (URGENT ⇔ true) لأن ترتيب
     * اللوحة وشارة «عاجلة» يعتمدانه — نفس اشتقاق التأكيد من الطلبات.
     */
    updatePriority(orderId: string, clinicId: string, priority: TaskPriority | null, userId?: string | null): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /**
     * تأكيد الطلب من الطلبات → مجدول لكل فحوصاته، مع تعيين الفنّي والأولوية
     * وملاحظة في خطوة واحدة. isUrgent يُشتق من الأولوية (URGENT ⇔ true)
     * لأن ترتيب اللوحة وشارة "عاجل" يعتمدانه.
     */
    confirmFromQueue(orderId: string, clinicId: string, input: {
        scheduledAt: Date;
        assignedToId?: string | null;
        priority?: TaskPriority | null;
        notes?: string | null;
    }, userId?: string | null): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /**
     * رفض طلب من الطلبات: يُلغى ويُحذف حذفًا ناعمًا، ويُشعَر المدرّب الطالب بالسبب.
     * الحذف ناعم عمدًا حتى يبقى أثر الطلب وسببه للمراجعة.
     */
    declineFromQueue(orderId: string, clinicId: string, reviewerId: string | null, reason: string): Promise<{
        id: string;
    } | null>;
    /**
     * حذف صور مرفوعة — صورة أو سلسلة أو دراسة كاملة. الصور جزء من السجل الطبي،
     * فالحذف ممنوع بعد اعتماد التقرير أو أثناء المراجعة (الحارس في المتحكّم).
     * تُحذف الملفات المحلية من القرص، وتُنظَّف السلاسل والدراسات التي أفرغت.
     */
    deleteImages(target: {
        kind: "instance" | "series" | "study";
        id: string;
    }, clinicId: string, userId?: string | null): Promise<{
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            body: string;
            author: {
                name: string;
                id: string;
            };
            mentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
        }[];
        branch: {
            name: string;
            id: string;
        };
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                id: string;
                arName: string;
            };
            animalStrain: {
                id: string;
                arName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
            age: number | null;
        };
        appointment: {
            id: string;
            code: string;
            startsAt: Date;
        } | null;
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            clinicId: string;
            createdAt: Date;
            updatedAt: Date;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            appointmentId: string | null;
            radiologyOrderId: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
            membershipId: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            membershipAdjustments: {
                id: string;
                amount: import("@prisma/client-runtime-utils").Decimal;
                lineRef: string;
                benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
                unitsConsumed: number;
            }[];
        } | null;
        priority: TaskPriority | null;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        branchId: string;
        notes: string | null;
        items: {
            service: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            report: {
                id: string;
                updatedAt: Date;
                itemId: string;
                authoredBy: {
                    name: string;
                    id: string;
                } | null;
                findings: string | null;
                technique: string | null;
                comparison: string | null;
                impression: string | null;
                recommendations: string | null;
                criticalFinding: boolean;
                criticalNotifiedAt: Date | null;
                criticalNotifiedTo: string | null;
                criticalNotifiedToId: string | null;
                aiDrafted: boolean;
            } | null;
            status: RadiologyStatus;
            serviceId: string;
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            scheduledAt: Date | null;
            reviewedAt: Date | null;
            rejectedAt: Date | null;
            assignedTo: {
                name: string;
                id: string;
            } | null;
            reviewedBy: {
                name: string;
                id: string;
            } | null;
            rejectedBy: {
                name: string;
                id: string;
            } | null;
            accession: string;
            stage: RadiologyStage;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
            views: string[];
            withContrast: boolean;
            execution: {
                id: string;
                startedAt: Date | null;
                finishedAt: Date | null;
                itemId: string;
                performedBy: {
                    name: string;
                    id: string;
                } | null;
                readyAt: Date | null;
                machineId: string | null;
                machineName: string | null;
                roomName: string | null;
                positioning: string | null;
                sedationUsed: import("@/generated/prisma/enums").SedationLevel | null;
                sedationAgent: string | null;
                viewsPerformed: string[];
                exposuresCount: number | null;
                retakeCount: number | null;
                kvp: import("@prisma/client-runtime-utils").Decimal | null;
                mas: import("@prisma/client-runtime-utils").Decimal | null;
                doseDap: import("@prisma/client-runtime-utils").Decimal | null;
                ctdiVol: import("@prisma/client-runtime-utils").Decimal | null;
                dlp: import("@prisma/client-runtime-utils").Decimal | null;
                contrastUsed: boolean | null;
                contrastAgent: string | null;
                contrastRoute: import("@/generated/prisma/enums").ContrastRoute | null;
                contrastVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                contrastLot: string | null;
                imageQuality: import("@/generated/prisma/enums").RadiologyImageQuality | null;
                qcNotes: string | null;
                executionNotes: string | null;
            } | null;
            studies: {
                id: string;
                createdAt: Date;
                description: string | null;
                itemId: string;
                modality: RadiologyModality | null;
                series: {
                    id: string;
                    description: string | null;
                    bodyPart: string | null;
                    seriesUid: string;
                    seriesNumber: number | null;
                    modalityCode: string | null;
                    instances: {
                        id: string;
                        rows: number | null;
                        fileName: string | null;
                        kind: import("@/generated/prisma/enums").RadiologyImageKind;
                        mimeType: string | null;
                        sizeBytes: number | null;
                        sopUid: string;
                        instanceNumber: number | null;
                        transferSyntax: string | null;
                        columns: number | null;
                        frames: number | null;
                    }[];
                }[];
                studyUid: string;
                studyDate: Date | null;
                uploadedBy: {
                    name: string;
                    id: string;
                } | null;
            }[];
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: RadiologyActivityType;
            id: string;
            createdAt: Date;
            detail: string | null;
            itemId: string | null;
            author: {
                name: string;
                id: string;
            } | null;
        }[];
        isUrgent: boolean;
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        clinicalInfo: string | null;
        safetyScreening: {
            id: string;
            vitalsRecordId: string | null;
            vitalsRecord: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                branchId: string | null;
                notes: string | null;
                editsCount: number;
                operationId: string | null;
                appointmentId: string | null;
                labOrderId: string | null;
                radiologyOrderId: string | null;
                patientId: string;
                source: import("@/generated/prisma/enums").VitalSignsSource;
                weight: import("@prisma/client-runtime-utils").Decimal | null;
                recordedAt: Date;
                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                heartRate: number | null;
                respiratoryRate: number | null;
                oxygenSaturation: number | null;
                bloodPressure: string | null;
                painScore: number | null;
                bodyConditionScore: number | null;
                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                correctsId: string | null;
                recordedBy: {
                    name: string;
                    id: string;
                } | null;
                correction: {
                    id: string;
                    code: string;
                    recordedAt: Date;
                } | null;
            } | null;
            orderId: string;
            fastingStatus: import("@/generated/prisma/enums").LabFastingStatus | null;
            fastingHours: number | null;
            medications: string[];
            pregnancyPossible: boolean | null;
            metalImplants: boolean | null;
            implantNotes: string | null;
            priorContrastReaction: boolean | null;
            allergies: string | null;
            asaClass: number | null;
        } | null;
    } | null>;
    /** حالة الفحص وليّ الأمر لهدف الحذف — الحارس يمنع الحذف بعد الاعتماد */
    findImageOwnerStatus(target: {
        kind: "instance" | "series" | "study";
        id: string;
    }, clinicId: string): Promise<{
        id: string;
        status: RadiologyStatus;
    } | null>;
    /** دراسة واحدة بسياق فحصها — يقرؤها عارض الصور المستقل */
    findStudy(studyId: string, clinicId: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        item: {
            service: {
                name: string;
            };
            id: string;
            order: {
                owner: {
                    name: string;
                    id: string;
                };
                patient: {
                    animalType: {
                        arName: string;
                    };
                    name: string;
                    id: string;
                    code: string;
                    gender: import("@/generated/prisma/enums").Gender;
                    age: number | null;
                };
                id: string;
                code: string;
                clinicalInfo: string | null;
            };
            accession: string;
            modality: RadiologyModality;
            bodyPart: string | null;
            laterality: import("@/generated/prisma/enums").RadiologyLaterality;
        };
        itemId: string;
        modality: RadiologyModality | null;
        series: {
            id: string;
            description: string | null;
            bodyPart: string | null;
            seriesUid: string;
            seriesNumber: number | null;
            modalityCode: string | null;
            instances: {
                id: string;
                rows: number | null;
                fileName: string | null;
                kind: import("@/generated/prisma/enums").RadiologyImageKind;
                mimeType: string | null;
                sizeBytes: number | null;
                sopUid: string;
                instanceNumber: number | null;
                transferSyntax: string | null;
                columns: number | null;
                frames: number | null;
            }[];
        }[];
        studyUid: string;
        studyDate: Date | null;
        uploadedBy: {
            name: string;
            id: string;
        } | null;
    } | null>;
    /** ملف صورة واحدة ضمن الأكاديمية — لبثّه عبر نقطة العرض المصادَق عليها */
    findInstanceFile(instanceId: string, clinicId: string): Promise<{
        fileName: string | null;
        kind: import("@/generated/prisma/enums").RadiologyImageKind;
        mimeType: string | null;
        fileKey: string;
    } | null>;
    softDelete(id: string, clinicId: string): Promise<{
        id: string;
    } | null>;
    /** إحصاءات اللوحة — حالة كل طلب مشتقة من أقلّ فحوصاته تقدّمًا */
    stats(clinicId: string): Promise<{
        total: number;
        queue: number;
        scheduled: number;
        preparation: number;
        imaging: number;
        reporting: number;
        underReview: number;
        completed: number;
        urgent: number;
        criticalFindings: number;
    }>;
};
export { orderByItem };
