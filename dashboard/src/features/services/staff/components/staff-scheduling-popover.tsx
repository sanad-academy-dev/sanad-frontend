import {
	IconCalendarEvent,
	IconCalendarTime,
	IconCircleCheck,
	IconCircleX,
	IconClock,
	IconMoon,
	IconSun,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/common/spinner";
import { TimeSelect } from "@/components/common/time-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useStaffScheduling } from "@/features/services/staff/hooks/use-staff-scheduling";
import { useUpdateStaffSchedulingSettings } from "@/features/services/staff/hooks/use-update-staff-scheduling-settings";
import { useUpdateStaffWorkingHour } from "@/features/services/staff/hooks/use-update-staff-working-hour";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import type { Weekday } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { StaffShift } from "@/server/staff-scheduling/staff-scheduling.type";

const WORK_DAYS: { label: string; shortLabel: string; value: Weekday }[] = [
	{ label: "الأحد", shortLabel: "أحد", value: "SUNDAY" },
	{ label: "الاثنين", shortLabel: "اثنين", value: "MONDAY" },
	{ label: "الثلاثاء", shortLabel: "ثلاثاء", value: "TUESDAY" },
	{ label: "الأربعاء", shortLabel: "أربعاء", value: "WEDNESDAY" },
	{ label: "الخميس", shortLabel: "خميس", value: "THURSDAY" },
	{ label: "الجمعة", shortLabel: "جمعة", value: "FRIDAY" },
	{ label: "السبت", shortLabel: "سبت", value: "SATURDAY" },
];

const SHIFT_OPTIONS: { value: StaffShift; label: string }[] = [
	{ value: "MORNING", label: "صباحًا" },
	{ value: "EVENING", label: "مساءً" },
	{ value: "BOTH", label: "صباحًا ومساءً" },
];

const DEFAULT_MORNING_START = 480; // 08:00
const DEFAULT_MORNING_END = 720; // 12:00
const DEFAULT_EVENING_START = 780; // 13:00
const DEFAULT_EVENING_END = 1020; // 17:00

function PopoverInner({
	staffId,
	onShiftChange,
}: {
	staffId: string;
	onShiftChange: (shift: StaffShift | null) => void;
}) {
	const { scheduling, isLoading } = useStaffScheduling(staffId);
	const { updateSettings } = useUpdateStaffSchedulingSettings(staffId);
	const { updateWorkingHour } = useUpdateStaffWorkingHour(staffId);
	const { clinicInfo } = useClinicInfo();
	const timeFormat = (clinicInfo?.timeFormat ?? "H12") as "H12" | "H24";

	useEffect(() => {
		if (scheduling?.settings.shift !== undefined) {
			onShiftChange(scheduling.settings.shift);
		}
	}, [scheduling?.settings.shift, onShiftChange]);

	if (isLoading || !scheduling) {
		return (
			<div className="flex h-36 items-center justify-center p-4">
				<Spinner className="size-5 text-primary" />
			</div>
		);
	}

	const { settings, workingHours } = scheduling;
	const activeWeekdays = workingHours.filter((h) => h.isWorking).map((h) => h.weekday);

	const handleWorkDaysChange = (value: string[]) => {
		const added = value.filter((v) => !activeWeekdays.includes(v as Weekday));
		const removed = activeWeekdays.filter((v) => !value.includes(v));
		for (const weekday of added) {
			updateWorkingHour({ weekday: weekday as Weekday, isWorking: true });
		}
		for (const weekday of removed) {
			updateWorkingHour({ weekday: weekday as Weekday, isWorking: false });
		}
	};

	const handleShiftChange = (value: string) => {
		const shift = value as StaffShift;
		updateSettings({ shift });
		onShiftChange(shift);
	};

	const shift = settings.shift;
	const showMorning = shift === "MORNING" || shift === "BOTH";
	const showEvening = shift === "EVENING" || shift === "BOTH";

	const morningStart = settings.morningStartMinute ?? DEFAULT_MORNING_START;
	const morningEnd = settings.morningEndMinute ?? DEFAULT_MORNING_END;
	const eveningStart = settings.eveningStartMinute ?? DEFAULT_EVENING_START;
	const eveningEnd = settings.eveningEndMinute ?? DEFAULT_EVENING_END;

	return (
		<div
			className="flex flex-col gap-4 text-right"
			dir="rtl"
		>
			{/* العنوان ورأس النافذة */}
			<div className="flex items-center justify-between pb-3 border-b border-slate-100">
				<div className="flex items-center gap-2.5">
					<div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
						<IconCalendarTime className="size-4" />
					</div>
					<div>
						<h4 className="font-semibold text-sm text-slate-900">مواعيد وأيام العمل</h4>
						<p className="text-[11px] text-muted-foreground">جدولة مناوبات وحضور الموظف</p>
					</div>
				</div>
			</div>

			{/* أيام العمل */}
			<div className="space-y-2">
				<div className="flex items-center justify-between text-xs">
					<span className="font-semibold text-slate-800 flex items-center gap-1.5">
						<IconCalendarEvent className="size-4 text-primary" />
						أيام العمل الأسبوعية
					</span>
					<span className="text-[11px] font-medium text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
						{activeWeekdays.length} أيام محددة
					</span>
				</div>

				<ToggleGroup
					type="multiple"
					value={activeWeekdays}
					onValueChange={handleWorkDaysChange}
					className="grid grid-cols-7 gap-1.5 w-full bg-slate-50/80 p-2 rounded-xl border border-slate-200/70"
				>
					{WORK_DAYS.map((day) => (
						<ToggleGroupItem
							key={day.value}
							value={day.value}
							className={cn(
								"h-9 w-full rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center justify-center p-0",
								"bg-white border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-2xs",
								"data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:border-primary data-[state=on]:font-semibold data-[state=on]:shadow-xs data-[state=on]:hover:bg-primary/90 data-[state=on]:hover:text-white",
							)}
						>
							{day.shortLabel}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</div>

			{/* نوع المناوبة وتفاصيل الأوقات */}
			<div className="space-y-3 pt-1">
				<div className="flex items-center justify-between">
					<span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
						<IconClock className="size-4 text-primary" />
						فترة المناوبة
					</span>
					<Select
						value={shift ?? undefined}
						onValueChange={handleShiftChange}
						dir="rtl"
					>
						<SelectTrigger
							size="sm"
							className="w-44 bg-white border-slate-200/80 font-medium text-xs shadow-2xs h-9 rounded-lg"
						>
							<SelectValue placeholder="اختر نوع المناوبة" />
						</SelectTrigger>
						<SelectContent align="end">
							{SHIFT_OPTIONS.map((opt) => (
								<SelectItem
									key={opt.value}
									value={opt.value}
									className="text-xs font-medium cursor-pointer"
								>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* صفوف أوقات المناوبة */}
				{(showMorning || showEvening) && (
					<div className="flex flex-col gap-2.5 rounded-xl bg-slate-50/80 p-3 border border-slate-200/70">
						{showMorning && (
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md shrink-0">
									<IconSun className="size-3.5 text-amber-600" />
									<span>صباحي</span>
								</div>
								<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
									<span className="text-[11px] font-medium text-slate-500">من</span>
									<TimeSelect
										value={morningStart}
										onValueChange={(v) => updateSettings({ morningStartMinute: v })}
										format={timeFormat}
									/>
									<span className="text-[11px] font-medium text-slate-500">إلى</span>
									<TimeSelect
										value={morningEnd}
										onValueChange={(v) => updateSettings({ morningEndMinute: v })}
										format={timeFormat}
									/>
								</div>
							</div>
						)}

						{showEvening && (
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md shrink-0">
									<IconMoon className="size-3.5 text-indigo-600" />
									<span>مسائي</span>
								</div>
								<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
									<span className="text-[11px] font-medium text-slate-500">من</span>
									<TimeSelect
										value={eveningStart}
										onValueChange={(v) => updateSettings({ eveningStartMinute: v })}
										format={timeFormat}
									/>
									<span className="text-[11px] font-medium text-slate-500">إلى</span>
									<TimeSelect
										value={eveningEnd}
										onValueChange={(v) => updateSettings({ eveningEndMinute: v })}
										format={timeFormat}
									/>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* شريط معلومات المزامنة التلقائية */}
			<div className="flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/15 p-2.5 text-xs text-primary">
				<IconCircleCheck className="size-4 shrink-0 mt-0.5 text-primary" />
				<span className="text-[11.5px] leading-relaxed">
					تتم مزامنة مواعيد وأيام العمل تلقائياً مع جدول المناوبات وسجلات الحضور والانصراف.
				</span>
			</div>
		</div>
	);
}

export function StaffSchedulingPopover({
	staffId,
	shift: initialShift,
}: {
	staffId: string;
	shift: StaffShift | null | undefined;
}) {
	const [open, setOpen] = useState(false);
	const [currentShift, setCurrentShift] = useState(initialShift);
	const isConfigured = currentShift !== null && currentShift !== undefined;

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-all border shadow-2xs",
						isConfigured
							? "bg-emerald-50 text-emerald-700 border-emerald-200/70 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
							: "bg-rose-50 text-rose-700 border-rose-200/70 hover:bg-rose-100/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
					)}
				>
					{isConfigured ? (
						<>
							<IconCircleCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
							<span>تم الإعداد</span>
						</>
					) : (
						<>
							<IconCircleX className="size-3 text-rose-600 dark:text-rose-400" />
							<span>يحتاج إعداد</span>
						</>
					)}
				</button>
			</PopoverTrigger>
			
			<PopoverContent
				className="w-[450px] p-4 rounded-2xl shadow-xl border-slate-200/80"
				align="start"
				sideOffset={8}
			>
				{ open && (
					<PopoverInner
						staffId={staffId}
						onShiftChange={setCurrentShift}
					/>
				)}
			</PopoverContent>
		</Popover>
	);
}
