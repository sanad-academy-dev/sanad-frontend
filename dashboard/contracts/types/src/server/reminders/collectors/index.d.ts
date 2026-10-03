import type { ReminderTrigger } from "@/generated/prisma/enums";
import type { ReminderCollector } from "@/server/reminders/collectors/collector.type";
/**
 * [RC5] سجلّ الجوامع — سببٌ واحد لكلٍّ، ولا سبب بلا جامع.
 *
 * الخريطة **كاملة** على `ReminderTrigger` بحكم النوع: إضافةُ قيمةٍ للتعداد بلا
 * جامعٍ لها توقف فحصَ الأنواع. البديل — خريطةٌ جزئية — كان يعني قاعدةً تُنشأ
 * وتُفعَّل ولا تُنتج شيئًا أبدًا، بلا خطأ في أيّ مكان.
 */
export declare const COLLECTORS: Readonly<Record<ReminderTrigger, ReminderCollector>>;
export declare const collectorFor: (trigger: ReminderTrigger) => ReminderCollector;
