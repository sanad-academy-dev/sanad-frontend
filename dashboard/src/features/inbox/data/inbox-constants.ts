// قواعد شريط الرؤى (توقّع الذروة) — قواعد ثابتة بدون AI حقيقي

// أيام الذروة الثابتة: الجمعة والسبت (قيم Date#getDay)
export const PEAK_WEEKDAYS: number[] = [5, 6];

// عتبة الذروة: تجاوز الزيارات المجدولة هذا العدد في اليوم نفسه
export const PEAK_SCHEDULED_THRESHOLD = 60;
