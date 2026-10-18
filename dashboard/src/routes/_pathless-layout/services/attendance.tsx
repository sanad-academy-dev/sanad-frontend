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
import { useShifts } from "@/features/services/staff/hooks/use-shifts";
import { useStudentShifts } from "@/features/services/attendance/hooks/use-student-shifts";

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
	const { shifts: todayStaffShifts } = useShifts(today, today);
	const { shifts: todayStudentShifts } = useStudentShifts(today, today);

	const stats: StatItem[] = useMemo(() => {
		if (tab === "students") {
			const total = patients.length;
			const scheduledCount = todayStudentShifts.length;
			const present = studentRecords.filter((r) => r.status === "PRESENT").length;
			const leave = studentRecords.filter((r) => r.status === "LEAVE").length;
			const explicitAbsent = studentRecords.filter((r) => r.status === "ABSENT").length;

			// حساب الغياب بناءً على المناوبات المجدولة لليوم إن وُجدت
			const absent =
				scheduledCount > 0
					? Math.max(
							explicitAbsent,
							todayStudentShifts.filter(
								(s) =>
									!studentRecords.some(
										(r) =>
											r.staffId === s.staffId &&
											(r.status === "PRESENT" || r.status === "LEAVE"),
									),
							).length,
						)
					: explicitAbsent;

			const baseDenominator = scheduledCount > 0 ? scheduledCount : total;
			const rateNum = baseDenominator > 0 ? Math.round((present / baseDenominator) * 100) : 0;

			return [
				{
					title: "# للطلاب",
					value: total,
					tooltip: `إجمالي الطلاب: ${total} • المجدول لهم مناوبة اليوم: ${scheduledCount}`,
				},
				{ title: "# حاضرين", value: present, tooltip: "عدد الطلاب الحاضرين اليوم" },
				{
					title: "# غائبين",
					value: absent,
					tooltip: scheduledCount > 0 ? "عدد الغائبين من المناوبات المجدولة لليوم" : "عدد الغائبين",
				},
				{ title: "# في أجازة", value: leave, tooltip: "عدد الطلاب في إجازة اليوم" },
				{
					title: "معدل الالتزام بالحضور",
					value: rateNum,
					valueLabel: `${rateNum}%`,
					tooltip: scheduledCount > 0 ? "نسبة الحضور من إجمالي المناوبات المجدولة" : "نسبة الحضور",
				},
			];
		}

		const total = staff.length;
		const scheduledCount = todayStaffShifts.length;
		const present = staffRecords.filter((r) => r.status === "PRESENT").length;
		const leave = staffRecords.filter((r) => r.status === "LEAVE").length;
		const explicitAbsent = staffRecords.filter((r) => r.status === "ABSENT").length;

		// حساب غياب الموظفين بناءً على المناوبات المجدولة
		const absent =
			scheduledCount > 0
				? Math.max(
						explicitAbsent,
						todayStaffShifts.filter(
							(s) =>
								!staffRecords.some(
									(r) =>
										r.staffId === s.staffId &&
										(r.status === "PRESENT" || r.status === "LEAVE"),
								),
						).length,
					)
				: explicitAbsent;

		const baseDenominator = scheduledCount > 0 ? scheduledCount : total;
		const rateNum = baseDenominator > 0 ? Math.round((present / baseDenominator) * 100) : 0;

		return [
			{
				title: "# للموظفين",
				value: total,
				tooltip: `إجمالي الموظفين: ${total} • المجدول لهم مناوبة اليوم: ${scheduledCount}`,
			},
			{ title: "# حاضرين", value: present, tooltip: "عدد الموظفين الحاضرين اليوم" },
			{
				title: "# غائبين",
				value: absent,
				tooltip: scheduledCount > 0 ? "عدد الغائبين من المناوبات المجدولة لليوم" : "عدد الغائبين",
			},
			{ title: "# في أجازة", value: leave, tooltip: "عدد الموظفين في إجازة اليوم" },
			{
				title: "معدل الالتزام بالدوام",
				value: rateNum,
				valueLabel: `${rateNum}%`,
				tooltip: scheduledCount > 0 ? "نسبة الالتزام بالمناوبات المجدولة" : "نسبة الالتزام بجلسات الدوام",
			},
		];
	}, [tab, patients.length, staff.length, studentRecords, staffRecords, todayStudentShifts, todayStaffShifts]);

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
