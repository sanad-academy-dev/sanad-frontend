import type { ChannelAdapter } from "@/server/reminders/channels/channel.port";
/**
 * [RC2] قناة البريد — الناقل الخارجي الوحيد الموجود فعلًا في هذه الحزمة
 * (`src/lib/email`: nodemailer فوق SMTP).
 *
 * الجسد يُخزَّن نصًّا عاديًّا في الصندوق الصادر، ويُحوَّل هنا إلى HTML بسيط
 * `dir="rtl"`. سببُ التحويل هنا لا عند الإدراج: اللقطة المخزَّنة يجب أن تبقى
 * مقروءةً لإنسان في شاشة المراقبة، لا وسمًا يُقرأ بصعوبة — والقناة هي من يعرف
 * ما يحتاجه ناقلُها.
 */
export declare const emailChannel: ChannelAdapter;
