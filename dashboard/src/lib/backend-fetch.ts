import { env } from "@/env";

const apiOrigin = env.VITE_API_URL.replace(/\/+$/, "");

/**
 * عميل HTTP خفيف لمسارات الـAPI التي يحتاجها مسار الواجهة نفسه قبل تحميل React.
 * لا يصل هذا الملف إلى قاعدة البيانات ولا يستورد أي كود خادم محلي.
 */
export const backendUrl = (path: string) =>
	`${apiOrigin}/${path.replace(/^\/+/, "")}`;

export const backendFetch = (path: string, init?: RequestInit) =>
	fetch(backendUrl(path), {
		...init,
		credentials: "include",
	});
