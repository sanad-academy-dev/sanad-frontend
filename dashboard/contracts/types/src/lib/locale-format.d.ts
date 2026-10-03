import type { Language } from "@/lib/data/constants";
export declare const getIntlLocale: (lang: Language) => "en-US" | "ar-SA";
export declare const getDateFormatter: (lang: Language, options: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat;
