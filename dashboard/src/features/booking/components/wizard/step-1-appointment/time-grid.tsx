import { IconCheck, IconClock, IconUsers } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

const formatTime = (minute: number): string => {
	const h = Math.floor(minute / 60);
	const m = minute % 60;
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

type SlotCardProps = {
	startMinute: number;
	available: boolean;
	durationMinutes: number;
	isSelected: boolean;
	onSelect: () => void;
};

const SlotCard = ({
	startMinute,
	available,
	durationMinutes,
	isSelected,
	onSelect,
}: SlotCardProps) => {
	return (
		<button
			type="button"
			onClick={onSelect}
			disabled={!available}
			aria-pressed={isSelected}
			className={cn(
				"flex flex-col items-center gap-1.5 rounded-xl border bg-card px-3 py-3 text-center transition-colors",
				available && "hover:bg-muted/40",
				isSelected && "border-primary bg-primary/5",
				!available && "cursor-not-allowed opacity-60",
			)}
		>
			<span
				className={cn(
					"text-base font-bold",
					available ? "text-foreground" : "text-muted-foreground",
					isSelected && "text-primary",
				)}
			>
				{formatTime(startMinute)}
			</span>
			<span
				className={cn(
					"flex items-center gap-1 text-xs font-medium",
					available ? "text-emerald-600" : "text-destructive",
				)}
			>
				{available ? (
					<>
						<IconCheck className="size-3.5" />
						زيارة متاحة
					</>
				) : (
					<>
						<IconUsers className="size-3.5" />
						مكتمل
					</>
				)}
			</span>
			<span className="flex items-center gap-1 text-[11px] text-muted-foreground">
				<IconClock className="size-3" />
				{durationMinutes} دقيقة
			</span>
		</button>
	);
};

type TimeGridProps = {
	slots: { startMinute: number; available: boolean }[];
	durationMinutes: number;
	selectedSlot: number | null;
	onSelect: (startMinute: number) => void;
};

export const TimeGrid = ({
	slots,
	durationMinutes,
	selectedSlot,
	onSelect,
}: TimeGridProps) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
				<IconClock className="size-4" />
				<span>اختر الوقت</span>
				<span className="text-destructive">*</span>
			</div>

			<div className="flex items-center gap-3 text-xs text-muted-foreground">
				<span className="flex items-center gap-1">
					<span className="size-2 rounded-full bg-emerald-500" />
					أماكن متاحة
				</span>
				<span className="flex items-center gap-1">
					<span className="size-2 rounded-full bg-destructive" />
					مكتمل
				</span>
			</div>

			{slots.length === 0 ? (
				<div className="rounded-xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
					لا توجد زيارات متاحة في هذا اليوم
				</div>
			) : (
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
					{slots.map((slot) => (
						<SlotCard
							key={slot.startMinute}
							startMinute={slot.startMinute}
							available={slot.available}
							durationMinutes={durationMinutes}
							isSelected={selectedSlot === slot.startMinute}
							onSelect={() => onSelect(slot.startMinute)}
						/>
					))}
				</div>
			)}
		</div>
	);
};
