export declare const crmMastersDao: {
    readonly leadStatuses: {
        readonly list: (clinicId: string, includeInactive?: boolean) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
            name: string;
            id: string;
            order: number;
            active: boolean;
            kind: import("../../../../generated/prisma/enums").CrmLeadStatusKind;
            color: string;
        }[]>;
        readonly byId: (clinicId: string, id: string) => import("../../../../generated/prisma/models").Prisma__CrmLeadStatusClient<{
            name: string;
            id: string;
            order: number;
            active: boolean;
            kind: import("../../../../generated/prisma/enums").CrmLeadStatusKind;
            color: string;
        } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
            omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
        }>;
        /** أنواع الحالات النشطة الأخرى — وقود BR-C2.1.2 عند التعطيل. */
        readonly otherActiveKinds: (clinicId: string, exceptId: string) => Promise<import("../../../../generated/prisma/enums").CrmLeadStatusKind[]>;
    };
    readonly dealStatuses: {
        readonly list: (clinicId: string, includeInactive?: boolean) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
            name: string;
            id: string;
            order: number;
            active: boolean;
            kind: import("../../../../generated/prisma/enums").CrmDealStatusKind;
            color: string;
            defaultProbability: import("@prisma/client-runtime-utils").Decimal;
        }[]>;
        readonly byId: (clinicId: string, id: string) => import("../../../../generated/prisma/models").Prisma__CrmDealStatusClient<{
            name: string;
            id: string;
            order: number;
            active: boolean;
            kind: import("../../../../generated/prisma/enums").CrmDealStatusKind;
            color: string;
            defaultProbability: import("@prisma/client-runtime-utils").Decimal;
        } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
            omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
        }>;
        readonly otherActiveKinds: (clinicId: string, exceptId: string) => Promise<import("../../../../generated/prisma/enums").CrmDealStatusKind[]>;
    };
    readonly leadSources: {
        readonly list: (clinicId: string, includeInactive?: boolean) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
            name: string;
            id: string;
            active: boolean;
        }[]>;
        readonly byId: (clinicId: string, id: string) => import("../../../../generated/prisma/models").Prisma__CrmLeadSourceClient<{
            name: string;
            id: string;
            active: boolean;
        } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
            omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
        }>;
    };
    readonly lostReasons: {
        readonly list: (clinicId: string, includeInactive?: boolean) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
            name: string;
            id: string;
            active: boolean;
        }[]>;
        readonly byId: (clinicId: string, id: string) => import("../../../../generated/prisma/models").Prisma__CrmLostReasonClient<{
            name: string;
            id: string;
            active: boolean;
        } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
            omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
        }>;
    };
    readonly industries: {
        readonly list: (clinicId: string, includeInactive?: boolean) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
            name: string;
            id: string;
            active: boolean;
        }[]>;
        readonly byId: (clinicId: string, id: string) => import("../../../../generated/prisma/models").Prisma__CrmIndustryClient<{
            name: string;
            id: string;
            active: boolean;
        } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
            omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
        }>;
    };
};
