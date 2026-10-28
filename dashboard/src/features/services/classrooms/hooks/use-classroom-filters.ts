import { useCallback, useMemo, useState } from "react";
import {
	IconCalendar,
	IconCategory,
	IconProgressCheck,
	IconSchool,
	IconUserCheck,
	IconUsers,
} from "@tabler/icons-react";
import type { FilterGroup } from "@/components/common/filters-menu";
import type { ClassroomResponse } from "@/server/classrooms/classrooms.type";
import { LEARNING_MODES } from "@/features/services/classrooms/data/constants";

type ClassroomFilterKey =
	| "status"
	| "category"
	| "learningMode"
	| "ageGroup"
	| "teacher"
	| "classification";

const EMPTY: Record<ClassroomFilterKey, string[]> = {
	status: [],
	category: [],
	learningMode: [],
	ageGroup: [],
	teacher: [],
	classification: [],
};

const uniqueOptions = (values: (string | undefined | null)[]) =>
	[...new Set(values.filter((v): v is string => !!v && v.trim() !== ""))]
		.sort()
		.map((v) => ({ value: v, label: v }));

export function useClassroomFilters(classrooms: ClassroomResponse[]) {
	const [filters, setFilters] = useState(EMPTY);

	const toggleFilter = useCallback(
		(key: ClassroomFilterKey, value: string) =>
			setFilters((prev) => ({
				...prev,
				[key]: prev[key].includes(value)
					? prev[key].filter((v) => v !== value)
					: [...prev[key], value],
			})),
		[],
	);

	const clearFilters = useCallback(() => {
		setFilters(EMPTY);
	}, []);

	const filterGroups: FilterGroup[] = useMemo(
		() => [
			{
				key: "status",
				label: "الحالة",
				Icon: IconProgressCheck,
				options: [
					{ value: "active", label: "نشط" },
					{ value: "inactive", label: "غير نشط" },
				],
				selected: filters.status,
				onToggle: (v) => toggleFilter("status", v),
			},
			{
				key: "category",
				label: "فئة الفصل",
				Icon: IconUsers,
				options: uniqueOptions(classrooms.map((c) => c.category)),
				selected: filters.category,
				onToggle: (v) => toggleFilter("category", v),
				emptyLabel: "لا توجد فئات",
			},
			{
				key: "learningMode",
				label: "نمط التعلم",
				Icon: IconSchool,
				options: [
					{ value: "IN_PERSON", label: "حضوري" },
					{ value: "REMOTE", label: "عن بعد" },
					{ value: "HYBRID", label: "هجين" },
				],
				selected: filters.learningMode,
				onToggle: (v) => toggleFilter("learningMode", v),
			},
			{
				key: "ageGroup",
				label: "الفئة العمرية",
				Icon: IconCalendar,
				options: uniqueOptions(classrooms.map((c) => c.ageGroup)),
				selected: filters.ageGroup,
				onToggle: (v) => toggleFilter("ageGroup", v),
				emptyLabel: "لا توجد فئات عمرية",
			},
			{
				key: "teacher",
				label: "المعلم / المشرف",
				Icon: IconUserCheck,
				options: uniqueOptions(
					classrooms.flatMap((c) => c.teachers?.map((t) => t.name) || []),
				),
				selected: filters.teacher,
				onToggle: (v) => toggleFilter("teacher", v),
				emptyLabel: "لا يوجد معلمون",
			},
			{
				key: "classification",
				label: "التصنيف",
				Icon: IconCategory,
				options: uniqueOptions(classrooms.map((c) => c.classification)),
				selected: filters.classification,
				onToggle: (v) => toggleFilter("classification", v),
				emptyLabel: "لا توجد تصنيفات",
			},
		],
		[classrooms, filters, toggleFilter],
	);

	const applyClassroomFilters = useCallback(
		(list: ClassroomResponse[], searchQuery?: string) => {
			let result = list;

			// 1. تصفية الفلاتر المحددة
			if (filters.status.length > 0) {
				result = result.filter((c) => {
					const isActive = Boolean(c.active);
					return (
						(filters.status.includes("active") && isActive) ||
						(filters.status.includes("inactive") && !isActive)
					);
				});
			}

			if (filters.category.length > 0) {
				result = result.filter((c) => c.category && filters.category.includes(c.category));
			}

			if (filters.learningMode.length > 0) {
				result = result.filter(
					(c) => c.learningMode && filters.learningMode.includes(c.learningMode),
				);
			}

			if (filters.ageGroup.length > 0) {
				result = result.filter((c) => c.ageGroup && filters.ageGroup.includes(c.ageGroup));
			}

			if (filters.teacher.length > 0) {
				result = result.filter((c) =>
					c.teachers?.some((t) => filters.teacher.includes(t.name)),
				);
			}

			if (filters.classification.length > 0) {
				result = result.filter(
					(c) => c.classification && filters.classification.includes(c.classification),
				);
			}

			// 2. البحث الفوري متعدد المعايير
			if (searchQuery && searchQuery.trim()) {
				const q = searchQuery.toLowerCase().trim();
				result = result.filter((c) => {
					const nameMatch = c.name?.toLowerCase().includes(q);
					const codeMatch = c.code?.toLowerCase().includes(q);
					const categoryMatch = c.category?.toLowerCase().includes(q);
					const ageGroupMatch = c.ageGroup?.toLowerCase().includes(q);
					const classificationMatch = c.classification?.toLowerCase().includes(q);
					const teacherMatch = c.teachers?.some((t) => t.name.toLowerCase().includes(q));
					const modeLabel = LEARNING_MODES[c.learningMode]?.label?.toLowerCase() || "";
					const modeMatch = modeLabel.includes(q);

					return (
						nameMatch ||
						codeMatch ||
						categoryMatch ||
						ageGroupMatch ||
						classificationMatch ||
						teacherMatch ||
						modeMatch
					);
				});
			}

			return result;
		},
		[filters],
	);

	const totalActiveFilters = useMemo(
		() => Object.values(filters).reduce((acc, curr) => acc + curr.length, 0),
		[filters],
	);

	return {
		filters,
		filterGroups,
		applyClassroomFilters,
		clearFilters,
		totalActiveFilters,
	};
}
