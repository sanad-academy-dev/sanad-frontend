import type { RegistrationPaymentReceiptData } from "../types/campaign-request.types";
import {
	formatMoneyNumber,
	formatPaymentMethodLabelArabic,
} from "./payment-helpers";

function escapeHtml(value: unknown): string {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function formatReceiptDateTime(iso: string): string {
	const parsed = new Date(iso);
	if (Number.isNaN(parsed.getTime())) return iso;
	return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(parsed);
}

function formatReceiptShortDate(iso: string): string {
	const parsed = new Date(iso);
	if (Number.isNaN(parsed.getTime())) return iso;
	return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(parsed);
}

export function buildPaymentReceiptHtml(receipt: RegistrationPaymentReceiptData): string {
	const methodLabel = formatPaymentMethodLabelArabic(
		receipt.paymentMethodType,
		receipt.paymentGateway,
	);
	const formattedAmount = `${formatMoneyNumber(receipt.amount)} ${receipt.currency}`;
	const formattedDiscount = `${formatMoneyNumber(receipt.discountAmount)} ${receipt.currency}`;
	const formattedCashReceived = `${formatMoneyNumber(receipt.cashReceived)} ${receipt.currency}`;
	const formattedChange = `${formatMoneyNumber(receipt.changeAmount)} ${receipt.currency}`;
	const formattedDate = formatReceiptDateTime(receipt.paidAt);

	const includedBadges = [
		receipt.includeMeals ? "يشمل الوجبات الغذائية" : null,
		receipt.enableDailyStipend ? "يشمل المصروف اليومي" : null,
	]
		.filter(Boolean)
		.map((txt) => `<span class="perk-badge">✓ ${escapeHtml(txt)}</span>`)
		.join("");

	return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
	<meta charset="utf-8" />
	<title>إيصال سداد - ${escapeHtml(receipt.code)}</title>
	<style>
		@page { size: A4; margin: 18mm; }
		* { box-sizing: border-box; }
		body {
			margin: 0;
			font-family: "Cairo", "Segoe UI", Tahoma, Arial, sans-serif;
			background: #ffffff;
			color: #18181b;
			direction: rtl;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
		.sheet {
			max-width: 560px;
			margin: 0 auto;
			border: 1px solid #e4e4e7;
			border-radius: 16px;
			padding: 28px 24px;
		}
		.hero {
			text-align: center;
			padding-bottom: 20px;
			border-bottom: 1px dashed #e4e4e7;
		}
		.check-badge {
			width: 52px;
			height: 52px;
			margin: 0 auto 10px;
			border-radius: 999px;
			background: #ecfdf5;
			color: #059669;
			border: 2px solid #a7f3d0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24px;
			font-weight: 800;
		}
		.clinic-name {
			font-size: 12px;
			font-weight: 700;
			color: #4f6ae0;
			margin-bottom: 4px;
		}
		h1 {
			margin: 0;
			font-size: 18px;
			font-weight: 800;
			color: #18181b;
		}
		.amount-label {
			margin-top: 10px;
			font-size: 12px;
			color: #71717a;
		}
		.amount-value {
			margin-top: 2px;
			font-size: 26px;
			font-weight: 800;
			color: #18181b;
		}
		.meta-line {
			margin-top: 8px;
			font-size: 12px;
			color: #52525b;
			line-height: 1.7;
		}
		.card {
			margin-top: 18px;
			border: 1px solid #e4e4e7;
			border-radius: 12px;
			padding: 16px;
			background: #fafafa;
		}
		.card-title {
			font-size: 13px;
			font-weight: 800;
			margin: 0 0 12px 0;
			color: #18181b;
		}
		.plan-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding-bottom: 10px;
			border-bottom: 1px solid #e4e4e7;
			font-size: 13px;
			font-weight: 700;
		}
		.perks {
			display: flex;
			flex-wrap: wrap;
			gap: 6px;
			margin-top: 8px;
		}
		.perk-badge {
			font-size: 11px;
			font-weight: 600;
			padding: 2px 8px;
			border-radius: 6px;
			background: #eff6ff;
			color: #1d4ed8;
			border: 1px solid #dbeafe;
		}
		.sub-heading {
			margin: 12px 0 8px;
			font-size: 11px;
			font-weight: 700;
			color: #71717a;
		}
		.detail-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 6px 0;
			font-size: 12.5px;
			color: #27272a;
		}
		.detail-row .label { color: #52525b; }
		.detail-row .val { font-weight: 700; }
		.footer {
			margin-top: 18px;
			text-align: center;
			font-size: 11px;
			color: #71717a;
		}
	</style>
</head>
<body>
	<div class="sheet">
		<div class="hero">
			<div class="clinic-name">${escapeHtml(receipt.clinicName || "أكاديمية سند التعليمية")}</div>
			<div class="check-badge">✓</div>
			<h1>تم الدفع بنجاح</h1>
			<div class="amount-label">للمبلغ</div>
			<div class="amount-value">${escapeHtml(formattedAmount)}</div>
			<div class="meta-line">
				ولي الأمر: <strong>${escapeHtml(receipt.guardianName)}</strong> · الطالب: <strong>${escapeHtml(receipt.studentName)}</strong>
				${receipt.studentCode ? `<br />رقم ملف الطالب: <strong dir="ltr">${escapeHtml(receipt.studentCode)}</strong>` : ""}
				<br />معرف الإيصال: <strong dir="ltr">${escapeHtml(receipt.paymentReference)}</strong> · ${escapeHtml(formattedDate)}
			</div>
		</div>

		<div class="card">
			<h2 class="card-title">ملخص الاشتراك</h2>
			<div class="plan-row">
				<span>${escapeHtml(receipt.planName)}</span>
				<span>الإجمالي: ${escapeHtml(formattedAmount)}</span>
			</div>
			${includedBadges ? `<div class="perks">${includedBadges}</div>` : ""}

			<div class="sub-heading">تفاصيل المعاملة</div>
			<div class="detail-row">
				<span class="label">قيمة الباقة</span>
				<span class="val">${escapeHtml(formattedAmount)}</span>
			</div>
			<div class="detail-row">
				<span class="label">الخصم</span>
				<span class="val">${escapeHtml(formattedDiscount)}</span>
			</div>
			<div class="detail-row">
				<span class="label">وسيلة الدفع</span>
				<span class="val">${escapeHtml(methodLabel)}</span>
			</div>
			${
				receipt.changeAmount > 0
					? `
			<div class="detail-row">
				<span class="label">المبلغ المستلم نقداً</span>
				<span class="val">${escapeHtml(formattedCashReceived)}</span>
			</div>
			<div class="detail-row">
				<span class="label">الباقي المرتجع</span>
				<span class="val">${escapeHtml(formattedChange)}</span>
			</div>`
					: ""
			}
			${
				receipt.collectedBy
					? `
			<div class="detail-row">
				<span class="label">الموظف المُحصِّل</span>
				<span class="val">${escapeHtml(receipt.collectedBy)}</span>
			</div>`
					: ""
			}
			${
				receipt.notes
					? `
			<div class="detail-row">
				<span class="label">ملاحظات</span>
				<span class="val">${escapeHtml(receipt.notes)}</span>
			</div>`
					: ""
			}
		</div>

		<div class="footer">
			إيصال رسمي صادر من منظومة سند للتسجيل الرقمي • كود الطلب: #${escapeHtml(receipt.code)}
		</div>
	</div>
</body>
</html>`;
}

export function printOrSavePaymentReceipt(receipt: RegistrationPaymentReceiptData) {
	const html = buildPaymentReceiptHtml(receipt);
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
	const cleanCode = (receipt.code || receipt.paymentReference || "receipt").replace(/[\\/:*?"<>|]/g, "-");
	const cleanName = (receipt.studentName || "طالب").replace(/[\\/:*?"<>|]/g, "-");
	document.title = `إيصال-سداد-${cleanCode}-${cleanName}`;

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

	setTimeout(() => {
		try {
			win.focus();
			win.addEventListener("afterprint", cleanup, { once: true });
			win.print();
		} finally {
			setTimeout(cleanup, 1500);
		}
	}, 250);
}

function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
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
}

/** تغليف صورة JPEG داخل ملف PDF قياسي أحادي الصفحة (A4) بجداول xref دقيقة. */
export function buildSinglePagePdfFromJpeg(
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
	link.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * تحميل الفاتورة مباشرة كملف PDF فوري (دون فتح نافذة الطباعة).
 * يرسم محتوى الفاتورة على Canvas بدقة A4 لضمان سلامة الخط العربي ويحوّله إلى PDF مباشر.
 */
export function downloadPaymentReceiptDirect(receipt: RegistrationPaymentReceiptData) {
	const cleanCode = (receipt.code || receipt.paymentReference || "receipt").replace(/[\\/:*?"<>|]/g, "-");
	const cleanName = (receipt.studentName || "طالب").replace(/[\\/:*?"<>|]/g, "-");
	const pdfFileName = `إيصال-سداد-${cleanCode}-${cleanName}.pdf`;

	const canvasWidth = 1190;
	const canvasHeight = 1684;
	const canvas = document.createElement("canvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		const htmlBlob = new Blob([buildPaymentReceiptHtml(receipt)], {
			type: "text/html;charset=utf-8",
		});
		triggerBlobDownload(htmlBlob, `إيصال-سداد-${cleanCode}-${cleanName}.html`);
		return;
	}

	const methodLabel = formatPaymentMethodLabelArabic(
		receipt.paymentMethodType,
		receipt.paymentGateway,
	);
	const formattedAmount = `${formatMoneyNumber(receipt.amount)} ${receipt.currency}`;
	const formattedDiscount = `${formatMoneyNumber(receipt.discountAmount)} ${receipt.currency}`;
	const formattedCashReceived = `${formatMoneyNumber(receipt.cashReceived)} ${receipt.currency}`;
	const formattedChange = `${formatMoneyNumber(receipt.changeAmount)} ${receipt.currency}`;
	const dateLabel = formatReceiptShortDate(receipt.paidAt);
	const fontFamily =
		(typeof document !== "undefined" && getComputedStyle(document.body).fontFamily) ||
		'"Cairo", "Segoe UI", Tahoma, Arial, sans-serif';

	ctx.direction = "rtl";
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);

	// إطار البطاقة الرئيسي
	const boxX = 95;
	const boxY = 95;
	const boxW = canvasWidth - 190;
	const boxH = canvasHeight - 190;
	ctx.strokeStyle = "#e4e4e7";
	ctx.lineWidth = 2;
	drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 28);
	ctx.stroke();

	const centerX = canvasWidth / 2;
	let y = 175;

	// اسم الأكاديمية
	ctx.textAlign = "center";
	ctx.fillStyle = "#4f6ae0";
	ctx.font = `700 24px ${fontFamily}`;
	ctx.fillText(receipt.clinicName || "أكاديمية سند التعليمية", centerX, y);
	y += 72;

	// علامة النجاح الدائرية
	ctx.fillStyle = "#ecfdf5";
	ctx.beginPath();
	ctx.arc(centerX, y, 44, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = "#a7f3d0";
	ctx.lineWidth = 3;
	ctx.stroke();

	ctx.strokeStyle = "#059669";
	ctx.lineWidth = 6;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.beginPath();
	ctx.moveTo(centerX - 18, y + 2);
	ctx.lineTo(centerX - 4, y + 16);
	ctx.lineTo(centerX + 20, y - 14);
	ctx.stroke();
	y += 96;

	// تم الدفع بنجاح
	ctx.fillStyle = "#18181b";
	ctx.font = `800 34px ${fontFamily}`;
	ctx.fillText("تم الدفع بنجاح", centerX, y);
	y += 48;

	// للمبلغ
	ctx.fillStyle = "#71717a";
	ctx.font = `500 22px ${fontFamily}`;
	ctx.fillText("للمبلغ", centerX, y);
	y += 56;

	// القيمة
	ctx.fillStyle = "#18181b";
	ctx.font = `800 50px ${fontFamily}`;
	ctx.fillText(formattedAmount, centerX, y);
	y += 50;

	// ولي الأمر والطالب
	ctx.fillStyle = "#52525b";
	ctx.font = `500 23px ${fontFamily}`;
	ctx.fillText(
		`ولي الأمر: ${receipt.guardianName} · للطالب: ${receipt.studentName}`,
		centerX,
		y,
	);
	y += 38;

	// معرف الفاتورة والتاريخ
	ctx.fillStyle = "#71717a";
	ctx.font = `500 21px ${fontFamily}`;
	ctx.fillText(
		`معرف الفاتورة ${receipt.paymentReference} · ${dateLabel}`,
		centerX,
		y,
	);
	y += 58;

	// خط منقط فاصل
	ctx.save();
	ctx.setLineDash([10, 8]);
	ctx.strokeStyle = "#e4e4e7";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(boxX + 44, y);
	ctx.lineTo(boxX + boxW - 44, y);
	ctx.stroke();
	ctx.restore();
	y += 48;

	// بطاقة ملخص الخدمة
	const innerX = boxX + 44;
	const innerW = boxW - 88;
	const rows: Array<{ label: string; value: string; highlight?: boolean }> = [
		{ label: "قيمة الباقة", value: formattedAmount },
		{ label: "الخصم", value: formattedDiscount },
		{ label: "وسيلة الدفع", value: methodLabel },
	];
	if (receipt.changeAmount > 0) {
		rows.push({ label: "المبلغ المستلم نقداً", value: formattedCashReceived });
		rows.push({ label: "الباقي المرتجع لولي الأمر", value: formattedChange, highlight: true });
	}
	if (receipt.studentCode) {
		rows.push({ label: "رقم ملف الطالب", value: receipt.studentCode });
	}
	if (receipt.notes) {
		rows.push({ label: "ملاحظات", value: receipt.notes });
	}

	const perksText = [
		receipt.includeMeals ? "✓ يشمل الوجبات" : null,
		receipt.enableDailyStipend ? "✓ يشمل المصروف اليومي" : null,
	]
		.filter(Boolean)
		.join("   ");

	const cardH = 260 + (perksText ? 42 : 0) + rows.length * 56;
	ctx.fillStyle = "#fafafa";
	drawRoundedRect(ctx, innerX, y, innerW, cardH, 22);
	ctx.fill();
	ctx.strokeStyle = "#e4e4e7";
	ctx.lineWidth = 2;
	ctx.stroke();

	const rightEdge = innerX + innerW - 36;
	const leftEdge = innerX + 36;
	let cy = y + 54;

	ctx.textAlign = "right";
	ctx.fillStyle = "#18181b";
	ctx.font = `800 26px ${fontFamily}`;
	ctx.fillText("ملخص الخدمة", rightEdge, cy);
	cy += 26;

	ctx.strokeStyle = "#e4e4e7";
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(leftEdge, cy);
	ctx.lineTo(rightEdge, cy);
	ctx.stroke();
	cy += 48;

	ctx.textAlign = "right";
	ctx.fillStyle = "#18181b";
	ctx.font = `700 24px ${fontFamily}`;
	ctx.fillText(receipt.planName, rightEdge, cy);

	ctx.textAlign = "left";
	ctx.fillStyle = "#52525b";
	ctx.font = `600 22px ${fontFamily}`;
	ctx.fillText(`الإجمالي: ${formattedAmount}`, leftEdge, cy);
	cy += 24;

	if (perksText) {
		cy += 18;
		ctx.textAlign = "right";
		ctx.fillStyle = "#047857";
		ctx.font = `600 20px ${fontFamily}`;
		ctx.fillText(perksText, rightEdge, cy);
		cy += 14;
	}

	cy += 16;
	ctx.strokeStyle = "#e4e4e7";
	ctx.beginPath();
	ctx.moveTo(leftEdge, cy);
	ctx.lineTo(rightEdge, cy);
	ctx.stroke();
	cy += 42;

	ctx.textAlign = "right";
	ctx.fillStyle = "#71717a";
	ctx.font = `600 20px ${fontFamily}`;
	ctx.fillText("تفاصيل المعاملة", rightEdge, cy);
	cy += 46;

	for (const row of rows) {
		ctx.textAlign = "right";
		ctx.fillStyle = row.highlight ? "#047857" : "#52525b";
		ctx.font = `600 23px ${fontFamily}`;
		ctx.fillText(row.label, rightEdge, cy);

		ctx.textAlign = "left";
		ctx.fillStyle = row.highlight ? "#047857" : "#18181b";
		ctx.font = `700 23px ${fontFamily}`;
		ctx.fillText(row.value, leftEdge, cy);
		cy += 54;
	}

	// تذييل الإيصال
	ctx.textAlign = "center";
	ctx.fillStyle = "#71717a";
	ctx.font = `500 20px ${fontFamily}`;
	ctx.fillText(
		`إيصال رسمي صادر من منظومة سند للتسجيل الرقمي • كود الطلب: #${receipt.code}`,
		centerX,
		boxY + boxH - 42,
	);

	try {
		const dataUrl = canvas.toDataURL("image/jpeg", 0.94);
		const base64 = dataUrl.split(",")[1];
		if (!base64) throw new Error("JPEG_BASE64_EMPTY");
		const binaryStr = atob(base64);
		const jpegBytes = new Uint8Array(binaryStr.length);
		for (let i = 0; i < binaryStr.length; i += 1) {
			jpegBytes[i] = binaryStr.charCodeAt(i);
		}
		const pdfBytes = buildSinglePagePdfFromJpeg(jpegBytes, canvasWidth, canvasHeight);
		const pdfBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
		triggerBlobDownload(pdfBlob, pdfFileName);
	} catch {
		const htmlBlob = new Blob([buildPaymentReceiptHtml(receipt)], {
			type: "text/html;charset=utf-8",
		});
		triggerBlobDownload(htmlBlob, `إيصال-سداد-${cleanCode}-${cleanName}.html`);
	}
}
