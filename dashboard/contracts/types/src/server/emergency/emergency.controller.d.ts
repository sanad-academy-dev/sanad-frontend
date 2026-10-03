import Elysia from "elysia";
import { ArrivalSource, type ArrivalStatus } from "@/generated/prisma/enums";
export declare const emergencyController: Elysia<"/emergency", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "emergency.createArrival": import("@sinclair/typebox").TObject<{
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"WALK_IN">, import("@sinclair/typebox").TLiteral<"PHONE">, import("@sinclair/typebox").TLiteral<"PUBLIC_BOOKING">, import("@sinclair/typebox").TLiteral<"PET_PORTAL">, import("@sinclair/typebox").TLiteral<"AGENT">, import("@sinclair/typebox").TLiteral<"REFERRAL">, import("@sinclair/typebox").TLiteral<"MOBILE_REQUEST">, import("@sinclair/typebox").TLiteral<"SCHEDULED_VISIT">]>>;
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            provisionalLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            presentingComplaint: import("@sinclair/typebox").TString;
            expectedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            arrivedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "emergency.transitionArrival": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"EN_ROUTE">, import("@sinclair/typebox").TLiteral<"ARRIVED">, import("@sinclair/typebox").TLiteral<"TRIAGED">, import("@sinclair/typebox").TLiteral<"DISPOSED">, import("@sinclair/typebox").TLiteral<"LEFT_WITHOUT_TRIAGE">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "emergency.assess": import("@sinclair/typebox").TObject<{
            arrivalId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            discriminators: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"RED">, import("@sinclair/typebox").TLiteral<"ORANGE">, import("@sinclair/typebox").TLiteral<"YELLOW">, import("@sinclair/typebox").TLiteral<"GREEN">, import("@sinclair/typebox").TLiteral<"BLUE">]>]>>;
            overrideReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            staffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            stability: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"STABLE">, import("@sinclair/typebox").TLiteral<"UNSTABLE">, import("@sinclair/typebox").TLiteral<"CRITICAL">]>]>>;
            vitalsRecordId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "emergency.dispose": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DISCHARGED">, import("@sinclair/typebox").TLiteral<"ADMITTED">, import("@sinclair/typebox").TLiteral<"TO_SURGERY">, import("@sinclair/typebox").TLiteral<"TRANSFERRED">, import("@sinclair/typebox").TLiteral<"LEFT_AGAINST_ADVICE">, import("@sinclair/typebox").TLiteral<"DIED">, import("@sinclair/typebox").TLiteral<"EUTHANIZED">]>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            transferDestination: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            admit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TObject<{
                kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MEDICAL">, import("@sinclair/typebox").TLiteral<"SURGICAL">, import("@sinclair/typebox").TLiteral<"ICU">, import("@sinclair/typebox").TLiteral<"ISOLATION">, import("@sinclair/typebox").TLiteral<"BOARDING">]>]>>;
                acuity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"CRITICAL">]>]>>;
                attendingStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>]>>;
            surgery: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TObject<{
                procedureServiceId: import("@sinclair/typebox").TString;
                surgeonStaffId: import("@sinclair/typebox").TString;
                estimatedDurationMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            }>]>>;
        }>;
        readonly "emergency.registerPatient": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            gender: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>;
            animalTypeId: import("@sinclair/typebox").TString;
            birthDate: import("@sinclair/typebox").TString;
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "emergency.boardQuery": import("@sinclair/typebox").TObject<{
            view: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            q: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "emergency.createPatientAlert": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALLERGY">, import("@sinclair/typebox").TLiteral<"CHRONIC_CONDITION">, import("@sinclair/typebox").TLiteral<"BITE_RISK">, import("@sinclair/typebox").TLiteral<"CODE_STATUS">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            label: import("@sinclair/typebox").TString;
            severity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MILD">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"SEVERE">]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
    };
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
} & {
    schema: {};
    standaloneSchema: {};
    macro: Partial<{
        readonly requirePermission: {
            resource: string;
            action: string;
            minimumScope?: import("../../lib/rbac/rbac-registry").PermissionScope;
        };
    }>;
    macroFn: {
        readonly requirePermission: (options: {
            resource: string;
            action: string;
            minimumScope?: import("../../lib/rbac/rbac-registry").PermissionScope;
        }) => {
            readonly resolve: ({ request }: {
                request: Request;
            }) => Promise<import("elysia").ElysiaCustomStatusResponse<401, {
                readonly message: "غير مصرح";
            }, 401> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
            }, 403> | import("elysia").ElysiaCustomStatusResponse<403, {
                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
            }, 403> | {
                clinicId: string;
                userId: string;
                staffId: string | null;
                branchId: string | null;
                isSuperAdmin: boolean;
                scopeKind: string;
                scopeBranchId: string | null;
                scopeStaffId: string | null;
            }>;
        };
    };
    parser: {};
    response: {};
}, {
    emergency: {};
} & {
    emergency: {
        discriminators: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        systems: {
                            key: "GENERAL" | "RESPIRATORY" | "CIRCULATORY" | "NEUROLOGICAL" | "GASTROINTESTINAL" | "UROGENITAL" | "OBSTETRIC" | "TRAUMA";
                            label: string;
                            items: {
                                code: string;
                                labelAr: string;
                                labelEn: string;
                                category: import("@/generated/prisma/enums").TriageCategory;
                                reviewed: boolean;
                            }[];
                        }[];
                        categories: {
                            key: string;
                            label: string;
                            targetMinutes: number;
                            queueRank: number;
                            reviewed: boolean;
                        }[];
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    };
                };
            };
        };
    };
} & {
    emergency: {
        settings: {
            get: {
                body: {};
                params: {};
                query: {
                    view?: string | undefined;
                    q?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        enabled: boolean;
                        redFastWalk: boolean;
                        requireTriageBeforeService: boolean;
                        deferPaymentUx: boolean;
                        untriagedAlertMinutes: number;
                        defaultDurationMinutes: number;
                        defaultVetStaffId: string | null;
                        consultationTypeId: string | null;
                        afterHoursServiceId: string | null;
                        bayRoomIds: string[];
                        crashCartWarehouseId: string | null;
                        allowUnidentifiedPatients: boolean;
                    } | {
                        enabled: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    emergency: {
        board: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        appointments: {
                            stage: "EN_ROUTE" | "DISPOSED" | "UNTRIAGED" | "TRIAGED_WAITING" | "IN_TREATMENT";
                            reassessmentOverdue: boolean;
                            minutesToReassess: number | null;
                            progress: {
                                vitals: number;
                                exam: "NONE" | "COMPLETED" | "STARTED";
                                note: import("@/generated/prisma/enums").ClinicalNoteStatus;
                                labs: number;
                                radiology: number;
                                prescriptions: number;
                            };
                            staff: {
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
                                    arName: string;
                                };
                                name: string;
                                id: string;
                                code: string;
                                alerts: {
                                    id: string;
                                    kind: import("@/generated/prisma/enums").PatientAlertKind;
                                    severity: import("@/generated/prisma/enums").AlertSeverity;
                                    label: string;
                                }[];
                            };
                            clinicalExam: {
                                startedAt: Date | null;
                                completedAt: Date | null;
                            } | null;
                            emergencyArrival: {
                                id: string;
                                status: ArrivalStatus;
                                presentingComplaint: string;
                                stability: import("@/generated/prisma/enums").EmergencyStability | null;
                                lastReassessedAt: Date | null;
                                dispositionKind: import("@/generated/prisma/enums").DispositionKind | null;
                            } | null;
                            id: string;
                            _count: {
                                labTestOrders: number;
                                radiologyOrders: number;
                                vitalSignsRecords: number;
                                prescriptions: number;
                            };
                            code: string;
                            reason: string | null;
                            triageAssessments: {
                                id: string;
                                category: import("@/generated/prisma/enums").TriageCategory;
                                assessedAt: Date;
                                discriminators: string[];
                                attScore: number | null;
                            }[];
                            branchId: string;
                            status: import("@/generated/prisma/enums").AppointmentStatus;
                            startsAt: Date;
                            isEmergency: boolean;
                            triageCategory: import("@/generated/prisma/enums").TriageCategory | null;
                            arrivedAt: Date | null;
                            soapNotes: {
                                status: import("@/generated/prisma/enums").ClinicalNoteStatus;
                            }[];
                        }[];
                        breaches: import("./triage-breach.service").BreachSummary;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    };
                };
            };
        };
    };
} & {
    emergency: {
        stats: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        waiting: number;
                        untriaged: number;
                        critical: number;
                        breached: number;
                        imminent: number;
                        longestWaitMinutes: number;
                        inTreatment: number;
                        reassessOverdue: number;
                        readyForDecision: number;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    };
                };
            };
        };
    };
} & {
    emergency: {
        arrivals: {
            get: {
                body: {};
                params: {};
                query: {
                    view?: string | undefined;
                    q?: string | undefined;
                };
                headers: {};
                response: {
                    200: {
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        } | null;
                        patient: {
                            animalType: {
                                id: string;
                                arName: string;
                            };
                            name: string;
                            id: string;
                            code: string;
                            birthDate: Date | null;
                        } | null;
                        appointment: {
                            id: string;
                            code: string;
                            status: import("@/generated/prisma/enums").AppointmentStatus;
                            triageCategory: import("@/generated/prisma/enums").TriageCategory | null;
                            arrivedAt: Date | null;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        code: string;
                        branchId: string;
                        status: ArrivalStatus;
                        source: ArrivalSource;
                        createdBy: {
                            name: string;
                            id: string;
                        } | null;
                        arrivedAt: Date | null;
                        presentingComplaint: string;
                        expectedAt: Date | null;
                        provisionalLabel: string | null;
                        leftReason: string | null;
                        stability: import("@/generated/prisma/enums").EmergencyStability | null;
                        lastReassessedAt: Date | null;
                        dispositionKind: import("@/generated/prisma/enums").DispositionKind | null;
                        dispositionAt: Date | null;
                        dispositionNotes: string | null;
                        transferDestination: string | null;
                        dispositionBy: {
                            name: string;
                            id: string;
                        } | null;
                    }[];
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    emergency: {
        arrivals: {
            ":id": {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            } | null;
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                };
                                name: string;
                                id: string;
                                code: string;
                                birthDate: Date | null;
                            } | null;
                            appointment: {
                                id: string;
                                code: string;
                                status: import("@/generated/prisma/enums").AppointmentStatus;
                                triageCategory: import("@/generated/prisma/enums").TriageCategory | null;
                                arrivedAt: Date | null;
                            } | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            code: string;
                            branchId: string;
                            status: ArrivalStatus;
                            source: ArrivalSource;
                            createdBy: {
                                name: string;
                                id: string;
                            } | null;
                            arrivedAt: Date | null;
                            presentingComplaint: string;
                            expectedAt: Date | null;
                            provisionalLabel: string | null;
                            leftReason: string | null;
                            stability: import("@/generated/prisma/enums").EmergencyStability | null;
                            lastReassessedAt: Date | null;
                            dispositionKind: import("@/generated/prisma/enums").DispositionKind | null;
                            dispositionAt: Date | null;
                            dispositionNotes: string | null;
                            transferDestination: string | null;
                            dispositionBy: {
                                name: string;
                                id: string;
                            } | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        404: {
                            readonly message: "سجلّ الوصول غير موجود";
                        };
                        422: {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    emergency: {
        arrivals: {
            post: {
                body: {
                    branchId?: string | undefined;
                    patientId?: string | null | undefined;
                    ownerId?: string | null | undefined;
                    source?: "PHONE" | "WALK_IN" | "PUBLIC_BOOKING" | "PET_PORTAL" | "AGENT" | "REFERRAL" | "MOBILE_REQUEST" | "SCHEDULED_VISIT" | undefined;
                    arrivedAt?: string | null | undefined;
                    expectedAt?: string | null | undefined;
                    provisionalLabel?: string | null | undefined;
                    presentingComplaint: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        } | null;
                        patient: {
                            animalType: {
                                id: string;
                                arName: string;
                            };
                            name: string;
                            id: string;
                            code: string;
                            birthDate: Date | null;
                        } | null;
                        appointment: {
                            id: string;
                            code: string;
                            status: import("@/generated/prisma/enums").AppointmentStatus;
                            triageCategory: import("@/generated/prisma/enums").TriageCategory | null;
                            arrivedAt: Date | null;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        code: string;
                        branchId: string;
                        status: ArrivalStatus;
                        source: ArrivalSource;
                        createdBy: {
                            name: string;
                            id: string;
                        } | null;
                        arrivedAt: Date | null;
                        presentingComplaint: string;
                        expectedAt: Date | null;
                        provisionalLabel: string | null;
                        leftReason: string | null;
                        stability: import("@/generated/prisma/enums").EmergencyStability | null;
                        lastReassessedAt: Date | null;
                        dispositionKind: import("@/generated/prisma/enums").DispositionKind | null;
                        dispositionAt: Date | null;
                        dispositionNotes: string | null;
                        transferDestination: string | null;
                        dispositionBy: {
                            name: string;
                            id: string;
                        } | null;
                    };
                    400: {
                        readonly message: "لا يوجد فرع متاح";
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    };
                    404: {
                        readonly message: string;
                        readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                    };
                    409: {
                        readonly message: string;
                        readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                    };
                    422: {
                        readonly message: string;
                        readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                    } | {
                        readonly message: string;
                        readonly kind: string;
                    } | {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    emergency: {
        arrivals: {
            ":id": {
                status: {
                    patch: {
                        body: {
                            reason?: string | null | undefined;
                            status: "CANCELLED" | "EN_ROUTE" | "ARRIVED" | "TRIAGED" | "DISPOSED" | "LEFT_WITHOUT_TRIAGE";
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                } | null;
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    name: string;
                                    id: string;
                                    code: string;
                                    birthDate: Date | null;
                                } | null;
                                appointment: {
                                    id: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").AppointmentStatus;
                                    triageCategory: import("@/generated/prisma/enums").TriageCategory | null;
                                    arrivedAt: Date | null;
                                } | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                code: string;
                                branchId: string;
                                status: ArrivalStatus;
                                source: ArrivalSource;
                                createdBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                arrivedAt: Date | null;
                                presentingComplaint: string;
                                expectedAt: Date | null;
                                provisionalLabel: string | null;
                                leftReason: string | null;
                                stability: import("@/generated/prisma/enums").EmergencyStability | null;
                                lastReassessedAt: Date | null;
                                dispositionKind: import("@/generated/prisma/enums").DispositionKind | null;
                                dispositionAt: Date | null;
                                dispositionNotes: string | null;
                                transferDestination: string | null;
                                dispositionBy: {
                                    name: string;
                                    id: string;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                            } | {
                                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                            };
                            404: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            };
                            409: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            };
                            422: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            } | {
                                readonly message: string;
                                readonly kind: string;
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    emergency: {
        triage: {
            post: {
                body: {
                    notes?: string | null | undefined;
                    staffId?: string | null | undefined;
                    appointmentId?: string | undefined;
                    patientId?: string | null | undefined;
                    category?: "RED" | "ORANGE" | "YELLOW" | "GREEN" | "BLUE" | null | undefined;
                    vitalsRecordId?: string | null | undefined;
                    stability?: "CRITICAL" | "STABLE" | "UNSTABLE" | null | undefined;
                    overrideReason?: string | null | undefined;
                    arrivalId?: string | undefined;
                    discriminators: string[];
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        assessment: {
                            id: string;
                            notes: string | null;
                            appointmentId: string;
                            patientId: string | null;
                            category: import("@/generated/prisma/enums").TriageCategory;
                            vitalsRecord: {
                                id: string;
                                code: string;
                                recordedAt: Date;
                                temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                heartRate: number | null;
                                respiratoryRate: number | null;
                                oxygenSaturation: number | null;
                                painScore: number | null;
                                capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                            } | null;
                            assessedAt: Date;
                            proposedCategory: import("@/generated/prisma/enums").TriageCategory;
                            overrideReason: string | null;
                            discriminators: string[];
                            attScore: number | null;
                            supersedesId: string | null;
                            assessedBy: {
                                name: string;
                                id: string;
                            };
                        };
                        appointmentId: string;
                        category: import("@/generated/prisma/enums").TriageCategory;
                        proposed: import("@/generated/prisma/enums").TriageCategory;
                        escalated: boolean;
                        previousCategory: import("@/generated/prisma/enums").TriageCategory | null;
                        fastWalk: boolean;
                        fastWalked: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    };
                    404: {
                        readonly message: string;
                        readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                    };
                    409: {
                        readonly message: string;
                        readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                    };
                    422: {
                        readonly message: string;
                        readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                    } | {
                        readonly message: string;
                        readonly kind: string;
                    } | {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
} & {
    emergency: {
        appointments: {
            ":id": {
                triage: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                notes: string | null;
                                appointmentId: string;
                                patientId: string | null;
                                category: import("@/generated/prisma/enums").TriageCategory;
                                vitalsRecord: {
                                    id: string;
                                    code: string;
                                    recordedAt: Date;
                                    temperature: import("@prisma/client-runtime-utils").Decimal | null;
                                    heartRate: number | null;
                                    respiratoryRate: number | null;
                                    oxygenSaturation: number | null;
                                    painScore: number | null;
                                    capillaryRefillSec: import("@prisma/client-runtime-utils").Decimal | null;
                                    mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
                                } | null;
                                assessedAt: Date;
                                proposedCategory: import("@/generated/prisma/enums").TriageCategory;
                                overrideReason: string | null;
                                discriminators: string[];
                                attScore: number | null;
                                supersedesId: string | null;
                                assessedBy: {
                                    name: string;
                                    id: string;
                                };
                            }[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                            } | {
                                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    emergency: {
        arrivals: {
            ":id": {
                "register-patient": {
                    post: {
                        body: {
                            notes?: string | null | undefined;
                            ownerId?: string | null | undefined;
                            weight?: number | null | undefined;
                            name: string;
                            gender: "MALE" | "FEMALE" | "UNKNOWN";
                            animalTypeId: string;
                            birthDate: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                owner: {
                                    name: string;
                                    id: string;
                                    phone: string;
                                } | null;
                                patient: {
                                    animalType: {
                                        id: string;
                                        arName: string;
                                    };
                                    name: string;
                                    id: string;
                                    code: string;
                                    birthDate: Date | null;
                                } | null;
                                appointment: {
                                    id: string;
                                    code: string;
                                    status: import("@/generated/prisma/enums").AppointmentStatus;
                                    triageCategory: import("@/generated/prisma/enums").TriageCategory | null;
                                    arrivedAt: Date | null;
                                } | null;
                                id: string;
                                clinicId: string;
                                createdAt: Date;
                                code: string;
                                branchId: string;
                                status: ArrivalStatus;
                                source: ArrivalSource;
                                createdBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                arrivedAt: Date | null;
                                presentingComplaint: string;
                                expectedAt: Date | null;
                                provisionalLabel: string | null;
                                leftReason: string | null;
                                stability: import("@/generated/prisma/enums").EmergencyStability | null;
                                lastReassessedAt: Date | null;
                                dispositionKind: import("@/generated/prisma/enums").DispositionKind | null;
                                dispositionAt: Date | null;
                                dispositionNotes: string | null;
                                transferDestination: string | null;
                                dispositionBy: {
                                    name: string;
                                    id: string;
                                } | null;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                            } | {
                                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                            };
                            404: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            };
                            409: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            };
                            422: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            } | {
                                readonly message: string;
                                readonly kind: string;
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    emergency: {
        appointments: {
            ":id": {
                "start-treatment": {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                status: import("@/generated/prisma/enums").AppointmentStatus;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                            } | {
                                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                            };
                            404: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            };
                            409: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            };
                            422: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            } | {
                                readonly message: string;
                                readonly kind: string;
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    emergency: {
        appointments: {
            ":id": {
                dispose: {
                    post: {
                        body: {
                            admit?: {
                                kind?: "ICU" | "ISOLATION" | "MEDICAL" | "SURGICAL" | "BOARDING" | null | undefined;
                                acuity?: "MEDIUM" | "LOW" | "HIGH" | "CRITICAL" | null | undefined;
                                attendingStaffId?: string | null | undefined;
                            } | null | undefined;
                            notes?: string | null | undefined;
                            transferDestination?: string | null | undefined;
                            surgery?: {
                                estimatedDurationMin?: number | null | undefined;
                                procedureServiceId: string;
                                surgeonStaffId: string;
                            } | null | undefined;
                            kind: "ADMITTED" | "DISCHARGED" | "TRANSFERRED" | "DIED" | "EUTHANIZED" | "TO_SURGERY" | "LEFT_AGAINST_ADVICE";
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                inpatientStayId?: string;
                                operationCaseId?: string;
                                episode: {
                                    owner: {
                                        name: string;
                                        id: string;
                                        phone: string;
                                    } | null;
                                    patient: {
                                        animalType: {
                                            id: string;
                                            arName: string;
                                        };
                                        name: string;
                                        id: string;
                                        code: string;
                                        birthDate: Date | null;
                                    } | null;
                                    appointment: {
                                        id: string;
                                        code: string;
                                        status: import("@/generated/prisma/enums").AppointmentStatus;
                                        triageCategory: import("@/generated/prisma/enums").TriageCategory | null;
                                        arrivedAt: Date | null;
                                    } | null;
                                    id: string;
                                    clinicId: string;
                                    createdAt: Date;
                                    code: string;
                                    branchId: string;
                                    status: ArrivalStatus;
                                    source: ArrivalSource;
                                    createdBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    arrivedAt: Date | null;
                                    presentingComplaint: string;
                                    expectedAt: Date | null;
                                    provisionalLabel: string | null;
                                    leftReason: string | null;
                                    stability: import("@/generated/prisma/enums").EmergencyStability | null;
                                    lastReassessedAt: Date | null;
                                    dispositionKind: import("@/generated/prisma/enums").DispositionKind | null;
                                    dispositionAt: Date | null;
                                    dispositionNotes: string | null;
                                    transferDestination: string | null;
                                    dispositionBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                };
                                appointmentId: string;
                                kind: import("@/generated/prisma/enums").DispositionKind;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                            } | {
                                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                            };
                            404: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            };
                            409: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            };
                            422: {
                                readonly message: string;
                                readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                            } | {
                                readonly message: string;
                                readonly kind: string;
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    emergency: {
        patients: {
            ":id": {
                alerts: {
                    get: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                notes: string | null;
                                active: boolean;
                                patientId: string;
                                kind: import("@/generated/prisma/enums").PatientAlertKind;
                                recordedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                severity: import("@/generated/prisma/enums").AlertSeverity;
                                label: string;
                            }[];
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                            } | {
                                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    emergency: {
        patients: {
            alerts: {
                post: {
                    body: {
                        notes?: string | null | undefined;
                        severity?: "MILD" | "MODERATE" | "SEVERE" | undefined;
                        patientId: string;
                        kind: "OTHER" | "ALLERGY" | "CHRONIC_CONDITION" | "BITE_RISK" | "CODE_STATUS";
                        label: string;
                    };
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            createdAt: Date;
                            notes: string | null;
                            active: boolean;
                            patientId: string;
                            kind: import("@/generated/prisma/enums").PatientAlertKind;
                            recordedBy: {
                                name: string;
                                id: string;
                            } | null;
                            severity: import("@/generated/prisma/enums").AlertSeverity;
                            label: string;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        404: {
                            readonly message: string;
                            readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                        };
                        409: {
                            readonly message: string;
                            readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                        };
                        422: {
                            readonly message: string;
                            readonly kind: import("@/server/emergency/emergency.errors").EmergencyErrorKind;
                        } | {
                            readonly message: string;
                            readonly kind: string;
                        } | {
                            type: "validation";
                            on: string;
                            summary?: string;
                            message?: string;
                            found?: unknown;
                            property?: string;
                            expected?: string;
                        };
                    };
                };
            };
        };
    };
} & {
    emergency: {
        patients: {
            alerts: {
                ":id": {
                    delete: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                notes: string | null;
                                active: boolean;
                                patientId: string;
                                kind: import("@/generated/prisma/enums").PatientAlertKind;
                                recordedBy: {
                                    name: string;
                                    id: string;
                                } | null;
                                severity: import("@/generated/prisma/enums").AlertSeverity;
                                label: string;
                            };
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                            } | {
                                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                            };
                            404: {
                                readonly message: "التنبيه غير موجود";
                            };
                            422: {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                        };
                    };
                };
            };
        };
    };
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
} & {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
