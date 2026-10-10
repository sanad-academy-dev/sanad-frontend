import type { AdTemplateCategory } from "@/generated/prisma/enums";
import { type AdCopyTemplateResponse } from "@/server/ad-creatives/ad-creatives.type";
export declare const adCreativesDao: {
    /**
     * قوالب الأكاديمية + القوالب العامّة (`clinicId IS NULL`) في قائمة واحدة. الخاصّة
     * أولًا: قالب كتبته الأكاديمية لنفسها أولى بالظهور من قالب عامّ مبذور.
     */
    templates(clinicId: string, filters?: {
        category?: AdTemplateCategory;
        search?: string;
    }): Promise<AdCopyTemplateResponse[]>;
    /** صور المكتبة = ما وُلّد أو رُفع سابقًا لحملات هذه الأكاديمية، بلا تكرار */
    libraryImages(clinicId: string, limit?: number): Promise<string[]>;
};
