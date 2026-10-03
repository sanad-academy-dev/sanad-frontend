import { IconChartBar, IconPlus, IconStethoscope, IconUser } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddRadiologyModal } from "@/features/services/radiology/components/add-radiology-modal";
import { RadiologyMetricsDialog } from "@/features/services/radiology/components/radiology-metrics-dialog";
import { RadiologyModality, RadiologyStatus } from "@/generated/prisma/enums";
import { Route as RadiologyRoute } from "@/routes/_pathless-layout/services/radiology";
import type { RadiologyPeriod } from "@/server/radiology/radiology.type";
import { RADIOLOGY_STATUS_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology.workflow";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

const PERIOD_TABS: { id: RadiologyPeriod; label: string }[] = [
	{ id: "day", label: "اليوم" },
	{ id: "week", label: "الأسبوع" },
	{ id: "all", label: "الكل" },
];

/** الحالات المعروضة على اللوحة — الملغاة لا عمود لها فلا تُصفّى */
const FILTERABLE_STATUSES = Object.values(RadiologyStatus).filter(
	(s) => s !== RadiologyStatus.CANCELLED,
);

/** قائمة مفصولة بفواصل ↔ مصفوفة — التصفية تعيش في الرابط */
const parseList = (value: string) => (value ? value.split(",").filter(Boolean) : []);
const toList = (values: string[]) => values.join(",");

export function RadiologyToolbar() {
	const { period, q, modality, status } = RadiologyRoute.useSearch();
	const navigate = useNavigate({ from: RadiologyRoute.fullPath });
	const [metricsOpen, setMetricsOpen] = useState(false);

	const onPeriodChange = (value: string) => {
		void navigate({ search: (prev) => ({ ...prev, period: value as RadiologyPeriod }) });
	};

	// البحث والتصفية يكتبان في الرابط بـ replace حتى لا يمتلئ سجل التصفّح
	// بخطوة لكل حرف — الرجوع يجب أن يغادر الصفحة لا أن يتراجع حرفًا
	const onSearchChange = (value: string) => {
		void navigate({ search: (prev) => ({ ...prev, q: value }), replace: true });
	};

	/** التبديل في مجموعة تصفية — القيمة الموجودة تُزال والغائبة تُضاف */
	const toggle = (key: "modality" | "status", value: string) => {
		const current = parseList(key === "modality" ? modality : status);
		const next = current.includes(value)
			? current.filter((v) => v !== value)
			: [...current, value];
		void navigate({ search: (prev) => ({ ...prev, [key]: toList(next) }), replace: true });
	};

	const filterGroups: FilterGroup[] = [
		{
			key: "modality",
			label: "طريقة التصوير",
			Icon: IconStethoscope,
			options: Object.values(RadiologyModality).map((value) => ({
				value,
				label: MODALITY_META[value].label,
			})),
			selected: parseList(modality),
			onToggle: (value) => toggle("modality", value),
		},
		{
			key: "status",
			label: "المرحلة",
			Icon: IconUser,
			options: FILTERABLE_STATUSES.map((value) => ({
				value,
				label: RADIOLOGY_STATUS_LABELS[value],
			})),
			selected: parseList(status),
			onToggle: (value) => toggle("status", value),
		},
	];

	return (
		<>
			<TableToolbar
				searchPlaceholder="ابحث بالطفل أو الفحص أو رقم الطلب..."
				searchValue={q}
				onSearchChange={onSearchChange}
				showFilter={false}
				leftExtra={
					<>
						<FiltersMenu
							groups={filterGroups}
							size="sm"
						/>
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
					</>
				}
				actions={
					<>
						<Button
							variant="outline"
							size="sm"
							aria-label="مؤشّرات زمن الإنجاز"
							onClick={() => setMetricsOpen(true)}
						>
							<IconChartBar />
						</Button>
						<AddRadiologyModal
							trigger={
								<Button size="sm">
									<IconPlus />
									طلب أشعة جديد
								</Button>
							}
						/>
					</>
				}
			/>
			<RadiologyMetricsDialog
				open={metricsOpen}
				onOpenChange={setMetricsOpen}
			/>
		</>
	);
}
