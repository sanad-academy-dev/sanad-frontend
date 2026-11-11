import type {
	CampaignRequestItem,
	RegistrationPaymentReceiptData,
} from "../types/campaign-request.types";

/** تحويل رمز العملة الدولي إلى الرمز العربي المعروض في لوحة سند والفواتير. */
export function resolveClinicCurrencySymbol(
	currencyCode?: string | null,
	fallbackSymbol?: string | null,
): string {
	switch ((currencyCode || "").trim().toUpperCase()) {
		case "SAR":
			return "ر.س";
		case "AED":
			return "د.إ";
		case "QAR":
			return "ر.ق";
		case "USD":
			return "$";
		case "EGP":
			return "ج.م";
		default:
			return fallbackSymbol?.trim() || "ج.م";
	}
}

/** توحيد الأرقام العربية/الفارسية والفاصلة العشرية إلى أرقام لاتينية صالحة للحساب. */
export function normalizeDigitsToLatin(value: string): string {
	const arabicIndic = "٠١٢٣٤٥٦٧٨٩";
	const easternArabic = "۰۱۲۳۴۵۶۷۸۹";
	return value
		.replace(/[٠-٩]/g, (d) => String(arabicIndic.indexOf(d)))
		.replace(/[۰-۹]/g, (d) => String(easternArabic.indexOf(d)))
		.replace(/[٫,،]/g, ".")
		.trim();
}

export function formatMoneyNumber(value: unknown): string {
	const num = typeof value === "number" ? value : Number(value ?? 0);
	if (!Number.isFinite(num)) return "0";
	return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function parseRegistrationPaymentMetadata(
	paymentNotes?: string | null,
): {
	expectedAmount?: number;
	cashReceived?: number;
	changeAmount?: number;
	discountAmount?: number;
	collectedBy?: string | null;
	notes?: string | null;
} {
	if (!paymentNotes || !paymentNotes.trim().startsWith("{")) {
		return {
			notes: paymentNotes?.trim() || null,
		};
	}
	try {
		const parsed = JSON.parse(paymentNotes);
		if (!parsed || typeof parsed !== "object") return {};
		return {
			expectedAmount:
				typeof parsed.expectedAmount === "number" ? parsed.expectedAmount : undefined,
			cashReceived:
				typeof parsed.cashReceived === "number" ? parsed.cashReceived : undefined,
			changeAmount:
				typeof parsed.changeAmount === "number" ? parsed.changeAmount : undefined,
			discountAmount:
				typeof parsed.discountAmount === "number" ? parsed.discountAmount : 0,
			collectedBy:
				typeof parsed.collectedBy === "string" ? parsed.collectedBy : null,
			notes: typeof parsed.notes === "string" ? parsed.notes : null,
		};
	} catch {
		return {
			notes: paymentNotes.trim() || null,
		};
	}
}

export function formatPaymentMethodLabelArabic(
	method?: string | null,
	gateway?: string | null,
): string {
	const normalizedMethod = (method || "").trim().toUpperCase();
	const normalizedGateway = (gateway || "").trim().toUpperCase();

	if (normalizedMethod === "CASH" || normalizedGateway.includes("CASH")) {
		return "كاش";
	}
	if (normalizedMethod === "CARD") {
		return "بطاقة بنكية";
	}
	if (normalizedMethod === "WALLET") {
		return "محفظة إلكترونية";
	}
	if (normalizedMethod === "BANK_TRANSFER" || normalizedMethod === "INSTAPAY") {
		return "تحويل بنكي";
	}
	return "دفع إلكتروني";
}

export function buildReceiptFromRequest(
	request: CampaignRequestItem,
	currency: string,
	clinicName?: string | null,
): RegistrationPaymentReceiptData | null {
	if (!request.paidAt && request.status !== "ACCEPTED") return null;

	const meta = parseRegistrationPaymentMetadata(request.paymentNotes);
	const amount =
		request.subscriptionAmount !== null && request.subscriptionAmount !== undefined
			? Number(request.subscriptionAmount)
			: (meta.expectedAmount ?? 0);

	return {
		requestId: request.id,
		code: request.code || request.id,
		studentName: request.patientName || request.name || "الطالب",
		studentCode: request.convertedPatientCode || null,
		guardianName: request.guardianName || "ولي الأمر",
		planId: request.subscriptionPlanId || null,
		planName: request.subscriptionPlanName || "الباقة الأكاديمية",
		includeMeals: Boolean(request.includeMeals),
		enableDailyStipend: Boolean(request.enableDailyStipend),
		paidAt: request.paidAt || new Date().toISOString(),
		paymentReference: request.paymentReference || `PAY-${request.code || request.id}`,
		paymentGateway: request.paymentGateway || "ACADEMY_CASH_DESK",
		paymentMethodType: request.paymentMethodType || "CASH",
		amount,
		cashReceived: meta.cashReceived ?? amount,
		changeAmount: meta.changeAmount ?? 0,
		discountAmount: meta.discountAmount ?? 0,
		currency,
		collectedBy: meta.collectedBy || null,
		notes: meta.notes || null,
		clinicName: clinicName || "أكاديمية سند التعليمية",
	};
}
