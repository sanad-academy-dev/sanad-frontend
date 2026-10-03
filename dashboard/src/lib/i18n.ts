import {
	DEFAULT_LANGUAGE,
	LANGUAGE_DIRECTION,
	LANGUAGES,
	type Language,
} from "@/lib/data/constants";
import ar from "@/locales/ar/translation.json";
import en from "@/locales/en/translation.json";

export type Translations = typeof ar;

export const getTranslations = (lang: Language): Translations => {
	if (!LANGUAGES.includes(lang)) {
		return DEFAULT_LANGUAGE === "en" ? en : ar;
	}

	return lang === "en" ? en : ar;
};

export const getDirection = (lang: Language) => {
	return LANGUAGE_DIRECTION[lang] ?? LANGUAGE_DIRECTION[DEFAULT_LANGUAGE];
};
