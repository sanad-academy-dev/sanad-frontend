import Elysia from "elysia";
/**
 * مجموعة وحدة التنويم.
 *
 * أُنشئت مجموعةً منذ أول متحكّم لا بعد الاصطدام — كما فعلت وحدة التجميل: سلسلة
 * `‎.use()‎` العليا في `src/server/index.ts` عند سقف عمق الاستنتاج (TS2589 يظهر
 * مؤشِّرًا إلى `app.ts`)، وتعليق رأس ذلك الملفّ يطلب صراحةً ضمّ الوحدة التالية
 * إلى مجموعة بدل إطالة السلسلة. متحكّما الوحدة يدخلان بحلقة واحدة.
 */
export declare const inpatientsServer: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
} & {
    typebox: {
        readonly "inpatients.request": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            branchId: import("@sinclair/typebox").TString;
            attendingStaffId: import("@sinclair/typebox").TString;
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MEDICAL">, import("@sinclair/typebox").TLiteral<"SURGICAL">, import("@sinclair/typebox").TLiteral<"ICU">, import("@sinclair/typebox").TLiteral<"ISOLATION">, import("@sinclair/typebox").TLiteral<"BOARDING">]>>;
            acuity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"CRITICAL">]>>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            operationCaseId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            presentingComplaint: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            admissionDiagnosis: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isolationReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            monitoringIntervalMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            dailyRateServiceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            expectedDischargeAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            importPostOpOrders: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "inpatients.admit": import("@sinclair/typebox").TObject<{
            cageId: import("@sinclair/typebox").TString;
            expectedDischargeAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            dailyRateServiceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.update": import("@sinclair/typebox").TObject<{
            acuity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"CRITICAL">]>>;
            attendingStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            monitoringIntervalMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            expectedDischargeAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            admissionDiagnosis: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            isolationReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            dailyRateServiceId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.transition": import("@sinclair/typebox").TObject<{
            to: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"REQUESTED">, import("@sinclair/typebox").TLiteral<"ADMITTED">, import("@sinclair/typebox").TLiteral<"IN_CARE">, import("@sinclair/typebox").TLiteral<"DISCHARGE_PENDING">, import("@sinclair/typebox").TLiteral<"DISCHARGED">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>;
            overrideReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            cancelReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.discharge": import("@sinclair/typebox").TObject<{
            dischargeKind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ROUTINE">, import("@sinclair/typebox").TLiteral<"AGAINST_MEDICAL_ADVICE">, import("@sinclair/typebox").TLiteral<"TRANSFERRED">, import("@sinclair/typebox").TLiteral<"DIED">, import("@sinclair/typebox").TLiteral<"EUTHANIZED">]>;
            dischargeSummaryAr: import("@sinclair/typebox").TString;
            dischargeInstructionsAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            overrideReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.assignCage": import("@sinclair/typebox").TObject<{
            cageId: import("@sinclair/typebox").TString;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.note": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
            mentionUserIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            handover: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "inpatients.createOrder": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MEDICATION">, import("@sinclair/typebox").TLiteral<"FLUID">, import("@sinclair/typebox").TLiteral<"MONITORING">, import("@sinclair/typebox").TLiteral<"FEEDING">, import("@sinclair/typebox").TLiteral<"ACTIVITY">, import("@sinclair/typebox").TLiteral<"WOUND_CARE">, import("@sinclair/typebox").TLiteral<"LAB">, import("@sinclair/typebox").TLiteral<"IMAGING">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            inventoryItemId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            catalogProductId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            nameSnapshot: import("@sinclair/typebox").TString;
            doseAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            doseUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            route: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"IV">, import("@sinclair/typebox").TLiteral<"IM">, import("@sinclair/typebox").TLiteral<"SC">, import("@sinclair/typebox").TLiteral<"PO">, import("@sinclair/typebox").TLiteral<"INHALATION">, import("@sinclair/typebox").TLiteral<"TOPICAL">, import("@sinclair/typebox").TLiteral<"EPIDURAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>]>>;
            rateMlPerHour: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            overrideReasonAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            scheduleIntervalHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            scheduleTimes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            prn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            startAt: import("@sinclair/typebox").TString;
            endAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            instructionsAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.discontinueOrder": import("@sinclair/typebox").TObject<{
            reasonAr: import("@sinclair/typebox").TString;
        }>;
        readonly "inpatients.giveAdministration": import("@sinclair/typebox").TObject<{
            doseGivenAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            doseGivenUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            stockQuantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            batchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            witnessId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notesAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            eatenFraction: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            urination: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
            defecation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
            vomiting: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
        }>;
        readonly "inpatients.skipAdministration": import("@sinclair/typebox").TObject<{
            skipReasonAr: import("@sinclair/typebox").TString;
            hold: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "inpatients.prnAdministration": import("@sinclair/typebox").TObject<{
            orderId: import("@sinclair/typebox").TString;
            doseGivenAmount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            doseGivenUnit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            stockQuantity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            batchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            witnessId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notesAr: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.recordVitals": import("@sinclair/typebox").TObject<{
            administrationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            recordedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            temperature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            heartRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            respiratoryRate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            oxygenSaturation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            bloodPressure: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            painScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            bodyConditionScore: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            capillaryRefillSec: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            mucousMembrane: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PINK">, import("@sinclair/typebox").TLiteral<"PALE">, import("@sinclair/typebox").TLiteral<"CYANOTIC">, import("@sinclair/typebox").TLiteral<"ICTERIC">, import("@sinclair/typebox").TLiteral<"CONGESTED">, import("@sinclair/typebox").TLiteral<"MUDDY">]>]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.payInvoice": import("@sinclair/typebox").TObject<{
            amountPaid: import("@sinclair/typebox").TNumber;
            paymentMethod: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CASH">, import("@sinclair/typebox").TLiteral<"CARD">, import("@sinclair/typebox").TLiteral<"TRANSFER">]>;
        }>;
        readonly "inpatients.createCage": import("@sinclair/typebox").TObject<{
            roomId: import("@sinclair/typebox").TString;
            name: import("@sinclair/typebox").TString;
            sizeClass: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"LARGE">, import("@sinclair/typebox").TLiteral<"WALK_IN">]>]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "inpatients.updateCage": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            sizeClass: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"LARGE">, import("@sinclair/typebox").TLiteral<"WALK_IN">]>]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
    inpatients: {};
} & {
    inpatients: {
        get: {
            body: {};
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    due: import("./inpatient-due.service").InpatientDueEvaluation;
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        animalType: {
                            id: string;
                            arName: string;
                            enName: string;
                        };
                        name: string;
                        id: string;
                        code: string;
                        gender: import("../staff/staff.type").Gender;
                    };
                    id: string;
                    code: string;
                    branchId: string;
                    status: import("../../../generated/prisma/enums").InpatientStayStatus;
                    kind: import("../../../generated/prisma/enums").InpatientStayKind;
                    monitoringIntervalMinutes: number;
                    acuity: import("../../../generated/prisma/enums").InpatientAcuity;
                    admissionDiagnosis: string | null;
                    admittedAt: Date | null;
                    expectedDischargeAt: Date | null;
                    dischargedAt: Date | null;
                    nextDueAt: Date | null;
                    attendingStaff: {
                        name: string;
                        id: string;
                    };
                    cageAssignments: {
                        cage: {
                            room: {
                                type: import("../rooms/rooms.type").RoomType;
                                name: string;
                                id: string;
                            };
                            name: string;
                            id: string;
                        };
                        id: string;
                        assignedAt: Date;
                    }[];
                }[];
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
} & {
    inpatients: {
        stats: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        census: number;
                        icu: number;
                        isolation: number;
                        criticalAcuity: number;
                        overdueCount: number;
                        dischargedToday: number;
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
    inpatients: {
        due: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        due: import("./inpatient-due.service").InpatientDueEvaluation;
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        };
                        patient: {
                            animalType: {
                                id: string;
                                arName: string;
                                enName: string;
                            };
                            name: string;
                            id: string;
                            code: string;
                            gender: import("../staff/staff.type").Gender;
                        };
                        id: string;
                        code: string;
                        branchId: string;
                        status: import("../../../generated/prisma/enums").InpatientStayStatus;
                        kind: import("../../../generated/prisma/enums").InpatientStayKind;
                        monitoringIntervalMinutes: number;
                        acuity: import("../../../generated/prisma/enums").InpatientAcuity;
                        admissionDiagnosis: string | null;
                        admittedAt: Date | null;
                        expectedDischargeAt: Date | null;
                        dischargedAt: Date | null;
                        nextDueAt: Date | null;
                        attendingStaff: {
                            name: string;
                            id: string;
                        };
                        cageAssignments: {
                            cage: {
                                room: {
                                    type: import("../rooms/rooms.type").RoomType;
                                    name: string;
                                    id: string;
                                };
                                name: string;
                                id: string;
                            };
                            id: string;
                            assignedAt: Date;
                        }[];
                    }[];
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
    inpatients: {
        cages: {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: import("./inpatients.type").CageWithOccupancy[];
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
    inpatients: {
        "room-occupancy": {
            get: {
                body: {};
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        roomId: string;
                        cages: number;
                        occupied: number;
                    }[];
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
    inpatients: {
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
                        due: import("./inpatient-due.service").InpatientDueEvaluation;
                        readiness: {
                            ready: boolean;
                            gates: {
                                gate: import("./inpatients.workflow").InpatientGate;
                                satisfied: boolean;
                                label: string;
                                overridable: boolean;
                            }[];
                        } | null;
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        };
                        patient: {
                            animalType: {
                                id: string;
                                arName: string;
                                enName: string;
                                species: import("../drug-catalog/drug-catalog.type").CatalogSpecies | null;
                            };
                            animalStrain: {
                                id: string;
                                arName: string;
                                enName: string;
                            } | null;
                            name: string;
                            id: string;
                            code: string;
                            gender: import("../staff/staff.type").Gender;
                            birthDate: Date | null;
                            weight: number | null;
                            microchipNumber: string | null;
                            coat: string | null;
                        };
                        invoice: {
                            discount: import("@prisma/client-runtime-utils").Decimal;
                            id: string;
                            currencyCode: string;
                            code: string;
                            status: import("../invoices/invoices.type").InvoiceStatus;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            vatAmount: import("@prisma/client-runtime-utils").Decimal;
                            subtotal: import("@prisma/client-runtime-utils").Decimal;
                            amountPaid: import("@prisma/client-runtime-utils").Decimal;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        code: string;
                        branchId: string;
                        status: import("../../../generated/prisma/enums").InpatientStayStatus;
                        appointmentId: string | null;
                        kind: import("../../../generated/prisma/enums").InpatientStayKind;
                        monitoringIntervalMinutes: number;
                        acuity: import("../../../generated/prisma/enums").InpatientAcuity;
                        operationCaseId: string | null;
                        presentingComplaint: string | null;
                        admissionDiagnosis: string | null;
                        isolationReason: string | null;
                        admissionWeightRecordId: string | null;
                        dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                        admittedAt: Date | null;
                        expectedDischargeAt: Date | null;
                        dischargedAt: Date | null;
                        dischargeKind: import("../../../generated/prisma/enums").DischargeKind | null;
                        dischargeSummaryAr: string | null;
                        dischargeInstructionsAr: string | null;
                        cancelReasonAr: string | null;
                        nextDueAt: Date | null;
                        attendingStaff: {
                            name: string;
                            id: string;
                        };
                        admittedBy: {
                            name: string;
                            id: string;
                        } | null;
                        dischargedBy: {
                            name: string;
                            id: string;
                        } | null;
                        admissionWeightRecord: {
                            id: string;
                            code: string;
                            weight: import("@prisma/client-runtime-utils").Decimal | null;
                            recordedAt: Date;
                        } | null;
                        dailyRateService: {
                            name: string;
                            id: string;
                        } | null;
                        cageAssignments: {
                            cage: {
                                room: {
                                    type: import("../rooms/rooms.type").RoomType;
                                    name: string;
                                    id: string;
                                };
                                name: string;
                                id: string;
                            };
                            id: string;
                            assignedAt: Date;
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
                    404: {
                        readonly message: "الإقامة غير موجودة";
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
    inpatients: {
        ":id": {
            consents: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("../../../generated/prisma/enums").ConsentType;
                            id: string;
                            createdAt: Date;
                            status: import("../../../generated/prisma/enums").ConsentStatus;
                            templateKey: string;
                            revokedAt: Date | null;
                            signerName: string | null;
                            signedAt: Date | null;
                        }[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        404: {
                            readonly message: "الإقامة غير موجودة";
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
    inpatients: {
        ":id": {
            activity: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("../../../generated/prisma/enums").InpatientActivityType;
                            id: string;
                            createdAt: Date;
                            metadata: import("@prisma/client/runtime/client").JsonValue;
                            body: string | null;
                            author: {
                                name: string;
                                id: string;
                                image: string | null;
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
                        404: {
                            readonly message: "الإقامة غير موجودة";
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
    inpatients: {
        post: {
            body: {
                appointmentId?: string | null | undefined;
                kind?: "ICU" | "ISOLATION" | "MEDICAL" | "SURGICAL" | "BOARDING" | undefined;
                monitoringIntervalMinutes?: number | undefined;
                acuity?: "MEDIUM" | "LOW" | "HIGH" | "CRITICAL" | undefined;
                operationCaseId?: string | null | undefined;
                presentingComplaint?: string | null | undefined;
                admissionDiagnosis?: string | null | undefined;
                isolationReason?: string | null | undefined;
                dailyRateServiceId?: string | null | undefined;
                expectedDischargeAt?: string | null | undefined;
                importPostOpOrders?: boolean | undefined;
                branchId: string;
                patientId: string;
                attendingStaffId: string;
            };
            params: {};
            query: {};
            headers: {};
            response: {
                200: {
                    due: import("./inpatient-due.service").InpatientDueEvaluation;
                    readiness: {
                        ready: boolean;
                        gates: {
                            gate: import("./inpatients.workflow").InpatientGate;
                            satisfied: boolean;
                            label: string;
                            overridable: boolean;
                        }[];
                    } | null;
                    owner: {
                        name: string;
                        id: string;
                        phone: string;
                    };
                    patient: {
                        animalType: {
                            id: string;
                            arName: string;
                            enName: string;
                            species: import("../drug-catalog/drug-catalog.type").CatalogSpecies | null;
                        };
                        animalStrain: {
                            id: string;
                            arName: string;
                            enName: string;
                        } | null;
                        name: string;
                        id: string;
                        code: string;
                        gender: import("../staff/staff.type").Gender;
                        birthDate: Date | null;
                        weight: number | null;
                        microchipNumber: string | null;
                        coat: string | null;
                    };
                    invoice: {
                        discount: import("@prisma/client-runtime-utils").Decimal;
                        id: string;
                        currencyCode: string;
                        code: string;
                        status: import("../invoices/invoices.type").InvoiceStatus;
                        total: import("@prisma/client-runtime-utils").Decimal;
                        vatAmount: import("@prisma/client-runtime-utils").Decimal;
                        subtotal: import("@prisma/client-runtime-utils").Decimal;
                        amountPaid: import("@prisma/client-runtime-utils").Decimal;
                    } | null;
                    id: string;
                    clinicId: string;
                    createdAt: Date;
                    code: string;
                    branchId: string;
                    status: import("../../../generated/prisma/enums").InpatientStayStatus;
                    appointmentId: string | null;
                    kind: import("../../../generated/prisma/enums").InpatientStayKind;
                    monitoringIntervalMinutes: number;
                    acuity: import("../../../generated/prisma/enums").InpatientAcuity;
                    operationCaseId: string | null;
                    presentingComplaint: string | null;
                    admissionDiagnosis: string | null;
                    isolationReason: string | null;
                    admissionWeightRecordId: string | null;
                    dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                    admittedAt: Date | null;
                    expectedDischargeAt: Date | null;
                    dischargedAt: Date | null;
                    dischargeKind: import("../../../generated/prisma/enums").DischargeKind | null;
                    dischargeSummaryAr: string | null;
                    dischargeInstructionsAr: string | null;
                    cancelReasonAr: string | null;
                    nextDueAt: Date | null;
                    attendingStaff: {
                        name: string;
                        id: string;
                    };
                    admittedBy: {
                        name: string;
                        id: string;
                    } | null;
                    dischargedBy: {
                        name: string;
                        id: string;
                    } | null;
                    admissionWeightRecord: {
                        id: string;
                        code: string;
                        weight: import("@prisma/client-runtime-utils").Decimal | null;
                        recordedAt: Date;
                    } | null;
                    dailyRateService: {
                        name: string;
                        id: string;
                    } | null;
                    cageAssignments: {
                        cage: {
                            room: {
                                type: import("../rooms/rooms.type").RoomType;
                                name: string;
                                id: string;
                            };
                            name: string;
                            id: string;
                        };
                        id: string;
                        assignedAt: Date;
                    }[];
                } | null;
                401: {
                    readonly message: "غير مصرح";
                };
                403: {
                    readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                } | {
                    readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                };
                409: {
                    readonly message: string;
                };
                422: {
                    readonly message: string;
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
} & {
    inpatients: {
        ":id": {
            admit: {
                post: {
                    body: {
                        dailyRateServiceId?: string | null | undefined;
                        expectedDischargeAt?: string | null | undefined;
                        cageId: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            due: import("./inpatient-due.service").InpatientDueEvaluation;
                            readiness: {
                                ready: boolean;
                                gates: {
                                    gate: import("./inpatients.workflow").InpatientGate;
                                    satisfied: boolean;
                                    label: string;
                                    overridable: boolean;
                                }[];
                            } | null;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                    enName: string;
                                    species: import("../drug-catalog/drug-catalog.type").CatalogSpecies | null;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                    enName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("../staff/staff.type").Gender;
                                birthDate: Date | null;
                                weight: number | null;
                                microchipNumber: string | null;
                                coat: string | null;
                            };
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                currencyCode: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            code: string;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").InpatientStayStatus;
                            appointmentId: string | null;
                            kind: import("../../../generated/prisma/enums").InpatientStayKind;
                            monitoringIntervalMinutes: number;
                            acuity: import("../../../generated/prisma/enums").InpatientAcuity;
                            operationCaseId: string | null;
                            presentingComplaint: string | null;
                            admissionDiagnosis: string | null;
                            isolationReason: string | null;
                            admissionWeightRecordId: string | null;
                            dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                            admittedAt: Date | null;
                            expectedDischargeAt: Date | null;
                            dischargedAt: Date | null;
                            dischargeKind: import("../../../generated/prisma/enums").DischargeKind | null;
                            dischargeSummaryAr: string | null;
                            dischargeInstructionsAr: string | null;
                            cancelReasonAr: string | null;
                            nextDueAt: Date | null;
                            attendingStaff: {
                                name: string;
                                id: string;
                            };
                            admittedBy: {
                                name: string;
                                id: string;
                            } | null;
                            dischargedBy: {
                                name: string;
                                id: string;
                            } | null;
                            admissionWeightRecord: {
                                id: string;
                                code: string;
                                weight: import("@prisma/client-runtime-utils").Decimal | null;
                                recordedAt: Date;
                            } | null;
                            dailyRateService: {
                                name: string;
                                id: string;
                            } | null;
                            cageAssignments: {
                                cage: {
                                    room: {
                                        type: import("../rooms/rooms.type").RoomType;
                                        name: string;
                                        id: string;
                                    };
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                assignedAt: Date;
                            }[];
                        } | null;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    inpatients: {
        ":id": {
            patch: {
                body: {
                    monitoringIntervalMinutes?: number | undefined;
                    acuity?: "MEDIUM" | "LOW" | "HIGH" | "CRITICAL" | undefined;
                    attendingStaffId?: string | undefined;
                    admissionDiagnosis?: string | null | undefined;
                    isolationReason?: string | null | undefined;
                    dailyRateServiceId?: string | null | undefined;
                    expectedDischargeAt?: string | null | undefined;
                };
                params: {
                    id: string;
                };
                query: {};
                headers: {};
                response: {
                    200: {
                        due: import("./inpatient-due.service").InpatientDueEvaluation;
                        readiness: {
                            ready: boolean;
                            gates: {
                                gate: import("./inpatients.workflow").InpatientGate;
                                satisfied: boolean;
                                label: string;
                                overridable: boolean;
                            }[];
                        } | null;
                        owner: {
                            name: string;
                            id: string;
                            phone: string;
                        };
                        patient: {
                            animalType: {
                                id: string;
                                arName: string;
                                enName: string;
                                species: import("../drug-catalog/drug-catalog.type").CatalogSpecies | null;
                            };
                            animalStrain: {
                                id: string;
                                arName: string;
                                enName: string;
                            } | null;
                            name: string;
                            id: string;
                            code: string;
                            gender: import("../staff/staff.type").Gender;
                            birthDate: Date | null;
                            weight: number | null;
                            microchipNumber: string | null;
                            coat: string | null;
                        };
                        invoice: {
                            discount: import("@prisma/client-runtime-utils").Decimal;
                            id: string;
                            currencyCode: string;
                            code: string;
                            status: import("../invoices/invoices.type").InvoiceStatus;
                            total: import("@prisma/client-runtime-utils").Decimal;
                            vatAmount: import("@prisma/client-runtime-utils").Decimal;
                            subtotal: import("@prisma/client-runtime-utils").Decimal;
                            amountPaid: import("@prisma/client-runtime-utils").Decimal;
                        } | null;
                        id: string;
                        clinicId: string;
                        createdAt: Date;
                        code: string;
                        branchId: string;
                        status: import("../../../generated/prisma/enums").InpatientStayStatus;
                        appointmentId: string | null;
                        kind: import("../../../generated/prisma/enums").InpatientStayKind;
                        monitoringIntervalMinutes: number;
                        acuity: import("../../../generated/prisma/enums").InpatientAcuity;
                        operationCaseId: string | null;
                        presentingComplaint: string | null;
                        admissionDiagnosis: string | null;
                        isolationReason: string | null;
                        admissionWeightRecordId: string | null;
                        dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                        admittedAt: Date | null;
                        expectedDischargeAt: Date | null;
                        dischargedAt: Date | null;
                        dischargeKind: import("../../../generated/prisma/enums").DischargeKind | null;
                        dischargeSummaryAr: string | null;
                        dischargeInstructionsAr: string | null;
                        cancelReasonAr: string | null;
                        nextDueAt: Date | null;
                        attendingStaff: {
                            name: string;
                            id: string;
                        };
                        admittedBy: {
                            name: string;
                            id: string;
                        } | null;
                        dischargedBy: {
                            name: string;
                            id: string;
                        } | null;
                        admissionWeightRecord: {
                            id: string;
                            code: string;
                            weight: import("@prisma/client-runtime-utils").Decimal | null;
                            recordedAt: Date;
                        } | null;
                        dailyRateService: {
                            name: string;
                            id: string;
                        } | null;
                        cageAssignments: {
                            cage: {
                                room: {
                                    type: import("../rooms/rooms.type").RoomType;
                                    name: string;
                                    id: string;
                                };
                                name: string;
                                id: string;
                            };
                            id: string;
                            assignedAt: Date;
                        }[];
                    } | null;
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    };
                    409: {
                        readonly message: string;
                    };
                    422: {
                        readonly message: string;
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
    inpatients: {
        ":id": {
            status: {
                post: {
                    body: {
                        cancelReason?: string | null | undefined;
                        overrideReason?: string | null | undefined;
                        to: "CANCELLED" | "REQUESTED" | "ADMITTED" | "IN_CARE" | "DISCHARGE_PENDING" | "DISCHARGED";
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            due: import("./inpatient-due.service").InpatientDueEvaluation;
                            readiness: {
                                ready: boolean;
                                gates: {
                                    gate: import("./inpatients.workflow").InpatientGate;
                                    satisfied: boolean;
                                    label: string;
                                    overridable: boolean;
                                }[];
                            } | null;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                    enName: string;
                                    species: import("../drug-catalog/drug-catalog.type").CatalogSpecies | null;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                    enName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("../staff/staff.type").Gender;
                                birthDate: Date | null;
                                weight: number | null;
                                microchipNumber: string | null;
                                coat: string | null;
                            };
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                currencyCode: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            code: string;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").InpatientStayStatus;
                            appointmentId: string | null;
                            kind: import("../../../generated/prisma/enums").InpatientStayKind;
                            monitoringIntervalMinutes: number;
                            acuity: import("../../../generated/prisma/enums").InpatientAcuity;
                            operationCaseId: string | null;
                            presentingComplaint: string | null;
                            admissionDiagnosis: string | null;
                            isolationReason: string | null;
                            admissionWeightRecordId: string | null;
                            dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                            admittedAt: Date | null;
                            expectedDischargeAt: Date | null;
                            dischargedAt: Date | null;
                            dischargeKind: import("../../../generated/prisma/enums").DischargeKind | null;
                            dischargeSummaryAr: string | null;
                            dischargeInstructionsAr: string | null;
                            cancelReasonAr: string | null;
                            nextDueAt: Date | null;
                            attendingStaff: {
                                name: string;
                                id: string;
                            };
                            admittedBy: {
                                name: string;
                                id: string;
                            } | null;
                            dischargedBy: {
                                name: string;
                                id: string;
                            } | null;
                            admissionWeightRecord: {
                                id: string;
                                code: string;
                                weight: import("@prisma/client-runtime-utils").Decimal | null;
                                recordedAt: Date;
                            } | null;
                            dailyRateService: {
                                name: string;
                                id: string;
                            } | null;
                            cageAssignments: {
                                cage: {
                                    room: {
                                        type: import("../rooms/rooms.type").RoomType;
                                        name: string;
                                        id: string;
                                    };
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                assignedAt: Date;
                            }[];
                        } | null;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    inpatients: {
        ":id": {
            discharge: {
                post: {
                    body: {
                        dischargeInstructionsAr?: string | null | undefined;
                        overrideReason?: string | null | undefined;
                        dischargeKind: "ROUTINE" | "AGAINST_MEDICAL_ADVICE" | "TRANSFERRED" | "DIED" | "EUTHANIZED";
                        dischargeSummaryAr: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            due: import("./inpatient-due.service").InpatientDueEvaluation;
                            readiness: {
                                ready: boolean;
                                gates: {
                                    gate: import("./inpatients.workflow").InpatientGate;
                                    satisfied: boolean;
                                    label: string;
                                    overridable: boolean;
                                }[];
                            } | null;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                    enName: string;
                                    species: import("../drug-catalog/drug-catalog.type").CatalogSpecies | null;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                    enName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("../staff/staff.type").Gender;
                                birthDate: Date | null;
                                weight: number | null;
                                microchipNumber: string | null;
                                coat: string | null;
                            };
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                currencyCode: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            code: string;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").InpatientStayStatus;
                            appointmentId: string | null;
                            kind: import("../../../generated/prisma/enums").InpatientStayKind;
                            monitoringIntervalMinutes: number;
                            acuity: import("../../../generated/prisma/enums").InpatientAcuity;
                            operationCaseId: string | null;
                            presentingComplaint: string | null;
                            admissionDiagnosis: string | null;
                            isolationReason: string | null;
                            admissionWeightRecordId: string | null;
                            dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                            admittedAt: Date | null;
                            expectedDischargeAt: Date | null;
                            dischargedAt: Date | null;
                            dischargeKind: import("../../../generated/prisma/enums").DischargeKind | null;
                            dischargeSummaryAr: string | null;
                            dischargeInstructionsAr: string | null;
                            cancelReasonAr: string | null;
                            nextDueAt: Date | null;
                            attendingStaff: {
                                name: string;
                                id: string;
                            };
                            admittedBy: {
                                name: string;
                                id: string;
                            } | null;
                            dischargedBy: {
                                name: string;
                                id: string;
                            } | null;
                            admissionWeightRecord: {
                                id: string;
                                code: string;
                                weight: import("@prisma/client-runtime-utils").Decimal | null;
                                recordedAt: Date;
                            } | null;
                            dailyRateService: {
                                name: string;
                                id: string;
                            } | null;
                            cageAssignments: {
                                cage: {
                                    room: {
                                        type: import("../rooms/rooms.type").RoomType;
                                        name: string;
                                        id: string;
                                    };
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                assignedAt: Date;
                            }[];
                        } | null;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    inpatients: {
        ":id": {
            cage: {
                post: {
                    body: {
                        reason?: string | null | undefined;
                        cageId: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            due: import("./inpatient-due.service").InpatientDueEvaluation;
                            readiness: {
                                ready: boolean;
                                gates: {
                                    gate: import("./inpatients.workflow").InpatientGate;
                                    satisfied: boolean;
                                    label: string;
                                    overridable: boolean;
                                }[];
                            } | null;
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                    enName: string;
                                    species: import("../drug-catalog/drug-catalog.type").CatalogSpecies | null;
                                };
                                animalStrain: {
                                    id: string;
                                    arName: string;
                                    enName: string;
                                } | null;
                                name: string;
                                id: string;
                                code: string;
                                gender: import("../staff/staff.type").Gender;
                                birthDate: Date | null;
                                weight: number | null;
                                microchipNumber: string | null;
                                coat: string | null;
                            };
                            invoice: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                currencyCode: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            id: string;
                            clinicId: string;
                            createdAt: Date;
                            code: string;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").InpatientStayStatus;
                            appointmentId: string | null;
                            kind: import("../../../generated/prisma/enums").InpatientStayKind;
                            monitoringIntervalMinutes: number;
                            acuity: import("../../../generated/prisma/enums").InpatientAcuity;
                            operationCaseId: string | null;
                            presentingComplaint: string | null;
                            admissionDiagnosis: string | null;
                            isolationReason: string | null;
                            admissionWeightRecordId: string | null;
                            dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
                            admittedAt: Date | null;
                            expectedDischargeAt: Date | null;
                            dischargedAt: Date | null;
                            dischargeKind: import("../../../generated/prisma/enums").DischargeKind | null;
                            dischargeSummaryAr: string | null;
                            dischargeInstructionsAr: string | null;
                            cancelReasonAr: string | null;
                            nextDueAt: Date | null;
                            attendingStaff: {
                                name: string;
                                id: string;
                            };
                            admittedBy: {
                                name: string;
                                id: string;
                            } | null;
                            dischargedBy: {
                                name: string;
                                id: string;
                            } | null;
                            admissionWeightRecord: {
                                id: string;
                                code: string;
                                weight: import("@prisma/client-runtime-utils").Decimal | null;
                                recordedAt: Date;
                            } | null;
                            dailyRateService: {
                                name: string;
                                id: string;
                            } | null;
                            cageAssignments: {
                                cage: {
                                    room: {
                                        type: import("../rooms/rooms.type").RoomType;
                                        name: string;
                                        id: string;
                                    };
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                assignedAt: Date;
                            }[];
                        } | null;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    inpatients: {
        ":id": {
            notes: {
                post: {
                    body: {
                        mentionUserIds?: string[] | undefined;
                        handover?: boolean | undefined;
                        body: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            type: import("../../../generated/prisma/enums").InpatientActivityType;
                            id: string;
                            createdAt: Date;
                            metadata: import("@prisma/client/runtime/client").JsonValue;
                            body: string | null;
                            author: {
                                name: string;
                                id: string;
                                image: string | null;
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
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    inpatients: {
        ":id": {
            requests: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./inpatients.type").InpatientRequestRow[];
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    inpatients: {
        ":id": {
            invoice: {
                get: {
                    body: {};
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: import("./inpatients-invoice.service").InpatientInvoiceWithLines;
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        404: {
                            readonly message: "الإقامة غير موجودة";
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
    inpatients: {
        ":id": {
            invoice: {
                pay: {
                    post: {
                        body: {
                            paymentMethod: "CASH" | "CARD" | "TRANSFER";
                            amountPaid: number;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                discount: import("@prisma/client-runtime-utils").Decimal;
                                id: string;
                                vatRate: import("@prisma/client-runtime-utils").Decimal;
                                currencyCode: string;
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                                vatAmount: import("@prisma/client-runtime-utils").Decimal;
                                paymentMethod: import("../invoices/invoices.type").PaymentMethod | null;
                                paidAt: Date | null;
                                subtotal: import("@prisma/client-runtime-utils").Decimal;
                                amountPaid: import("@prisma/client-runtime-utils").Decimal;
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
                                readonly message: "الإقامة غير موجودة";
                            };
                            422: {
                                readonly message: "لا مبالغ مستحقّة على الإقامة";
                            } | {
                                readonly message: "الفاتورة مسدَّدة بالفعل";
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
    inpatients: {
        cages: {
            post: {
                body: {
                    notes?: string | null | undefined;
                    sizeClass?: "MEDIUM" | "SMALL" | "LARGE" | "WALK_IN" | null | undefined;
                    name: string;
                    roomId: string;
                };
                params: {};
                query: {};
                headers: {};
                response: {
                    200: {
                        room: {
                            type: import("../rooms/rooms.type").RoomType;
                            name: string;
                            id: string;
                        };
                        name: string;
                        id: string;
                        branchId: string;
                        notes: string | null;
                        active: boolean;
                        roomId: string;
                        sizeClass: import("../../../generated/prisma/enums").CageSizeClass | null;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    403: {
                        readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                    } | {
                        readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                    };
                    409: {
                        readonly message: string;
                    };
                    422: {
                        readonly message: string;
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
    inpatients: {
        cages: {
            ":cageId": {
                patch: {
                    body: {
                        name?: string | undefined;
                        notes?: string | null | undefined;
                        active?: boolean | undefined;
                        sizeClass?: "MEDIUM" | "SMALL" | "LARGE" | "WALK_IN" | null | undefined;
                    };
                    params: {
                        cageId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            room: {
                                type: import("../rooms/rooms.type").RoomType;
                                name: string;
                                id: string;
                            };
                            name: string;
                            id: string;
                            branchId: string;
                            notes: string | null;
                            active: boolean;
                            roomId: string;
                            sizeClass: import("../../../generated/prisma/enums").CageSizeClass | null;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    inpatients: {
        cages: {
            ":cageId": {
                delete: {
                    body: {};
                    params: {
                        cageId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            ok: boolean;
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    inpatients: {
        ":id": {
            draft: {
                "discharge-summary": {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                text: string;
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
                                readonly message: "الإقامة غير موجودة";
                            };
                            422: {
                                readonly message: "لا وقائع مسجّلة في الإقامة بعد — التلخيص يحتاج ما يُلخَّص";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                            503: {
                                readonly message: "تعذّر توليد المسودّة — اكتب التقرير يدويًا";
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    inpatients: {
        ":id": {
            draft: {
                handover: {
                    post: {
                        body: {};
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                text: string;
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
                                readonly message: "الإقامة غير موجودة";
                            };
                            422: {
                                readonly message: "لا وقائع في الساعات الماضية";
                            } | {
                                type: "validation";
                                on: string;
                                summary?: string;
                                message?: string;
                                found?: unknown;
                                property?: string;
                                expected?: string;
                            };
                            503: {
                                readonly message: "تعذّر توليد المسودّة — اكتب التسليم يدويًا";
                            };
                        };
                    };
                };
            };
        };
    };
} & {
    inpatients: {
        patient: {
            ":patientId": {
                get: {
                    body: {};
                    params: {
                        patientId: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            owner: {
                                name: string;
                                id: string;
                                phone: string;
                            };
                            patient: {
                                animalType: {
                                    id: string;
                                    arName: string;
                                    enName: string;
                                };
                                name: string;
                                id: string;
                                code: string;
                                gender: import("../staff/staff.type").Gender;
                            };
                            invoice: {
                                code: string;
                                status: import("../invoices/invoices.type").InvoiceStatus;
                                total: import("@prisma/client-runtime-utils").Decimal;
                            } | null;
                            id: string;
                            code: string;
                            branchId: string;
                            status: import("../../../generated/prisma/enums").InpatientStayStatus;
                            kind: import("../../../generated/prisma/enums").InpatientStayKind;
                            monitoringIntervalMinutes: number;
                            acuity: import("../../../generated/prisma/enums").InpatientAcuity;
                            admissionDiagnosis: string | null;
                            admittedAt: Date | null;
                            expectedDischargeAt: Date | null;
                            dischargedAt: Date | null;
                            dischargeKind: import("../../../generated/prisma/enums").DischargeKind | null;
                            dischargeSummaryAr: string | null;
                            nextDueAt: Date | null;
                            attendingStaff: {
                                name: string;
                                id: string;
                            };
                            cageAssignments: {
                                cage: {
                                    room: {
                                        type: import("../rooms/rooms.type").RoomType;
                                        name: string;
                                        id: string;
                                    };
                                    name: string;
                                    id: string;
                                };
                                id: string;
                                assignedAt: Date;
                            }[];
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
} & {
    inpatients: {
        settings: {
            current: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            boardingEnabled: boolean;
                            consentRequired: boolean;
                            blockDischargeOnUnpaid: boolean;
                            administrationGraceMinutes: number;
                            editable: boolean;
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
    };
} & {
    inpatients: {
        me: {
            staff: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            staffId: string | null;
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
    };
} & {
    inpatients: {
        ":id": {
            orders: {
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
                            idx: number;
                            status: import("../../../generated/prisma/enums").InpatientOrderStatus;
                            route: import("../../../generated/prisma/enums").DrugRoute | null;
                            kind: import("../../../generated/prisma/enums").InpatientOrderKind;
                            stayId: string;
                            inventoryItemId: string | null;
                            catalogProductId: string | null;
                            nameSnapshot: string;
                            prescriptionItemId: string | null;
                            doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            doseUnit: string | null;
                            rateMlPerHour: import("@prisma/client-runtime-utils").Decimal | null;
                            doseSource: import("../../../generated/prisma/enums").DoseSource | null;
                            overrideReasonAr: string | null;
                            scheduleIntervalHours: number | null;
                            scheduleTimes: string[];
                            prn: boolean;
                            startAt: Date;
                            endAt: Date | null;
                            instructionsAr: string | null;
                            discontinuedAt: Date | null;
                            discontinueReasonAr: string | null;
                            orderedBy: {
                                name: string;
                                id: string;
                            } | null;
                            discontinuedBy: {
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
                        404: {
                            readonly message: "الإقامة غير موجودة";
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
    inpatients: {
        ":id": {
            orders: {
                "dose-preview": {
                    post: {
                        body: {
                            route?: "OTHER" | "IV" | "IM" | "SC" | "PO" | "INHALATION" | "TOPICAL" | "EPIDURAL" | null | undefined;
                            inventoryItemId?: string | null | undefined;
                            catalogProductId?: string | null | undefined;
                            doseAmount?: number | null | undefined;
                            doseUnit?: string | null | undefined;
                            rateMlPerHour?: number | null | undefined;
                            overrideReasonAr?: string | null | undefined;
                            scheduleIntervalHours?: number | null | undefined;
                            scheduleTimes?: string[] | undefined;
                            prn?: boolean | undefined;
                            endAt?: string | null | undefined;
                            instructionsAr?: string | null | undefined;
                            kind: "LAB" | "IMAGING" | "OTHER" | "MEDICATION" | "FLUID" | "MONITORING" | "FEEDING" | "ACTIVITY" | "WOUND_CARE";
                            nameSnapshot: string;
                            startAt: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: import("./inpatient-orders.dao").OrderDoseAssessment;
                            401: {
                                readonly message: "غير مصرح";
                            };
                            403: {
                                readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                            } | {
                                readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                            };
                            409: {
                                readonly message: string;
                            };
                            422: {
                                readonly message: string;
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
    inpatients: {
        ":id": {
            orders: {
                post: {
                    body: {
                        route?: "OTHER" | "IV" | "IM" | "SC" | "PO" | "INHALATION" | "TOPICAL" | "EPIDURAL" | null | undefined;
                        inventoryItemId?: string | null | undefined;
                        catalogProductId?: string | null | undefined;
                        doseAmount?: number | null | undefined;
                        doseUnit?: string | null | undefined;
                        rateMlPerHour?: number | null | undefined;
                        overrideReasonAr?: string | null | undefined;
                        scheduleIntervalHours?: number | null | undefined;
                        scheduleTimes?: string[] | undefined;
                        prn?: boolean | undefined;
                        endAt?: string | null | undefined;
                        instructionsAr?: string | null | undefined;
                        kind: "LAB" | "IMAGING" | "OTHER" | "MEDICATION" | "FLUID" | "MONITORING" | "FEEDING" | "ACTIVITY" | "WOUND_CARE";
                        nameSnapshot: string;
                        startAt: string;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            id: string;
                            createdAt: Date;
                            idx: number;
                            status: import("../../../generated/prisma/enums").InpatientOrderStatus;
                            route: import("../../../generated/prisma/enums").DrugRoute | null;
                            kind: import("../../../generated/prisma/enums").InpatientOrderKind;
                            stayId: string;
                            inventoryItemId: string | null;
                            catalogProductId: string | null;
                            nameSnapshot: string;
                            prescriptionItemId: string | null;
                            doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            doseUnit: string | null;
                            rateMlPerHour: import("@prisma/client-runtime-utils").Decimal | null;
                            doseSource: import("../../../generated/prisma/enums").DoseSource | null;
                            overrideReasonAr: string | null;
                            scheduleIntervalHours: number | null;
                            scheduleTimes: string[];
                            prn: boolean;
                            startAt: Date;
                            endAt: Date | null;
                            instructionsAr: string | null;
                            discontinuedAt: Date | null;
                            discontinueReasonAr: string | null;
                            orderedBy: {
                                name: string;
                                id: string;
                            } | null;
                            discontinuedBy: {
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
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    inpatients: {
        ":id": {
            orders: {
                ":orderId": {
                    discontinue: {
                        post: {
                            body: {
                                reasonAr: string;
                            };
                            params: {
                                id: string;
                                orderId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    id: string;
                                    createdAt: Date;
                                    idx: number;
                                    status: import("../../../generated/prisma/enums").InpatientOrderStatus;
                                    route: import("../../../generated/prisma/enums").DrugRoute | null;
                                    kind: import("../../../generated/prisma/enums").InpatientOrderKind;
                                    stayId: string;
                                    inventoryItemId: string | null;
                                    catalogProductId: string | null;
                                    nameSnapshot: string;
                                    prescriptionItemId: string | null;
                                    doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                    doseUnit: string | null;
                                    rateMlPerHour: import("@prisma/client-runtime-utils").Decimal | null;
                                    doseSource: import("../../../generated/prisma/enums").DoseSource | null;
                                    overrideReasonAr: string | null;
                                    scheduleIntervalHours: number | null;
                                    scheduleTimes: string[];
                                    prn: boolean;
                                    startAt: Date;
                                    endAt: Date | null;
                                    instructionsAr: string | null;
                                    discontinuedAt: Date | null;
                                    discontinueReasonAr: string | null;
                                    orderedBy: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    discontinuedBy: {
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
                                409: {
                                    readonly message: string;
                                };
                                422: {
                                    readonly message: string;
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
    };
} & {
    inpatients: {
        ":id": {
            administrations: {
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
                            order: {
                                id: string;
                                status: import("../../../generated/prisma/enums").InpatientOrderStatus;
                                route: import("../../../generated/prisma/enums").DrugRoute | null;
                                kind: import("../../../generated/prisma/enums").InpatientOrderKind;
                                nameSnapshot: string;
                                prescriptionItemId: string | null;
                                doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                doseUnit: string | null;
                                rateMlPerHour: import("@prisma/client-runtime-utils").Decimal | null;
                                prn: boolean;
                                instructionsAr: string | null;
                            };
                            witness: {
                                name: string;
                                id: string;
                            } | null;
                            status: import("../../../generated/prisma/enums").InpatientAdministrationStatus;
                            correctsId: string | null;
                            urination: boolean | null;
                            defecation: boolean | null;
                            orderId: string;
                            dueAt: Date;
                            stayId: string;
                            givenAt: Date | null;
                            doseGivenAmount: import("@prisma/client-runtime-utils").Decimal | null;
                            doseGivenUnit: string | null;
                            batchNoSnapshot: string | null;
                            expiryDateSnapshot: Date | null;
                            vitalSignsRecordId: string | null;
                            eatenFraction: import("@prisma/client-runtime-utils").Decimal | null;
                            vomiting: boolean | null;
                            notesAr: string | null;
                            skipReasonAr: string | null;
                            performedBy: {
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
                        404: {
                            readonly message: "الإقامة غير موجودة";
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
    inpatients: {
        ":id": {
            administrations: {
                ":administrationId": {
                    give: {
                        post: {
                            body: {
                                urination?: boolean | null | undefined;
                                defecation?: boolean | null | undefined;
                                witnessId?: string | null | undefined;
                                doseGivenAmount?: number | null | undefined;
                                doseGivenUnit?: string | null | undefined;
                                stockQuantity?: number | null | undefined;
                                batchId?: string | null | undefined;
                                eatenFraction?: number | null | undefined;
                                vomiting?: boolean | null | undefined;
                                notesAr?: string | null | undefined;
                            };
                            params: {
                                id: string;
                                administrationId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    id: string;
                                    createdAt: Date;
                                    order: {
                                        id: string;
                                        status: import("../../../generated/prisma/enums").InpatientOrderStatus;
                                        route: import("../../../generated/prisma/enums").DrugRoute | null;
                                        kind: import("../../../generated/prisma/enums").InpatientOrderKind;
                                        nameSnapshot: string;
                                        prescriptionItemId: string | null;
                                        doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseUnit: string | null;
                                        rateMlPerHour: import("@prisma/client-runtime-utils").Decimal | null;
                                        prn: boolean;
                                        instructionsAr: string | null;
                                    };
                                    witness: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    status: import("../../../generated/prisma/enums").InpatientAdministrationStatus;
                                    correctsId: string | null;
                                    urination: boolean | null;
                                    defecation: boolean | null;
                                    orderId: string;
                                    dueAt: Date;
                                    stayId: string;
                                    givenAt: Date | null;
                                    doseGivenAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                    doseGivenUnit: string | null;
                                    batchNoSnapshot: string | null;
                                    expiryDateSnapshot: Date | null;
                                    vitalSignsRecordId: string | null;
                                    eatenFraction: import("@prisma/client-runtime-utils").Decimal | null;
                                    vomiting: boolean | null;
                                    notesAr: string | null;
                                    skipReasonAr: string | null;
                                    performedBy: {
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
                                409: {
                                    readonly message: string;
                                };
                                422: {
                                    readonly message: string;
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
    };
} & {
    inpatients: {
        ":id": {
            administrations: {
                ":administrationId": {
                    skip: {
                        post: {
                            body: {
                                hold?: boolean | undefined;
                                skipReasonAr: string;
                            };
                            params: {
                                id: string;
                                administrationId: string;
                            };
                            query: {};
                            headers: {};
                            response: {
                                200: {
                                    id: string;
                                    createdAt: Date;
                                    order: {
                                        id: string;
                                        status: import("../../../generated/prisma/enums").InpatientOrderStatus;
                                        route: import("../../../generated/prisma/enums").DrugRoute | null;
                                        kind: import("../../../generated/prisma/enums").InpatientOrderKind;
                                        nameSnapshot: string;
                                        prescriptionItemId: string | null;
                                        doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                        doseUnit: string | null;
                                        rateMlPerHour: import("@prisma/client-runtime-utils").Decimal | null;
                                        prn: boolean;
                                        instructionsAr: string | null;
                                    };
                                    witness: {
                                        name: string;
                                        id: string;
                                    } | null;
                                    status: import("../../../generated/prisma/enums").InpatientAdministrationStatus;
                                    correctsId: string | null;
                                    urination: boolean | null;
                                    defecation: boolean | null;
                                    orderId: string;
                                    dueAt: Date;
                                    stayId: string;
                                    givenAt: Date | null;
                                    doseGivenAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                    doseGivenUnit: string | null;
                                    batchNoSnapshot: string | null;
                                    expiryDateSnapshot: Date | null;
                                    vitalSignsRecordId: string | null;
                                    eatenFraction: import("@prisma/client-runtime-utils").Decimal | null;
                                    vomiting: boolean | null;
                                    notesAr: string | null;
                                    skipReasonAr: string | null;
                                    performedBy: {
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
                                409: {
                                    readonly message: string;
                                };
                                422: {
                                    readonly message: string;
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
    };
} & {
    inpatients: {
        ":id": {
            administrations: {
                prn: {
                    post: {
                        body: {
                            witnessId?: string | null | undefined;
                            doseGivenAmount?: number | null | undefined;
                            doseGivenUnit?: string | null | undefined;
                            stockQuantity?: number | null | undefined;
                            batchId?: string | null | undefined;
                            notesAr?: string | null | undefined;
                            orderId: string;
                        };
                        params: {
                            id: string;
                        };
                        query: {};
                        headers: {};
                        response: {
                            200: {
                                id: string;
                                createdAt: Date;
                                order: {
                                    id: string;
                                    status: import("../../../generated/prisma/enums").InpatientOrderStatus;
                                    route: import("../../../generated/prisma/enums").DrugRoute | null;
                                    kind: import("../../../generated/prisma/enums").InpatientOrderKind;
                                    nameSnapshot: string;
                                    prescriptionItemId: string | null;
                                    doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                    doseUnit: string | null;
                                    rateMlPerHour: import("@prisma/client-runtime-utils").Decimal | null;
                                    prn: boolean;
                                    instructionsAr: string | null;
                                };
                                witness: {
                                    name: string;
                                    id: string;
                                } | null;
                                status: import("../../../generated/prisma/enums").InpatientAdministrationStatus;
                                correctsId: string | null;
                                urination: boolean | null;
                                defecation: boolean | null;
                                orderId: string;
                                dueAt: Date;
                                stayId: string;
                                givenAt: Date | null;
                                doseGivenAmount: import("@prisma/client-runtime-utils").Decimal | null;
                                doseGivenUnit: string | null;
                                batchNoSnapshot: string | null;
                                expiryDateSnapshot: Date | null;
                                vitalSignsRecordId: string | null;
                                eatenFraction: import("@prisma/client-runtime-utils").Decimal | null;
                                vomiting: boolean | null;
                                notesAr: string | null;
                                skipReasonAr: string | null;
                                performedBy: {
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
                            409: {
                                readonly message: string;
                            };
                            422: {
                                readonly message: string;
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
    inpatients: {
        ":id": {
            vitals: {
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
                            code: string;
                            notes: string | null;
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
                            mucousMembrane: import("../vital-signs/vital-signs.type").MucousMembrane | null;
                            recordedBy: {
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
                        404: {
                            readonly message: "الإقامة غير موجودة";
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
    inpatients: {
        ":id": {
            vitals: {
                post: {
                    body: {
                        notes?: string | null | undefined;
                        weight?: number | null | undefined;
                        recordedAt?: string | null | undefined;
                        temperature?: number | null | undefined;
                        heartRate?: number | null | undefined;
                        respiratoryRate?: number | null | undefined;
                        oxygenSaturation?: number | null | undefined;
                        bloodPressure?: string | null | undefined;
                        painScore?: number | null | undefined;
                        bodyConditionScore?: number | null | undefined;
                        capillaryRefillSec?: number | null | undefined;
                        mucousMembrane?: "PINK" | "PALE" | "CYANOTIC" | "ICTERIC" | "CONGESTED" | "MUDDY" | null | undefined;
                        administrationId?: string | null | undefined;
                    };
                    params: {
                        id: string;
                    };
                    query: {};
                    headers: {};
                    response: {
                        200: {
                            record: {
                                id: string;
                                code: string;
                                weight: import("@prisma/client-runtime-utils").Decimal | null;
                                recordedAt: Date;
                            };
                            alerts: import("./inpatient-alerts.service").InpatientAlert[];
                        };
                        401: {
                            readonly message: "غير مصرح";
                        };
                        403: {
                            readonly message: `\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 ${string}`;
                        } | {
                            readonly message: "صلاحيتك لا تغطّي نطاق هذه العملية";
                        };
                        409: {
                            readonly message: string;
                        };
                        422: {
                            readonly message: string;
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
    inpatients: {
        "reference-ranges": {
            list: {
                get: {
                    body: {};
                    params: {};
                    query: {};
                    headers: {};
                    response: {
                        200: readonly import("./vital-reference-ranges.data").VitalReferenceRow[];
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
