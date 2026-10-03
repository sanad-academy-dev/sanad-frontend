import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * [P12.11] PDF export for the financial statements — via the BROWSER'S OWN print pipeline,
 * deliberately, and this choice is worth stating because it looks like a shortcut and is not.
 *
 * A JS PDF library (jsPDF, pdfmake) cannot render this content correctly without an embedded
 * Arabic font (~1MB+ on a bundle the client-bundle guard exists to protect) AND its own
 * right-to-left shaping — two failure modes that show up as mangled Arabic in the accountant's
 * hands, not in CI. `window.print()` uses the same engine that already renders the screen, so
 * Arabic, RTL, fonts and column widths are right for free, and the browser's print dialog has
 * "Save as PDF" in every target we support.
 *
 * The honest limitation, stated rather than buried: this produces a print dialog, not a file
 * written to disk. An operator who wants a PDF picks "Save as PDF" there. Automating that
 * (headless render on the server) is a different task with a real cost, and no one has asked.
 *
 * The `#report-print-root` mechanism is the one [P9.x] already uses for radiology reports:
 * the document is portaled to <body> so no ancestor's transform, fixed height or inner scroll
 * can clip it, and siblings are hidden with `display` rather than `visibility` — the latter
 * keeps the space and emits blank pages.
 */

export type PrintableReport = {
	title: string;
	/** the range/scope line under the title — what makes the sheet self-describing */
	subtitle?: string;
	headers: string[];
	rows: (string | number)[][];
	/** rows rendered bold — totals and subtotals */
	emphasizedRowIndexes?: number[];
};

const ReportPrintDocument = ({ report }: { report: PrintableReport }) => {
	const emphasized = new Set(report.emphasizedRowIndexes ?? []);
	return (
		<div
			id="report-print-root"
			dir="rtl"
		>
			<div style={{ marginBottom: "8mm" }}>
				<h1 style={{ fontSize: "16pt", fontWeight: 600, margin: 0 }}>{report.title}</h1>
				{report.subtitle && (
					<p style={{ fontSize: "10pt", color: "#555", margin: "2mm 0 0" }}>
						{report.subtitle}
					</p>
				)}
			</div>
			<table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10pt" }}>
				<thead>
					<tr>
						{report.headers.map((header, index) => (
							<th
								key={header}
								style={{
									textAlign: index === 0 ? "start" : "end",
									borderBottom: "1px solid #111",
									padding: "2mm 1mm",
									whiteSpace: "nowrap",
								}}
							>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{report.rows.map((row, rowIndex) => (
						<tr
							// الصفوف قد تتكرّر نصًّا (حسابان بالاسم نفسه تحت أبوين مختلفين)،
							// فالفهرس هو المفتاح الصادق هنا لا محتوى الصف
							key={`row-${rowIndex}`}
							style={{ fontWeight: emphasized.has(rowIndex) ? 600 : 400 }}
						>
							{row.map((cell, cellIndex) => (
								<td
									key={`cell-${rowIndex}-${cellIndex}`}
									style={{
										textAlign: cellIndex === 0 ? "start" : "end",
										borderBottom: "0.5px solid #ddd",
										padding: "1.5mm 1mm",
										whiteSpace: cellIndex === 0 ? "normal" : "nowrap",
									}}
								>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

/**
 * Renders the print copy, prints it, then unmounts it. The document must be IN the DOM before
 * `window.print()` is called, which is why this is a render pass and a layout effect rather
 * than a plain function — printing from a click handler that also mounts the node prints the
 * page without it.
 */
export const useReportPrint = () => {
	const [pending, setPending] = useState<PrintableReport | null>(null);

	useEffect(() => {
		if (!pending) return;
		// إطارٌ واحد ليُثبِّت المتصفّح التخطيط قبل فتح حوار الطباعة؛ بدونه تخرج
		// الصفحة أحيانًا بجدول بلا عرض محسوب
		const frame = requestAnimationFrame(() => {
			window.print();
			setPending(null);
		});
		return () => cancelAnimationFrame(frame);
	}, [pending]);

	const printDocument =
		pending && typeof document !== "undefined"
			? createPortal(<ReportPrintDocument report={pending} />, document.body)
			: null;

	return { printDocument, printReport: setPending };
};
