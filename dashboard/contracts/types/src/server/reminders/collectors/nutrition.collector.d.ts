import { type ReminderCollector } from "@/server/reminders/collectors/collector.type";
/**
 * [RC5] جامع إعادة تقييم التغذية — يقرأ `NutritionPlan.nextRecheckAt` عبر
 * `nutritionDao.listDue`، ولا يجدول شيئًا بنفسه.
 *
 * الخطط غير النشطة مستبعدة في الـDAO نفسه (`status: ACTIVE`)، وهو الصواب: خطةٌ
 * أُوقفت لا تُنتج استدعاءً، ووليّ أمرٌ يُستدعى لمتابعة خطةٍ ألغاها مدرّبُها يفقد الثقة
 * في التذكيرات كلّها.
 */
export declare const nutritionCollector: ReminderCollector;
