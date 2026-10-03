import { describe, expect, it } from "vitest";

import {
	formatAmount,
	formatDisplayDate,
	formatMoney,
	isPositiveAmount,
} from "@/features/accounting/utils/format-amount";

/**
 * [P5-UI-fix] The display formatter must match the legacy invoices table's output
 * (`1,150 ر.س`, `06/08/2026`) WITHOUT routing a Decimal(21,9) through a JS float (contract
 * C2). These cases pin both halves of that: the rendering, and the exactness.
 */

describe("formatAmount", () => {
	it("groups thousands like the reference table", () => {
		expect(formatAmount("1150")).toBe("1,150");
		expect(formatAmount("1150000")).toBe("1,150,000");
		expect(formatAmount("999")).toBe("999");
		expect(formatAmount("1000")).toBe("1,000");
	});

	it("drops the ledger's trailing zeros", () => {
		// Decimal(21,9) arrives as a 9-dp string; the reference shows at most 2
		expect(formatAmount("1150.000000000")).toBe("1,150");
		expect(formatAmount("1234.500000000")).toBe("1,234.5");
		expect(formatAmount("1234.560000000")).toBe("1,234.56");
	});

	it("rounds half-up at 2 dp", () => {
		expect(formatAmount("0.005")).toBe("0.01");
		expect(formatAmount("0.004")).toBe("0");
		expect(formatAmount("2.345")).toBe("2.35");
	});

	it("keeps precision a float would lose", () => {
		// 0.1 + 0.2 style drift never appears because the path is bigint-only
		expect(formatAmount("9007199254740993.12")).toBe("9,007,199,254,740,993.12");
		expect(formatAmount("0.070000000")).toBe("0.07");
	});

	it("handles zero, negatives and empties", () => {
		expect(formatAmount("0")).toBe("0");
		expect(formatAmount("0.000000000")).toBe("0");
		expect(formatAmount("-1150.5")).toBe("-1,150.5");
		expect(formatAmount(null)).toBe("0");
		expect(formatAmount(undefined)).toBe("0");
		expect(formatAmount("")).toBe("0");
	});

	it("never renders a signed zero", () => {
		expect(formatAmount("-0.001")).toBe("0");
	});
});

describe("formatMoney", () => {
	it("appends the currency the way the reference does", () => {
		expect(formatMoney("1150.000000000")).toBe("1,150 ر.س");
		expect(formatMoney("0")).toBe("0 ر.س");
	});
});

describe("isPositiveAmount", () => {
	it("is true only for a strictly positive balance", () => {
		expect(isPositiveAmount("1150.000000000")).toBe(true);
		expect(isPositiveAmount("0.000000001")).toBe(true);
		expect(isPositiveAmount("0")).toBe(false);
		expect(isPositiveAmount("0.000000000")).toBe(false);
		expect(isPositiveAmount("-5")).toBe(false);
		expect(isPositiveAmount(null)).toBe(false);
	});
});

describe("formatDisplayDate", () => {
	it("renders day-first with Latin digits", () => {
		expect(formatDisplayDate("2026-08-06T00:00:00.000Z")).toBe("06/08/2026");
		expect(formatDisplayDate("2026-12-31T00:00:00.000Z")).toBe("31/12/2026");
		expect(formatDisplayDate("2026-08-06")).toBe("06/08/2026");
	});

	it("does not shift a UTC-midnight posting date across the day boundary", () => {
		// A DATE column serializes as UTC midnight, so a viewer west of UTC must still see
		// the stored day. That holds because an ISO string is sliced literally and never
		// passed through `Date` — which this proves without touching the process timezone:
		// the time component below is not parseable, so anything routed through `Date`
		// would yield "—". Getting the date back means the string path was taken.
		//
		// (Setting process.env.TZ here instead would leak: TZ is process-global, and under
		// `bun test` every suite shares one process.)
		expect(formatDisplayDate("2026-08-06Tnot-a-real-time")).toBe("06/08/2026");
		expect(new Date("2026-08-06Tnot-a-real-time").getTime()).toBeNaN();
	});

	it("shows a dash rather than Invalid Date", () => {
		expect(formatDisplayDate(null)).toBe("—");
		expect(formatDisplayDate(undefined)).toBe("—");
		expect(formatDisplayDate("not-a-date")).toBe("—");
	});
});
