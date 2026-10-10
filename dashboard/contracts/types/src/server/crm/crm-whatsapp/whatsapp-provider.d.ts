/**
 * [CRM-P4] §9.2 — واجهة مزوّد واتساب.
 *
 * الواجهة موجودة لسببٍ عمليّ لا معماريّ: القرار الحاليّ هو بوّابة Green API الكلاسيكية،
 * وهي **غير رسمية** ويُقبل معها خطر إيقاف الحساب (§17.2 صفّ ١٧). حين يصير ذلك مكلفًا،
 * يدخل مزوّد WABA من هنا دون أن تتغيّر الدورة ولا الشاشات.
 *
 * كل شيء هنا **بلا حالة**: بيانات الاعتماد تُمرَّر عند كل نداء ولا تُخزَّن في المزوّد،
 * فلا نسخةٌ مفكوكة التشفير تعيش في الذاكرة أطول من الطلب.
 */
/** بيانات اعتماد مفكوكة، تعيش داخل نداءٍ واحد فقط. */
export type WhatsappCredentials = {
    instanceId: string;
    apiToken: string;
};
/** حالة الرسالة كما يعرفها المزوّد — تُطابق `CrmWhatsappStatus` عمدًا. */
export type WhatsappStatus = "SENT" | "DELIVERED" | "READ" | "FAILED";
export type SendResult = {
    ok: true;
    providerMessageId: string;
} | {
    ok: false;
    failureReason: string;
};
/**
 * إشعارٌ وارد من طابور المزوّد. `receiptId` هو ما يُحذَف به لاحقًا — والحذف لا يقع إلا
 * بعد الحفظ (§17.2 صفّ ١٨): الطابور نفسه هو المؤشّر، فما لم يُحذف يُعاد تسليمه.
 */
export type ProviderNotification = {
    receiptId: number;
    kind: "incomingMessage" | "outgoingStatus" | "stateChanged" | "other";
    /** للرسائل: من/إلى ونصّها. */
    chatId?: string;
    body?: string;
    providerMessageId?: string;
    /** لتحديثات الحالة. */
    status?: WhatsappStatus;
    /** لتغيّر حالة النسخة (`authorized` / `notAuthorized` / …). */
    state?: string;
};
export interface WhatsappProvider {
    readonly key: "MANUAL" | "GREEN_API";
    /** يرسل نصًّا. لا يرمي عند فشل المزوّد — يعيد `ok:false` ليُسجَّل الفشل لا ليُبتلع. */
    sendText(credentials: WhatsappCredentials, chatId: string, body: string): Promise<SendResult>;
    /** يسحب إشعارًا واحدًا، أو `null` حين يفرغ الطابور. */
    receive(credentials: WhatsappCredentials): Promise<ProviderNotification | null>;
    /** يؤكّد المعالجة ويُخرج الإشعار من الطابور. */
    acknowledge(credentials: WhatsappCredentials, receiptId: number): Promise<void>;
}
/**
 * §9.2 — المزوّد الافتراضي حين لا تهيئة: يسجّل ولا يرسل.
 *
 * ليس عطلًا ولا كعبَ روتين: «غير مُهيَّأ» حالةٌ صحيحة تصفها المواصفة، والواجهة تبقى
 * كاملة — يكتب الموظّف الرسالة، تُحفظ في الخيط الزمني، ويرسلها بهاتفه. الوعد الوحيد
 * الذي لا يُقطَع هنا هو الوعد بإرسالٍ آليّ.
 */
export declare const manualProvider: WhatsappProvider;
/** `<digits>@c.us` — صيغة Green API. تُشتقّ مرّة واحدة هنا لا في كل موضع نداء. */
export declare function toChatId(phoneDigits: string): string;
/** والعكس، لمطابقة الوارد مع `mobileNormalized`. */
export declare function fromChatId(chatId: string): string;
