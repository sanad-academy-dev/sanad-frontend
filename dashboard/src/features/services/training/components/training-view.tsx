import {
	IconCategory,
	IconDownload,
	IconMapPin,
	IconPlus,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { AddCourseSheet } from "@/features/services/training/components/add-course-sheet";
import { AddQuizSheet } from "@/features/services/training/components/add-quiz-sheet";
import { AssignEmployeeDialog } from "@/features/services/training/components/assign-employee-dialog";
import { CloneSuccessToast } from "@/features/services/training/components/clone-success-toast";
import { CourseCard } from "@/features/services/training/components/course-card";
import { CourseTable } from "@/features/services/training/components/course-table";
import { CreateContentMenu } from "@/features/services/training/components/create-content-menu";
import { DeleteCourseDialog } from "@/features/services/training/components/delete-course-dialog";
import { DeleteQuizDialog } from "@/features/services/training/components/delete-quiz-dialog";
import {
	DisableCourseDialog,
	EnableCourseDialog,
} from "@/features/services/training/components/disable-course-dialog";
import { QuizCard } from "@/features/services/training/components/quiz-card";
import { QuizDetailsSheet } from "@/features/services/training/components/quiz-details-sheet";
import { QuizManagerDialog } from "@/features/services/training/components/quiz-manager-dialog";
import { QuizPlayerDialog } from "@/features/services/training/components/quiz-player-dialog";
import { QuizTable } from "@/features/services/training/components/quiz-table";
import {
	type FilterGroup,
	TrainingFiltersMenu,
} from "@/features/services/training/components/training-filters-menu";
import { UnpublishQuizDialog } from "@/features/services/training/components/unpublish-quiz-dialog";
import {
	type CoursesView,
	ViewOptionsMenu,
} from "@/features/services/training/components/view-options-menu";
import {
	COURSE_LOCATION_OPTIONS,
	COURSE_TYPE_OPTIONS,
} from "@/features/services/training/data/training";
import {
	useArchiveCourse,
	useCourseStats,
	useCourses,
	useDeleteCourse,
	useDuplicateCourse,
	useRestoreCourse,
} from "@/features/services/training/hooks/use-courses";
import {
	useDeleteQuiz,
	usePublishQuiz,
	useQuizStats,
	useQuizzes,
	useUnpublishQuiz,
} from "@/features/services/training/hooks/use-quizzes";
import type { TrainingTab } from "@/features/services/training/types/training-tabs.types";
import { exportCoursesCsv } from "@/features/services/training/utils/export-courses";
import type { QuizListItemResponse, QuizStatsResponse } from "@/server/quizzes/quizzes.type";
import type {
	CourseListItemResponse,
	CourseLocationMode,
	CourseStatsResponse,
	CourseType,
} from "@/server/training/training.type";

// إضافة/إزالة قيمة من قائمة تصفية متعدّدة الاختيار
const toggleValue = <T extends string>(list: T[], value: T) =>
	list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

// بطاقات إحصائية — الترتيب هو ترتيب DOM في RTL: أول عنصر في أقصى اليمين
const buildStats = (s?: CourseStatsResponse) => [
	{
		title: "إجمالي الدورات",
		value: s?.totalCourses ?? 0,
		tooltip: "العدد الكلي للدورات المسجلة",
	},
	{
		title: "# المستفيدين",
		value: s?.assignedStaff ?? 0,
		tooltip: "عدد الموظفين المميّزين المُعيَّنين على الدورات",
	},
	{ title: "مكتمل", value: s?.completedAssignments ?? 0, tooltip: "التعيينات المكتملة" },
	{
		title: "جاري تنفيذها",
		value: s?.inProgressAssignments ?? 0,
		tooltip: "التعيينات غير المكتملة",
	},
];

// بطاقات إحصائية للاختبارات — الترتيب هو ترتيب DOM في RTL
const buildQuizStats = (s?: QuizStatsResponse) => [
	{ title: "إجمالي الاختبارات", value: s?.total ?? 0, tooltip: "العدد الكلي للاختبارات" },
	{ title: "منشورة", value: s?.published ?? 0, tooltip: "الاختبارات المنشورة" },
	{ title: "مسودّات", value: s?.draft ?? 0, tooltip: "الاختبارات قيد الإعداد" },
];

export function TrainingView({ tab }: { tab: TrainingTab }) {
	const navigate = useNavigate();
	const isQuizTab = tab === "quiz";
	const { stats } = useCourseStats();
	const { courses, isLoading } = useCourses();
	const { deleteCourse } = useDeleteCourse();
	const { duplicateCourse } = useDuplicateCourse();
	const { archiveCourse } = useArchiveCourse();
	const { restoreCourse } = useRestoreCourse();
	const { staff } = useStaff();

	// الاختبارات (تبويب «اختبار»)
	const { quizzes, isLoading: quizzesLoading } = useQuizzes();
	const { stats: quizStats } = useQuizStats();
	const { deleteQuiz } = useDeleteQuiz();
	const { publishQuiz } = usePublishQuiz();
	const { unpublishQuiz } = useUnpublishQuiz();
	const [quizAddOpen, setQuizAddOpen] = useState(false);
	const [quizEditId, setQuizEditId] = useState<string | null>(null);
	const [deletingQuiz, setDeletingQuiz] = useState<QuizListItemResponse | null>(null);
	const [playingQuizId, setPlayingQuizId] = useState<string | null>(null);
	const [resultsQuizId, setResultsQuizId] = useState<string | null>(null);
	// الاختبار المعروضة تفاصيله قبل البدء (لوحة من يسار الشاشة)
	const [preStartQuizId, setPreStartQuizId] = useState<string | null>(null);
	// الاختبار المطلوب إلغاء نشره — يفتح حوار تأكيد
	const [unpublishingQuiz, setUnpublishingQuiz] = useState<QuizListItemResponse | null>(null);

	const [search, setSearch] = useState("");
	// فلاتر متعدّدة الاختيار — قائمة فارغة = بلا تصفية
	const [typeFilters, setTypeFilters] = useState<CourseType[]>([]);
	const [locationFilters, setLocationFilters] = useState<CourseLocationMode[]>([]);
	const [trainerFilters, setTrainerFilters] = useState<string[]>([]);
	const [view, setView] = useState<CoursesView>("list");
	const [oldestFirst, setOldestFirst] = useState(false);
	const [deleting, setDeleting] = useState<CourseListItemResponse | null>(null);
	const [disabling, setDisabling] = useState<CourseListItemResponse | null>(null);
	const [enabling, setEnabling] = useState<CourseListItemResponse | null>(null);
	// الدورة قيد الاستنساخ — يظهر صفّ تقدّم مضمّن أسفلها حتى انتهاء العملية
	const [cloning, setCloning] = useState<CourseListItemResponse | null>(null);
	const [addOpen, setAddOpen] = useState(false);
	// معرّف الدورة قيد التعديل — تُفتح اللوحة على الخطوة 1 بحالة محمّلة
	const [editId, setEditId] = useState<string | null>(null);
	// الدورة التي يُعيَّن لها موظفون عبر حوار «تعيين لموظف»
	const [assigning, setAssigning] = useState<CourseListItemResponse | null>(null);

	const handleAdd = () => {
		setEditId(null);
		setAddOpen(true);
	};
	const handleEdit = (course: CourseListItemResponse) => {
		setEditId(course.id);
		setAddOpen(true);
	};
	// «فتح» يفتح باني الدورة (نفس اللوحة الجانبية على معرّف الدورة)
	const handleOpen = handleEdit;

	// ==== إجراءات الاختبارات ====
	const openQuizCreate = () => {
		setQuizEditId(null);
		setQuizAddOpen(true);
	};
	const handleQuizEdit = (quiz: QuizListItemResponse) => {
		setQuizEditId(quiz.id);
		setQuizAddOpen(true);
	};
	const handleQuizPublish = (quiz: QuizListItemResponse) => {
		toast.promise(publishQuiz(quiz.id), {
			loading: "جارٍ نشر الاختبار...",
			success: "تم نشر الاختبار",
			error: (e: Error) => e.message || "تعذّر نشر الاختبار",
		});
	};
	const handleQuizUnpublish = (quiz: QuizListItemResponse) => {
		setUnpublishingQuiz(quiz);
	};

	// استنساخ: يعرض صفّ التقدّم المضمّن أثناء العملية، ثم توست نجاح مع «تراجع» (يحذف النسخة)
	const handleDuplicate = async (course: CourseListItemResponse) => {
		if (cloning) return; // استنساخ واحد في كل مرة
		setCloning(course);
		try {
			const created = await duplicateCourse(course.id);
			const newId = (created as { id?: string } | null)?.id;
			toast.custom(
				(id) => (
					<CloneSuccessToast
						name={course.name}
						onUndo={() => {
							if (newId) deleteCourse(newId);
							toast.dismiss(id);
						}}
					/>
				),
				{ duration: 6000 },
			);
		} catch {
			toast.error("تعذّر استنساخ الدورة");
		} finally {
			setCloning(null);
		}
	};

	// مجموعات «التصفية» — كل مجموعة قائمة فرعية بخانات اختيار
	const filterGroups: FilterGroup[] = [
		{
			key: "type",
			label: "النوع",
			Icon: IconCategory,
			options: COURSE_TYPE_OPTIONS,
			selected: typeFilters,
			onToggle: (v) => setTypeFilters((prev) => toggleValue(prev, v as CourseType)),
		},
		{
			key: "location",
			label: "مكان الدورة",
			Icon: IconMapPin,
			options: COURSE_LOCATION_OPTIONS,
			selected: locationFilters,
			onToggle: (v) =>
				setLocationFilters((prev) => toggleValue(prev, v as CourseLocationMode)),
		},
		{
			key: "trainer",
			label: "المدرب",
			Icon: IconUser,
			options: staff.map((s) => ({ value: s.id, label: s.name })),
			selected: trainerFilters,
			onToggle: (v) => setTrainerFilters((prev) => toggleValue(prev, v)),
			emptyLabel: "لا يوجد مدربون",
		},
	];

	// شرائح الفلاتر النشطة — شريحة لكل قيمة مختارة
	const filters = filterGroups.flatMap((g) =>
		g.selected.map((value) => ({
			key: `${g.key}:${value}`,
			label: g.options.find((o) => o.value === value)?.label ?? value,
			clear: () => g.onToggle(value),
		})),
	);

	const resetFilters = () => {
		setTypeFilters([]);
		setLocationFilters([]);
		setTrainerFilters([]);
		setSearch("");
	};

	const filtered = useMemo(() => {
		const q = search.trim();
		const list = courses
			// «مكتبة الدورات» = المنشورة فقط؛ «الكل» = بلا تصفية حالة (قرار مقفل #4)
			.filter((c) => (tab === "library" ? c.status === "PUBLISHED" : true))
			.filter((c) => (q ? c.name.includes(q) || c.code.includes(q) : true))
			.filter((c) => (typeFilters.length === 0 ? true : typeFilters.includes(c.type)))
			.filter((c) =>
				locationFilters.length === 0
					? true
					: c.locationMode !== null && locationFilters.includes(c.locationMode),
			)
			.filter((c) =>
				trainerFilters.length === 0
					? true
					: c.trainers.some((t) => trainerFilters.includes(t.id)),
			);
		// القائمة تأتي مرتبة تنازليًّا حسب الإنشاء؛ عكسها للأقدم أولًا
		return oldestFirst ? [...list].reverse() : list;
	}, [courses, tab, search, typeFilters, locationFilters, trainerFilters, oldestFirst]);

	// تصفية الاختبارات بالبحث فقط (لا فلاتر خاصة بالدورات)
	const filteredQuizzes = useMemo(() => {
		const q = search.trim();
		const list = quizzes.filter((z) => (q ? z.title.includes(q) || z.code.includes(q) : true));
		return oldestFirst ? [...list].reverse() : list;
	}, [quizzes, search, oldestFirst]);

	return (
		<div
			className="flex min-h-0 flex-1 flex-col"
			dir="rtl"
		>
			{/* تبويب «اختبار» له بطاقاته الثلاث؛ بقيّة التبويبات بطاقات الدورات الأربع */}
			<Stats
				className={isQuizTab ? "grid-cols-3 gap-3 px-3" : "grid-cols-4 gap-3 px-3"}
				stats={isQuizTab ? buildQuizStats(quizStats) : buildStats(stats)}
				variant="compact"
			/>

			{/* شريط الأدوات */}
			<TableToolbar
				className="border-y"
				searchPlaceholder="ابحث عن اسم التدريب / المعرّف..."
				searchClassName="w-[320px]"
				searchValue={search}
				onSearchChange={setSearch}
				// «فلترة» القياسي مخفيّ لأن TrainingFiltersMenu في leftExtra يقوم بدوره
				showFilter={false}
				showExport={false}
				showView={false}
				leftExtra={
					<>
						{/* فلاتر متعدّدة الاختيار — النوع/المكان/المدرب في قائمة واحدة */}
						<TrainingFiltersMenu groups={filterGroups} />
						{/* مبدّل العرض والترتيب */}
						<ViewOptionsMenu
							view={view}
							onViewChange={setView}
							oldestFirst={oldestFirst}
							onOldestFirstChange={setOldestFirst}
						/>
						{/* تصدير — CSV للصفوف الحالية بعد التصفية.
						    ترتيب DOM في RTL: يأتي بعد «العرض» فيظهر على يساره، وبمقاس xs (h-6) مثله. */}
						<Button
							type="button"
							variant="outline"
							size="xs"
							onClick={() => exportCoursesCsv(filtered)}
							disabled={filtered.length === 0}
							className="gap-1.5 px-2"
						>
							<IconDownload className="size-3.5" />
							تصدير
						</Button>
					</>
				}
				actions={
					<CreateContentMenu
						onSelectCourse={handleAdd}
						onSelectQuiz={openQuizCreate}
					>
						<Button
							type="button"
							size="sm"
							className="h-8 gap-1.5 text-xs font-bold"
						>
							<IconPlus className="size-3.5" />
							إنشاء محتوى
						</Button>
					</CreateContentMenu>
				}
			/>

			{/* شرائح الفلاتر النشطة */}
			{!isQuizTab && filters.length > 0 && (
				<div className="flex flex-wrap items-center gap-2 border-b-[0.5px] border-border px-3 py-2">
					{filters.map((f) => (
						<span
							key={f.key}
							className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
						>
							{f.label}
							<button
								type="button"
								onClick={f.clear}
								aria-label="إزالة الفلتر"
							>
								<IconX className="size-3" />
							</button>
						</span>
					))}
					<button
						type="button"
						onClick={resetFilters}
						className="text-[11px] font-medium text-destructive"
					>
						إعادة تعيين
					</button>
				</div>
			)}

			<AddCourseSheet
				open={addOpen}
				onClose={() => setAddOpen(false)}
				editCourseId={editId}
			/>

			<AddQuizSheet
				open={quizAddOpen}
				onClose={() => setQuizAddOpen(false)}
				editQuizId={quizEditId}
			/>

			<AssignEmployeeDialog
				course={assigning}
				onClose={() => setAssigning(null)}
			/>

			{/* المحتوى */}
			<div className="min-h-0 flex-1 overflow-auto bg-background py-3">
				{isQuizTab ? (
					quizzesLoading ? (
						<p className="px-3 py-16 text-center text-[13px] text-muted-foreground">
							جارٍ تحميل الاختبارات...
						</p>
					) : filteredQuizzes.length === 0 ? (
						<div className="flex flex-col items-center gap-3 px-3 py-16 text-center">
							<h2 className="text-[14px] font-bold text-foreground">
								{quizzes.length === 0
									? "لا يوجد أي اختبارات حتى الآن"
									: "لا توجد اختبارات مطابقة"}
							</h2>
							<p className="max-w-[280px] text-[12px] text-muted-foreground">
								أنشئ اختباراً لتقييم معرفة موظفيك ورصد نتائجهم.
							</p>
							{quizzes.length === 0 && (
								<Button
									type="button"
									onClick={openQuizCreate}
									className="h-9 rounded-lg px-4 text-[12px]"
								>
									إنشاء اختبار
								</Button>
							)}
						</div>
					) : view === "grid" ? (
						// عرض «قائمة» (بطاقات) للاختبارات — نفس مبدّل العرض المستخدم للدورات
						<div className="grid grid-cols-1 gap-3 px-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{filteredQuizzes.map((quiz) => (
								<QuizCard
									key={quiz.id}
									quiz={quiz}
									onOpen={() => setResultsQuizId(quiz.id)}
									onEdit={() => handleQuizEdit(quiz)}
									onPlay={() => setPreStartQuizId(quiz.id)}
									onResults={() => setResultsQuizId(quiz.id)}
									onPublish={() => handleQuizPublish(quiz)}
									onUnpublish={() => handleQuizUnpublish(quiz)}
									onDelete={() => setDeletingQuiz(quiz)}
								/>
							))}
						</div>
					) : (
						<QuizTable
							quizzes={filteredQuizzes}
							isLoading={false}
							onEdit={handleQuizEdit}
							onPublish={handleQuizPublish}
							onUnpublish={handleQuizUnpublish}
							onDelete={setDeletingQuiz}
							onPlay={(q) => setPreStartQuizId(q.id)}
							onResults={(q) => setResultsQuizId(q.id)}
							// النقر على صفّ الاختبار يفتح المعيَّنين ونتائجهم، والتعديل من قائمة الخيارات
							onRowOpen={(q) => setResultsQuizId(q.id)}
						/>
					)
				) : isLoading ? (
					<p className="px-3 py-16 text-center text-[13px] text-muted-foreground">
						جارٍ تحميل الدورات...
					</p>
				) : filtered.length === 0 ? (
					<div className="flex flex-col items-center gap-3 px-3 py-16 text-center">
						<img
							src="/illustrations/courses-empty.svg"
							alt=""
							className="h-[220px] w-[220px] max-w-full object-contain"
						/>
						<h2 className="text-[14px] font-bold text-foreground">
							{courses.length === 0 ? "لا يوجد أي دورات حتى الآن" : "لا توجد دورات مطابقة"}
						</h2>
						<p className="max-w-[280px] text-[12px] text-muted-foreground">
							{tab === "library"
								? "لا توجد دورات منشورة بعد."
								: "أنشئ أول دورة تدريبية لتطوير مهارات موظفيك، من مكان واحد."}
						</p>
						{courses.length === 0 && (
							<CreateContentMenu
								onSelectCourse={handleAdd}
								onSelectQuiz={openQuizCreate}
							>
								<Button
									type="button"
									className="h-9 rounded-lg px-4 text-[12px]"
								>
									إنشاء محتوى
								</Button>
							</CreateContentMenu>
						)}
					</div>
				) : view === "grid" ? (
					<div className="grid grid-cols-1 gap-3 px-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{filtered.map((course) => (
							<CourseCard
								key={course.id}
								course={course}
								onDelete={() => setDeleting(course)}
								onEdit={() => handleEdit(course)}
							/>
						))}
					</div>
				) : (
					<CourseTable
						courses={filtered}
						isLoading={false}
						onDelete={setDeleting}
						onEdit={handleEdit}
						onOpen={handleOpen}
						onDuplicate={handleDuplicate}
						onDisable={setDisabling}
						onEnable={setEnabling}
						onAssign={setAssigning}
						onRowOpen={(c) =>
							navigate({
								to: "/services/training/course/$courseId",
								params: { courseId: c.id },
							})
						}
						cloningCourseId={cloning?.id ?? null}
					/>
				)}
			</div>

			<DeleteCourseDialog
				course={deleting}
				onClose={() => setDeleting(null)}
				onConfirm={() => {
					if (deleting) deleteCourse(deleting.id);
					setDeleting(null);
				}}
			/>

			<DisableCourseDialog
				course={disabling}
				onClose={() => setDisabling(null)}
				onConfirm={() => {
					if (disabling) archiveCourse(disabling.id);
					setDisabling(null);
				}}
			/>

			<EnableCourseDialog
				course={enabling}
				onClose={() => setEnabling(null)}
				onConfirm={() => {
					if (enabling) restoreCourse(enabling.id);
					setEnabling(null);
				}}
			/>

			<DeleteQuizDialog
				quiz={deletingQuiz}
				onClose={() => setDeletingQuiz(null)}
				onConfirm={() => {
					if (deletingQuiz) deleteQuiz(deletingQuiz.id);
					setDeletingQuiz(null);
				}}
			/>

			<UnpublishQuizDialog
				quiz={unpublishingQuiz}
				onClose={() => setUnpublishingQuiz(null)}
				onConfirm={() => {
					if (unpublishingQuiz) unpublishQuiz(unpublishingQuiz.id);
					setUnpublishingQuiz(null);
				}}
			/>

			<QuizDetailsSheet
				quizId={preStartQuizId}
				onClose={() => setPreStartQuizId(null)}
				onStart={(id) => {
					setPreStartQuizId(null);
					setPlayingQuizId(id);
				}}
			/>

			<QuizPlayerDialog
				open={!!playingQuizId}
				quizId={playingQuizId}
				onClose={() => setPlayingQuizId(null)}
			/>

			<QuizManagerDialog
				open={!!resultsQuizId}
				quizId={resultsQuizId}
				onClose={() => setResultsQuizId(null)}
			/>
		</div>
	);
}
