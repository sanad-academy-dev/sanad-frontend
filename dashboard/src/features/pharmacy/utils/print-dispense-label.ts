/**
 * [PH5.2] ملصق الدواء المصروف — BRD_Pharmacy_Module.md §9.
 *
 * ورقة طباعة عربية RTL تفتح نافذة المتصفح، على نمط `print-grooming-session.ts` — لا
 * دورة PDF ولا اعتماد جديد.
 *
 * **يطبع ما صُرف، لا ما وُصف** (§9.3). حين يختلفان — صرف جزئي، أو دفعة بديلة — فما
 * يذهب مع الطفل هو الحقيقة التي تُطبع. ملصقٌ يعرض الكمّية الموصوفة على عبوة تحمل
 * أقلّ منها يجعل وليّ الأمر يحسب أيامًا لا يملك دواءها.
 */

export type DispenseLabelData = {
	clinicName: string;
	clinicLicense?: string | null;
	patientName: string;
	speciesName?: string | null;
	ownerName?: string | null;
	drugName: string;
	genericName?: string | null;
	strength?: string | null;
	/** ما صُرف فعلًا */
	quantity: number;
	quantityUnit: string;
	doseText?: string | null;
	route?: string | null;
	frequency?: string | null;
	durationDays?: number | null;
	instructionsAr: string;
	batchNo?: string | null;
	expiryDate?: string | Date | null;
	prescriberName?: string | null;
	dispensedAt: string | Date;
	warningAr?: string | null;
	/**
	 * إفصاح فترة التحريم للأنواع المنتِجة للغذاء (§6.4). النصّ يأتي جاهزًا من
	 * الخادم — بما فيه «غير مذكور في السجل» — ولا يُشتقّ هنا: اشتقاقُه في الواجهة
	 * كان سيسمح لفراغٍ أن يُطبع فراغًا، وهو ما يقرأه المزارع «لا تحريم».
	 */
	withdrawalText?: string | null;
	copies?: number;
};

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const stampFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });

const day = (v: string | Date | null | undefined) => (v ? dateFmt.format(new Date(v)) : "—");

const line = (label: string, value: string | null | undefined) =>
	value
		? `<div class="row"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`
		: "";

function labelHtml(data: DispenseLabelData) {
	const dosage = [data.doseText, data.route, data.frequency].filter(Boolean).join(" · ");
	const duration = data.durationDays ? `${data.durationDays} يوم` : null;

	return `
<article class="label">
  <header>
    <h1>${escapeHtml(data.clinicName)}</h1>
    ${data.clinicLicense ? `<small>ترخيص ${escapeHtml(data.clinicLicense)}</small>` : ""}
  </header>

  <div class="patient">
    <b>${escapeHtml(data.patientName)}</b>${data.speciesName ? ` — ${escapeHtml(data.speciesName)}` : ""}
    ${data.ownerName ? `<div class="owner">${escapeHtml(data.ownerName)}</div>` : ""}
  </div>

  <div class="drug">
    <b>${escapeHtml(data.drugName)}</b>
    ${data.strength ? `<span>${escapeHtml(data.strength)}</span>` : ""}
    ${data.genericName ? `<div class="generic">${escapeHtml(data.genericName)}</div>` : ""}
  </div>

  ${dosage ? `<div class="dosage">${escapeHtml(dosage)}</div>` : ""}
  ${line("المدّة", duration)}
  <div class="row"><span>الكمية المصروفة</span><b>${data.quantity} ${escapeHtml(data.quantityUnit)}</b></div>

  <div class="instructions">${escapeHtml(data.instructionsAr)}</div>

  ${data.warningAr ? `<div class="warn">${escapeHtml(data.warningAr)}</div>` : ""}
  ${data.withdrawalText ? `<div class="withdrawal">فترة التحريم: ${escapeHtml(data.withdrawalText)}</div>` : ""}

  <footer>
    ${line("الدفعة", data.batchNo)}
    ${line("تنتهي في", data.expiryDate ? day(data.expiryDate) : null)}
    ${line("المدرّب", data.prescriberName)}
    <div class="row"><span>تاريخ الصرف</span><b>${escapeHtml(stampFmt.format(new Date(data.dispensedAt)))}</b></div>
  </footer>
</article>`;
}

const STYLES = `
  @page { size: 90mm 60mm; margin: 3mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Segoe UI", Tahoma, sans-serif; color: #111; }
  .label { width: 84mm; padding: 2mm 3mm; border: 1px solid #999; margin-bottom: 3mm;
           page-break-after: always; font-size: 9pt; line-height: 1.45; }
  .label:last-child { page-break-after: auto; }
  header { text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 1mm; }
  header h1 { font-size: 10pt; margin: 0; }
  header small { font-size: 7pt; color: #555; }
  .patient { margin-top: 1.5mm; font-size: 9pt; }
  .patient .owner { font-size: 8pt; color: #444; }
  .drug { margin-top: 1.5mm; font-size: 11pt; font-weight: 700; }
  .drug .generic { font-size: 8pt; font-weight: 400; color: #444; }
  .dosage { margin-top: 1mm; font-size: 10pt; font-weight: 700; }
  .instructions { margin-top: 1.5mm; padding: 1mm 1.5mm; background: #f4f4f4; font-size: 9.5pt; }
  .warn { margin-top: 1mm; padding: 1mm; border: 1px solid #b00; color: #b00; font-size: 8.5pt; font-weight: 700; }
  .withdrawal { margin-top: 1mm; font-size: 8.5pt; font-weight: 700; }
  .row { display: flex; justify-content: space-between; gap: 2mm; font-size: 8pt; }
  .row span { color: #555; }
  footer { margin-top: 1.5mm; border-top: 1px solid #ccc; padding-top: 1mm; }
`;

export function printDispenseLabel(data: DispenseLabelData) {
	const copies = Math.max(1, Math.min(5, data.copies ?? 1));
	const body = Array.from({ length: copies }, () => labelHtml(data)).join("");

	const win = window.open("", "_blank", "width=420,height=640");
	if (!win) return;

	win.document.write(
		`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">` +
			`<title>ملصق دواء — ${escapeHtml(data.patientName)}</title>` +
			`<style>${STYLES}</style></head><body>${body}</body></html>`,
	);
	win.document.close();
	win.focus();
	win.print();
}
