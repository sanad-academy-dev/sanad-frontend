import type {
	AppointmentProductResponse,
	AppointmentResponse,
	AppointmentServiceResponse,
} from "@/server/appointments/appointments.type";
import type { InvoiceResponse } from "@/server/invoices/invoices.type";

// الكمية المحاسَبة = الكمية − المجانية (صفر إن كان الصنف مجانيًا بالكامل)
const billableProductQty = (p: {
	quantity: number;
	freeQuantity: number;
	fullyFree: boolean;
}) => (p.fullyFree ? 0 : Math.max(0, p.quantity - p.freeQuantity));

// يتحمّل Decimal ونصًّا ورقمًا وقيمًا فارغة — انظر التعليق في payment-success-modal
const formatMoney = (value: unknown) => {
	const n = value == null ? 0 : Number(value);
	return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0";
};

const paymentMethodLabel = (method: InvoiceResponse["paymentMethod"]) =>
	method === "CASH" ? "كاش" : "—";

export interface InvoicePrintData {
	invoice: InvoiceResponse;
	services: AppointmentServiceResponse[];
	products?: AppointmentProductResponse[];
	appointment?: AppointmentResponse;
	ownerName: string;
	patientName: string;
}

// يبني فاتورة مستقلّة (RTL) ويفتحها في نافذة منفصلة ثم يستدعي حوار الطباعة.
// نافذة منفصلة بدل طباعة الصفحة كاملة لأن اللوحة عنصر ثابت overlay داخل التطبيق
// (نفس أسلوب print-expense-receipt.ts).
export function printInvoice({
	invoice,
	services,
	products = [],
	appointment,
	ownerName,
	patientName,
}: InvoicePrintData) {
	const win = window.open("", "_blank", "width=720,height=900");
	if (!win) return;

	// null-safe: أي حقل مفقود (code/اسم…) لا يجب أن يرمي استثناءً فيترك نافذة بيضاء
	const esc = (s: unknown) =>
		String(s ?? "").replace(
			/[&<>"']/g,
			(c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
		);

	const paidDateLabel = invoice.paidAt
		? new Intl.DateTimeFormat("ar-SA", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}).format(new Date(invoice.paidAt))
		: "";

	const consultationFee = Number(appointment?.consultationFeeSnapshot ?? 0);

	// صفوف بنود الفاتورة: الكشف ثم الدورات ثم الأصناف
	const lineRows: [string, string][] = [];
	if (consultationFee > 0) {
		lineRows.push([
			appointment?.consultationType?.name ?? "كشف",
			`${formatMoney(consultationFee)} ر.س`,
		]);
	}
	for (const row of services) {
		lineRows.push([
			row.service.name,
			`${formatMoney(Number(row.priceSnapshot) * row.quantity)} ر.س`,
		]);
	}
	for (const row of products) {
		const qty = billableProductQty(row);
		lineRows.push([
			row.nameSnapshot,
			qty === 0 ? "مجاني" : `${formatMoney(Number(row.priceSnapshot) * qty)} ر.س`,
		]);
	}

	const summaryRows: [string, string][] = [
		["المجموع الفرعي", `${formatMoney(invoice.subtotal)} ر.س`],
		[
			`ضريبة القيمة المضافة (${invoice.vatRate?.toString() ?? "0"}%)`,
			`${formatMoney(invoice.vatAmount)} ر.س`,
		],
		["الخصم", `${formatMoney(invoice.discount)} ر.س`],
		["وسيلة الدفع", paymentMethodLabel(invoice.paymentMethod)],
	];

	const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>فاتورة ${esc(invoice.code)}</title>
<style>
	* { box-sizing: border-box; }
	body { font-family: "Segoe UI", Tahoma, sans-serif; color: #111; margin: 0; padding: 28px; }
	.head { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 18px; }
	.head h1 { font-size: 18px; margin: 0; }
	.badge { font-size: 12px; font-weight: 600; color: #059669; border: 1px solid #059669; border-radius: 999px; padding: 3px 10px; }
	.total { text-align: center; margin: 0 0 20px; }
	.total .amount { font-size: 26px; font-weight: 800; }
	.total .caption { font-size: 12px; color: #6b7280; margin-bottom: 2px; }
	.meta { font-size: 12px; color: #6b7280; text-align: center; margin: 0 0 18px; }
	h2 { font-size: 13px; margin: 18px 0 8px; }
	table { width: 100%; border-collapse: collapse; font-size: 13px; }
	td { padding: 7px 0; border-bottom: 1px solid #eee; }
	td.label { color: #6b7280; }
	td.value { text-align: left; font-weight: 600; }
	.foot { margin-top: 24px; font-size: 11px; color: #6b7280; text-align: center; border-top: 1px solid #eee; padding-top: 12px; }
	.print-btn { display: block; margin: 20px auto 0; padding: 8px 24px; font-size: 13px; font-weight: 600; color: #fff; background: #506ae0; border: none; border-radius: 4px; cursor: pointer; }
	@media print { body { padding: 12px; } .no-print { display: none !important; } }
</style>
</head>
<body>
	<div class="head">
		<h1>فاتورة زيارة</h1>
		<span class="badge">مدفوعة</span>
	</div>

	<div class="total">
		<p class="caption">المبلغ الإجمالي</p>
		<span class="amount">${esc(formatMoney(invoice.total))} ر.س</span>
	</div>

	<p class="meta">
		العميل: ${esc(ownerName)} • الطفل: ${esc(patientName)}<br />
		معرف الفاتورة: ${esc(invoice.code)}${paidDateLabel ? ` • ${esc(paidDateLabel)}` : ""}
	</p>

	<h2>ملخص الدورة</h2>
	<table>
		${lineRows
			.map(
				([l, v]) =>
					`<tr><td class="label">${esc(l)}</td><td class="value">${esc(v)}</td></tr>`,
			)
			.join("")}
	</table>

	<h2>تفاصيل المعاملة</h2>
	<table>
		${summaryRows
			.map(
				([l, v]) =>
					`<tr><td class="label">${esc(l)}</td><td class="value">${esc(v)}</td></tr>`,
			)
			.join("")}
	</table>

	<p class="foot">وثيقة رسمية صادرة عن نظام إدارة الأكاديمية — تاريخ الطباعة: ${new Date().toLocaleDateString("en-CA")}</p>
	<button class="print-btn no-print" onclick="window.print()">طباعة</button>
</body>
</html>`;

	win.document.open();
	win.document.write(html);
	win.document.close();

	// نستدعي الطباعة من النافذة الأصل بعد اكتمال التحميل بدل الاعتماد على سكربت مضمّن
	// (قد لا يُنفَّذ سكربت document.write في بعض المتصفحات) — مع مهلة احتياطية.
	const triggerPrint = () => {
		win.focus();
		win.print();
	};
	if (win.document.readyState === "complete") {
		setTimeout(triggerPrint, 200);
	} else {
		win.addEventListener("load", () => setTimeout(triggerPrint, 200));
	}
}
