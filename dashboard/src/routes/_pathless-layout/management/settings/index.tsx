import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_pathless-layout/management/settings/")({
	component: SettingsIndexPage,
});

function SettingsIndexPage() {
	return (
		<div className="flex flex-col gap-2">
			<h2 className="text-lg font-semibold text-[#08090A]">Settings</h2>
			<p className="text-sm text-[#9B9B9D]">
				Select a category from the sidebar to manage your settings.
			</p>
		</div>
	);
}
