import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { IconPlus } from "@tabler/icons-react";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { ClassroomDialog } from "@/features/services/classrooms/components/classroom-dialog";
import { ClassroomsTable } from "@/features/services/classrooms/components/classrooms-table";
import { useClassroomStats, useClassrooms } from "@/features/services/classrooms/hooks/use-classrooms";
import { downloadCsv } from "@/lib/csv";
import { LEARNING_MODES } from "@/features/services/classrooms/data/constants";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { LearningMode } from "@/server/classrooms/classrooms.type";

export const Route = createFileRoute("/_pathless-layout/services/classrooms")({
	component: ClassroomsPage,
});

function ClassroomsPage() {
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const { stats } = useClassroomStats();
	const { classrooms } = useClassrooms(searchQuery);

	const statsItems: StatItem[] = useMemo(
	
			() => [
			{
				title: "اجمالي الفصول",
				value: stats.totalClassrooms,
				tooltip: "إجمالي عدد الفصول الدراسية المسجلة في النظام",
			},
			{
				title: "نشط",
				value: stats.activeClassrooms,
				tooltip: "عدد الفصول الدراسية المفعلة والنشطة حالياً",
			},
			{
				title: "إجمالي السعة",
				value: stats.totalCapacity,
				tooltip: "إجمالي السعة الاستيعابية لجميع الفصول النشطة",
			},
			{
				title: "مسجلون",
				value: stats.enrolledStudents,
				tooltip: "إجمالي عدد الطلاب المسجلين حالياً في الفصول",
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
		const rows = classrooms.map((c) => [
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

			{/* شريط الأدوات الموحد للمنصة (TableToolbar) */}
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن اسم الفصل / المعرف..."
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				onExport={handleExport}
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

			{/* جدول الفصول */}
			<div className="flex-1 flex flex-col min-h-0">
				<ClassroomsTable
					searchQuery={searchQuery}
					onAddClassroom={() => setAddDialogOpen(true)}
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
