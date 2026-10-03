/** [LY-P0] استعلامات فقط — لا منطق أعمال (AGENTS.md). */
export declare const loyaltyProgramDao: {
    list: (clinicId: string, includeInactive: boolean) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        earnRate: import("@prisma/client-runtime-utils").Decimal;
        redemptionRate: import("@prisma/client-runtime-utils").Decimal;
        minRedemptionPoints: number;
        maxRedemptionPercent: import("@prisma/client-runtime-utils").Decimal;
        pointsValidityMonths: number;
        membershipMultiplier: import("@prisma/client-runtime-utils").Decimal;
        roundingMode: "FLOOR";
        tiers: {
            name: string;
            id: string;
            order: number;
            active: boolean;
            programId: string;
            minSpend: import("@prisma/client-runtime-utils").Decimal;
            earnMultiplier: import("@prisma/client-runtime-utils").Decimal;
            colorToken: string;
        }[];
    }[]>;
    byId: (clinicId: string, id: string) => import("../../../../generated/prisma/models").Prisma__LoyaltyProgramClient<{
        name: string;
        id: string;
        createdAt: Date;
        active: boolean;
        earnRate: import("@prisma/client-runtime-utils").Decimal;
        redemptionRate: import("@prisma/client-runtime-utils").Decimal;
        minRedemptionPoints: number;
        maxRedemptionPercent: import("@prisma/client-runtime-utils").Decimal;
        pointsValidityMonths: number;
        membershipMultiplier: import("@prisma/client-runtime-utils").Decimal;
        roundingMode: "FLOOR";
        tiers: {
            name: string;
            id: string;
            order: number;
            active: boolean;
            programId: string;
            minSpend: import("@prisma/client-runtime-utils").Decimal;
            earnMultiplier: import("@prisma/client-runtime-utils").Decimal;
            colorToken: string;
        }[];
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    /** BR-L3.1 — البرامج الفعّالة، لفحص «واحدٌ فقط» قبل التفعيل. */
    activePrograms: (clinicId: string) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        name: string;
        id: string;
    }[]>;
    tiersOfProgram: (clinicId: string, programId: string) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        name: string;
        id: string;
        order: number;
        active: boolean;
        programId: string;
        minSpend: import("@prisma/client-runtime-utils").Decimal;
        earnMultiplier: import("@prisma/client-runtime-utils").Decimal;
        colorToken: string;
    }[]>;
    tierById: (clinicId: string, id: string) => import("../../../../generated/prisma/models").Prisma__LoyaltyTierClient<{
        name: string;
        id: string;
        order: number;
        active: boolean;
        isDeleted: boolean;
        programId: string;
        minSpend: import("@prisma/client-runtime-utils").Decimal;
        earnMultiplier: import("@prisma/client-runtime-utils").Decimal;
        colorToken: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    /**
     * BR-L3.3 — عدّ ما يشير إلى البرنامج قبل الحذف.
     *
     * صفرٌ دائمًا في LY-P0: لا جدول يشير إلى البرنامج بعدُ غير `loyalty_tier`، وهو ابنٌ
     * يُحذف بالتتالي فلا يمنع. LY-P1 يضيف دفتر النقاط هنا — والدالة موجودة الآن لأنّ
     * القاعدة تُختبر بسلوكها لا بفراغها.
     */
    countProgramReferences: (_clinicId: string, _programId: string) => Promise<number>;
};
