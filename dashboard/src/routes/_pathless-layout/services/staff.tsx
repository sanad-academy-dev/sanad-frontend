import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { showFeatureLockedToast } from "@/components/common/feature-locked-toast";
import { Stats } from "@/components/common/stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { AnnouncementsView } from "@/features/services/staff/components/announcements/announcements-view";
import { AttendanceView } from "@/features/services/staff/components/attendance/attendance-view";
import { JobsView } from "@/features/services/staff/components/jobs/jobs-view";
import { PayrollView } from "@/features/services/staff/components/payroll/payroll-view";
import { ShiftsView } from "@/features/services/staff/components/shifts/shifts-view";
import { StaffHeader } from "@/features/services/staff/components/staff-header";
import { ATTENDANCE_STATS } from "@/features/services/staff/data/attendance";
import { StaffTable } from "@/features/services/staff/staff-table";
import type { StaffModuleTab } from "@/features/services/staff/types/staff-tabs.types";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";

const STAFF_STATS: StatItem[] = [
	{ title: "إجمالي الموظفين", value: 0, tooltip: "العدد الكلي للموظفين المسجلين" },
	{ title: "نشط", value: 0, tooltip: "الموظفون الذين قبلوا الدعوة وهم نشطون" },
	{ title: "في الانتظار", value: 0, tooltip: "الموظفون الذين لم يقبلوا الدعوة بعد" },
	{ title: "غير نشط", value: 0, tooltip: "الموظفون المعطّلون" },
];

export const Route = createFileRoute("/_pathless-layout/services/staff")({
	component: RouteComponent,
});

function RouteComponent() {
	const [tab, setTab] = useState<StaffModuleTab>("employees");
	// تفاصيل وظيفة مفتوحة ⇒ نُخفي تبويبات الموارد البشرية من الهيدر
	const [jobDetailOpen, setJobDetailOpen] = useState(false);
	const { clinicInfo } = useClinicInfo();
	const attendanceEnabled = clinicInfo?.attendanceEnabled ?? false;

	// منع فتح تبويب الحضور والانصراف ما لم يُفعَّل من الإعدادات
	const handleTabChange = (next: StaffModuleTab) => {
		if (next === "attendance" && !attendanceEnabled) {
			showFeatureLockedToast({
				title: "الحضور والانصراف غير مفعّل",
				description: "لتفعيل هذه الصفحة، فعّل «فتح الحضور والانصراف» من الإعدادات أولًا.",
			});
			return;
		}
		setTab(next);
	};

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{!jobDetailOpen && (
				<StaffHeader
					active={tab}
					onChange={handleTabChange}
					attendanceEnabled={attendanceEnabled}
				/>
			)}

			{tab === "employees" && (
				<>
					<Stats
						className="px-4 grid-cols-4"
						stats={STAFF_STATS}
					/>
					<StaffTable />
				</>
			)}

			{tab === "attendance" && attendanceEnabled && (
				<>
					<Stats
						className="px-[9px]"
						stats={ATTENDANCE_STATS}
						variant="inventory"
					/>
					<AttendanceView />
				</>
			)}

			{tab === "shifts" && <ShiftsView />}

			{tab === "announcements" && <AnnouncementsView />}

			{tab === "payroll" && <PayrollView />}

			{tab === "jobs" && <JobsView onDetailOpenChange={setJobDetailOpen} />}
		</div>
	);
}
