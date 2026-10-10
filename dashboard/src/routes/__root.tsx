import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { lazy, Suspense, useEffect } from "react";

import { Toaster } from "@/components/ui/sonner";
import { useI18n } from "@/hooks/use-i18n";
import { getDirection } from "@/lib/i18n";
import appCss from "@/styles.css?url";
import "@/lib/sentry";

const Devtools = import.meta.env.DEV
	? lazy(async () => {
			const [{ TanStackDevtools }, { ReactQueryDevtools }, { TanStackRouterDevtoolsPanel }] =
				await Promise.all([
					import("@tanstack/react-devtools"),
					import("@tanstack/react-query-devtools"),
					import("@tanstack/react-router-devtools"),
				]);

			return {
				default: function Devtools() {
					return (
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
								{
									name: "Query Client",
									render: <ReactQueryDevtools />,
								},
							]}
						/>
					);
				},
			};
		})
	: null;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "أكاديمية سند",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
	ssr: false,
});

function RootDocument({ children }: { children: ReactNode }) {
	const { isRtl, lang } = useI18n();
	const dir = getDirection(lang);

	/**
	 * Keep the DOCUMENT ELEMENT in step with the language — imperatively, on purpose.
	 *
	 * The `lang`/`dir` props below are what the first paint uses, but React does not re-patch
	 * attributes on the `<html>` element of a client-rendered shell (`ssr: false`), so after
	 * `setLang` the document stayed `dir="rtl"` for ever while everything reading `isRtl`
	 * flipped instantly.
	 *
	 * That mismatch was not cosmetic. The sidebar picks its side from `isRtl` and positions
	 * itself with PHYSICAL `left-0`/`right-0`, so in English it jumped to the physical left
	 * while the page was still laid out RTL — putting it directly on top of every table's
	 * `align: "end"` column. The invoice screens' entire actions column and the «فاتورة جديدة»
	 * button became unclickable: the click landed on a sidebar link instead. Owner's UI pass
	 * measured it — the same x=21 was reachable in Arabic and not in English.
	 *
	 * Syncing the real element is the fix that holds regardless of whether the shell re-renders.
	 */
	useEffect(() => {
		const root = document.documentElement;
		if (root.lang !== lang) root.lang = lang;
		if (root.dir !== dir) root.dir = dir;
	}, [lang, dir]);

	return (
		<html
			lang={lang}
			dir={dir}
			suppressHydrationWarning
		>
			{/* suppressHydrationWarning: أدوات المتصفح (مثل LocatorJS) تحقن سمات على <head>
			    قبل ترطيب React فتسبّب تحذير عدم تطابق — نتجاهله على مستوى <head> فقط */}
			<head suppressHydrationWarning>
				<HeadContent />
			</head>
			<body suppressHydrationWarning>
				{children}
				{Devtools ? (
					<Suspense fallback={null}>
						<Devtools />
					</Suspense>
				) : null}
				<Scripts />
				<Toaster
					dir={dir}
					position={isRtl ? "bottom-left" : "bottom-right"}
				/>
			</body>
		</html>
	);
}
