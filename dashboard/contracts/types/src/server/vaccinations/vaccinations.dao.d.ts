import type { Prisma } from "@/generated/prisma/client";
import type { CatalogSpecies } from "@/generated/prisma/enums";
import { type PatientVaccinationStatus, type UnschedulablePatientRow, type VaccinationDueRow } from "@/server/vaccinations/vaccinations.type";
export type ProtocolDoseInput = {
    antigenCode: string;
    label: string;
    kind?: Prisma.VaccinationProtocolDoseCreateInput["kind"];
    ageWeeksMin?: number | null;
    ageWeeksMax?: number | null;
    intervalDaysFromPrev?: number | null;
    boosterIntervalDays?: number | null;
    notes?: string | null;
};
export type ProtocolInput = {
    name: string;
    nameEn?: string | null;
    species: string;
    animalTypeId?: string | null;
    animalStrainId?: string | null;
    isCore?: boolean;
    active?: boolean;
    notes?: string | null;
    doses: ProtocolDoseInput[];
};
export declare const vaccinationsDao: {
    listAntigens: () => Prisma.PrismaPromise<{
        code: string;
        nameAr: string;
        order: number;
        nameEn: string;
        immunityOnsetDays: number;
        noteAr: string | null;
    }[]>;
    listVaccines: (clinicId: string, filters?: {
        q?: string;
        species?: string;
        activeOnly?: boolean;
    }) => Prisma.PrismaPromise<{
        inventoryItem: {
            name: string;
            id: string;
            code: string;
            stock: number;
            tracksBatches: boolean;
        } | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        notes: string | null;
        active: boolean;
        editsCount: number;
        species: {
            species: CatalogSpecies;
        }[];
        kind: import("@/generated/prisma/enums").VaccineKind;
        catalogProduct: {
            id: string;
            registerNumber: string;
            tradeName: string;
            authorizationStatus: string | null;
            manufacturerName: string | null;
            manufacturerCountry: string | null;
        } | null;
        nameEn: string | null;
        boosterIntervalDays: number | null;
        manufacturerName: string | null;
        primarySeriesDoses: number;
        primarySeriesIntervalDays: number | null;
        immunityOnsetDays: number;
        defaultRoute: import("@/generated/prisma/enums").VaccineRoute;
        defaultSite: import("@/generated/prisma/enums").InjectionSite | null;
        defaultDoseVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
        antigens: {
            antigen: {
                nameAr: string;
                nameEn: string;
            };
            antigenCode: string;
        }[];
    }[]>;
    getVaccine: (clinicId: string, id: string) => Prisma.Prisma__VaccineClient<{
        inventoryItem: {
            name: string;
            id: string;
            code: string;
            stock: number;
            tracksBatches: boolean;
        } | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        notes: string | null;
        active: boolean;
        editsCount: number;
        species: {
            species: CatalogSpecies;
        }[];
        kind: import("@/generated/prisma/enums").VaccineKind;
        catalogProduct: {
            id: string;
            registerNumber: string;
            tradeName: string;
            authorizationStatus: string | null;
            manufacturerName: string | null;
            manufacturerCountry: string | null;
        } | null;
        nameEn: string | null;
        boosterIntervalDays: number | null;
        manufacturerName: string | null;
        primarySeriesDoses: number;
        primarySeriesIntervalDays: number | null;
        immunityOnsetDays: number;
        defaultRoute: import("@/generated/prisma/enums").VaccineRoute;
        defaultSite: import("@/generated/prisma/enums").InjectionSite | null;
        defaultDoseVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
        antigens: {
            antigen: {
                nameAr: string;
                nameEn: string;
            };
            antigenCode: string;
        }[];
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    createVaccine: (clinicId: string, input: {
        name: string;
        nameEn?: string | null;
        kind: Prisma.VaccineCreateInput["kind"];
        manufacturerName?: string | null;
        catalogProductId?: string | null;
        inventoryItemId?: string | null;
        antigenCodes: string[];
        species: string[];
        primarySeriesDoses: number;
        primarySeriesIntervalDays?: number | null;
        boosterIntervalDays?: number | null;
        immunityOnsetDays: number;
        defaultRoute: Prisma.VaccineCreateInput["defaultRoute"];
        defaultSite?: Prisma.VaccineCreateInput["defaultSite"];
        defaultDoseVolumeMl?: number | null;
        notes?: string | null;
        active?: boolean;
    }) => Promise<{
        inventoryItem: {
            name: string;
            id: string;
            code: string;
            stock: number;
            tracksBatches: boolean;
        } | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        notes: string | null;
        active: boolean;
        editsCount: number;
        species: {
            species: CatalogSpecies;
        }[];
        kind: import("@/generated/prisma/enums").VaccineKind;
        catalogProduct: {
            id: string;
            registerNumber: string;
            tradeName: string;
            authorizationStatus: string | null;
            manufacturerName: string | null;
            manufacturerCountry: string | null;
        } | null;
        nameEn: string | null;
        boosterIntervalDays: number | null;
        manufacturerName: string | null;
        primarySeriesDoses: number;
        primarySeriesIntervalDays: number | null;
        immunityOnsetDays: number;
        defaultRoute: import("@/generated/prisma/enums").VaccineRoute;
        defaultSite: import("@/generated/prisma/enums").InjectionSite | null;
        defaultDoseVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
        antigens: {
            antigen: {
                nameAr: string;
                nameEn: string;
            };
            antigenCode: string;
        }[];
    }>;
    updateVaccine: (clinicId: string, id: string, input: Partial<{
        name: string;
        nameEn: string | null;
        kind: Prisma.VaccineUpdateInput["kind"];
        manufacturerName: string | null;
        catalogProductId: string | null;
        inventoryItemId: string | null;
        antigenCodes: string[];
        species: string[];
        primarySeriesDoses: number;
        primarySeriesIntervalDays: number | null;
        boosterIntervalDays: number | null;
        immunityOnsetDays: number;
        defaultRoute: Prisma.VaccineUpdateInput["defaultRoute"];
        defaultSite: Prisma.VaccineUpdateInput["defaultSite"];
        defaultDoseVolumeMl: number | null;
        notes: string | null;
        active: boolean;
    }>) => Promise<{
        inventoryItem: {
            name: string;
            id: string;
            code: string;
            stock: number;
            tracksBatches: boolean;
        } | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        notes: string | null;
        active: boolean;
        editsCount: number;
        species: {
            species: CatalogSpecies;
        }[];
        kind: import("@/generated/prisma/enums").VaccineKind;
        catalogProduct: {
            id: string;
            registerNumber: string;
            tradeName: string;
            authorizationStatus: string | null;
            manufacturerName: string | null;
            manufacturerCountry: string | null;
        } | null;
        nameEn: string | null;
        boosterIntervalDays: number | null;
        manufacturerName: string | null;
        primarySeriesDoses: number;
        primarySeriesIntervalDays: number | null;
        immunityOnsetDays: number;
        defaultRoute: import("@/generated/prisma/enums").VaccineRoute;
        defaultSite: import("@/generated/prisma/enums").InjectionSite | null;
        defaultDoseVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
        antigens: {
            antigen: {
                nameAr: string;
                nameEn: string;
            };
            antigenCode: string;
        }[];
    }>;
    deleteVaccine: (clinicId: string, id: string) => Promise<{
        id: string;
    }>;
    /**
     * دُفعات لقاح متاحة للصرف، مرتّبة FEFO (الأقرب انتهاءً أولًا).
     *
     * الترتيب اقتراح للعرض لا اختيار آلي: المستخدم يختار الدفعة التي في يده، وهذا
     * هو الفرق بين تتبّع حقيقي وتتبّع مفترض. الدُفعات المنتهية تُعاد أيضًا موسومة
     * لتظهر في القائمة معطَّلة بدل أن تختفي فيبدو المخزون خاليًا.
     */
    listVaccineBatches: (clinicId: string, vaccineId: string, branchId?: string | null) => Promise<{
        isExpired: boolean;
        warehouse: {
            name: string;
            id: string;
            branchId: string | null;
        };
        id: string;
        qty: number;
        expiryDate: Date | null;
        batchNo: string;
    }[]>;
    /** بروتوكولات الأكاديمية والبروتوكولات العالمية معًا — الأكاديمية ترى ما ينطبق عليها. */
    listProtocols: (clinicId: string, filters?: {
        species?: string;
    }) => Prisma.PrismaPromise<{
        animalType: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        animalStrain: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        name: string;
        id: string;
        clinicId: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isDefault: boolean;
        notes: string | null;
        active: boolean;
        species: CatalogSpecies;
        animalTypeId: string | null;
        animalStrainId: string | null;
        nameEn: string | null;
        doses: {
            antigen: {
                nameAr: string;
                nameEn: string;
            };
            id: string;
            order: number;
            notes: string | null;
            kind: import("@/generated/prisma/enums").VaccinationDoseKind;
            label: string;
            antigenCode: string;
            ageWeeksMin: number | null;
            ageWeeksMax: number | null;
            intervalDaysFromPrev: number | null;
            boosterIntervalDays: number | null;
        }[];
        isCore: boolean;
    }[]>;
    getProtocol: (clinicId: string, id: string) => Prisma.Prisma__VaccinationProtocolClient<{
        animalType: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        animalStrain: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        name: string;
        id: string;
        clinicId: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isDefault: boolean;
        notes: string | null;
        active: boolean;
        species: CatalogSpecies;
        animalTypeId: string | null;
        animalStrainId: string | null;
        nameEn: string | null;
        doses: {
            antigen: {
                nameAr: string;
                nameEn: string;
            };
            id: string;
            order: number;
            notes: string | null;
            kind: import("@/generated/prisma/enums").VaccinationDoseKind;
            label: string;
            antigenCode: string;
            ageWeeksMin: number | null;
            ageWeeksMax: number | null;
            intervalDaysFromPrev: number | null;
            boosterIntervalDays: number | null;
        }[];
        isCore: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    createProtocol: (clinicId: string, input: ProtocolInput) => Promise<{
        animalType: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        animalStrain: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        name: string;
        id: string;
        clinicId: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isDefault: boolean;
        notes: string | null;
        active: boolean;
        species: CatalogSpecies;
        animalTypeId: string | null;
        animalStrainId: string | null;
        nameEn: string | null;
        doses: {
            antigen: {
                nameAr: string;
                nameEn: string;
            };
            id: string;
            order: number;
            notes: string | null;
            kind: import("@/generated/prisma/enums").VaccinationDoseKind;
            label: string;
            antigenCode: string;
            ageWeeksMin: number | null;
            ageWeeksMax: number | null;
            intervalDaysFromPrev: number | null;
            boosterIntervalDays: number | null;
        }[];
        isCore: boolean;
    }>;
    updateProtocol: (clinicId: string, id: string, input: ProtocolInput) => Promise<{
        animalType: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        animalStrain: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        name: string;
        id: string;
        clinicId: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isDefault: boolean;
        notes: string | null;
        active: boolean;
        species: CatalogSpecies;
        animalTypeId: string | null;
        animalStrainId: string | null;
        nameEn: string | null;
        doses: {
            antigen: {
                nameAr: string;
                nameEn: string;
            };
            id: string;
            order: number;
            notes: string | null;
            kind: import("@/generated/prisma/enums").VaccinationDoseKind;
            label: string;
            antigenCode: string;
            ageWeeksMin: number | null;
            ageWeeksMax: number | null;
            intervalDaysFromPrev: number | null;
            boosterIntervalDays: number | null;
        }[];
        isCore: boolean;
    }>;
    /** نسخ بروتوكول عالمي إلى الأكاديمية ليصبح قابلًا للتعديل محليًا. */
    cloneProtocol: (clinicId: string, sourceId: string) => Promise<{
        animalType: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        animalStrain: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        name: string;
        id: string;
        clinicId: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isDefault: boolean;
        notes: string | null;
        active: boolean;
        species: CatalogSpecies;
        animalTypeId: string | null;
        animalStrainId: string | null;
        nameEn: string | null;
        doses: {
            antigen: {
                nameAr: string;
                nameEn: string;
            };
            id: string;
            order: number;
            notes: string | null;
            kind: import("@/generated/prisma/enums").VaccinationDoseKind;
            label: string;
            antigenCode: string;
            ageWeeksMin: number | null;
            ageWeeksMax: number | null;
            intervalDaysFromPrev: number | null;
            boosterIntervalDays: number | null;
        }[];
        isCore: boolean;
    }>;
    deleteProtocol: (clinicId: string, id: string) => Promise<{
        id: string;
    }>;
    /**
     * البروتوكول المُطبَّق على طفل بعينه.
     *
     * ترتيب الحسم: السلالة ← النوع ← فصيلة الكتالوج، وبروتوكول الأكاديمية يسبق
     * البروتوكول العالمي في كل مرتبة. الأساسي (core) يسبق غير الأساسي: غير الأساسي
     * قرار طبي مرتبط بنمط حياة الطفل ولا يُفرض تلقائيًا على كل طفل.
     */
    resolveProtocolForPatient: (clinicId: string, patient: {
        animalTypeId: string;
        animalStrainId: string | null;
        species: CatalogSpecies | null;
    }) => Promise<{
        animalType: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        animalStrain: {
            id: string;
            arName: string;
            enName: string;
        } | null;
        name: string;
        id: string;
        clinicId: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        isDefault: boolean;
        notes: string | null;
        active: boolean;
        species: CatalogSpecies;
        animalTypeId: string | null;
        animalStrainId: string | null;
        nameEn: string | null;
        doses: {
            antigen: {
                nameAr: string;
                nameEn: string;
            };
            id: string;
            order: number;
            notes: string | null;
            kind: import("@/generated/prisma/enums").VaccinationDoseKind;
            label: string;
            antigenCode: string;
            ageWeeksMin: number | null;
            ageWeeksMax: number | null;
            intervalDaysFromPrev: number | null;
            boosterIntervalDays: number | null;
        }[];
        isCore: boolean;
    } | null>;
    listRecords: (clinicId: string, filters?: {
        patientId?: string;
        vaccineId?: string;
        branchId?: string;
        from?: Date;
        to?: Date;
        includeVoided?: boolean;
        skip?: number;
        take?: number;
    }) => Prisma.PrismaPromise<{
        branch: {
            name: string;
            id: string;
        } | null;
        patient: {
            animalType: {
                id: string;
                arName: string;
                species: CatalogSpecies | null;
            };
            owner: {
                name: string;
                id: string;
                phone: string;
            } | null;
            name: string;
            id: string;
            code: string;
            birthDate: Date | null;
        };
        appointment: {
            id: string;
            startsAt: Date;
        } | null;
        vaccine: {
            name: string;
            id: string;
            kind: import("@/generated/prisma/enums").VaccineKind;
            antigens: {
                antigenCode: string;
            }[];
        };
        id: string;
        createdAt: Date;
        code: string;
        notes: string | null;
        route: import("@/generated/prisma/enums").VaccineRoute;
        patientId: string;
        nextDueAt: Date | null;
        batchId: string | null;
        site: import("@/generated/prisma/enums").InjectionSite | null;
        batchNo: string | null;
        protectiveFromAt: Date | null;
        protectiveUntilAt: Date | null;
        immunityOnsetDaysSnapshot: number | null;
        administeredAt: Date;
        vaccineNameSnapshot: string;
        doseNumber: number;
        doseKind: import("@/generated/prisma/enums").VaccinationDoseKind;
        doseVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
        batchExpiryDate: Date | null;
        manufacturerSnapshot: string | null;
        adverseReaction: import("@/generated/prisma/enums").AdverseReactionSeverity;
        adverseReactionNotes: string | null;
        boosterIntervalDaysSnapshot: number | null;
        isVoided: boolean;
        voidedAt: Date | null;
        voidReason: string | null;
        administeredBy: {
            name: string;
            prefix: import("@/generated/prisma/enums").StaffPrefix | null;
            id: string;
            licenseNumber: string | null;
        } | null;
        protocolDose: {
            id: string;
            label: string;
            antigenCode: string;
        } | null;
    }[]>;
    countRecords: (clinicId: string, filters?: {
        includeVoided?: boolean;
    }) => Prisma.PrismaPromise<number>;
    getRecord: (clinicId: string, id: string) => Prisma.Prisma__VaccinationRecordClient<{
        branch: {
            name: string;
            id: string;
        } | null;
        patient: {
            animalType: {
                id: string;
                arName: string;
                species: CatalogSpecies | null;
            };
            owner: {
                name: string;
                id: string;
                phone: string;
            } | null;
            name: string;
            id: string;
            code: string;
            birthDate: Date | null;
        };
        appointment: {
            id: string;
            startsAt: Date;
        } | null;
        vaccine: {
            name: string;
            id: string;
            kind: import("@/generated/prisma/enums").VaccineKind;
            antigens: {
                antigenCode: string;
            }[];
        };
        id: string;
        createdAt: Date;
        code: string;
        notes: string | null;
        route: import("@/generated/prisma/enums").VaccineRoute;
        patientId: string;
        nextDueAt: Date | null;
        batchId: string | null;
        site: import("@/generated/prisma/enums").InjectionSite | null;
        batchNo: string | null;
        protectiveFromAt: Date | null;
        protectiveUntilAt: Date | null;
        immunityOnsetDaysSnapshot: number | null;
        administeredAt: Date;
        vaccineNameSnapshot: string;
        doseNumber: number;
        doseKind: import("@/generated/prisma/enums").VaccinationDoseKind;
        doseVolumeMl: import("@prisma/client-runtime-utils").Decimal | null;
        batchExpiryDate: Date | null;
        manufacturerSnapshot: string | null;
        adverseReaction: import("@/generated/prisma/enums").AdverseReactionSeverity;
        adverseReactionNotes: string | null;
        boosterIntervalDaysSnapshot: number | null;
        isVoided: boolean;
        voidedAt: Date | null;
        voidReason: string | null;
        administeredBy: {
            name: string;
            prefix: import("@/generated/prisma/enums").StaffPrefix | null;
            id: string;
            licenseNumber: string | null;
        } | null;
        protocolDose: {
            id: string;
            label: string;
            antigenCode: string;
        } | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    getPatientStatus: (clinicId: string, patientId: string) => Promise<PatientVaccinationStatus | null>;
    /**
     * الأطفال التي تستحق جرعة الآن أو قريبًا أو تأخّرت عنها.
     *
     * الاستعلام على مرحلتين عمدًا. الحساب الكامل لكل طفل في الأكاديمية غير مقبول،
     * لكن الكاش `nextDueAt` وحده لا يكفي: الطفل الذي لم يُطعَّم قط لا يملك سجلًّا
     * ولا صفًّا مفهرسًا، وهو بالضبط الحالة الأخطر. فالمرحلة الأولى تجمع مرشَّحين
     * رخيصين من الطرفين (سجل مستحق ضمن الأفق، أو لا سجل إطلاقًا) والثانية تحسب
     * الإسقاط الكامل لهذه المجموعة المحدودة وحدها.
     */
    listDue: (clinicId: string, filters?: {
        branchId?: string;
        species?: string;
        horizonDays?: number;
    }) => Promise<VaccinationDueRow[]>;
    /**
     * أطفال ينطبق عليها بروتوكول لكنها بلا تاريخ ميلاد، فتسقط من الطابور بصمت.
     *
     * تُقرأ منفصلة عمدًا: محرّك الاستحقاق يرفض تلفيق تاريخ لطفل مجهول العمر، لكن
     * الصمت عن العدد يجعل النقص غير مرئي — فتظنّ الأكاديمية الطابور فارغًا وهو ناقص.
     */
    listUnschedulable: (clinicId: string) => Promise<UnschedulablePatientRow[]>;
    stats: (clinicId: string) => Promise<{
        overdue: number;
        dueSoon: number;
        givenThisMonth: number;
        activeVaccines: number;
        adverseReactionsThisMonth: number;
    }>;
};
