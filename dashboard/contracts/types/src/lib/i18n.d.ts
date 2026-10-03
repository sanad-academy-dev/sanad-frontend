import { type Language } from "@/lib/data/constants";
import ar from "@/locales/ar/translation.json";
export type Translations = typeof ar;
export declare const getTranslations: (lang: Language) => Translations;
export declare const getDirection: (lang: Language) => import("@/lib/data/constants").LanguageDirection;
