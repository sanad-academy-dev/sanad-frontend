import type { Prisma } from "@/generated/prisma/client";
import { ConsentStatus } from "@/generated/prisma/enums";
import type { ConsentPriceMap } from "@/server/patient-consents/consent-render.service";
import type { ConsentTemplateDef } from "@/server/patient-consents/consent-template.type";
import { type ConsentFieldValues, type CreatePatientConsentInput } from "@/server/patient-consents/patient-consents.type";
export declare const patientConsentsDao: {
    /**
     * يزرع قوالب النظام للأكاديمية. الترقية بمفتاح كل قالب على حدة، لا بفحص «هل
     * توجد قوالب؟» — الفحص الإجمالي يقصر الدائرة على قواعد البيانات المأهولة
     * فلا تصل القوالب الجديدة ولا الإصدارات المحدَّثة إلى الأكاديميات القائمة.
     */
    ensureSystemTemplates(clinicId: string): Promise<{
        key: string;
        id: string;
    }[]>;
    /**
     * نفس الترقية، لكن مرّة واحدة لكل أكاديمية في عمر العملية.
     *
     * الترقية كانت معلَّقة على مسار `/templates` وحده، وهو استعلام تُبقيه الواجهة
     * في ذاكرتها عشر دقائق — فأكاديميةٌ فتحت موافقةً قائمة دون المرور بمنتقي القوالب
     * كانت تقرأ كتلًا قديمة: حقل عُرِّف في الشيفرة كقائمة اختيار يظهر حقلًا حرًّا.
     * لذلك تُستدعى هذه من مسارات القراءة أيضًا؛ والبصمة تجعلها استدعاءً فارغًا
     * بعد أول مرّة، وتُعاد تلقائيًّا عند أي تغيير في تعريف القوالب.
     */
    ensureSystemTemplatesOnce(clinicId: string): Promise<void>;
    /**
     * أسعار البنود المسعّرة داخل النماذج — من قائمة أسعار الأكاديمية لا من نصّ القالب.
     * دورة الأكاديمية تسبق العامّة عند تكرار الرمز، وما لا سعر له يُترك للسعر
     * الاحتياطي المكتوب في النموذج الورقي بدل أن يُطبع بلا سعر.
     */
    consentPrices(clinicId: string): Promise<ConsentPriceMap>;
    listTemplates(clinicId: string, args?: {
        activeOnly?: boolean;
        speciesKey?: string;
    }): Prisma.PrismaPromise<{
        type: import("@/generated/prisma/enums").ConsentType;
        version: number;
        key: string;
        id: string;
        isDefault: boolean;
        active: boolean;
        titleAr: string;
        titleEn: string;
        defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
        speciesKey: string | null;
    }[]>;
    templateByKey(clinicId: string, key: string): Prisma.Prisma__ConsentTemplateClient<{
        type: import("@/generated/prisma/enums").ConsentType;
        version: number;
        key: string;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        isDefault: boolean;
        active: boolean;
        blocks: import("@prisma/client/runtime/client").JsonValue;
        titleAr: string;
        titleEn: string;
        defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
        speciesKey: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    listByPatient(clinicId: string, patientId: string): Prisma.PrismaPromise<{
        type: import("@/generated/prisma/enums").ConsentType;
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        status: ConsentStatus;
        appointmentId: string | null;
        locale: import("@/generated/prisma/enums").ConsentLocale;
        operationCaseId: string | null;
        templateKey: string;
        templateVersion: number;
        revokedAt: Date | null;
        signerName: string | null;
        signedAt: Date | null;
        revokeReason: string | null;
        extractedByAi: boolean;
    }[]>;
    listByOperationCase(clinicId: string, operationCaseId: string): Prisma.PrismaPromise<{
        type: import("@/generated/prisma/enums").ConsentType;
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        status: ConsentStatus;
        appointmentId: string | null;
        locale: import("@/generated/prisma/enums").ConsentLocale;
        operationCaseId: string | null;
        templateKey: string;
        templateVersion: number;
        revokedAt: Date | null;
        signerName: string | null;
        signedAt: Date | null;
        revokeReason: string | null;
        extractedByAi: boolean;
    }[]>;
    get(clinicId: string, id: string): Prisma.Prisma__PatientConsentClient<{
        type: import("@/generated/prisma/enums").ConsentType;
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: ConsentStatus;
        appointmentId: string | null;
        locale: import("@/generated/prisma/enums").ConsentLocale;
        template: {
            version: number;
            key: string;
            id: string;
            blocks: import("@prisma/client/runtime/client").JsonValue;
            titleAr: string;
            titleEn: string;
            defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
            speciesKey: string | null;
        } | null;
        operationCaseId: string | null;
        signatureUrl: string | null;
        templateKey: string;
        templateVersion: number;
        revokedAt: Date | null;
        fieldValues: import("@prisma/client/runtime/client").JsonValue;
        textSnapshot: string;
        signerName: string | null;
        signerRelationship: string | null;
        signatureMethod: import("@/generated/prisma/enums").SignatureMethod | null;
        signedAt: Date | null;
        revokeReason: string | null;
        sourceScanUrl: string | null;
        extractedByAi: boolean;
        witnessStaff: {
            name: string;
            id: string;
        } | null;
        signedByStaff: {
            name: string;
            id: string;
        } | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /** الطفل ووليّ أمره — مصدر التعبئة الآلية، ويثبت انتماءه للأكاديمية في آن */
    patientForAutofill(clinicId: string, patientId: string): Prisma.Prisma__PatientClient<({
        clinic: {
            name: string;
        };
        animalType: {
            arName: string;
            enName: string;
            species: import("@/generated/prisma/enums").CatalogSpecies | null;
        };
        animalStrain: {
            arName: string;
            enName: string;
        } | null;
        owner: {
            name: string;
            address: string | null;
            id: string;
            email: string | null;
            phone: string;
            city: string | null;
        } | null;
    } & {
        name: string;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        gender: import("@/generated/prisma/enums").Gender;
        age: number | null;
        notes: string | null;
        active: boolean;
        isDeleted: boolean;
        deletedAt: Date | null;
        editsCount: number;
        animalTypeId: string;
        ownerId: string | null;
        nameNormalized: string;
        animalStrainId: string | null;
        birthDate: Date | null;
        weight: number | null;
        microchipNumber: string | null;
        coat: string | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    create(input: CreatePatientConsentInput): Prisma.Prisma__PatientConsentClient<{
        type: import("@/generated/prisma/enums").ConsentType;
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: ConsentStatus;
        appointmentId: string | null;
        locale: import("@/generated/prisma/enums").ConsentLocale;
        template: {
            version: number;
            key: string;
            id: string;
            blocks: import("@prisma/client/runtime/client").JsonValue;
            titleAr: string;
            titleEn: string;
            defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
            speciesKey: string | null;
        } | null;
        operationCaseId: string | null;
        signatureUrl: string | null;
        templateKey: string;
        templateVersion: number;
        revokedAt: Date | null;
        fieldValues: import("@prisma/client/runtime/client").JsonValue;
        textSnapshot: string;
        signerName: string | null;
        signerRelationship: string | null;
        signatureMethod: import("@/generated/prisma/enums").SignatureMethod | null;
        signedAt: Date | null;
        revokeReason: string | null;
        sourceScanUrl: string | null;
        extractedByAi: boolean;
        witnessStaff: {
            name: string;
            id: string;
        } | null;
        signedByStaff: {
            name: string;
            id: string;
        } | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    updateDraft(id: string, data: {
        fieldValues: ConsentFieldValues;
        textSnapshot: string;
        locale?: Prisma.PatientConsentUpdateInput["locale"];
    }): Prisma.Prisma__PatientConsentClient<{
        type: import("@/generated/prisma/enums").ConsentType;
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: ConsentStatus;
        appointmentId: string | null;
        locale: import("@/generated/prisma/enums").ConsentLocale;
        template: {
            version: number;
            key: string;
            id: string;
            blocks: import("@prisma/client/runtime/client").JsonValue;
            titleAr: string;
            titleEn: string;
            defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
            speciesKey: string | null;
        } | null;
        operationCaseId: string | null;
        signatureUrl: string | null;
        templateKey: string;
        templateVersion: number;
        revokedAt: Date | null;
        fieldValues: import("@prisma/client/runtime/client").JsonValue;
        textSnapshot: string;
        signerName: string | null;
        signerRelationship: string | null;
        signatureMethod: import("@/generated/prisma/enums").SignatureMethod | null;
        signedAt: Date | null;
        revokeReason: string | null;
        sourceScanUrl: string | null;
        extractedByAi: boolean;
        witnessStaff: {
            name: string;
            id: string;
        } | null;
        signedByStaff: {
            name: string;
            id: string;
        } | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    sign(id: string, data: {
        signerName: string;
        signerRelationship?: string | null;
        signatureMethod: Prisma.PatientConsentUpdateInput["signatureMethod"];
        signatureUrl?: string | null;
        witnessStaffId?: string | null;
        signedByStaffId?: string | null;
        textSnapshot: string;
    }): Prisma.Prisma__PatientConsentClient<{
        type: import("@/generated/prisma/enums").ConsentType;
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: ConsentStatus;
        appointmentId: string | null;
        locale: import("@/generated/prisma/enums").ConsentLocale;
        template: {
            version: number;
            key: string;
            id: string;
            blocks: import("@prisma/client/runtime/client").JsonValue;
            titleAr: string;
            titleEn: string;
            defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
            speciesKey: string | null;
        } | null;
        operationCaseId: string | null;
        signatureUrl: string | null;
        templateKey: string;
        templateVersion: number;
        revokedAt: Date | null;
        fieldValues: import("@prisma/client/runtime/client").JsonValue;
        textSnapshot: string;
        signerName: string | null;
        signerRelationship: string | null;
        signatureMethod: import("@/generated/prisma/enums").SignatureMethod | null;
        signedAt: Date | null;
        revokeReason: string | null;
        sourceScanUrl: string | null;
        extractedByAi: boolean;
        witnessStaff: {
            name: string;
            id: string;
        } | null;
        signedByStaff: {
            name: string;
            id: string;
        } | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    revoke(id: string, reason: string): Prisma.Prisma__PatientConsentClient<{
        type: import("@/generated/prisma/enums").ConsentType;
        owner: {
            name: string;
            id: string;
            phone: string;
        };
        patient: {
            name: string;
            id: string;
            code: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: ConsentStatus;
        appointmentId: string | null;
        locale: import("@/generated/prisma/enums").ConsentLocale;
        template: {
            version: number;
            key: string;
            id: string;
            blocks: import("@prisma/client/runtime/client").JsonValue;
            titleAr: string;
            titleEn: string;
            defaultLocale: import("@/generated/prisma/enums").ConsentLocale;
            speciesKey: string | null;
        } | null;
        operationCaseId: string | null;
        signatureUrl: string | null;
        templateKey: string;
        templateVersion: number;
        revokedAt: Date | null;
        fieldValues: import("@prisma/client/runtime/client").JsonValue;
        textSnapshot: string;
        signerName: string | null;
        signerRelationship: string | null;
        signatureMethod: import("@/generated/prisma/enums").SignatureMethod | null;
        signedAt: Date | null;
        revokeReason: string | null;
        sourceScanUrl: string | null;
        extractedByAi: boolean;
        witnessStaff: {
            name: string;
            id: string;
        } | null;
        signedByStaff: {
            name: string;
            id: string;
        } | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /** الحذف للمسودّات وحدها — الموقَّعة تُبطل ولا تُمحى */
    delete(id: string): Prisma.Prisma__PatientConsentClient<{
        id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
/** يعيد بناء تعريف القالب من صفّه في قاعدة البيانات */
export declare const templateDefFromRow: (row: {
    key: string;
    type: ConsentTemplateDef["type"];
    titleAr: string;
    titleEn: string;
    defaultLocale: ConsentTemplateDef["defaultLocale"];
    speciesKey: string | null;
    blocks: Prisma.JsonValue;
}) => ConsentTemplateDef;
