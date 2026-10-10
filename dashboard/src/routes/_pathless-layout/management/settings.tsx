import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { SettingsSidebar } from "@/components/sidebar/settings-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_pathless-layout/management/settings")({
	component: SettingsLayout,
});

function SettingsSkeleton() {
	return (
		<div className="flex flex-col gap-6 px-6 py-6">
			<Skeleton className="h-6 w-40" />
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="flex flex-col gap-2"
				>
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-9 w-full" />
				</div>
			))}
		</div>
	);
}

function SettingsLayout() {
	const isLoading = useRouterState({ select: (s) => s.isLoading });

	return (
		<SidebarProvider
			className="flex h-full min-h-0 flex-1 flex-row overflow-hidden"
			style={{ "--sidebar-width": "13rem" } as CSSProperties}
		>
			<SettingsSidebar />
			<SidebarInset className="min-h-0 flex-1 overflow-y-auto! border-0 p-0">
				<div className="min-h-auto ">{isLoading ? <SettingsSkeleton /> : <Outlet />}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
