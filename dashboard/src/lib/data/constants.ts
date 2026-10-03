export const LANGUAGES = ["ar", "en"] as const;
export type Language = (typeof LANGUAGES)[number];
export type LanguageDirection = "rtl" | "ltr";

export const DEFAULT_LANGUAGE: Language = "ar";

export const LANGUAGE_LABELS: Record<Language, string> = {
	ar: "العربية",
	en: "الانجليزية",
};

export const LANGUAGE_DIRECTION: Record<Language, LanguageDirection> = {
	ar: "rtl",
	en: "ltr",
};

export const LANGUAGE_OPTIONS = LANGUAGES.map((code) => ({
	code,
	label: LANGUAGE_LABELS[code],
	dir: LANGUAGE_DIRECTION[code],
}));
