import { IconAlertCircle } from "@tabler/icons-react";
import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { Spinner } from "@/components/common/spinner";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = new QueryClient();

	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 30_000,
		defaultPendingMs: 300,
		defaultPendingMinMs: 300,
		context: { queryClient },
		defaultNotFoundComponent: () => <div>Not Found!</div>,
		defaultErrorComponent: ({ error, info }) => {
			console.error(error);
			console.error(info);

			return (
				<div className="flex min-h-dvh flex-col items-center justify-center gap-2">
					<IconAlertCircle className="size-10 text-destructive" />
					<p className="text-sm text-muted-foreground">Error!</p>
					<p className="text-sm text-muted-foreground">{error.message}</p>
					<p className="text-sm text-muted-foreground">{error.stack}</p>
				</div>
			);
		},
		defaultPendingComponent: () => <Spinner />,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
