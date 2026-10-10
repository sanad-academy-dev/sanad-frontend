import { IconCircleCheck } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/hooks/use-i18n";

export const Route = createFileRoute("/_auth-layout/success")({
	component: RouteComponent,
});

function RouteComponent() {
	const { t } = useI18n();

	return (
		<div className="flex flex-col items-center gap-8 max-w-md w-full text-center">
			<div className="flex size-24 items-center justify-center rounded-full border-4 border-green-200 bg-green-50 text-green-500 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
				<IconCircleCheck
					size={48}
					stroke={1.5}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold">{t("success.title")}</h1>
				<p className="text-muted-foreground">{t("success.subtitle")}</p>
			</div>

			<Link
				to="/login"
				className="w-full"
			>
				<button
					type="button"
					className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
				>
					{t("success.goToLogin")}
				</button>
			</Link>
		</div>
	);
}
