/**
 * [CRM-P0] منطق الأعمال فوق الـ DAO (NFR-3).
 *
 * §0.3 — بوابة الوحدة: كل مسار في الوحدة يمرّ من هنا أوّلًا. التحقّق **عند أول استخدام** لا
 * عند الحفظ، وهو نفس مذهب MI: الإعدادات تُحفَظ دائمًا، والرفض يقع حين يُطلَب عملٌ فعلي.
 */
export declare function assertCrmEnabled(clinicId: string): Promise<void>;
/**
 * BR-C2.1.1 — عدّ المراجع قبل الحذف. في CRM-P0 لا يوجد جدولٌ يشير إلى هذه الأنواع بعد
 * (`crm_lead` يصل في CRM-P1)، فالعدّ صفرٌ دائمًا اليوم — والدالة موجودة لأنّ المرحلة
 * التالية تملؤها، ولأنّ السلوك المُختبَر يجب أن يكون سلوك القاعدة لا سلوك الفراغ.
 */
declare const referenceCounters: {
    readonly "lead-statuses": (_clinicId: string, _id: string) => Promise<number>;
    readonly "deal-statuses": (_clinicId: string, _id: string) => Promise<number>;
    readonly "lead-sources": (_clinicId: string, _id: string) => Promise<number>;
    readonly "lost-reasons": (_clinicId: string, _id: string) => Promise<number>;
    readonly industries: (_clinicId: string, _id: string) => Promise<number>;
};
export declare function countReferences(kind: keyof typeof referenceCounters, clinicId: string, id: string): Promise<number>;
/** BR-C2.1.1 — الحذف الصلب يُرفَض ما دام النوع مُشارًا إليه. */
export declare function assertMasterDeletable(kind: keyof typeof referenceCounters, clinicId: string, id: string, label: string): Promise<void>;
/**
 * BR-C2.1.2 — تُستدعى قبل التعطيل فقط. التفعيل لا يمكن أن يكسر التغطية أبدًا، فاشتراط
 * الفحص عليه كان سيمنع إصلاح خطّ أنابيبٍ مكسور.
 */
export declare function assertLeadStatusDeactivatable(clinicId: string, id: string): Promise<void>;
export declare function assertDealStatusDeactivatable(clinicId: string, id: string): Promise<void>;
/** الحذف الناعم الموحَّد: `isDeleted` + ختم الوقت، كما في كل أنواع المستودع. */
export declare const softDelete: {
    readonly "lead-statuses": (clinicId: string, id: string) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<import("../../../../generated/prisma/internal/prismaNamespace").BatchPayload>;
    readonly "deal-statuses": (clinicId: string, id: string) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<import("../../../../generated/prisma/internal/prismaNamespace").BatchPayload>;
    readonly "lead-sources": (clinicId: string, id: string) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<import("../../../../generated/prisma/internal/prismaNamespace").BatchPayload>;
    readonly "lost-reasons": (clinicId: string, id: string) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<import("../../../../generated/prisma/internal/prismaNamespace").BatchPayload>;
    readonly industries: (clinicId: string, id: string) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<import("../../../../generated/prisma/internal/prismaNamespace").BatchPayload>;
};
export {};
