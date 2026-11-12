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
		defaultPreload: import.meta.env.DEV ? false : "intent",
		defaultPreloadDelay: 300,
		defaultPreloadStaleTime: 30_000,
		defaultPendingMs: 300,
		defaultPendingMinMs: 300,
		context: { queryClient },
		defaultNotFoundComponent: () => <div>Not Found!</div>,
		defaultErrorComponent: ({ error, info }) => {
			console.error("Router error:", error);
			if (info) console.error("Router error info:", info);

			const message =
				error instanceof Error
					? error.message
					: typeof error === "string"
						? error
						: typeof error === "object" && error !== null && "message" in error
							? String((error as { message: unknown }).message)
							: "حدث خطأ غير متوقع أثناء تحميل الصفحة";

			const stack = error instanceof Error ? error.stack : undefined;

			return (
				<div className="flex min-h-dvh flex-col items-center justify-center gap-2 p-4 text-center" dir="rtl">
					<IconAlertCircle className="size-10 text-destructive" />
					<p className="text-base font-bold text-foreground">حدث خطأ أثناء تحميل الصفحة</p>
					<p className="text-sm text-muted-foreground max-w-md">{message}</p>
					{stack && (
						<pre className="text-xs text-muted-foreground/80 max-w-xl max-h-48 overflow-auto text-left font-mono bg-muted/40 p-2 rounded">
							{stack}
						</pre>
					)}
				</div>
			);
		},
		defaultPendingComponent: () => <Spinner />,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: queryClient as never,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
