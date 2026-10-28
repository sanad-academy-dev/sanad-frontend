import { IconCalendarEvent, IconClock } from "@tabler/icons-react";
import type { ClassroomResponse } from "@/server/classrooms/classrooms.type";

interface ClassroomScheduleTabProps {
	classroom: ClassroomResponse;
}

const DAYS = [
	{ key: "sun", name: "الأحد", time: "09:00 ص - 11:00 ص", subject: "جلسة تعليمية", active: true },
	{ key: "mon", name: "الاثنين", time: "09:00 ص - 11:00 ص", subject: "تطبيق عملي", active: true },
	{ key: "tue", name: "الثلاثاء", time: "09:00 ص - 11:00 ص", subject: "جلسة تعليمية", active: true },
	{ key: "wed", name: "الأربعاء", time: "09:00 ص - 11:00 ص", subject: "مراجعة وأنشطة", active: true },
	{ key: "thu", name: "الخميس", time: "09:00 ص - 11:00 ص", subject: "تقييم أسبوعي", active: true },
];

export function ClassroomScheduleTab({ classroom }: ClassroomScheduleTabProps) {
	return (
		<div className="flex-1 overflow-y-auto p-6 space-y-6">
			<div className="rounded-2xl border border-border/70 bg-card p-6 shadow-2xs">
				<div className="flex items-center justify-between pb-4 border-b border-border/60">
					<div className="flex items-center gap-3">
						<div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
							<IconCalendarEvent className="size-5" />
						</div>
						<div>
							<h3 className="text-base font-bold text-foreground">الجدول الزمني للفصل</h3>
							<p className="text-xs text-muted-foreground">
								مواعيد الحصص والجلسات التدريبية المعتمدة لـ {classroom.name}
							</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-6">
					{DAYS.map((day) => (
						<div
							key={day.key}
							className="p-4 rounded-xl border border-border/60 bg-muted/20 hover:border-primary/40 transition-colors flex flex-col justify-between h-36"
						>
							<div className="space-y-1">
								<span className="text-xs font-bold text-foreground block">{day.name}</span>
								<span className="text-[11px] font-medium text-primary block">{day.subject}</span>
							</div>

							<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-3 border-t border-border/40 font-mono">
								<IconClock className="size-3.5 shrink-0" />
								<span>{day.time}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
