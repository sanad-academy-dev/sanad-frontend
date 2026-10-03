import {
	IconBolt,
	IconChartBar,
	IconDownload,
	IconFilter,
	IconLayoutGrid,
	IconPlus,
	IconQuestionMark,
	IconSearch,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AppointmentsPeriod } from "@/features/appointments/types/appointment.types";
import { Route as AppointmentsRoute } from "@/routes/_pathless-layout/appointments";
import { AddAppointmentModal } from "./add-appointment-modal";

const PERIOD_TABS: { id: AppointmentsPeriod; label: string }[] = [
	{ id: "day", label: "اليوم" },
	{ id: "week", label: "الأسبوع" },
	{ id: "all", label: "الكل" },
];

export function AppointmentsToolbar() {
	const { period } = AppointmentsRoute.useSearch();
	const navigate = useNavigate({ from: AppointmentsRoute.fullPath });

	const onPeriodChange = (value: string) => {
		void navigate({ search: (prev) => ({ ...prev, period: value as AppointmentsPeriod }) });
	};

	return (
		<div className="flex items-center justify-between gap-3 px-4">
			<div className="flex items-center gap-2">
				<InputGroup className="w-64">
					<InputGroupInput placeholder="ابحث عن زيارة..." />
					<InputGroupAddon align="inline-end">
						<IconSearch />
					</InputGroupAddon>
					<InputGroupAddon align="inline-end">
						<Kbd className="text-primary bg-primary/10">/</Kbd>
						<IconBolt className="text-primary" />
					</InputGroupAddon>
				</InputGroup>

				<Separator
					orientation="vertical"
					className="h-5 my-auto"
				/>

				<Button
					size="sm"
					variant="outline"
				>
					<IconFilter />
					فلترة
				</Button>

				<Button
					size="sm"
					variant="outline"
				>
					<IconQuestionMark />
					نساعدك
				</Button>
				<Button
					size="sm"
					variant="outline"
				>
					<IconDownload />
					تصدير
				</Button>
				<Button
					size="sm"
					variant="outline"
				>
					<IconLayoutGrid />
					العرض
				</Button>

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
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
				>
					<IconChartBar />
				</Button>
				<AddAppointmentModal
					trigger={
						<Button size="sm">
							<IconPlus />
							إضافة زيارة جديدة
						</Button>
					}
				/>
			</div>
		</div>
	);
}
