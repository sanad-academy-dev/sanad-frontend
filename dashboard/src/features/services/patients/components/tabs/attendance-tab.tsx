import { useState } from "react";
import { IconCalendarCheck, IconClockHour4 } from "@tabler/icons-react";

import { AttendanceView } from "@/features/services/staff/components/attendance/attendance-view";
import { ShiftsView } from "@/features/services/staff/components/shifts/shifts-view";
import { usePatient } from "@/features/services/patients/hooks/use-patient";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import { TabsContent } from "@/components/ui/tabs";
import {
	ScheduleDateRangeFilter,
	type ScheduleDateRange,
} from "@/components/common/schedule-date-range-filter";

export function AttendanceTab({ patientId }: PatientTabProps) {
	const { patient } = usePatient(patientId);

	// نطاق العرض الموحّد لكلا الجدولين (أسبوع / شهر مع التقويم)
	const [dateRange, setDateRange] = useState<ScheduleDateRange>(() => ({
		mode: "week",
		date: new Date(),
	}));

	return (
		<TabsContent
			value="attendance"
			className="m-0 flex flex-col gap-6 overflow-y-auto p-3"
			dir="rtl"
		>
			{/* القسم الأول: الحضور والانصراف للطالب */}
			<div className="flex flex-col gap-2">
				{/* العنوان والفلتر في الأعلى خارج إطار الجدول */}
				<div className="flex items-center justify-between px-1">
					<div className="flex items-center gap-2">
						<IconCalendarCheck className="size-4 text-emerald-600 shrink-0" />
						<h3 className="text-sm font-bold text-foreground">
							سجل الحضور والانصراف
						</h3>
					</div>
					{/* الفلتر الموحّد (أسبوع / شهر مع التقويم) */}
					<ScheduleDateRangeFilter
						value={dateRange}
						onChange={setDateRange}
					/>
				</div>

				{/* حاوية جدول الحضور والانصراف */}
				<div className="overflow-hidden rounded-[4px] border border-border/70 bg-card shadow-2xs">
					<AttendanceView
						targetType="students"
						studentId={patientId}
						hideNameColumn
						hideToolbar
						hideStats
						hidePagination
						dateRange={dateRange}
						onDateRangeChange={setDateRange}
					/>
				</div>
			</div>

			{/* القسم الثاني: المناوبات للطالب */}
			<div className="flex flex-col gap-2">
				{/* العنوان والفلتر في الأعلى خارج إطار الجدول */}
				<div className="flex items-center justify-between px-1">
					<div className="flex items-center gap-2">
						<IconClockHour4 className="size-4 text-[#6366F1] shrink-0" />
						<h3 className="text-sm font-bold text-foreground">
							جدول المناوبات
						</h3>
					</div>
					{/* الفلتر الموحّد (أسبوع / شهر مع التقويم) */}
					<ScheduleDateRangeFilter
						value={dateRange}
						onChange={setDateRange}
					/>
				</div>

				{/* حاوية جدول المناوبات */}
				<div className="overflow-hidden rounded-[4px] border border-border/70 bg-card shadow-2xs">
					<ShiftsView
						targetType="students"
						studentId={patientId}
						hideNameColumn
						hideToolbar
						hideStats
						hidePagination
						dateRange={dateRange}
						onDateRangeChange={setDateRange}
					/>
				</div>
			</div>
		</TabsContent>
	);
}
