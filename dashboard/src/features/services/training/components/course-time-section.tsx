import { IconAlertCircle, IconCalendar, IconInfoCircle } from "@tabler/icons-react";
import { arSA } from "date-fns/locale";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// المنطقة الزمنية من المتصفح (اللوحة تعمل على العميل فالحساب محلي)
export const LOCAL_TZ =
	typeof Intl !== "undefined"
		? Intl.DateTimeFormat().resolvedOptions().timeZone
		: "Asia/Riyadh";

// قيمة القسم: تاريخان كاملان (تاريخ + وقت مدموجان) أو null لكلٍّ منهما
export type CourseTimeValue = { start: Date | null; due: Date | null };

// due > start فقط عندما يكون كلاهما محدَّدًا — الحالة الفارغة أو المفردة مسموحة (الخطوة اختيارية)
export const isCourseTimeValid = (v: CourseTimeValue) =>
	!(v.start && v.due) || v.due.getTime() > v.start.getTime();

const fmtDate = (d: Date) =>
	new Intl.DateTimeFormat("ar-SA", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(d);

// "HH:MM" من تاريخ (للربط بحقل الوقت)
const toTimeStr = (d: Date | null) =>
	d
		? `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
		: "";

// يدمج يوم التاريخ المختار مع وقت القيمة الحالية (9:00 افتراضيًا إن لم يوجد)
function withDatePart(base: Date | null, picked: Date): Date {
	const d = new Date(picked);
	d.setHours(base?.getHours() ?? 9, base?.getMinutes() ?? 0, 0, 0);
	return d;
}

// يطبّق وقت "HH:MM" على تاريخ قائم (الحقل معطّل ما لم يُختَر تاريخ)
function withTimePart(base: Date, value: string): Date {
	const [h, m] = value.split(":").map(Number);
	const d = new Date(base);
	d.setHours(h || 0, m || 0, 0, 0);
	return d;
}

// عمود تاريخ واحد: منتقي التقويم (popover) + حقل وقت
function DateTimeField({
	label,
	value,
	onChange,
	invalid,
}: {
	label: string;
	value: Date | null;
	onChange: (d: Date | null) => void;
	invalid?: boolean;
}) {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex flex-1 flex-col gap-1.5">
			<span className="text-[11px] font-medium text-foreground">{label}</span>
			<Popover
				open={open}
				onOpenChange={setOpen}
			>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="outline"
						aria-invalid={invalid}
						className={cn(
							"h-9 w-full justify-start gap-2 text-[12px] font-normal",
							!value && "text-muted-foreground",
						)}
					>
						<IconCalendar className="size-4 shrink-0" />
						<span className="truncate">{value ? fmtDate(value) : "dd/mm/yyyy"}</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-auto p-0"
					align="start"
				>
					<Calendar
						mode="single"
						selected={value ?? undefined}
						defaultMonth={value ?? undefined}
						onSelect={(d) => {
							onChange(d ? withDatePart(value, d) : null);
							setOpen(false);
						}}
						locale={arSA}
					/>
				</PopoverContent>
			</Popover>
			<Input
				type="time"
				dir="ltr"
				disabled={!value}
				value={toTimeStr(value)}
				onChange={(e) => value && onChange(withTimePart(value, e.target.value))}
				className="h-9 text-[12px]"
			/>
		</div>
	);
}

// قسم «وقت الدورة» — يظهر أسفل جدول المتدربين في الخطوة الثالثة
export function CourseTimeSection({
	value,
	onChange,
	error,
}: {
	value: CourseTimeValue;
	onChange: (v: CourseTimeValue) => void;
	error?: string;
}) {
	const invalid = !!error;
	return (
		<div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
			<div className="flex flex-col gap-0.5">
				<h3 className="text-[13px] font-bold text-foreground">وقت الدورة</h3>
				<p className="text-[11px] text-muted-foreground">
					حدّد تاريخ بدء الدورة وتاريخ استحقاقها للمتدربين (اختياري).
				</p>
			</div>

			<Field data-invalid={invalid}>
				<div className="flex flex-col gap-3 sm:flex-row">
					<DateTimeField
						label="تاريخ البدء"
						value={value.start}
						onChange={(start) => onChange({ ...value, start })}
						invalid={invalid}
					/>
					<DateTimeField
						label="تاريخ الاستحقاق"
						value={value.due}
						onChange={(due) => onChange({ ...value, due })}
						invalid={invalid}
					/>
				</div>
				{error && (
					<FieldError className="flex items-center gap-1.5">
						<IconAlertCircle className="size-3.5 shrink-0" />
						{error}
					</FieldError>
				)}
			</Field>

			<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
				<IconInfoCircle className="size-3.5 shrink-0" />
				المنطقة الزمنية الحالية: {LOCAL_TZ}
			</div>
		</div>
	);
}
