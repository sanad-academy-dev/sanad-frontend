import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import arTranslations from "@/locales/ar/translation.json";
import enTranslations from "@/locales/en/translation.json";

/**
 * [LY-P0] §18.5 — كنس i18n قبل كل خروج مرحلةٍ ذات واجهة.
 *
 * ما يمنعه: مفتاحٌ يُمرَّر إلى `t()` ولا وجود له في الحزمة يُرسَم **كما هو** — فيرى
 * المستخدم «loyalty.nav.program» بدل «برنامج الولاء». لا `typecheck` ولا `build` يمسك
 * ذلك، لأنّ `t()` تقبل أيّ نصّ.
 *
 * والوحدة عربية فقط (§0.5) فأكثر نصوصها مكتوب في الشيفرة مباشرةً؛ ما يمرّ عبر `t()` هنا
 * هو مفاتيح التنقّل وحدها، وهي تبقى ثنائية (سابقة `accounting.nav.*`، القاعدة ٥).
 */

const SCAN_DIRS = [
	"src/features/loyalty",
	"src/routes/_pathless-layout/management",
];

const walk = (dir: string): string[] => {
	const out: string[] = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...walk(full));
		else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
	}
	return out;
};

const lookup = (bundle: Record<string, unknown>, key: string): unknown =>
	key.split(".").reduce<unknown>((node, part) => {
		if (node && typeof node === "object" && part in node) {
			return (node as Record<string, unknown>)[part];
		}
		return undefined;
	}, bundle);

/** ملفات هذه الوحدة وحدها — لا نحاكم مفاتيح وحدةٍ أخرى تصادف وجودها في نفس المجلد. */
const loyaltyFiles = SCAN_DIRS.flatMap((dir) => walk(dir)).filter(
	(file) => file.includes("loyalty") || file.includes("Loyalty"),
);

describe("[LY-P0] §18.5 — كنس i18n على أسطح الولاء", () => {
	it("يجد ملفات الوحدة (حارسٌ على الحزمة نفسها)", () => {
		expect(loyaltyFiles.length).toBeGreaterThan(5);
	});

	it('كل مفتاح `t("loyalty.*")` أو `titleKey` موجودٌ في اللغتين', () => {
		const missing: string[] = [];
		for (const file of loyaltyFiles) {
			const source = readFileSync(file, "utf8");
			const keys = new Set<string>();
			for (const m of source.matchAll(/\bt\(\s*["'`]([a-zA-Z0-9_.]+)["'`]/g)) keys.add(m[1]);
			for (const m of source.matchAll(/titleKey:\s*["'`]([a-zA-Z0-9_.]+)["'`]/g))
				keys.add(m[1]);

			for (const key of keys) {
				for (const [lang, bundle] of [
					["ar", arTranslations],
					["en", enTranslations],
				] as const) {
					if (typeof lookup(bundle as Record<string, unknown>, key) !== "string") {
						missing.push(`${lang}: ${key}  (${file})`);
					}
				}
			}
		}
		expect(missing, `مفاتيح تُرسَم خامًا لأنّها غير معرَّفة:\n  ${missing.join("\n  ")}`).toEqual(
			[],
		);
	});

	it("لا نصّ إنجليزي معروض على شاشات الوحدة (§0.5 — عربية فقط)", () => {
		// نبحث عن نصوص JSX الظاهرة: `>Some English<` بحروف لاتينية وكلمتين فأكثر
		const offenders: string[] = [];
		for (const file of loyaltyFiles.filter((f) => f.endsWith(".tsx"))) {
			const source = readFileSync(file, "utf8");
			for (const m of source.matchAll(/>\s*([A-Za-z][A-Za-z ]{6,})\s*</g)) {
				offenders.push(`${file}: «${m[1].trim()}»`);
			}
		}
		expect(offenders, `نصّ إنجليزي ظاهر:\n  ${offenders.join("\n  ")}`).toEqual([]);
	});
});
