import { Prisma } from "@/generated/prisma/client";
import type { CatalogSpecies, DrugRoute, InpatientAdministrationStatus, InpatientOrderKind, InpatientOrderStatus, MucousMembrane } from "@/generated/prisma/enums";
import { type InpatientAlert, type ReferenceRangeInput } from "@/server/inpatients/inpatient-alerts.service";
/**
 * [IP2/IP3] الأوامر وورقة العلاج وورقة المتابعة.
 *
 * مفصولة عن `inpatients.dao.ts` لأنها الجزء الذي يُكتب فيه ما يدخل جسم الطفل،
 * وهو ما يستحقّ ملفًّا يُقرأ وحده. الحسابات كلّها في الملفّات النقيّة: الجرعة من
 * `dose.rules` (المشترك مع الصيدلية)، والإنذارات من `inpatient-alerts.service`،
 * والجدولة من `inpatient-due.service`.
 */
type Tx = Prisma.TransactionClient;
export type OrderDoseAssessment = {
    /** ما يُكتب في `doseSource` — أو null لأمر بلا جرعة (مراقبة، تغذية) */
    doseSource: "CALCULATED" | "MANUAL" | "OVERRIDE" | null;
    /** الجرعة المحسوبة من النشرة، للعرض بجانب ما كتبه المدرّب */
    calculated: {
        amount: string;
        unit: string | null;
    } | null;
    /** سبب امتناع المحرّك عن رقم — يُعرض كما هو ولا يُترجم إلى «لا قيود» */
    refusal: string | null;
    warnings: string[];
    /** رفض قاطع — مانع استعمال موثَّق. لا يُتجاوز بسبب مسجَّل */
    blocked: string | null;
};
/**
 * تقييم جرعة أمرٍ قبل حفظه — يُعيد استعمال محرّك الصيدلية بالكامل.
 *
 * الوزن يُقرأ من `VitalSignsRecord` وحده (وزن دخول الإقامة أو آخر قياس فيها)،
 * لا من `Patient.weight`: ذاك رقمٌ يكتبه الاستقبال ولا يُعرف متى قِيس، والجرعة
 * تُضرب فيه. هذه هي قاعدة `Prescription.weightKgSnapshot` حرفيًّا.
 */
export declare function assessOrderDose(input: {
    clinicId: string;
    stayId: string;
    patientId: string;
    inventoryItemId?: string | null;
    catalogProductId?: string | null;
    doseAmount?: number | null;
    route?: DrugRoute | null;
    kind: InpatientOrderKind;
    client?: Tx;
}): Promise<OrderDoseAssessment>;
export declare const inpatientOrdersDao: {
    /** معاينة الجرعة قبل الحفظ — تُستدعى من الواجهة أثناء الكتابة */
    previewDose(input: {
        clinicId: string;
        stayId: string;
        inventoryItemId?: string | null;
        catalogProductId?: string | null;
        doseAmount?: number | null;
        route?: DrugRoute | null;
        kind: InpatientOrderKind;
    }): Promise<OrderDoseAssessment>;
    createOrder(input: {
        clinicId: string;
        stayId: string;
        userId: string;
        kind: InpatientOrderKind;
        nameSnapshot: string;
        inventoryItemId?: string | null;
        catalogProductId?: string | null;
        doseAmount?: number | null;
        doseUnit?: string | null;
        route?: DrugRoute | null;
        rateMlPerHour?: number | null;
        overrideReasonAr?: string | null;
        scheduleIntervalHours?: number | null;
        scheduleTimes?: string[];
        prn?: boolean;
        startAt: Date;
        endAt?: Date | null;
        instructionsAr?: string | null;
    }): Promise<{
        id: string;
        createdAt: Date;
        idx: number;
        status: InpatientOrderStatus;
        route: DrugRoute | null;
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
    }>;
    /**
     * إيقاف أمر. الصفوف المعلَّقة المستقبلية تُوقف معه ولا تُحذف: بقاؤها بحالة
     * «موقوف» يُبقي في السجل أنّ الجرعة كانت مجدولة ثم أوقفها المدرّب — وهو ما
     * يُسأل عنه لاحقًا، بخلاف صفوف تختفي بلا أثر.
     */
    discontinueOrder(input: {
        clinicId: string;
        stayId: string;
        orderId: string;
        userId: string;
        reasonAr: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        idx: number;
        status: InpatientOrderStatus;
        route: DrugRoute | null;
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
    }>;
    /**
     * تعليم جرعة «أُعطيت» — أكثر عملية تُنفَّذ في الوحدة، وأخطرها.
     *
     * كل شيء داخل معاملة واحدة: تغيير الحالة، وخصم المخزون، وقيد المادّة
     * المراقَبة، وسجل النشاط. صفٌّ يُعلَّم «أُعطي» ومخزونٌ لم يُخصم خللٌ لا يظهر
     * إلا في الجرد بعد شهر.
     */
    giveAdministration(input: {
        clinicId: string;
        stayId: string;
        administrationId: string;
        userId: string;
        doseGivenAmount?: number | null;
        doseGivenUnit?: string | null;
        stockQuantity?: number | null;
        batchId?: string | null;
        witnessId?: string | null;
        notesAr?: string | null;
        eatenFraction?: number | null;
        urination?: boolean | null;
        defecation?: boolean | null;
        vomiting?: boolean | null;
    }): Promise<{
        id: string;
        createdAt: Date;
        order: {
            id: string;
            status: InpatientOrderStatus;
            route: DrugRoute | null;
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
        status: InpatientAdministrationStatus;
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
    }>;
    /** تخطّي جرعة أو إيقافها — كلاهما بسبب مسجَّل إلزامًا */
    skipAdministration(input: {
        clinicId: string;
        stayId: string;
        administrationId: string;
        userId: string;
        skipReasonAr: string;
        hold?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        order: {
            id: string;
            status: InpatientOrderStatus;
            route: DrugRoute | null;
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
        status: InpatientAdministrationStatus;
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
    }>;
    /**
     * جرعة «عند اللزوم» — تُنشأ لحظة إعطائها.
     *
     * أمر PRN بلا صفوف مجدولة أصلًا (المحرّك يُعيد قائمة فارغة له عمدًا)، فالصفّ
     * هنا يُولد بحالته النهائية: `dueAt` هو لحظة الإعطاء نفسها، لأن الاستحقاق
     * كان حكم الممرّض لا الجدول.
     */
    recordPrnAdministration(input: {
        clinicId: string;
        stayId: string;
        orderId: string;
        userId: string;
        doseGivenAmount?: number | null;
        doseGivenUnit?: string | null;
        stockQuantity?: number | null;
        batchId?: string | null;
        witnessId?: string | null;
        notesAr?: string | null;
    }): Promise<{
        id: string;
        createdAt: Date;
        order: {
            id: string;
            status: InpatientOrderStatus;
            route: DrugRoute | null;
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
        status: InpatientAdministrationStatus;
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
    }>;
    /**
     * تسجيل قياس على الإقامة، وتقييمه فورًا.
     *
     * القياس يُنشئ `VitalSignsRecord` بمصدر INPATIENT وربط بالإقامة — لا جدول
     * قياسات موازيًا: قرار وحدة العلامات الحيوية أنّ السجل مملوك للطفل والمستندات
     * تشير إليه، وإنشاء جدول ثانٍ هنا يُنتج تاريخَين للطفل الواحد.
     */
    recordVitals(input: {
        clinicId: string;
        stayId: string;
        userId: string;
        administrationId?: string | null;
        recordedAt?: Date | null;
        weight?: number | null;
        temperature?: number | null;
        heartRate?: number | null;
        respiratoryRate?: number | null;
        oxygenSaturation?: number | null;
        bloodPressure?: string | null;
        painScore?: number | null;
        bodyConditionScore?: number | null;
        capillaryRefillSec?: number | null;
        mucousMembrane?: MucousMembrane | null;
        notes?: string | null;
    }): Promise<{
        record: {
            id: string;
            code: string;
            weight: import("@prisma/client-runtime-utils").Decimal | null;
            recordedAt: Date;
        };
        alerts: InpatientAlert[];
    }>;
    /**
     * يقيّم قراءةً مقابل المدى المرجعي وتاريخ الإقامة.
     *
     * المدى يُنتقى بالنوع والعمر عبر الدالّة النقيّة؛ وغيابه يُنتج `NO_RANGE`
     * (ملاحظة إعداد) لا `NORMAL` — وهو الفرق الذي يمنع الشاشة من الطمأنة الكاذبة.
     */
    evaluateStayVitals(clinicId: string, stayId: string, reading: {
        weight?: number | null;
        temperature?: number | null;
        heartRate?: number | null;
        respiratoryRate?: number | null;
        oxygenSaturation?: number | null;
        painScore?: number | null;
        capillaryRefillSec?: number | null;
    }): Promise<InpatientAlert[]>;
    /**
     * المديات من الشيفرة لا من جدول — انظر `vital-reference-ranges.data.ts`
     * للسببين (نمط المستودع للمرجع المُنسَّق، وسقف عمق أنواع TypeScript).
     */
    referenceRangesFor(_clinicId: string, species: CatalogSpecies): ReferenceRangeInput[];
    /** للعرض في الشاشة — تُظهر المرجع وعلامة «غير مُقرّ» */
    listReferenceRanges(species?: CatalogSpecies): readonly import("@/server/inpatients/vital-reference-ranges.data").VitalReferenceRow[];
    /** توليد صفوف اليوم عند فتح الورقة — يُستدعى من المتحكّم قبل القراءة */
    ensureHorizon(stayId: string): Promise<void>;
};
export {};
