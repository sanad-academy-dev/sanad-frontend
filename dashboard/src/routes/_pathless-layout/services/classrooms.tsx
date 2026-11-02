import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { IconPlus } from "@tabler/icons-react";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { FiltersMenu } from "@/components/common/filters-menu";
import {
	ViewGridIcon,
	ViewListIcon,
	ViewOptionsMenu,
} from "@/components/common/view-options-menu";
import { Button } from "@/components/ui/button";
import { ClassroomDialog } from "@/features/services/classrooms/components/classroom-dialog";
import { ClassroomsTable } from "@/features/services/classrooms/components/classrooms-table";
import { useClassroomStats, useClassrooms } from "@/features/services/classrooms/hooks/use-classrooms";
import { useClassroomFilters } from "@/features/services/classrooms/hooks/use-classroom-filters";
import { downloadCsv } from "@/lib/csv";
import { LEARNING_MODES } from "@/features/services/classrooms/data/constants";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { LearningMode } from "@/server/classrooms/classrooms.type";

const VIEW_OPTIONS = [
	{ value: "table" as const, label: "جدول", Icon: ViewListIcon },
	{ value: "grid" as const, label: "شبكة", Icon: ViewGridIcon },
] as const;

type ClassroomViewMode = (typeof VIEW_OPTIONS)[number]["value"];

export const Route = createFileRoute("/_pathless-layout/services/classrooms")({
	component: ClassroomsPage,
});

function ClassroomsPage() {
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState<ClassroomViewMode>("table");
	const [oldestFirst, setOldestFirst] = useState(false);

	const { stats } = useClassroomStats();
	const { classrooms, isLoading } = useClassrooms();
	const { filterGroups, applyClassroomFilters, clearFilters } =
		useClassroomFilters(classrooms);

	const filteredClassrooms = useMemo(
		() => applyClassroomFilters(classrooms, searchQuery),
		[classrooms, applyClassroomFilters, searchQuery],
	);

	const statsItems: StatItem[] = useMemo(
		() => [
			{
				title: "إجمالي الفصول",
				value: stats.totalClassrooms,
				tooltip: "إجمالي عدد الفصول الدراسية المسجلة في النظام",
			},
			{
				title: "الفصول النشطة",
				value: stats.activeClassrooms,
				tooltip: "عدد الفصول الدراسية المفعلة والنشطة حالياً",
			},
			{
				title: "إجمالي السعة",
				value: stats.totalCapacity,
				tooltip: "إجمالي السعة الاستيعابية لجميع الفصول النشطة",
			},
			{
				title: "الطلاب المسجلون",
				value: stats.enrolledStudents,
				tooltip: "إجمالي عدد الطلاب المسجلين حالياً في الفصول",
			},
			{
				title: "المقاعد الشاغرة",
				value: Math.max(0, stats.totalCapacity - stats.enrolledStudents),
				tooltip: "عدد المقاعد المتاحة لتسجيل طلاب جدد في جميع الفصول",
			},
		],
		[stats],
	);

	const handleExport = () => {
		const headers = [
			"اسم الفصل",
			"المعرف",
			"الفئة العمرية",
			"فئة الفصل",
			"نمط التعلم",
			"السعة",
			"المسجلون",
			"المشرفون والمعلمون",
			"الحالة",
			"تاريخ الإنشاء",
		];
		const rows = filteredClassrooms.map((c) => [
			c.name,
			c.code,
			c.ageGroup ?? "",
			c.category ?? "",
			LEARNING_MODES[c.learningMode as LearningMode]?.label ?? c.learningMode,
			c.capacity,
			c.enrolledCount,
			c.teachers?.map((t) => t.name).join("، ") ?? "",
			c.active ? "نشط" : "غير نشط",
			c.createdAt ? new Date(c.createdAt).toLocaleDateString("ar-EG") : "",
		]);
		downloadCsv("classrooms", headers, rows);
	};

	return (
		<div className="flex flex-1 flex-col">
			{/* بطاقات الإحصائيات الأربع العلوية المطابقة تماماً لتصميم الشاشة */}
			<Stats className="px-4" stats={statsItems} />

			{/* شريط الأدوات الموحد للمنصة (TableToolbar) مع الفلترة والبحث الفعّال */}
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن اسم الفصل / المعرف..."
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				onExport={handleExport}
				showView={false}
				filterMenu={
					<FiltersMenu
						groups={filterGroups}
						size="sm"
						label="فلترة"
						onReset={clearFilters}
					/>
				}
				leftExtra={
					<ViewOptionsMenu
						options={VIEW_OPTIONS}
						view={viewMode}
						onViewChange={setViewMode}
						oldestFirst={oldestFirst}
						onOldestFirstChange={setOldestFirst}
						size="sm"
					/>
				}
				actions={
					<Button
						size="sm"
						onClick={() => setAddDialogOpen(true)}
						className="gap-1.5"
					>
						<IconPlus className="size-4" />
						إضافة فصل جديد
					</Button>
				}
			/>

			{/* جدول وشبكة الفصول */}
			<div className="flex-1 flex flex-col min-h-0">
				<ClassroomsTable
					data={filteredClassrooms}
					isLoading={isLoading}
					searchQuery={searchQuery}
					onAddClassroom={() => setAddDialogOpen(true)}
					viewMode={viewMode}
					oldestFirst={oldestFirst}
				/>
			</div>

			{/* نموذج إضافة فصل جديد */}
			<ClassroomDialog
				open={addDialogOpen}
				onClose={() => setAddDialogOpen(false)}
			/>
		</div>
	);
}

