import type { PatientConsentDetailResponse } from "@/server/patient-consents/patient-consents.type";

// طباعة الموافقة — مستند A4 يفتح نافذة طباعة المتصفح، على نمط
// print-operation-case.ts. المستند القانوني يجب أن يغادر الشاشة إلى الورق.

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

const fmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });
const at = (v: Date | string | null | undefined) => (v ? fmt.format(new Date(v)) : "—");

/**
 * يحوّل لقطة النص إلى HTML. اللقطة سطور بسيطة: `#` عنوان، `##` قسم، وسطور
 * الخيارات تبدأ بمربّع مؤشَّر أو فارغ.
 */
const snapshotToHtml = (snapshot: string): string =>
	snapshot
		.split("\n")
		.map((raw) => {
			const line = raw.trimEnd();
			if (!line.trim()) return "";
			if (line.startsWith("## ")) return `<h2>${escapeHtml(line.slice(3))}</h2>`;
			if (line.startsWith("# ")) return `<h1>${escapeHtml(line.slice(2))}</h1>`;
			const trimmed = line.trim();
			if (trimmed.startsWith("☑") || trimmed.startsWith("☐"))
				return `<p class="opt">${escapeHtml(trimmed)}</p>`;
			return `<p>${escapeHtml(trimmed)}</p>`;
		})
		.join("\n");

export const printConsent = (consent: PatientConsentDetailResponse) => {
	const win = window.open("", "_blank", "width=900,height=1000");
	if (!win) return;

	const signatureImg = consent.signatureUrl?.startsWith("data:image")
		? `<img class="sig" src="${consent.signatureUrl}" alt="التوقيع" />`
		: "";

	const signedBlock = consent.signedAt
		? `<div class="signed">
				<div><span class="k">الموقِّع:</span> ${escapeHtml(consent.signerName ?? "—")}${
					consent.signerRelationship ? ` (${escapeHtml(consent.signerRelationship)})` : ""
				}</div>
				<div><span class="k">تاريخ التوقيع:</span> ${at(consent.signedAt)}</div>
				${consent.witnessStaff ? `<div><span class="k">الشاهد:</span> ${escapeHtml(consent.witnessStaff.name)}</div>` : ""}
				${signatureImg}
			</div>`
		: `<div class="signed unsigned">
				<div class="line">توقيع وليّ الأمر/ـة: ............................................</div>
				<div class="line">التاريخ: ......../......../20........</div>
			</div>`;

	const revokedBanner = consent.revokedAt
		? `<div class="revoked">هذه الموافقة مُبطلة بتاريخ ${at(consent.revokedAt)} — السبب: ${escapeHtml(
				consent.revokeReason ?? "",
			)}</div>`
		: "";

	win.document.write(`<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(consent.template?.titleAr ?? "موافقة")} — ${escapeHtml(consent.patient.name)}</title>
<style>
	@page { size: A4; margin: 14mm; }
	* { box-sizing: border-box; }
	body { font-family: "Segoe UI", Tahoma, sans-serif; color: #0f172a; line-height: 1.7; font-size: 11pt; margin: 0; }
	h1 { font-size: 15pt; margin: 0 0 10px; text-align: center; }
	h2 { font-size: 12pt; margin: 14px 0 4px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; }
	p { margin: 4px 0; text-align: justify; }
	p.opt { margin-inline-start: 12px; text-align: start; }
	.meta { display: flex; flex-wrap: wrap; gap: 4px 24px; border: 1px solid #cbd5e1; padding: 8px 10px; margin-bottom: 12px; font-size: 10pt; }
	.k { color: #64748b; }
	.signed { margin-top: 22px; padding-top: 10px; border-top: 1px solid #cbd5e1; font-size: 10pt; }
	.signed .line { margin-top: 14px; }
	.sig { height: 70px; margin-top: 6px; border: 1px solid #e2e8f0; background: #fff; padding: 3px; }
	.revoked { border: 1px solid #dc2626; color: #b91c1c; padding: 6px 10px; margin-bottom: 10px; font-size: 10pt; }
	/* الطباعة تُظهر الحبر كما هو — الخلفيات الملوّنة تُهدر الحبر ولا تُفيد */
	@media print { body { -webkit-print-color-adjust: exact; } }
</style>
</head>
<body>
	${revokedBanner}
	<div class="meta">
		<div><span class="k">الطفل:</span> ${escapeHtml(consent.patient.name)} (${escapeHtml(consent.patient.code)})</div>
		<div><span class="k">وليّ الأمر:</span> ${escapeHtml(consent.owner.name)}</div>
		<div><span class="k">الهاتف:</span> ${escapeHtml(consent.owner.phone)}</div>
		<div><span class="k">أُنشئت:</span> ${at(consent.createdAt)}</div>
	</div>
	${snapshotToHtml(consent.textSnapshot)}
	${signedBlock}
	<script>window.onload = () => { window.print(); };</script>
</body>
</html>`);
	win.document.close();
};
