import type { ChannelAdapter } from "@/server/reminders/channels/channel.port";
/**
 * [RC2] قناة الوارد — القناة الوحيدة التي كانت تعمل قبل هذه الوحدة.
 *
 * مستلِمها **الطاقم لا وليّ الأمر**: الوارد شاشةٌ خلف جدار الدخول. فتذكيرُ وليّ أمرٍ لا
 * يُسلَّم هنا أبدًا، وإنّما تُسلَّم هنا التنبيهات التشغيلية — «١٢ استدعاءً بانتظار
 * الاتصال اليوم» — ورسائلُ المزوّد اليدويّ التي تحتاج ضغطة موظّف.
 *
 * دائمًا مُهيّأة: لا مزوّد خارجيًّا ولا مفتاح، وهي جدول في قاعدة البيانات نفسها.
 */
export declare const inboxChannel: ChannelAdapter;
export declare const describe: (error: unknown) => string;
