import { i18nClient } from "@better-auth/i18n/client";
import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "@/env";
import type { auth } from "@sanad/contracts/types/lib/auth";

export const authClient = createAuthClient({
	// التوثيق موجود في خدمة الـAPI، لا في خادم واجهة الـDashboard.
	// better-auth يرسل credentials: include افتراضيًا، فيحافظ على جلسة الأدمن.
	baseURL: env.VITE_API_URL,
	plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient(), i18nClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
