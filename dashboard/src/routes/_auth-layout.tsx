"use client";

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { LangSwitcher } from "@/components/lang-switcher";
import { getOnboardingStatus } from "@/functions/get-onboarding-status";

export const Route = createFileRoute("/_auth-layout")({
	component: RouteComponent,
	beforeLoad: async () => {
		const { session, onboardingCompleted } = await getOnboardingStatus();
		if (session) {
			throw redirect({ to: onboardingCompleted ? "/dashboard" : "/onboarding" });
		}
	},
});

function RouteComponent() {
	return (
		<div className="flex flex-col h-dvh bg-background">
			<div className="flex justify-end p-4">
				<LangSwitcher />
			</div>
			<div className="flex-1 flex items-center justify-center">
				<Outlet />
			</div>
		</div>
	);
}
