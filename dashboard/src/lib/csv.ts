/**
 * The app's ONE CSV encoder. Every export goes through it.
 *
 * It exists because there were four of them — accounting, staff, jobs, training — each a
 * verbatim copy of the same eight-line `cell()`, and each carrying the same defect
 * (pre-M3 audit F9). Fixing a copy-pasted vulnerability in one copy is how three of them stay
 * vulnerable, so the copies are gone and this is the only encoder left.
 *
 * ── FORMULA INJECTION IS THE REASON THIS FILE HAS TESTS ───────────────────────────────────
 *
 * Excel, LibreOffice and Google Sheets evaluate a cell that begins with `=`, `+`, `@`, a tab
 * or a carriage return. Every column exported here is user-controlled somewhere — a party
 * name, an item name, a voucher remark — so a customer literally named
 * `=HYPERLINK("http://evil","فاتورتك")` becomes a live link in the accountant's spreadsheet,
 * and the classic `=cmd|'/c calc'!A0` payload is worse. The export is a file the clinic opens
 * on its own machine, which is exactly the trust boundary that makes this worth fixing.
 *
 * The mitigation is to prefix the dangerous cell with a single quote inside a quoted field.
 * Excel shows the text and does not evaluate it.
 *
 * ── AND WHY NUMBERS ARE EXEMPTED, DELIBERATELY ────────────────────────────────────────────
 *
 * The naive rule "escape anything starting with = + - @" breaks every money column in the
 * product: `-500` would export as `'-500` and stop being a number in the sheet, so the
 * accountant's SUM silently drops the credit notes. A leading `-` or `+` on a well-formed
 * number is not a formula, so numbers pass through untouched and only genuine formula
 * candidates are escaped. That distinction is the whole reason this needs a test rather than
 * a one-line regex nobody re-reads.
 */

/** a cell that is a plain number is never a formula — `-500` must stay summable */
const NUMERIC = /^[-+]?\d+(\.\d+)?$/;
/** the characters spreadsheet applications treat as "this cell is an expression" */
const FORMULA_LEAD = /^[=+\-@\t\r]/;

/** Encode ONE value as a CSV field: injection-escaped, then quoted if it needs to be. */
export function csvCell(value: string | number | null | undefined): string {
	const raw = value == null ? "" : String(value);
	const dangerous = FORMULA_LEAD.test(raw) && !NUMERIC.test(raw);
	// the leading quote is what stops evaluation; the field must then be quoted so the
	// quote itself survives the round trip
	const text = dangerous ? `'${raw}` : raw;
	return dangerous || /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** UTF-8 BOM — without it Excel reads Arabic as mojibake, which is the whole point of the file */
export const CSV_BOM = "﻿";

/**
 * The complete document text, BOM included. Separated from the download so the encoding
 * contract can be tested without a DOM — the part that can be wrong is the part above, and it
 * was untestable while it lived inside a function that touches `document`.
 */
export function toCsv(
	headers: readonly (string | number | null | undefined)[],
	rows: readonly (readonly (string | number | null | undefined)[])[],
): string {
	const lines = [headers, ...rows].map((row) => row.map(csvCell).join(","));
	return `${CSV_BOM}${lines.join("\r\n")}`;
}

export const isoDay = (value: Date | string | null | undefined): string =>
	value ? new Date(value).toISOString().slice(0, 10) : "";

/**
 * Build the file and hand it to the browser.
 *
 * The object URL is revoked on the next tick rather than synchronously: `a.click()` only
 * STARTS the download, and revoking in the same frame races it — some browsers end up saving
 * an empty file. One `setTimeout` is the standard fix and costs nothing.
 */
export function downloadCsv(
	baseName: string,
	headers: readonly (string | number | null | undefined)[],
	rows: readonly (readonly (string | number | null | undefined)[])[],
): void {
	const blob = new Blob([toCsv(headers, rows)], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = `${baseName}-${isoDay(new Date())}.csv`;
	anchor.click();
	setTimeout(() => URL.revokeObjectURL(url), 0);
}
