import { type ReminderCollector } from "@/server/reminders/collectors/collector.type";
/**
 * [RC5] الجوامع السريرية والتعاقدية الثلاثة: زيارة خطة الرعاية، متابعة ما بعد
 * العملية، وتجديد العضوية.
 *
 * تجمعها خصلةٌ واحدة: استحقاقُها **عمودٌ مكتوب** لا حسابٌ يُعاد
 * (`CarePlanEnrollmentVisit.scheduledAt`، `PostOpOrder.dueAt`،
 * `Membership.currentPeriodEnd`)، فالجامع قارئٌ ومترجِمٌ لا أكثر.
 */
/**
 * الزيارات **المعلَّقة** وحدها، وبلا موعدٍ محجوز.
 *
 * الشرط الثاني هو المهمّ: زيارةٌ لها `appointmentId` قد حُجزت فعلًا، وتذكيرُ وليّ الأمر
 * بحجزها يناقض ما يراه في تقويمه. أمّا تذكيرُه بالموعد نفسه فهو شغل جامع
 * `APPOINTMENT_UPCOMING` — سببٌ واحد لكل رسالة، وإلّا وصلت رسالتان عن شيء واحد.
 */
export declare const carePlanVisitCollector: ReminderCollector;
/**
 * أمرا `FOLLOW_UP` و`SUTURE_REMOVAL` وحدهما من بين سبعة أنواع.
 *
 * البقية (دواء، مراقبة، تغذية، حركة، عناية بجرح) تعليماتٌ منزلية مستمرّة لا جلسات
 * — وتحويلُها إلى رسائل يعني إغراق وليّ الأمر بتذكيراتٍ يوميّة عن أشياء لا تُحجَز.
 *
 * والأمر الذي أُنشئ له موعدُ متابعةٍ آليًّا (`followUpAppointmentId`) مستبعد لنفس
 * سبب خطة الرعاية: الموعد له جامعُه.
 */
export declare const postOpFollowUpCollector: ReminderCollector;
/**
 * العضويات النشطة والمتأخّرة سدادًا وحدها.
 *
 * `LAPSED`/`CANCELLED`/`EXPIRED` ليست تجديدًا بل بيعٌ جديد، ورسالةُ «تنتهي عضويتكم»
 * لمن انتهت عضويته منذ شهرين رسالةٌ خاطئة. أمّا `PAST_DUE` فتُذكَّر عمدًا: هي
 * بالضبط الحالة التي ينقذها التذكير.
 */
export declare const membershipRenewalCollector: ReminderCollector;
