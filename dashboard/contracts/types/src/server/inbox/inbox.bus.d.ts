import type { InboxPushPayload } from "@/server/inbox/inbox.type";
export type InboxStreamSubscriber = {
    clinicId: string;
    userId: string;
    send: (event: string, data: unknown) => void;
};
/** يسجّل مستمعًا جديدًا ويعيد دالة إلغاء الاشتراك. */
export declare function subscribeToInbox(subscriber: InboxStreamSubscriber): () => void;
/**
 * يبثّ عنصر وارد جديدًا لكل المتصلين في نفس الأكاديمية.
 *
 * يصل الحدث لكل أعضاء الأكاديمية (لا للمستهدَف وحده) لأن الشارة وقائمة الوارد
 * على مستوى الأكاديمية اليوم — فلو حجبناه لبقيت الشارة قديمة. الحمولة تحمل
 * `recipientUserId` والعميل هو من يقرر كتم التنبيه إن كان العنصر موجّهًا لغيره.
 */
export declare function publishInboxItem(payload: InboxPushPayload): void;
/** عدد الاتصالات المفتوحة حاليًا (للتشخيص/الفحوص). */
export declare function inboxSubscriberCount(): number;
