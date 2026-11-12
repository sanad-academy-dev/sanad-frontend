import { IconClock } from "@tabler/icons-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type DurationUnit = "DAY" | "WEEK" | "MONTH" | "YEAR";

export function formatDuration(val: number | "", unit: DurationUnit): string {
	if (!val || typeof val !== "number" || val <= 0) return "";
	if (unit === "DAY") {
		if (val === 1) return "يوم واحد";
		if (val === 2) return "يومان";
		if (val >= 3 && val <= 10) return `${val} أيام`;
		return `${val} يوماً`;
	}
	if (unit === "WEEK") {
		if (val === 1) return "أسبوع واحد";
		if (val === 2) return "أسبوعان";
		if (val >= 3 && val <= 10) return `${val} أسابيع`;
		return `${val} أسبوعاً`;
	}
	if (unit === "MONTH") {
		if (val === 1) return "شهر واحد";
		if (val === 2) return "شهران";
		if (val >= 3 && val <= 10) return `${val} أشهر`;
		return `${val} شهراً`;
	}
	if (unit === "YEAR") {
		if (val === 1) return "سنة واحدة";
		if (val === 2) return "سنتان";
		if (val >= 3 && val <= 10) return `${val} سنوات`;
		return `${val} سنة`;
	}
	return `${val} ${unit}`;
}

export function parseDuration(durationStr?: string | null): {
	value: number | "";
	unit: DurationUnit;
} {
	if (!durationStr || !durationStr.trim()) {
		return { value: "", unit: "WEEK" };
	}

	const str = durationStr.trim().toLowerCase();

	let unit: DurationUnit = "WEEK";
	if (str.includes("يوم") || str.includes("أيام") || str.includes("day")) {
		unit = "DAY";
	} else if (str.includes("شهر") || str.includes("أشهر") || str.includes("month")) {
		unit = "MONTH";
	} else if (str.includes("سن") || str.includes("عام") || str.includes("year")) {
		unit = "YEAR";
	} else if (
		str.includes("أسبوع") ||
		str.includes("اسبوع") ||
		str.includes("أسابيع") ||
		str.includes("اسابيع") ||
		str.includes("week")
	) {
		unit = "WEEK";
	}

	const match = str.match(/\d+/);
	if (match) {
		const parsed = Number.parseInt(match[0], 10);
		return { value: parsed > 0 ? parsed : 1, unit };
	}

	if (str.includes("يومان")) return { value: 2, unit: "DAY" };
	if (str.includes("أسبوعان") || str.includes("اسبوعان")) return { value: 2, unit: "WEEK" };
	if (str.includes("شهران")) return { value: 2, unit: "MONTH" };
	if (str.includes("سنتان")) return { value: 2, unit: "YEAR" };

	if (str.includes("يوم")) return { value: 1, unit: "DAY" };
	if (str.includes("شهر")) return { value: 1, unit: "MONTH" };
	if (str.includes("سنة") || str.includes("عام")) return { value: 1, unit: "YEAR" };
	if (str.includes("أسبوع") || str.includes("اسبوع")) return { value: 1, unit: "WEEK" };

	return { value: 1, unit };
}

export interface DurationPickerPopoverProps {
	value?: string;
	onChange: (formattedDuration: string) => void;
	placeholder?: string;
	title?: string;
	label?: string;
	className?: string;
}

export function DurationPickerPopover({
	value = "",
	onChange,
	placeholder = "تحديد مدة المسار...",
	title = "فترة المسار التدريبي",
	label,
	className,
}: DurationPickerPopoverProps) {
	const [open, setOpen] = React.useState(false);

	const initial = React.useMemo(() => parseDuration(value), [value]);
	const [numValue, setNumValue] = React.useState<number | "">(initial.value);
	const [unit, setUnit] = React.useState<DurationUnit>(initial.unit);

	React.useEffect(() => {
		const parsed = parseDuration(value);
		setNumValue(parsed.value);
		setUnit(parsed.unit);
	}, [value]);

	const handleValueChange = (newValStr: string) => {
		if (newValStr === "") {
			setNumValue("");
			onChange("");
			return;
		}
		const num = Number.parseInt(newValStr, 10);
		if (Number.isNaN(num) || num <= 0) {
			setNumValue("");
			onChange("");
			return;
		}
		const clamped = Math.min(365, num);
		setNumValue(clamped);
		const formatted = formatDuration(clamped, unit);
		onChange(formatted);
	};

	const handleUnitChange = (newUnit: DurationUnit) => {
		setUnit(newUnit);
		const effectiveVal = numValue !== "" ? numValue : 1;
		setNumValue(effectiveVal);
		const formatted = formatDuration(effectiveVal, newUnit);
		onChange(formatted);
	};

	const handleClear = () => {
		setNumValue("");
		onChange("");
		setOpen(false);
	};

	const handlePresetClick = (presetVal: number, presetUnit: DurationUnit) => {
		setNumValue(presetVal);
		setUnit(presetUnit);
		const formatted = formatDuration(presetVal, presetUnit);
		onChange(formatted);
	};

	const buttonText = React.useMemo(() => {
		if (value) {
			return label ? `${label}: ${value}` : value;
		}
		return label ? `${label}: ${placeholder}` : placeholder;
	}, [value, label, placeholder]);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant={value ? "secondary" : "outline"}
					size="sm"
					className={cn(
						"gap-1.5 h-8 text-xs font-normal cursor-pointer select-none",
						value &&
							"font-semibold text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
						className,
					)}
				>
					<IconClock className="size-3.5 shrink-0 text-muted-foreground" />
					<span>{buttonText}</span>
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align="end"
				side="top"
				sideOffset={8}
				className="w-[290px] p-3 shadow-xl rounded-xl border bg-card text-card-foreground"
				dir="rtl"
			>
				{/* ترويسة البوب أوفر */}
				<div className="flex items-center justify-between pb-2 mb-2.5 border-b border-border">
					<div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
						<IconClock className="size-4 text-purple-600 dark:text-purple-400" />
						<span>{title}</span>
					</div>
					{value && (
						<button
							type="button"
							onClick={handleClear}
							className="text-[11px] text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
						>
							إلغاء المدة
						</button>
					)}
				</div>

				{/* حقلان منظمان: الأول للرقم، والثاني للوحدة */}
				<div className="space-y-2">
					<div className="grid grid-cols-5 gap-2 items-center">
						{/* حقل الرقم */}
						<div className="col-span-2 space-y-1">
							<span className="text-[10.5px] font-semibold text-muted-foreground block text-right">
								العدد / القيمة
							</span>
							<Input
								type="number"
								min="1"
								max="365"
								value={numValue}
								onChange={(e) => handleValueChange(e.target.value)}
								placeholder="مثال: 6"
								className="h-9 text-xs text-center font-bold"
							/>
						</div>

						{/* حقل الوحدة */}
						<div className="col-span-3 space-y-1">
							<span className="text-[10.5px] font-semibold text-muted-foreground block text-right">
								الوحدة الزمنية
							</span>
							<Select
								value={unit}
								onValueChange={(u) => handleUnitChange(u as DurationUnit)}
							>
								<SelectTrigger className="w-full h-9 text-xs font-medium">
									<SelectValue />
								</SelectTrigger>
								<SelectContent dir="rtl">
									<SelectItem value="DAY">يوم </SelectItem>
									<SelectItem value="WEEK">أسبوع </SelectItem>
									<SelectItem value="MONTH">شهر </SelectItem>
									<SelectItem value="YEAR">سنة </SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* أزرار الوحدات السريعة كشريط منظم ومريح */}
					{/* <div className="grid grid-cols-4 gap-1 p-0.5 bg-muted/50 rounded-lg">
						{[
							{ id: "DAY" as DurationUnit, label: "يوم" },
							{ id: "WEEK" as DurationUnit, label: "أسبوع" },
							{ id: "MONTH" as DurationUnit, label: "شهر" },
							{ id: "YEAR" as DurationUnit, label: "سنة" },
						].map((u) => (
							<button
								key={u.id}
								type="button"
								onClick={() => handleUnitChange(u.id)}
								className={cn(
									"py-1 text-[11px] font-medium rounded-md transition-all text-center cursor-pointer",
									unit === u.id
										? "bg-card text-purple-600 dark:text-purple-400 font-bold shadow-2xs border border-border"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{u.label}
							</button>
						))}
					</div>
					*/}
				</div>

				{/* المعاينة الحية والاختصارات الشائعة */}
				<div className="space-y-2 pt-2.5 mt-2.5 border-t border-border/70">
					{/* {value ? (
						<div className="flex items-center justify-between bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 rounded-lg px-2.5 py-1.5">
							<span className="text-[10.5px] text-muted-foreground font-medium">المدة المحددة:</span>
							<span className="text-xs font-bold text-purple-700 dark:text-purple-300">{value}</span>
						</div>
					) : (
						<div className="text-[11px] text-muted-foreground text-center py-1">
							أدخل رقماً واختر الوحدة لحساب المدة
						</div>
					)} */}

					{/* اختصارات شائعة بنقرة واحدة */}
					{/* <div className="flex items-center gap-1.5 justify-center flex-wrap pt-0.5">
						{[
							{ label: "أسبوعان", val: 2, u: "WEEK" as DurationUnit },
							{ label: "4 أسابيع", val: 4, u: "WEEK" as DurationUnit },
							{ label: "6 أسابيع", val: 6, u: "WEEK" as DurationUnit },
							{ label: "3 أشهر", val: 3, u: "MONTH" as DurationUnit },
						].map((preset) => (
							<button
								key={preset.label}
								type="button"
								onClick={() => handlePresetClick(preset.val, preset.u)}
								className={cn(
									"text-[10.5px] px-2 py-0.5 rounded-full border transition-all cursor-pointer",
									value === preset.label
										? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700 font-bold"
										: "border-border/70 hover:border-purple-300 hover:text-purple-600 bg-background text-muted-foreground",
								)}
							>
								{preset.label}
							</button>
						))}
					</div> */}
				</div>
			</PopoverContent>
		</Popover>
	);
}
