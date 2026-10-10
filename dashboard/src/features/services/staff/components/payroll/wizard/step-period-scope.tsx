// المرحلة 1 — مراجعة فترة الرواتب واختيار نطاق التشغيل
import { IconCalendar, IconCash, IconUsers } from "@tabler/icons-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	PayrollStat,
	SectionHeader,
} from "@/features/services/staff/components/payroll/payroll-shared";
import {
	type StaffPreview,
	StaffSelectionTable,
} from "@/features/services/staff/components/payroll/wizard/staff-selection-table";
import { cn } from "@/lib/utils";
import { type PayrollScope, SCOPE_LABEL } from "@sanad/contracts/runtime/server/payroll/payroll.type";
import type { StaffResponse } from "@/server/staff/staff.type";

// CONTRACT مخفي: لا يوجد حقل نوع عقد على الموظف يمكن الفلترة به (انظر TODO.md)
const SCOPE_OPTIONS: PayrollScope[] = ["ALL", "BRANCH", "DEPARTMENT", "SPECIFIC"];

export function StepPeriodScope({
	period,
	periodRange,
	payDate,
	employeeCount,
	staff,
	scope,
	onScopeChange,
	branchId,
	onBranchChange,
	roleId,
	onRoleChange,
	selectedIds,
	onToggleSelected,
	onToggleAll,
	previews,
	scopedStaff,
	locked,
}: {
	period: string;
	periodRange: string;
	payDate: string;
	employeeCount: number;
	staff: StaffResponse[];
	scope: PayrollScope;
	onScopeChange: (s: PayrollScope) => void;
	branchId: string | null;
	onBranchChange: (v: string) => void;
	roleId: string | null;
	onRoleChange: (v: string) => void;
	selectedIds: Set<string>;
	onToggleSelected: (id: string) => void;
	onToggleAll: (ids: string[], checked: boolean) => void;
	previews: Map<string, StaffPreview>;
	// الموظفون المشمولون بالنطاق الحالي — الجدول يعرضهم للمعاينة
	scopedStaff: StaffResponse[];
	// بعد إنشاء المسير لا يتغيّر نطاقه من هنا
	locked?: boolean;
}) {
	const branches = [
		...new Map(
			staff.filter((s) => s.branch).map((s) => [s.branch?.id, s.branch] as const),
		).values(),
	];
	const roles = [
		...new Map(staff.filter((s) => s.role).map((s) => [s.role?.id, s.role] as const)).values(),
	];

	return (
		<div className="flex flex-col gap-5">
			<SectionHeader
				title="الفترة والموظفون"
				description={`مسير رواتب ${period} — راجع الفترة واختر الموظفين المشمولين`}
			/>

			<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
				<PayrollStat
					icon={<IconCalendar className="size-4" />}
					label="فترة الاستحقاق"
					value={periodRange}
				/>
				<PayrollStat
					icon={<IconCash className="size-4" />}
					label="تاريخ الصرف"
					value={payDate}
				/>
				<PayrollStat
					icon={<IconUsers className="size-4" />}
					label="عدد الموظفين"
					value={String(employeeCount)}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<h4 className="text-xs font-bold text-foreground">نطاق التشغيل</h4>
				<RadioGroup
					value={scope}
					onValueChange={(v) => onScopeChange(v as PayrollScope)}
					disabled={locked}
					className="grid grid-cols-2 gap-2 sm:grid-cols-4"
				>
					{SCOPE_OPTIONS.map((value) => (
						<label
							key={value}
							htmlFor={`scope-${value}`}
							className={cn(
								"flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
								locked ? "cursor-not-allowed opacity-60" : "cursor-pointer",
								scope === value
									? "border-primary bg-primary/[0.06] text-foreground"
									: "border-border bg-card text-muted-foreground hover:bg-muted/40",
							)}
						>
							<RadioGroupItem
								id={`scope-${value}`}
								value={value}
								className="shrink-0"
							/>
							{SCOPE_LABEL[value]}
						</label>
					))}
				</RadioGroup>

				{scope === "BRANCH" && (
					<Select
						value={branchId ?? ""}
						onValueChange={onBranchChange}
						disabled={locked}
						dir="rtl"
					>
						<SelectTrigger className="h-9 w-full text-xs sm:w-[240px]">
							<SelectValue placeholder="اختر الفرع..." />
						</SelectTrigger>
						<SelectContent dir="rtl">
							{branches.map((b) => (
								<SelectItem
									key={b?.id}
									value={b?.id ?? ""}
								>
									{b?.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}

				{scope === "DEPARTMENT" && (
					<Select
						value={roleId ?? ""}
						onValueChange={onRoleChange}
						disabled={locked}
						dir="rtl"
					>
						<SelectTrigger className="h-9 w-full text-xs sm:w-[240px]">
							<SelectValue placeholder="اختر القسم..." />
						</SelectTrigger>
						<SelectContent dir="rtl">
							{roles.map((r) => (
								<SelectItem
									key={r?.id}
									value={r?.id ?? ""}
								>
									{r?.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</div>

			{/* جدول الموظفين — معاينة دائمة، والاختيار متاح في نطاق "موظفون محدّدون" */}
			<div className="flex flex-col gap-2">
				<h4 className="text-xs font-bold text-foreground">
					{scope === "SPECIFIC" ? "اختيار الموظفين" : "الموظفون المشمولون"}
				</h4>
				<StaffSelectionTable
					staff={scope === "SPECIFIC" ? staff : scopedStaff}
					previews={previews}
					selectedIds={selectedIds}
					onToggle={onToggleSelected}
					onToggleAll={onToggleAll}
					selectable={scope === "SPECIFIC"}
					disabled={locked}
				/>
			</div>
		</div>
	);
}
