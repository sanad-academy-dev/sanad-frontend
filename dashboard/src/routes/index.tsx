import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/functions/get-session";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const { session } = await getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}

		throw redirect({ to: "/login" });
	},
	component: () => null,
});
