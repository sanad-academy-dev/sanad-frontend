import { useMemo } from "react";
import { addDays, startOfWeek } from "date-fns";
import { IconCalendarCheck, IconClockHour4 } from "@tabler/icons-react";

import { Stats } from "@/components/common/stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { AttendanceView } from "@/features/services/staff/components/attendance/attendance-view";
import { ShiftsView } from "@/features/services/staff/components/shifts/shifts-view";
import { usePatient } from "@/features/services/patients/hooks/use-patient";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import { useStudentAttendance } from "@/features/services/attendance/hooks/use-student-attendance";
import { useStudentShifts } from "@/features/services/attendance/hooks/use-student-shifts";
import { TabsContent } from "@/components/ui/tabs";

export function AttendanceTab({ patientId }: PatientTabProps) {
  const { patient } = usePatient(patientId);

  const today = useMemo(() => new Date(), []);
  const weekStart = useMemo(
    () => startOfWeek(today, { weekStartsOn: 0 }),
    [today],
  );
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const { records: studentRecords } = useStudentAttendance(weekStart, weekEnd);
  const { shifts: studentShifts } = useStudentShifts(weekStart, weekEnd);

  const thisStudentRecords = useMemo(
    () => studentRecords.filter((r) => r.staffId === patientId),
    [studentRecords, patientId],
  );

  const thisStudentShifts = useMemo(
    () => studentShifts.filter((s) => s.staffId === patientId),
    [studentShifts, patientId],
  );

  const stats: StatItem[] = useMemo(() => {
    const scheduledCount = thisStudentShifts.length;
    const present = thisStudentRecords.filter(
      (r) => r.status === "PRESENT",
    ).length;
    const leave = thisStudentRecords.filter((r) => r.status === "LEAVE").length;
    const explicitAbsent = thisStudentRecords.filter(
      (r) => r.status === "ABSENT",
    ).length;

    const absent =
      scheduledCount > 0
        ? Math.max(
            explicitAbsent,
            thisStudentShifts.filter(
              (s) =>
                !thisStudentRecords.some(
                  (r) =>
                    r.staffId === s.staffId &&
                    (r.status === "PRESENT" || r.status === "LEAVE"),
                ),
            ).length,
          )
        : explicitAbsent;

    const baseDenominator =
      scheduledCount > 0 ? scheduledCount : present + absent + leave || 1;
    const rateNum =
      baseDenominator > 0 ? Math.round((present / baseDenominator) * 100) : 0;

    return [
      {
        title: "# للطلاب",
        value: 1,
        tooltip: `الطالب المختار: ${patient?.name || ""}`,
      },
      {
        title: "# حاضرين",
        value: present,
        tooltip: "عدد أيام الحضور هذا الأسبوع",
      },
      {
        title: "# غائبين",
        value: absent,
        tooltip:
          scheduledCount > 0
            ? "عدد الغائبين من المناوبات المجدولة"
            : "عدد الغائبين",
      },
      { title: "# في أجازة", value: leave, tooltip: "عدد أيام الإجازة" },
      {
        title: "معدل الالتزام بالدوام",
        value: rateNum,
        valueLabel: `${rateNum}%`,
        tooltip: "نسبة الالتزام بالمناوبات المجدولة",
      },
    ];
  }, [thisStudentRecords, thisStudentShifts, patient?.name]);

  return (
    <TabsContent
      value="attendance"
      className="m-0 flex flex-col gap-6 overflow-y-auto p-3"
      dir="rtl"
    >
      {/* الجدول الأول: الحضور والانصراف للطالب (مطابق تماماً لجدول الحضور مع بلس التسجيل وكافة الخصائص) */}
      <div className="flex flex-col gap-1.5 overflow-hidden rounded-[4px] border border-border/70 bg-card shadow-2xs">
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
          <IconCalendarCheck className="size-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-foreground">
            سجل الحضور والانصراف — {patient?.name || "الطالب"}
          </h3>
        </div>
        {/* <Stats className="px-[9px]" stats={stats} variant="inventory" /> */}
        <AttendanceView targetType="students" studentId={patientId} />
      </div>

      {/* الجدول الثاني: المناوبات للطالب في جدول منفصل تحته (مطابق لجدول المناوبات في الداشبورد مع بلس الجدولة) */}
      <div className="flex flex-col gap-1.5 overflow-hidden rounded-[4px] border border-border/70 bg-card shadow-2xs">
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-1">
          <IconClockHour4 className="size-4 text-[#6366F1]" />
          <h3 className="text-xs font-bold text-foreground">
            جدول المناوبات — {patient?.name || "الطالب"}
          </h3>
        </div>
        <ShiftsView targetType="students" studentId={patientId} />
      </div>
    </TabsContent>
  );
}
