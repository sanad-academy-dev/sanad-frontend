import { describe, expect, it } from "vitest";

import { CSV_BOM, csvCell, toCsv } from "@/lib/csv";

/**
 * The CSV encoding contract (pre-M3 audit F9).
 *
 * TWO THINGS ARE BEING PINNED, AND THEY PULL AGAINST EACH OTHER.
 *
 * The first is formula injection: a party name beginning with `=`, `+`, `@`, a tab or a CR
 * is executed by Excel and Sheets when the clinic opens the file it just exported. Every
 * exported column is user-controlled somewhere, so this is not theoretical.
 *
 * The second is that the OBVIOUS fix breaks money. "Escape anything starting with = + - @"
 * turns `-500` into `'-500`, which stops being a number in the sheet — so the accountant's
 * SUM silently drops every credit note, and the export becomes wrong in a way nobody notices
 * until a total disagrees. Numbers are therefore exempted, and that exemption is exactly what
 * a future "hardening" pass would delete without a test standing in front of it.
 */

describe("CSV: حقن الصيغ", () => {
	it("يُحيَّد ما يبدأ بـ = أو + أو @ أو جدولة", () => {
		for (const payload of [
			'=HYPERLINK("http://evil","فاتورتك")',
			"=cmd|'/c calc'!A0",
			"+SUM(A1:A9)",
			"@SUM(1)",
			"\tleading-tab",
		]) {
			const encoded = csvCell(payload);
			// مقتبس ومسبوق بعلامة اقتباس مفردة — إكسل يعرض النصّ ولا ينفّذه
			expect(encoded.startsWith("\"'")).toBe(true);
			expect(encoded.endsWith('"')).toBe(true);
		}
	});

	it("الأرقام السالبة والموجبة تمرّ كما هي — وإلّا انكسر كل عمود مال", () => {
		expect(csvCell("-500")).toBe("-500");
		expect(csvCell("+500")).toBe("+500");
		expect(csvCell("-1234.56")).toBe("-1234.56");
		expect(csvCell(-500)).toBe("-500");
		expect(csvCell(0)).toBe("0");
	});

	it("نصّ يبدأ بشرطة وليس رقمًا يُحيَّد — «-» ليست دائمًا سالبًا", () => {
		expect(csvCell("-A1")).toBe('"\'-A1"');
		expect(csvCell("--")).toBe('"\'--"');
	});

	it("علامة الاقتباس المفردة نفسها تنجو من الرحلة", () => {
		// الحقل مقتبس، والاقتباسات الداخلية مضاعفة — وإلّا فسد الملف عند القراءة
		expect(csvCell('=a"b')).toBe('"\'=a""b"');
	});
});

describe("CSV: الاقتباس والترميز", () => {
	it("يُقتبس ما يحوي فاصلة أو سطرًا جديدًا أو اقتباسًا", () => {
		expect(csvCell("a,b")).toBe('"a,b"');
		expect(csvCell("a\nb")).toBe('"a\nb"');
		expect(csvCell('a"b')).toBe('"a""b"');
	});

	it("النصّ العادي لا يُقتبس بلا داع", () => {
		expect(csvCell("أكاديمية النور")).toBe("أكاديمية النور");
		expect(csvCell("SINV-2026-00001")).toBe("SINV-2026-00001");
	});

	it("الفارغ والمعدوم يصيران حقلًا فارغًا لا «null»", () => {
		expect(csvCell(null)).toBe("");
		expect(csvCell(undefined)).toBe("");
		expect(csvCell("")).toBe("");
	});
});

describe("CSV: المستند", () => {
	it("يبدأ بعلامة ترتيب البايتات — بدونها تُقرأ العربية في إكسل رموزًا", () => {
		const csv = toCsv(["الاسم"], [["أكاديمية النور"]]);
		expect(csv.startsWith(CSV_BOM)).toBe(true);
	});

	it("الأسطر تُفصل بـ CRLF والحقول بفاصلة", () => {
		const csv = toCsv(
			["a", "b"],
			[
				["1", "2"],
				["3", "4"],
			],
		);
		expect(csv).toBe(`${CSV_BOM}a,b\r\n1,2\r\n3,4`);
	});

	it("رأس الجدول يمرّ بالترميز نفسه — العنوان ليس محلّ ثقة أكثر من الخلية", () => {
		const csv = toCsv(["=BAD"], [["ok"]]);
		expect(csv).toBe(`${CSV_BOM}"'=BAD"\r\nok`);
	});

	it("مستند بلا صفوف يبقى مستندًا صالحًا برأسه", () => {
		expect(toCsv(["a", "b"], [])).toBe(`${CSV_BOM}a,b`);
	});
});
