import {
	IconAlertTriangle,
	IconArrowsDiagonal,
	IconCalendarEvent,
	IconCheck,
	IconChevronDown,
	IconChevronLeft,
	IconClock,
	type IconProps,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useAttendance } from "@/features/services/staff/hooks/use-attendance";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { cn } from "@/lib/utils";

// شارة الحالة لكل سجل حضور اليوم (نص + أيقونة + لون) — مطابقة لتصميم Figma
const STATUS_BADGE: Record<string, { label: string; color: string; Icon: FC<IconProps> }> = {
	PRESENT: { label: "حاضر", color: "#16A34A", Icon: IconCheck },
	ABSENT: { label: "غائب", color: "#DC2626", Icon: IconX },
	LEAVE: { label: "إجازة", color: "#A855F7", Icon: IconCalendarEvent },
	LATE: { label: "متأخر", color: "#F59E0B", Icon: IconClock },
};

// خيارات فلتر القائمة العلوية (كل الموظفين / حسب حالة اليوم)
const FILTERS = [
	{ key: "all", label: "كل الموظفين" },
	{ key: "PRESENT", label: "حاضرين" },
	{ key: "ABSENT", label: "غائبين" },
	{ key: "LEAVE", label: "في إجازة" },
] as const;

// عنصر مُختار يُمرَّر للخطوة التالية (المعرف + الاسم + حالة اليوم + وقت الحضور)
export type PickedSelection = {
	id: string;
	name: string;
	status: string | null;
	checkIn: string | null;
};

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

export function AttendanceStaffPickerPanel({
	open,
	onClose,
	onNext,
	title = "تسجيل حضور وانصراف",
	customItems,
	customRecords,
	targetLabel = "الموظفين",
}: {
	open: boolean;
	onClose: () => void;
	onNext: (selected: PickedSelection[]) => void;
	title?: string;
	customItems?: { id: string; name: string; code: string; role?: string | { name?: string } }[];
	customRecords?: any[];
	targetLabel?: string;
}) {
	const isStudent = targetLabel === "الطلاب";
	const { staff } = useStaff();
	const activeItems = customItems ?? staff;

	// حالة اليوم وسجلّها لكل شخص — للشارات وتمرير وقت الحضور للخطوة التالية
	const today = useMemo(() => new Date(), []);
	const todayKey = useMemo(() => {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	}, []);
	const { records: defaultRecords } = useAttendance(today, today);
	const records = customRecords ?? defaultRecords;

	// تصفية السجلات ليوم اليوم فقط لضمان دقة الشارات والبيانات
	const todayRecords = useMemo(() => {
		return records.filter((r) => {
			if (!r.date) return false;
			const dStr = typeof r.date === "string" ? r.date.slice(0, 10) : new Date(r.date).toISOString().slice(0, 10);
			return dStr === todayKey;
		});
	}, [records, todayKey]);

	const recordByStaff = useMemo(() => {
		const map = new Map<string, (typeof records)[number]>();
		for (const r of todayRecords) map.set(r.staffId, r);
		return map;
	}, [todayRecords]);
	const statusByStaff = useMemo(() => {
		const map = new Map<string, string>();
		for (const r of todayRecords) map.set(r.staffId, r.status);
		return map;
	}, [todayRecords]);

	const [search, setSearch] = useState("");
	const [filterKey, setFilterKey] = useState<(typeof FILTERS)[number]["key"]>("all");
	const [selected, setSelected] = useState<Set<string>>(new Set());

	// إعادة الضبط عند كل فتح
	useEffect(() => {
		if (open) {
			setSearch("");
			setFilterKey("all");
			setSelected(new Set());
		}
	}, [open]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return activeItems.filter((s) => {
			if (q && !s.name.toLowerCase().includes(q) && !s.code.toLowerCase().includes(q)) {
				return false;
			}
			if (filterKey !== "all" && statusByStaff.get(s.id) !== filterKey) return false;
			return true;
		});
	}, [activeItems, search, filterKey, statusByStaff]);

	const allChecked = filtered.length > 0 && filtered.every((s) => selected.has(s.id));

	// تنبيه: المختارون المسجَّلون كغائبين لهذا اليوم
	const absentNotice = useMemo(() => {
		const names = activeItems
			.filter((s) => selected.has(s.id) && statusByStaff.get(s.id) === "ABSENT")
			.map((s) => s.name.split(" ")[0]);
		if (names.length === 0) return null;
		return names.length === 1
			? `تم تسجيل ${names[0]} كغائب لهذا اليوم`
			: `تم تسجيل ${names.join("، ")} كغائبين لهذا اليوم`;
	}, [activeItems, selected, statusByStaff]);

	const toggleAll = (checked: boolean) => {
		setSelected((prev) => {
			const next = new Set(prev);
			for (const s of filtered) {
				if (checked) next.add(s.id);
				else next.delete(s.id);
			}
			return next;
		});
	};

	const toggleOne = (id: string, checked: boolean) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (checked) next.add(id);
			else next.delete(id);
			return next;
		});
	};

	const filterLabel =
		filterKey === "all"
			? `كل ${targetLabel}`
			: (FILTERS.find((f) => f.key === filterKey)?.label ?? `كل ${targetLabel}`);

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[643px]!"
			>
				{/* الهيدر — مسار التنقّل (يمين) + أزرار (يسار) */}
				<div
					className="flex items-center justify-between border-b px-4 py-2"
					dir="rtl"
				>
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] font-bold text-[#08090A]">الحضور والإنصراف</span>
						<IconChevronLeft className="size-[9px] text-[#272829]" />
						<SheetTitle className="text-[10px] font-bold text-[#08090A]">{title}</SheetTitle>
					</div>
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							aria-label="توسيع"
							className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconArrowsDiagonal className="size-3" />
						</button>
						<button
							type="button"
							onClick={onClose}
							aria-label="إغلاق"
							className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				</div>

				{/* شريط الفلتر + البحث */}
				<div
					className="flex items-center gap-2 px-3 pt-3"
					dir="rtl"
				>
					<div className="relative flex-1">
						<IconSearch className="pointer-events-none absolute right-2.5 top-1/2 size-2.5 -translate-y-1/2 text-[#9B9B9D]" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder={
								isStudent
									? "بحث باسم الطالب أو بالمعرف..."
									: "بحث باسم الموظف أو بالمعرف..."
							}
							className="h-[25px] w-full rounded-[4px] border-[0.75px] border-[#E5E5E5] pr-7 pl-2 text-right text-[10px] text-[#08090A] outline-none placeholder:text-[#08090A]/50"
						/>
					</div>

					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="flex h-[27px] shrink-0 items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 text-[11px] font-medium text-[#08090A]"
							>
								{filterLabel}
								<IconChevronDown className="size-2.5 text-[#9B9B9D]" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="min-w-[110px] p-[3px]"
						>
							{FILTERS.map((f) => (
								<DropdownMenuItem
									key={f.key}
									onSelect={() => setFilterKey(f.key)}
									className="h-6 justify-start rounded-[4px] px-2 text-[11px] text-[#08090A]"
								>
									{f.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* تحديد الكل */}
				<div
					className="flex items-center justify-start gap-2 border-b border-[#E5E5E5] px-3 pb-1.5 pt-2"
					dir="rtl"
				>
					<span className="text-[10px] font-medium text-[#08090A]">
						تحديد الكل ({filtered.length})
					</span>
					<Checkbox
						checked={allChecked}
						onCheckedChange={(c) => toggleAll(c === true)}
						aria-label="تحديد الكل"
						className="size-4 rounded-[4px] border-[1.5px] border-[#E5E5E5]"
					/>
				</div>

				{/* تنبيه الغياب — أعلى القائمة */}
				{absentNotice && (
					<div
						className="mx-3 mt-2 flex items-center gap-2.5 rounded-[4px] bg-[#FFFBEA] px-2 py-3.5"
						dir="rtl"
					>
						<IconAlertTriangle className="size-3.5 shrink-0 text-[#C34E00]" />
						<span className="text-right text-[12px] text-[#C34E00]">{absentNotice}</span>
					</div>
				)}

				{/* قائمة الموظفين / الطلاب */}
				<div
					className="flex min-h-0 flex-1 flex-col gap-[1.5px] overflow-y-auto px-3 py-2"
					dir="rtl"
				>
					{filtered.map((s) => {
						const status = statusByStaff.get(s.id);
						const badge = status ? STATUS_BADGE[status] : undefined;
						const checked = selected.has(s.id);
						const roleText =
							typeof s.role === "string"
								? s.role
								: (s.role?.name ?? (isStudent ? "طالب" : "—"));
						return (
							<button
								key={s.id}
								type="button"
								onClick={() => toggleOne(s.id, !checked)}
								className="flex h-[42px] w-full cursor-pointer items-center gap-2 rounded-[4px] px-2 hover:bg-[#F9FAFB]"
							>
								{/* مربع الاختيار — يمين */}
								<Checkbox
									checked={checked}
									aria-hidden
									tabIndex={-1}
									className="pointer-events-none size-4 rounded-[4px] border-[1.5px] border-[#E5E5E5]"
								/>
								{/* الأفاتار */}
								<span
									className={cn(
										"flex size-[23px] shrink-0 items-center justify-center rounded-full text-[9px] text-white",
										isStudent ? "bg-[#10B981]" : "bg-[#4F6AE0]",
									)}
								>
									{initialsOf(s.name)}
								</span>
								{/* الاسم + التخصص·المعرف */}
								<div className="flex min-w-0 flex-1 flex-col">
									<span className="truncate text-right text-[11px] font-medium text-[#08090A]">
										{s.name}
									</span>
									<span className="truncate text-right text-[9px] text-[#9B9B9D]">
										{roleText} · {s.code}
									</span>
								</div>
								{/* شارة الحالة — يسار */}
								{badge && (
									<span
										className="flex shrink-0 items-center gap-[3px] rounded-[4px] px-[4.5px] py-[1.5px] text-[8px] font-medium"
										style={{
											backgroundColor: `${badge.color}14`,
											color: badge.color,
										}}
									>
										{badge.label}
										<badge.Icon className="size-[9px]" />
									</span>
								)}
							</button>
						);
					})}
					{filtered.length === 0 && (
						<div className="py-12 text-center text-xs text-muted-foreground">
							لا يوجد {targetLabel} مطابقين
						</div>
					)}
				</div>

				{/* الفوتر — التالي (يسار) + إلغاء (يمين) */}
				<div
					className="flex items-center justify-between border-t px-4 py-2"
					dir="ltr"
				>
					<button
						type="button"
						disabled={selected.size === 0}
						onClick={() =>
							onNext(
								activeItems
									.filter((s) => selected.has(s.id))
									.map((s) => {
										const rec = recordByStaff.get(s.id);
										return {
											id: s.id,
											name: s.name,
											status: rec?.status ?? null,
											checkIn: rec?.checkIn ? new Date(rec.checkIn).toISOString() : null,
										};
									}),
							)
						}
						className="flex h-[26px] items-center gap-1.5 rounded-[4px] bg-[#4F6AE0] px-3 text-[11px] font-semibold primarydisabled:opacity-50"
					>
						<IconChevronLeft className="size-2.5" />
						التالي
					</button>
					<button
						type="button"
						onClick={onClose}
						className="flex h-[27px] items-center rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2.5 text-[11px] font-medium text-[#08090A]"
					>
						إلغاء
					</button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
