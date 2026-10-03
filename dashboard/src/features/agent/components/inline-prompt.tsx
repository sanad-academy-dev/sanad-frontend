import { IconChevronDown } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSlotOptions } from "@/features/agent/hooks/use-slot-options";
import type {
	ActionPreset,
	PromptSegment,
	SlotValues,
} from "@/features/agent/types/preset.types";
import { cn } from "@/lib/utils";
import { backendUrl } from "@/lib/backend-fetch";

// يبني نصّ الأمر النهائي من القالب + القيم المعبّأة (للعرض للمستخدم)
export function buildPromptText(preset: ActionPreset, values: SlotValues): string {
	return preset.template
		.map((seg) => {
			if (seg.type === "text") return seg.text;
			const filled = values[seg.field];
			return filled?.label ?? seg.placeholder;
		})
		.join("");
}

// يبني الرسالة المُرسَلة للوكيل: النصّ المقروء + كتلة الحقول المُحلّة (IDs) بصيغة يفهمها
// الوكيل فينفّذ الإنشاء مباشرة دون عمليات بحث إضافية (طلب واحد بدل عدّة).
export function buildPresetMessage(preset: ActionPreset, values: SlotValues): string {
	const text = buildPromptText(preset, values);

	// اجمع الحقول المُحلّة (القيمة = المعرّف الحقيقي الذي اختاره المستخدم من الشريحة)
	const resolved: Record<string, string> = { action: preset.key };
	for (const seg of preset.template) {
		if (seg.type === "slot") {
			const filled = values[seg.field];
			if (filled?.value) resolved[seg.field] = filled.value;
		}
	}

	// نُرفق الحقول كـ JSON ضمن وسم يفهمه الوكيل من التعليمات (system prompt)
	return `${text}\n\n<resolved_fields>${JSON.stringify(resolved)}</resolved_fields>`;
}

// المحرّر السطري — مطابق لتصميم Figma (frame 4063): جملة عربية تتدفّق من اليمين
// مع شرائح رمادية (#f2f2f2) قابلة للتعبئة داخل النصّ.
export const InlinePrompt = ({
	preset,
	values,
	onChange,
}: {
	preset: ActionPreset;
	values: SlotValues;
	onChange: (values: SlotValues) => void;
}) => {
	const setSlot = (field: string, value: string, label: string) =>
		onChange({ ...values, [field]: { value, label } });

	return (
		<div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-[14px] leading-7 text-[#08090a]">
			{preset.template.map((seg, i) =>
				seg.type === "text" ? (
					<span key={`t-${i}-${seg.text}`}>{seg.text}</span>
				) : (
					<SlotChip
						key={`s-${seg.field}`}
						segment={seg}
						value={values[seg.field]}
						allValues={values}
						onSet={(value, label) => setSlot(seg.field, value, label)}
					/>
				),
			)}
		</div>
	);
};

const SlotChip = ({
	segment,
	value,
	allValues,
	onSet,
}: {
	segment: Extract<PromptSegment, { type: "slot" }>;
	value: SlotValues[string] | undefined;
	allValues: SlotValues;
	onSet: (value: string, label: string) => void;
}) => {
	const label = value?.label ?? segment.placeholder;

	// منتقي الموعد الحقيقي (كنموذج الحجز): تاريخ + الأوقات المتاحة للمدرّب المختار
	if (segment.kind === "slot-time") {
		return (
			<SlotTimeChip
				placeholder={segment.placeholder}
				value={value}
				staffId={allValues.staffId?.value}
				onSet={onSet}
			/>
		);
	}

	// فراغ نصّي: إدخال مباشر داخل الجملة (بنفس مظهر الشريحة)
	if (segment.kind === "text") {
		return (
			<input
				type="text"
				value={value?.value ?? ""}
				onChange={(e) => onSet(e.target.value, e.target.value)}
				placeholder={segment.placeholder}
				size={Math.max(segment.placeholder.length, 6)}
				className="h-7 rounded-[4px] bg-[#f2f2f2] px-2.5 text-start text-[13px] font-medium text-[#08090a] outline-none placeholder:text-[#9b9b9d]"
			/>
		);
	}

	// فراغ تاريخ/وقت: حقل datetime أصلي — كان يسقط لقائمة اختيار فارغة ("لا توجد نتائج")
	// القيمة المحلية (بتوقيت الأكاديمية) تمرّ في resolved_fields ويثبّتها الخادم على +03
	if (segment.kind === "date") {
		return (
			<input
				type="datetime-local"
				value={value?.value ?? ""}
				onChange={(e) => {
					const v = e.target.value; // "2026-07-22T10:00"
					const label = v ? v.replace("T", " الساعة ") : "";
					onSet(v, label);
				}}
				dir="ltr"
				className="h-7 rounded-[4px] bg-[#f2f2f2] px-2.5 text-[13px] font-medium text-[#08090a] outline-none"
			/>
		);
	}

	// فراغ اختيار: زر شريحة يفتح قائمة
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"flex h-7 items-center gap-1 rounded-[4px] bg-[#f2f2f2] px-2.5 text-[13px] font-medium",
						value ? "text-[#08090a]" : "text-[#9b9b9d]",
					)}
				>
					{label}
					<IconChevronDown className="size-3.5 text-[#9b9b9d]" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				dir="rtl"
				className="w-56 p-1"
			>
				<SlotOptionsList
					segment={segment}
					onSelect={(v, l) => onSet(v, l)}
				/>
			</PopoverContent>
		</Popover>
	);
};

// منتقي الموعد كنموذج الحجز الفعلي: يختار المستخدم يومًا فتُعرض الأوقات المتاحة
// فعليًا للمدرّب المختار (دوامه ناقص جلساته) من /api/appointments/slots.
const SlotTimeChip = ({
	placeholder,
	value,
	staffId,
	onSet,
}: {
	placeholder: string;
	value: SlotValues[string] | undefined;
	staffId: string | undefined;
	onSet: (value: string, label: string) => void;
}) => {
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

	const { data: times, isLoading } = useQuery<string[]>({
		queryKey: ["agent", "slots", staffId ?? "none", date],
		enabled: open && Boolean(staffId) && Boolean(date),
		queryFn: async () => {
			const res = await fetch(
				backendUrl(`/api/appointments/slots?staffId=${staffId}&date=${date}&durationMinutes=30`),
				{ credentials: "include" },
			);
			if (!res.ok) return [];
			const slots: { startMinute: number; available: boolean }[] = await res.json();
			return slots
				.filter((s) => s.available)
				.map(
					(s) =>
						`${String(Math.floor(s.startMinute / 60)).padStart(2, "0")}:${String(
							s.startMinute % 60,
						).padStart(2, "0")}`,
				);
		},
	});

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"flex h-7 items-center gap-1 rounded-[4px] bg-[#f2f2f2] px-2.5 text-[13px] font-medium",
						value ? "text-[#08090a]" : "text-[#9b9b9d]",
					)}
				>
					{value?.label ?? placeholder}
					<IconChevronDown className="size-3.5 text-[#9b9b9d]" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				dir="rtl"
				className="w-64 p-2"
			>
				{!staffId ? (
					<p className="px-1 py-2 text-sm text-muted-foreground">اختر المدرّب أولًا</p>
				) : (
					<div className="flex flex-col gap-2">
						<input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							dir="ltr"
							className="w-full rounded-md border px-2 py-1.5 text-sm outline-none"
						/>
						{isLoading ? (
							<p className="px-1 py-1.5 text-sm text-muted-foreground">جارٍ جلب الأوقات...</p>
						) : !times || times.length === 0 ? (
							<p className="px-1 py-1.5 text-sm text-muted-foreground">
								لا أوقات متاحة في هذا اليوم — جرّب يومًا آخر
							</p>
						) : (
							<div className="grid max-h-48 grid-cols-3 gap-1 overflow-y-auto">
								{times.map((t) => (
									<button
										key={t}
										type="button"
										onClick={() => {
											onSet(`${date}T${t}`, `${date} الساعة ${t}`);
											setOpen(false);
										}}
										dir="ltr"
										className="rounded-md border px-2 py-1.5 text-center text-[13px] hover:bg-muted"
									>
										{t}
									</button>
								))}
							</div>
						)}
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
};

const SlotOptionsList = ({
	segment,
	onSelect,
}: {
	segment: Extract<PromptSegment, { type: "slot" }>;
	onSelect: (value: string, label: string) => void;
}) => {
	const [q, setQ] = useState("");
	const { options, isLoading } = useSlotOptions(segment.source, segment.kind);

	const filtered = useMemo(() => options.filter((o) => o.label.includes(q)), [options, q]);

	return (
		<div className="flex flex-col gap-1">
			<input
				type="text"
				value={q}
				onChange={(e) => setQ(e.target.value)}
				placeholder="بحث..."
				className="mb-1 w-full rounded-md border px-2 py-1.5 text-start text-sm outline-none"
			/>
			<div className="max-h-56 overflow-y-auto">
				{isLoading ? (
					<p className="px-2 py-1.5 text-sm text-muted-foreground">جارٍ التحميل...</p>
				) : filtered.length === 0 ? (
					<p className="px-2 py-1.5 text-sm text-muted-foreground">لا توجد نتائج</p>
				) : (
					filtered.map((o) => (
						<button
							key={o.value}
							type="button"
							onClick={() => onSelect(o.value, o.label)}
							className="flex w-full rounded-md px-2 py-1.5 text-start text-sm hover:bg-muted"
						>
							{o.label}
						</button>
					))
				)}
			</div>
		</div>
	);
};
