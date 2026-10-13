import { createFileRoute } from "@tanstack/react-router";

import { QuizzesHeader } from "@/features/services/training/components/quizzes-header";
import { QuizzesView } from "@/features/services/training/components/quizzes-view";

export const Route = createFileRoute("/_pathless-layout/services/quizzes")({
	component: QuizzesRouteComponent,
});

function QuizzesRouteComponent() {
	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<QuizzesHeader />
			<QuizzesView />
		</div>
	);
}
