import {
	IconChevronLeft,
	IconChevronRight,
	IconDownload,
	IconPlus,
	IconSortDescending,
	IconSparkles,
	IconUser,
} from "@tabler/icons-react";
import { addDays, addWeeks, format, isToday, startOfWeek } from "date-fns";
import { arSA } from "date-fns/locale";
import { useMemo, useState } from "react";
import { FiltersMenu } from "@/components/common/filters-menu";
import { Stats } from "@/components/common/stats";
import { TablePagination } from "@/components/common/table-pagination";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { AiShiftsDialog } from "@/features/services/staff/components/shifts/ai-shifts-dialog";
import { ShiftCellPopover } from "@/features/services/staff/components/shifts/shift-cell-popover";
import { ShiftDetailsPanel } from "@/features/services/staff/components/shifts/shift-details-panel";
import { SHIFT_LEGEND, SHIFT_TYPE_MAP } from "@/features/services/staff/data/shifts";
import { useDeleteShift } from "@/features/services/staff/hooks/use-delete-shift";
import { useLeaveRequests } from "@/features/services/staff/hooks/use-leave-request";
import { useShifts } from "@/features/services/staff/hooks/use-shifts";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useStaffFilters } from "@/features/services/staff/hooks/use-staff-filters";
import { useUpsertShift } from "@/features/services/staff/hooks/use-upsert-shift";
import { exportStaffCsv } from "@/features/services/staff/utils/export-staff";
import type { ShiftType } from "@/server/shifts/shifts.type";

// مفتاح اليوم (yyyy-MM-dd) من تاريخ التعيين سواء كان نصًا أو كائن Date
const dayKey = (d: string | Date) =>
	(typeof d === "string" ? d : d.toISOString()).slice(0, 10);

// دقائق من منتصف الليل → "HH:mm"
const minutesToTime = (m: number | null) =>
	m == null
		? ""
		: `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function StaffAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-[9px] font-normal text-white">
			{initials}
		</div>
	);
}

export function ShiftsView() {
	const { staff, isLoading } = useStaff();
	const { filterGroups, applyStaffFilters } = useStaffFilters(staff);
	const [search, setSearch] = useState("");
	// أسبوع العرض — يبدأ من اليوم الحالي افتراضيًا (الأحد)
	const [weekStart, setWeekStart] = useState(() =>
		startOfWeek(new Date(), { weekStartsOn: 0 }),
	);

	// أيام الأسبوع السبعة (الأحد → السبت)
	const days = useMemo(
		() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
		[weekStart],
	);

	// تعيينات المناوبات للأسبوع المعروض
	const { shifts } = useShifts(weekStart, addDays(weekStart, 6));
	const { upsert, upsertAsync } = useUpsertShift();
	const { remove } = useDeleteShift();
	const { requests: leaveRequests } = useLeaveRequests();

	// لوحة تفاصيل المناوبة الجانبية — فارغة من زر "جدولة مناوبة"، أو معبّأة عند الضغط على بادج نوبة
	const [panelPreset, setPanelPreset] = useState<{
		staffId?: string;
		date?: Date;
		defaultType?: ShiftType;
		startMinute?: number | null;
		endMinute?: number | null;
	} | null>(null);

	// خريطة سريعة: "staffId_yyyy-MM-dd" → تعيين المناوبة
	const shiftByCell = useMemo(() => {
		const map = new Map<string, (typeof shifts)[number]>();
		for (const s of shifts) {
			map.set(`${s.staffId}_${dayKey(s.date)}`, s);
		}
		return map;
	}, [shifts]);

	// إجمالي ساعات كل يوم: "yyyy-MM-dd" → مجموع الساعات
	const dailyTotals = useMemo(() => {
		const map = new Map<string, number>();
		for (const s of shifts) {
			const key = dayKey(s.date);
			map.set(key, (map.get(key) ?? 0) + s.hours);
		}
		return map;
	}, [shifts]);

	const rows = useMemo(() => {
		const q = search.trim().toLowerCase();
		const list = applyStaffFilters(staff);
		if (!q) return list;
		return list.filter(
			(s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
		);
	}, [staff, search, applyStaffFilters]);

	// بطاقات الإحصائيات — قيم حيّة من تعيينات الأسبوع
	const stats: StatItem[] = useMemo(() => {
		const byType = { MORNING: 0, EVENING: 0, NIGHT: 0 } as Record<ShiftType, number>;
		for (const s of shifts) byType[s.type] += 1;
		const onLeave = leaveRequests.filter((r) => r.status === "APPROVED").length;
		return [
			{ title: "# الموظفين", value: staff.length, tooltip: "إجمالي عدد الموظفين" },
			{
				title: "# نوبة الصباح",
				value: byType.MORNING,
				tooltip: "عدد مناوبات الصباح هذا الأسبوع",
			},
			{
				title: "# نوبة المساء",
				value: byType.EVENING,
				tooltip: "عدد مناوبات المساء هذا الأسبوع",
			},
			{ title: "# نوبة الليل", value: byType.NIGHT, tooltip: "عدد مناوبات الليل هذا الأسبوع" },
			{ title: "# في أجازة", value: onLeave, tooltip: "عدد الموظفين في إجازة معتمدة" },
		];
	}, [shifts, staff.length, leaveRequests]);

	// لوحة الجدولة بالذكاء الاصطناعي — تقترح جدول الأسبوع المعروض ثم يعتمده المستخدم
	const [aiOpen, setAiOpen] = useState(false);
	// معرّف الموظف → اسمه (لعرض الأسماء في معاينة الاقتراح)
	const staffNames = useMemo(() => new Map(staff.map((s) => [s.id, s.name])), [staff]);

	// ترقيم الصفحات
	const [pageSize, setPageSize] = useState(15);
	const [pageIndex, setPageIndex] = useState(0);
	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const safePage = Math.min(pageIndex, pageCount - 1);
	const pagedRows = rows.slice(safePage * pageSize, safePage * pageSize + pageSize);
	const fromRow = rows.length === 0 ? 0 : safePage * pageSize + 1;
	const toRow = Math.min((safePage + 1) * pageSize, rows.length);

	const weekLabel = `${format(weekStart, "d", { locale: arSA })} ${format(
		weekStart,
		"MMMM yyyy",
		{ locale: arSA },
	)}`;

	return (
		<div
			className="flex min-h-0 flex-1 flex-col"
			dir="rtl"
		>
			{/* بطاقات الإحصائيات */}
			<Stats
				className="px-[9px]"
				stats={stats}
				variant="inventory"
			/>

			<AiShiftsDialog
				open={aiOpen}
				onClose={() => setAiOpen(false)}
				days={days.map((d) => format(d, "yyyy-MM-dd"))}
				staffNames={staffNames}
			/>

			<ShiftDetailsPanel
				open={!!panelPreset}
				staffId={panelPreset?.staffId}
				date={panelPreset?.date}
				defaultType={panelPreset?.defaultType}
				startMinute={panelPreset?.startMinute}
				endMinute={panelPreset?.endMinute}
				onClose={() => setPanelPreset(null)}
			/>

			{/* شريط الأدوات */}
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن الموظف بالاسم،المعرف..."
				searchValue={search}
				onSearchChange={setSearch}
				// نفس ترتيب صفحة الموظفين: [التصفية] [تصدير] بمقاس xs موحّد
				buttonSize="xs"
				showFilter={false}
				showView={false}
				showExport={false}
				leftExtra={
					<>
						<FiltersMenu groups={filterGroups} />
						{/* ترتيب DOM في RTL: بعد التصفية فيظهر على يسارها */}
						<Button
							type="button"
							variant="outline"
							size="xs"
							onClick={() => exportStaffCsv(rows)}
							disabled={rows.length === 0}
							className="gap-1.5 px-2"
						>
							<IconDownload className="size-3.5" />
							تصدير
						</Button>
						<span className="h-6 w-px bg-[#E5E5E5]" />
						{/* التنقّل بين الأسابيع */}
						<div className="flex items-center gap-1.5">
							<Button
								type="button"
								variant="outline"
								size="icon"
								className="size-[18px] rounded-[4px]"
								onClick={() => setWeekStart((d) => addWeeks(d, -1))}
							>
								<IconChevronRight className="size-3" />
							</Button>
							<span className="min-w-24 text-center text-[11px] font-semibold tabular-nums">
								{weekLabel}
							</span>
							<Button
								type="button"
								variant="outline"
								size="icon"
								className="size-[18px] rounded-[4px]"
								onClick={() => setWeekStart((d) => addWeeks(d, 1))}
							>
								<IconChevronLeft className="size-3" />
							</Button>
						</div>
					</>
				}
				actions={
					<>
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled
							className="h-[30px] gap-1.5 text-[11px] text-primary"
						>
							<IconSparkles className="size-3.5" />
							جدولة مناوبة بـ AI
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={() => setPanelPreset({})}
							className="h-[30px] gap-1.5 text-xs"
						>
							<IconPlus className="size-2.5" />
							جدولة مناوبة
						</Button>
					</>
				}
			/>

			{/* شبكة المناوبات الأسبوعية */}
			<div className="min-h-0 flex-1 overflow-auto bg-white">
				<table className="w-full border-collapse">
					<thead className="sticky top-0 z-10 bg-white">
						<tr>
							<th className="sticky right-0 z-20 h-[34px] min-w-[180px] border-t border-l border-border bg-white px-3">
								<div className="flex items-center justify-between gap-1">
									<span className="text-[12px] font-normal text-[#6B6B67]">اسم الموظف</span>
									<IconSortDescending className="size-[15px] text-[#6B6B67]" />
								</div>
							</th>
							{days.map((day) => {
								const today = isToday(day);
								return (
									<th
										key={day.toISOString()}
										className="h-[34px] min-w-[140px] border-t border-l border-border px-3 font-normal"
									>
										<div className="flex items-center justify-between">
											<span className="flex items-center gap-1 text-[10px] text-[#22202A]">
												{format(day, "EEEE", { locale: arSA })}
												{today ? (
													<span className="flex h-4 min-w-5 items-center justify-center rounded-[4px] bg-[#3B82F6] px-1 text-[10px] primarytabular-nums">
														{format(day, "d", { locale: arSA })}
													</span>
												) : (
													<span className="tabular-nums">
														{format(day, "d", { locale: arSA })}
													</span>
												)}
											</span>
											<span className="flex items-center gap-1 text-[12px] text-[#6B6B67]">
												<IconUser className="size-3" />
												<span className="tabular-nums">{rows.length}</span>
											</span>
										</div>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody>
						{pagedRows.map((s) => (
							<tr key={s.id}>
								<td className="sticky right-0 z-10 h-[34px] border-t border-l border-border bg-white px-3">
									<div className="flex items-center gap-1.5">
										<StaffAvatar name={s.name} />
										<span
											dir="rtl"
											className="truncate text-right text-[12px] text-[#08090A]"
										>
											{s.name}
										</span>
									</div>
								</td>
								{days.map((day) => {
									const dateKey = format(day, "yyyy-MM-dd");
									const shift = shiftByCell.get(`${s.id}_${dateKey}`);
									const meta = shift ? SHIFT_TYPE_MAP[shift.type] : undefined;
									// مناوبة ممتدة: ساعاتها أطول من الافتراضي لنوعها → لون برتقالي
									const isExtended = !!shift && !!meta && shift.hours > meta.defaultHours;
									const badgeColor = isExtended ? "#E97400" : meta?.color;
									return (
										<td
											key={day.toISOString()}
											className="h-[34px] border-t border-l border-border text-center"
										>
											{shift && meta ? (
												// خلية معيّنة: شارة النوبة — تفتح لوحة التفاصيل من اليسار ببيانات هذه النوبة
												<button
													type="button"
													onClick={() =>
														setPanelPreset({
															staffId: s.id,
															date: day,
															defaultType: shift.type,
															startMinute: shift.startMinute,
															endMinute: shift.endMinute,
														})
													}
													className="mx-auto flex h-4 items-center justify-center gap-1 rounded-[4px] px-1.5 text-[9px] font-medium"
													style={{
														backgroundColor: `${badgeColor}14`,
														color: badgeColor,
													}}
													aria-label="تعديل المناوبة"
												>
													<span
														className="size-1.5 rounded-full"
														style={{ backgroundColor: badgeColor }}
													/>
													{isExtended ? "ممتدة" : meta.label}
													{shift.startMinute != null && (
														<span className="tabular-nums opacity-80">
															{minutesToTime(shift.startMinute)}
														</span>
													)}
												</button>
											) : (
												// خلية فارغة: زر إضافة — يفتح popover الجدولة السريعة للأيام
												<ShiftCellPopover
													staffId={s.id}
													days={days}
													shiftByCell={shiftByCell}
													onUpsert={upsert}
													onUpsertSilent={upsertAsync}
													onRemove={remove}
												>
													<button
														type="button"
														className="mx-auto flex size-[18px] items-center justify-center rounded-[4px] bg-[#3B82F6]/[0.06] text-[#3B82F6] transition-colors hover:bg-[#3B82F6]/15"
														aria-label="جدولة مناوبة"
													>
														<IconPlus className="size-2.5" />
													</button>
												</ShiftCellPopover>
											)}
										</td>
									);
								})}
							</tr>
						))}
						{!isLoading && rows.length === 0 && (
							<tr>
								<td
									colSpan={days.length + 1}
									className="py-12 text-center text-sm text-muted-foreground"
								>
									لا يوجد موظفين لعرض مناوباتهم
								</td>
							</tr>
						)}
					</tbody>
					<tfoot>
						<tr>
							<td className="sticky right-0 z-10 h-[34px] border-t border-l border-border bg-white px-3 text-right text-[12px] text-[#6B6B67]">
								الاجمالي
							</td>
							{days.map((day) => {
								const total = dailyTotals.get(format(day, "yyyy-MM-dd")) ?? 0;
								return (
									<td
										key={day.toISOString()}
										className="h-[34px] border-t border-l border-border text-center text-[12px] text-[#08090A] tabular-nums"
									>
										{total} ساعة
									</td>
								);
							})}
						</tr>
					</tfoot>
				</table>
			</div>

			{/* دليل الألوان */}
			<div className="flex flex-wrap items-center justify-start gap-3 border-t px-4 py-2.5">
				<span className="text-[9px] font-semibold text-[#9B9B9D]">دليل الألوان:</span>
				{SHIFT_LEGEND.map((item) => (
					<span
						key={item.key}
						className="flex items-center gap-[4.5px]"
					>
						<span
							className="size-[10px] rounded-full"
							style={{ backgroundColor: item.color }}
						/>
						<span className="text-[9px] text-[#9B9B9D]">{item.label}</span>
					</span>
				))}
			</div>

			{/* ترقيم الصفحات */}
			<TablePagination
				page={safePage}
				pageCount={pageCount}
				pageSize={pageSize}
				totalRows={rows.length}
				fromRow={fromRow}
				toRow={toRow}
				onPageChange={setPageIndex}
				onPageSizeChange={setPageSize}
			/>
		</div>
	);
}
