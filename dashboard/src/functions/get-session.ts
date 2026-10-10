import { backendFetch } from "@/lib/backend-fetch";

let cachedResult: { session: unknown; timestamp: number } | null = null;
let inflightPromise: Promise<{ session: unknown }> | null = null;
const CACHE_TTL_MS = 5000;

export const invalidateSessionCache = () => {
	cachedResult = null;
};

/** يستعلم من خدمة التوثيق المستقلة؛ لا توجد جلسة أو قاعدة بيانات داخل الـDashboard. */
export const getSession = async () => {
	const now = Date.now();
	if (cachedResult && now - cachedResult.timestamp < CACHE_TTL_MS) {
		return { session: cachedResult.session };
	}

	if (inflightPromise) {
		return inflightPromise;
	}

	inflightPromise = (async () => {
		try {
			const response = await backendFetch("/api/auth/get-session");
			if (!response.ok) {
				cachedResult = { session: null, timestamp: Date.now() };
				return { session: null };
			}
			const session = await response.json();
			cachedResult = { session, timestamp: Date.now() };
			return { session };
		} catch (error) {
			// لا نسمح لتعذر خدمة الـAPI أن يكسر شجرة المسارات؛ يتعامل الحارس معه كجلسة غائبة.
			console.error("[get-session] failed to resolve session", error);
			return { session: null };
		} finally {
			inflightPromise = null;
		}
	})();

	return inflightPromise;
};
