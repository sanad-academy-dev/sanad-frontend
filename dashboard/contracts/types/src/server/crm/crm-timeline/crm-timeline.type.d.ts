import type { Prisma } from "@/generated/prisma/client";
/** [CRM-P3] §8.3 — الشكل الموحَّد لسطر الخيط الزمني، أيًّا كان مصدره. */
export type CrmTimelineKind = "status" | "note" | "task" | "comment" | "email" | "whatsapp";
/**
 * سطرٌ واحد جاهزٌ للعرض. اسم الحالة **يُحَلّ في الخادم**: السجلّ يخزّن المعرّفات وحدها،
 * وكان العميل يضمّها إلى جداول المراحل بنفسه — فيعرض «—» ما لم تكن المراحل قد وصلت بعد.
 */
export type CrmTimelineEntry = {
    /** مركّب: `note-xxx` / `status-xxx` — فريدٌ عبر المصادر، وهو نصف مفتاح الترتيب. */
    id: string;
    at: string;
    kind: CrmTimelineKind;
    title: string;
    body?: string | null;
    author?: string | null;
    meta?: string | null;
};
export type CrmTimelinePage = {
    entries: CrmTimelineEntry[];
    /** `null` يعني «لا مزيد» — لا صفحةٌ فارغة تُطلَب بلا داعٍ. */
    nextCursor: string | null;
};
export declare const whatsappMessageSelect: {
    readonly id: true;
    readonly direction: true;
    readonly chatId: true;
    readonly body: true;
    readonly status: true;
    readonly failureReason: true;
    readonly at: true;
    readonly sentBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmTimelineWhatsappRow = Prisma.CrmWhatsappMessageGetPayload<{
    select: typeof whatsappMessageSelect;
}>;
export declare const emailMessageSelect: {
    readonly id: true;
    readonly toAddress: true;
    readonly subject: true;
    readonly body: true;
    readonly status: true;
    readonly failureReason: true;
    readonly replyTo: true;
    readonly sentAt: true;
    readonly templateId: true;
    readonly sentBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmEmailMessageResponse = Prisma.CrmEmailMessageGetPayload<{
    select: typeof emailMessageSelect;
}>;
