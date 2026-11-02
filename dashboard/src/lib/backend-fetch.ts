import { env } from "@/env";

/**
 * في حالة الوصول عن بُعد (عبر ngrok أو شبكة خارجية)، تُوجَّه طلبات الـ API نسبيًا ليمرّرها Vite proxy تلقائيًا إلى السيرفر المحلي.
 */
function resolveApiOrigin(): string {
	if (typeof window !== "undefined") {
		const host = window.location.hostname;
		if (host !== "localhost" && host !== "127.0.0.1") {
			return "";
		}
	}
	return env.VITE_API_URL.replace(/\/+$/, "");
}

/**
 * عميل HTTP خفيف لمسارات الـAPI التي يحتاجها مسار الواجهة نفسه قبل تحميل React.
 * لا يصل هذا الملف إلى قاعدة البيانات ولا يستورد أي كود خادم محلي.
 */
export const backendUrl = (path: string) => {
	const origin = resolveApiOrigin();
	const cleanPath = path.replace(/^\/+/, "");
	return origin ? `${origin}/${cleanPath}` : `/${cleanPath}`;
};

export const backendFetch = (path: string, init?: RequestInit) =>
	fetch(backendUrl(path), {
		...init,
		credentials: "include",
	});
