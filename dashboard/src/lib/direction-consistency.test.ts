import { describe, expect, it } from "vitest";

import { LANGUAGES } from "@/lib/data/constants";
import { getDirection } from "@/lib/i18n";

/**
 * The document direction and the `isRtl` flag must never disagree.
 *
 * WHY THIS EXISTS: they DID disagree, and the consequence was not cosmetic. `useI18n` derives
 * `isRtl` from the language and the sidebar picks its side from that — but it positions itself
 * with PHYSICAL `left-0`/`right-0`. When the language switched to English while
 * `document.documentElement.dir` stayed `"rtl"` (React does not re-patch attributes on the
 * `<html>` of a client-rendered shell), the sidebar moved to the physical left while the page
 * was still laid out RTL. It landed on top of every table's `align: "end"` column: the invoice
 * screens' entire actions column and the «فاتورة جديدة» button became unclickable, with the
 * click hitting a sidebar link instead. The owner's UI pass measured it — the same x=21 was
 * reachable in Arabic and not in English.
 *
 * The root cause is fixed by syncing the real element in `__root.tsx`. This test pins the
 * SMALLER invariant underneath it: for every language, `isRtl` and the direction agree. If a
 * third language is ever added with the two derived from different tables, this fails.
 */

/** the exact rule `useI18n` uses — duplicated here on purpose, so drift is what fails */
const isRtlFor = (lang: string) => lang === "ar";

describe("اتجاه المستند ومؤشّر RTL لا يختلفان أبدًا", () => {
	it("كل لغة مسجّلة لها اتجاه معروف", () => {
		for (const lang of LANGUAGES) {
			expect(["rtl", "ltr"]).toContain(getDirection(lang));
		}
	});

	it("`isRtl` يطابق الاتجاه لكل لغة", () => {
		for (const lang of LANGUAGES) {
			expect(isRtlFor(lang), `اختلاف على «${lang}»`).toBe(getDirection(lang) === "rtl");
		}
	});

	it("العربية rtl والإنجليزية ltr — الحالتان اللتان تُقاسان فعلًا", () => {
		expect(getDirection("ar")).toBe("rtl");
		expect(getDirection("en")).toBe("ltr");
	});
});
