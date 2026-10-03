import { IconChartBar, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddLabTestModal } from "@/features/services/lab-tests/components/add-lab-test-modal";
import { Route as LabTestsRoute } from "@/routes/_pathless-layout/services/lab-tests";
import type { LabTestsPeriod } from "@/server/lab-tests/lab-tests.type";

const PERIOD_TABS: { id: LabTestsPeriod; label: string }[] = [
	{ id: "day", label: "اليوم" },
	{ id: "week", label: "الأسبوع" },
	{ id: "all", label: "الكل" },
];

export function LabTestsToolbar() {
	const { period } = LabTestsRoute.useSearch();
	const navigate = useNavigate({ from: LabTestsRoute.fullPath });

	const onPeriodChange = (value: string) => {
		void navigate({ search: (prev) => ({ ...prev, period: value as LabTestsPeriod }) });
	};

	return (
		<TableToolbar
			searchPlaceholder="ابحث عن تحليل..."
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
					>
						<IconChartBar />
					</Button>
					<AddLabTestModal
						trigger={
							<Button size="sm">
								<IconPlus />
								طلب تحليل جديد
							</Button>
						}
					/>
				</>
			}
		/>
	);
}
