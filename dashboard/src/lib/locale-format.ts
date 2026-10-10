import type { Language } from "@/lib/data/constants";

export const getIntlLocale = (lang: Language) => (lang === "ar" ? "ar-SA" : "en-US");

export const getDateFormatter = (lang: Language, options: Intl.DateTimeFormatOptions) =>
	new Intl.DateTimeFormat(getIntlLocale(lang), options);
