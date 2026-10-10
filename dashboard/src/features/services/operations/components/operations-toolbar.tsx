import { IconChartBar, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateOperationDialog } from "@/features/services/operations/components/create-operation-dialog";
import { OperationsMetricsDialog } from "@/features/services/operations/components/operations-metrics-dialog";
import { useCreateOperation } from "@/features/services/operations/hooks/use-operation-mutations";
import type { OperationsPeriod } from "@/features/services/operations/types/operations.types";
import { Route as OperationsRoute } from "@/routes/_pathless-layout/services/operations";

const PERIOD_TABS: { id: OperationsPeriod; label: string }[] = [
	{ id: "day", label: "اليوم" },
	{ id: "week", label: "الأسبوع" },
	{ id: "all", label: "الكل" },
];

export function OperationsToolbar({
	q,
	onSearchChange,
}: {
	q: string;
	onSearchChange: (value: string) => void;
}) {
	const { period } = OperationsRoute.useSearch();
	const navigate = useNavigate({ from: OperationsRoute.fullPath });
	const [createOpen, setCreateOpen] = useState(false);
	const [metricsOpen, setMetricsOpen] = useState(false);
	const { createOperation, isPending } = useCreateOperation();

	const onPeriodChange = (value: string) => {
		void navigate({ search: (prev) => ({ ...prev, period: value as OperationsPeriod }) });
	};

	return (
		<>
			<TableToolbar
				searchPlaceholder="ابحث عن عملية..."
				searchValue={q}
				onSearchChange={onSearchChange}
				leftExtra={
					<Tabs
						value={period}
						onValueChange={onPeriodChange}
					>
						<TabsList className="flex-row-reverse">
							{PERIOD_TABS.map((tab) => (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				}
				actions={
					<>
						<Button
							variant="outline"
							size="sm"
							aria-label="مؤشرات العمليات"
							onClick={() => setMetricsOpen(true)}
						>
							<IconChartBar />
						</Button>
						<Button
							size="sm"
							onClick={() => setCreateOpen(true)}
						>
							<IconPlus />
							عملية جديدة
						</Button>
					</>
				}
			/>
			<OperationsMetricsDialog
				open={metricsOpen}
				onOpenChange={setMetricsOpen}
			/>
			<CreateOperationDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				onCreate={createOperation}
				isPending={isPending}
			/>
		</>
	);
}
