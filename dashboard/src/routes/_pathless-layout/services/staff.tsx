import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { JobsView } from "@/features/services/staff/components/jobs/jobs-view";
import { PayrollView } from "@/features/services/staff/components/payroll/payroll-view";
import { ShiftsView } from "@/features/services/staff/components/shifts/shifts-view";
import { StaffHeader } from "@/features/services/staff/components/staff-header";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { StaffTable } from "@/features/services/staff/staff-table";
import type { StaffModuleTab } from "@/features/services/staff/types/staff-tabs.types";
import { StaffStatus } from "@sanad/contracts/runtime/server/staff/staff.type";

export const Route = createFileRoute("/_pathless-layout/services/staff")({
	component: RouteComponent,
});

function RouteComponent() {
	const [tab, setTab] = useState<StaffModuleTab>("employees");
	// تفاصيل وظيفة مفتوحة ⇒ نُخفي تبويبات الموارد البشرية من الهيدر
	const [jobDetailOpen, setJobDetailOpen] = useState(false);
	const { staff } = useStaff();

	const statsItems = useMemo<StatItem[]>(() => {
		const total = staff.length;
		const active = staff.filter((s) => s.status === StaffStatus.ACTIVE).length;
		const pending = staff.filter((s) => s.status === StaffStatus.PENDING).length;
		const inactive = staff.filter((s) => s.status === StaffStatus.INACTIVE).length;
		return [
			{ title: "إجمالي الموظفين", value: total, tooltip: "العدد الكلي للموظفين المسجلين" },
			{ title: "نشط", value: active, tooltip: "الموظفون الذين قبلوا الدعوة وهم نشطون" },
			{ title: "في الانتظار", value: pending, tooltip: "الموظفون الذين لم يقبلوا الدعوة بعد" },
			{ title: "غير نشط", value: inactive, tooltip: "الموظفون المعطّلون" },
		];
	}, [staff]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{!jobDetailOpen && (
				<StaffHeader
					active={tab}
					onChange={setTab}
				/>
			)}

			{tab === "employees" && (
				<>
					<Stats
						className="px-4 grid-cols-4"
						stats={statsItems}
					/>
					<StaffTable />
				</>
			)}

			{tab === "shifts" && <ShiftsView />}

			{tab === "payroll" && <PayrollView />}

			{tab === "jobs" && <JobsView onDetailOpenChange={setJobDetailOpen} />}
		</div>
	);
}
