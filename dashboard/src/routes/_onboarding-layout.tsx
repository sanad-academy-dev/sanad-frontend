import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getOnboardingStatus } from "@/functions/get-onboarding-status";

export const Route = createFileRoute("/_onboarding-layout")({
	component: RouteComponent,
	ssr: false,
	beforeLoad: async () => {
		const { session, onboardingCompleted } = await getOnboardingStatus();
		if (!session) {
			throw redirect({ to: "/login" });
		}
		if (onboardingCompleted) {
			throw redirect({ to: "/dashboard" });
		}
	},
});

function RouteComponent() {
	return <Outlet />;
}
