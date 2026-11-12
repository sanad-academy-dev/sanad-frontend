import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import { MyLibraryView } from "@/features/services/training/components/my-library-view";
import { PagesView } from "@/features/services/training/components/pages-view";
import { QuizzesView } from "@/features/services/training/components/quizzes-view";
import { TracksView } from "@/features/services/training/components/tracks-view";
import { TrainingHeader } from "@/features/services/training/components/training-header";
import { TrainingView } from "@/features/services/training/components/training-view";
import type { ContentManagementTab } from "@/features/services/training/types/training-tabs.types";

export const Route = createFileRoute("/_pathless-layout/services/training/")({
	validateSearch: (search): { tab?: ContentManagementTab } => {
		const raw = (search as { tab?: string }).tab;
		const validTabs: ContentManagementTab[] = [
			"courses",
			"quizzes",
			"my-library",
			"tracks",
			"pages",
		];
		return {
			tab: validTabs.includes(raw as ContentManagementTab)
				? (raw as ContentManagementTab)
				: "courses",
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { tab = "courses" } = Route.useSearch();
	const navigate = useNavigate();

	const handleTabChange = useCallback(
		(newTab: ContentManagementTab) => {
			navigate({
				to: "/services/training",
				search: { tab: newTab },
			});
		},
		[navigate],
	);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<TrainingHeader
				active={tab}
				onChange={handleTabChange}
			/>

			{tab === "courses" && <TrainingView tab="all" />}
			{tab === "quizzes" && <QuizzesView />}
			{tab === "my-library" && <MyLibraryView />}
			{tab === "tracks" && <TracksView />}
			{tab === "pages" && <PagesView />}
		</div>
	);
}
