import { IconPlus } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

import { Container } from "@/components/common/container";
import { TimeSelect } from "@/components/common/time-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConsultationTypesSection } from "@/features/services/staff/components/tabs/scheduling/consultation-types-section";
import { ServicesSection } from "@/features/services/staff/components/tabs/scheduling/services-section";
import { useStaffScheduling } from "@/features/services/staff/hooks/use-staff-scheduling";
import { useUpdateStaffSchedulingSettings } from "@/features/services/staff/hooks/use-update-staff-scheduling-settings";
import { useUpdateStaffWorkingHour } from "@/features/services/staff/hooks/use-update-staff-working-hour";
import type { StaffTabProps } from "@/features/services/staff/types/tabs.types";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import type { Weekday } from "@/generated/prisma/enums";
import type {
	StaffShift,
	StaffWorkingHourResponse,
} from "@/server/staff-scheduling/staff-scheduling.type";

const WEEKDAY_LABELS: { weekday: Weekday; label: string }[] = [
	{ weekday: "SATURDAY", label: "السبت" },
	{ weekday: "SUNDAY", label: "الأحد" },
	{ weekday: "MONDAY", label: "الإثنين" },
	{ weekday: "TUESDAY", label: "الثلاثاء" },
	{ weekday: "WEDNESDAY", label: "الأربعاء" },
	{ weekday: "THURSDAY", label: "الخميس" },
	{ weekday: "FRIDAY", label: "الجمعة" },
];

const SHIFT_OPTIONS: { value: StaffShift; label: string }[] = [
	{ value: "MORNING", label: "صباحًا" },
	{ value: "EVENING", label: "مساءً" },
	{ value: "BOTH", label: "صباحًا ومساءً" },
];

function Row({
	title,
	subtitle,
	action,
}: {
	title: string;
	subtitle?: string;
	action: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-3">
			<div className="flex flex-col gap-0.5">
				<p className="font-semibold text-sm">{title}</p>
				{subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
			</div>
			<div className="shrink-0">{action}</div>
		</div>
	);
}

function WeekdayRow({
	staffId,
	weekday,
	label,
	row,
	disabled,
}: {
	staffId: string;
	weekday: Weekday;
	label: string;
	row: StaffWorkingHourResponse | undefined;
	disabled: boolean;
}) {
	const { clinicInfo } = useClinicInfo();
	const timeFormat = clinicInfo?.timeFormat ?? "H12";
	const { updateWorkingHour } = useUpdateStaffWorkingHour(staffId);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		},
		[],
	);

	const isWorking = row?.isWorking ?? false;
	const startMinute = row?.startMinute ?? 480;
	const endMinute = row?.endMinute ?? 1020;

	const onToggle = (checked: boolean) => {
		updateWorkingHour({ weekday, isWorking: checked });
	};

	const onTimeChange = (field: "startMinute" | "endMinute", value: number) => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			updateWorkingHour({ weekday, [field]: value });
		}, 400);
	};

	return (
		<div className="flex items-center justify-between gap-3 py-1">
			<div className="flex items-center gap-3">
				<Switch
					checked={isWorking}
					onCheckedChange={onToggle}
					disabled={disabled}
				/>
				<span className="text-sm font-medium">{label}</span>
			</div>

			{isWorking ? (
				<div className="flex items-center gap-2">
					<span className="text-xs text-muted-foreground">من</span>
					<TimeSelect
						value={startMinute}
						onValueChange={(v) => onTimeChange("startMinute", v)}
						disabled={disabled}
						format={timeFormat}
					/>
					<span className="text-xs text-muted-foreground">إلي</span>
					<TimeSelect
						value={endMinute}
						onValueChange={(v) => onTimeChange("endMinute", v)}
						disabled={disabled}
						format={timeFormat}
					/>
				</div>
			) : (
				<Badge
					variant="outline"
					className="text-primary border-primary/30 bg-primary/5"
				>
					يوم عطلة
				</Badge>
			)}
		</div>
	);
}

function SchedulingTabSkeleton() {
	return (
		<div className="flex flex-col gap-6 p-4">
			<Skeleton className="h-32 w-full" />
			<Skeleton className="h-64 w-full" />
		</div>
	);
}

export function SchedulingContent({ staffId }: StaffTabProps) {
	const { scheduling, isLoading } = useStaffScheduling(staffId);
	const { updateSettings } = useUpdateStaffSchedulingSettings(staffId);

	if (!staffId) return null;

	if (isLoading || !scheduling) {
		return <SchedulingTabSkeleton />;
	}

	const { settings, workingHours } = scheduling;
	const workingHoursByDay = new Map(workingHours.map((row) => [row.weekday, row]));

	return (
		<div
			className="flex flex-col gap-6"
			dir="rtl"
		>
			<Container title="الجدولة">
				<Row
					title="الحجز عبر الإنترنت"
					subtitle="السماح للعملاء بحجز عبر الانترنت مع الموظف"
					action={
						<Switch
							checked={settings.onlineBookingEnabled}
							onCheckedChange={(checked) => updateSettings({ onlineBookingEnabled: checked })}
						/>
					}
				/>
				<Row
					title="استقبال زيارات بالأكاديمية"
					subtitle="السماح باستقبال زيارات في الأكاديمية"
					action={
						<Switch
							checked={settings.inClinicAppointmentsEnabled}
							onCheckedChange={(checked) =>
								updateSettings({ inClinicAppointmentsEnabled: checked })
							}
						/>
					}
				/>
				<Row
					title="استقبال زيارات في أكاديمية متنقلة"
					subtitle="السماح باستقبال زيارات في أكاديمية المتنقلة"
					action={
						<Switch
							checked={settings.mobileClinicAppointmentsEnabled}
							onCheckedChange={(checked) =>
								updateSettings({ mobileClinicAppointmentsEnabled: checked })
							}
						/>
					}
				/>
				<Row
					title="المناوبة"
					subtitle="هذا إعداد داخلي ولن يؤثر على كيفية عرض الأوقات في التقويم."
					action={
						<Select
							value={settings.shift ?? undefined}
							onValueChange={(value) => updateSettings({ shift: value as StaffShift })}
							dir="rtl"
						>
							<SelectTrigger
								size="sm"
								className="w-32 bg-white"
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
					}
				/>
			</Container>

			<Container
				title="ساعات العمل والتوفر"
				action={
					<Tooltip>
						<TooltipTrigger asChild>
							<span>
								<Button
									size="sm"
									variant="outline"
									disabled
									className="gap-1 text-primary"
								>
									<IconPlus className="size-4" />
									إضافة من القوالب
								</Button>
							</span>
						</TooltipTrigger>
						<TooltipContent>قريبًا</TooltipContent>
					</Tooltip>
				}
			>
				{WEEKDAY_LABELS.map(({ weekday, label }) => (
					<WeekdayRow
						key={weekday}
						staffId={staffId}
						weekday={weekday}
						label={label}
						row={workingHoursByDay.get(weekday)}
						disabled={false}
					/>
				))}
			</Container>
		</div>
	);
}

/** Service-related sections (الدورات + الكشوفات) — shown under the الدورات drill-in. */
export function ServicesContent({ staffId }: StaffTabProps) {
	if (!staffId) return null;

	return (
		<div
			className="flex flex-col gap-6"
			dir="rtl"
		>
			<ServicesSection staffId={staffId} />
			<ConsultationTypesSection staffId={staffId} />
		</div>
	);
}
