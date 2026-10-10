// [IP4] طباعة تقرير الخروج — المستند الذي يغادر مع وليّ الأمر.
//
// على نمط `print-consent.ts` و`print-operation-case.ts`: نافذة متصفّح ومستند A4،
// بلا مكتبة PDF. ما يُطبع هو ما سُجّل: التقرير والتعليمات وما أُعطي فعلًا —
// والتعليمات هي الجزء الذي يُقرأ في البيت بعد أسبوع، فتأخذ حيّزًا مقروءًا لا
// حاشية في آخر الصفحة.

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

const dtFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });
const dFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

const at = (v: Date | string | null | undefined) => (v ? dtFmt.format(new Date(v)) : "—");
const day = (v: Date | string | null | undefined) => (v ? dFmt.format(new Date(v)) : "—");

const paragraphs = (text: string | null | undefined): string =>
	(text ?? "")
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => `<p>${escapeHtml(line)}</p>`)
		.join("\n") || "<p>—</p>";

export type DischargePrintInput = {
	code: string;
	clinicName?: string | null;
	patient: { name: string; code: string; animalType?: { arName: string } | null };
	owner: { name: string; phone?: string | null };
	attendingStaff: { name: string };
	admittedAt: string | Date | null;
	dischargedAt: string | Date | null;
	dischargeKindLabel: string;
	admissionDiagnosis?: string | null;
	dischargeSummaryAr?: string | null;
	dischargeInstructionsAr?: string | null;
	/** ما أُعطي فعلًا — يُلخَّص عدًّا لا سردًا */
	givenMedications?: { name: string; count: number }[];
};

export const printDischargeSummary = (input: DischargePrintInput) => {
	const win = window.open("", "_blank", "width=900,height=1000");
	if (!win) return;

	const meds = (input.givenMedications ?? []).filter((m) => m.count > 0);
	const medsBlock = meds.length
		? `<ul class="meds">${meds
				.map((m) => `<li>${escapeHtml(m.name)} — ${m.count} جرعة</li>`)
				.join("")}</ul>`
		: "<p>—</p>";

	const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>تقرير خروج ${escapeHtml(input.code)}</title>
<style>
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "IBM Plex Sans Arabic", "Segoe UI", system-ui, sans-serif;
    color: #101828; margin: 0; line-height: 1.7; font-size: 12pt;
  }
  header { border-bottom: 2px solid #101828; padding-bottom: 8px; margin-bottom: 14px; }
  h1 { font-size: 16pt; margin: 0 0 2px; }
  .sub { color: #475467; font-size: 10pt; }
  h2 {
    font-size: 12pt; margin: 16px 0 6px; padding-bottom: 3px;
    border-bottom: 1px solid #d0d5dd;
  }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 18px; margin-bottom: 6px; }
  .k { color: #475467; }
  p { margin: 0 0 6px; }
  ul.meds { margin: 0; padding-inline-start: 18px; }
  /* التعليمات هي ما يُقرأ في البيت — تُبرز بإطار لا تُدفن في المتن */
  .instructions {
    border: 1px solid #101828; border-radius: 4px; padding: 10px 12px; margin-top: 6px;
  }
  footer {
    margin-top: 24px; padding-top: 8px; border-top: 1px solid #d0d5dd;
    color: #475467; font-size: 9pt; display: flex; justify-content: space-between;
  }
  .sign { margin-top: 28px; display: flex; justify-content: space-between; gap: 40px; }
  .sign div { flex: 1; border-top: 1px solid #101828; padding-top: 4px; font-size: 10pt; }
</style>
</head>
<body>
<header>
  <h1>تقرير خروج من التنويم</h1>
  <div class="sub">
    ${escapeHtml(input.clinicName ?? "")} ${input.clinicName ? "·" : ""}
    رقم الإقامة ${escapeHtml(input.code)} · طُبع ${at(new Date())}
  </div>
</header>

<h2>بيانات الطفل ووليّ الأمر</h2>
<div class="grid">
  <div><span class="k">الطفل:</span> ${escapeHtml(input.patient.name)} (${escapeHtml(input.patient.code)})</div>
  <div><span class="k">النوع:</span> ${escapeHtml(input.patient.animalType?.arName ?? "—")}</div>
  <div><span class="k">وليّ الأمر:</span> ${escapeHtml(input.owner.name)}</div>
  <div><span class="k">الهاتف:</span> <span dir="ltr">${escapeHtml(input.owner.phone ?? "—")}</span></div>
  <div><span class="k">تاريخ الدخول:</span> ${day(input.admittedAt)}</div>
  <div><span class="k">تاريخ الخروج:</span> ${day(input.dischargedAt)}</div>
  <div><span class="k">المدرّب المعالج:</span> ${escapeHtml(input.attendingStaff.name)}</div>
  <div><span class="k">طريقة الخروج:</span> ${escapeHtml(input.dischargeKindLabel)}</div>
</div>

${
	input.admissionDiagnosis
		? `<h2>تشخيص الدخول</h2><p>${escapeHtml(input.admissionDiagnosis)}</p>`
		: ""
}

<h2>ملخّص الإقامة</h2>
${paragraphs(input.dischargeSummaryAr)}

<h2>العلاج الذي أُعطي</h2>
${medsBlock}

<h2>تعليمات المتابعة في المنزل</h2>
<div class="instructions">
  ${paragraphs(input.dischargeInstructionsAr)}
</div>

<div class="sign">
  <div>توقيع المدرّب المعالج</div>
  <div>توقيع المستلِم</div>
</div>

<footer>
  <span>${escapeHtml(input.code)}</span>
  <span>إن ظهرت أعراض جديدة أو ساءت الحالة، راجع الأكاديمية فورًا</span>
</footer>

<script>window.addEventListener("load", () => { window.print(); });</script>
</body>
</html>`;

	win.document.write(html);
	win.document.close();
};
