import i18n from "i18next";
import { useCallback } from "react";
import { initReactI18next, useTranslation } from "react-i18next";
import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from "@/lib/data/constants";
import ar from "@/locales/ar/translation.json";
import en from "@/locales/en/translation.json";

const resources = {
	ar: { translation: ar },
	en: { translation: en },
} as const;

const LOCALE_COOKIE = "locale";

const isLanguage = (value: string | undefined): value is Language =>
	!!value && (LANGUAGES as readonly string[]).includes(value);

const readLocaleCookie = (): Language => {
	if (typeof document === "undefined") return DEFAULT_LANGUAGE;
	const match = document.cookie.split("; ").find((c) => c.startsWith(`${LOCALE_COOKIE}=`));
	const raw = match?.split("=")[1];
	return isLanguage(raw) ? raw : DEFAULT_LANGUAGE;
};

const writeLocaleCookie = (lang: Language) => {
	if (typeof document === "undefined") return;
	// biome-ignore lint/suspicious/noDocumentCookie: intentional locale persistence
	document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
};

if (!i18n.isInitialized) {
	const initialLang = readLocaleCookie();
	void i18n.use(initReactI18next).init({
		resources,
		lng: initialLang,
		fallbackLng: DEFAULT_LANGUAGE,
		supportedLngs: LANGUAGES as unknown as string[],
		defaultNS: "translation",
		interpolation: {
			escapeValue: false,
		},
	});
	writeLocaleCookie(initialLang);
}

const normalizeLanguage = (language?: string): Language =>
	isLanguage(language) ? language : DEFAULT_LANGUAGE;

export const useI18n = () => {
	const { t, i18n, ready } = useTranslation("translation", {
		useSuspense: false,
	});

	const lang = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

	const setLang = useCallback(
		(newLanguage: Language) => {
			if (!isLanguage(newLanguage)) return;
			writeLocaleCookie(newLanguage);
			i18n.changeLanguage(newLanguage).catch((error) => {
				console.error(`Failed to change language to ${newLanguage}:`, error);
			});
		},
		[i18n],
	);

	return {
		t,
		i18n,
		setLang,
		lang,
		isTranslating: !ready,
		isRtl: lang === "ar",
	};
};
