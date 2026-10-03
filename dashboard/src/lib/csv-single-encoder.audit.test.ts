import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * ONE CSV encoder, enforced (pre-M3 audit F9, structural half).
 *
 * The injection defect was not interesting on its own — eight lines, one regex. What made it
 * a finding is that it existed FOUR TIMES: accounting, staff, jobs and training each carried
 * a verbatim copy, so a fix applied to one would leave three exports vulnerable and nobody
 * would notice, because each copy looked locally correct.
 *
 * Deleting the copies fixes today. This test fixes tomorrow: the next person exporting a new
 * screen will copy the nearest existing exporter, and if that copy reintroduces its own
 * `new Blob([...], "text/csv")` this fails with the file name in the message. The right move
 * is always `downloadCsv` from `@/lib/csv`, which is quoted, injection-escaped, BOM-prefixed
 * and tested.
 *
 * It is a CRUDE grep, deliberately: a precise check would need a parser and would rot, while
 * this one cannot be fooled by accident and points straight at the file to read. `ALLOWED`
 * is the escape hatch and every entry needs a reason — an exemption is a decision, and
 * recording why is what stops the list becoming a place to make failures disappear.
 */

const SRC = join(process.cwd(), "src");

/** building a CSV payload by hand — the thing that must live in exactly one place */
const CSV_BLOB_RE = /text\/csv/;

/** file (relative to src/) → why it may name text/csv itself */
const ALLOWED: Record<string, string> = {
	"lib/csv.ts": "the one encoder — this is the file everything else must use",
	"lib/csv-single-encoder.audit.test.ts": "this audit itself",
	"features/accounting/chart-of-accounts/components/account-import-dialog.tsx":
		"READS a user-picked .csv for import — the accept filter, not an export",
};

function walk(dir: string): string[] {
	const found: string[] = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === "generated" || entry.name === "node_modules") continue;
			found.push(...walk(full));
		} else if ([".ts", ".tsx"].includes(extname(entry.name))) {
			found.push(full);
		}
	}
	return found;
}

describe("CSV: مُرمِّز واحد لا أربعة (F9)", () => {
	const offenders = walk(SRC)
		.filter((file) => CSV_BLOB_RE.test(readFileSync(file, "utf8")))
		.map((file) => relative(SRC, file).split("\\").join("/"))
		.filter((file) => !(file in ALLOWED));

	it("لا ملف خارج القائمة المصرَّح بها يبني CSV بنفسه", () => {
		expect(offenders).toEqual([]);
	});

	it("الفحص يرى شيئًا فعلًا — لا اختبار فارغ يمرّ بلا معنى", () => {
		// لو تغيّر مسار المُرمِّز ولم يعد أحد يذكر text/csv، فالفحص يحرس فراغًا. العدد
		// المتوقَّع هو المصرَّح بهم بالضبط، لأن المخالفين صفر — فأي انحراف في الاتجاهين
		// يعني أن ما يفحصه هذا الملف لم يعد ما يظنّه
		const seen = walk(SRC).filter((file) => CSV_BLOB_RE.test(readFileSync(file, "utf8")));
		expect(seen).toHaveLength(Object.keys(ALLOWED).length);
	});
});
