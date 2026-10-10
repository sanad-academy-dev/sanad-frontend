import type { Prisma } from "@/generated/prisma/client";
import { GroomingAdjustmentSource, GroomingIncidentSeverity, GroomingLane, GroomingPhotoKind, GroomingStatus, ParasiteFinding } from "@/generated/prisma/enums";
import { type CreateGroomingSessionInput, type GroomingActivityResponse, type GroomingDueRow } from "@/server/grooming/grooming.type";
import { type GroomingGate } from "@/server/grooming/grooming.workflow";
/** خطأ مجال — يلتقطه المتحكّم ويحوّله إلى 409 برسالة عربية */
export declare class GroomingRuleError extends Error {
    readonly gate?: GroomingGate | undefined;
    constructor(message: string, gate?: GroomingGate | undefined);
}
export declare const groomingDao: {
    listBoard(clinicId: string, opts: {
        period?: string;
        view?: string;
        q?: string;
        groomerId?: string;
        userStaffId?: string;
    }): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                arName: string;
            };
            animalStrain: {
                arName: string;
                isBrachycephalic: boolean;
            } | null;
            name: string;
            id: string;
            code: string;
        };
        id: string;
        _count: {
            findings: number;
            incidents: number;
        };
        code: string;
        status: GroomingStatus;
        scheduledAt: Date;
        stage: import("@/generated/prisma/enums").GroomingStage | null;
        lane: GroomingLane;
        estimatedDurationMin: number;
        promisedReadyAt: Date | null;
        readyAt: Date | null;
        quoteTotal: import("@prisma/client-runtime-utils").Decimal;
        sedationPlanned: boolean;
        dryingMethod: import("@/generated/prisma/enums").GroomingDryingMethod | null;
        groomer: {
            user: {
                name: string;
            } | null;
            id: string;
        };
        station: {
            name: string;
            id: string;
        } | null;
        intake: {
            mattingGrade: import("@/generated/prisma/enums").MattingGrade;
            parasiteFinding: ParasiteFinding;
            behaviorScore: import("@/generated/prisma/enums").GroomingBehaviorScore;
            heatDryProhibitedSnapshot: boolean;
        } | null;
    }[]>;
    stats(clinicId: string): Promise<{
        today: number;
        inCustody: number;
        ready: number;
        overdue: number;
        openIncidents: number;
    }>;
    findDetail(clinicId: string, id: string): Prisma.Prisma__GroomingSessionClient<{
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                arName: string;
            };
            animalStrain: {
                arName: string;
                isBrachycephalic: boolean;
            } | null;
            name: string;
            id: string;
            code: string;
        };
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        id: string;
        createdAt: Date;
        _count: {
            findings: number;
            incidents: number;
        };
        code: string;
        branchId: string;
        status: GroomingStatus;
        items: {
            id: string;
            notes: string | null;
            serviceId: string | null;
            quantity: number;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            durationSnapshot: number;
            nameSnapshot: string;
            definitionId: string | null;
            performed: boolean;
            laneSnapshot: GroomingLane;
            dryingSnapshot: number;
            priceLevelSnapshot: string | null;
            matchedRuleId: string | null;
        }[];
        products: {
            id: string;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            inventoryItemId: string | null;
            nameSnapshot: string;
            issuedAt: Date | null;
            billable: boolean;
            dilution: string | null;
            contactTimeMin: number | null;
            bodyZones: string[];
        }[];
        appointmentId: string | null;
        cancelReason: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        scheduledAt: Date;
        stage: import("@/generated/prisma/enums").GroomingStage | null;
        photos: {
            url: string;
            id: string;
            createdAt: Date;
            kind: GroomingPhotoKind;
            caption: string | null;
            bodyZone: string | null;
        }[];
        lane: GroomingLane;
        estimatedDurationMin: number;
        adjustments: {
            id: string;
            reason: string | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
            source: GroomingAdjustmentSource;
            modifierCode: import("@/generated/prisma/enums").GroomingModifierCode;
            labelSnapshot: string;
            approvedByOwnerAt: Date | null;
        }[];
        cancelKind: import("@/generated/prisma/enums").GroomingCancelKind | null;
        findings: {
            id: string;
            createdAt: Date;
            labOrderId: string | null;
            category: import("@/generated/prisma/enums").GroomingFindingCategory;
            severity: import("@/generated/prisma/enums").GroomingFindingSeverity;
            note: string;
            bodyZone: string | null;
            photoId: string | null;
            acknowledgedAt: Date | null;
            referralAppointmentId: string | null;
            dismissedReason: string | null;
        }[];
        promisedReadyAt: Date | null;
        readyAt: Date | null;
        quoteTotal: import("@prisma/client-runtime-utils").Decimal;
        sedationPlanned: boolean;
        dryingMethod: import("@/generated/prisma/enums").GroomingDryingMethod | null;
        groomer: {
            user: {
                name: string;
            } | null;
            id: string;
        };
        station: {
            name: string;
            id: string;
        } | null;
        intake: {
            id: string;
            notes: string | null;
            earCondition: import("@/generated/prisma/enums").EarCondition;
            weightKg: import("@prisma/client-runtime-utils").Decimal | null;
            temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
            mattingGrade: import("@/generated/prisma/enums").MattingGrade;
            coatCondition: import("@/generated/prisma/enums").CoatCondition;
            parasiteFinding: ParasiteFinding;
            skinFindings: string[];
            nailCondition: import("@/generated/prisma/enums").NailCondition;
            dentalNote: string | null;
            behaviorScore: import("@/generated/prisma/enums").GroomingBehaviorScore;
            muzzleUsed: boolean;
            rabiesValidUntil: Date | null;
            vaccinationOverrideReason: string | null;
            shaveDownRecommended: boolean;
            shaveDownApprovedAt: Date | null;
            heatDryProhibitedSnapshot: boolean;
            heatDryReasonsSnapshot: string[];
            parasiteTreatedAt: Date | null;
            parasiteOwnerNotifiedAt: Date | null;
            isolationAcknowledgedAt: Date | null;
            belongings: string[];
            performedAt: Date;
        } | null;
        assistantId: string | null;
        vetOrderStaffId: string | null;
        vetOrderNote: string | null;
        dropOffAt: Date | null;
        checkedInAt: Date | null;
        dryingStartedAt: Date | null;
        pickedUpAt: Date | null;
        quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
        quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
        bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
        ownerApprovedQuoteAt: Date | null;
        incidents: {
            id: string;
            createdAt: Date;
            description: string;
            resolvedAt: Date | null;
            kind: import("@/generated/prisma/enums").GroomingIncidentKind;
            severity: GroomingIncidentSeverity;
            followUpAppointmentId: string | null;
            actionTaken: string | null;
            ownerNotifiedAt: Date | null;
            vetAssessedByStaffId: string | null;
            vetAssessmentNote: string | null;
        }[];
        reportCard: {
            id: string;
            summary: string;
            sentAt: Date | null;
            moodScore: import("@/generated/prisma/enums").GroomingMoodScore;
            recommendedIntervalWeeks: number | null;
            nextRecommendedAt: Date | null;
            publicToken: string;
            channel: import("@/generated/prisma/enums").ReportCardChannel | null;
            rebookedSessionId: string | null;
        } | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /**
     * سجل الجلسة مع أسماء الفاعلين.
     *
     * `authorUserId` عمود حرّ بلا علاقة في المخطَّط، فاسم الفاعل يُجلب باستعلام
     * ثانٍ ويُركَّب هنا — سجلٌّ يعرض معرّفات خامًا لا يقرأه أحد، والعلاقة الكاملة
     * تستلزم قيد مفتاح أجنبي وهجرةً لا يبرّرها حقلُ عرضٍ واحد.
     */
    listActivity(sessionId: string): Promise<GroomingActivityResponse[]>;
    /**
     * تعليم بند الدورة منفَّذًا أو التراجع عنه.
     *
     * البند المنفَّذ ليس زينة: هو ما يفصل «حُجزت الدورة» عن «أُدّيت»، وعليه يقوم
     * التقرير النهائي وما يُقال للوليّ أمر. بلا هذا المسار كانت علامات التنفيذ تُعرض
     * ولا تُضبط أبدًا.
     */
    setItemPerformed(args: {
        clinicId: string;
        id: string;
        itemId: string;
        performed: boolean;
        userId?: string;
    }): Promise<{
        id: string;
        notes: string | null;
        serviceId: string | null;
        quantity: number;
        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
        durationSnapshot: number;
        nameSnapshot: string;
        definitionId: string | null;
        performed: boolean;
        laneSnapshot: GroomingLane;
        dryingSnapshot: number;
        priceLevelSnapshot: string | null;
        matchedRuleId: string | null;
    }>;
    /**
     * إصدار فاتورة الجلسة أو تحديث مجاميعها عند الطلب.
     *
     * الإصدار التلقائي يقع عند «جاهز للاستلام»، لكن الفاتورة تُطلب قبل ذلك كثيرًا
     * (دفعة مقدَّمة، أو وليّ أمر يريد الرقم قبل أن يترك طفله)، ولا سبب يمنع إصدارها.
     */
    issueInvoice(clinicId: string, id: string, userId?: string): Promise<{
        discount: import("@prisma/client-runtime-utils").Decimal;
        id: string;
        vatRate: import("@prisma/client-runtime-utils").Decimal;
        currencyCode: string;
        code: string;
        status: import("@/generated/prisma/enums").InvoiceStatus;
        total: import("@prisma/client-runtime-utils").Decimal;
        vatAmount: import("@prisma/client-runtime-utils").Decimal;
        paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
        paidAt: Date | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        amountPaid: import("@prisma/client-runtime-utils").Decimal;
    }>;
    /**
     * إنشاء جلسة: التسعير على الخادم، والتعارض يُرفض قبل الكتابة.
     * المسار يُشتق من الدورات المختارة — دورة طبية واحدة ترفع الجلسة كلها.
     */
    create(input: CreateGroomingSessionInput): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                arName: string;
            };
            animalStrain: {
                arName: string;
                isBrachycephalic: boolean;
            } | null;
            name: string;
            id: string;
            code: string;
        };
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        id: string;
        createdAt: Date;
        _count: {
            findings: number;
            incidents: number;
        };
        code: string;
        branchId: string;
        status: GroomingStatus;
        items: {
            id: string;
            notes: string | null;
            serviceId: string | null;
            quantity: number;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            durationSnapshot: number;
            nameSnapshot: string;
            definitionId: string | null;
            performed: boolean;
            laneSnapshot: GroomingLane;
            dryingSnapshot: number;
            priceLevelSnapshot: string | null;
            matchedRuleId: string | null;
        }[];
        products: {
            id: string;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            inventoryItemId: string | null;
            nameSnapshot: string;
            issuedAt: Date | null;
            billable: boolean;
            dilution: string | null;
            contactTimeMin: number | null;
            bodyZones: string[];
        }[];
        appointmentId: string | null;
        cancelReason: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        scheduledAt: Date;
        stage: import("@/generated/prisma/enums").GroomingStage | null;
        photos: {
            url: string;
            id: string;
            createdAt: Date;
            kind: GroomingPhotoKind;
            caption: string | null;
            bodyZone: string | null;
        }[];
        lane: GroomingLane;
        estimatedDurationMin: number;
        adjustments: {
            id: string;
            reason: string | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
            source: GroomingAdjustmentSource;
            modifierCode: import("@/generated/prisma/enums").GroomingModifierCode;
            labelSnapshot: string;
            approvedByOwnerAt: Date | null;
        }[];
        cancelKind: import("@/generated/prisma/enums").GroomingCancelKind | null;
        findings: {
            id: string;
            createdAt: Date;
            labOrderId: string | null;
            category: import("@/generated/prisma/enums").GroomingFindingCategory;
            severity: import("@/generated/prisma/enums").GroomingFindingSeverity;
            note: string;
            bodyZone: string | null;
            photoId: string | null;
            acknowledgedAt: Date | null;
            referralAppointmentId: string | null;
            dismissedReason: string | null;
        }[];
        promisedReadyAt: Date | null;
        readyAt: Date | null;
        quoteTotal: import("@prisma/client-runtime-utils").Decimal;
        sedationPlanned: boolean;
        dryingMethod: import("@/generated/prisma/enums").GroomingDryingMethod | null;
        groomer: {
            user: {
                name: string;
            } | null;
            id: string;
        };
        station: {
            name: string;
            id: string;
        } | null;
        intake: {
            id: string;
            notes: string | null;
            earCondition: import("@/generated/prisma/enums").EarCondition;
            weightKg: import("@prisma/client-runtime-utils").Decimal | null;
            temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
            mattingGrade: import("@/generated/prisma/enums").MattingGrade;
            coatCondition: import("@/generated/prisma/enums").CoatCondition;
            parasiteFinding: ParasiteFinding;
            skinFindings: string[];
            nailCondition: import("@/generated/prisma/enums").NailCondition;
            dentalNote: string | null;
            behaviorScore: import("@/generated/prisma/enums").GroomingBehaviorScore;
            muzzleUsed: boolean;
            rabiesValidUntil: Date | null;
            vaccinationOverrideReason: string | null;
            shaveDownRecommended: boolean;
            shaveDownApprovedAt: Date | null;
            heatDryProhibitedSnapshot: boolean;
            heatDryReasonsSnapshot: string[];
            parasiteTreatedAt: Date | null;
            parasiteOwnerNotifiedAt: Date | null;
            isolationAcknowledgedAt: Date | null;
            belongings: string[];
            performedAt: Date;
        } | null;
        assistantId: string | null;
        vetOrderStaffId: string | null;
        vetOrderNote: string | null;
        dropOffAt: Date | null;
        checkedInAt: Date | null;
        dryingStartedAt: Date | null;
        pickedUpAt: Date | null;
        quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
        quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
        bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
        ownerApprovedQuoteAt: Date | null;
        incidents: {
            id: string;
            createdAt: Date;
            description: string;
            resolvedAt: Date | null;
            kind: import("@/generated/prisma/enums").GroomingIncidentKind;
            severity: GroomingIncidentSeverity;
            followUpAppointmentId: string | null;
            actionTaken: string | null;
            ownerNotifiedAt: Date | null;
            vetAssessedByStaffId: string | null;
            vetAssessmentNote: string | null;
        }[];
        reportCard: {
            id: string;
            summary: string;
            sentAt: Date | null;
            moodScore: import("@/generated/prisma/enums").GroomingMoodScore;
            recommendedIntervalWeeks: number | null;
            nextRecommendedAt: Date | null;
            publicToken: string;
            channel: import("@/generated/prisma/enums").ReportCardChannel | null;
            rebookedSessionId: string | null;
        } | null;
    }>;
    /**
     * نقل الحالة — قلب الوحدة. الترتيب مقصود: صحّة الانتقال، ثم البوابات، ثم
     * الأثر الجانبي، ثم السجل — كلّه في معاملة واحدة (NFR-1).
     */
    transition(args: {
        clinicId: string;
        id: string;
        to: GroomingStatus;
        userId?: string;
        overrideReason?: string;
        cancelKind?: Prisma.GroomingSessionUncheckedUpdateInput["cancelKind"];
        cancelReason?: string;
    }): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                arName: string;
            };
            animalStrain: {
                arName: string;
                isBrachycephalic: boolean;
            } | null;
            name: string;
            id: string;
            code: string;
        };
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        id: string;
        createdAt: Date;
        _count: {
            findings: number;
            incidents: number;
        };
        code: string;
        branchId: string;
        status: GroomingStatus;
        items: {
            id: string;
            notes: string | null;
            serviceId: string | null;
            quantity: number;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            durationSnapshot: number;
            nameSnapshot: string;
            definitionId: string | null;
            performed: boolean;
            laneSnapshot: GroomingLane;
            dryingSnapshot: number;
            priceLevelSnapshot: string | null;
            matchedRuleId: string | null;
        }[];
        products: {
            id: string;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            inventoryItemId: string | null;
            nameSnapshot: string;
            issuedAt: Date | null;
            billable: boolean;
            dilution: string | null;
            contactTimeMin: number | null;
            bodyZones: string[];
        }[];
        appointmentId: string | null;
        cancelReason: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        scheduledAt: Date;
        stage: import("@/generated/prisma/enums").GroomingStage | null;
        photos: {
            url: string;
            id: string;
            createdAt: Date;
            kind: GroomingPhotoKind;
            caption: string | null;
            bodyZone: string | null;
        }[];
        lane: GroomingLane;
        estimatedDurationMin: number;
        adjustments: {
            id: string;
            reason: string | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
            source: GroomingAdjustmentSource;
            modifierCode: import("@/generated/prisma/enums").GroomingModifierCode;
            labelSnapshot: string;
            approvedByOwnerAt: Date | null;
        }[];
        cancelKind: import("@/generated/prisma/enums").GroomingCancelKind | null;
        findings: {
            id: string;
            createdAt: Date;
            labOrderId: string | null;
            category: import("@/generated/prisma/enums").GroomingFindingCategory;
            severity: import("@/generated/prisma/enums").GroomingFindingSeverity;
            note: string;
            bodyZone: string | null;
            photoId: string | null;
            acknowledgedAt: Date | null;
            referralAppointmentId: string | null;
            dismissedReason: string | null;
        }[];
        promisedReadyAt: Date | null;
        readyAt: Date | null;
        quoteTotal: import("@prisma/client-runtime-utils").Decimal;
        sedationPlanned: boolean;
        dryingMethod: import("@/generated/prisma/enums").GroomingDryingMethod | null;
        groomer: {
            user: {
                name: string;
            } | null;
            id: string;
        };
        station: {
            name: string;
            id: string;
        } | null;
        intake: {
            id: string;
            notes: string | null;
            earCondition: import("@/generated/prisma/enums").EarCondition;
            weightKg: import("@prisma/client-runtime-utils").Decimal | null;
            temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
            mattingGrade: import("@/generated/prisma/enums").MattingGrade;
            coatCondition: import("@/generated/prisma/enums").CoatCondition;
            parasiteFinding: ParasiteFinding;
            skinFindings: string[];
            nailCondition: import("@/generated/prisma/enums").NailCondition;
            dentalNote: string | null;
            behaviorScore: import("@/generated/prisma/enums").GroomingBehaviorScore;
            muzzleUsed: boolean;
            rabiesValidUntil: Date | null;
            vaccinationOverrideReason: string | null;
            shaveDownRecommended: boolean;
            shaveDownApprovedAt: Date | null;
            heatDryProhibitedSnapshot: boolean;
            heatDryReasonsSnapshot: string[];
            parasiteTreatedAt: Date | null;
            parasiteOwnerNotifiedAt: Date | null;
            isolationAcknowledgedAt: Date | null;
            belongings: string[];
            performedAt: Date;
        } | null;
        assistantId: string | null;
        vetOrderStaffId: string | null;
        vetOrderNote: string | null;
        dropOffAt: Date | null;
        checkedInAt: Date | null;
        dryingStartedAt: Date | null;
        pickedUpAt: Date | null;
        quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
        quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
        bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
        ownerApprovedQuoteAt: Date | null;
        incidents: {
            id: string;
            createdAt: Date;
            description: string;
            resolvedAt: Date | null;
            kind: import("@/generated/prisma/enums").GroomingIncidentKind;
            severity: GroomingIncidentSeverity;
            followUpAppointmentId: string | null;
            actionTaken: string | null;
            ownerNotifiedAt: Date | null;
            vetAssessedByStaffId: string | null;
            vetAssessmentNote: string | null;
        }[];
        reportCard: {
            id: string;
            summary: string;
            sentAt: Date | null;
            moodScore: import("@/generated/prisma/enums").GroomingMoodScore;
            recommendedIntervalWeeks: number | null;
            nextRecommendedAt: Date | null;
            publicToken: string;
            channel: import("@/generated/prisma/enums").ReportCardChannel | null;
            rebookedSessionId: string | null;
        } | null;
    }>;
    /** ضبط طريقة التجفيف — تُرفض الطريقة الممنوعة هنا لا عند الانتقال فقط */
    setDryingMethod(args: {
        clinicId: string;
        id: string;
        method: Prisma.GroomingSessionUncheckedUpdateInput["dryingMethod"];
        userId?: string;
    }): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                arName: string;
            };
            animalStrain: {
                arName: string;
                isBrachycephalic: boolean;
            } | null;
            name: string;
            id: string;
            code: string;
        };
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        id: string;
        createdAt: Date;
        _count: {
            findings: number;
            incidents: number;
        };
        code: string;
        branchId: string;
        status: GroomingStatus;
        items: {
            id: string;
            notes: string | null;
            serviceId: string | null;
            quantity: number;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            durationSnapshot: number;
            nameSnapshot: string;
            definitionId: string | null;
            performed: boolean;
            laneSnapshot: GroomingLane;
            dryingSnapshot: number;
            priceLevelSnapshot: string | null;
            matchedRuleId: string | null;
        }[];
        products: {
            id: string;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            inventoryItemId: string | null;
            nameSnapshot: string;
            issuedAt: Date | null;
            billable: boolean;
            dilution: string | null;
            contactTimeMin: number | null;
            bodyZones: string[];
        }[];
        appointmentId: string | null;
        cancelReason: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        scheduledAt: Date;
        stage: import("@/generated/prisma/enums").GroomingStage | null;
        photos: {
            url: string;
            id: string;
            createdAt: Date;
            kind: GroomingPhotoKind;
            caption: string | null;
            bodyZone: string | null;
        }[];
        lane: GroomingLane;
        estimatedDurationMin: number;
        adjustments: {
            id: string;
            reason: string | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
            source: GroomingAdjustmentSource;
            modifierCode: import("@/generated/prisma/enums").GroomingModifierCode;
            labelSnapshot: string;
            approvedByOwnerAt: Date | null;
        }[];
        cancelKind: import("@/generated/prisma/enums").GroomingCancelKind | null;
        findings: {
            id: string;
            createdAt: Date;
            labOrderId: string | null;
            category: import("@/generated/prisma/enums").GroomingFindingCategory;
            severity: import("@/generated/prisma/enums").GroomingFindingSeverity;
            note: string;
            bodyZone: string | null;
            photoId: string | null;
            acknowledgedAt: Date | null;
            referralAppointmentId: string | null;
            dismissedReason: string | null;
        }[];
        promisedReadyAt: Date | null;
        readyAt: Date | null;
        quoteTotal: import("@prisma/client-runtime-utils").Decimal;
        sedationPlanned: boolean;
        dryingMethod: import("@/generated/prisma/enums").GroomingDryingMethod | null;
        groomer: {
            user: {
                name: string;
            } | null;
            id: string;
        };
        station: {
            name: string;
            id: string;
        } | null;
        intake: {
            id: string;
            notes: string | null;
            earCondition: import("@/generated/prisma/enums").EarCondition;
            weightKg: import("@prisma/client-runtime-utils").Decimal | null;
            temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
            mattingGrade: import("@/generated/prisma/enums").MattingGrade;
            coatCondition: import("@/generated/prisma/enums").CoatCondition;
            parasiteFinding: ParasiteFinding;
            skinFindings: string[];
            nailCondition: import("@/generated/prisma/enums").NailCondition;
            dentalNote: string | null;
            behaviorScore: import("@/generated/prisma/enums").GroomingBehaviorScore;
            muzzleUsed: boolean;
            rabiesValidUntil: Date | null;
            vaccinationOverrideReason: string | null;
            shaveDownRecommended: boolean;
            shaveDownApprovedAt: Date | null;
            heatDryProhibitedSnapshot: boolean;
            heatDryReasonsSnapshot: string[];
            parasiteTreatedAt: Date | null;
            parasiteOwnerNotifiedAt: Date | null;
            isolationAcknowledgedAt: Date | null;
            belongings: string[];
            performedAt: Date;
        } | null;
        assistantId: string | null;
        vetOrderStaffId: string | null;
        vetOrderNote: string | null;
        dropOffAt: Date | null;
        checkedInAt: Date | null;
        dryingStartedAt: Date | null;
        pickedUpAt: Date | null;
        quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
        quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
        bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
        ownerApprovedQuoteAt: Date | null;
        incidents: {
            id: string;
            createdAt: Date;
            description: string;
            resolvedAt: Date | null;
            kind: import("@/generated/prisma/enums").GroomingIncidentKind;
            severity: GroomingIncidentSeverity;
            followUpAppointmentId: string | null;
            actionTaken: string | null;
            ownerNotifiedAt: Date | null;
            vetAssessedByStaffId: string | null;
            vetAssessmentNote: string | null;
        }[];
        reportCard: {
            id: string;
            summary: string;
            sentAt: Date | null;
            moodScore: import("@/generated/prisma/enums").GroomingMoodScore;
            recommendedIntervalWeeks: number | null;
            nextRecommendedAt: Date | null;
            publicToken: string;
            channel: import("@/generated/prisma/enums").ReportCardChannel | null;
            rebookedSessionId: string | null;
        } | null;
    }>;
    /**
     * تسجيل الفحص القبلي وإعادة التسعير عليه.
     *
     * هنا يُشتقّ منع التجفيف الحارّ ويُثبَّت لقطةً على الفحص: قراءته لاحقًا من
     * الكرت الحيّ تجعل تغييرًا بعد أسبوع يعيد كتابة ما كان صحيحًا يوم الجلسة.
     */
    recordIntake(args: {
        clinicId: string;
        id: string;
        userId?: string;
        staffId?: string;
        data: Prisma.GroomingIntakeUncheckedCreateInput extends never ? never : Record<string, unknown>;
    }): Promise<{
        intake: {
            id: string;
            notes: string | null;
            earCondition: import("@/generated/prisma/enums").EarCondition;
            weightKg: import("@prisma/client-runtime-utils").Decimal | null;
            temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
            mattingGrade: import("@/generated/prisma/enums").MattingGrade;
            coatCondition: import("@/generated/prisma/enums").CoatCondition;
            parasiteFinding: ParasiteFinding;
            skinFindings: string[];
            nailCondition: import("@/generated/prisma/enums").NailCondition;
            dentalNote: string | null;
            behaviorScore: import("@/generated/prisma/enums").GroomingBehaviorScore;
            muzzleUsed: boolean;
            rabiesValidUntil: Date | null;
            vaccinationOverrideReason: string | null;
            shaveDownRecommended: boolean;
            shaveDownApprovedAt: Date | null;
            heatDryProhibitedSnapshot: boolean;
            heatDryReasonsSnapshot: string[];
            parasiteTreatedAt: Date | null;
            parasiteOwnerNotifiedAt: Date | null;
            isolationAcknowledgedAt: Date | null;
            belongings: string[];
            performedAt: Date;
        };
        quoteTotal: number;
        needsReapproval: boolean;
    }>;
    approveQuote(clinicId: string, id: string, userId?: string): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                arName: string;
            };
            animalStrain: {
                arName: string;
                isBrachycephalic: boolean;
            } | null;
            name: string;
            id: string;
            code: string;
        };
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        id: string;
        createdAt: Date;
        _count: {
            findings: number;
            incidents: number;
        };
        code: string;
        branchId: string;
        status: GroomingStatus;
        items: {
            id: string;
            notes: string | null;
            serviceId: string | null;
            quantity: number;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            durationSnapshot: number;
            nameSnapshot: string;
            definitionId: string | null;
            performed: boolean;
            laneSnapshot: GroomingLane;
            dryingSnapshot: number;
            priceLevelSnapshot: string | null;
            matchedRuleId: string | null;
        }[];
        products: {
            id: string;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            inventoryItemId: string | null;
            nameSnapshot: string;
            issuedAt: Date | null;
            billable: boolean;
            dilution: string | null;
            contactTimeMin: number | null;
            bodyZones: string[];
        }[];
        appointmentId: string | null;
        cancelReason: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        scheduledAt: Date;
        stage: import("@/generated/prisma/enums").GroomingStage | null;
        photos: {
            url: string;
            id: string;
            createdAt: Date;
            kind: GroomingPhotoKind;
            caption: string | null;
            bodyZone: string | null;
        }[];
        lane: GroomingLane;
        estimatedDurationMin: number;
        adjustments: {
            id: string;
            reason: string | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
            source: GroomingAdjustmentSource;
            modifierCode: import("@/generated/prisma/enums").GroomingModifierCode;
            labelSnapshot: string;
            approvedByOwnerAt: Date | null;
        }[];
        cancelKind: import("@/generated/prisma/enums").GroomingCancelKind | null;
        findings: {
            id: string;
            createdAt: Date;
            labOrderId: string | null;
            category: import("@/generated/prisma/enums").GroomingFindingCategory;
            severity: import("@/generated/prisma/enums").GroomingFindingSeverity;
            note: string;
            bodyZone: string | null;
            photoId: string | null;
            acknowledgedAt: Date | null;
            referralAppointmentId: string | null;
            dismissedReason: string | null;
        }[];
        promisedReadyAt: Date | null;
        readyAt: Date | null;
        quoteTotal: import("@prisma/client-runtime-utils").Decimal;
        sedationPlanned: boolean;
        dryingMethod: import("@/generated/prisma/enums").GroomingDryingMethod | null;
        groomer: {
            user: {
                name: string;
            } | null;
            id: string;
        };
        station: {
            name: string;
            id: string;
        } | null;
        intake: {
            id: string;
            notes: string | null;
            earCondition: import("@/generated/prisma/enums").EarCondition;
            weightKg: import("@prisma/client-runtime-utils").Decimal | null;
            temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
            mattingGrade: import("@/generated/prisma/enums").MattingGrade;
            coatCondition: import("@/generated/prisma/enums").CoatCondition;
            parasiteFinding: ParasiteFinding;
            skinFindings: string[];
            nailCondition: import("@/generated/prisma/enums").NailCondition;
            dentalNote: string | null;
            behaviorScore: import("@/generated/prisma/enums").GroomingBehaviorScore;
            muzzleUsed: boolean;
            rabiesValidUntil: Date | null;
            vaccinationOverrideReason: string | null;
            shaveDownRecommended: boolean;
            shaveDownApprovedAt: Date | null;
            heatDryProhibitedSnapshot: boolean;
            heatDryReasonsSnapshot: string[];
            parasiteTreatedAt: Date | null;
            parasiteOwnerNotifiedAt: Date | null;
            isolationAcknowledgedAt: Date | null;
            belongings: string[];
            performedAt: Date;
        } | null;
        assistantId: string | null;
        vetOrderStaffId: string | null;
        vetOrderNote: string | null;
        dropOffAt: Date | null;
        checkedInAt: Date | null;
        dryingStartedAt: Date | null;
        pickedUpAt: Date | null;
        quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
        quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
        bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
        ownerApprovedQuoteAt: Date | null;
        incidents: {
            id: string;
            createdAt: Date;
            description: string;
            resolvedAt: Date | null;
            kind: import("@/generated/prisma/enums").GroomingIncidentKind;
            severity: GroomingIncidentSeverity;
            followUpAppointmentId: string | null;
            actionTaken: string | null;
            ownerNotifiedAt: Date | null;
            vetAssessedByStaffId: string | null;
            vetAssessmentNote: string | null;
        }[];
        reportCard: {
            id: string;
            summary: string;
            sentAt: Date | null;
            moodScore: import("@/generated/prisma/enums").GroomingMoodScore;
            recommendedIntervalWeeks: number | null;
            nextRecommendedAt: Date | null;
            publicToken: string;
            channel: import("@/generated/prisma/enums").ReportCardChannel | null;
            rebookedSessionId: string | null;
        } | null;
    }>;
    /** موافقة الحلاقة الاضطرارية — البوابة G4 تقرأ هذا الختم */
    approveShaveDown(clinicId: string, id: string, staffId?: string, userId?: string): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                arName: string;
            };
            animalStrain: {
                arName: string;
                isBrachycephalic: boolean;
            } | null;
            name: string;
            id: string;
            code: string;
        };
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        id: string;
        createdAt: Date;
        _count: {
            findings: number;
            incidents: number;
        };
        code: string;
        branchId: string;
        status: GroomingStatus;
        items: {
            id: string;
            notes: string | null;
            serviceId: string | null;
            quantity: number;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            durationSnapshot: number;
            nameSnapshot: string;
            definitionId: string | null;
            performed: boolean;
            laneSnapshot: GroomingLane;
            dryingSnapshot: number;
            priceLevelSnapshot: string | null;
            matchedRuleId: string | null;
        }[];
        products: {
            id: string;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            inventoryItemId: string | null;
            nameSnapshot: string;
            issuedAt: Date | null;
            billable: boolean;
            dilution: string | null;
            contactTimeMin: number | null;
            bodyZones: string[];
        }[];
        appointmentId: string | null;
        cancelReason: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        scheduledAt: Date;
        stage: import("@/generated/prisma/enums").GroomingStage | null;
        photos: {
            url: string;
            id: string;
            createdAt: Date;
            kind: GroomingPhotoKind;
            caption: string | null;
            bodyZone: string | null;
        }[];
        lane: GroomingLane;
        estimatedDurationMin: number;
        adjustments: {
            id: string;
            reason: string | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
            source: GroomingAdjustmentSource;
            modifierCode: import("@/generated/prisma/enums").GroomingModifierCode;
            labelSnapshot: string;
            approvedByOwnerAt: Date | null;
        }[];
        cancelKind: import("@/generated/prisma/enums").GroomingCancelKind | null;
        findings: {
            id: string;
            createdAt: Date;
            labOrderId: string | null;
            category: import("@/generated/prisma/enums").GroomingFindingCategory;
            severity: import("@/generated/prisma/enums").GroomingFindingSeverity;
            note: string;
            bodyZone: string | null;
            photoId: string | null;
            acknowledgedAt: Date | null;
            referralAppointmentId: string | null;
            dismissedReason: string | null;
        }[];
        promisedReadyAt: Date | null;
        readyAt: Date | null;
        quoteTotal: import("@prisma/client-runtime-utils").Decimal;
        sedationPlanned: boolean;
        dryingMethod: import("@/generated/prisma/enums").GroomingDryingMethod | null;
        groomer: {
            user: {
                name: string;
            } | null;
            id: string;
        };
        station: {
            name: string;
            id: string;
        } | null;
        intake: {
            id: string;
            notes: string | null;
            earCondition: import("@/generated/prisma/enums").EarCondition;
            weightKg: import("@prisma/client-runtime-utils").Decimal | null;
            temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
            mattingGrade: import("@/generated/prisma/enums").MattingGrade;
            coatCondition: import("@/generated/prisma/enums").CoatCondition;
            parasiteFinding: ParasiteFinding;
            skinFindings: string[];
            nailCondition: import("@/generated/prisma/enums").NailCondition;
            dentalNote: string | null;
            behaviorScore: import("@/generated/prisma/enums").GroomingBehaviorScore;
            muzzleUsed: boolean;
            rabiesValidUntil: Date | null;
            vaccinationOverrideReason: string | null;
            shaveDownRecommended: boolean;
            shaveDownApprovedAt: Date | null;
            heatDryProhibitedSnapshot: boolean;
            heatDryReasonsSnapshot: string[];
            parasiteTreatedAt: Date | null;
            parasiteOwnerNotifiedAt: Date | null;
            isolationAcknowledgedAt: Date | null;
            belongings: string[];
            performedAt: Date;
        } | null;
        assistantId: string | null;
        vetOrderStaffId: string | null;
        vetOrderNote: string | null;
        dropOffAt: Date | null;
        checkedInAt: Date | null;
        dryingStartedAt: Date | null;
        pickedUpAt: Date | null;
        quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
        quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
        bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
        ownerApprovedQuoteAt: Date | null;
        incidents: {
            id: string;
            createdAt: Date;
            description: string;
            resolvedAt: Date | null;
            kind: import("@/generated/prisma/enums").GroomingIncidentKind;
            severity: GroomingIncidentSeverity;
            followUpAppointmentId: string | null;
            actionTaken: string | null;
            ownerNotifiedAt: Date | null;
            vetAssessedByStaffId: string | null;
            vetAssessmentNote: string | null;
        }[];
        reportCard: {
            id: string;
            summary: string;
            sentAt: Date | null;
            moodScore: import("@/generated/prisma/enums").GroomingMoodScore;
            recommendedIntervalWeeks: number | null;
            nextRecommendedAt: Date | null;
            publicToken: string;
            channel: import("@/generated/prisma/enums").ReportCardChannel | null;
            rebookedSessionId: string | null;
        } | null;
    } | null>;
    /** بروتوكول الطفيليات — البوابة G7 تطلب الثلاثة معًا */
    recordParasiteProtocol(args: {
        clinicId: string;
        id: string;
        treated?: boolean;
        ownerNotified?: boolean;
        isolated?: boolean;
        userId?: string;
    }): Promise<{
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            animalType: {
                arName: string;
            };
            animalStrain: {
                arName: string;
                isBrachycephalic: boolean;
            } | null;
            name: string;
            id: string;
            code: string;
        };
        invoice: {
            discount: import("@prisma/client-runtime-utils").Decimal;
            id: string;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            currencyCode: string;
            code: string;
            status: import("@/generated/prisma/enums").InvoiceStatus;
            total: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: import("@/generated/prisma/enums").PaymentMethod | null;
            paidAt: Date | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            amountPaid: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        id: string;
        createdAt: Date;
        _count: {
            findings: number;
            incidents: number;
        };
        code: string;
        branchId: string;
        status: GroomingStatus;
        items: {
            id: string;
            notes: string | null;
            serviceId: string | null;
            quantity: number;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            durationSnapshot: number;
            nameSnapshot: string;
            definitionId: string | null;
            performed: boolean;
            laneSnapshot: GroomingLane;
            dryingSnapshot: number;
            priceLevelSnapshot: string | null;
            matchedRuleId: string | null;
        }[];
        products: {
            id: string;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
            inventoryItemId: string | null;
            nameSnapshot: string;
            issuedAt: Date | null;
            billable: boolean;
            dilution: string | null;
            contactTimeMin: number | null;
            bodyZones: string[];
        }[];
        appointmentId: string | null;
        cancelReason: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        scheduledAt: Date;
        stage: import("@/generated/prisma/enums").GroomingStage | null;
        photos: {
            url: string;
            id: string;
            createdAt: Date;
            kind: GroomingPhotoKind;
            caption: string | null;
            bodyZone: string | null;
        }[];
        lane: GroomingLane;
        estimatedDurationMin: number;
        adjustments: {
            id: string;
            reason: string | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
            source: GroomingAdjustmentSource;
            modifierCode: import("@/generated/prisma/enums").GroomingModifierCode;
            labelSnapshot: string;
            approvedByOwnerAt: Date | null;
        }[];
        cancelKind: import("@/generated/prisma/enums").GroomingCancelKind | null;
        findings: {
            id: string;
            createdAt: Date;
            labOrderId: string | null;
            category: import("@/generated/prisma/enums").GroomingFindingCategory;
            severity: import("@/generated/prisma/enums").GroomingFindingSeverity;
            note: string;
            bodyZone: string | null;
            photoId: string | null;
            acknowledgedAt: Date | null;
            referralAppointmentId: string | null;
            dismissedReason: string | null;
        }[];
        promisedReadyAt: Date | null;
        readyAt: Date | null;
        quoteTotal: import("@prisma/client-runtime-utils").Decimal;
        sedationPlanned: boolean;
        dryingMethod: import("@/generated/prisma/enums").GroomingDryingMethod | null;
        groomer: {
            user: {
                name: string;
            } | null;
            id: string;
        };
        station: {
            name: string;
            id: string;
        } | null;
        intake: {
            id: string;
            notes: string | null;
            earCondition: import("@/generated/prisma/enums").EarCondition;
            weightKg: import("@prisma/client-runtime-utils").Decimal | null;
            temperatureC: import("@prisma/client-runtime-utils").Decimal | null;
            mattingGrade: import("@/generated/prisma/enums").MattingGrade;
            coatCondition: import("@/generated/prisma/enums").CoatCondition;
            parasiteFinding: ParasiteFinding;
            skinFindings: string[];
            nailCondition: import("@/generated/prisma/enums").NailCondition;
            dentalNote: string | null;
            behaviorScore: import("@/generated/prisma/enums").GroomingBehaviorScore;
            muzzleUsed: boolean;
            rabiesValidUntil: Date | null;
            vaccinationOverrideReason: string | null;
            shaveDownRecommended: boolean;
            shaveDownApprovedAt: Date | null;
            heatDryProhibitedSnapshot: boolean;
            heatDryReasonsSnapshot: string[];
            parasiteTreatedAt: Date | null;
            parasiteOwnerNotifiedAt: Date | null;
            isolationAcknowledgedAt: Date | null;
            belongings: string[];
            performedAt: Date;
        } | null;
        assistantId: string | null;
        vetOrderStaffId: string | null;
        vetOrderNote: string | null;
        dropOffAt: Date | null;
        checkedInAt: Date | null;
        dryingStartedAt: Date | null;
        pickedUpAt: Date | null;
        quoteSubtotal: import("@prisma/client-runtime-utils").Decimal;
        quoteAdjustments: import("@prisma/client-runtime-utils").Decimal;
        bookedQuoteTotal: import("@prisma/client-runtime-utils").Decimal;
        ownerApprovedQuoteAt: Date | null;
        incidents: {
            id: string;
            createdAt: Date;
            description: string;
            resolvedAt: Date | null;
            kind: import("@/generated/prisma/enums").GroomingIncidentKind;
            severity: GroomingIncidentSeverity;
            followUpAppointmentId: string | null;
            actionTaken: string | null;
            ownerNotifiedAt: Date | null;
            vetAssessedByStaffId: string | null;
            vetAssessmentNote: string | null;
        }[];
        reportCard: {
            id: string;
            summary: string;
            sentAt: Date | null;
            moodScore: import("@/generated/prisma/enums").GroomingMoodScore;
            recommendedIntervalWeeks: number | null;
            nextRecommendedAt: Date | null;
            publicToken: string;
            channel: import("@/generated/prisma/enums").ReportCardChannel | null;
            rebookedSessionId: string | null;
        } | null;
    } | null>;
    addPhoto(args: {
        clinicId: string;
        id: string;
        kind: Prisma.GroomingPhotoUncheckedCreateInput["kind"];
        url: string;
        caption?: string | null;
        bodyZone?: string | null;
        userId?: string;
    }): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        kind: GroomingPhotoKind;
        caption: string | null;
        bodyZone: string | null;
    }>;
    addProduct(args: {
        clinicId: string;
        id: string;
        inventoryItemId?: string | null;
        nameSnapshot: string;
        priceSnapshot: number;
        quantity: number;
        billable?: boolean;
        dilution?: string | null;
        contactTimeMin?: number | null;
        bodyZones?: string[];
    }): Promise<{
        id: string;
        quantity: import("@prisma/client-runtime-utils").Decimal;
        priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
        inventoryItemId: string | null;
        nameSnapshot: string;
        issuedAt: Date | null;
        billable: boolean;
        dilution: string | null;
        contactTimeMin: number | null;
        bodyZones: string[];
    }>;
    addFinding(args: {
        clinicId: string;
        id: string;
        patientId: string;
        category: Prisma.GroomingFindingUncheckedCreateInput["category"];
        severity: Prisma.GroomingFindingUncheckedCreateInput["severity"];
        bodyZone?: string | null;
        note: string;
        photoId?: string | null;
        staffId?: string;
        userId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        labOrderId: string | null;
        category: import("@/generated/prisma/enums").GroomingFindingCategory;
        severity: import("@/generated/prisma/enums").GroomingFindingSeverity;
        note: string;
        bodyZone: string | null;
        photoId: string | null;
        acknowledgedAt: Date | null;
        referralAppointmentId: string | null;
        dismissedReason: string | null;
    }>;
    /** تصعيد ملاحظة إلى زيارة أو تحليل — المعرّف يُكتب على الملاحظة ليصير التحوّل قابلًا للقياس */
    linkFinding(args: {
        clinicId: string;
        findingId: string;
        referralAppointmentId?: string | null;
        labOrderId?: string | null;
        dismissedReason?: string | null;
        staffId?: string;
        userId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        labOrderId: string | null;
        category: import("@/generated/prisma/enums").GroomingFindingCategory;
        severity: import("@/generated/prisma/enums").GroomingFindingSeverity;
        note: string;
        bodyZone: string | null;
        photoId: string | null;
        acknowledgedAt: Date | null;
        referralAppointmentId: string | null;
        dismissedReason: string | null;
    }>;
    addIncident(args: {
        clinicId: string;
        id: string;
        kind: Prisma.GroomingIncidentUncheckedCreateInput["kind"];
        severity: Prisma.GroomingIncidentUncheckedCreateInput["severity"];
        description: string;
        actionTaken?: string | null;
        photoId?: string | null;
        staffId?: string;
        userId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        resolvedAt: Date | null;
        kind: import("@/generated/prisma/enums").GroomingIncidentKind;
        severity: GroomingIncidentSeverity;
        followUpAppointmentId: string | null;
        actionTaken: string | null;
        ownerNotifiedAt: Date | null;
        vetAssessedByStaffId: string | null;
        vetAssessmentNote: string | null;
    }>;
    /** إغلاق حادثة — البوابة G10 تقرأ تقييم المدرّب وإبلاغ وليّ الأمر معًا */
    resolveIncident(args: {
        clinicId: string;
        incidentId: string;
        vetAssessedByStaffId?: string | null;
        vetAssessmentNote?: string | null;
        ownerNotified?: boolean;
        followUpAppointmentId?: string | null;
        userId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        resolvedAt: Date | null;
        kind: import("@/generated/prisma/enums").GroomingIncidentKind;
        severity: GroomingIncidentSeverity;
        followUpAppointmentId: string | null;
        actionTaken: string | null;
        ownerNotifiedAt: Date | null;
        vetAssessedByStaffId: string | null;
        vetAssessmentNote: string | null;
    }>;
    upsertReportCard(args: {
        clinicId: string;
        id: string;
        summary: string;
        moodScore: Prisma.GroomingReportCardUncheckedCreateInput["moodScore"];
        recommendedIntervalWeeks?: number | null;
        channel?: Prisma.GroomingReportCardUncheckedCreateInput["channel"];
        userId?: string;
    }): Promise<{
        id: string;
        summary: string;
        sentAt: Date | null;
        moodScore: import("@/generated/prisma/enums").GroomingMoodScore;
        recommendedIntervalWeeks: number | null;
        nextRecommendedAt: Date | null;
        publicToken: string;
        channel: import("@/generated/prisma/enums").ReportCardChannel | null;
        rebookedSessionId: string | null;
    }>;
    /** قراءة عامّة بالرمز — لا تكشف غير هذه الجلسة */
    findReportCardByToken(token: string): Prisma.Prisma__GroomingReportCardClient<{
        session: {
            patient: {
                name: string;
            };
            code: string;
            items: {
                nameSnapshot: string;
                performed: boolean;
            }[];
            completedAt: Date | null;
            photos: {
                url: string;
                kind: GroomingPhotoKind;
                caption: string | null;
            }[];
            findings: {
                category: import("@/generated/prisma/enums").GroomingFindingCategory;
                severity: import("@/generated/prisma/enums").GroomingFindingSeverity;
                note: string;
            }[];
        };
        summary: string;
        moodScore: import("@/generated/prisma/enums").GroomingMoodScore;
        nextRecommendedAt: Date | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    getProfile(clinicId: string, patientId: string): Prisma.Prisma__PatientGroomingProfileClient<{
        id: string;
        notes: string | null;
        patientId: string;
        sizeBand: import("@/generated/prisma/enums").GroomingSizeBand | null;
        coatType: import("@/generated/prisma/enums").HairType | null;
        behaviorScore: import("@/generated/prisma/enums").GroomingBehaviorScore;
        preferredGroomerId: string | null;
        clipperPlan: import("@prisma/client/runtime/client").JsonValue;
        shampooItemId: string | null;
        sensitivities: string[];
        muzzleRequired: boolean;
        requiresTwoHandlers: boolean;
        handlingNotes: string | null;
        heatDryProhibited: boolean;
        heatDryProhibitedReason: string | null;
        groomIntervalWeeks: number | null;
        lastGroomedAt: Date | null;
        nextGroomDueAt: Date | null;
        customPrice: import("@prisma/client-runtime-utils").Decimal | null;
        customDurationMin: number | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    upsertProfile(clinicId: string, patientId: string, data: Record<string, unknown>): Promise<{
        id: string;
        notes: string | null;
        patientId: string;
        sizeBand: import("@/generated/prisma/enums").GroomingSizeBand | null;
        coatType: import("@/generated/prisma/enums").HairType | null;
        behaviorScore: import("@/generated/prisma/enums").GroomingBehaviorScore;
        preferredGroomerId: string | null;
        clipperPlan: import("@prisma/client/runtime/client").JsonValue;
        shampooItemId: string | null;
        sensitivities: string[];
        muzzleRequired: boolean;
        requiresTwoHandlers: boolean;
        handlingNotes: string | null;
        heatDryProhibited: boolean;
        heatDryProhibitedReason: string | null;
        groomIntervalWeeks: number | null;
        lastGroomedAt: Date | null;
        nextGroomDueAt: Date | null;
        customPrice: import("@prisma/client-runtime-utils").Decimal | null;
        customDurationMin: number | null;
    }>;
    /** «من تأخّر عن موعد تجميله؟» — مسح مفهرس واحد على العمود المخزَّن */
    listDue(clinicId: string, withinDays?: number): Promise<GroomingDueRow[]>;
    sessionBelongsToClinic(clinicId: string, id: string): Prisma.Prisma__GroomingSessionClient<{
        id: string;
        patientId: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
