import { RadiologyModality, SedationLevel } from "@/generated/prisma/enums";
/** حقول الجرعة الممكنة — كل طريقة تعرض ما يخصّها وحده */
export type DoseField = "kvp" | "mas" | "doseDap" | "ctdiVol" | "dlp";
/** كم يحتاج هذا الفحص إلى تهدئة عادةً (في الطب البيطري) */
export type SedationNeed = "usually" | "sometimes" | "rarely";
export type ModalityCapabilities = {
    /** إشعاع مؤيّن — يُظهر توثيق الجرعة وسؤال احتمال الحمل */
    ionizing: boolean;
    /** حقول الجرعة المعروضة في خطوة الالتقاط */
    doseFields: DoseField[];
    /** يقبل مادة تباين — يُظهر كتلة التباين وسؤال التفاعل السابق */
    contrast: boolean;
    /** الغرسات المعدنية خطر سلامة (الرنين) لا مجرد أثر على الصورة */
    metalSafety: boolean;
    /** الحاجة المعتادة للتهدئة — تُبرز الحقل أو تُخفيه خلف تلميح */
    sedation: SedationNeed;
    /** تسمية مجموعة الالتقاط: إسقاطات للأشعة، تسلسلات للرنين، أطوار للمقطعية... */
    protocolLabel: string;
    /** تسمية مفردة تُستخدم في الجُمل ("أضف {term})" */
    protocolItemLabel: string;
    /** الخيارات المقترحة لتلك المجموعة، مصنّفة */
    protocolGroups: {
        label: string;
        options: string[];
    }[];
    /** يلتقط مقاطع متحركة (سينية) لا صورًا ساكنة فقط */
    cine: boolean;
};
/**
 * يستنتج طريقة التصوير من أسماء تُفحص بالترتيب (الاسم الأدق أولًا).
 * null يعني أن الأسماء لا تدل — والمستدعي يقرّر البديل.
 */
export declare const inferModalityFromNames: (...names: (string | null | undefined)[]) => RadiologyModality | null;
/** قدرات طريقة التصوير — المصدر الذي تتكيّف عليه كل شاشات سير العمل */
export declare const modalityCapabilities: (modality: RadiologyModality) => ModalityCapabilities;
export declare const DOSE_FIELD_META: Record<DoseField, {
    label: string;
    unit: string;
    step: string;
}>;
export declare const SEDATION_NEED_HINT: Record<SedationNeed, string>;
/** التهدئة الافتراضية المقترحة لطريقة التصوير — تُستخدم في تعريف الفحص */
export declare const suggestedSedation: (modality: RadiologyModality) => SedationLevel;
