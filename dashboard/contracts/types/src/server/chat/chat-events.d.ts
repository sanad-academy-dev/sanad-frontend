/**
 * ناقل أحداث «الرسائل» داخل الذاكرة + سجلّ الحضور.
 *
 * الخادم يعمل كنسخة واحدة (حاوية Docker واحدة تشغّل Nitro node server)، لذا
 * يكفي ناقل داخل الذاكرة بلا وسيط خارجي: كل متصفح مفتوح على الوحدة يمسك
 * اتصال SSE واحدًا (GET /api/chat/events)، والإرسال يدفع حدثًا لكل أعضاء
 * المحادثة المتصلين فيُعيدون جلب الاستعلامات المتأثرة فورًا.
 *
 * الحضور (النقطة الخضراء) مشتق من الاتصالات الحية نفسها: مستخدم متصل
 * بمجرى الأحداث = متصل بالوحدة. عند أي دخول/خروج نبثّ حدث presence للجميع.
 */
export type ChatServerEvent = {
    type: "message";
    conversationId: string;
    /** هوية المرسِل ومعاينة النص — ليعرض العميل توست «رسالة جديدة» خارج الوحدة */
    authorId: string;
    authorName: string;
    preview: string;
} | {
    type: "conversation";
    conversationId?: string;
} | {
    type: "presence";
};
type Writer = (chunk: string) => void;
/** بث حدث لمجموعة مستخدمين (أعضاء محادثة عادةً) */
export declare const publishChatEvent: (userIds: string[], event: ChatServerEvent) => void;
/** المستخدمون المتصلون حاليًا */
export declare const onlineUserIds: () => Set<string>;
/** تسجيل اتصال SSE جديد — يعيد دالة إلغاء الاشتراك */
export declare const subscribeChatEvents: (userId: string, write: Writer) => (() => void);
export {};
