import { describe, expect, it } from "vitest";

import { getInboxInsight } from "@/features/inbox/utils/inbox-insight";

const friday = new Date("2026-07-24T10:00:00");
const saturday = new Date("2026-07-25T10:00:00");
const wednesday = new Date("2026-07-22T10:00:00");

describe("getInboxInsight", () => {
	it("returns the upcoming-peak prediction on a normal day", () => {
		expect(getInboxInsight(wednesday, 10)).toBe(
			"تم توقع أوقات الذروة القادمة أيام الجمعة والسبت",
		);
	});

	it("flags Friday and Saturday as peak days", () => {
		expect(getInboxInsight(friday, 0)).toBe(
			"اليوم من أوقات الذروة المتوقعة — أيام الجمعة والسبت",
		);
		expect(getInboxInsight(saturday, 0)).toBe(
			"اليوم من أوقات الذروة المتوقعة — أيام الجمعة والسبت",
		);
	});

	it("flags any day whose scheduled visits cross the threshold", () => {
		expect(getInboxInsight(wednesday, 61)).toBe(
			"ذروة متوقعة اليوم: تجاوزت الزيارات المجدولة 60 زيارة (61 زيارة)",
		);
	});

	it("does not flag exactly 60 scheduled visits", () => {
		expect(getInboxInsight(wednesday, 60)).toBe(
			"تم توقع أوقات الذروة القادمة أيام الجمعة والسبت",
		);
	});

	it("prefers the threshold message over the peak-day message", () => {
		expect(getInboxInsight(friday, 70)).toBe(
			"ذروة متوقعة اليوم: تجاوزت الزيارات المجدولة 60 زيارة (70 زيارة)",
		);
	});
});
