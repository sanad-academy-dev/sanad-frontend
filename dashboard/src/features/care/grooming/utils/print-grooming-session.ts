import type { GroomingSessionDetail } from "@/server/grooming/grooming.type";
import {
	COAT_CONDITION_LABELS,
	EAR_CONDITION_LABELS,
	GROOMING_FINDING_CATEGORY_LABELS,
	GROOMING_FINDING_SEVERITY_LABELS,
	GROOMING_INCIDENT_KIND_LABELS,
	GROOMING_INCIDENT_SEVERITY_LABELS,
	GROOMING_MOOD_LABELS,
	NAIL_CONDITION_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.type";
import {
	GROOMING_BEHAVIOR_LABELS,
	GROOMING_DRYING_METHOD_LABELS,
	GROOMING_LANE_LABELS,
	GROOMING_STATUS_LABELS,
	MATTING_GRADE_LABELS,
	PARASITE_FINDING_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.workflow";

// طباعة تقرير الجلسة — مستند A4 عربي RTL يفتح نافذة طباعة المتصفح، على نمط
// السجل المحيط بالجراحة. الجلسة المكتملة وثيقة تُسلَّم للوليّ أمر وتُحفظ في الملف،
// لا شاشة تُغلق: التعقّد الذي بُني عليه السعر، وما نُفّذ فعلًا، وأي حادثة وقعت.

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

const fmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });
const at = (v: Date | string | null | undefined) => (v ? fmt.format(new Date(v)) : "—");
const money = (v: unknown) =>
	`${Number(v ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })} ر.س`;

const row = (label: string, value: string) =>
	`<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`;

const section = (title: string, body: string) =>
	body ? `<section><h2>${escapeHtml(title)}</h2>${body}</section>` : "";

export function printGroomingSession(session: GroomingSessionDetail) {
	const intake = session.intake;

	const services = session.items
		.map(
			(item) =>
				`<li>${escapeHtml(item.nameSnapshot)} — ${
					item.performed ? "نُفِّذت" : "لم تُنفَّذ"
				} — ${money(item.priceSnapshot)}</li>`,
		)
		.join("");

	const adjustments = session.adjustments.length
		? `<ul>${session.adjustments
				.map(
					(adj) =>
						`<li>${escapeHtml(adj.labelSnapshot)} — ${money(adj.amount)}${
							adj.reason ? ` (${escapeHtml(adj.reason)})` : ""
						}</li>`,
				)
				.join("")}</ul>`
		: "";

	const intakeTable = intake
		? `<table>${[
				intake.weightKg != null ? row("الوزن", `${Number(intake.weightKg)} كجم`) : "",
				row("درجة التعقّد", MATTING_GRADE_LABELS[intake.mattingGrade]),
				intake.coatCondition
					? row("حالة الفرو", COAT_CONDITION_LABELS[intake.coatCondition])
					: "",
				row("الطفيليات", PARASITE_FINDING_LABELS[intake.parasiteFinding]),
				intake.earCondition ? row("الأذن", EAR_CONDITION_LABELS[intake.earCondition]) : "",
				intake.nailCondition
					? row("الأظافر", NAIL_CONDITION_LABELS[intake.nailCondition])
					: "",
				row("السلوك", GROOMING_BEHAVIOR_LABELS[intake.behaviorScore]),
				/**
				 * حقلان من نوع `String[]` كانا يُمرَّران إلى `row(value: string)`.
				 *
				 * والحارس كان `intake.skinFindings ?` — ومصفوفة فارغة **صادقة** في
				 * جافاسكربت، فكان السطر يُطبع فارغًا في التقرير بدل أن يُحذف. الفحص على
				 * `.length` والوصل بـ`join` يتبعان ما كتبه المؤلّف نفسه بعد سطرين في
				 * `heatDryReasonsSnapshot`.
				 */
				intake.skinFindings.length
					? row("ملاحظات الجلد", intake.skinFindings.join(" · "))
					: "",
				intake.shaveDownRecommended
					? row(
							"حلاقة اضطرارية",
							intake.shaveDownApprovedAt
								? `أقرّها وليّ الأمر — ${at(intake.shaveDownApprovedAt)}`
								: "موصى بها بلا إقرار",
						)
					: "",
				intake.heatDryProhibitedSnapshot
					? row("منع التجفيف الحارّ", intake.heatDryReasonsSnapshot.join(" · ") || "نعم")
					: "",
				intake.belongings.length ? row("متعلّقات وليّ الأمر", intake.belongings.join(" · ")) : "",
				intake.notes ? row("ملاحظات", intake.notes) : "",
			].join("")}</table>`
		: "";

	const findings = session.findings.length
		? `<ul>${session.findings
				.map(
					(f) =>
						`<li><strong>${escapeHtml(GROOMING_FINDING_CATEGORY_LABELS[f.category])} — ${escapeHtml(
							GROOMING_FINDING_SEVERITY_LABELS[f.severity],
						)}:</strong> ${escapeHtml(f.note)}${f.bodyZone ? ` (${escapeHtml(f.bodyZone)})` : ""}</li>`,
				)
				.join("")}</ul>`
		: "";

	const incidents = session.incidents.length
		? `<ul>${session.incidents
				.map(
					(i) =>
						`<li><strong>${escapeHtml(GROOMING_INCIDENT_KIND_LABELS[i.kind])} — ${escapeHtml(
							GROOMING_INCIDENT_SEVERITY_LABELS[i.severity],
						)}:</strong> ${escapeHtml(i.description)}${
							i.actionTaken ? ` — ما اتُّخذ: ${escapeHtml(i.actionTaken)}` : ""
						} — ${i.resolvedAt ? `أُغلقت ${at(i.resolvedAt)}` : "مفتوحة"}</li>`,
				)
				.join("")}</ul>`
		: "";

	const products = session.products.length
		? `<ul>${session.products
				.map(
					(p) =>
						`<li>${escapeHtml(p.nameSnapshot)} × ${Number(p.quantity)}${
							p.dilution ? ` — تخفيف ${escapeHtml(p.dilution)}` : ""
						}${p.billable ? ` — ${money(p.priceSnapshot)}` : " — غير محاسَب"}</li>`,
				)
				.join("")}</ul>`
		: "";

	const reportCard = session.reportCard
		? `<table>${[
				row("مزاج الطفل", GROOMING_MOOD_LABELS[session.reportCard.moodScore]),
				row("الملخّص", session.reportCard.summary),
				session.reportCard.recommendedIntervalWeeks
					? row(
							"التكرار الموصى به",
							`كل ${session.reportCard.recommendedIntervalWeeks} أسبوعًا`,
						)
					: "",
				session.reportCard.nextRecommendedAt
					? row("الموعد القادم المقترح", at(session.reportCard.nextRecommendedAt))
					: "",
				session.reportCard.sentAt ? row("أُرسل للوليّ أمر", at(session.reportCard.sentAt)) : "",
			].join("")}</table>`
		: "";

	const invoice = session.invoice
		? `<table>${[
				row("رقم الفاتورة", session.invoice.code),
				row("الإجمالي", money(session.invoice.total)),
				row("المسدَّد", money(session.invoice.amountPaid)),
				row(
					"الحالة",
					session.invoice.status === "PAID"
						? "مسدَّدة"
						: session.invoice.status === "PARTIAL"
							? "مسدَّدة جزئيًا"
							: "غير مسدَّدة",
				),
			].join("")}</table>`
		: "";

	const photos = `<table>${[
		row("صور «قبل»", String(session.photos.filter((p) => p.kind === "BEFORE").length)),
		row("صور «بعد»", String(session.photos.filter((p) => p.kind === "AFTER").length)),
		row(
			"صور توثيق الحالة",
			String(session.photos.filter((p) => p.kind === "CONDITION").length),
		),
	].join("")}</table>`;

	const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8" />
<title>${escapeHtml(session.code)} — تقرير جلسة التجميل</title>
<style>
	@page { size: A4; margin: 18mm 15mm; }
	body { font-family: "Segoe UI", Tahoma, sans-serif; color: #111; font-size: 12px; line-height: 1.7; }
	header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #111; padding-bottom: 6px; margin-bottom: 12px; }
	h1 { font-size: 16px; margin: 0; }
	h2 { font-size: 13px; border-bottom: 1px solid #999; padding-bottom: 2px; margin: 14px 0 6px; }
	table { width: 100%; border-collapse: collapse; }
	th { text-align: start; width: 32%; color: #444; font-weight: 600; padding: 2px 0; vertical-align: top; }
	td { padding: 2px 0; }
	ul { margin: 4px 0; padding-inline-start: 18px; }
	.meta { color: #555; font-size: 11px; }
	footer { margin-top: 18px; border-top: 1px solid #999; padding-top: 6px; color: #666; font-size: 10px; }
</style></head><body>
<header>
	<h1>تقرير جلسة التجميل — ${escapeHtml(session.code)}</h1>
	<span class="meta">${at(new Date())}</span>
</header>
<table>
	${row("الطفل", `${session.patient.name} (${session.patient.code})`)}
	${row("وليّ الأمر", session.owner?.name ?? "—")}
	${row("الحالة", GROOMING_STATUS_LABELS[session.status])}
	${row("المسار", GROOMING_LANE_LABELS[session.lane])}
	${row("المُجمِّل", session.groomer?.user?.name ?? "—")}
	${session.station ? row("المحطة", session.station.name) : ""}
	${row("الموعد", at(session.scheduledAt))}
	${row("الاستلام", at(session.checkedInAt))}
	${row("بدء العمل", at(session.startedAt))}
	${row("بدء التجفيف", at(session.dryingStartedAt))}
	${row("جاهز للاستلام", at(session.readyAt))}
	${row("التسليم", at(session.pickedUpAt))}
	${row("الإقفال", at(session.completedAt))}
	${session.dryingMethod ? row("طريقة التجفيف", GROOMING_DRYING_METHOD_LABELS[session.dryingMethod]) : ""}
</table>
${section("الفحص القبلي", intakeTable)}
${section("الدورات", `<ul>${services}</ul>`)}
${section("الرسوم والخصوم", adjustments)}
${section("المستهلكات", products)}
${section("التوثيق المصوَّر", photos)}
${section("الملاحظات السريرية", findings)}
${section("الحوادث", incidents)}
${section("تقرير وليّ الأمر", reportCard)}
${section("الفاتورة", invoice)}
<footer>وُلّد من نظام أكاديمية سند — وحدة التجميل. الملاحظات السريرية في هذا التقرير ليست تشخيصًا؛ تُقيَّم من مدرّب عند الحاجة.</footer>
<script>window.addEventListener("load", () => window.print());</script>
</body></html>`;

	const win = window.open("", "_blank", "width=900,height=1100");
	if (!win) return;
	win.document.write(html);
	win.document.close();
}
