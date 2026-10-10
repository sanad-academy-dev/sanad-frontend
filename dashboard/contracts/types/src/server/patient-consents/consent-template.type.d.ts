import type { ConsentType } from "@/generated/prisma/enums";
/** مصدر التعبئة الذكية — يُقرأ من السجل بلا تدخل بشري */
export type ConsentAutofill = "owner.name" | "owner.phone" | "owner.email" | "owner.city" | "owner.address" | "patient.name" | "patient.code" | "patient.birthDate" | "patient.weight" | "patient.gender" | "patient.breed" | "patient.animalType" | "patient.microchip" | "patient.coat" | "case.procedures" | "case.diagnosis" | "case.surgeon" | "clinic.name" | "today";
export type ConsentFieldType = "text" | "textarea" | "number" | "percent" | "money" | "date" | "time" | "phone" | "email"
/**
 * اسم مدرّب من طاقم الأكاديمية — يُعرض كقائمة اختيار لا كحقل حرّ.
 *
 * القيمة المخزَّنة تبقى **الاسم نصًّا** لا معرّف الموظّف: النموذج الموقَّع
 * مستند قانوني، والاسم فيه لقطةٌ وقت التوقيع لا مرجعٌ يتغيّر لو أُعيدت
 * تسمية الموظّف أو حُذف. لذلك لا يتغيّر شيء في التصيير ولا في الطباعة.
 */
 | "staff";
/** حقل مُدخَل داخل القالب */
export type ConsentFieldDef = {
    key: string;
    labelAr: string;
    labelEn: string;
    type: ConsentFieldType;
    required?: boolean;
    /** يُملأ آليًا من السجل — يبقى قابلًا للتحرير دائمًا */
    autofill?: ConsentAutofill;
    /** يقبل مسودّة من الذكاء الاصطناعي (زر «صِغ لي») */
    aiDraft?: boolean;
    placeholderAr?: string;
    placeholderEn?: string;
};
export type ConsentOptionDef = {
    value: string;
    labelAr: string;
    labelEn: string;
    /**
     * بند مسعَّر. السعر يُقرأ من قائمة أسعار الأكاديمية عبر ربط الرمز بدورة في
     * الإعدادات، ويتجمّد داخل اللقطة وقت التوقيع.
     */
    priceServiceCode?: string;
    /**
     * السعر المكتوب في النموذج الورقي الأصلي. يُستخدم ما دام الرمز غير مربوط
     * بدورة، فيبقى المطبوع مطابقًا لما توقّعه الأكاديمية اليوم بدل أن يخلو من سعر.
     */
    priceFallback?: string;
};
/** كتلة من جسم القالب */
export type ConsentBlock = 
/** فقرة قانونية ثابتة — تُطبع كما هي */
{
    kind: "paragraph";
    ar: string;
    en: string;
}
/** عنوان قسم */
 | {
    kind: "heading";
    ar: string;
    en: string;
}
/** صفّ حقول (بيانات وليّ الأمر/الطفل/الإجراء) */
 | {
    kind: "fields";
    fields: ConsentFieldDef[];
}
/** اختيار واحد إلزامي من عدة بدائل — «يرجى تحديد خيار واحد فقط» */
 | {
    kind: "choice";
    key: string;
    labelAr: string;
    labelEn: string;
    required?: boolean;
    options: ConsentOptionDef[];
}
/** اختيارات متعددة (مربعات تحقّق) */
 | {
    kind: "checklist";
    key: string;
    labelAr: string;
    labelEn: string;
    options: ConsentOptionDef[];
}
/** إقرار بالأحرف الأولى داخل النموذج */
 | {
    kind: "initial";
    key: string;
    ar: string;
    en: string;
}
/** قسم تملؤه الأكاديمية بعد التوقيع (الوصول/المغادرة/القاعة) */
 | {
    kind: "clinicUse";
    ar: string;
    en: string;
    fields: ConsentFieldDef[];
};
/**
 * لغة طباعة المستند. `BOTH` = ورقة واحدة تحمل النصّين معًا — وهي صيغة النماذج
 * الأحدث في المصدر (الخروج، والجراحة بالغة الخطورة)، لا مجرّد خيار عرض.
 */
export type ConsentLocaleKey = "AR" | "EN" | "BOTH";
export type ConsentTemplateDef = {
    /** المفتاح الثابت — يربط القالب بنوع الموافقة والنسخة المخزّنة */
    key: string;
    type: ConsentType;
    titleAr: string;
    titleEn: string;
    /** لغة الطباعة الافتراضية — يمكن تجاوزها عند إنشاء الموافقة */
    defaultLocale: ConsentLocaleKey;
    /** يقتصر على نوع طفل بعينه (الفندقة: قطط/كلاب) */
    speciesKey?: "CAT" | "DOG";
    blocks: ConsentBlock[];
};
