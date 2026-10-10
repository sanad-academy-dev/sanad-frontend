import { IconClock, IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CourseDetailResponse } from "@/server/training/training.type";
import { useAssignTime } from "../../hooks/use-assign-time";

// منطقة زمنية افتراضية من المتصفح (المسار ssr:false فالحساب على العميل)
const LOCAL_TZ =
	typeof Intl !== "undefined"
		? Intl.DateTimeFormat().resolvedOptions().timeZone
		: "Asia/Riyadh";

type TimeParts = { hour: number; minute: number; pm: boolean };

const toParts = (d: Date | null): TimeParts => {
	if (!d) return { hour: 9, minute: 0, pm: false };
	const h = d.getHours();
	return { hour: h % 12 || 12, minute: d.getMinutes(), pm: h >= 12 };
};

// يدمج تاريخًا مع وقت (12 ساعة + ص/م) إلى Date، أو null إن لم يُحدَّد تاريخ
function combine(date: Date | undefined, t: TimeParts): Date | null {
	if (!date) return null;
	const h24 = (t.hour % 12) + (t.pm ? 12 : 0);
	const d = new Date(date);
	d.setHours(h24, t.minute, 0, 0);
	return d;
}

const fmtDate = (d: Date | undefined) =>
	d
		? `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`
		: "";

// عمود تاريخ واحد: إدخال نصي (dd/mm/yyyy) + تقويم + وقت + ص/م
function DateColumn({
	label,
	date,
	time,
	onDate,
	onTime,
}: {
	label: string;
	date: Date | undefined;
	time: TimeParts;
	onDate: (d: Date | undefined) => void;
	onTime: (t: TimeParts) => void;
}) {
	return (
		<div className="flex flex-1 flex-col gap-2.5 rounded-2xl border border-[#E7E7EE] bg-white p-4">
			<span className="text-[12px] font-semibold text-[#08090A]">{label}</span>
			<Input
				readOnly
				value={fmtDate(date)}
				placeholder="dd/mm/yyyy"
				className="h-9 text-center text-[13px]"
			/>
			<Calendar
				mode="single"
				selected={date}
				defaultMonth={date}
				onSelect={onDate}
				className="rounded-xl border border-[#F0F0F5] p-2"
			/>
			{/* الوقت + ص/م */}
			<div className="flex items-center gap-2">
				<IconClock className="size-4 shrink-0 text-[#9B9B9D]" />
				<Input
					type="number"
					min={1}
					max={12}
					value={time.hour}
					onChange={(e) =>
						onTime({ ...time, hour: Math.min(12, Math.max(1, Number(e.target.value) || 1)) })
					}
					className="h-9 w-14 text-center text-[13px]"
				/>
				<span className="text-[#9B9B9D]">:</span>
				<Input
					type="number"
					min={0}
					max={59}
					value={time.minute.toString().padStart(2, "0")}
					onChange={(e) =>
						onTime({ ...time, minute: Math.min(59, Math.max(0, Number(e.target.value) || 0)) })
					}
					className="h-9 w-14 text-center text-[13px]"
				/>
				{/* مبدّل ص/م */}
				<div className="flex overflow-hidden rounded-lg border border-[#E7E7EE]">
					{[
						{ pm: false, label: "ص" },
						{ pm: true, label: "م" },
					].map((o) => (
						<button
							key={o.label}
							type="button"
							onClick={() => onTime({ ...time, pm: o.pm })}
							className={cn(
								"px-2.5 py-1.5 text-[12px] font-medium transition-colors",
								time.pm === o.pm ? "bg-primary text-white" : "bg-white text-[#6B6B67]",
							)}
						>
							{o.label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

export function StepAssignTime({
	course,
	courseId,
}: {
	course: CourseDetailResponse | undefined;
	courseId: string;
}) {
	const { saveTime } = useAssignTime(courseId);
	const [startDate, setStartDate] = useState<Date | undefined>(
		course?.startDate ? new Date(course.startDate) : undefined,
	);
	const [dueDate, setDueDate] = useState<Date | undefined>(
		course?.dueDate ? new Date(course.dueDate) : undefined,
	);
	const [startTime, setStartTime] = useState<TimeParts>(
		toParts(course?.startDate ? new Date(course.startDate) : null),
	);
	const [dueTime, setDueTime] = useState<TimeParts>(
		toParts(course?.dueDate ? new Date(course.dueDate) : null),
	);

	// يحفظ التاريخين معًا بعد أي تغيير
	const persist = (
		sd: Date | undefined,
		st: TimeParts,
		dd: Date | undefined,
		dt: TimeParts,
	) => {
		saveTime({
			startDate: combine(sd, st)?.toISOString() ?? null,
			dueDate: combine(dd, dt)?.toISOString() ?? null,
			timezone: LOCAL_TZ,
		});
	};

	return (
		<div className="mx-auto flex w-full max-w-[820px] flex-col gap-4 py-6">
			<div className="flex flex-col gap-1">
				<h2 className="text-[15px] font-bold text-[#08090A]">وقت التعيين</h2>
				<p className="text-[12px] text-[#6B6B67]">
					حدّد تاريخ بدء الدورة وتاريخ استحقاقها للمتدربين.
				</p>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row">
				<DateColumn
					label="تاريخ البدء"
					date={startDate}
					time={startTime}
					onDate={(d) => {
						setStartDate(d);
						persist(d, startTime, dueDate, dueTime);
					}}
					onTime={(t) => {
						setStartTime(t);
						persist(startDate, t, dueDate, dueTime);
					}}
				/>
				<DateColumn
					label="تاريخ الاستحقاق"
					date={dueDate}
					time={dueTime}
					onDate={(d) => {
						setDueDate(d);
						persist(startDate, startTime, d, dueTime);
					}}
					onTime={(t) => {
						setDueTime(t);
						persist(startDate, startTime, dueDate, t);
					}}
				/>
			</div>

			<div className="flex items-center gap-1.5 text-[11px] text-[#9B9B9D]">
				<IconInfoCircle className="size-3.5" />
				المنطقة الزمنية الحالية: {LOCAL_TZ}
			</div>
		</div>
	);
}
