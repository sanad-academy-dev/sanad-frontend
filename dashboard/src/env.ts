import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Dashboard is a browser application. Server credentials belong exclusively
 * to `sanad-backend`; only public Vite variables may be read here.
 */
export const env = createEnv({
	client: {
		VITE_API_URL: z.string().url(),
		VITE_SENTRY_DSN: z.string().optional(),
		VITE_MAP_STYLE_URL: z.string().url().optional(),
	},
	clientPrefix: "VITE_",
	runtimeEnv: import.meta.env,
});
