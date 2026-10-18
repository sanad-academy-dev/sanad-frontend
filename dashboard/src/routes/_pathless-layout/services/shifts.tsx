import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ShiftsHeader, type ShiftsTab } from "@/features/services/staff/components/shifts/shifts-header";
import { ShiftsView } from "@/features/services/staff/components/shifts/shifts-view";

export const Route = createFileRoute("/_pathless-layout/services/shifts")({
	ssr: false,
	component: ShiftsRouteComponent,
});

function ShiftsRouteComponent() {
	const [tab, setTab] = useState<ShiftsTab>("staff");

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<ShiftsHeader
				active={tab}
				onChange={setTab}
			/>
			<ShiftsView
				targetType={tab}
				onTargetTypeChange={setTab}
			/>
		</div>
	);
}
