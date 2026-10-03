// مقاسات ورق الملصقات المدعومة — تُحدِّد حجم الصفحة عند الطباعة وتوزيع التكرارات.
// مقاسات شائعة لطابعات الملصقات الحرارية وورق A4 اللاصق.

export type LabelSheet = {
	id: string;
	label: string;
	/** قيمة @page size */
	page: string;
	labelWidthMm: number;
	labelHeightMm: number;
	/** أعمدة وصفوف الملصقات في الصفحة الواحدة */
	cols: number;
	rows: number;
	gapMm: number;
	/** هامش الصفحة */
	paddingMm: number;
};

export const LABEL_SHEETS: LabelSheet[] = [
	{
		id: "roll-62x29",
		label: "لفة حرارية — 62×29 مم (ملصق لكل صفحة)",
		page: "62mm 29mm",
		labelWidthMm: 62,
		labelHeightMm: 29,
		cols: 1,
		rows: 1,
		gapMm: 0,
		paddingMm: 1,
	},
	{
		id: "roll-62x100",
		label: "لفة حرارية — 62×100 مم (ملصق لكل صفحة)",
		page: "62mm 100mm",
		labelWidthMm: 62,
		labelHeightMm: 100,
		cols: 1,
		rows: 1,
		gapMm: 0,
		paddingMm: 2,
	},
	{
		id: "a4-70x37",
		label: "A4 لاصق — 24 ملصق (70×37 مم)",
		page: "A4",
		labelWidthMm: 70,
		labelHeightMm: 37,
		cols: 3,
		rows: 8,
		gapMm: 0,
		paddingMm: 5,
	},
	{
		id: "a4-38x21",
		label: "A4 لاصق — 65 ملصق (38×21 مم)",
		page: "A4",
		labelWidthMm: 38,
		labelHeightMm: 21,
		cols: 5,
		rows: 13,
		gapMm: 0,
		paddingMm: 5,
	},
];

export const labelsPerPage = (sheet: LabelSheet) => sheet.cols * sheet.rows;

export const pagesNeeded = (sheet: LabelSheet, count: number) =>
	Math.max(1, Math.ceil(count / labelsPerPage(sheet)));
