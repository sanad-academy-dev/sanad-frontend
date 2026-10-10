import { describe, expect, it } from "vitest";

import { encodeCode128B } from "@/features/services/lab-tests/components/lab-barcode";

// قيم مرجعية من مواصفة Code128: البداية 104، والمحرف = ASCII − 32،
// وخانة التحقق = (104 + Σ code×position) mod 103، والإيقاف 106.

describe("Code128-B encoding", () => {
	it("wraps payload with start-B and stop codes", () => {
		const codes = encodeCode128B("A");
		expect(codes[0]).toBe(104);
		expect(codes.at(-1)).toBe(106);
	});

	it("maps ASCII to code values (ASCII − 32)", () => {
		// "A" = 65 → 33 ، "0" = 48 → 16
		expect(encodeCode128B("A")[1]).toBe(33);
		expect(encodeCode128B("0")[1]).toBe(16);
	});

	it("computes the mod-103 checksum over weighted positions", () => {
		// "AB": 104 + 33×1 + 34×2 = 205 → 205 mod 103 = 102
		const codes = encodeCode128B("AB");
		expect(codes).toEqual([104, 33, 34, 102, 106]);
	});

	it("encodes a realistic lab code", () => {
		const codes = encodeCode128B("LAB-004");
		// البداية + 7 محارف + تحقق + إيقاف
		expect(codes).toHaveLength(10);
		expect(codes[0]).toBe(104);
		expect(codes.at(-1)).toBe(106);
		// خانة التحقق ضمن المدى الصالح
		expect(codes.at(-2)).toBeGreaterThanOrEqual(0);
		expect(codes.at(-2)).toBeLessThan(103);
	});

	it("substitutes characters outside Code128-B with a space", () => {
		// حرف عربي خارج ASCII 32..126 → يُرمَّز كمسافة (0)
		expect(encodeCode128B("ب")[1]).toBe(0);
	});

	it("handles an empty payload without crashing", () => {
		// البداية + تحقق (= البداية) + إيقاف
		expect(encodeCode128B("")).toEqual([104, 1, 106]);
	});
});
