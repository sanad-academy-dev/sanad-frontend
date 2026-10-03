import type {
	ApprovalStep,
	SubmittedExpenseRequest,
} from "@/features/finance/expenses/data/expense-review";

// يطبع إيصال المصروف في نافذة منفصلة بمحتوى مستقلّ (RTL) — يتفادى الشاشة البيضاء
// الناتجة عن طباعة الصفحة كاملة (اللوحة عنصر ثابت overlay داخل التطبيق).
export function printExpenseReceipt(request: SubmittedExpenseRequest, steps: ApprovalStep[]) {
	const win = window.open("", "_blank", "width=720,height=900");
	if (!win) return;

	const title = request.title.replace("مراجعة ", "");
	const esc = (s: string) =>
		s.replace(
			/[&<>"']/g,
			(c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
		);

	const detailRows: [string, string][] = [
		["مقدم الطلب", request.requesterName],
		["القسم", request.departmentLabel],
		["الفئة", request.categoryLabel],
		["الفرع", request.branchLabel],
		["المورد", request.vendorLabel],
		["المبلغ", request.amountLabel],
		["طريقة الدفع", request.paymentMethodLabel],
		["التاريخ", request.dateLabel],
	];

	const stepRows = steps
		.filter((s) => !s.isComment)
		.map((s) => {
			const done = s.state !== "pending";
			return `<li class="${done ? "done" : ""}">
				<span class="dot"></span>
				<span class="step-title">${esc(s.title)}</span>
				<span class="step-meta">${esc(s.byName)} · ${esc(s.dateLabel)}</span>
			</li>`;
		})
		.join("");

	const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>إيصال مصروف ${esc(request.code)}</title>
<style>
	* { box-sizing: border-box; }
	body { font-family: "Segoe UI", Tahoma, sans-serif; color: #111; margin: 0; padding: 28px; }
	.head { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 18px; }
	.head h1 { font-size: 18px; margin: 0; }
	.badge { font-size: 12px; font-weight: 600; color: #059669; border: 1px solid #059669; border-radius: 999px; padding: 3px 10px; }
	.title { font-size: 16px; font-weight: 700; margin: 0 0 4px; }
	.code { font-size: 12px; color: #6b7280; margin: 0 0 18px; }
	h2 { font-size: 13px; margin: 18px 0 8px; }
	table { width: 100%; border-collapse: collapse; font-size: 13px; }
	td { padding: 7px 0; border-bottom: 1px solid #eee; }
	td.label { color: #6b7280; }
	td.value { text-align: left; font-weight: 600; }
	ul.steps { list-style: none; margin: 0; padding: 0; font-size: 12px; }
	ul.steps li { display: flex; align-items: center; gap: 8px; padding: 6px 0; color: #9ca3af; }
	ul.steps li.done { color: #111; }
	ul.steps .dot { width: 9px; height: 9px; border-radius: 999px; background: #d1d5db; flex: 0 0 auto; }
	ul.steps li.done .dot { background: #4f6ae0; }
	ul.steps .step-meta { color: #9ca3af; margin-inline-start: auto; }
	.foot { margin-top: 24px; font-size: 11px; color: #6b7280; text-align: center; border-top: 1px solid #eee; padding-top: 12px; }
	@media print { body { padding: 12px; } }
</style>
</head>
<body>
	<div class="head">
		<h1>إيصال مصروف</h1>
		<span class="badge">${esc(request.paymentMethodLabel)}</span>
	</div>
	<p class="title">${esc(title)}</p>
	<p class="code">#${esc(request.code)}</p>

	<h2>تفاصيل الطلب</h2>
	<table>
		${detailRows
			.map(
				([l, v]) =>
					`<tr><td class="label">${esc(l)}</td><td class="value">${esc(v)}</td></tr>`,
			)
			.join("")}
	</table>

	<h2>مسار الموافقات</h2>
	<ul class="steps">${stepRows}</ul>

	<p class="foot">وثيقة رسمية صادرة عن نظام إدارة المصروفات — تاريخ الطباعة: ${new Date().toLocaleDateString("en-CA")}</p>
	<script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

	win.document.open();
	win.document.write(html);
	win.document.close();
}
