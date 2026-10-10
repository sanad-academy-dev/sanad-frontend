export declare const LANGUAGES: readonly ["ar", "en"];
export type Language = (typeof LANGUAGES)[number];
export type LanguageDirection = "rtl" | "ltr";
export declare const DEFAULT_LANGUAGE: Language;
export declare const LANGUAGE_LABELS: Record<Language, string>;
export declare const LANGUAGE_DIRECTION: Record<Language, LanguageDirection>;
export declare const LANGUAGE_OPTIONS: {
    code: "ar" | "en";
    label: string;
    dir: LanguageDirection;
}[];
