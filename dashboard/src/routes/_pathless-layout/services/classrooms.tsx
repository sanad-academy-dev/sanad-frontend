import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
	IconAdjustmentsHorizontal,
	IconDownload,
	IconFilter,
	IconLayoutGrid,
	IconPlus,
	IconSearch,
} from "@tabler/icons-react";
import { Stats } from "@/components/common/stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClassroomSheet } from "@/features/services/classrooms/components/classroom-sheet";
import { ClassroomsTable } from "@/features/services/classrooms/components/classrooms-table";
import { useClassroomStats } from "@/features/services/classrooms/hooks/use-classrooms";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";

export const Route = createFileRoute("/_pathless-layout/services/classrooms")({
	component: ClassroomsPage,
});

function ClassroomsPage() {
	const [addSheetOpen, setAddSheetOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const { stats } = useClassroomStats();

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

	return (
		<div className="flex flex-1 flex-col">
			{/* بطاقات الإحصائيات الأربع العلوية المطابقة تماماً لتصميم الشاشة */}
			<Stats className="px-4" stats={statsItems} />

			{/* شريط الأدوات العلوي والبحث */}
			<div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t bg-card/50">
				{/* زر إضافة فصل جديد في الجانب الأيسر (أو الأيمن بحسب RTL) */}
				<Button
					size="sm"
					onClick={() => setAddSheetOpen(true)}
					className="gap-1.5 h-8 text-xs font-semibold"
				>
					<IconPlus className="size-4" />
					إضافة فصل جديد
				</Button>

				{/* البحث وأزرار التصفية والإجراءات السريعة */}
				<div className="flex items-center gap-2 flex-1 max-w-2xl justify-end">
					<div className="relative w-full max-w-xs">
						<IconSearch className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
						<Input
							type="text"
							placeholder="ابحث عن اسم الفصل / المعرف..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-8 pr-8 pl-3 text-xs w-full text-right"
						/>
					</div>

					<Button
						variant="outline"
						size="sm"
						className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
					>
						<IconFilter className="size-3.5" />
						فلترة
					</Button>

					<Button
						variant="outline"
						size="sm"
						className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
					>
						<IconDownload className="size-3.5" />
						تصدير
					</Button>

					<Button
						variant="outline"
						size="sm"
						className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
					>
						<IconLayoutGrid className="size-3.5" />
						العرض
					</Button>

					<Button
						variant="outline"
						size="sm"
						className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
					>
						<IconAdjustmentsHorizontal className="size-3.5" />
						التصفية
					</Button>
				</div>
			</div>

			{/* جدول الفصول */}
			<div className="flex-1 flex flex-col min-h-0">
				<ClassroomsTable
					searchQuery={searchQuery}
					onAddClassroom={() => setAddSheetOpen(true)}
				/>
			</div>

			{/* نموذج إضافة فصل جديد */}
			<ClassroomSheet
				open={addSheetOpen}
				onClose={() => setAddSheetOpen(false)}
			/>
		</div>
	);
}
