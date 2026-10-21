import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { AddQuizSheet } from "@/features/services/training/components/add-quiz-sheet";
import { DeleteQuizDialog } from "@/features/services/training/components/delete-quiz-dialog";
import { QuizCard } from "@/features/services/training/components/quiz-card";
import { QuizDetailsSheet } from "@/features/services/training/components/quiz-details-sheet";
import { QuizManagerDialog } from "@/features/services/training/components/quiz-manager-dialog";
import { QuizPlayerDialog } from "@/features/services/training/components/quiz-player-dialog";
import { QuizTable } from "@/features/services/training/components/quiz-table";
import { UnpublishQuizDialog } from "@/features/services/training/components/unpublish-quiz-dialog";
import {
	type CoursesView,
	ViewOptionsMenu,
} from "@/features/services/training/components/view-options-menu";
import {
	useDeleteQuiz,
	usePublishQuiz,
	useQuizStats,
	useQuizzes,
	useUnpublishQuiz,
} from "@/features/services/training/hooks/use-quizzes";
import type { QuizListItemResponse, QuizStatsResponse } from "@/server/quizzes/quizzes.type";

const buildQuizStats = (s?: QuizStatsResponse) => [
	{ title: "إجمالي التقييمات", value: s?.total ?? 0, tooltip: "العدد الكلي للتقييمات" },
	{ title: "منشورة", value: s?.published ?? 0, tooltip: "التقييمات المنشورة" },
	{ title: "مسودّات", value: s?.draft ?? 0, tooltip: "التقييمات قيد الإعداد" },
];

export function QuizzesView() {
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
	const [preStartQuizId, setPreStartQuizId] = useState<string | null>(null);
	const [unpublishingQuiz, setUnpublishingQuiz] = useState<QuizListItemResponse | null>(null);

	const [search, setSearch] = useState("");
	const [view, setView] = useState<CoursesView>("list");
	const [oldestFirst, setOldestFirst] = useState(false);

	const openQuizCreate = () => {
		setQuizEditId(null);
		setQuizAddOpen(true);
	};

	const handleQuizEdit = (quiz: QuizListItemResponse) => {
		setQuizEditId(quiz.id);
		setQuizAddOpen(true);
	};

	const handleQuizPublish = async (quiz: QuizListItemResponse) => {
		try {
			await publishQuiz(quiz.id);
			toast.success(`تم نشر التقييم «${quiz.title}»`);
		} catch {
			toast.error("تعذّر نشر التقييم");
		}
	};

	const handleQuizUnpublish = (quiz: QuizListItemResponse) => {
		setUnpublishingQuiz(quiz);
	};

	const confirmUnpublish = async () => {
		if (!unpublishingQuiz) return;
		try {
			await unpublishQuiz(unpublishingQuiz.id);
		} catch {
			// الخطأ يُعرض عبر toast.promise في useUnpublishQuiz
		} finally {
			setUnpublishingQuiz(null);
		}
	};

	const confirmDelete = async () => {
		if (!deletingQuiz) return;
		try {
			await deleteQuiz(deletingQuiz.id);
		} catch {
			// الخطأ يُعرض عبر toast.promise في useDeleteQuiz
		} finally {
			setDeletingQuiz(null);
		}
	};

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
			<Stats
				className="grid-cols-3 gap-3 px-3"
				stats={buildQuizStats(quizStats)}
				variant="compact"
			/>

			<TableToolbar
				className="border-y"
				searchPlaceholder="ابحث عن اسم التقييم / الرمز..."
				searchClassName="w-[320px]"
				searchValue={search}
				onSearchChange={setSearch}
				showFilter={false}
				showExport={false}
				showView={false}
				leftExtra={
					<ViewOptionsMenu
						view={view}
						onViewChange={setView}
						oldestFirst={oldestFirst}
						onOldestFirstChange={setOldestFirst}
					/>
				}
				actions={
					<Button
						type="button"
						size="sm"
						className="h-8 gap-1.5 text-xs font-bold"
						onClick={openQuizCreate}
					>
						<IconPlus className="size-3.5" />
						تقييم جديد
					</Button>
				}
			/>

			<AddQuizSheet
				open={quizAddOpen}
				onClose={() => setQuizAddOpen(false)}
				editQuizId={quizEditId}
			/>

			<div className="min-h-0 flex-1 overflow-auto bg-background py-3">
				{quizzesLoading ? (
					<p className="px-3 py-16 text-center text-[13px] text-muted-foreground">
						جارٍ تحميل التقييمات...
					</p>
				) : filteredQuizzes.length === 0 ? (
					<div className="flex flex-col items-center gap-3 px-3 py-16 text-center">
						<h2 className="text-[14px] font-bold text-foreground">
							{quizzes.length === 0
								? "لا يوجد أي تقييمات حتى الآن"
								: "لا توجد تقييمات مطابقة"}
						</h2>
						<p className="max-w-[280px] text-[12px] text-muted-foreground">
							أنشئ تقييماً لقياس معرفة موظفيك ورصد نتائجهم.
						</p>
						{quizzes.length === 0 && (
							<Button
								type="button"
								onClick={openQuizCreate}
								className="h-9 rounded-lg px-4 text-[12px]"
							>
								إنشاء تقييم
							</Button>
						)}
					</div>
				) : view === "grid" ? (
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
						onRowOpen={(q) => setResultsQuizId(q.id)}
					/>
				)}
			</div>

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

			<UnpublishQuizDialog
				quiz={unpublishingQuiz}
				onClose={() => setUnpublishingQuiz(null)}
				onConfirm={confirmUnpublish}
			/>

			<DeleteQuizDialog
				quiz={deletingQuiz}
				onClose={() => setDeletingQuiz(null)}
				onConfirm={confirmDelete}
			/>
		</div>
	);
}
