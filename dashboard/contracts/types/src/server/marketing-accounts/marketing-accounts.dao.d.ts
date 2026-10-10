import type { AdPlatform } from "@/generated/prisma/enums";
import { type MarketingAccountResponse } from "@/server/marketing-accounts/marketing-accounts.type";
export declare const marketingAccountsDao: {
    list(clinicId: string, platform?: AdPlatform): Promise<MarketingAccountResponse[]>;
    /**
     * يضمن وجود صفحة افتراضية واحدة للمنصّة. `upsert` على المفتاح المركّب يجعله
     * قابلًا لإعادة النداء بلا تكرار — تُستدعى عند فتح المعالج، لا في ترحيل، لأن
     * ترحيلًا يكتب صفحات لأكاديميات لن تستخدم الوحدة أبدًا.
     */
    ensureDefault(clinicId: string, platform: AdPlatform): Promise<MarketingAccountResponse>;
};
