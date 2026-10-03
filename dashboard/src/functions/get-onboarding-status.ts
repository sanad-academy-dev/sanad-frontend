import { backendFetch } from "@/lib/backend-fetch";
import { getSession } from "@/functions/get-session";

/**
 * حالة onboarding تأتي من الـBackend مالك البيانات. تُستدعى في حراس مسارات الواجهة
 * فقط، ولذلك لا تحتاج الـDashboard إلى Prisma أو auth server محلي.
 */
export const getOnboardingStatus = async () => {
	try {
		const { session } = await getSession();
		const activeClinicId =
			typeof session === "object" &&
			session !== null &&
			"session" in session &&
			typeof session.session === "object" &&
			session.session !== null &&
			"activeClinicId" in session.session
				? session.session.activeClinicId
				: null;

		if (typeof activeClinicId !== "string" || !activeClinicId) {
			return { session: null, onboardingCompleted: null };
		}

		const response = await backendFetch("/api/onboarding/status");
		if (!response.ok) return { session: null, onboardingCompleted: null };
		const status = (await response.json()) as { onboardingCompleted?: unknown };
		return {
			session,
			onboardingCompleted: status.onboardingCompleted === true,
		};
	} catch {
		return { session: null, onboardingCompleted: null };
	}
};
