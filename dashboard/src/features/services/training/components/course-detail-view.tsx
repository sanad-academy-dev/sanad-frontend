import {
	IconChevronLeft,
	IconDots,
	IconPlus,
	IconSearch,
	IconSettings,
	IconSparkles,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { Stats } from "@/components/common/stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabPlaceholder } from "@/features/services/staff/components/tab-placeholder";
import { AssignEmployeeDialog } from "@/features/services/training/components/assign-employee-dialog";
import { CourseDetailsSheet } from "@/features/services/training/components/course-details-sheet";
import { CoursePlayerDialog } from "@/features/services/training/components/course-player-dialog";
import { CourseRosterTable } from "@/features/services/training/components/course-roster-table";
import { CourseTraineeSheet } from "@/features/services/training/components/course-trainee-sheet";
import { UnassignConfirmDialog } from "@/features/services/training/components/unassign-confirm-dialog";
import { formatTrainingCost } from "@/features/services/training/data/training";
import {
	useAssignmentActions,
	useCourseRoster,
} from "@/features/services/training/hooks/use-course-assignments";
import { useCourse } from "@/features/services/training/hooks/use-courses";
import { cn } from "@/lib/utils";
import type { AssignmentResponse } from "@/server/course-assignments/course-assignments.type";
import type { CourseListItemResponse } from "@/server/training/training.type";

type DetailTab = "overview" | "roster" | "settings";

const TABS: { value: DetailTab; label: string }[] = [
	{ value: "overview", label: "نظرة عامة" },
	{ value: "roster", label: "الموظفين المعيّنين بالدورة" },
	// تبويب فارغ حتى تُحدَّد محتوياته — لا يفتح معالج إنشاء الدورة
	{ value: "settings", label: "إعدادات الدورة" },
];

export function CourseDetailView({ courseId }: { courseId: string }) {
	const { course, isLoading } = useCourse(courseId);
	const { roster, isLoading: rosterLoading } = useCourseRoster(courseId);
	const { unassign, isUnassigning, start, isStarting } = useAssignmentActions(courseId);

	const [tab, setTab] = useState<DetailTab>("roster");
	const [search, setSearch] = useState("");
	const [assignOpen, setAssignOpen] = useState(false);
	// التعيين المفتوح في لوحة تفاصيل الدورة (يسار الشاشة)
	const [activeAssignment, setActiveAssignment] = useState<AssignmentResponse | null>(null);
	// التعيين المفتوح في مشغّل الدورة (حوار وسط الشاشة)
	const [playerAssignment, setPlayerAssignment] = useState<AssignmentResponse | null>(null);
	// التعيين المُراد إلغاؤه — يفتح حوار تأكيد الإلغاء
	const [unassignTarget, setUnassignTarget] = useState<AssignmentResponse | null>(null);
	// التعيين المفتوح في لوحة تفاصيل المتدرّب (تنزلق من يسار الشاشة عند الضغط على الصف)
	const [traineeAssignment, setTraineeAssignment] = useState<AssignmentResponse | null>(null);
	// فتحة الهيدر العلوي — نحقن فيها مسار التنقّل والتبويبات (كما تفعل بقية الوحدات)
	const [slot, setSlot] = useState<HTMLElement | null>(null);
	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	const totalUnits = course?.units.length ?? 0;

	// بطاقات KPI — مشتقّة من قائمة التعيينات وتكلفة الدورة (لا حاجة لنقطة نهاية إضافية)
	const stats = useMemo(() => {
		const enrolled = roster.length;
		const completed = roster.filter((a) => a.status === "COMPLETED").length;
		const inProgress = roster.filter((a) => a.status === "IN_PROGRESS").length;
		const notStarted = roster.filter((a) => a.status === "ASSIGNED").length;
		const revenue = (course?.trainingCost ?? 0) * enrolled;
		return [
			{
				title: "# للمتحصّلين بالدورة",
				value: enrolled,
				tooltip: "عدد الموظفين المعيّنين على الدورة",
			},
			{ title: "# أكملوا الدورة", value: completed, tooltip: "التعيينات المكتملة" },
			{ title: "# جاري التعلّم", value: inProgress, tooltip: "التعيينات قيد التقدّم" },
			{ title: "# لم يبدأوا", value: notStarted, tooltip: "التعيينات التي لم تبدأ بعد" },
			{
				title: "# إجمالي الإيرادات",
				value: revenue,
				valueLabel: "ريال",
				tooltip: "تكلفة التدريب مضروبة في عدد المعيّنين",
			},
		];
	}, [roster, course?.trainingCost]);

	const filteredRoster = useMemo(() => {
		const q = search.trim();
		if (!q) return roster;
		return roster.filter(
			(a) => a.staff.name.includes(q) || (a.staff.code?.includes(q) ?? false),
		);
	}, [roster, search]);

	if (isLoading || !course) {
		return (
			<div
				dir="rtl"
				className="flex flex-1 items-center justify-center"
			>
				<p className="text-[13px] text-muted-foreground">جارٍ تحميل الدورة...</p>
			</div>
		);
	}

	// الدورة المصغّرة التي يتوقّعها حوار «تعيين لموظف» (يستخدم id + name)
	const courseForAssign = { id: course.id, name: course.name } as CourseListItemResponse;

	// الرأس (مسار التنقّل + التبويبات) يُحقن في فتحة الهيدر العلوي — Figma «Header» (4413:475461).
	// الاتجاه RTL موروث من <html>، فأول عنصر في DOM يظهر يمينًا. ترتيب الفيجما بصريًا من اليسار:
	// [إعدادات الدورة] [الموظفين] [نظرة عامة] │ [⋯] [الكود ·] [✦] [اسم الدورة] [‹] [الدورات التدريبية]
	const header = (
		<div className="flex items-center gap-[6px]">
			{/* مسار التنقّل: يبدأ من يمين الهيدر بالصفحة الأمّ ثم ينزل إلى الدورة الحالية */}
			<Link
				to="/services/training"
				className="whitespace-nowrap text-[10px] font-bold leading-[13.5px] text-[#08090A] hover:underline"
			>
				الدورات التدريبية
			</Link>
			<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
			<span className="whitespace-nowrap text-[10px] font-bold leading-[13.5px] text-[#08090A]">
				{course.name}
			</span>
			<IconSparkles className="size-[13px] shrink-0 text-[#6C6C6E]" />

			<span className="flex items-center gap-[5px]">
				{/* جزيرة LTR: المعرّف وفاصلته يُقرآن من اليسار كما في التصميم */}
				<span
					dir="ltr"
					className="font-mono text-[10px] leading-[15px] text-[#9B9B9D]"
				>
					{course.code} ·
				</span>
				<button
					type="button"
					aria-label="خيارات الدورة"
					className="flex h-4 w-[26px] shrink-0 items-center justify-center rounded-[4px] bg-background text-[#08090A] hover:bg-muted"
				>
					<IconDots className="size-[13px]" />
				</button>
			</span>

			<span className="h-[18px] w-px shrink-0 bg-[#E5E7EB]" />

			{/* التبويبات — «نظرة عامة» يمينًا و«إعدادات الدورة» يسارًا */}
			<nav className="flex items-center gap-[5px]">
				{TABS.map((tItem) => (
					<button
						key={tItem.value}
						type="button"
						onClick={() => setTab(tItem.value)}
						aria-pressed={tab === tItem.value}
						className={cn(
							"flex items-center justify-center whitespace-nowrap border-[0.75px] px-[6px] py-[4px] text-[11px] font-medium leading-[10.5px] transition-colors",
							tab === tItem.value
								? "rounded-[2px] border-[#E5E5E5] bg-background text-[#1F2937]"
								: "rounded-[6px] border-transparent text-[#6B7280] hover:bg-muted",
						)}
					>
						{tItem.label}
					</button>
				))}
			</nav>
		</div>
	);

	return (
		<div
			dir="rtl"
			className="flex min-h-0 flex-1 flex-col overflow-hidden"
		>
			{slot && createPortal(header, slot)}

			{tab === "roster" ? (
				<>
					<Stats
						className="gap-3 px-3"
						stats={stats}
						variant="compact"
					/>

					{/* شريط الأدوات */}
					<div className="flex flex-wrap items-center justify-between gap-3 border-y-[0.5px] border-border px-3 py-2">
						{/* يمين (بداية RTL): البحث */}
						<div className="relative w-[320px] max-w-full">
							<IconSearch className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="ابحث باسم الموظف / المعرّف..."
								className="h-8 ps-9 text-xs"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>

						{/* يسار (نهاية RTL): إجراء التعيين الأساسي */}
						<Button
							type="button"
							size="sm"
							className="h-8 gap-1.5 bg-[#4F6AE0] text-xs font-bold hover:bg-[#4F6AE0]/90"
							onClick={() => setAssignOpen(true)}
						>
							<IconPlus className="size-3.5" />
							تعيين موظف
						</Button>
					</div>

					<div className="min-h-0 flex-1 overflow-auto bg-background p-3">
						<CourseRosterTable
							roster={filteredRoster}
							isLoading={rosterLoading}
							totalUnits={totalUnits}
							locationMode={course.locationMode}
							onAction={(a) =>
								// لوحة التفاصيل (شيت البدء) تظهر فقط لإجراء «بدء الدورة» (لم يبدأ بعد).
								// أما «استكمال الدورة» و«عرض النتيجة» فتفتح مشغّل الدورة مباشرة.
								a.status === "ASSIGNED" ? setActiveAssignment(a) : setPlayerAssignment(a)
							}
							onUnassign={(a) => setUnassignTarget(a)}
							onRowClick={(a) => setTraineeAssignment(a)}
						/>
					</div>
				</>
			) : tab === "overview" ? (
				<div className="min-h-0 flex-1 overflow-auto p-3">
					<div className="grid max-w-3xl grid-cols-1 gap-x-10 gap-y-3 rounded-[4px] border border-[#E5E5E5] p-4 sm:grid-cols-2">
						{[
							{ label: "اسم الدورة", value: course.name },
							{ label: "المعرّف", value: course.code },
							{ label: "# الوحدات", value: String(totalUnits) },
							{ label: "# المعيّنين", value: String(roster.length) },
							{
								label: "سعر الدورة",
								value: formatTrainingCost(course.trainingCost) ?? "مجانية",
							},
						].map((r) => (
							<div
								key={r.label}
								className="flex items-center justify-between gap-2 border-b border-[#F0F0F0] pb-2"
							>
								<span className="text-[12px] font-semibold text-[#08090A]">{r.label}</span>
								<span className="text-[12px] text-[#08090A]">{r.value}</span>
							</div>
						))}
					</div>
				</div>
			) : (
				// إعدادات الدورة — فارغة مؤقتًا حتى تُحدَّد محتوياتها
				<TabPlaceholder
					icon={IconSettings}
					title="إعدادات الدورة"
					description="لم تُضَف إعدادات هذه الدورة بعد."
				/>
			)}

			<AssignEmployeeDialog
				course={assignOpen ? courseForAssign : null}
				onClose={() => setAssignOpen(false)}
			/>

			<CourseDetailsSheet
				course={course}
				assignment={activeAssignment}
				onClose={() => setActiveAssignment(null)}
				onStart={(id) => {
					const a = activeAssignment;
					// يبدأ التعيين فقط إن لم يكن قد بدأ، ثم يفتح مشغّل الدورة وسط الشاشة
					if (a?.status === "ASSIGNED") start(id);
					setPlayerAssignment(a);
					setActiveAssignment(null);
				}}
				isStarting={isStarting}
			/>

			<CoursePlayerDialog
				course={course}
				assignment={playerAssignment}
				onClose={() => setPlayerAssignment(null)}
			/>

			<CourseTraineeSheet
				course={course}
				assignment={traineeAssignment}
				onClose={() => setTraineeAssignment(null)}
				onOpenPlayer={(a) => {
					// يبدأ التعيين إن لم يكن قد بدأ، ثم يفتح مشغّل الدورة وسط الشاشة
					if (a.status === "ASSIGNED") start(a.id);
					setTraineeAssignment(null);
					setPlayerAssignment(a);
				}}
				onUnassign={(a) => {
					setTraineeAssignment(null);
					setUnassignTarget(a);
				}}
			/>

			<UnassignConfirmDialog
				assignment={unassignTarget}
				courseName={course.name}
				isPending={isUnassigning}
				onClose={() => setUnassignTarget(null)}
				onConfirm={() => {
					if (unassignTarget) unassign(unassignTarget.id);
					setUnassignTarget(null);
				}}
			/>
		</div>
	);
}
