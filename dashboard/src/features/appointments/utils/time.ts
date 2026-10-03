export const minutesToTimeLabel = (minutes: number, lang: "ar" | "en"): string => {
	const hour24 = Math.floor(minutes / 60);
	const mm = (minutes % 60).toString().padStart(2, "0");
	const isPm = hour24 >= 12;
	const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
	if (lang === "ar") {
		return `${hour12}:${mm} ${isPm ? "مساءً" : "صباحًا"}`;
	}
	return `${hour12}:${mm} ${isPm ? "PM" : "AM"}`;
};
