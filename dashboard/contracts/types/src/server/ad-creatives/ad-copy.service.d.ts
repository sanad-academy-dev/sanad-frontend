import type { AdObjective, AdPlatform } from "@/generated/prisma/enums";
export type ToneSliders = {
    /** 0 = غير رسمي، 100 = رسمي */
    formal?: number | null;
    /** 0 = ودّي، 100 = حازم */
    friendly?: number | null;
    /** 0 = متشائم، 100 = متفائل */
    optimist?: number | null;
};
export type GenerateAdCopyInput = {
    objective: AdObjective;
    platform: AdPlatform;
    clinicName: string;
    /** وصف حرّ يكتبه المستخدم، أو نصّ قالب اختاره */
    brief?: string | null;
    tone?: ToneSliders;
    count?: number;
    /** نصّ يُبنى عليه عند طلب «اقتراحات مشابهة» */
    seedText?: string | null;
};
export type AdCopySuggestion = {
    text: string;
    /** «65 شخصية · 28 كلمة · عفوي» — الوسم أسفل كل بطاقة */
    charCount: number;
    wordCount: number;
    toneLabel: string;
};
/** يُسقط ما خالف الحواجز — نصّ مخالف واحد يمرّ أخطر من اقتراح ناقص */
export declare function violatesGuardrails(text: string): string | null;
export declare function generateAdCopy(input: GenerateAdCopyInput): Promise<AdCopySuggestion[]>;
