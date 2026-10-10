import {
	INJECTION_SITE_LABELS,
	VACCINE_ROUTE_LABELS,
	type VaccinationRecordResponse,
} from "@sanad/contracts/runtime/server/vaccinations/vaccinations.type";

/**
 * شهادة تطعيم بصيغة A4 عربية تُطبع من المتصفّح — نفس نمط
 * `print-operation-case.ts`. المستند يغادر الشاشة إلى الورق لأنه يُقدَّم لجهات
 * خارجية (السفر، الفنادق، البلدية) ويجب أن يحمل هوية الأكاديمية ورقم ترخيصها.
 *
 * أرقام الدفعات تُقرأ من لقطات السجل لا من علاقة الدفعة: الدفعة قد تُنظَّف بعد
 * سنوات، والشهادة يجب أن تظلّ تُثبت أي عبوة أُعطيت.
 */

export type CertificateClinic = {
	name: string;
	logo?: string | null;
	licenseNumber?: string | null;
	phone?: string | null;
	address?: string | null;
	city?: string | null;
};

export type CertificatePatient = {
	name: string;
	code: string;
	birthDate?: Date | string | null;
	gender?: string | null;
	animalTypeName?: string | null;
	animalStrainName?: string | null;
	ownerName?: string | null;
	ownerPhone?: string | null;
};

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const stampFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });

const day = (v: Date | string | null | undefined) => (v ? dateFmt.format(new Date(v)) : "—");

const row = (label: string, value: string) =>
	`<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`;

export function printVaccinationCertificate({
	clinic,
	patient,
	records,
	nextDueAt,
}: {
	clinic: CertificateClinic;
	patient: CertificatePatient;
	records: VaccinationRecordResponse[];
	nextDueAt?: Date | string | null;
}) {
	// السجلات المُبطلة لا تُطبع: الشهادة إثبات لما أُعطي فعلًا
	const live = records
		.filter((r) => !r.isVoided)
		.sort(
			(a, b) => new Date(a.administeredAt).getTime() - new Date(b.administeredAt).getTime(),
		);

	const doseRows = live
		.map((r) => {
			const vet = r.administeredBy
				? `${r.administeredBy.prefix ? `${r.administeredBy.prefix} ` : ""}${r.administeredBy.name}${
						r.administeredBy.licenseNumber ? ` (ترخيص ${r.administeredBy.licenseNumber})` : ""
					}`
				: "—";
			return `<tr>
	<td>${escapeHtml(day(r.administeredAt))}</td>
	<td>${escapeHtml(r.vaccineNameSnapshot)}</td>
	<td>${escapeHtml(r.manufacturerSnapshot ?? "—")}</td>
	<td class="lot">${escapeHtml(r.batchNo ?? "—")}</td>
	<td>${escapeHtml(day(r.batchExpiryDate))}</td>
	<td>${escapeHtml(VACCINE_ROUTE_LABELS[r.route])}${r.site ? ` / ${escapeHtml(INJECTION_SITE_LABELS[r.site])}` : ""}</td>
	<td>${escapeHtml(vet)}</td>
</tr>`;
		})
		.join("");

	// المدرّب الموقِّع هو مُعطي آخر جرعة — هو من يشهد على المستند
	const signer = live.at(-1)?.administeredBy ?? null;

	const identity = [clinic.city, clinic.address].filter(Boolean).join(" — ");

	const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8" />
<title>شهادة تطعيم — ${escapeHtml(patient.name)}</title>
<style>
	@page { size: A4; margin: 16mm 14mm; }
	body { font-family: "Segoe UI", Tahoma, sans-serif; color: #111; font-size: 12px; line-height: 1.7; }
	header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 14px; gap: 16px; }
	.brand { display: flex; align-items: center; gap: 10px; }
	.brand img { height: 46px; width: auto; object-fit: contain; }
	.clinic-name { font-size: 15px; font-weight: 700; margin: 0; }
	.meta { color: #555; font-size: 10px; }
	h1 { font-size: 15px; margin: 0 0 10px; text-align: center; letter-spacing: .5px; }
	h2 { font-size: 12px; border-bottom: 1px solid #999; padding-bottom: 2px; margin: 14px 0 6px; }
	table.kv { width: 100%; border-collapse: collapse; }
	table.kv th { text-align: start; width: 22%; color: #444; font-weight: 600; padding: 2px 0; vertical-align: top; }
	table.kv td { padding: 2px 0; }
	table.doses { width: 100%; border-collapse: collapse; margin-top: 4px; font-size: 11px; }
	table.doses th, table.doses td { border: 1px solid #bbb; padding: 4px 6px; text-align: start; }
	table.doses thead th { background: #f3f4f6; font-weight: 700; }
	/* رقم الدفعة يُقرأ رقمًا لا نصًّا عربيًا — LTR صريح يمنع انعكاس الشرطات */
	td.lot { direction: ltr; text-align: start; unicode-bidi: isolate; font-variant-numeric: tabular-nums; }
	.sign { margin-top: 26px; display: flex; justify-content: space-between; gap: 24px; }
	.sign div { flex: 1; }
	.sign .line { margin-top: 34px; border-top: 1px solid #111; padding-top: 4px; font-size: 11px; }
	.empty { color: #777; font-style: italic; }
	footer { margin-top: 18px; border-top: 1px solid #999; padding-top: 6px; color: #666; font-size: 10px; }
</style></head><body>
<header>
	<div class="brand">
		${clinic.logo ? `<img src="${escapeHtml(clinic.logo)}" alt="" />` : ""}
		<div>
			<p class="clinic-name">${escapeHtml(clinic.name)}</p>
			<span class="meta">${escapeHtml(
				[
					clinic.licenseNumber ? `رقم الترخيص: ${clinic.licenseNumber}` : "",
					clinic.phone ?? "",
					identity,
				]
					.filter(Boolean)
					.join(" · "),
			)}</span>
		</div>
	</div>
	<span class="meta">صدرت في ${escapeHtml(stampFmt.format(new Date()))}</span>
</header>

<h1>شهادة تطعيم</h1>

<table class="kv">
	${row("اسم الطفل", patient.name)}
	${row("رقم الملف", patient.code)}
	${row("النوع / السلالة", [patient.animalTypeName, patient.animalStrainName].filter(Boolean).join(" — ") || "—")}
	${row("تاريخ الميلاد", day(patient.birthDate))}
	${row("وليّ الأمر", [patient.ownerName, patient.ownerPhone].filter(Boolean).join(" — ") || "—")}
</table>

<h2>الجرعات المُعطاة</h2>
${
	doseRows
		? `<table class="doses">
	<thead><tr>
		<th>التاريخ</th><th>اللقاح</th><th>الشركة المصنّعة</th><th>رقم الدفعة</th>
		<th>انتهاء الصلاحية</th><th>الطريق / الموضع</th><th>المدرّب المُعطي</th>
	</tr></thead>
	<tbody>${doseRows}</tbody>
</table>`
		: `<p class="empty">لا توجد جرعات مسجَّلة لهذا الطفل.</p>`
}

${nextDueAt ? `<p><strong>الجرعة القادمة المستحقة:</strong> ${escapeHtml(day(nextDueAt))}</p>` : ""}

<div class="sign">
	<div>
		<div class="line">
			توقيع المدرّب${
				signer
					? ` — ${escapeHtml(`${signer.prefix ? `${signer.prefix} ` : ""}${signer.name}`)}${
							signer.licenseNumber ? ` (ترخيص ${escapeHtml(signer.licenseNumber)})` : ""
						}`
					: ""
			}
		</div>
	</div>
	<div><div class="line">ختم الأكاديمية</div></div>
</div>

<footer>وُلّدت من نظام أكاديمية سند — وحدة التطعيمات. أرقام الدفعات مأخوذة من سجل الصرف وقت الإعطاء.</footer>
<script>window.addEventListener("load", () => window.print());</script>
</body></html>`;

	const win = window.open("", "_blank", "width=900,height=1100");
	if (!win) return;
	win.document.write(html);
	win.document.close();
}
