import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * [P13.5] Every declared `labelKey` must exist in BOTH locales.
 *
 * The pre-M3 audit's F10 found 24 `labelKey`s in `accounting-status.ts` that existed in
 * NEITHER locale file — dormant, because every screen read the hardcoded `.label` sibling
 * instead. That is the worst shape for a translation key: it looks done in the source, it
 * type-checks, it renders correctly in Arabic, and it would have produced the raw key string
 * («accounting.salesInvoice.status.paid») on screen the moment a screen actually used it.
 *
 * A key that no locale defines is not a translation — it is a promise nobody kept. This test
 * makes the promise checkable, and it reads the locale JSON rather than i18next so it holds
 * regardless of how the app initialises.
 */

const KEY_RE = /labelKey:\s*"([^"]+)"/g;

const readJson = (path: string): Record<string, unknown> =>
	JSON.parse(readFileSync(join(process.cwd(), path), "utf8"));

function lookup(tree: Record<string, unknown>, dotted: string): unknown {
	let cursor: unknown = tree;
	for (const part of dotted.split(".")) {
		if (typeof cursor !== "object" || cursor === null) return undefined;
		cursor = (cursor as Record<string, unknown>)[part];
	}
	return cursor;
}

describe("[P13.5] تكافؤ مفاتيح التسميات مع ملفّي اللغة", () => {
	const source = readFileSync(
		join(process.cwd(), "src/features/accounting/utils/accounting-status.ts"),
		"utf8",
	);
	const keys = [...new Set([...source.matchAll(KEY_RE)].map(([, key]) => key))];
	const ar = readJson("src/locales/ar/translation.json");
	const en = readJson("src/locales/en/translation.json");

	it("الاستخراج يجد مفاتيح فعلًا — لا فحص فارغ", () => {
		expect(keys.length).toBeGreaterThanOrEqual(24);
	});

	it("كل مفتاح معلن موجود في العربية", () => {
		const missing = keys.filter((key) => typeof lookup(ar, key) !== "string");
		expect(missing).toEqual([]);
	});

	it("كل مفتاح معلن موجود في الإنجليزية", () => {
		const missing = keys.filter((key) => typeof lookup(en, key) !== "string");
		expect(missing).toEqual([]);
	});

	it("لا ترجمة فارغة — مفتاح بقيمة فارغة يعرض فراغًا للمستخدم", () => {
		const blank: string[] = [];
		for (const key of keys) {
			for (const [lang, tree] of [
				["ar", ar],
				["en", en],
			] as const) {
				const value = lookup(tree, key);
				if (typeof value === "string" && value.trim() === "") blank.push(`${lang}:${key}`);
			}
		}
		expect(blank).toEqual([]);
	});
});
