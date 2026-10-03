import { type CrmDealDetailResponse } from "@/server/crm/crm-deals/crm-deals.type";
/**
 * [CRM-P2] §7 — مسار الفوز، وهو تسليم الـ CRM الوحيد إلى بقيّة النظام.
 *
 * كل شيء في معاملةٍ واحدة (BR-C7.1): إمّا صفقةٌ مكسوبة ووليّ أمرٌ محسوم، أو لا شيء والصفقة
 * في حالتها السابقة. الحالة الوسطى — صفقةٌ «مكسوبة» بلا وليّ أمر — هي بالضبط ما وُجدت
 * BR-C4.1 لتمنعه بإخراج «مكسوبة» من قائمة الحالات العادية.
 *
 * BR-C7.2 — لا أطفال يُنشأون هنا. `petSpecies/petCount/petNotes` نثرٌ كتبه موظّف استقبال،
 * لا سجلّاتُ أطفال؛ واشتقاق أطفال منه يملأ الملفّات بأطفالٍ لم تُفحَص قط. أول زيارة
 * تُنشئ الطفل بمسارها المعتاد.
 */
/** ما يعرضه النظام بعد الفوز — §7.3: دعوةٌ إلى مسار MI، لا تسجيلٌ يجري خلف الظهر. */
export type MembershipPrompt = {
    ownerId: string;
    plans: Array<{
        id: string;
        name: string;
    }>;
} | null;
export declare function winDeal(clinicId: string, dealId: string, input: {
    statusId: string;
    ownerId?: string;
}, actorUserId: string): Promise<{
    deal: CrmDealDetailResponse;
    membershipPrompt: MembershipPrompt;
}>;
