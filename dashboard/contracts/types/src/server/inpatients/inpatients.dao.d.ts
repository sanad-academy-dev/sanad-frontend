import type { Prisma } from "@/generated/prisma/client";
import type { DischargeKind, InpatientAcuity, InpatientOrderKind, InpatientStayKind, InpatientStayStatus } from "@/generated/prisma/enums";
import { type CageWithOccupancy, type InpatientRequestRow, type InpatientStayCard } from "@/server/inpatients/inpatients.type";
import { type InpatientGate } from "@/server/inpatients/inpatients.workflow";
import type { BranchScope } from "@/server/rbac/rbac.macro";
type Tx = Prisma.TransactionClient;
declare const nextVitalsCode: (client?: Tx) => Promise<string>;
/** العمر بالأسابيع — null حين لا تاريخ ميلاد، ولا يُخمَّن (قاعدة محرّك اللقاحات) */
export declare const ageWeeksOf: (birthDate: Date | null | undefined, at?: Date) => number | null;
/**
 * يعيد حساب كاش أقرب استحقاق. يُستدعى بعد كل كتابة تحرّكه: إنشاء أمر، إعطاء
 * جرعة، تخطّيها، تسجيل قياس، إيقاف أمر، خروج.
 *
 * الكاش للفرز والمسح السريع فقط؛ العرض التفصيلي يُعيد التقييم من الصفوف نفسها،
 * فلا يظهر رقم قديم لو أخفقت كتابةٌ هنا.
 */
declare function refreshNextDueAt(tx: Tx, stayId: string): Promise<Date | null>;
/**
 * يولّد صفوف الإعطاء الناقصة لأمرٍ ضمن أفق التوليد.
 *
 * فكرة «التوليد المسبق» هي ما يُغني الوحدة عن مجدول: الصفوف موجودة قبل موعدها،
 * فقائمة «ما استحقّ» استعلامٌ مفهرس. والتمديد يجري عند كل قراءة للورقة، فالإقامة
 * الطويلة لا تنفد صفوفها ما دام أحدٌ يفتح الشاشة — وإن لم يفتحها أحد فلا أحد
 * ينتظر القائمة أصلًا.
 *
 * التوليد **مُتَحمِّل للتكرار**: يُقارن بالمخزَّن ويُدرج الناقص وحده، فاستدعاؤه
 * مرّتين لا يُنتج جرعتين.
 */
declare function materializeAdministrations(tx: Tx, order: {
    id: string;
    stayId: string;
    startAt: Date;
    endAt: Date | null;
    scheduleIntervalHours: number | null;
    scheduleTimes: string[];
    prn: boolean;
    status: string;
}, horizonEnd: Date): Promise<number>;
/** يمدّد أفق التوليد لكل أوامر الإقامة النشطة */
declare function extendGenerationHorizon(tx: Tx, stayId: string, at: Date): Promise<number>;
/**
 * الإقامة مع سياقها الأدنى. النوع مُعلَن صراحةً لا مُستنتَجًا: هذه الدالّة
 * تُستدعى من ملفّ الأوامر الذي تقرؤه حزمة العميل عبر Eden Treaty بميزانية
 * استنتاج أضيق، فيسقط `select` هناك إلى النموذج كاملًا وتضيع العلاقات.
 */
export type LoadedStay = {
    id: string;
    code: string;
    clinicId: string;
    branchId: string;
    patientId: string;
    ownerId: string;
    status: InpatientStayStatus;
    kind: InpatientStayKind;
    acuity: InpatientAcuity;
    admittedAt: Date | null;
    dischargedAt: Date | null;
    monitoringIntervalMinutes: number;
    attendingStaff: {
        id: string;
        userId: string | null;
    };
    patient: {
        id: string;
        name: string;
    };
};
declare function loadStayOrThrow(clinicId: string, id: string): Promise<LoadedStay>;
declare function gateSettings(clinicId: string, client?: Tx): Promise<{
    boardingEnabled: boolean;
    consentRequired: boolean;
    blockDischargeOnUnpaid: boolean;
    administrationGraceMinutes: number;
    requireWitnessOnWaste: boolean;
}>;
export declare const inpatientsDao: {
    listBoard(clinicId: string, scope: BranchScope, filters?: {
        view?: "active" | "discharged" | "all";
        q?: string;
        kind?: InpatientStayKind;
        acuity?: InpatientAcuity;
        attendingStaffId?: string;
    }): Promise<{
        due: import("@/server/inpatients/inpatient-due.service").InpatientDueEvaluation;
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
            gender: import("@/generated/prisma/enums").Gender;
        };
        id: string;
        code: string;
        branchId: string;
        status: InpatientStayStatus;
        kind: InpatientStayKind;
        monitoringIntervalMinutes: number;
        acuity: InpatientAcuity;
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
                    type: import("@/generated/prisma/enums").RoomType;
                    name: string;
                    id: string;
                };
                name: string;
                id: string;
            };
            id: string;
            assignedAt: Date;
        }[];
    }[]>;
    /**
     * يُلحق تقييم الاستحقاق بكل كرت. التقييم يُعاد حسابه من الصفوف لا من الكاش:
     * الكاش رتّب القائمة، والعرض يحتاج التفصيل (كم فات، وما الذي فات).
     */
    decorateWithDue(stays: InpatientStayCard[], graceMinutes?: number): Promise<{
        due: import("@/server/inpatients/inpatient-due.service").InpatientDueEvaluation;
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
            gender: import("@/generated/prisma/enums").Gender;
        };
        id: string;
        code: string;
        branchId: string;
        status: InpatientStayStatus;
        kind: InpatientStayKind;
        monitoringIntervalMinutes: number;
        acuity: InpatientAcuity;
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
                    type: import("@/generated/prisma/enums").RoomType;
                    name: string;
                    id: string;
                };
                name: string;
                id: string;
            };
            id: string;
            assignedAt: Date;
        }[];
    }[]>;
    stats(clinicId: string, scope: BranchScope): Promise<{
        census: number;
        icu: number;
        isolation: number;
        criticalAcuity: number;
        overdueCount: number;
        dischargedToday: number;
    }>;
    /**
     * قائمة المستحقّ على مستوى الأكاديمية — ما تعرضه شريط الإنذارات فوق اللوحة.
     *
     * هذه هي اللحظة التي يُكتشف فيها الفائت (لا مجدول، الخطة §4.7)، فهنا تُبعث
     * إشعارات التأخّر — مرّة واحدة لكل صفّ بفضل حارس التكرار أدناه.
     */
    listDue(clinicId: string, scope: BranchScope, options?: {
        notify?: boolean;
    }): Promise<{
        due: import("@/server/inpatients/inpatient-due.service").InpatientDueEvaluation;
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
            gender: import("@/generated/prisma/enums").Gender;
        };
        id: string;
        code: string;
        branchId: string;
        status: InpatientStayStatus;
        kind: InpatientStayKind;
        monitoringIntervalMinutes: number;
        acuity: InpatientAcuity;
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
                    type: import("@/generated/prisma/enums").RoomType;
                    name: string;
                    id: string;
                };
                name: string;
                id: string;
            };
            id: string;
            assignedAt: Date;
        }[];
    }[]>;
    findDetail(clinicId: string, id: string): Promise<{
        due: import("@/server/inpatients/inpatient-due.service").InpatientDueEvaluation;
        readiness: {
            ready: boolean;
            gates: {
                gate: InpatientGate;
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
                species: import("@/generated/prisma/enums").CatalogSpecies | null;
            };
            animalStrain: {
                id: string;
                arName: string;
                enName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
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
            status: import("@/generated/prisma/enums").InvoiceStatus;
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
        status: InpatientStayStatus;
        appointmentId: string | null;
        kind: InpatientStayKind;
        monitoringIntervalMinutes: number;
        acuity: InpatientAcuity;
        operationCaseId: string | null;
        presentingComplaint: string | null;
        admissionDiagnosis: string | null;
        isolationReason: string | null;
        admissionWeightRecordId: string | null;
        dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        admittedAt: Date | null;
        expectedDischargeAt: Date | null;
        dischargedAt: Date | null;
        dischargeKind: DischargeKind | null;
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
                    type: import("@/generated/prisma/enums").RoomType;
                    name: string;
                    id: string;
                };
                name: string;
                id: string;
            };
            id: string;
            assignedAt: Date;
        }[];
    } | null>;
    stayBelongsToClinic(clinicId: string, id: string): Promise<{
        id: string;
        code: string;
        branchId: string;
        status: InpatientStayStatus;
        patientId: string;
    } | null>;
    /** كل إقامات طفل — الأحدث أولًا (لسان التنويم في ملفّ الطفل) */
    listForPatient(clinicId: string, patientId: string): Promise<{
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
            gender: import("@/generated/prisma/enums").Gender;
        };
        invoice: {
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        id: string;
        code: string;
        branchId: string;
        status: InpatientStayStatus;
        kind: InpatientStayKind;
        monitoringIntervalMinutes: number;
        acuity: InpatientAcuity;
        admissionDiagnosis: string | null;
        admittedAt: Date | null;
        expectedDischargeAt: Date | null;
        dischargedAt: Date | null;
        dischargeKind: DischargeKind | null;
        dischargeSummaryAr: string | null;
        nextDueAt: Date | null;
        attendingStaff: {
            name: string;
            id: string;
        };
        cageAssignments: {
            cage: {
                room: {
                    type: import("@/generated/prisma/enums").RoomType;
                    name: string;
                    id: string;
                };
                name: string;
                id: string;
            };
            id: string;
            assignedAt: Date;
        }[];
    }[]>;
    /**
     * إقرارات الإقامة — ما تقرأه البوابة G3 وما تعرضه الورقة.
     *
     * تشمل المسوّدات لا الموقَّعة وحدها: الطاقم يحتاج أن يرى الإقرار المُنشأ الذي
     * ينتظر توقيعًا، وإخفاؤه يجعله يُنشئ نسخة ثانية كلّما فتح الشاشة.
     */
    listConsents(stayId: string): Promise<{
        type: import("@/generated/prisma/enums").ConsentType;
        id: string;
        createdAt: Date;
        status: import("@/generated/prisma/enums").ConsentStatus;
        templateKey: string;
        revokedAt: Date | null;
        signerName: string | null;
        signedAt: Date | null;
    }[]>;
    listActivity(stayId: string): Promise<{
        type: import("@/generated/prisma/enums").InpatientActivityType;
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        body: string | null;
        author: {
            name: string;
            id: string;
            image: string | null;
        } | null;
    }[]>;
    listOrders(stayId: string): Promise<{
        id: string;
        createdAt: Date;
        idx: number;
        status: import("@/generated/prisma/enums").InpatientOrderStatus;
        route: import("@/generated/prisma/enums").DrugRoute | null;
        kind: InpatientOrderKind;
        stayId: string;
        inventoryItemId: string | null;
        catalogProductId: string | null;
        nameSnapshot: string;
        prescriptionItemId: string | null;
        doseAmount: import("@prisma/client-runtime-utils").Decimal | null;
        doseUnit: string | null;
        rateMlPerHour: import("@prisma/client-runtime-utils").Decimal | null;
        doseSource: import("@/generated/prisma/enums").DoseSource | null;
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
    }[]>;
    /** ورقة العلاج ليوم واحد — العمود الفقري للشاشة التي تُملأ على القفص */
    listAdministrations(stayId: string, day?: Date): Promise<{
        id: string;
        createdAt: Date;
        order: {
            id: string;
            status: import("@/generated/prisma/enums").InpatientOrderStatus;
            route: import("@/generated/prisma/enums").DrugRoute | null;
            kind: InpatientOrderKind;
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
        status: import("@/generated/prisma/enums").InpatientAdministrationStatus;
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
    }[]>;
    listVitals(stayId: string, limit?: number): Promise<{
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
        mucousMembrane: import("@/generated/prisma/enums").MucousMembrane | null;
        recordedBy: {
            name: string;
            id: string;
        } | null;
    }[]>;
    /** قائمة تحقّق الخروج — اقتراح لا منع (الخطة §4.6) */
    dischargeReadiness(clinicId: string, stayId: string): Promise<{
        ready: boolean;
        gates: {
            gate: InpatientGate;
            satisfied: boolean;
            label: string;
            overridable: boolean;
        }[];
    } | null>;
    /**
     * تُعرض على الشاشة لتشرح ما يحكم البوابات. للقراءة فقط في v1 — انظر تعليق
     * `gateSettings` أعلاه لسبب عدم كونها قابلة للضبط بعد.
     */
    getSettings(clinicId: string): Promise<{
        boardingEnabled: boolean;
        consentRequired: boolean;
        blockDischargeOnUnpaid: boolean;
        administrationGraceMinutes: number;
        editable: boolean;
    }>;
    listCages(clinicId: string, scope: BranchScope, filters?: {
        branchId?: string;
        roomId?: string;
        onlyFree?: boolean;
    }): Promise<CageWithOccupancy[]>;
    /** إشغال القاعات — الرقم الذي كانت خانة «٠/السعة» في إعدادات الفروع تنتظره */
    roomOccupancy(clinicId: string, branchId?: string): Promise<{
        roomId: string;
        cages: number;
        occupied: number;
    }[]>;
    createCage(clinicId: string, input: {
        roomId: string;
        name: string;
        sizeClass?: string | null;
        notes?: string | null;
    }): Promise<{
        room: {
            type: import("@/generated/prisma/enums").RoomType;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        branchId: string;
        notes: string | null;
        active: boolean;
        roomId: string;
        sizeClass: import("@/generated/prisma/enums").CageSizeClass | null;
    }>;
    updateCage(clinicId: string, cageId: string, input: {
        name?: string;
        sizeClass?: string | null;
        notes?: string | null;
        active?: boolean;
    }): Promise<{
        room: {
            type: import("@/generated/prisma/enums").RoomType;
            name: string;
            id: string;
        };
        name: string;
        id: string;
        branchId: string;
        notes: string | null;
        active: boolean;
        roomId: string;
        sizeClass: import("@/generated/prisma/enums").CageSizeClass | null;
    }>;
    deleteCage(clinicId: string, cageId: string): Promise<{
        ok: boolean;
    }>;
    /**
     * [IP2] كتابة **طلب تنويم**. لا إسكان ولا وقت دخول هنا: الطلب قرارٌ سريري
     * يكتبه المدرّب، والدخول فعلٌ تشغيليّ منفصل يقرّر مكانه من يملك العنبر.
     * دمجُهما كان أصل الفوضى — نموذجٌ واحد يسأل المدرّبَ عن رقم قفصٍ لا يعرفه.
     */
    /**
     * [IP2] طلبات المختبر والأشعّة المكتوبة من داخل الإقامة — كلّها، مكتملةً أو لا.
     *
     * استعلامان مستقلّان على العمود القياسيّ `inpatientStayId` (لا علاقة Prisma —
     * انظر تعليقه في المخطّط). النوع مُعلَن صراحةً كي لا يسقط `select` إلى النموذج.
     */
    listRequests(clinicId: string, stayId: string): Promise<InpatientRequestRow[]>;
    createRequest(input: {
        clinicId: string;
        branchId: string;
        patientId: string;
        attendingStaffId: string;
        userId: string;
        kind?: InpatientStayKind;
        acuity?: InpatientAcuity;
        appointmentId?: string | null;
        operationCaseId?: string | null;
        presentingComplaint?: string | null;
        admissionDiagnosis?: string | null;
        isolationReason?: string | null;
        monitoringIntervalMinutes?: number | null;
        dailyRateServiceId?: string | null;
        expectedDischargeAt?: Date | null;
        importPostOpOrders?: boolean;
    }): Promise<{
        due: import("@/server/inpatients/inpatient-due.service").InpatientDueEvaluation;
        readiness: {
            ready: boolean;
            gates: {
                gate: InpatientGate;
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
                species: import("@/generated/prisma/enums").CatalogSpecies | null;
            };
            animalStrain: {
                id: string;
                arName: string;
                enName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
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
            status: import("@/generated/prisma/enums").InvoiceStatus;
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
        status: InpatientStayStatus;
        appointmentId: string | null;
        kind: InpatientStayKind;
        monitoringIntervalMinutes: number;
        acuity: InpatientAcuity;
        operationCaseId: string | null;
        presentingComplaint: string | null;
        admissionDiagnosis: string | null;
        isolationReason: string | null;
        admissionWeightRecordId: string | null;
        dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        admittedAt: Date | null;
        expectedDischargeAt: Date | null;
        dischargedAt: Date | null;
        dischargeKind: DischargeKind | null;
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
                    type: import("@/generated/prisma/enums").RoomType;
                    name: string;
                    id: string;
                };
                name: string;
                id: string;
            };
            id: string;
            assignedAt: Date;
        }[];
    } | null>;
    /**
     * [IP2] **الإدخال** — طلب ← دخل. هنا وحده يُختار القفص ويُختم وقت الدخول.
     *
     * الإسكان جزء من الانتقال لا خطوة تسبقه: بوّابتا G1 وG4 تُقيَّمان بعد الإسناد
     * داخل المعاملة نفسها، فإمّا أن يدخل الطفل مُسكنًا أو لا يدخل. إسنادٌ ينجح
     * ثم انتقالٌ يفشل يترك قفصًا مشغولًا بإقامة لم تدخل.
     */
    admitRequest(input: {
        clinicId: string;
        id: string;
        userId: string;
        cageId: string;
        expectedDischargeAt?: Date | null;
        dailyRateServiceId?: string | null;
    }): Promise<{
        due: import("@/server/inpatients/inpatient-due.service").InpatientDueEvaluation;
        readiness: {
            ready: boolean;
            gates: {
                gate: InpatientGate;
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
                species: import("@/generated/prisma/enums").CatalogSpecies | null;
            };
            animalStrain: {
                id: string;
                arName: string;
                enName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
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
            status: import("@/generated/prisma/enums").InvoiceStatus;
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
        status: InpatientStayStatus;
        appointmentId: string | null;
        kind: InpatientStayKind;
        monitoringIntervalMinutes: number;
        acuity: InpatientAcuity;
        operationCaseId: string | null;
        presentingComplaint: string | null;
        admissionDiagnosis: string | null;
        isolationReason: string | null;
        admissionWeightRecordId: string | null;
        dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        admittedAt: Date | null;
        expectedDischargeAt: Date | null;
        dischargedAt: Date | null;
        dischargeKind: DischargeKind | null;
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
                    type: import("@/generated/prisma/enums").RoomType;
                    name: string;
                    id: string;
                };
                name: string;
                id: string;
            };
            id: string;
            assignedAt: Date;
        }[];
    } | null>;
    update(clinicId: string, id: string, userId: string, input: {
        acuity?: InpatientAcuity;
        attendingStaffId?: string;
        monitoringIntervalMinutes?: number;
        expectedDischargeAt?: Date | null;
        admissionDiagnosis?: string | null;
        isolationReason?: string | null;
        dailyRateServiceId?: string | null;
    }): Promise<{
        due: import("@/server/inpatients/inpatient-due.service").InpatientDueEvaluation;
        readiness: {
            ready: boolean;
            gates: {
                gate: InpatientGate;
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
                species: import("@/generated/prisma/enums").CatalogSpecies | null;
            };
            animalStrain: {
                id: string;
                arName: string;
                enName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
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
            status: import("@/generated/prisma/enums").InvoiceStatus;
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
        status: InpatientStayStatus;
        appointmentId: string | null;
        kind: InpatientStayKind;
        monitoringIntervalMinutes: number;
        acuity: InpatientAcuity;
        operationCaseId: string | null;
        presentingComplaint: string | null;
        admissionDiagnosis: string | null;
        isolationReason: string | null;
        admissionWeightRecordId: string | null;
        dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        admittedAt: Date | null;
        expectedDischargeAt: Date | null;
        dischargedAt: Date | null;
        dischargeKind: DischargeKind | null;
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
                    type: import("@/generated/prisma/enums").RoomType;
                    name: string;
                    id: string;
                };
                name: string;
                id: string;
            };
            id: string;
            assignedAt: Date;
        }[];
    } | null>;
    transition(input: {
        clinicId: string;
        id: string;
        to: InpatientStayStatus;
        userId: string;
        overrideReason?: string | null;
        cancelReason?: string | null;
    }): Promise<{
        due: import("@/server/inpatients/inpatient-due.service").InpatientDueEvaluation;
        readiness: {
            ready: boolean;
            gates: {
                gate: InpatientGate;
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
                species: import("@/generated/prisma/enums").CatalogSpecies | null;
            };
            animalStrain: {
                id: string;
                arName: string;
                enName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
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
            status: import("@/generated/prisma/enums").InvoiceStatus;
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
        status: InpatientStayStatus;
        appointmentId: string | null;
        kind: InpatientStayKind;
        monitoringIntervalMinutes: number;
        acuity: InpatientAcuity;
        operationCaseId: string | null;
        presentingComplaint: string | null;
        admissionDiagnosis: string | null;
        isolationReason: string | null;
        admissionWeightRecordId: string | null;
        dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        admittedAt: Date | null;
        expectedDischargeAt: Date | null;
        dischargedAt: Date | null;
        dischargeKind: DischargeKind | null;
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
                    type: import("@/generated/prisma/enums").RoomType;
                    name: string;
                    id: string;
                };
                name: string;
                id: string;
            };
            id: string;
            assignedAt: Date;
        }[];
    } | null>;
    discharge(input: {
        clinicId: string;
        id: string;
        userId: string;
        dischargeKind: DischargeKind;
        dischargeSummaryAr: string;
        dischargeInstructionsAr?: string | null;
        overrideReason?: string | null;
    }): Promise<{
        due: import("@/server/inpatients/inpatient-due.service").InpatientDueEvaluation;
        readiness: {
            ready: boolean;
            gates: {
                gate: InpatientGate;
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
                species: import("@/generated/prisma/enums").CatalogSpecies | null;
            };
            animalStrain: {
                id: string;
                arName: string;
                enName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
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
            status: import("@/generated/prisma/enums").InvoiceStatus;
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
        status: InpatientStayStatus;
        appointmentId: string | null;
        kind: InpatientStayKind;
        monitoringIntervalMinutes: number;
        acuity: InpatientAcuity;
        operationCaseId: string | null;
        presentingComplaint: string | null;
        admissionDiagnosis: string | null;
        isolationReason: string | null;
        admissionWeightRecordId: string | null;
        dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        admittedAt: Date | null;
        expectedDischargeAt: Date | null;
        dischargedAt: Date | null;
        dischargeKind: DischargeKind | null;
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
                    type: import("@/generated/prisma/enums").RoomType;
                    name: string;
                    id: string;
                };
                name: string;
                id: string;
            };
            id: string;
            assignedAt: Date;
        }[];
    } | null>;
    assignCage(input: {
        clinicId: string;
        stayId: string;
        cageId: string;
        userId: string;
        reason?: string | null;
    }): Promise<{
        due: import("@/server/inpatients/inpatient-due.service").InpatientDueEvaluation;
        readiness: {
            ready: boolean;
            gates: {
                gate: InpatientGate;
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
                species: import("@/generated/prisma/enums").CatalogSpecies | null;
            };
            animalStrain: {
                id: string;
                arName: string;
                enName: string;
            } | null;
            name: string;
            id: string;
            code: string;
            gender: import("@/generated/prisma/enums").Gender;
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
            status: import("@/generated/prisma/enums").InvoiceStatus;
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
        status: InpatientStayStatus;
        appointmentId: string | null;
        kind: InpatientStayKind;
        monitoringIntervalMinutes: number;
        acuity: InpatientAcuity;
        operationCaseId: string | null;
        presentingComplaint: string | null;
        admissionDiagnosis: string | null;
        isolationReason: string | null;
        admissionWeightRecordId: string | null;
        dailyRateSnapshot: import("@prisma/client-runtime-utils").Decimal | null;
        admittedAt: Date | null;
        expectedDischargeAt: Date | null;
        dischargedAt: Date | null;
        dischargeKind: DischargeKind | null;
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
                    type: import("@/generated/prisma/enums").RoomType;
                    name: string;
                    id: string;
                };
                name: string;
                id: string;
            };
            id: string;
            assignedAt: Date;
        }[];
    } | null>;
    addNote(input: {
        clinicId: string;
        stayId: string;
        userId: string;
        body: string;
        mentionUserIds?: string[];
        handover?: boolean;
    }): Promise<{
        type: import("@/generated/prisma/enums").InpatientActivityType;
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        body: string | null;
        author: {
            name: string;
            id: string;
            image: string | null;
        } | null;
    }>;
};
export { extendGenerationHorizon, gateSettings, loadStayOrThrow, materializeAdministrations, nextVitalsCode, refreshNextDueAt, };
