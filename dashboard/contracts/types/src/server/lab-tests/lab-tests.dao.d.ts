import { Prisma } from "@/generated/prisma/client";
import { LabActivityType, LabResultFlag, LabSampleQuality, LabSampleStage, LabTestStatus, TaskPriority } from "@/generated/prisma/enums";
import { type CreateLabTestOrderInput, type LabResultEntryInput, type LabTestsPeriod } from "@/server/lab-tests/lab-tests.type";
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
        labOrderId: string | null;
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
        report: string | null;
        status: LabTestStatus;
        serviceId: string;
        results: {
            value: string | null;
            name: string;
            id: string;
            order: number;
            notes: string | null;
            section: string | null;
            unit: string | null;
            refLow: import("@prisma/client-runtime-utils").Decimal | null;
            refHigh: import("@prisma/client-runtime-utils").Decimal | null;
            parameterId: string | null;
            numericValue: import("@prisma/client-runtime-utils").Decimal | null;
            flag: LabResultFlag;
        }[];
        paidAt: Date | null;
        rejectionReason: string | null;
        completedAt: Date | null;
        orderId: string;
        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
        sampleStage: LabSampleStage;
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
        reportMentions: {
            staff: {
                name: string;
                id: string;
            };
        }[];
        sampleCollection: {
            id: string;
            attempts: number | null;
            itemId: string;
            tubeType: import("@/generated/prisma/enums").LabTubeType | null;
            drawSite: string | null;
            volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
            collectedAt: Date | null;
            quality: LabSampleQuality | null;
            collectionNotes: string | null;
            analyzerId: string | null;
            analyzerName: string | null;
            handedOverAt: Date | null;
            labelsPrinted: number | null;
            collectedBy: {
                name: string;
                id: string;
            } | null;
        } | null;
    }[];
    appointmentId: string | null;
    inpatientStayId: string | null;
    patientId: string;
    ownerId: string;
    activity: {
        type: LabActivityType;
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
    qcReviewedAt: Date | null;
    qcRules: string[];
    requestedBy: {
        name: string;
        id: string;
        phone: string | null;
    } | null;
    qcReviewedBy: {
        name: string;
        id: string;
    } | null;
    preAnalytical: {
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
        ivFluids24h: boolean | null;
    } | null;
} | null>;
export declare const labTestsDao: {
    list(clinicId: string, options?: {
        period?: LabTestsPeriod;
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    }[]>;
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
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
        report: string | null;
        status: LabTestStatus;
        serviceId: string;
        results: {
            value: string | null;
            name: string;
            id: string;
            order: number;
            notes: string | null;
            section: string | null;
            unit: string | null;
            refLow: import("@prisma/client-runtime-utils").Decimal | null;
            refHigh: import("@prisma/client-runtime-utils").Decimal | null;
            parameterId: string | null;
            numericValue: import("@prisma/client-runtime-utils").Decimal | null;
            flag: LabResultFlag;
        }[];
        paidAt: Date | null;
        rejectionReason: string | null;
        completedAt: Date | null;
        orderId: string;
        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
        sampleStage: LabSampleStage;
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
        reportMentions: {
            staff: {
                name: string;
                id: string;
            };
        }[];
        sampleCollection: {
            id: string;
            attempts: number | null;
            itemId: string;
            tubeType: import("@/generated/prisma/enums").LabTubeType | null;
            drawSite: string | null;
            volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
            collectedAt: Date | null;
            quality: LabSampleQuality | null;
            collectionNotes: string | null;
            analyzerId: string | null;
            analyzerName: string | null;
            handedOverAt: Date | null;
            labelsPrinted: number | null;
            collectedBy: {
                name: string;
                id: string;
            } | null;
        } | null;
    } | null>;
    /**
     * إنشاء طلب تحاليل: الطلب + عناصره بلقطات أسعارها + فاتورته + قيد الإنشاء.
     * كل التحاليل تبدأ في الطابور — لا يغادره شيء قبل سداد الفاتورة.
     */
    create(input: CreateLabTestOrderInput): Promise<{
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /** تغيير حالة تحليل واحد؛ الرفض/القبول لهما دوال مخصّصة أدناه */
    updateItemStatus(itemId: string, clinicId: string, status: LabTestStatus, userId?: string | null): Promise<{
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    updateItemStage(itemId: string, clinicId: string, sampleStage: LabSampleStage, userId?: string | null): Promise<{
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /** استبدال كل نتائج تحليل دفعةً واحدة مع احتساب علامة كل قيمة مقابل نطاقها */
    saveResults(itemId: string, clinicId: string, results: LabResultEntryInput[], userId?: string | null): Promise<{
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /** حفظ مسودّة تقرير المراجعة (مع إشاراته) دون تغيير الحالة */
    saveReport(itemId: string, clinicId: string, report: string | null, mentionedStaffIds?: string[]): Promise<{
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /** قبول المراجعة → مكتملة مع حفظ التقرير وإشاراته (ويُمسح أثر الرفض السابق) */
    approve(itemId: string, clinicId: string, reviewerId: string | null, report: string, mentionedStaffIds?: string[]): Promise<{
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /** رفض المراجعة → العودة إلى المختبر من أول مرحلة مع شارة "تم رفضها" */
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /**
     * التقييم ما قبل التحليلي — على مستوى الطلب (خاص بالطفل لا بالتحليل)،
     * فلا يُعاد سؤاله لكل تحليل داخل الطلب نفسه.
     */
    savePreAnalytical(orderId: string, clinicId: string, data: Prisma.LabPreAnalyticalUncheckedUpdateInput & Partial<Prisma.LabPreAnalyticalUncheckedCreateInput>): Promise<{
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /**
     * تفاصيل سحب عيّنة تحليل بعينه (الأنبوب وموقع السحب يختلفان بين التحاليل).
     * upsert لأن السجل يُنشأ عند أول حفظ ثم يُحدَّث تدريجيًا عبر الخطوات.
     */
    saveSampleCollection(itemId: string, clinicId: string, data: Prisma.LabSampleCollectionUncheckedUpdateInput & Partial<Prisma.LabSampleCollectionUncheckedCreateInput>): Promise<{
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /**
     * تغيير أولوية الطلب وحدها. isUrgent يُشتق منها (URGENT ⇔ true) لأن ترتيب
     * اللوحة وشارة «عاجلة» يعتمدانه — نفس اشتقاق التأكيد من الطابور.
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /**
     * تأكيد الطلب من الطابور → مجدول لكل تحاليله، مع تعيين الفنّي والأولوية
     * وملاحظة في خطوة واحدة. isUrgent يُشتق من الأولوية (URGENT ⇔ true)
     * لأن ترتيب اللوحة وشارة "عاجل" يعتمدانه.
     */
    confirmFromQueue(orderId: string, clinicId: string, input: {
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /**
     * اعتماد مراجعة ضبط الجودة للطلب. الضوابط تخصّ شوط الجهاز لا تحليلًا بعينه،
     * فالختم على مستوى الطلب. المراجعة لا تنقل حالة أي تحليل — هي بوابة قبل
     * اعتماد التقارير، وأثرها يظهر في سلسلة الحفاظ على العيّنة.
     */
    reviewQc(orderId: string, clinicId: string, rules: string[], userId?: string | null): Promise<{
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /**
     * رفض طلب من الطابور: يُلغى ويُحذف حذفًا ناعمًا، ويُشعَر المدرّب الطالب بالسبب.
     * الحذف ناعم عمدًا حتى يبقى أثر الطلب وسببه للمراجعة.
     */
    declineFromQueue(orderId: string, clinicId: string, reviewerId: string | null, reason: string): Promise<{
        id: string;
    } | null>;
    /**
     * تعيين جهاز التحليل للعيّنة. الإتاحة يتحقّق منها الخادم (موصول + مكان
     * شاغرة) فلا يكفي تعطيل الخيار في الواجهة.
     */
    assignAnalyzer(itemId: string, clinicId: string, analyzerId: string | null, userId?: string | null): Promise<{
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | {
        readonly error: string;
    } | null>;
    /**
     * نتائج سابقة للمقارنة: نفس الطفل ونفس التحليل بعينه في طلب أقدم.
     * التقييد بالدورة مقصود — مقارنة صورة دم كاملة بسكر الدم لا معنى لها،
     * فالمعايير مختلفة أصلًا ولا يقابل بعضُها بعضًا.
     */
    listPriorResults(itemId: string, clinicId: string, limit?: number): Promise<{
        service: {
            name: string;
            id: string;
        };
        id: string;
        createdAt: Date;
        report: string | null;
        order: {
            id: string;
            createdAt: Date;
            code: string;
        };
        results: {
            value: string | null;
            name: string;
            id: string;
            order: number;
            notes: string | null;
            section: string | null;
            unit: string | null;
            refLow: import("@prisma/client-runtime-utils").Decimal | null;
            refHigh: import("@prisma/client-runtime-utils").Decimal | null;
            parameterId: string | null;
            numericValue: import("@prisma/client-runtime-utils").Decimal | null;
            flag: LabResultFlag;
        }[];
        completedAt: Date | null;
        orderId: string;
        reviewedAt: Date | null;
    }[] | null>;
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    /** التعديل والحذف لصاحب التعليق وحده — يتحقّق الخادم لا الواجهة */
    updateComment(commentId: string, clinicId: string, authorUserId: string, body: string, mentionedStaffIds?: string[]): Promise<"forbidden" | {
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    deleteComment(commentId: string, clinicId: string, authorUserId: string): Promise<"forbidden" | {
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
            labOrderId: string | null;
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
            report: string | null;
            status: LabTestStatus;
            serviceId: string;
            results: {
                value: string | null;
                name: string;
                id: string;
                order: number;
                notes: string | null;
                section: string | null;
                unit: string | null;
                refLow: import("@prisma/client-runtime-utils").Decimal | null;
                refHigh: import("@prisma/client-runtime-utils").Decimal | null;
                parameterId: string | null;
                numericValue: import("@prisma/client-runtime-utils").Decimal | null;
                flag: LabResultFlag;
            }[];
            paidAt: Date | null;
            rejectionReason: string | null;
            completedAt: Date | null;
            orderId: string;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            sampleStage: LabSampleStage;
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
            reportMentions: {
                staff: {
                    name: string;
                    id: string;
                };
            }[];
            sampleCollection: {
                id: string;
                attempts: number | null;
                itemId: string;
                tubeType: import("@/generated/prisma/enums").LabTubeType | null;
                drawSite: string | null;
                volumeMl: import("@prisma/client-runtime-utils").Decimal | null;
                collectedAt: Date | null;
                quality: LabSampleQuality | null;
                collectionNotes: string | null;
                analyzerId: string | null;
                analyzerName: string | null;
                handedOverAt: Date | null;
                labelsPrinted: number | null;
                collectedBy: {
                    name: string;
                    id: string;
                } | null;
            } | null;
        }[];
        appointmentId: string | null;
        inpatientStayId: string | null;
        patientId: string;
        ownerId: string;
        activity: {
            type: LabActivityType;
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
        qcReviewedAt: Date | null;
        qcRules: string[];
        requestedBy: {
            name: string;
            id: string;
            phone: string | null;
        } | null;
        qcReviewedBy: {
            name: string;
            id: string;
        } | null;
        preAnalytical: {
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
            ivFluids24h: boolean | null;
        } | null;
    } | null>;
    softDelete(id: string, clinicId: string): Promise<{
        id: string;
    } | null>;
    /** إحصاءات اللوحة — حالة كل طلب مشتقة من أقلّ تحاليله تقدّمًا */
    stats(clinicId: string): Promise<{
        total: number;
        queue: number;
        scheduled: number;
        sampleCollection: number;
        inLab: number;
        underReview: number;
        completed: number;
        urgent: number;
    }>;
};
export { orderByItem };
