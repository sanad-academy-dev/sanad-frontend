import { IconBriefcase, IconBuildingStore, IconProgressCheck } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";

import type { FilterGroup } from "@/components/common/filters-menu";
import type { StaffResponse } from "@/server/staff/staff.type";
import { EmploymentType, StaffStatus } from "@sanad/contracts/runtime/server/staff/staff.type";

type StaffFilterKey = "status" | "role" | "branch" | "employmentType";

const STATUS_OPTIONS = [
	{ value: StaffStatus.ACTIVE, label: "نشط" },
	{ value: StaffStatus.PENDING, label: "معلق" },
	{ value: StaffStatus.INACTIVE, label: "غير نشط" },
];

const EMPLOYMENT_TYPE_OPTIONS = [
	{ value: EmploymentType.FULL_TIME, label: "دوام كلي" },
	{ value: EmploymentType.PART_TIME, label: "دوام جزئي" },
];

const EMPTY: Record<StaffFilterKey, string[]> = {
	status: [],
	role: [],
	branch: [],
	employmentType: [],
};

// خيارات فريدة مشتقّة من الموظفين الحاليين (تتجاهل الفارغ)
const uniqueOptions = (values: (string | undefined | null)[]) =>
	[...new Set(values.filter((v): v is string => !!v))].map((v) => ({ value: v, label: v }));

// تصفية الموظفين المشتركة بين تبويبات الموارد البشرية (الموظفون/الحضور/المناوبات/الرواتب):
// تُعيد مجموعات القائمة ودالة تطبيقها على أي قائمة موظفين. الاختيار الفارغ يعني «الكل».
export function useStaffFilters(staff: StaffResponse[]) {
	const [filters, setFilters] = useState(EMPTY);

	const toggleFilter = useCallback(
		(key: StaffFilterKey, value: string) =>
			setFilters((prev) => ({
				...prev,
				[key]: prev[key].includes(value)
					? prev[key].filter((v) => v !== value)
					: [...prev[key], value],
			})),
		[],
	);

	const filterGroups: FilterGroup[] = useMemo(
		() => [
			{
				key: "status",
				label: "الحالة",
				Icon: IconProgressCheck,
				options: STATUS_OPTIONS,
				selected: filters.status,
				onToggle: (v) => toggleFilter("status", v),
			},
			{
				key: "role",
				label: "الدور",
				Icon: IconBriefcase,
				options: uniqueOptions(staff.map((s) => s.role?.name)),
				selected: filters.role,
				onToggle: (v) => toggleFilter("role", v),
			},
			{
				key: "branch",
				label: "الفرع",
				Icon: IconBuildingStore,
				options: uniqueOptions(staff.map((s) => s.branch?.name)),
				selected: filters.branch,
				onToggle: (v) => toggleFilter("branch", v),
			},
			{
				key: "employmentType",
				label: "نوع الدوام",
				Icon: IconBriefcase,
				options: EMPLOYMENT_TYPE_OPTIONS,
				selected: filters.employmentType,
				onToggle: (v) => toggleFilter("employmentType", v),
			},
		],
		[staff, filters, toggleFilter],
	);

	// مرجع الدالة ثابت ما لم تتغيّر الفلاتر — مهم لأن نتيجتها تُمرَّر كـ data لجداول TanStack
	const applyStaffFilters = useCallback(
		(list: StaffResponse[]) =>
			list
				.filter((s) => filters.status.length === 0 || filters.status.includes(s.status))
				.filter((s) => filters.role.length === 0 || filters.role.includes(s.role?.name ?? ""))
				.filter(
					(s) => filters.branch.length === 0 || filters.branch.includes(s.branch?.name ?? ""),
				)
				.filter(
					(s) =>
						filters.employmentType.length === 0 ||
						filters.employmentType.includes(s.employmentType ?? ""),
				),
		[filters],
	);

	return { filterGroups, applyStaffFilters };
}
