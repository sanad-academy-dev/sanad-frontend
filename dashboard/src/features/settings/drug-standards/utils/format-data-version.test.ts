import { describe, expect, it } from "vitest";

import { formatDataVersion } from "@/features/settings/drug-standards/utils/format-data-version";

describe("formatDataVersion", () => {
	it("renders the Date that Eden Treaty revives from the wire string", () => {
		// the real regression: rendering this Date raw crashed the standard page
		expect(formatDataVersion(new Date("2026-08-12T00:00:00.000Z"))).toBe("2026-08-12");
	});

	it("passes a plain wire string through", () => {
		expect(formatDataVersion("2026-08-12")).toBe("2026-08-12");
	});

	it("trims a full ISO string to the day", () => {
		expect(formatDataVersion("2026-08-12T03:00:00.000Z")).toBe("2026-08-12");
	});

	it("never renders an object for missing or invalid input", () => {
		expect(formatDataVersion(null)).toBe("—");
		expect(formatDataVersion(undefined)).toBe("—");
		expect(formatDataVersion(new Date("nonsense"))).toBe("—");
	});
});
