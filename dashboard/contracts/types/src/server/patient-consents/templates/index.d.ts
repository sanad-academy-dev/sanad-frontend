import type { ConsentTemplateDef } from "../consent-template.type";
export declare const SYSTEM_CONSENT_TEMPLATES: ConsentTemplateDef[];
/** رقم نسخة قوالب النظام — يُرفع يدويًا عند تعديل أي نصّ قانوني أعلاه */
export declare const SYSTEM_TEMPLATE_VERSION = 1;
export declare const systemTemplateByKey: (key: string) => ConsentTemplateDef | undefined;
