import { env } from "@/env";

/**
 * دالة ذكية لتحديد أصل عنوان الويبسايت العام (Website Origin) تلقائياً وديناميكياً
 * بدون أي قيم ثابتة (Non-static) لتعمل تلقائياً عند الرفع على السيرفر وفي التطوير:
 * 1) الأولوية لمتغير البيئة VITE_PUBLIC_WEBSITE_URL إن وُجد.
 * 2) في التطوير المحلي (localhost / 127.0.0.1 / IP محلي):
 *    الداشبورد تعمل على 3001 (أو بورت مشابه)، وموقع الويبسايت Next.js يعمل على 3000.
 * 3) في الإنتاج عند الرفع على نطاق فرعي (مثل dashboard.sanad.app أو app.school.com):
 *    تقتطع الدالة النطاق الفرعي تلقائياً للوصول للنطاق الرئيسي للويبسايت sanad.app / school.com.
 * 4) استضافات سحابية (مثل sanad-dashboard.vercel.app -> sanad.vercel.app أو sanad-website).
 */
export function getPublicWebsiteOrigin(): string {
	// 1. الأولوية لمتغير البيئة إن تم ضبطه
	const configuredUrl = (env as any)?.VITE_PUBLIC_WEBSITE_URL || import.meta.env.VITE_PUBLIC_WEBSITE_URL;
	if (configuredUrl && typeof configuredUrl === "string" && configuredUrl.trim()) {
		return configuredUrl.trim().replace(/\/+$/, "");
	}

	// 2. التحليل الديناميكي التلقائي من المتصفح في وقت التشغيل (Runtime)
	if (typeof window !== "undefined" && window.location) {
		const { protocol, hostname, port } = window.location;

		// أ) البيئة المحلية (Local development):
		if (
			hostname === "localhost" ||
			hostname === "127.0.0.1" ||
			hostname.endsWith(".local") ||
			/^192\.168\./.test(hostname) ||
			/^10\./.test(hostname)
		) {
			return `${protocol}//${hostname}:3000`;
		}

		// ب) عند الرفع على نطاق فرعي (Subdomain) مثل:
		// dashboard.sanad.app أو app.school.com أو admin.domain.com
		const subdomains = hostname.split(".");
		if (subdomains.length > 2 && /^(dashboard|app|admin|portal)$/i.test(subdomains[0])) {
			const rootDomain = subdomains.slice(1).join(".");
			const effectivePort = port && port !== "80" && port !== "443" ? `:${port}` : "";
			return `${protocol}//${rootDomain}${effectivePort}`;
		}

		// جـ) استضافات السحابة (Vercel / Railway / Render)
		if (hostname.includes("dashboard")) {
			const websiteHost = hostname.replace(/-dashboard\b|\.dashboard\b|dashboard-/g, "");
			const effectivePort = port && port !== "80" && port !== "443" ? `:${port}` : "";
			return `${protocol}//${websiteHost}${effectivePort}`;
		}

		// د) في حال كان يعمل على نفس النطاق بدون بورت
		const effectivePort = port && port !== "80" && port !== "443" ? `:${port}` : "";
		return `${protocol}//${hostname}${effectivePort}`;
	}

	// 3. Fallback افتراضي
	return "https://sanad.app";
}

/**
 * الحصول على رابط فورم التسجيل الرقمي الخاصة بأولياء الأمور على الـ Website
 * @param campaignCode كود الحملة الاختياري (إذا وُجد يُمكن توجيه ولي الأمر للحملة المحددة)
 * @param preferCampaignCode إذا كان true وكود الحملة متوفر يتم التوجيه لـ /register/[code]
 */
export function getRegistrationFormUrl(campaignCode?: string | null, preferCampaignCode = false): string {
	const origin = getPublicWebsiteOrigin();
	if (preferCampaignCode && campaignCode && campaignCode.trim()) {
		return `${origin}/register/${encodeURIComponent(campaignCode.trim())}`;
	}
	return `${origin}/register`;
}
