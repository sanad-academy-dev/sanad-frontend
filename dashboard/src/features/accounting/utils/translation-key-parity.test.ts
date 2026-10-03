import { readFileSync } from "node:fs";
import { join } from "node:path";

import { globSync } from "tinyglobby";
import { describe, expect, it } from "vitest";

/**
 * Every `t("…")` key rendered by an accounting/MI screen must exist in BOTH locales.
 *
 * Found in local product-owner review on the Membership & Insurance branch: the accounts
 * settings screen rendered its two footer buttons as the raw strings «common.save» and
 * «common.cancel», and its account-picker empty state as «common.noResults». None of the
 * three keys existed in either locale file — `common` only ever had `common.actions.*` and
 * `common.states.*`, so those paths could never resolve. i18next falls back to echoing the
 * key, which type-checks, renders, and reads as a bug only to a human looking at the screen.
 *
 * This is the sibling of the [P13.5] `labelKey` parity test: same failure mode, different
 * carrier. That one guards declared `labelKey`s in `accounting-status.ts`; this one guards
 * the keys the accounting screens actually call `t()` with — which is where the defect that
 * prompted it lived.
 *
 * Scope is `src/features/accounting/**` on purpose: it covers every accounting and MI
 * screen, and keeps the test honest about a pre-existing unresolved key elsewhere in the
 * app (`auth.forgetPassword.errors.sendSuccess`) that is not this module's to fix.
 *
 * Only string literals are checked. `t(variable)` and template literals are skipped —
 * unknowable statically, and inventing a guess would be worse than the gap.
 */

const T_CALL_RE = /\bt\(\s*"([A-Za-z0-9_.-]+)"/g;

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

describe("تكافؤ مفاتيح الترجمة في شاشات المحاسبة والعضويات والتأمين", () => {
	const ar = readJson("src/locales/ar/translation.json");
	const en = readJson("src/locales/en/translation.json");

	const files = globSync("src/features/accounting/**/*.{ts,tsx}", {
		cwd: process.cwd(),
	}).filter((file) => !file.includes(".test."));

	const references = files.flatMap((file) => {
		const source = readFileSync(join(process.cwd(), file), "utf8");
		return [...source.matchAll(T_CALL_RE)]
			.map(([, key]) => key)
			.filter((key) => key.includes("."))
			.map((key) => ({ key, file }));
	});

	it("تجد الاختبارُ مفاتيحَ فعليةً لتفحصها (حارس ضد قالب بحث معطوب)", () => {
		expect(files.length).toBeGreaterThan(50);
		expect(references.length).toBeGreaterThan(20);
	});

	it("كل مفتاح مستخدَم موجود في الملفّ العربي", () => {
		const missing = references.filter(({ key }) => lookup(ar, key) === undefined);
		expect(missing.map((m) => `${m.key} ← ${m.file}`)).toEqual([]);
	});

	it("كل مفتاح مستخدَم موجود في الملفّ الإنجليزي", () => {
		const missing = references.filter(({ key }) => lookup(en, key) === undefined);
		expect(missing.map((m) => `${m.key} ← ${m.file}`)).toEqual([]);
	});
});
