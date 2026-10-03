import { type InvoiceListItemResponse, invoiceSubject } from "@sanad/contracts/runtime/server/invoices/invoices.type";

// مستند الفاتورة — يُبنى مرة واحدة ويُستعمل للطباعة والتحميل معًا،
// فلا يختلف ما يُطبع عمّا يُحفَظ.

/** Decimal يصل من الخادم ككائن — نمرّره عبر Number لا نوعًا ضيّقًا */
const money = (value: unknown) =>
	`${Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })} ر.س`;

const dateLabel = (value: Date | string) => {
	const d = new Date(value);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const STATUS_LABELS: Record<string, string> = {
	PENDING: "غير مدفوعة",
	PARTIAL: "دفع جزئي",
	PAID: "مدفوعة",
	VOIDED: "مسترجعة",
};

const escapeHtml = (value: string) =>
	value.replace(
		/[&<>"']/g,
		(ch) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] ?? ch,
	);

/** مستند HTML مستقل للفاتورة — صالح للطباعة أو الحفظ كملف */
export const buildInvoiceDocument = (invoice: InvoiceListItemResponse): string => {
	const subject = invoiceSubject(invoice);
	const due = Math.max(0, Number(invoice.total) - Number(invoice.amountPaid));

	const rows = subject.lines
		.map(
			(line) => `
			<tr>
				<td>${escapeHtml(line.name)}</td>
				<td>${escapeHtml(line.category ?? "—")}</td>
				<td class="num">${line.quantity}</td>
				<td class="num">${money(line.priceSnapshot)}</td>
				<td class="num">${money(Number(line.priceSnapshot) * line.quantity)}</td>
			</tr>`,
		)
		.join("");

	const consultationRow =
		subject.consultationFee && Number(subject.consultationFee) > 0
			? `<tr>
					<td>${escapeHtml(subject.consultationName ?? "رسوم الكشف")}</td>
					<td>رسوم الكشف</td>
					<td class="num">1</td>
					<td class="num">${money(subject.consultationFee)}</td>
					<td class="num">${money(subject.consultationFee)}</td>
				</tr>`
			: "";

	return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>فاتورة ${escapeHtml(invoice.code)}</title>
<style>
	* { box-sizing: border-box; }
	body { font-family: system-ui, "Segoe UI", Tahoma, sans-serif; margin: 0; padding: 24px; color: #08090A; }
	h1 { font-size: 18px; margin: 0 0 4px; }
	.muted { color: #5C5C5E; font-size: 12px; }
	.head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 1px solid #E5E5E5; padding-bottom: 12px; margin-bottom: 16px; }
	table { width: 100%; border-collapse: collapse; font-size: 12px; }
	th, td { border-bottom: 1px solid #EEE; padding: 8px 6px; text-align: right; }
	th { color: #5C5C5E; font-weight: 600; }
	td.num, th.num { text-align: center; font-variant-numeric: tabular-nums; }
	.totals { margin-top: 16px; margin-inline-start: auto; width: 260px; font-size: 12px; }
	.totals div { display: flex; justify-content: space-between; padding: 4px 0; }
	.totals .grand { border-top: 1px solid #E5E5E5; margin-top: 4px; padding-top: 8px; font-weight: 700; }
	@media print { body { padding: 0; } }
</style>
</head>
<body>
	<div class="head">
		<div>
			<h1>فاتورة ${escapeHtml(invoice.code)}</h1>
			<p class="muted">
				${escapeHtml(subject.patientName)} · ${escapeHtml(subject.ownerName)}<br />
				${dateLabel(subject.date ?? invoice.createdAt)}
				${subject.sourceCode ? ` · ${escapeHtml(subject.sourceCode)}` : ""}
			</p>
		</div>
		<p class="muted">الحالة: ${escapeHtml(STATUS_LABELS[invoice.status] ?? invoice.status)}</p>
	</div>

	<table>
		<thead>
			<tr>
				<th>البند</th><th>الفئة</th><th class="num">الكمية</th>
				<th class="num">سعر الوحدة</th><th class="num">الإجمالي</th>
			</tr>
		</thead>
		<tbody>${consultationRow}${rows}</tbody>
	</table>

	<div class="totals">
		<div><span>المجموع</span><span>${money(invoice.subtotal)}</span></div>
		${Number(invoice.discount) > 0 ? `<div><span>الخصم</span><span>− ${money(invoice.discount)}</span></div>` : ""}
		<div><span>الضريبة (${Number(invoice.vatRate)}%)</span><span>${money(invoice.vatAmount)}</span></div>
		<div class="grand"><span>الإجمالي</span><span>${money(invoice.total)}</span></div>
		<div><span>المسدَّد</span><span>${money(invoice.amountPaid)}</span></div>
		<div><span>المتبقّي</span><span>${money(due)}</span></div>
	</div>
</body>
</html>`;
};

/** يفتح حوار الطباعة على نسخة الفاتورة — والمتصفّح يتيح «حفظ كـPDF» منه */
export const printInvoice = (invoice: InvoiceListItemResponse) => {
	const win = window.open("", "_blank", "width=900,height=1000");
	if (!win) return false;
	win.document.write(buildInvoiceDocument(invoice));
	win.document.close();
	// الطباعة بعد اكتمال التحميل وإلا خرجت الصفحة فارغة
	win.onload = () => {
		win.focus();
		win.print();
	};
	return true;
};

/** يحفظ الفاتورة ملفًا محليًا دون خادم — نفس المستند المطبوع */
export const downloadInvoice = (invoice: InvoiceListItemResponse) => {
	const blob = new Blob([buildInvoiceDocument(invoice)], {
		type: "text/html;charset=utf-8",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `فاتورة-${invoice.code}.html`;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};
