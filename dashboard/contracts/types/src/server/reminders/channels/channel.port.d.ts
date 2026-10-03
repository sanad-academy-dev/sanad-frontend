import type { NotificationChannel } from "@/generated/prisma/enums";
/**
 * [RC2] منفذ القناة — الحدّ الذي يفصل «ماذا نرسل» عن «بأيّ ناقل».
 *
 * كل قناةٍ تُنفّذ هذا المنفذ، والمُوزِّع (`outbox.service.ts`) لا يعرف عن أيٍّ منها
 * أكثر من هذا. هذه هي الطبقة التي تجعل إضافة مزوّد رسائل نصية غدًا ملفًّا واحدًا لا
 * تعديلًا في كل مكان يُرسل — وهي نفس فكرة `gateway.port.ts` في خطة بوّابة وليّ الأمر.
 *
 * **ثلاث نتائج لا اثنتان، والثالثة هي بيت القصيد:**
 *  - `sent` — سُلِّمت.
 *  - `failed` — عُطلٌ عابر يستحقّ إعادة محاولة (شبكة، مهلة، رفض مؤقّت).
 *  - `skipped` — قرارٌ نهائيّ لا عُطل: لا مزوّد لهذه القناة، أو لا عنوان للمستلِم.
 *    خلطُ هذه بـ`failed` يعني ثلاث محاولات فاشلة يوميًّا على قناةٍ لا وجود لها،
 *    وسجلَّ أخطاء يُخفي الأعطال الحقيقية تحت ضجيجٍ معروفٍ سببُه.
 *  - `manual` — الرابط جاهز والإرسال فعلٌ بشريّ (مزوّد واتساب اليوم). ليست نجاحًا
 *    ولا فشلًا: الرسالة تنتظر ضغطة موظّف، ويجب أن تظهر في شاشةٍ تطلب ذلك.
 */
export type ChannelMessage = {
    clinicId: string;
    /** بريد أو رقم E.164 — لقطةٌ مُثبَّتة وقت الإدراج */
    toAddress: string | null;
    subject: string | null;
    body: string;
    /** روابط الكيان — تُمرَّر للوارد ليصير العنصر قابلًا للنقر */
    ownerId: string | null;
    patientId: string | null;
    appointmentId: string | null;
    recipientUserId: string | null;
};
export type ChannelResult = {
    status: "sent";
    detail?: string;
} | {
    status: "failed";
    error: string;
} | {
    status: "skipped";
    reason: string;
} | {
    status: "manual";
    link: string;
};
export type ChannelAdapter = {
    channel: NotificationChannel;
    /**
     * هل للقناة مزوّد مُهيّأ في هذه الحزمة؟ تُقرأ **قبل** الإدراج لاختيار القناة
     * (`pickChannel`)، فلا تُدرَج رسالة على ناقلٍ لا وجود له أصلًا.
     */
    isConfigured(): boolean;
    /** هل هذا العنوان صالح لهذه القناة؟ بريدٌ في حقل واتساب ليس عنوانًا. */
    accepts(toAddress: string | null): boolean;
    send(message: ChannelMessage): Promise<ChannelResult>;
};
