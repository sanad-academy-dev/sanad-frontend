import * as Sentry from "@sentry/react";

import { env } from "@/env";

if (import.meta.env.PROD) {
	Sentry.init({
		dsn: env.VITE_SENTRY_DSN,
		sendDefaultPii: true,
		integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
		enableLogs: true,
		tracesSampleRate: 1.0,
		// TODO: Change to the actual domain
		tracePropagationTargets: [/^\//, /^https:\/\/elite-vet.com\/api/],
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
	});
}
