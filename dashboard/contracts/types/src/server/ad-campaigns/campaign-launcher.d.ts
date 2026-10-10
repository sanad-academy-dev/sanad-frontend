import type { AdCampaignDetail } from "@/server/ad-campaigns/ad-campaigns.type";
/**
 * [MK6.2] واجهة الإطلاق.
 *
 * القرار D1 (draft-and-export): النظام لا يحتفظ ببطاقة ولا يشتري وسائط ولا ينشر
 * نيابةً عن أحد. «الإطلاق» هنا يعني: تحقّق من اكتمال الحملة، ثم ثبّتها جاهزة
 * للتسليم، ثم سلّم الأكاديمية حزمةً تُطلقها من مدير إعلانات المنصّة نفسه.
 *
 * الواجهة موجودة كي لا يكون هذا القرار مبثوثًا في المتحكّم: يوم يصل الخيار A
 * (ربط حساب المنصّة عبر OAuth) يُكتب `MetaCampaignLauncher` ويُستبدل السطر الذي
 * يختار المنفّذ — لا أكثر. لو كان منطق التصدير مكتوبًا داخل المسار لصار استبداله
 * إعادة كتابة للمسار.
 */
export type LaunchReadiness = {
    ready: boolean;
    /** ما ينقص الحملة، بالعربية، لعرضه في زرّ الإطلاق المعطَّل */
    missing: string[];
};
export type LaunchResult = {
    /** الحالة التي تنتقل إليها الحملة بعد الإطلاق */
    status: "SCHEDULED" | "ACTIVE" | "PENDING";
    externalId: string | null;
    /** ملخّص يُعرض في نافذة النجاح */
    summary: string;
};
export interface CampaignLauncher {
    readonly key: string;
    check(campaign: AdCampaignDetail): LaunchReadiness;
    launch(campaign: AdCampaignDetail): Promise<LaunchResult>;
}
/**
 * ما تحتاجه الحملة لتكون قابلة للتسليم. الفحص هنا لا في الواجهة: زرّ معطَّل في
 * المتصفّح ليس حارسًا — من يستدعي المسار مباشرةً يتجاوزه.
 */
export declare function checkCampaignReadiness(campaign: AdCampaignDetail): LaunchReadiness;
/**
 * منفّذ D1. لا يتصل بأي منصّة، ولا يدّعي أنه فعل.
 *
 * الحالة تصير `SCHEDULED` لا `ACTIVE`: الحملة جاهزة ومجدولة عندنا، لكنها لا تُعرض
 * على أحد قبل أن يرفعها موظّف الأكاديمية إلى مدير الإعلانات. وضعها `ACTIVE` كان
 * سيجعل بطاقة «الحملات النشطة» تعدّ حملات لا تعمل.
 */
export declare const draftExportLauncher: CampaignLauncher;
/** المنفّذ الفعّال. سطر واحد يتغيّر يوم يصل ربط المنصّة. */
export declare const activeLauncher: CampaignLauncher;
