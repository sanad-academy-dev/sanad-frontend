import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import {
	AttendanceHeader,
	type AttendanceTab,
} from "@/features/services/attendance/components/attendance-header";
import { AttendanceView } from "@/features/services/staff/components/attendance/attendance-view";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useAttendance } from "@/features/services/staff/hooks/use-attendance";
import { useStudentAttendance } from "@/features/services/attendance/hooks/use-student-attendance";

export const Route = createFileRoute("/_pathless-layout/services/attendance")({
	ssr: false,
	component: AttendanceRouteComponent,
});

function AttendanceRouteComponent() {
	const [tab, setTab] = useState<AttendanceTab>("students");

	const today = useMemo(() => new Date(), []);
	const { staff } = useStaff();
	const { patients } = usePatients();
	const { records: staffRecords } = useAttendance(today, today);
	const { records: studentRecords } = useStudentAttendance(today, today);

	const stats: StatItem[] = useMemo(() => {
		if (tab === "students") {
			const total = patients.length;
			const present = studentRecords.filter((r) => r.status === "PRESENT").length;
			const leave = studentRecords.filter((r) => r.status === "LEAVE").length;
			const explicitAbsent = studentRecords.filter((r) => r.status === "ABSENT").length;
			const absent = Math.max(explicitAbsent, Math.max(0, total - present - leave));
			const rateNum = total > 0 ? Math.round((present / total) * 100) : 0;

			return [
				{ title: "# للطلاب", value: total, tooltip: "إجمالي عدد الطلاب المسجلين" },
				{ title: "# حاضرين", value: present, tooltip: "عدد الطلاب الحاضرين اليوم" },
				{ title: "# غائبين", value: absent, tooltip: "عدد الطلاب الغائبين اليوم" },
				{ title: "# في أجازة", value: leave, tooltip: "عدد الطلاب في إجازة اليوم" },
				{
					title: "معدل الالتزام بالحضور",
					value: rateNum,
					valueLabel: `${rateNum}%`,
					tooltip: "نسبة الالتزام بالحضور",
				},
			];
		}

		const total = staff.length;
		const present = staffRecords.filter((r) => r.status === "PRESENT").length;
		const leave = staffRecords.filter((r) => r.status === "LEAVE").length;
		const explicitAbsent = staffRecords.filter((r) => r.status === "ABSENT").length;
		const absent = Math.max(explicitAbsent, Math.max(0, total - present - leave));
		const rateNum = total > 0 ? Math.round((present / total) * 100) : 0;

		return [
			{ title: "# للموظفين", value: total, tooltip: "إجمالي عدد الموظفين المسجلين" },
			{ title: "# حاضرين", value: present, tooltip: "عدد الموظفين الحاضرين اليوم" },
			{ title: "# غائبين", value: absent, tooltip: "عدد الموظفين الغائبين اليوم" },
			{ title: "# في أجازة", value: leave, tooltip: "عدد الموظفين في إجازة اليوم" },
			{
				title: "معدل الالتزام بالدوام",
				value: rateNum,
				valueLabel: `${rateNum}%`,
				tooltip: "نسبة الالتزام بجلسات الدوام",
			},
		];
	}, [tab, patients.length, staff.length, studentRecords, staffRecords]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<AttendanceHeader
				active={tab}
				onChange={setTab}
			/>
			<Stats
				className="px-[9px]"
				stats={stats}
				variant="inventory"
			/>
			<AttendanceView
				key={`attendance-view-${tab}`}
				targetType={tab}
			/>
		</div>
	);
}
