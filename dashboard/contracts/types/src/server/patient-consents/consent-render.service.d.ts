import type { ConsentLocale } from "@/generated/prisma/enums";
import type { ConsentAutofill, ConsentFieldDef, ConsentTemplateDef } from "@/server/patient-consents/consent-template.type";
import type { ConsentFieldValues } from "@/server/patient-consents/patient-consents.type";
/** السياق المسطّح الذي تُحلّ منه التعبئة الآلية */
export type ConsentAutofillContext = Partial<Record<ConsentAutofill, string>>;
/** أسعار البنود المسعَّرة وقت العرض — رمز الدورة إلى سعرها منسّقًا */
export type ConsentPriceMap = Record<string, string>;
/** يبني السياق من السجلّات المحمّلة — أي حقل غائب يبقى فارغًا ولا يُلفَّق */
export declare const buildAutofillContext: (input: {
    clinicName?: string | null;
    owner?: {
        name?: string | null;
        phone?: string | null;
        email?: string | null;
        city?: string | null;
        address?: string | null;
    } | null;
    patient?: {
        name?: string | null;
        code?: string | null;
        birthDate?: Date | string | null;
        weight?: number | null;
        gender?: string | null;
        microchipNumber?: string | null;
        coat?: string | null;
        animalType?: {
            arName?: string | null;
            enName?: string | null;
        } | null;
        animalStrain?: {
            arName?: string | null;
            enName?: string | null;
        } | null;
    } | null;
    operationCase?: {
        diagnosis?: string | null;
        procedures?: {
            nameSnapshot: string;
        }[];
        surgeonName?: string | null;
    } | null;
    now?: Date;
}) => ConsentAutofillContext;
/** كل حقول القالب مسطّحة عبر كتله */
export declare const templateFields: (template: ConsentTemplateDef) => ConsentFieldDef[];
/**
 * يملأ الحقول من السياق. القيم التي أدخلها المستخدم لا تُمسّ أبدًا — التعبئة
 * الآلية اقتراح أوّلي لا سلطة: الموظّف يبقى وليّ أمر كل حقل.
 */
export declare const applyAutofill: (template: ConsentTemplateDef, ctx: ConsentAutofillContext, existing?: ConsentFieldValues) => ConsentFieldValues;
type RenderOpts = {
    locale: ConsentLocale;
    values: ConsentFieldValues;
    ctx: ConsentAutofillContext;
    prices?: ConsentPriceMap;
};
/**
 * المستند كما عُرض على الموقِّع. يُحفظ في textSnapshot عند التوقيع فيصير السجل
 * القانوني: تعديل القالب أو الأسعار بعدها لا يُغيّر حرفًا مما وُقّع عليه.
 */
export declare const renderConsentDocument: (template: ConsentTemplateDef, opts: RenderOpts) => string;
/** الحقول الإلزامية الناقصة — تمنع الانتقال إلى التوقيع */
export declare const missingRequiredFields: (template: ConsentTemplateDef, values: ConsentFieldValues) => ConsentFieldDef[];
/** الاختيارات الإلزامية غير المحدَّدة — «يرجى تحديد خيار واحد فقط» */
export declare const missingRequiredChoices: (template: ConsentTemplateDef, values: ConsentFieldValues) => {
    key: string;
    labelAr: string;
}[];
export {};
