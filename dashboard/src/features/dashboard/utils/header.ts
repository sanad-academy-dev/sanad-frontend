import type { TFunction } from "i18next";
import type { Language } from "@/lib/data/constants";
import { getDateFormatter } from "@/lib/locale-format";

export const getGreeting = (date: Date, t: TFunction) => {
	const hour = date.getHours();
	if (hour < 12) {
		return t("dashboard.header.goodMorning");
	}

	return t("dashboard.header.goodEvening");
};

export const formatHeaderDate = (date: Date, lang: Language) =>
	getDateFormatter(lang, {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
