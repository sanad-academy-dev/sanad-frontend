import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
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

const WORK_DAYS: { label: string; value: Weekday }[] = [
	{ label: "سبت", value: "SATURDAY" },
	{ label: "جمعة", value: "FRIDAY" },
	{ label: "خميس", value: "THURSDAY" },
	{ label: "اربعاء", value: "WEDNESDAY" },
	{ label: "ثلاثاء", value: "TUESDAY" },
	{ label: "اثنين", value: "MONDAY" },
	{ label: "احد", value: "SUNDAY" },
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

function Row({
	label,
	children,
	className,
}: {
	label: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex items-start justify-between gap-3", className)}>
			<span className="text-sm font-medium pt-1 shrink-0">{label}</span>
			<div className="flex flex-col items-end gap-2">{children}</div>
		</div>
	);
}

function TimeRow({
	label,
	startMinute,
	endMinute,
	onStartChange,
	onEndChange,
	timeFormat,
}: {
	label: string;
	startMinute: number;
	endMinute: number;
	onStartChange: (v: number) => void;
	onEndChange: (v: number) => void;
	timeFormat: "H12" | "H24";
}) {
	return (
		<div className="flex items-center gap-1.5">
			<span className="text-xs text-muted-foreground w-10 shrink-0">{label}</span>
			<span className="text-xs text-muted-foreground">من</span>
			<TimeSelect
				value={startMinute}
				onValueChange={onStartChange}
				format={timeFormat}
			/>
			<span className="text-xs text-muted-foreground">إلى</span>
			<TimeSelect
				value={endMinute}
				onValueChange={onEndChange}
				format={timeFormat}
			/>
		</div>
	);
}

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
			<div className="flex h-10 items-center justify-center p-4">
				<Spinner className="size-4" />
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
			className="flex flex-col gap-3"
			dir="rtl"
		>
			<p className="font-semibold text-sm">جدولة أيام العمل والمناوبات</p>
			<div className="h-px bg-border" />

			<Row label="أيام العمل">
				<ToggleGroup
					type="multiple"
					value={activeWeekdays}
					onValueChange={handleWorkDaysChange}
					className="flex-wrap justify-end gap-1.5 bg-transparent"
				>
					{WORK_DAYS.map((day) => (
						<ToggleGroupItem
							key={day.value}
							value={day.value}
							className="size-9! rounded-full! border bg-white text-xs font-medium text-muted-foreground shadow-none! hover:bg-white data-[state=on]:border-primary/20 data-[state=on]:bg-primary data-[state=on]:primarydata-[state=on]:shadow-md data-[state=on]:hover:bg-primary data-[state=on]:hover:text-white"
						>
							{day.label}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</Row>

			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium shrink-0">المناوبة</span>
					<Select
						value={shift ?? undefined}
						onValueChange={handleShiftChange}
						dir="rtl"
					>
						<SelectTrigger
							size="sm"
							className="bg-white w-40"
						>
							<SelectValue placeholder="اختر" />
						</SelectTrigger>
						<SelectContent>
							{SHIFT_OPTIONS.map((opt) => (
								<SelectItem
									key={opt.value}
									value={opt.value}
								>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{showMorning && (
					<TimeRow
						label="صباحي"
						startMinute={morningStart}
						endMinute={morningEnd}
						onStartChange={(v) => updateSettings({ morningStartMinute: v })}
						onEndChange={(v) => updateSettings({ morningEndMinute: v })}
						timeFormat={timeFormat}
					/>
				)}

				{showEvening && (
					<TimeRow
						label="مسائي"
						startMinute={eveningStart}
						endMinute={eveningEnd}
						onStartChange={(v) => updateSettings({ eveningStartMinute: v })}
						onEndChange={(v) => updateSettings({ eveningEndMinute: v })}
						timeFormat={timeFormat}
					/>
				)}
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
					className="flex items-center gap-1 text-sm cursor-pointer hover:opacity-80 transition-opacity"
				>
					{isConfigured ? (
						<>
							<IconCircleCheck className="size-4 text-emerald-500" />
							<span className="text-emerald-500">تم الاعداد</span>
						</>
					) : (
						<>
							<IconCircleX className="size-4 text-red-500" />
							<span className="text-red-500">يحتاج اعداد</span>
						</>
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[440px] h-fit"
				align="start"
			>
				{open && (
					<PopoverInner
						staffId={staffId}
						onShiftChange={setCurrentShift}
					/>
				)}
			</PopoverContent>
		</Popover>
	);
}
