import type { WorkBook, WorkSheet } from "xlsx";

export interface ExportExcelOptions {
	/** اسم الملف الناتج (بدون امتداد .xlsx، سيضاف التاريخ تلقائياً) */
	fileName: string;
	/** اسم ورقة العمل داخل ملف الإكسل (بحد أقصى 31 حرفاً) */
	sheetName?: string;
	/** عناوين الأعمدة (رأس الجدول) */
	headers: string[];
	/** مصفوفة الصفوف والبيانات */
	rows: (string | number | boolean | null | undefined)[][];
	/** مقاسات مخصصة للأعمدة إن وجدت (عدد الحروف التقريبي) */
	columnWidths?: number[];
}

/**
 * دالة تصدير بيانات موحدة إلى ملف إكسل رسمي (.xlsx)
 * - تدعم اللغة العربية والاتجاه من اليمين إلى اليسار (RTL) بشكل أصيل
 * - تضبط عرض الأعمدة تلقائياً وفقاً لأطول قيمة لمنع تداخل أو اقتطاع النصوص
 * - تحافظ على أرقام الهواتف والهويات كقيم نصية لمنع إكسل من حذف الصفر الأول
 * - تفعل ميزة الفرز والتصفية التلقائية (AutoFilter) في رأس الجدول
 * - يتم استدعاء مكتبة xlsx بشكل ديناميكي (Lazy dynamic import) للحفاظ على خفة الحزمة
 */
export async function downloadExcel({
	fileName,
	sheetName = "البيانات",
	headers,
	rows,
	columnWidths,
}: ExportExcelOptions): Promise<void> {
	const XLSX = await import("xlsx");

	// معالجة البيانات وضمان التعامل السليم مع القيم الخالية والمنطقية
	const formattedRows = rows.map((row) =>
		row.map((cell) => {
			if (cell === null || cell === undefined) return "";
			if (typeof cell === "boolean") return cell ? "نعم" : "لا";
			return cell;
		}),
	);

	// إنشاء ورقة العمل
	const sheet: WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...formattedRows], {
		cellDates: false,
	});

	// 1. حساب أبعاد الأعمدة تلقائياً مع هامش إضافي للخطوط العربية
	const cols = headers.map((header, colIdx) => {
		if (columnWidths && columnWidths[colIdx]) {
			return { wch: columnWidths[colIdx] };
		}

		let maxLen = (header || "").length;
		for (const row of formattedRows) {
			const cellVal = row[colIdx];
			if (cellVal !== undefined && cellVal !== null) {
				const str = String(cellVal);
				if (str.length > maxLen) {
					maxLen = str.length;
				}
			}
		}

		// إضافة هامش مناسب للمحتوى العربي بحد أدنى 13 حرفاً وحد أقصى 55 حرفاً
		const wch = Math.min(Math.max(maxLen + 4, 13), 55);
		return { wch };
	});
	sheet["!cols"] = cols;

	// 2. تفعيل الاتجاه من اليمين لليسار للورقة (RTL)
	sheet["!dir"] = "rtl";
	(sheet as any)["!views"] = [{ rightToLeft: true }];

	// 3. تفعيل أزرار التصفية في الإكسل (AutoFilter) على رأس الجدول
	if (headers.length > 0 && formattedRows.length > 0) {
		const lastCol = XLSX.utils.encode_col(headers.length - 1);
		const lastRow = formattedRows.length + 1; // 1-indexed مع صف الرأس
		sheet["!autofilter"] = { ref: `A1:${lastCol}${lastRow}` };
	}

	// 4. إنشاء المصنف وتحديد خصائص الرؤية
	const workbook: WorkBook = XLSX.utils.book_new();
	if (!workbook.Workbook) {
		workbook.Workbook = {};
	}
	workbook.Workbook.Views = [{ RTL: true }];

	// تنظيف اسم ورقة العمل ليطابق متطلبات إكسل (أقل من 31 حرف ولا يحوي رموز ممنوعة)
	const cleanSheetName = sheetName.replace(/[\\/?*:[\]]/g, "-").slice(0, 31) || "البيانات";
	XLSX.utils.book_append_sheet(workbook, sheet, cleanSheetName);

	// 5. توليد اسم الملف النظيف مع تاريخ اليوم
	const today = new Date().toISOString().slice(0, 10);
	const cleanBaseName = fileName.replace(/[\\/:*?"<>|]/g, "-");
	const finalFileName = `${cleanBaseName}-${today}.xlsx`;

	// 6. تحميل الملف للمتصفح
	XLSX.writeFile(workbook, finalFileName, { bookType: "xlsx" });
}
