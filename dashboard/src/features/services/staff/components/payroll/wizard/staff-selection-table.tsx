// جدول اختيار الموظفين ضمن مرحلة النطاق — نمط attendance-staff-picker:
// مجموعة معرّفات في الحالة، وselect-all يحترم الفلتر والبحث القائمين.
import { IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { EmptyRow } from "@/features/services/staff/components/payroll/payroll-shared";
import { getInitials } from "@/features/services/staff/components/payroll/payroll-ui";
import { cn } from "@/lib/utils";
import type { StaffResponse } from "@/server/staff/staff.type";
import { PAYROLL_PAYMENT_METHOD_LABEL } from "@sanad/contracts/runtime/server/staff-compensation/staff-compensation.type";

const EMPLOYMENT_LABEL: Record<string, string> = {
	FULL_TIME: "دوام كامل",
	PART_TIME: "دوام جزئي",
};

// معاينة الساعات والإضافي قبل الاحتساب — تصل من الخادم لكل موظف
export interface StaffPreview {
	totalHours: number;
	overtimeHours: number;
	paymentMethod: keyof typeof PAYROLL_PAYMENT_METHOD_LABEL;
}

export function StaffSelectionTable({
	staff,
	previews,
	selectedIds,
	onToggle,
	onToggleAll,
	selectable,
	disabled,
}: {
	staff: StaffResponse[];
	previews: Map<string, StaffPreview>;
	selectedIds: Set<string>;
	onToggle: (id: string) => void;
	onToggleAll: (ids: string[], checked: boolean) => void;
	// خارج نطاق "موظفون محدّدون" يبقى الجدول للمعاينة بلا اختيار
	selectable: boolean;
	disabled?: boolean;
}) {
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return staff;
		return staff.filter(
			(s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
		);
	}, [staff, search]);

	// select-all يعمل على المعروض فقط حتى لا يختار بحثٌ ضيّق موظفين مخفيين
	const allChecked = filtered.length > 0 && filtered.every((s) => selectedIds.has(s.id));
	const someChecked = filtered.some((s) => selectedIds.has(s.id));

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-end">
				<div className="relative w-full sm:w-[240px]">
					<IconSearch className="absolute top-1/2 start-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="ابحث عن موظف"
						className="h-9 ps-8 text-xs"
					/>
				</div>
			</div>

			<div className="max-h-[380px] overflow-auto rounded-lg border border-border">
				<table className="w-full">
					<thead className="sticky top-0 z-10 bg-muted/60">
						<tr>
							{selectable && (
								<th className="w-[44px] px-3 py-2.5 text-start">
									<Checkbox
										checked={allChecked ? true : someChecked ? "indeterminate" : false}
										disabled={disabled || filtered.length === 0}
										onCheckedChange={(v) =>
											onToggleAll(
												filtered.map((s) => s.id),
												v === true,
											)
										}
										aria-label="تحديد الكل"
									/>
								</th>
							)}
							<th className="px-3 py-2.5 text-start text-[11px] font-medium text-muted-foreground">
								الموظف
							</th>
							<th className="px-3 py-2.5 text-start text-[11px] font-medium text-muted-foreground">
								إجمالي الساعات
							</th>
							<th className="px-3 py-2.5 text-start text-[11px] font-medium text-muted-foreground">
								الإضافي
							</th>
							<th className="px-3 py-2.5 text-start text-[11px] font-medium text-muted-foreground">
								طريقة الدفع
							</th>
							<th className="px-3 py-2.5 text-start text-[11px] font-medium text-muted-foreground">
								نوع الدوام
							</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((s) => {
							const checked = selectedIds.has(s.id);
							const preview = previews.get(s.id);
							return (
								<tr
									key={s.id}
									onClick={() => selectable && !disabled && onToggle(s.id)}
									className={cn(
										"border-t border-border",
										selectable && !disabled && "cursor-pointer hover:bg-muted/40",
										checked && "bg-primary/[0.04]",
									)}
								>
									{selectable && (
										<td className="px-3 py-2.5">
											<Checkbox
												checked={checked}
												disabled={disabled}
												onCheckedChange={() => onToggle(s.id)}
												onClick={(e) => e.stopPropagation()}
												aria-label={`تحديد ${s.name}`}
											/>
										</td>
									)}
									<td className="px-3 py-2.5">
										<div className="flex items-center gap-2.5">
											<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
												{getInitials(s.name)}
											</span>
											<div className="flex flex-col leading-tight">
												<span className="text-xs font-medium text-foreground">{s.name}</span>
												<span className="text-[10px] text-muted-foreground tabular-nums">
													{s.code}
												</span>
											</div>
										</div>
									</td>
									<td className="px-3 py-2.5 text-xs text-foreground tabular-nums">
										{preview ? `${preview.totalHours} ساعة` : "—"}
									</td>
									<td className="px-3 py-2.5 text-xs tabular-nums">
										{preview && preview.overtimeHours > 0 ? (
											<span className="text-primary">+{preview.overtimeHours} ساعة</span>
										) : (
											<span className="text-muted-foreground">—</span>
										)}
									</td>
									<td className="px-3 py-2.5 text-xs text-foreground">
										{preview ? PAYROLL_PAYMENT_METHOD_LABEL[preview.paymentMethod] : "—"}
									</td>
									<td className="px-3 py-2.5 text-xs text-muted-foreground">
										{s.employmentType ? EMPLOYMENT_LABEL[s.employmentType] : "—"}
									</td>
								</tr>
							);
						})}
						{filtered.length === 0 && (
							<EmptyRow
								colSpan={selectable ? 6 : 5}
								message="لا يوجد موظف مطابق للبحث"
							/>
						)}
					</tbody>
				</table>
			</div>

			{selectable && (
				<span className="text-xs text-muted-foreground tabular-nums">
					محدّد: {selectedIds.size} من {staff.length}
				</span>
			)}
		</div>
	);
}
