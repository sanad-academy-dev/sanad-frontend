import { type ReminderCollector } from "@/server/reminders/collectors/collector.type";
/**
 * [RC5] جامع التطعيمات — أعلى الجوامع قيمةً، ومحرّكُه هو الأنضج في المستودع.
 *
 * يستدعي `vaccinationsDao.listDue` كما هي، فتصل الصفوف محسوبةً **لكل مُستضِدّ**
 * لا لكل منتج (جرعة DHPPi ترضي أربعة مُستضِدّات دفعةً واحدة). إعادةُ هذا الحساب
 * هنا كانت ستُنتج تذكيرًا يخالف ما تعرضه شاشة «المستحقّون».
 *
 * ويُرشَّح إلى الحالات التي **تستدعي فعلًا اتصالًا**: `UNKNOWN_AGE` مستبعدة لأنها
 * ليست تأخّرًا بل نقصُ تاريخ ميلاد — وتذكيرُ وليّ أمرٍ بجرعة لا يعرف النظامُ موعدها
 * يجعل الرسالة بلا تاريخ، وهو أسوأ من الصمت. و`UP_TO_DATE` مستبعدة بداهةً.
 *
 * البريد يُقرأ بقراءةٍ ثانية مجمَّعة: صفُّ الاستحقاق يحمل الهاتف لا البريد،
 * وقراءةٌ واحدة لكل أولياء الأمور أرخص من قراءةٍ لكل صفّ.
 */
export declare const vaccinationCollector: ReminderCollector;
/** قراءةٌ واحدة مجمَّعة لبُرد أولياء الأمور — لا استعلام داخل حلقة. */
export declare function ownerEmails(clinicId: string, ownerIds: readonly (string | null)[]): Promise<Map<string, string>>;
