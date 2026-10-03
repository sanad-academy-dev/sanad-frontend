import { type LoyaltySettingsFormInput, type LoyaltySettingsResponse } from "@/server/loyalty/loyalty-settings/loyalty-settings.type";
/** [LY-P0] استعلامات فقط — لا منطق أعمال (AGENTS.md). */
export declare const loyaltySettingsDao: {
    /** لا صفّ ⇒ الافتراضيات، لا `null`: كل قارئ يريد قيمًا لا حالة «غير موجود». */
    get: (clinicId: string) => Promise<LoyaltySettingsResponse>;
    update: (clinicId: string, input: LoyaltySettingsFormInput) => import("../../../../generated/prisma/models").Prisma__ClinicLoyaltySettingsClient<{
        enableLoyaltyModule: boolean;
        loyaltyTierWindowMonths: number;
        loyaltyExpiryNoticeDays: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
};
