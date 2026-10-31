import { i18nClient } from "@better-auth/i18n/client";
import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "@/env";
import type { auth } from "@sanad/contracts/types/lib/auth";

function resolveBaseUrl(): string {
	if (typeof window !== "undefined") {
		const host = window.location.hostname;
		if (host !== "localhost" && host !== "127.0.0.1") {
			return window.location.origin;
		}
	}
	return env.VITE_API_URL;
}

export const authClient = createAuthClient({
	// التوثيق موجود في خدمة الـAPI، لا في خادم واجهة الـDashboard.
	// better-auth يرسل credentials: include افتراضيًا، فيحافظ على جلسة الأدمن.
	baseURL: resolveBaseUrl(),
	plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient(), i18nClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
