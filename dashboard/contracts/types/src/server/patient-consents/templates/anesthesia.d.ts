import type { ConsentTemplateDef } from "../consent-template.type";
/**
 * الموافقة على التخدير — نموذج المصدر AR (9) و EN (10).
 * الأسعار في النص الأصلي مكتوبة يدويًا (575 / 402.50 ريال). هنا كل بند مسعَّر
 * يشير إلى دورة في قائمة الأسعار (priceServiceCode) ويُطبع سعرها وقت التوقيع —
 * تغيير السعر لا يُبطل نموذجًا موقَّعًا لأن اللقطة تحفظ السعر الذي عُرض فعلًا.
 */
export declare const ANESTHESIA_TEMPLATE: ConsentTemplateDef;
