import { Prisma } from "@/generated/prisma/client";
import { type CreateDealFormInput, type CrmDealDetailResponse, type DealProductsFormInput } from "@/server/crm/crm-deals/crm-deals.type";
/**
 * §5 — المصدر يُتحقَّق منه داخل الأكاديمية، لا بمفتاحٍ أجنبيٍّ وحده.
 *
 * المفتاح الأجنبي يثبت أنّ الصفّ موجود، لا أنّه **صفّ هذه الأكاديمية**: مُعرّفٌ من أكاديميةٍ
 * أخرى كان سيُقبل. ولأنّ الانتهاك يقع في قاعدة البيانات، كان المستخدم يرى «حدث خطأ غير
 * متوقّع» (٥٠٠) بدل رفضٍ عربيٍّ مفهوم.
 */
export declare function assertSourceInClinic(clinicId: string, sourceId: string | null | undefined): Promise<void>;
/** §3.2 مطبَّقًا على الصفقة: الإسناد يُشعر المُسنَد إليه، والإشعار يرتبط بالصفقة مباشرةً. */
export declare function notifyDealAssignment(clinicId: string, deal: {
    id: string;
    fullName: string;
    ownerUserId: string | null;
}, actorUserId: string): Promise<void>;
/**
 * §4.1 — إنشاء صفقة. `leadId` يمرّره التحويل (§5) وحده؛ الإنشاء اليدوي يتركه فارغًا.
 * الإنشاء مباشرةً في «مكسوبة» مرفوض للسبب نفسه في BR-C4.1.
 */
export declare function createDeal(clinicId: string, input: CreateDealFormInput, actorUserId: string, tx?: Prisma.TransactionClient): Promise<CrmDealDetailResponse>;
/**
 * §4 — المسار الوحيد لتغيير الحالة. يفرض BR-C4.1 وBR-C3.3، ويعيد حساب النسبة وفق
 * BR-C4.2، ويكتب سجلّ §8.1 بمدّته — كله في معاملةٍ واحدة.
 */
export declare function changeDealStatus(clinicId: string, dealId: string, input: {
    statusId: string;
    lostReasonId?: string;
    lostNotes?: string;
}, actorUserId: string): Promise<CrmDealDetailResponse>;
export declare function assignDeal(clinicId: string, dealId: string, ownerUserId: string | null, actorUserId: string): Promise<CrmDealDetailResponse>;
/**
 * BR-C4.2 — تعديل النسبة صراحةً (يرفع العلم) أو إعادتها إلى افتراضي الحالة (يخفضه).
 * الفعلان صريحان كلاهما: لا شيء هنا يحدث «تلقائيًّا» خلف ظهر المستخدم.
 */
export declare function setDealProbability(clinicId: string, dealId: string, input: {
    probability?: number;
    reset?: boolean;
}, _actorUserId: string): Promise<CrmDealDetailResponse>;
/**
 * §6 — حفظ محرّر المنتجات كقائمةٍ كاملة: صفٌّ غاب عن الحمولة صفٌّ حُذف. البديل (تعديل
 * سطرٍ سطرًا) يجعل «احذف سطرًا واحفظ» نداءين قد ينجح أحدهما ويفشل الآخر، فتبقى القيمة
 * مشتقّةً من قائمةٍ لم تعد موجودة.
 *
 * BR-C6.1 — القيمة تصير Σ السطور حين توجد سطور، وتبقى يدويّة حين لا توجد.
 * BR-C6.2 — أسعارٌ تقديرية: لا نداء لمَعبر التسعير ولا ضريبة ولا محرّك منافع.
 */
export declare function saveDealProducts(clinicId: string, dealId: string, input: DealProductsFormInput, _actorUserId: string): Promise<CrmDealDetailResponse>;
