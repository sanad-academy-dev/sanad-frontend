import { describe, expect, it } from "vitest";

import {
	diffAmountStrings,
	fromNano,
	sumAmountStrings,
	toNano,
} from "@/features/accounting/utils/amount-strings";

/**
 * [M2-fix] CI lock for the signed-amount class of bug: `toNano` used to reject negative
 * strings and silently return 0n, so a negative term fed to `sumAmountStrings` vanished —
 * the payment sheet's unallocated ribbon never decreased and open credit/debit notes
 * didn't subtract from the «المستحق» stats. Signed inputs are now first-class.
 */

describe("toNano / fromNano", () => {
	it("round-trips positive, negative and fractional amounts", () => {
		for (const value of [
			"0",
			"1",
			"1150",
			"0.5",
			"1234.567890123",
			"-1",
			"-0.5",
			"-1150.25",
		]) {
			expect(fromNano(toNano(value))).toBe(value);
		}
		// trailing zeros normalize away; "-0" collapses to "0"
		expect(fromNano(toNano("1.50"))).toBe("1.5");
		expect(fromNano(toNano("-0"))).toBe("0");
	});

	it("parses the sign against the WHOLE magnitude (not just the integer part)", () => {
		// BigInt("-1")*NANO + frac would give -0.5 instead of -1.5
		expect(toNano("-1.5")).toBe(-1_500_000_000n);
		expect(fromNano(toNano("-1.5"))).toBe("-1.5");
	});

	it("still returns 0n for garbage, empty and over-precise input", () => {
		for (const value of ["", "abc", "1.2.3", "1e5", "--5", "1.1234567891", null, undefined]) {
			expect(toNano(value)).toBe(0n);
		}
	});
});

describe("sumAmountStrings", () => {
	it("subtracts negative terms instead of dropping them", () => {
		// the exact shape of the old bug: sum(["100","-40"]) returned "100"
		expect(sumAmountStrings(["100", "-40"])).toBe("60");
	});

	it("handles an all-negative and a net-negative mix (open credit notes)", () => {
		expect(sumAmountStrings(["-150", "-50.5"])).toBe("-200.5");
		expect(sumAmountStrings(["1000", "-150", "-950"])).toBe("-100");
	});

	it("stays exact where floats would not", () => {
		expect(sumAmountStrings(["0.1", "0.2", "-0.3"])).toBe("0");
	});
});

describe("diffAmountStrings", () => {
	it("Σa − Σb, signed result allowed", () => {
		expect(diffAmountStrings(["500"], ["120", "80"])).toBe("300");
		expect(diffAmountStrings(["100"], ["150"])).toBe("-50");
	});

	it("a negative allocation (credit-note reference) INCREASES the remainder", () => {
		// paid 500, allocations +200 and −50 → unallocated 350
		expect(diffAmountStrings(["500"], ["200", "-50"])).toBe("350");
	});
});
