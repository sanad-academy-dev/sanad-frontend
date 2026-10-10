import type { OperationCaseDetailResponse } from "@/server/operations/operations.type";
import {
	OPERATION_STATUS_LABELS,
	OPERATION_TIER_LABELS,
	OPERATION_URGENCY_LABELS,
} from "@sanad/contracts/runtime/server/operations/operations.workflow";
import { SEDATION_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// طباعة السجل المحيط بالجراحة (OP8 — N5): مستند A4 بالعربية RTL يفتح نافذة
// طباعة المتصفح. المستندات القانونية (التقرير الجراحي وتعليمات الخروج) يجب أن
// تغادر الشاشة إلى الورق.

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

const fmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });
const at = (v: Date | string | null | undefined) => (v ? fmt.format(new Date(v)) : "—");

const TEAM_ROLE_LABELS: Record<string, string> = {
	PRIMARY_SURGEON: "الجرّاح الأساسي",
	ASSISTANT_SURGEON: "جرّاح مساعد",
	ANESTHETIST: "مدرّب التخدير",
	ANESTHESIA_TECH: "فنّي تخدير",
	SCRUB_NURSE: "ممرض معقّم",
	CIRCULATOR: "ممرض متجوّل",
	OBSERVER: "مراقب",
};

const COUNT_LABELS: Record<string, string> = {
	SPONGE: "الشاش",
	NEEDLE: "الإبر",
	INSTRUMENT: "الأدوات",
};

const ORDER_KIND_LABELS: Record<string, string> = {
	MEDICATION: "دواء",
	MONITORING: "مراقبة",
	FEEDING: "تغذية",
	ACTIVITY: "نشاط وحركة",
	WOUND_CARE: "عناية بالجرح",
	FOLLOW_UP: "زيارة متابعة",
	SUTURE_REMOVAL: "إزالة الغرز",
};

const row = (label: string, value: string) =>
	`<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`;

const section = (title: string, body: string) =>
	body ? `<section><h2>${escapeHtml(title)}</h2>${body}</section>` : "";

export function printOperationCase(c: OperationCaseDetailResponse) {
	const procedures = c.procedures
		.map(
			(p) =>
				`<li>${escapeHtml(p.nameSnapshot)}${p.site ? ` — ${escapeHtml(p.site)}` : ""}</li>`,
		)
		.join("");
	const team = c.team
		.map(
			(m) =>
				`<li>${escapeHtml(m.staff.name)} — ${escapeHtml(TEAM_ROLE_LABELS[m.role] ?? m.role)}</li>`,
		)
		.join("");

	const anesthesia = c.anesthesia
		? `<table>${[
				row("التخدير المخطط", SEDATION_LABELS[c.anesthesia.planned]),
				c.anesthesia.airway ? row("مجرى الهواء", c.anesthesia.airway) : "",
				row("بدء التخدير", at(c.anesthesia.inductionAt)),
				row("الشق الجراحي", at(c.anesthesia.incisionAt)),
				row("الإغلاق", at(c.anesthesia.closureAt)),
				row("نهاية التخدير", at(c.anesthesia.endAnesthesiaAt)),
			].join("")}</table>` +
			(c.anesthesia.events.length > 0
				? `<h3>الأدوية والأحداث</h3><ul>${c.anesthesia.events
						.map(
							(e) =>
								`<li>${at(e.at)} — ${escapeHtml(e.agentName ?? e.kind)}${
									e.dose != null ? ` ${e.dose} ${escapeHtml(e.doseUnit ?? "")}` : ""
								}</li>`,
						)
						.join("")}</ul>`
				: "")
		: "";

	const note = c.note
		? `<table>${[
				c.note.proceduresPerformed ? row("ما نُفّذ فعلًا", c.note.proceduresPerformed) : "",
				c.note.findings ? row("الموجودات", c.note.findings) : "",
				c.note.technique ? row("التقنية", c.note.technique) : "",
				c.note.estimatedBloodLossMl != null
					? row("فقد الدم التقديري", `${c.note.estimatedBloodLossMl} مل`)
					: "",
				c.note.closureDetails ? row("الإغلاق والدرنقة", c.note.closureDetails) : "",
				c.note.signedAt
					? row("التوقيع", `${c.note.signedBy?.name ?? ""} — ${at(c.note.signedAt)}`)
					: row("التوقيع", "غير موقَّع"),
			].join("")}</table>`
		: "";

	const counts = c.counts.length
		? `<table>${c.counts
				.map((x) =>
					row(
						`عدّ ${COUNT_LABELS[x.type] ?? x.type}`,
						`قبل: ${x.initialCount ?? "—"} / بعد: ${x.finalCount ?? "—"} — ${
							x.reconciled ? "مطابق" : "غير مطابق"
						}${x.discrepancyNote ? ` (${x.discrepancyNote})` : ""}`,
					),
				)
				.join("")}</table>`
		: "";

	const orders = c.postOpOrders.length
		? `<ul>${c.postOpOrders
				.map(
					(o) =>
						`<li><strong>${escapeHtml(ORDER_KIND_LABELS[o.kind] ?? o.kind)}:</strong> ${escapeHtml(
							o.instructions,
						)}${o.dueAt ? ` — ${at(o.dueAt)}` : ""}</li>`,
				)
				.join("")}</ul>`
		: "";

	const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8" />
<title>${escapeHtml(c.code)} — السجل المحيط بالجراحة</title>
<style>
	@page { size: A4; margin: 18mm 15mm; }
	body { font-family: "Segoe UI", Tahoma, sans-serif; color: #111; font-size: 12px; line-height: 1.7; }
	header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #111; padding-bottom: 6px; margin-bottom: 12px; }
	h1 { font-size: 16px; margin: 0; }
	h2 { font-size: 13px; border-bottom: 1px solid #999; padding-bottom: 2px; margin: 14px 0 6px; }
	h3 { font-size: 12px; margin: 8px 0 4px; }
	table { width: 100%; border-collapse: collapse; }
	th { text-align: start; width: 32%; color: #444; font-weight: 600; padding: 2px 0; vertical-align: top; }
	td { padding: 2px 0; }
	ul { margin: 4px 0; padding-inline-start: 18px; }
	.meta { color: #555; font-size: 11px; }
	footer { margin-top: 18px; border-top: 1px solid #999; padding-top: 6px; color: #666; font-size: 10px; }
</style></head><body>
<header>
	<h1>السجل المحيط بالجراحة — ${escapeHtml(c.code)}</h1>
	<span class="meta">${at(new Date())}</span>
</header>
<table>
	${row("الطفل", `${c.patient.name} — وليّ الأمر: ${c.owner.name}`)}
	${row("الحالة", OPERATION_STATUS_LABELS[c.status])}
	${row("الدرجة / الأولوية", `${OPERATION_TIER_LABELS[c.tier]} / ${OPERATION_URGENCY_LABELS[c.urgency]}`)}
	${row("الموعد", c.scheduledAt ? at(c.scheduledAt) : "غير مجدولة")}
	${c.room ? row("القاعة", c.room.name) : ""}
	${c.diagnosis ? row("التشخيص", c.diagnosis) : ""}
</table>
${section("الإجراءات", `<ul>${procedures}</ul>`)}
${section("الفريق الجراحي", `<ul>${team}</ul>`)}
${section("سجل التخدير", anesthesia)}
${section("التقرير الجراحي", note)}
${section("العدّ الجراحي", counts)}
${section("أوامر ما بعد الجراحة وتعليمات الخروج", orders)}
<footer>وُلّد من نظام أكاديمية سند — وحدة العمليات الجراحية. المستند الموقَّع إلكترونيًا مصون في النظام (S21).</footer>
<script>window.addEventListener("load", () => window.print());</script>
</body></html>`;

	const win = window.open("", "_blank", "width=900,height=1100");
	if (!win) return;
	win.document.write(html);
	win.document.close();
}
