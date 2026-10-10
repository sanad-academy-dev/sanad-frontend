import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { TrainingHeader } from "@/features/services/training/components/training-header";
import { TrainingView } from "@/features/services/training/components/training-view";
import type { TrainingTab } from "@/features/services/training/types/training-tabs.types";

export const Route = createFileRoute("/_pathless-layout/services/training/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [tab, setTab] = useState<TrainingTab>("all");

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<TrainingHeader
				active={tab}
				onChange={setTab}
			/>

			<TrainingView tab={tab} />
		</div>
	);
}
