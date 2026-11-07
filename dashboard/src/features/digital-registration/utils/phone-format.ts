/**
 * تطبيع أرقام الهواتف تلقائياً لروابط الواتساب (WhatsApp Direct Link)
 * يضمن إزالة المسافات والرموز وإضافة كود الدولة المناسب (مصر: 20، السعودية: 966)
 * لمنع تعطل روابط wa.me عند النقر عليها
 */
export function normalizePhoneForWhatsApp(
	phone: string,
	defaultCountry: "EG" | "SA" = "EG",
): string {
	if (!phone) return "";
	// 1. إزالة جميع الرموز غير الرقمية ما عدا علامة + في البداية
	let cleaned = phone.trim().replace(/[^\d+]/g, "");
	if (!cleaned) return "";

	// 2. إزالة علامة + أو الصفرين الدوليين 00
	if (cleaned.startsWith("+")) {
		cleaned = cleaned.slice(1);
	} else if (cleaned.startsWith("00")) {
		cleaned = cleaned.slice(2);
	}

	// 3. أرقام المحمول المصرية التي تبدأ بـ 01 (11 رقماً: 010, 011, 012, 015)
	if (/^01[0125]\d{8}$/.test(cleaned)) {
		return `20${cleaned.slice(1)}`;
	}

	// 4. أرقام المحمول السعودية التي تبدأ بـ 05 (10 أرقام: 05xxxxxxxx)
	if (/^05\d{8}$/.test(cleaned)) {
		return `966${cleaned.slice(1)}`;
	}

	// 5. في حال وجود صفر إضافي بعد كود مصر (2001...)
	if (/^2001[0125]\d{8}$/.test(cleaned)) {
		return `20${cleaned.slice(3)}`;
	}

	// 6. إذا كان الرقم يبدأ بصفر مفرد عام
	if (cleaned.startsWith("0")) {
		const prefix = defaultCountry === "SA" ? "966" : "20";
		return `${prefix}${cleaned.slice(1)}`;
	}

	return cleaned;
}

export function getWhatsAppUrl(
	phone: string,
	text?: string,
	defaultCountry: "EG" | "SA" = "EG",
): string {
	const normalized = normalizePhoneForWhatsApp(phone, defaultCountry);
	if (!normalized) return "";
	const baseUrl = `https://wa.me/${normalized}`;
	return text ? `${baseUrl}?text=${encodeURIComponent(text)}` : baseUrl;
}
