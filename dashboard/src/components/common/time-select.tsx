import { IconClock } from "@tabler/icons-react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { TimeFormat } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

const START_HOUR = 6;
const END_HOUR = 23;
const STEP_MINUTES = 30;

const minuteToLabel = (minute: number, format: TimeFormat) => {
	const hour24 = Math.floor(minute / 60);
	const minutes = minute % 60;
	const minutesText = String(minutes).padStart(2, "0");

	if (format === "H24") {
		return `${String(hour24).padStart(2, "0")}:${minutesText}`;
	}

	const period = hour24 >= 12 ? "مساءً" : "صباحًا";
	const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
	return `${String(hour12).padStart(2, "0")}:${minutesText} ${period}`;
};

export function buildTimeOptions(format: TimeFormat) {
	const options: { value: number; label: string }[] = [];
	for (let h = START_HOUR; h <= END_HOUR; h++) {
		for (let m = 0; m < 60; m += STEP_MINUTES) {
			const value = h * 60 + m;
			options.push({ value, label: minuteToLabel(value, format) });
		}
	}
	return options;
}

export function TimeSelect({
	value,
	onValueChange,
	disabled,
	format = "H12",
	className,
}: {
	value: number;
	onValueChange: (value: number) => void;
	disabled?: boolean;
	format?: TimeFormat;
	className?: string;
}) {
	const options = buildTimeOptions(format);

	return (
		<Select
			value={String(value)}
			onValueChange={(nextValue) => onValueChange(Number(nextValue))}
			disabled={disabled}
			dir="rtl"
		>
			<SelectTrigger
				size="sm"
				className={cn("w-fit bg-white", className)}
			>
				<IconClock
					size={14}
					className="text-muted-foreground"
				/>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{options.map((time) => (
					<SelectItem
						key={time.value}
						value={String(time.value)}
					>
						{time.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
