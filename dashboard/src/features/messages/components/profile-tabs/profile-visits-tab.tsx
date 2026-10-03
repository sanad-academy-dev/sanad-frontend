import { IconChevronLeft, IconChevronRight, IconStethoscope } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ConversationVisit, VisitStatus } from "@/features/messages/types/messages.type";
import { VISIT_STATUS_LABELS } from "@/features/messages/types/messages.type";
import { cn } from "@/lib/utils";

/** شريط أيام الأسبوع في تقويم «زياراتي» — عرض ثابت حتى ربط جدولة الجلسات */
const VISIT_WEEK = {
	label: "20 يوليو - 26 يوليو",
	days: [
		{ day: 20, weekday: "الجمعة" },
		{ day: 21, weekday: "السبت" },
		{ day: 22, weekday: "الأحد" },
		{ day: 23, weekday: "الاثنين" },
		{ day: 24, weekday: "الثلاثاء" },
		{ day: 25, weekday: "الأربعاء" },
		{ day: 26, weekday: "الخميس" },
	],
};

type VisitFilter = "all" | "queue" | "late" | "done";

const VISIT_FILTERS: { value: VisitFilter; label: string }[] = [
	{ value: "all", label: "الكل" },
	{ value: "queue", label: "الطابور" },
	{ value: "late", label: "متأخر" },
	{ value: "done", label: "مكتمل" },
];

const STATUS_CLASS: Record<VisitStatus, string> = {
	queue: "bg-muted text-muted-foreground",
	inService: "bg-orange-500/10 text-orange-500",
	onHold: "bg-muted text-muted-foreground",
	done: "bg-green-500/10 text-green-600",
	cancelled: "bg-destructive/10 text-destructive",
};

const matchesFilter = (visit: ConversationVisit, filter: VisitFilter) => {
	if (filter === "all") return true;
	if (filter === "queue") return visit.status === "queue";
	if (filter === "late") return visit.status === "onHold";
	return visit.status === "done";
};

export function ProfileVisitsTab({ visits }: { visits: ConversationVisit[] }) {
	const [activeDay, setActiveDay] = useState(24);
	const [filter, setFilter] = useState<VisitFilter>("all");

	const rows = visits.filter((v) => v.day === activeDay && matchesFilter(v, filter));

	return (
		<div className="flex flex-col">
			{/* تقويم الأسبوع */}
			<section className="px-3 pt-3">
				<h3 className="pb-2 text-[12px] font-medium text-foreground">زياراتي</h3>

				<div className="rounded-[4px] border p-3">
					{/* تنقّل الأسبوع — السهم الأيمن للأسبوع السابق في RTL */}
					<div className="flex items-center justify-between">
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="الأسبوع السابق"
							className="text-muted-foreground"
						>
							<IconChevronRight className="size-4" />
						</Button>
						<span className="text-[13px] font-medium text-foreground">{VISIT_WEEK.label}</span>
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="الأسبوع التالي"
							className="text-muted-foreground"
						>
							<IconChevronLeft className="size-4" />
						</Button>
					</div>

					{/* أيام الأسبوع */}
					<div className="mt-3 flex items-start justify-between">
						{VISIT_WEEK.days.map((item) => {
							const isActive = item.day === activeDay;
							return (
								<button
									key={item.day}
									type="button"
									onClick={() => setActiveDay(item.day)}
									className="flex flex-col items-center gap-1"
								>
									<span className="text-[11px] leading-none text-muted-foreground">
										{item.weekday}
									</span>
									<span
										className={cn(
											"flex size-7 items-center justify-center rounded-full text-[13px] font-medium tabular-nums transition-colors",
											isActive
												? "bg-primary text-primary-foreground"
												: "text-foreground hover:bg-muted",
										)}
									>
										{item.day}
									</span>
								</button>
							);
						})}
					</div>
				</div>
			</section>

			{/* الجلسات */}
			<section className="px-3 pt-4 pb-3">
				<div className="flex items-center justify-between gap-2 pb-2">
					<h3 className="text-[13px] font-semibold text-foreground">جلساتي</h3>
					<div className="flex items-center gap-0.5">
						{VISIT_FILTERS.map((item) => (
							<button
								key={item.value}
								type="button"
								onClick={() => setFilter(item.value)}
								className={cn(
									"rounded-[4px] px-1.5 py-0.5 text-[11px] font-medium transition-colors",
									filter === item.value
										? "bg-foreground/8 text-foreground"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{item.label}
							</button>
						))}
					</div>
				</div>

				{rows.length === 0 ? (
					<p className="py-8 text-center text-[12px] text-muted-foreground">
						لا توجد جلسات في هذا اليوم
					</p>
				) : (
					<ul className="flex flex-col gap-1.5">
						{rows.map((visit) => (
							<li key={visit.id}>
								<div className="flex items-center gap-2 rounded-[4px] border px-2 py-2">
									<span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-muted text-muted-foreground">
										<IconStethoscope className="size-4" />
									</span>

									<span className="flex min-w-0 flex-col gap-0.5">
										<span className="truncate text-[13px] font-semibold text-foreground">
											{visit.patientName}
										</span>
										<span className="truncate text-[11px] text-muted-foreground">
											{visit.ownerName}
										</span>
									</span>

									<span className="ms-auto flex items-center gap-2">
										{visit.timeLabel && (
											<span className="text-[11px] text-muted-foreground">
												{visit.timeLabel} • {visit.typeLabel}
											</span>
										)}
										<span
											className={cn(
												"rounded-[4px] px-1.5 py-0.5 text-[11px] font-medium",
												STATUS_CLASS[visit.status],
											)}
										>
											{VISIT_STATUS_LABELS[visit.status]}
										</span>
									</span>
								</div>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
