import type { Prisma as PrismaNs } from "@/generated/prisma/client";
/**
 * [PH3.3] حساب الصرفات وإعادات الصرف — BRD_Pharmacy_Module.md §7.
 *
 * **ملفّ مستقلّ عن `dispense.service.ts` عمدًا.** الدوالّ هنا نقيّة، لكنها كانت تعيش
 * في ملفّ الدورة الذي يستورد عميل قاعدة البيانات — فكان اختبارها يُصنَّف «نقيًّا»
 * (مصنِّف `vitest.fast.config.ts` نصّي ولا يرى الاستيراد غير المباشر) ثم ينهار في
 * السويّة السريعة على CI حيث لا DATABASE_URL. وهو بالضبط ما يحذّر منه تعليق
 * `currency.dao.test.ts` في ذلك الملفّ.
 *
 * الفصل هو الإصلاح الصحيح لا إضافة الملفّ إلى قائمة الاستثناءات: حسابٌ نقيّ يستحقّ
 * أن يُنفَّذ على كل دفعة.
 */
/**
 * حجم الصرفة الواحدة بوحدات المخزون.
 *
 * الكمّية الموصوفة `Decimal` والمخزون `Int` (راجع تعليق `DispenseEvent.quantity`)،
 * فالتقريب **لأعلى**: وصفةٌ بـ٢٫٥ عبوة تعني أن العبوة الثالثة مسموحة، ومنعُها يحبس
 * آخر جرعة خلف قيدٍ حسابي لا سريري.
 */
export declare function fillSize(quantity: PrismaNs.Decimal): number;
/** السقف الكلّي = الصرفة الأولى + إعادات الصرف المصرَّح بها */
export declare function maxDispensable(quantity: PrismaNs.Decimal, refillsAllowed: number): number;
/**
 * عدد إعادات الصرف المستهلَكة بعد كمّية مصروفة تراكميًّا.
 *
 * **الصرف الجزئي ليس إعادة صرف.** ٣٠ قرصًا تُسلَّم ١٠ ثم ٢٠ هي صرفةٌ واحدة مقسّمة،
 * لا صرفتان — وعدُّها إعادةَ صرف يستهلك حقًّا لم يُستعمل ويمنع الطفل من دوائه.
 * إعادة الصرف تبدأ حين تُستنفد الصرفة الأولى بالكامل.
 */
export declare function refillsConsumed(totalDispensed: number, oneFill: number): number;
