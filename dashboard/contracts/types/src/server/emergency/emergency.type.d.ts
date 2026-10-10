import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/**
 * [E0] أنواع وحدة الطوارئ — مشتقّة من Prisma، لا مُعلَنة يدويًا (AGENTS.md).
 */
export declare const arrivalSelect: {
    readonly id: true;
    readonly code: true;
    readonly clinicId: true;
    readonly branchId: true;
    readonly status: true;
    readonly source: true;
    readonly expectedAt: true;
    readonly arrivedAt: true;
    readonly provisionalLabel: true;
    readonly presentingComplaint: true;
    readonly leftReason: true;
    readonly createdAt: true;
    readonly stability: true;
    readonly lastReassessedAt: true;
    readonly dispositionKind: true;
    readonly dispositionAt: true;
    readonly dispositionNotes: true;
    readonly transferDestination: true;
    readonly dispositionBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
            readonly birthDate: true;
            readonly animalType: {
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
    readonly appointment: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly status: true;
            readonly triageCategory: true;
            readonly arrivedAt: true;
        };
    };
    readonly createdBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type ArrivalResponse = Prisma.EmergencyArrivalGetPayload<{
    select: typeof arrivalSelect;
}>;
export declare const triageAssessmentSelect: {
    readonly id: true;
    readonly appointmentId: true;
    readonly patientId: true;
    readonly proposedCategory: true;
    readonly category: true;
    readonly overrideReason: true;
    readonly discriminators: true;
    readonly attScore: true;
    readonly assessedAt: true;
    readonly notes: true;
    readonly supersedesId: true;
    readonly assessedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly vitalsRecord: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly recordedAt: true;
            readonly temperature: true;
            readonly heartRate: true;
            readonly respiratoryRate: true;
            readonly oxygenSaturation: true;
            readonly capillaryRefillSec: true;
            readonly mucousMembrane: true;
            readonly painScore: true;
        };
    };
};
export type TriageAssessmentResponse = Prisma.TriageAssessmentGetPayload<{
    select: typeof triageAssessmentSelect;
}>;
export declare const boardAppointmentSelect: {
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly triageCategory: true;
    readonly arrivedAt: true;
    readonly startsAt: true;
    readonly branchId: true;
    readonly isEmergency: true;
    readonly reason: true;
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
            readonly animalType: {
                readonly select: {
                    readonly arName: true;
                };
            };
            readonly alerts: {
                readonly where: {
                    readonly active: true;
                };
                readonly select: {
                    readonly id: true;
                    readonly kind: true;
                    readonly label: true;
                    readonly severity: true;
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
    readonly staff: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly triageAssessments: {
        readonly orderBy: {
            readonly assessedAt: "desc";
        };
        readonly take: 1;
        readonly select: {
            readonly id: true;
            readonly category: true;
            readonly attScore: true;
            readonly assessedAt: true;
            readonly discriminators: true;
        };
    };
    readonly emergencyArrival: {
        readonly select: {
            readonly id: true;
            readonly status: true;
            readonly stability: true;
            readonly lastReassessedAt: true;
            readonly dispositionKind: true;
            readonly presentingComplaint: true;
        };
    };
    readonly clinicalExam: {
        readonly select: {
            readonly startedAt: true;
            readonly completedAt: true;
        };
    };
    readonly soapNotes: {
        readonly select: {
            readonly status: true;
        };
        readonly orderBy: {
            readonly createdAt: "desc";
        };
        readonly take: 1;
    };
    readonly _count: {
        readonly select: {
            readonly vitalSignsRecords: true;
            readonly labTestOrders: true;
            readonly radiologyOrders: true;
            readonly prescriptions: true;
        };
    };
};
export type BoardAppointmentResponse = Prisma.AppointmentGetPayload<{
    select: typeof boardAppointmentSelect;
}>;
export declare const patientAlertSelect: {
    readonly id: true;
    readonly patientId: true;
    readonly kind: true;
    readonly label: true;
    readonly severity: true;
    readonly notes: true;
    readonly active: true;
    readonly createdAt: true;
    readonly recordedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type PatientAlertResponse = Prisma.PatientAlertGetPayload<{
    select: typeof patientAlertSelect;
}>;
export declare const createArrivalSchema: z.ZodObject<{
    branchId: z.ZodOptional<z.ZodString>;
    source: z.ZodDefault<z.ZodEnum<{
        readonly WALK_IN: "WALK_IN";
        readonly PHONE: "PHONE";
        readonly PUBLIC_BOOKING: "PUBLIC_BOOKING";
        readonly PET_PORTAL: "PET_PORTAL";
        readonly AGENT: "AGENT";
        readonly REFERRAL: "REFERRAL";
        readonly MOBILE_REQUEST: "MOBILE_REQUEST";
        readonly SCHEDULED_VISIT: "SCHEDULED_VISIT";
    }>>;
    patientId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ownerId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    provisionalLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    presentingComplaint: z.ZodString;
    expectedAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    arrivedAt: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
}, z.core.$strip>;
export type CreateArrivalFormInput = z.infer<typeof createArrivalSchema>;
export declare const triageVitalsSchema: z.ZodObject<{
    temperature: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    heartRate: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    respiratoryRate: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    oxygenSaturation: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    capillaryRefillSec: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    mucousMembrane: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly PINK: "PINK";
        readonly PALE: "PALE";
        readonly CYANOTIC: "CYANOTIC";
        readonly ICTERIC: "ICTERIC";
        readonly CONGESTED: "CONGESTED";
        readonly MUDDY: "MUDDY";
    }>>>;
    painScore: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type TriageVitalsFormInput = z.infer<typeof triageVitalsSchema>;
export declare const assessTriageSchema: z.ZodObject<{
    arrivalId: z.ZodOptional<z.ZodString>;
    appointmentId: z.ZodOptional<z.ZodString>;
    discriminators: z.ZodArray<z.ZodString>;
    category: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly RED: "RED";
        readonly ORANGE: "ORANGE";
        readonly YELLOW: "YELLOW";
        readonly GREEN: "GREEN";
        readonly BLUE: "BLUE";
    }>>>;
    overrideReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    vitals: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        temperature: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        heartRate: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        respiratoryRate: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        oxygenSaturation: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        capillaryRefillSec: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        mucousMembrane: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            readonly PINK: "PINK";
            readonly PALE: "PALE";
            readonly CYANOTIC: "CYANOTIC";
            readonly ICTERIC: "ICTERIC";
            readonly CONGESTED: "CONGESTED";
            readonly MUDDY: "MUDDY";
        }>>>;
        painScore: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    }, z.core.$strip>>>;
    patientId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    staffId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type AssessTriageFormInput = z.infer<typeof assessTriageSchema>;
export declare const createPatientAlertSchema: z.ZodObject<{
    patientId: z.ZodString;
    kind: z.ZodEnum<{
        OTHER: "OTHER";
        ALLERGY: "ALLERGY";
        CHRONIC_CONDITION: "CHRONIC_CONDITION";
        BITE_RISK: "BITE_RISK";
        CODE_STATUS: "CODE_STATUS";
    }>;
    label: z.ZodString;
    severity: z.ZodDefault<z.ZodEnum<{
        MILD: "MILD";
        MODERATE: "MODERATE";
        SEVERE: "SEVERE";
    }>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreatePatientAlertFormInput = z.infer<typeof createPatientAlertSchema>;
export declare const disposeSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        readonly DISCHARGED: "DISCHARGED";
        readonly ADMITTED: "ADMITTED";
        readonly TO_SURGERY: "TO_SURGERY";
        readonly TRANSFERRED: "TRANSFERRED";
        readonly LEFT_AGAINST_ADVICE: "LEFT_AGAINST_ADVICE";
        readonly DIED: "DIED";
        readonly EUTHANIZED: "EUTHANIZED";
    }>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    transferDestination: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    admit: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        kind: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
            readonly MEDICAL: "MEDICAL";
            readonly SURGICAL: "SURGICAL";
            readonly ICU: "ICU";
            readonly ISOLATION: "ISOLATION";
            readonly BOARDING: "BOARDING";
        }>>>;
        acuity: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
            readonly LOW: "LOW";
            readonly MEDIUM: "MEDIUM";
            readonly HIGH: "HIGH";
            readonly CRITICAL: "CRITICAL";
        }>>>;
        attendingStaffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>;
    surgery: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        procedureServiceId: z.ZodString;
        surgeonStaffId: z.ZodString;
        estimatedDurationMin: z.ZodNullable<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type DisposeFormInput = z.infer<typeof disposeSchema>;
