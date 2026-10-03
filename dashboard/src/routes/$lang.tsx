import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { LANGUAGES, type Language } from "@/lib/data/constants";

const LOCALE_COOKIE = "locale";

const writeLocaleCookie = (lang: Language) => {
	if (typeof document === "undefined") return;
	// biome-ignore lint/suspicious/noDocumentCookie: legacy URL migration
	document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
};

export const Route = createFileRoute("/$lang")({
	beforeLoad: ({ params }) => {
		if (!(LANGUAGES as readonly string[]).includes(params.lang)) {
			throw notFound();
		}
		writeLocaleCookie(params.lang as Language);
		throw redirect({ to: "/" });
	},
	component: () => null,
});
