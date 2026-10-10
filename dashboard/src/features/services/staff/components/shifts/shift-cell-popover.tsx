import { IconChevronDown, IconClock } from "@tabler/icons-react";
import { format, getDay } from "date-fns";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { SHIFT_TYPE_MAP, SHIFT_TYPES } from "@/features/services/staff/data/shifts";
import type { ShiftAssignmentResponse, ShiftType } from "@/server/shifts/shifts.type";

// دقائق من منتصف الليل → "HH:mm"
const minutesToTime = (m: number) =>
	`${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
// "HH:mm" → دقائق من منتصف الليل
const timeToMinutes = (t: string) => {
	const [h, m] = t.split(":").map(Number);
	return (h || 0) * 60 + (m || 0);
};
// "HH:mm" → "hh:mm صباحًا/مساءً"
const time12 = (t: string) => {
	const [h, m] = t.split(":").map(Number);
	const period = h < 12 ? "صباحًا" : "مساءً";
	const hh = h % 12 === 0 ? 12 : h % 12;
	return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

// تسميات مختصرة لأيام الأسبوع (مفهرسة بقيمة getDay: 0=الأحد)
const WEEKDAY_SHORT = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

// حقل وقت مضغوط: أيقونة ساعة + الوقت بصيغة 12 ساعة + منتقي الوقت الأصلي
function TimeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
	const ref = useRef<HTMLInputElement>(null);
	return (
		<button
			type="button"
			onClick={() => ref.current?.showPicker?.()}
			className="relative flex h-[22px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-1.5"
		>
			<IconClock className="size-[11px] shrink-0 text-[#8D8D8D]" />
			<span className="whitespace-nowrap text-[9px] text-[#8D8D8D] tabular-nums">
				{time12(value)}
			</span>
			<input
				ref={ref}
				type="time"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="pointer-events-none absolute inset-0 size-full opacity-0"
			/>
		</button>
	);
}

export function ShiftCellPopover({
	staffId,
	days,
	shiftByCell,
	onUpsert,
	onUpsertSilent,
	onRemove,
	children,
}: {
	staffId: string;
	days: Date[];
	shiftByCell: Map<string, ShiftAssignmentResponse>;
	// إضافة/تحديث مفرد (مع توست) — يُستخدم عند تفعيل يوم
	onUpsert: (args: {
		staffId: string;
		date: string;
		type: ShiftType;
		startMinute: number;
		endMinute: number;
		hours: number;
	}) => void;
	// تحديث مجمّع صامت (بدون توست) — عند تغيير النوع/الوقت على الأيام المفعّلة
	onUpsertSilent: (args: {
		staffId: string;
		date: string;
		type: ShiftType;
		startMinute: number;
		endMinute: number;
		hours: number;
	}) => void;
	onRemove: (args: { staffId: string; date: string }) => void;
	children: ReactNode;
}) {
	// مناوبات هذا الموظف في الأسبوع المعروض
	const staffShifts = useMemo(
		() =>
			days
				.map((d) => shiftByCell.get(`${staffId}_${format(d, "yyyy-MM-dd")}`))
				.filter((s): s is ShiftAssignmentResponse => !!s),
		[days, shiftByCell, staffId],
	);

	// القالب: النوع والأوقات المطبّقة عند تفعيل يوم — يبدأ من أول مناوبة موجودة أو الصباح
	const seed = staffShifts[0];
	const seedType = seed?.type ?? "MORNING";
	const [type, setType] = useState<ShiftType>(seedType);
	const [startTime, setStartTime] = useState(
		minutesToTime(seed?.startMinute ?? SHIFT_TYPE_MAP[seedType].defaultStart),
	);
	const [endTime, setEndTime] = useState(
		minutesToTime(seed?.endMinute ?? SHIFT_TYPE_MAP[seedType].defaultEnd),
	);

	// تفعيل الاستراحة ضمن المناوبة (توجل واجهة)
	const [breakEnabled, setBreakEnabled] = useState(false);

	const startMinute = timeToMinutes(startTime);
	let endMinute = timeToMinutes(endTime);
	if (endMinute <= startMinute) endMinute += 1440;
	const hours = Math.round(((endMinute - startMinute) / 60) * 100) / 100;

	// تطبيق القالب الحالي على يوم محدد (إنشاء/تحديث)
	const applyToDate = (dateKey: string) =>
		onUpsert({
			staffId,
			date: dateKey,
			type,
			startMinute: timeToMinutes(startTime),
			endMinute: timeToMinutes(endTime),
			hours,
		});

	// تبديل يوم: مفعّل → حذف، غير مفعّل → إضافة بالقالب الحالي
	const toggleDay = (day: Date) => {
		const dateKey = format(day, "yyyy-MM-dd");
		if (shiftByCell.has(`${staffId}_${dateKey}`)) {
			onRemove({ staffId, date: dateKey });
		} else {
			applyToDate(dateKey);
		}
	};

	// إعادة تطبيق القالب على كل الأيام المفعّلة (عند تغيير النوع/الوقت)
	const reapplyToSelected = (overrides?: {
		type?: ShiftType;
		startTime?: string;
		endTime?: string;
	}) => {
		const nextType = overrides?.type ?? type;
		const s = timeToMinutes(overrides?.startTime ?? startTime);
		let e = timeToMinutes(overrides?.endTime ?? endTime);
		if (e <= s) e += 1440;
		const h = Math.round(((e - s) / 60) * 100) / 100;
		for (const day of days) {
			const dateKey = format(day, "yyyy-MM-dd");
			if (shiftByCell.has(`${staffId}_${dateKey}`)) {
				onUpsertSilent({
					staffId,
					date: dateKey,
					type: nextType,
					startMinute: timeToMinutes(overrides?.startTime ?? startTime),
					endMinute: timeToMinutes(overrides?.endTime ?? endTime),
					hours: h,
				});
			}
		}
	};

	const onTypeChange = (value: ShiftType) => {
		const meta = SHIFT_TYPE_MAP[value];
		const nextStart = minutesToTime(meta.defaultStart);
		const nextEnd = minutesToTime(meta.defaultEnd);
		setType(value);
		setStartTime(nextStart);
		setEndTime(nextEnd);
		reapplyToSelected({ type: value, startTime: nextStart, endTime: nextEnd });
	};

	const typeMeta = SHIFT_TYPE_MAP[type];

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				align="center"
				className="w-[338px] gap-0 rounded-[4px] border-[0.75px] border-[#DADADA] p-[0.75px] ring-0"
			>
				<div
					dir="rtl"
					className="flex w-full flex-col gap-[9px] px-3 py-[9px]"
				>
					{/* العنوان */}
					<span className="w-full text-right text-[11px] font-bold leading-[18px] text-[#08090A]">
						جدولة أيام العمل والمناوبات
					</span>

					<span className="h-px w-full bg-[#D8D8D8]" />

					{/* أيام العمل — التسمية يمينًا والدوائر يسارًا */}
					<div className="flex w-full items-center justify-between py-[7.5px]">
						<span className="shrink-0 text-[10px] font-medium text-[#08090A]">أيام العمل</span>
						<div className="flex items-center gap-1.5">
							{days.map((day) => {
								const dateKey = format(day, "yyyy-MM-dd");
								const active = shiftByCell.has(`${staffId}_${dateKey}`);
								return (
									<button
										key={dateKey}
										type="button"
										onClick={() => toggleDay(day)}
										className="flex h-[26px] w-[25px] items-center justify-center rounded-full border text-[7px] transition-colors"
										style={
											active
												? {
														backgroundColor: "#A7AEEB",
														borderColor: "#A7AEEB",
														color: "#FFFFFF",
													}
												: {
														backgroundColor: "#FFFFFF",
														borderColor: "#EEEEEE",
														color: "#9B9B9D",
													}
										}
									>
										{WEEKDAY_SHORT[getDay(day)]}
									</button>
								);
							})}
						</div>
					</div>

					<span className="h-px w-full bg-[#D8D8D8]" />

					{/* المناوبة (يمينًا) + الأوقات (يسارًا) */}
					<div className="flex w-full items-center justify-between pt-[7.5px] pb-[7px]">
						{/* منتقي نوع المناوبة (يمين): التسمية ثم الزر */}
						<div className="flex items-center gap-2">
							<span className="text-[10px] font-medium text-[#08090A]">المناوبة</span>
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="flex h-[22px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[7.5px] text-[11px] font-medium text-[#08090A]"
									>
										<span
											className="size-2 rounded-full"
											style={{ backgroundColor: typeMeta.color }}
										/>
										{typeMeta.shortLabel}
										<IconChevronDown className="size-2.5 text-[#9B9B9D]" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="min-w-[120px] p-[3px]"
								>
									{SHIFT_TYPES.map((t) => (
										<DropdownMenuItem
											key={t.key}
											onSelect={() => onTypeChange(t.key)}
											className="flex h-6 items-center justify-start gap-1.5 rounded-[4px] px-[9px] text-right text-[10px] font-medium text-[#08090A]"
										>
											<span
												className="size-2 rounded-full"
												style={{ backgroundColor: t.color }}
											/>
											{t.label}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* الأوقات (يسار): البداية → إلي → النهاية */}
						<div className="flex items-center gap-1.5">
							<TimeField
								value={startTime}
								onChange={(v) => {
									setStartTime(v);
									reapplyToSelected({ startTime: v });
								}}
							/>
							<span className="text-[10px] text-[#8D8D8D]">إلي</span>
							<TimeField
								value={endTime}
								onChange={(v) => {
									setEndTime(v);
									reapplyToSelected({ endTime: v });
								}}
							/>
						</div>
					</div>

					<span className="h-px w-full bg-[#D8D8D8]" />

					{/* تفعيل الاستراحة — التسمية يمينًا والسويتش يسارًا */}
					<div className="flex w-full items-center justify-between pt-[7.5px] pb-[7px]">
						<span className="text-[10px] font-medium text-[#08090A]">تفعيل الاستراحة</span>
						<Switch
							checked={breakEnabled}
							onCheckedChange={setBreakEnabled}
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
