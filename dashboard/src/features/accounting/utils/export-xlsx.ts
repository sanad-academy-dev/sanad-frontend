/**
 * [P9.5] XLSX export — owner-approved as a LAZY chunk (accountants ask for Excel; CSV
 * with UTF-8 BOM stays the default path). The `xlsx` library loads on first use via
 * dynamic import so it never weighs the main bundle (client-bundle guard).
 */

export async function downloadXlsx(
	fileName: string,
	sheetName: string,
	headers: string[],
	rows: (string | number)[][],
): Promise<void> {
	const XLSX = await import("xlsx");
	const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
	// RTL sheet so Arabic reads correctly in Excel
	sheet["!dir"] = "rtl";
	const book = XLSX.utils.book_new();
	if (book.Workbook === undefined) book.Workbook = {};
	book.Workbook.Views = [{ RTL: true }];
	XLSX.utils.book_append_sheet(book, sheet, sheetName.slice(0, 31));
	XLSX.writeFile(book, `${fileName}.xlsx`);
}
