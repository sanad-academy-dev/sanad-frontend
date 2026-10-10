import { type ReminderCollector } from "@/server/reminders/collectors/collector.type";
/**
 * [RC5] جامع التجميل — يقرأ `PatientGroomingProfile.nextGroomDueAt` عبر
 * `groomingDao.listDue`، وهو الكاش الذي تكتبه جلسة التجميل عند إتمامها.
 *
 * لا يُعيد حساب الدورية من تردّد الدورة: ذلك حسابٌ يملكه محرّك التجميل، وقراءتُه
 * من مكانين تعني تذكيرًا يخالف قائمة «تأخّر عن موعد التجميل» في شاشة الوحدة.
 */
export declare const groomingCollector: ReminderCollector;
