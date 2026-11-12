import type {
	RegistrationContractSnapshot,
	RegistrationContractStatus,
} from "../types/campaign-request.types";
import {
	formatContractShiftArabic,
	formatPaymentMethodArabic,
	formatProgramDatesText,
	resolveContractAcademyName,
} from "../components/print/service-agreement-print-document";

function escapeHtml(value: unknown): string {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function formatDateText(value?: string | null): string {
	if (!value) return "غير محدد";
	try {
		const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
		if (m) return `${m[3]}/${m[2]}/${m[1]}`;
		const d = new Date(value);
		if (Number.isNaN(d.getTime())) return value;
		return new Intl.DateTimeFormat("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			timeZone: "Africa/Cairo",
		}).format(d);
	} catch {
		return value;
	}
}

export function buildServiceAgreementPrintHtml(params: {
	snapshot: RegistrationContractSnapshot;
	contractStatus?: RegistrationContractStatus | null;
	reviewedBy?: string | null;
	reviewedAt?: string | null;
}): string {
	const { snapshot, contractStatus, reviewedBy, reviewedAt } = params;
	const academyName = resolveContractAcademyName(snapshot.academy?.name);
	const isFemale = snapshot.student.gender === "FEMALE";
	const studentNoun = isFemale ? "الطالبة" : "الطالب";
	const genderLabel =
		snapshot.student.gender === "MALE" ? "ذكر" : isFemale ? "أنثى" : "غير محدد";
	const shiftArabic = formatContractShiftArabic(snapshot.student.preferredShift);
	const attendanceLine =
		[snapshot.student.learningMode, shiftArabic].filter(Boolean).join(" • ") ||
		"حضوري في مقر الأكاديمية";
	const programDatesLabel = formatProgramDatesText(
		snapshot.programStartDate,
		snapshot.programEndDate,
	);
	const formattedAmount =
		snapshot.payment?.amount !== null &&
		snapshot.payment?.amount !== undefined &&
		Number.isFinite(snapshot.payment.amount)
			? `${snapshot.payment.amount.toLocaleString("en-US")} ${snapshot.payment.currency}`
			: "غير محدد";
	const paymentMethodLabel =
		snapshot.payment?.paymentMethodLabel ||
		formatPaymentMethodArabic(snapshot.payment?.paymentMethodType);
	const paymentMeta = snapshot.payment?.paidAt
		? `${paymentMethodLabel} (${formatDateText(snapshot.payment.paidAt)})`
		: paymentMethodLabel;
	const packageSubline = [
		snapshot.payment?.includeMeals ? "شامل الوجبات" : "بدون وجبات",
		snapshot.payment?.enableDailyStipend ? "مع المصروف اليومي" : null,
	]
		.filter(Boolean)
		.join(" • ");

	const ageCombo = [
		snapshot.student.birthDate ? `<span class="mono" dir="ltr">${escapeHtml(formatDateText(snapshot.student.birthDate))}</span>` : null,
		snapshot.student.ageLabel ? escapeHtml(snapshot.student.ageLabel) : null,
	]
		.filter(Boolean)
		.join(" • ") || "غير محدد";

	const medicalSection = snapshot.includeMedicalDeclaration
		? `
		<section class="section">
			<div class="sec-head sec-head-light">
				<span>ثالثاً: البيانات الصحية وإقرار السلامة</span>
				<span class="mono sub-code">MEDICAL DECLARATION</span>
			</div>
			<table>
				<tbody>
					<tr>
						<th scope="row" style="width:15%">فصيلة الدم</th>
						<td style="width:15%" class="mono" dir="ltr">${escapeHtml(snapshot.student.medical?.bloodType || "غير مسجلة")}</td>
						<th scope="row" style="width:15%">الحساسيات</th>
						<td style="width:22%">${escapeHtml(
							snapshot.student.medical?.allergies ||
								snapshot.student.medical?.allergiesList?.join("، ") ||
								"لا توجد حساسية مسجلة",
						)}</td>
						<th scope="row" style="width:15%">ملاحظات صحية</th>
						<td style="width:18%">${escapeHtml(
							snapshot.student.medical?.hasChronicDiseases &&
								snapshot.student.medical?.chronicDiseases
								? snapshot.student.medical.chronicDiseases
								: "لا توجد أمراض مزمنة",
						)}</td>
					</tr>
				</tbody>
			</table>
		</section>`
		: "";

	const termsHeading = snapshot.includeMedicalDeclaration ? "رابعاً" : "ثالثاً";

	return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
	<meta charset="utf-8" />
	<title>نموذج تقديم خدمة تعليمية - ${escapeHtml(snapshot.agreementCode)} - ${escapeHtml(snapshot.student.name)}</title>
	<style>
		@page {
			size: A4 portrait;
			margin: 12mm 11mm;
		}
		* {
			box-sizing: border-box;
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		}
		body {
			margin: 0;
			background: #ffffff;
			color: #18181b;
			font-family: "IBM Plex Sans Arabic", "Cairo", "Segoe UI", Tahoma, Arial, sans-serif;
			font-size: 11px;
			line-height: 1.5;
			direction: rtl;
		}
		.sheet {
			width: 100%;
			max-width: 188mm;
			margin: 0 auto;
		}
		.mono {
			font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		}
		.header {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 12px;
			border-bottom: 2px solid #18181b;
			padding-bottom: 10px;
			margin-bottom: 11px;
		}
		.brand {
			display: flex;
			align-items: flex-start;
			gap: 10px;
		}
		.monogram {
			width: 36px;
			height: 36px;
			border-radius: 6px;
			background: #18181b;
			color: #ffffff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 700;
			font-size: 13px;
			flex-shrink: 0;
		}
		.brand h1 {
			margin: 0;
			font-size: 14px;
			font-weight: 700;
			color: #18181b;
		}
		.brand p {
			margin: 2px 0 0;
			font-size: 10px;
			color: #52525b;
		}
		.doc-title {
			text-align: center;
		}
		.doc-badge {
			display: inline-block;
			padding: 5px 12px;
			background: #f4f4f5;
			border: 1px solid #d4d4d8;
			border-radius: 4px;
			font-size: 12px;
			font-weight: 700;
			color: #18181b;
		}
		.doc-en {
			margin-top: 3px;
			font-size: 8.5px;
			color: #71717a;
			letter-spacing: 0.4px;
		}
		.meta-box {
			background: #fafafa;
			border: 1px solid #e4e4e7;
			border-radius: 4px;
			padding: 6px 9px;
			min-width: 170px;
			font-size: 10px;
		}
		.meta-row {
			display: flex;
			justify-content: space-between;
			gap: 8px;
			margin-bottom: 2px;
		}
		.meta-row:last-child { margin-bottom: 0; }
		.meta-label { color: #71717a; }
		.preamble {
			background: #fafafa;
			border: 1px solid #e4e4e7;
			border-radius: 4px;
			padding: 7px 10px;
			margin-bottom: 10px;
			font-size: 10.5px;
			color: #3f3f46;
		}
		.section {
			margin-bottom: 10px;
			break-inside: avoid;
			page-break-inside: avoid;
		}
		.sec-head {
			background: #27272a;
			color: #ffffff;
			padding: 4.5px 10px;
			border-radius: 4px 4px 0 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 11px;
			font-weight: 700;
		}
		.sec-head-light {
			background: #f4f4f5;
			color: #18181b;
			border: 1px solid #d4d4d8;
			border-bottom: 0;
		}
		.sub-code {
			font-size: 9px;
			font-weight: 400;
			color: #d4d4d8;
		}
		.sec-head-light .sub-code { color: #71717a; }
		table {
			width: 100%;
			border-collapse: collapse;
			border: 1px solid #d4d4d8;
			font-size: 10.5px;
		}
		th, td {
			padding: 5.5px 8px;
			border-bottom: 1px solid #e4e4e7;
			border-left: 1px solid #e4e4e7;
			text-align: right;
			vertical-align: middle;
		}
		td:last-child, th:last-child { border-left: 0; }
		tr:last-child th, tr:last-child td { border-bottom: 0; }
		th {
			background: #fafafa;
			color: #3f3f46;
			font-weight: 600;
			width: 22%;
		}
		td { color: #18181b; width: 28%; }
		.bold { font-weight: 700; }
		.sub-note {
			display: block;
			font-size: 9px;
			font-weight: 400;
			color: #71717a;
			margin-top: 1px;
		}
		.terms {
			border: 1px solid #d4d4d8;
			border-radius: 4px;
			background: #fafafa;
			padding: 8px 11px;
			margin-bottom: 12px;
			break-inside: avoid;
			page-break-inside: avoid;
		}
		.terms h2 {
			margin: 0 0 5px;
			font-size: 11px;
			font-weight: 700;
			color: #18181b;
		}
		.terms ol {
			margin: 0;
			padding-right: 16px;
			font-size: 10px;
			color: #3f3f46;
		}
		.terms li { margin-bottom: 2.5px; }
		.extra-terms {
			margin-top: 6px;
			padding-top: 6px;
			border-top: 1px solid #e4e4e7;
			font-size: 10px;
			white-space: pre-line;
		}
		.signatures {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 14px;
			padding-top: 9px;
			border-top: 2px solid #d4d4d8;
			break-inside: avoid;
			page-break-inside: avoid;
		}
		.sig-box {
			border: 1px solid #d4d4d8;
			border-radius: 4px;
			padding: 9px 11px;
			background: #ffffff;
			font-size: 10.5px;
		}
		.sig-box-first { background: #fafafa; }
		.sig-title {
			font-weight: 700;
			margin: 0 0 4px;
			color: #18181b;
		}
		.sig-line {
			margin-top: 18px;
			border-bottom: 1px dashed #71717a;
		}
		.sig-foot {
			display: flex;
			justify-content: space-between;
			font-size: 9.5px;
			color: #71717a;
			margin-top: 4px;
		}
		.stamp {
			display: inline-block;
			margin-top: 7px;
			padding: 3px 8px;
			border: 1px solid #71717a;
			border-radius: 4px;
			font-size: 9.5px;
			font-weight: 700;
			color: #27272a;
		}
	</style>
</head>
<body>
	<div class="sheet">
		<header class="header">
			<div class="brand">
				<div class="monogram">سند</div>
				<div>
					<h1>${escapeHtml(academyName)}</h1>
					<p>إدارة القبول والتسجيل والخدمات التعليمية</p>
					${
						snapshot.academy?.address || snapshot.academy?.phone
							? `<p>${escapeHtml([snapshot.academy.address, snapshot.academy.phone].filter(Boolean).join(" • "))}</p>`
							: ""
					}
				</div>
			</div>

			<div class="doc-title">
				<div class="doc-badge">نموذج تقديم الخدمة التعليمية</div>
				<div class="doc-en mono">EDUCATIONAL SERVICE AGREEMENT</div>
			</div>

			<div class="meta-box">
				<div class="meta-row">
					<span class="meta-label">رقم الاتفاقية:</span>
					<span class="mono bold" dir="ltr">${escapeHtml(snapshot.agreementCode)}</span>
				</div>
				<div class="meta-row">
					<span class="meta-label">كود الطلب:</span>
					<span class="mono bold" dir="ltr">#${escapeHtml(snapshot.student.requestCode)}</span>
				</div>
				<div class="meta-row">
					<span class="meta-label">تاريخ الإصدار:</span>
					<span class="mono" dir="ltr">${escapeHtml(formatDateText(snapshot.issuedAt))}</span>
				</div>
				${
					contractStatus === "APPROVED"
						? `<div class="meta-row" style="border-top:1px solid #e4e4e7;padding-top:3px;margin-top:3px">
							<span class="meta-label">الحالة:</span>
							<span class="bold">معتمد وموثّق</span>
						</div>`
						: ""
				}
			</div>
		</header>

		<div class="preamble">
			عزيزي ولي الأمر / <strong>${escapeHtml(snapshot.guardian.name)}</strong>، يسعدنا اعتماد قبول التحاق ${escapeHtml(studentNoun)} /
			<strong>${escapeHtml(snapshot.student.name)}</strong> في <strong>${escapeHtml(academyName)}</strong>.
			توثّق هذه الوثيقة تفاصيل الخطة الأكاديمية والرسوم المسددة والضوابط التعاقدية المنظمة للخدمة التعليمية بين الطرفين، ويُعمل بها فور توقيعها يدوياً واعتمادها من إدارة الأكاديمية.
		</div>

		<section class="section">
			<div class="sec-head">
				<span>أولاً: بيانات أطراف الاتفاقية</span>
				<span class="mono sub-code">PARTIES DETAILS</span>
			</div>
			<table>
				<tbody>
					<tr>
						<th scope="row">الطرف الأول (مقدم الخدمة)</th>
						<td class="bold">${escapeHtml(academyName)}</td>
						<th scope="row">ممثل الأكاديمية</th>
						<td>${escapeHtml(snapshot.representativeName)}</td>
					</tr>
					<tr>
						<th scope="row">الطرف الثاني (ولي الأمر)</th>
						<td class="bold">${escapeHtml(snapshot.guardian.name)}</td>
						<th scope="row">رقم الهوية / الإقامة</th>
						<td class="mono" dir="ltr">${escapeHtml(snapshot.guardian.nationalId || "غير مسجل")}</td>
					</tr>
					<tr>
						<th scope="row">رقم التواصل (ولي الأمر)</th>
						<td class="mono" dir="ltr">${escapeHtml(snapshot.guardian.phone || "غير مسجل")}</td>
						<th scope="row">البريد الإلكتروني</th>
						<td class="mono" dir="ltr">${escapeHtml(snapshot.guardian.email || "غير مسجل")}</td>
					</tr>
				</tbody>
			</table>
		</section>

		<section class="section">
			<div class="sec-head">
				<span>ثانياً: بيانات ${escapeHtml(studentNoun)} والخطة التعليمية وتفاصيل السداد الفعلي</span>
				<span class="mono sub-code">ENROLLMENT &amp; PAYMENT</span>
			</div>
			<table>
				<tbody>
					<tr>
						<th scope="row">اسم ${escapeHtml(studentNoun)}</th>
						<td class="bold">${escapeHtml(snapshot.student.name)}</td>
						<th scope="row">تاريخ الميلاد / العمر</th>
						<td>${ageCombo}</td>
					</tr>
					<tr>
						<th scope="row">الجنس / الفصل المقترح</th>
						<td>${escapeHtml(genderLabel)}${snapshot.student.targetClass ? ` • ${escapeHtml(snapshot.student.targetClass)}` : ""}</td>
						<th scope="row">المسار الأكاديمي</th>
						<td>${escapeHtml(snapshot.student.proposedTrack || snapshot.student.targetClass || "المسار العام")}</td>
					</tr>
					<tr>
						<th scope="row">نظام الحضور والفترة</th>
						<td>${escapeHtml(attendanceLine)}</td>
						<th scope="row">فترة البرنامج</th>
						<td>${escapeHtml(programDatesLabel)}</td>
					</tr>
					<tr>
						<th scope="row">الباقة المعتمدة</th>
						<td>
							<span class="bold">${escapeHtml(snapshot.payment?.planName || "الباقة المعتمدة")}</span>
							<span class="sub-note">${escapeHtml(packageSubline)}</span>
						</td>
						<th scope="row">إجمالي الرسوم المسددة</th>
						<td class="mono bold">${escapeHtml(formattedAmount)}</td>
					</tr>
					<tr>
						<th scope="row">طريقة وتاريخ السداد</th>
						<td>${escapeHtml(paymentMeta)}</td>
						<th scope="row">مرجع السداد الموثّق</th>
						<td class="mono" dir="ltr">${escapeHtml(snapshot.payment?.paymentReference || snapshot.student.requestCode)}</td>
					</tr>
				</tbody>
			</table>
		</section>

		${medicalSection}

		<section class="terms">
			<h2>${escapeHtml(termsHeading)}: الشروط العامة وتعهد ولي الأمر</h2>
			<ol>
				<li>تلتزم الأكاديمية بتقديم البرنامج التعليمي والتأهيلي الموضح أعلاه وفق معايير الجودة والخطة الأكاديمية المعتمدة.</li>
				<li>يقر ولي الأمر بصحة جميع البيانات الشخصية والصحية المقدمة في ملف ${escapeHtml(studentNoun)}، ويلتزم بإخطار الأكاديمية فوراً بأي مستجدات صحية.</li>
				<li>يلتزم ولي الأمر باللوائح التنظيمية لمواعيد الحضور والانصراف وسياسات التواصل المعتمدة داخل الأكاديمية.</li>
				<li>لا تُعد هذه الوثيقة سارية بشكلها النهائي إلا بعد توقيع ولي الأمر يدوياً وإعادة رفعها واعتمادها من إدارة القبول والتسجيل.</li>
			</ol>
			${
				snapshot.additionalTerms
					? `<div class="extra-terms"><strong>بنود وشروط إضافية: </strong>${escapeHtml(snapshot.additionalTerms)}</div>`
					: ""
			}
		</section>

		<footer class="signatures">
			<div class="sig-box sig-box-first">
				<p class="sig-title">توقيع الطرف الأول (عن الأكاديمية)</p>
				<div>الاسم / الصفة: <strong>${escapeHtml(snapshot.representativeName)}</strong></div>
				${
					reviewedBy && contractStatus === "APPROVED"
						? `<div style="margin-top:3px;font-size:9.5px;color:#52525b">تم الاعتماد بواسطة: <strong>${escapeHtml(reviewedBy)}</strong>${reviewedAt ? ` (${escapeHtml(formatDateText(reviewedAt))})` : ""}</div>`
						: ""
				}
				<div class="sig-line"></div>
				<div class="sig-foot">
					<span>التوقيع والاعتماد</span>
					<span class="mono" dir="ltr">${escapeHtml(formatDateText(snapshot.issuedAt))}</span>
				</div>
				${snapshot.showStamp ? `<div class="stamp">ختم رسمي: ${escapeHtml(academyName)}</div>` : ""}
			</div>

			<div class="sig-box">
				<p class="sig-title">توقيع الطرف الثاني (ولي الأمر)</p>
				<div>الاسم: <strong>${escapeHtml(snapshot.guardian.name)}</strong></div>
				<div style="margin-top:2px">رقم الهوية: <span class="mono" dir="ltr">${escapeHtml(snapshot.guardian.nationalId || "........................")}</span></div>
				<div class="sig-line"></div>
				<div class="sig-foot">
					<span>التوقيع اليدوي</span>
					<span>التاريخ: .... / .... / 202..</span>
				</div>
			</div>
		</footer>
	</div>
</body>
</html>`;
}

export function printServiceAgreementDocument(params: {
	snapshot: RegistrationContractSnapshot;
	contractStatus?: RegistrationContractStatus | null;
	reviewedBy?: string | null;
	reviewedAt?: string | null;
}) {
	const html = buildServiceAgreementPrintHtml(params);
	const iframe = document.createElement("iframe");
	iframe.setAttribute("aria-hidden", "true");
	iframe.style.position = "fixed";
	iframe.style.right = "0";
	iframe.style.bottom = "0";
	iframe.style.width = "0";
	iframe.style.height = "0";
	iframe.style.border = "0";
	iframe.style.opacity = "0";
	document.body.appendChild(iframe);

	const previousTitle = document.title;
	const cleanCode = (params.snapshot.agreementCode || "AGR").replace(/[\\/:*?"<>|]/g, "-");
	const cleanName = (params.snapshot.student.name || "طالب").replace(/[\\/:*?"<>|]/g, "-");
	document.title = `نموذج-تقديم-خدمة-${cleanCode}-${cleanName}`;

	let cleanedUp = false;
	const cleanup = () => {
		if (cleanedUp) return;
		cleanedUp = true;
		document.title = previousTitle;
		if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
	};

	const win = iframe.contentWindow;
	if (!win) {
		cleanup();
		return;
	}

	win.document.open();
	win.document.write(html);
	win.document.close();

	window.setTimeout(() => {
		try {
			win.focus();
			win.addEventListener("afterprint", cleanup, { once: true });
			win.print();
		} finally {
			window.setTimeout(cleanup, 1800);
		}
	}, 180);
}
