import { backendFetch } from "@/lib/backend-fetch";

/** يستعلم من خدمة التوثيق المستقلة؛ لا توجد جلسة أو قاعدة بيانات داخل الـDashboard. */
export const getSession = async () => {
	try {
		const response = await backendFetch("/api/auth/get-session");
		if (!response.ok) return { session: null };
		return { session: await response.json() };
	} catch (error) {
		// لا نسمح لتعذر خدمة الـAPI أن يكسر شجرة المسارات؛ يتعامل الحارس معه كجلسة غائبة.
		console.error("[get-session] failed to resolve session", error);
		return { session: null };
	}
};
