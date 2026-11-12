import type {
	PublicContractSnapshot,
	PublicContractStatus,
} from "../types";

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

function formatShiftArabic(shift?: string | null): string | null {
	const raw = (shift || "").trim();
	if (!raw) return null;
	switch (raw.toUpperCase()) {
		case "MORNING":
			return "صباحي";
		case "EVENING":
			return "مسائي";
		case "AFTERNOON":
			return "بعد الظهر";
		case "FULL_DAY":
			return "دوام كامل";
		case "FLEXIBLE":
			return "مرن";
		default:
			return raw;
	}
}

function formatProgramDatesText(startDate?: string | null, endDate?: string | null): string {
	const start = startDate ? formatDateText(startDate) : null;
	const end = endDate ? formatDateText(endDate) : null;
	if (start && end && start !== "غير محدد" && end !== "غير محدد") {
		return `من ${start} إلى ${end}`;
	}
	if (start && start !== "غير محدد") {
		return `بدءاً من ${start}`;
	}
	if (end && end !== "غير محدد") {
		return `حتى ${end}`;
	}
	return "وفق التقويم الأكاديمي المعتمد";
}

interface ContractDisplayFields {
	isFemale: boolean;
	studentNoun: string;
	genderLabel: string;
	attendanceLine: string;
	programDatesLabel: string;
	formattedAmount: string;
	paymentMeta: string;
	packageSubline: string;
	birthDateFormatted: string | null;
	termsHeading: string;
}

function resolveContractDisplayFields(contract: PublicContractSnapshot): ContractDisplayFields {
	const isFemale = contract.student.gender === "FEMALE";
	const studentNoun = isFemale ? "الطالبة" : "الطالب";
	const genderLabel =
		contract.student.gender === "MALE" ? "ذكر" : isFemale ? "أنثى" : "غير محدد";
	const shiftArabic = formatShiftArabic(contract.student.preferredShift);
	const attendanceLine =
		[contract.student.learningMode, shiftArabic].filter(Boolean).join(" • ") ||
		"حضوري في مقر الأكاديمية";
	const programDatesLabel = formatProgramDatesText(
		contract.programStartDate,
		contract.programEndDate,
	);
	const formattedAmount =
		contract.payment.amount !== null && Number.isFinite(contract.payment.amount)
			? `${contract.payment.amount.toLocaleString("en-US")} ${contract.payment.currency}`
			: "غير محدد";
	const paymentMeta = contract.payment.paidAt
		? `${contract.payment.paymentMethodLabel} (${formatDateText(contract.payment.paidAt)})`
		: contract.payment.paymentMethodLabel;
	const packageSubline = [
		contract.payment.includeMeals ? "شامل الوجبات" : "بدون وجبات",
		contract.payment.enableDailyStipend ? "مع المصروف اليومي" : null,
	]
		.filter(Boolean)
		.join(" • ");
	const birthDateFormatted = contract.student.birthDate
		? formatDateText(contract.student.birthDate)
		: null;
	const termsHeading =
		contract.includeMedicalDeclaration && contract.student.medical ? "رابعاً" : "ثالثاً";

	return {
		isFemale,
		studentNoun,
		genderLabel,
		attendanceLine,
		programDatesLabel,
		formattedAmount,
		paymentMeta,
		packageSubline,
		birthDateFormatted,
		termsHeading,
	};
}

export function buildPublicContractPrintHtml(
	contract: PublicContractSnapshot,
	contractStatus: PublicContractStatus,
): string {
	const {
		studentNoun,
		genderLabel,
		attendanceLine,
		programDatesLabel,
		formattedAmount,
		paymentMeta,
		packageSubline,
		birthDateFormatted,
	} = resolveContractDisplayFields(contract);
	const ageCombo =
		[
			birthDateFormatted
				? `<span class="mono" dir="ltr">${escapeHtml(birthDateFormatted)}</span>`
				: null,
			contract.student.ageLabel ? escapeHtml(contract.student.ageLabel) : null,
		]
			.filter(Boolean)
			.join(" • ") || "غير محدد";

	const medicalSection =
		contract.includeMedicalDeclaration && contract.student.medical
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
						<td style="width:15%" class="mono" dir="ltr">${escapeHtml(contract.student.medical.bloodType || "غير مسجلة")}</td>
						<th scope="row" style="width:15%">الحساسيات</th>
						<td style="width:22%">${escapeHtml(
							contract.student.medical.allergies ||
								contract.student.medical.allergiesList?.join("، ") ||
								"لا توجد حساسية مسجلة",
						)}</td>
						<th scope="row" style="width:15%">ملاحظات صحية</th>
						<td style="width:18%">${escapeHtml(
							contract.student.medical.hasChronicDiseases &&
								contract.student.medical.chronicDiseases
								? contract.student.medical.chronicDiseases
								: "لا توجد أمراض مزمنة",
						)}</td>
					</tr>
				</tbody>
			</table>
		</section>`
			: "";

	const termsHeading =
		contract.includeMedicalDeclaration && contract.student.medical ? "رابعاً" : "ثالثاً";

	return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
	<meta charset="utf-8" />
	<title>نموذج تقديم خدمة تعليمية - ${escapeHtml(contract.agreementCode)} - ${escapeHtml(contract.student.name)}</title>
	<style>
		@page { size: A4 portrait; margin: 12mm 11mm; }
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
		.sheet { width: 100%; max-width: 188mm; margin: 0 auto; }
		.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
		.header {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 12px;
			border-bottom: 2px solid #18181b;
			padding-bottom: 10px;
			margin-bottom: 11px;
		}
		.brand { display: flex; align-items: flex-start; gap: 10px; }
		.monogram {
			width: 36px; height: 36px; border-radius: 6px;
			background: #18181b; color: #ffffff;
			display: flex; align-items: center; justify-content: center;
			font-weight: 700; font-size: 13px; flex-shrink: 0;
		}
		.brand h1 { margin: 0; font-size: 14px; font-weight: 700; color: #18181b; }
		.brand p { margin: 2px 0 0; font-size: 10px; color: #52525b; }
		.doc-title { text-align: center; }
		.doc-badge {
			display: inline-block; padding: 5px 12px;
			background: #f4f4f5; border: 1px solid #d4d4d8;
			border-radius: 4px; font-size: 12px; font-weight: 700; color: #18181b;
		}
		.doc-en { margin-top: 3px; font-size: 8.5px; color: #71717a; letter-spacing: 0.4px; }
		.meta-box {
			background: #fafafa; border: 1px solid #e4e4e7; border-radius: 4px;
			padding: 6px 9px; min-width: 170px; font-size: 10px;
		}
		.meta-row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 2px; }
		.meta-row:last-child { margin-bottom: 0; }
		.meta-label { color: #71717a; }
		.preamble {
			background: #fafafa; border: 1px solid #e4e4e7; border-radius: 4px;
			padding: 7px 10px; margin-bottom: 10px; font-size: 10.5px; color: #3f3f46;
		}
		.section { margin-bottom: 10px; break-inside: avoid; page-break-inside: avoid; }
		.sec-head {
			background: #27272a; color: #ffffff; padding: 4.5px 10px;
			border-radius: 4px 4px 0 0; display: flex; align-items: center;
			justify-content: space-between; font-size: 11px; font-weight: 700;
		}
		.sec-head-light {
			background: #f4f4f5; color: #18181b;
			border: 1px solid #d4d4d8; border-bottom: 0;
		}
		.sub-code { font-size: 9px; font-weight: 400; color: #d4d4d8; }
		.sec-head-light .sub-code { color: #71717a; }
		table { width: 100%; border-collapse: collapse; border: 1px solid #d4d4d8; font-size: 10.5px; }
		th, td {
			padding: 5.5px 8px; border-bottom: 1px solid #e4e4e7;
			border-left: 1px solid #e4e4e7; text-align: right; vertical-align: middle;
		}
		td:last-child, th:last-child { border-left: 0; }
		tr:last-child th, tr:last-child td { border-bottom: 0; }
		th { background: #fafafa; color: #3f3f46; font-weight: 600; width: 22%; }
		td { color: #18181b; width: 28%; }
		.bold { font-weight: 700; }
		.sub-note { display: block; font-size: 9px; font-weight: 400; color: #71717a; margin-top: 1px; }
		.terms {
			border: 1px solid #d4d4d8; border-radius: 4px; background: #fafafa;
			padding: 8px 11px; margin-bottom: 12px; break-inside: avoid; page-break-inside: avoid;
		}
		.terms h2 { margin: 0 0 5px; font-size: 11px; font-weight: 700; color: #18181b; }
		.terms ol { margin: 0; padding-right: 16px; font-size: 10px; color: #3f3f46; }
		.terms li { margin-bottom: 2.5px; }
		.extra-terms {
			margin-top: 6px; padding-top: 6px; border-top: 1px solid #e4e4e7;
			font-size: 10px; white-space: pre-line;
		}
		.signatures {
			display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
			padding-top: 9px; border-top: 2px solid #d4d4d8;
			break-inside: avoid; page-break-inside: avoid;
		}
		.sig-box {
			border: 1px solid #d4d4d8; border-radius: 4px;
			padding: 9px 11px; background: #ffffff; font-size: 10.5px;
		}
		.sig-box-first { background: #fafafa; }
		.sig-title { font-weight: 700; margin: 0 0 4px; color: #18181b; }
		.sig-line { margin-top: 18px; border-bottom: 1px dashed #71717a; }
		.sig-foot {
			display: flex; justify-content: space-between;
			font-size: 9.5px; color: #71717a; margin-top: 4px;
		}
		.stamp {
			display: inline-block; margin-top: 7px; padding: 3px 8px;
			border: 1px solid #71717a; border-radius: 4px;
			font-size: 9.5px; font-weight: 700; color: #27272a;
		}
	</style>
</head>
<body>
	<div class="sheet">
		<header class="header">
			<div class="brand">
				<div class="monogram">سند</div>
				<div>
					<h1>${escapeHtml(contract.academy.name)}</h1>
					<p>إدارة القبول والتسجيل والخدمات التعليمية</p>
					${
						contract.academy.address || contract.academy.phone
							? `<p>${escapeHtml([contract.academy.address, contract.academy.phone].filter(Boolean).join(" • "))}</p>`
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
					<span class="mono bold" dir="ltr">${escapeHtml(contract.agreementCode)}</span>
				</div>
				<div class="meta-row">
					<span class="meta-label">كود الطلب:</span>
					<span class="mono bold" dir="ltr">#${escapeHtml(contract.student.requestCode)}</span>
				</div>
				<div class="meta-row">
					<span class="meta-label">تاريخ الإصدار:</span>
					<span class="mono" dir="ltr">${escapeHtml(formatDateText(contract.issuedAt))}</span>
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
			عزيزي ولي الأمر / <strong>${escapeHtml(contract.guardian.name)}</strong>، مبارك قبول التحاق ${escapeHtml(studentNoun)} /
			<strong>${escapeHtml(contract.student.name)}</strong> في <strong>${escapeHtml(contract.academy.name)}</strong>.
			توثّق هذه الوثيقة تفاصيل الخطة الأكاديمية والرسوم المسددة والشروط المنظمة للخدمة التعليمية، ويُرجى طباعتها وتوقيعها يدوياً ثم إعادة رفعها عبر هذه البوابة.
		</div>

		<section class="section">
			<div class="sec-head">
				<span>أولاً: بيانات أطراف الاتفاقية</span>
				<span class="mono sub-code">PARTIES DETAILS</span>
			</div>
			<table>
				<tbody>
					<tr>
						<th scope="row">الطرف الأول (الأكاديمية)</th>
						<td class="bold">${escapeHtml(contract.academy.name)}</td>
						<th scope="row">ممثل الأكاديمية</th>
						<td>${escapeHtml(contract.representativeName)}</td>
					</tr>
					<tr>
						<th scope="row">الطرف الثاني (ولي الأمر)</th>
						<td class="bold">${escapeHtml(contract.guardian.name)}</td>
						<th scope="row">رقم الهوية / الإقامة</th>
						<td class="mono" dir="ltr">${escapeHtml(contract.guardian.nationalId || "غير مسجل")}</td>
					</tr>
					<tr>
						<th scope="row">رقم الجوال المسجل</th>
						<td class="mono" dir="ltr">${escapeHtml(contract.guardian.phone || "غير مسجل")}</td>
						<th scope="row">البريد الإلكتروني</th>
						<td class="mono" dir="ltr">${escapeHtml(contract.guardian.email || "غير مسجل")}</td>
					</tr>
				</tbody>
			</table>
		</section>

		<section class="section">
			<div class="sec-head">
				<span>ثانياً: بيانات ${escapeHtml(studentNoun)} والخطة الأكاديمية والسداد الفعلي</span>
				<span class="mono sub-code">ENROLLMENT &amp; PAYMENT</span>
			</div>
			<table>
				<tbody>
					<tr>
						<th scope="row">اسم ${escapeHtml(studentNoun)}</th>
						<td class="bold">${escapeHtml(contract.student.name)}</td>
						<th scope="row">تاريخ الميلاد / العمر</th>
						<td>${ageCombo}</td>
					</tr>
					<tr>
						<th scope="row">الجنس / الفصل المقترح</th>
						<td>${escapeHtml(genderLabel)}${contract.student.targetClass ? ` • ${escapeHtml(contract.student.targetClass)}` : ""}</td>
						<th scope="row">المسار الأكاديمي</th>
						<td>${escapeHtml(contract.student.proposedTrack || contract.student.targetClass || "المسار العام")}</td>
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
							<span class="bold">${escapeHtml(contract.payment.planName || "الباقة المعتمدة")}</span>
							<span class="sub-note">${escapeHtml(packageSubline)}</span>
						</td>
						<th scope="row">إجمالي الرسوم المسددة</th>
						<td class="mono bold">${escapeHtml(formattedAmount)}</td>
					</tr>
					<tr>
						<th scope="row">طريقة وتاريخ السداد</th>
						<td>${escapeHtml(paymentMeta)}</td>
						<th scope="row">مرجع السداد الموثّق</th>
						<td class="mono" dir="ltr">${escapeHtml(contract.payment.paymentReference || contract.student.requestCode)}</td>
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
				contract.additionalTerms
					? `<div class="extra-terms"><strong>بنود وشروط إضافية: </strong>${escapeHtml(contract.additionalTerms)}</div>`
					: ""
			}
		</section>

		<footer class="signatures">
			<div class="sig-box sig-box-first">
				<p class="sig-title">توقيع الطرف الأول (عن الأكاديمية)</p>
				<div>الاسم / الصفة: <strong>${escapeHtml(contract.representativeName)}</strong></div>
				<div class="sig-line"></div>
				<div class="sig-foot">
					<span>التوقيع والاعتماد</span>
					<span class="mono" dir="ltr">${escapeHtml(formatDateText(contract.issuedAt))}</span>
				</div>
				${contract.showStamp ? `<div class="stamp">ختم رسمي: ${escapeHtml(contract.academy.name)}</div>` : ""}
			</div>

			<div class="sig-box">
				<p class="sig-title">توقيع الطرف الثاني (ولي الأمر)</p>
				<div>الاسم: <strong>${escapeHtml(contract.guardian.name)}</strong></div>
				<div style="margin-top:2px">رقم الهوية: <span class="mono" dir="ltr">${escapeHtml(contract.guardian.nationalId || "........................")}</span></div>
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

export function printPublicContractDocument(
	contract: PublicContractSnapshot,
	contractStatus: PublicContractStatus,
) {
	const html = buildPublicContractPrintHtml(contract, contractStatus);
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
	const cleanCode = (contract.agreementCode || "AGR").replace(/[\\/:*?"<>|]/g, "-");
	const cleanName = (contract.student.name || "طالب").replace(/[\\/:*?"<>|]/g, "-");
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
		if (typeof window !== "undefined") window.print();
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
		} catch {
			if (typeof window !== "undefined") window.print();
		} finally {
			window.setTimeout(cleanup, 1800);
		}
	}, 180);
}

/** تغليف صورة JPEG داخل ملف PDF قياسي أحادي الصفحة (A4) بجداول xref دقيقة. */
function buildSinglePagePdfFromJpeg(
	jpegBytes: Uint8Array,
	imgWidth: number,
	imgHeight: number,
): Uint8Array {
	const pageW = 595.28;
	const pageH = 841.89;
	const enc = new TextEncoder();
	const parts: Uint8Array[] = [];
	const offsets: number[] = [];
	let pos = 0;

	const pushAscii = (text: string) => {
		const bytes = enc.encode(text);
		parts.push(bytes);
		pos += bytes.length;
	};
	const pushBytes = (bytes: Uint8Array) => {
		parts.push(bytes);
		pos += bytes.length;
	};

	pushAscii("%PDF-1.4\n");
	pushBytes(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

	offsets[1] = pos;
	pushAscii("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

	offsets[2] = pos;
	pushAscii("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

	offsets[3] = pos;
	pushAscii(
		`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
	);

	offsets[4] = pos;
	pushAscii(
		`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,
	);
	pushBytes(jpegBytes);
	pushAscii("\nendstream\nendobj\n");

	const contentStr = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
	offsets[5] = pos;
	pushAscii(`5 0 obj\n<< /Length ${contentStr.length} >>\nstream\n${contentStr}endstream\nendobj\n`);

	const xrefPos = pos;
	pushAscii("xref\n0 6\n0000000000 65535 f \n");
	for (let i = 1; i <= 5; i += 1) {
		pushAscii(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
	}
	pushAscii(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`);

	const output = new Uint8Array(pos);
	let writeCursor = 0;
	for (const chunk of parts) {
		output.set(chunk, writeCursor);
		writeCursor += chunk.length;
	}
	return output;
}

function triggerBlobDownload(blob: Blob, fileName: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	window.setTimeout(() => {
		if (link.parentNode) link.parentNode.removeChild(link);
		URL.revokeObjectURL(url);
	}, 1500);
}

function drawRoundedBox(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
	fill?: string,
	stroke?: string,
	lineWidth = 1,
) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fill();
	}
	if (stroke) {
		ctx.strokeStyle = stroke;
		ctx.lineWidth = lineWidth;
		ctx.stroke();
	}
}

function wrapCanvasLines(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
): string[] {
	const words = (text || "").trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return [""];
	const lines: string[] = [];
	let current = words[0];
	for (let i = 1; i < words.length; i += 1) {
		const candidate = `${current} ${words[i]}`;
		if (ctx.measureText(candidate).width <= maxWidth) {
			current = candidate;
		} else {
			lines.push(current);
			current = words[i];
		}
	}
	lines.push(current);
	return lines;
}

/** تنزيل نموذج تقديم الخدمة التعليمية كملف PDF أحادي الصفحة بمقاس A4 مباشرة دون فتح نافذة الطباعة. */
export async function downloadPublicContractPdf(
	contract: PublicContractSnapshot,
	contractStatus: PublicContractStatus,
): Promise<void> {
	const cleanCode = (contract.agreementCode || "AGR").replace(/[\\/:*?"<>|]/g, "-");
	const cleanName = (contract.student.name || "طالب").replace(/[\\/:*?"<>|]/g, "-");
	const pdfFileName = `نموذج-تقديم-خدمة-${cleanCode}-${cleanName}.pdf`;

	if (typeof document === "undefined") return;
	if ("fonts" in document && document.fonts?.ready) {
		await document.fonts.ready.catch(() => undefined);
	}

	const fields = resolveContractDisplayFields(contract);
	const W = 1190;
	const H = 1684;
	const canvas = document.createElement("canvas");
	canvas.width = W;
	canvas.height = H;
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		const html = buildPublicContractPrintHtml(contract, contractStatus);
		triggerBlobDownload(
			new Blob([html], { type: "text/html;charset=utf-8" }),
			pdfFileName.replace(/\.pdf$/, ".html"),
		);
		return;
	}

	const bodyFont = getComputedStyle(document.body).fontFamily || "Arial, Tahoma, sans-serif";
	const monoFont = '"Courier New", Consolas, monospace';

	// خلفية بيضاء قياسية للطباعة A4
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, W, H);

	const padX = 58;
	const rightEdge = W - padX;
	const leftEdge = padX;
	const contentW = rightEdge - leftEdge;
	let y = 52;

	// 1. الرأس الرسمي للوثيقة (Header)
	// شعار الأكاديمية (يمين في RTL)
	drawRoundedBox(ctx, rightEdge - 66, y, 66, 66, 12, "#18181b");
	ctx.fillStyle = "#ffffff";
	ctx.font = `700 26px ${bodyFont}`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.direction = "rtl";
	ctx.fillText("سند", rightEdge - 33, y + 34);

	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillStyle = "#09090b";
	ctx.font = `800 22px ${bodyFont}`;
	ctx.fillText(contract.academy.name, rightEdge - 82, y + 6);

	ctx.fillStyle = "#52525b";
	ctx.font = `500 13px ${bodyFont}`;
	ctx.fillText("إدارة القبول والتسجيل والخدمات التعليمية", rightEdge - 82, y + 38);

	// بطاقة العنوان الوسطى
	const badgeW = 286;
	const badgeX = leftEdge + (contentW - badgeW) / 2 - 20;
	drawRoundedBox(ctx, badgeX, y + 4, badgeW, 38, 8, "#f4f4f5", "#d4d4d8", 1);
	ctx.fillStyle = "#09090b";
	ctx.font = `800 17px ${bodyFont}`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("نموذج تقديم الخدمة التعليمية", badgeX + badgeW / 2, y + 23);

	ctx.fillStyle = "#71717a";
	ctx.font = `600 10px ${monoFont}`;
	ctx.direction = "ltr";
	ctx.fillText("EDUCATIONAL SERVICE AGREEMENT", badgeX + badgeW / 2, y + 54);
	ctx.direction = "rtl";

	// جدول البيانات المرجعية على اليسار
	const metaW = 248;
	const metaX = leftEdge;
	drawRoundedBox(ctx, metaX, y, metaW, 84, 8, "#fafafa", "#e4e4e7", 1);
	const metaRows = [
		{ label: "رقم الاتفاقية:", val: contract.agreementCode },
		{ label: "كود الطالب:", val: `#${contract.student.requestCode}` },
		{ label: "تاريخ الإصدار:", val: formatDateText(contract.issuedAt) },
	];
	metaRows.forEach((row, idx) => {
		const rowY = y + 18 + idx * 24;
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		ctx.direction = "rtl";
		ctx.fillStyle = "#71717a";
		ctx.font = `600 12px ${bodyFont}`;
		ctx.fillText(row.label, metaX + metaW - 12, rowY);

		ctx.textAlign = "left";
		ctx.direction = "ltr";
		ctx.fillStyle = "#09090b";
		ctx.font = `700 12px ${monoFont}`;
		ctx.fillText(row.val, metaX + 12, rowY);
	});
	ctx.direction = "rtl";

	y += 102;
	ctx.strokeStyle = "#18181b";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(leftEdge, y);
	ctx.lineTo(rightEdge, y);
	ctx.stroke();

	y += 16;

	// 2. التمهيد الموحد
	const preambleText = `عزيزي ولي الأمر / ${contract.guardian.name}، مبارك قبول التحاق ${fields.studentNoun} / ${contract.student.name} في ${contract.academy.name}. توثّق هذه الوثيقة تفاصيل الخطة الأكاديمية والرسوم المسددة والشروط المنظمة للخدمة التعليمية، ويُرجى طباعتها وتوقيعها يدوياً ثم إعادة رفعها عبر البوابة الرسمية.`;
	ctx.font = `500 14px ${bodyFont}`;
	const preambleLines = wrapCanvasLines(ctx, preambleText, contentW - 36);
	const preambleH = 22 + preambleLines.length * 23;
	drawRoundedBox(ctx, leftEdge, y, contentW, preambleH, 8, "#fafafa", "#e4e4e7", 1);
	ctx.fillStyle = "#27272a";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	preambleLines.forEach((line, idx) => {
		ctx.fillText(line, rightEdge - 18, y + 12 + idx * 23);
	});
	y += preambleH + 16;

	// دالة موحدة لرسم جداول البيانات (4 أعمدة RTL)
	type TableRow = {
		k1: string;
		v1: string;
		v1Ltr?: boolean;
		v1Bold?: boolean;
		k2: string;
		v2: string;
		v2Ltr?: boolean;
		v2Bold?: boolean;
	};
	const drawSectionTable = (
		title: string,
		enCode: string,
		rows: TableRow[],
		lightHeader = false,
	) => {
		const headH = 34;
		drawRoundedBox(
			ctx,
			leftEdge,
			y,
			contentW,
			headH,
			6,
			lightHeader ? "#f4f4f5" : "#18181b",
			lightHeader ? "#e4e4e7" : undefined,
			1,
		);
		ctx.textBaseline = "middle";
		ctx.textAlign = "right";
		ctx.direction = "rtl";
		ctx.fillStyle = lightHeader ? "#09090b" : "#ffffff";
		ctx.font = `700 14px ${bodyFont}`;
		ctx.fillText(title, rightEdge - 14, y + headH / 2);

		ctx.textAlign = "left";
		ctx.direction = "ltr";
		ctx.fillStyle = lightHeader ? "#71717a" : "#d4d4d8";
		ctx.font = `600 11px ${monoFont}`;
		ctx.fillText(enCode, leftEdge + 14, y + headH / 2);
		ctx.direction = "rtl";

		y += headH;

		const colWidths = [
			contentW * 0.17, // k1 (يمين)
			contentW * 0.33, // v1
			contentW * 0.17, // k2
			contentW * 0.33, // v2 (يسار)
		];
		const rowH = 38;
		rows.forEach((r) => {
			let curRight = rightEdge;
			const cells = [
				{ text: r.k1, w: colWidths[0], isKey: true, ltr: false, bold: false },
				{ text: r.v1, w: colWidths[1], isKey: false, ltr: Boolean(r.v1Ltr), bold: Boolean(r.v1Bold) },
				{ text: r.k2, w: colWidths[2], isKey: true, ltr: false, bold: false },
				{ text: r.v2, w: colWidths[3], isKey: false, ltr: Boolean(r.v2Ltr), bold: Boolean(r.v2Bold) },
			];
			cells.forEach((cell) => {
				const cellX = curRight - cell.w;
				ctx.fillStyle = cell.isKey ? "#fafafa" : "#ffffff";
				ctx.fillRect(cellX, y, cell.w, rowH);
				ctx.strokeStyle = "#e4e4e7";
				ctx.lineWidth = 1;
				ctx.strokeRect(cellX, y, cell.w, rowH);

				ctx.textBaseline = "middle";
				ctx.fillStyle = cell.isKey ? "#52525b" : "#09090b";
				if (cell.ltr) {
					ctx.textAlign = "right";
					ctx.direction = "ltr";
					ctx.font = `${cell.bold ? 700 : 500} 13px ${monoFont}`;
					ctx.fillText(cell.text, curRight - 12, y + rowH / 2, cell.w - 22);
				} else {
					ctx.textAlign = "right";
					ctx.direction = "rtl";
					ctx.font = `${cell.isKey ? 600 : cell.bold ? 700 : 500} 13px ${bodyFont}`;
					ctx.fillText(cell.text, curRight - 12, y + rowH / 2, cell.w - 22);
				}
				curRight -= cell.w;
			});
			y += rowH;
		});
		ctx.direction = "rtl";
		y += 16;
	};

	// 3. أولاً: بيانات أطراف الاتفاقية
	drawSectionTable("أولاً: بيانات أطراف الاتفاقية", "PARTIES DETAILS", [
		{
			k1: "الطرف الأول (الأكاديمية)",
			v1: contract.academy.name,
			v1Bold: true,
			k2: "ممثل الأكاديمية",
			v2: contract.representativeName,
		},
		{
			k1: "الطرف الثاني (ولي الأمر)",
			v1: contract.guardian.name,
			v1Bold: true,
			k2: "رقم الهوية / الإقامة",
			v2: contract.guardian.nationalId || "غير مسجل",
			v2Ltr: Boolean(contract.guardian.nationalId),
		},
		{
			k1: "رقم الجوال المسجل",
			v1: contract.guardian.phone || "غير مسجل",
			v1Ltr: Boolean(contract.guardian.phone),
			k2: "البريد الإلكتروني",
			v2: contract.guardian.email || "غير مسجل",
			v2Ltr: Boolean(contract.guardian.email),
		},
	]);

	// 4. ثانياً: بيانات الطالب والخطة والسداد
	const ageComboText =
		[fields.birthDateFormatted, contract.student.ageLabel].filter(Boolean).join(" • ") ||
		"غير محدد";
	const planFullText = `${contract.payment.planName || "الباقة المعتمدة"} (${fields.packageSubline})`;
	drawSectionTable(
		`ثانياً: بيانات ${fields.studentNoun} والخطة الأكاديمية والسداد الفعلي`,
		"ENROLLMENT & PAYMENT",
		[
			{
				k1: `اسم ${fields.studentNoun}`,
				v1: contract.student.name,
				v1Bold: true,
				k2: "تاريخ الميلاد / العمر",
				v2: ageComboText,
			},
			{
				k1: "الجنس / الفصل المقترح",
				v1: `${fields.genderLabel}${contract.student.targetClass ? ` • ${contract.student.targetClass}` : ""}`,
				k2: "المسار الأكاديمي",
				v2: contract.student.proposedTrack || contract.student.targetClass || "المسار العام",
			},
			{
				k1: "نظام الحضور والفترة",
				v1: fields.attendanceLine,
				k2: "فترة البرنامج",
				v2: fields.programDatesLabel,
			},
			{
				k1: "الباقة المعتمدة",
				v1: planFullText,
				v1Bold: true,
				k2: "إجمالي الرسوم المسددة",
				v2: fields.formattedAmount,
				v2Bold: true,
			},
			{
				k1: "طريقة وتاريخ السداد",
				v1: fields.paymentMeta,
				k2: "مرجع السداد الموثّق",
				v2: contract.payment.paymentReference || contract.student.requestCode,
				v2Ltr: true,
			},
		],
	);

	// 5. ثالثاً (اختياري): البيانات الصحية
	if (contract.includeMedicalDeclaration && contract.student.medical) {
		drawSectionTable(
			"ثالثاً: البيانات الصحية وإقرار السلامة",
			"MEDICAL DECLARATION",
			[
				{
					k1: "فصيلة الدم",
					v1: contract.student.medical.bloodType || "غير مسجلة",
					v1Ltr: Boolean(contract.student.medical.bloodType),
					k2: "الحساسيات",
					v2:
						contract.student.medical.allergies ||
						contract.student.medical.allergiesList?.join("، ") ||
						"لا توجد حساسية مسجلة",
				},
				{
					k1: "ملاحظات صحية",
					v1:
						contract.student.medical.hasChronicDiseases &&
						contract.student.medical.chronicDiseases
							? contract.student.medical.chronicDiseases
							: "لا توجد أمراض مزمنة",
					k2: "حالة الإفصاح الطبي",
					v2: "مؤكد من ولي الأمر",
				},
			],
			true,
		);
	}

	// 6. الشروط العامة وتعهد ولي الأمر
	const termItems = [
		"1. تلتزم الأكاديمية بتقديم البرنامج التعليمي والتأهيلي الموضح أعلاه وفق معايير الجودة والخطة الأكاديمية المعتمدة.",
		`2. يقر ولي الأمر بصحة جميع البيانات الشخصية والصحية المقدمة في ملف ${fields.studentNoun}، ويلتزم بإخطار الأكاديمية فوراً بأي مستجدات صحية.`,
		"3. يلتزم ولي الأمر باللوائح التنظيمية لمواعيد الحضور والانصراف وسياسات التواصل المعتمدة داخل الأكاديمية.",
		"4. لا تُعد هذه الوثيقة سارية بشكلها النهائي إلا بعد توقيع ولي الأمر يدوياً وإعادة رفعها واعتمادها من إدارة القبول والتسجيل.",
	];

	ctx.font = `500 13px ${bodyFont}`;
	const wrappedTermLines: string[] = [];
	termItems.forEach((item) => {
		wrappedTermLines.push(...wrapCanvasLines(ctx, item, contentW - 36));
	});
	const extraLines = contract.additionalTerms
		? wrapCanvasLines(ctx, `بنود وشروط إضافية: ${contract.additionalTerms}`, contentW - 44)
		: [];

	const termsBoxH =
		48 +
		wrappedTermLines.length * 22 +
		(extraLines.length > 0 ? 18 + extraLines.length * 22 : 0) +
		14;

	drawRoundedBox(ctx, leftEdge, y, contentW, termsBoxH, 8, "#fafafa", "#e4e4e7", 1);
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillStyle = "#09090b";
	ctx.font = `700 14px ${bodyFont}`;
	ctx.fillText(`${fields.termsHeading}: الشروط العامة وتعهد ولي الأمر`, rightEdge - 16, y + 14);

	let ty = y + 42;
	ctx.fillStyle = "#27272a";
	ctx.font = `500 13px ${bodyFont}`;
	wrappedTermLines.forEach((line) => {
		ctx.fillText(line, rightEdge - 16, ty);
		ty += 22;
	});

	if (extraLines.length > 0) {
		ty += 6;
		ctx.strokeStyle = "#d4d4d8";
		ctx.setLineDash([4, 4]);
		ctx.beginPath();
		ctx.moveTo(leftEdge + 16, ty);
		ctx.lineTo(rightEdge - 16, ty);
		ctx.stroke();
		ctx.setLineDash([]);
		ty += 10;
		ctx.fillStyle = "#18181b";
		ctx.font = `600 13px ${bodyFont}`;
		extraLines.forEach((line) => {
			ctx.fillText(line, rightEdge - 16, ty);
			ty += 22;
		});
	}

	y += termsBoxH + 22;

	// 7. مربعات التوقيع اليدوي والختم الرسمي
	const sigGap = 20;
	const sigW = (contentW - sigGap) / 2;
	const sigH = 158;
	const sigBoxY = Math.min(y, H - sigH - 64);

	// الطرف الأول (الأكاديمية - يمين)
	const sig1X = rightEdge - sigW;
	drawRoundedBox(ctx, sig1X, sigBoxY, sigW, sigH, 8, "#fafafa", "#d4d4d8", 1);
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillStyle = "#09090b";
	ctx.font = `700 14px ${bodyFont}`;
	ctx.fillText("توقيع الطرف الأول (عن الأكاديمية)", sig1X + sigW - 18, sigBoxY + 14);

	ctx.fillStyle = "#3f3f46";
	ctx.font = `500 13px ${bodyFont}`;
	ctx.fillText(`الاسم / الصفة: ${contract.representativeName}`, sig1X + sigW - 18, sigBoxY + 42);

	ctx.strokeStyle = "#a1a1aa";
	ctx.setLineDash([4, 4]);
	ctx.beginPath();
	ctx.moveTo(sig1X + 18, sigBoxY + 104);
	ctx.lineTo(sig1X + sigW - 18, sigBoxY + 104);
	ctx.stroke();
	ctx.setLineDash([]);

	ctx.fillStyle = "#71717a";
	ctx.font = `500 12px ${bodyFont}`;
	ctx.fillText("التوقيع والاعتماد", sig1X + sigW - 18, sigBoxY + 114);
	ctx.textAlign = "left";
	ctx.direction = "ltr";
	ctx.font = `600 12px ${monoFont}`;
	ctx.fillText(formatDateText(contract.issuedAt), sig1X + 18, sigBoxY + 114);
	ctx.direction = "rtl";

	if (contract.showStamp) {
		ctx.textAlign = "right";
		ctx.fillStyle = "#52525b";
		ctx.font = `700 11px ${bodyFont}`;
		ctx.fillText(`ختم رسمي: ${contract.academy.name}`, sig1X + sigW - 18, sigBoxY + 135);
	}

	// الطرف الثاني (ولي الأمر - يسار)
	const sig2X = leftEdge;
	drawRoundedBox(ctx, sig2X, sigBoxY, sigW, sigH, 8, "#ffffff", "#d4d4d8", 1);
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillStyle = "#09090b";
	ctx.font = `700 14px ${bodyFont}`;
	ctx.fillText("توقيع الطرف الثاني (ولي الأمر)", sig2X + sigW - 18, sigBoxY + 14);

	ctx.fillStyle = "#3f3f46";
	ctx.font = `500 13px ${bodyFont}`;
	ctx.fillText(`الاسم: ${contract.guardian.name}`, sig2X + sigW - 18, sigBoxY + 42);
	ctx.fillText(
		`رقم الهوية: ${contract.guardian.nationalId || "........................"}`,
		sig2X + sigW - 18,
		sigBoxY + 66,
	);

	ctx.strokeStyle = "#a1a1aa";
	ctx.setLineDash([4, 4]);
	ctx.beginPath();
	ctx.moveTo(sig2X + 18, sigBoxY + 104);
	ctx.lineTo(sig2X + sigW - 18, sigBoxY + 104);
	ctx.stroke();
	ctx.setLineDash([]);

	ctx.fillStyle = "#71717a";
	ctx.font = `500 12px ${bodyFont}`;
	ctx.fillText("التوقيع اليدوي", sig2X + sigW - 18, sigBoxY + 114);
	ctx.textAlign = "left";
	ctx.fillText("التاريخ: .... / .... / 202..", sig2X + 18, sigBoxY + 114);

	// 8. تذييل المرجع السريع أسفل الصفحة
	ctx.textAlign = "center";
	ctx.fillStyle = "#a1a1aa";
	ctx.font = `500 11px ${monoFont}`;
	ctx.direction = "ltr";
	ctx.fillText(
		`SANAD ACADEMY • ${contract.agreementCode} • REF #${contract.student.requestCode}`,
		W / 2,
		H - 34,
	);

	try {
		const dataUrl = canvas.toDataURL("image/jpeg", 0.94);
		const base64 = dataUrl.split(",")[1] || "";
		const binary = atob(base64);
		const jpegBytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i += 1) {
			jpegBytes[i] = binary.charCodeAt(i);
		}
		const pdfBytes = buildSinglePagePdfFromJpeg(jpegBytes, W, H);
		const pdfArrayBuffer = new ArrayBuffer(pdfBytes.byteLength);
		new Uint8Array(pdfArrayBuffer).set(pdfBytes);
		triggerBlobDownload(
			new Blob([pdfArrayBuffer], { type: "application/pdf" }),
			pdfFileName,
		);
	} catch {
		const html = buildPublicContractPrintHtml(contract, contractStatus);
		triggerBlobDownload(
			new Blob([html], { type: "text/html;charset=utf-8" }),
			pdfFileName.replace(/\.pdf$/, ".html"),
		);
	}
}
