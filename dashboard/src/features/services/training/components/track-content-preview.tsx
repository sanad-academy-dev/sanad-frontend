import {
	IconArticle,
	IconAward,
	IconBook2,
	IconCertificate,
	IconCheck,
	IconClock,
	IconFileDescription,
	IconFileText,
	IconFolder,
	IconHeadphones,
	IconListCheck,
	IconPlus,
	IconRosetteDiscountCheck,
	IconRoute,
	IconTrash,
	IconUser,
	IconUsers,
	IconVideo,
} from "@tabler/icons-react";
import { useMemo } from "react";
import { Spinner } from "@/components/common/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	INITIAL_RESOURCES,
	type LibraryItem,
} from "@/features/services/training/components/my-library-view";
import { useCourse } from "@/features/services/training/hooks/use-courses";
import { useQuiz } from "@/features/services/training/hooks/use-quizzes";
import {
	type TrainingPage,
	useTrainingPages,
} from "@/features/services/training/hooks/use-training-pages";
import {
	resolveCourseAppearance,
	stripSystemTags,
} from "@/features/services/training/utils/course-meta";
import { resolveCover } from "@/features/services/training/utils/cover";
import { cn } from "@/lib/utils";
import type { QuizListItemResponse } from "@/server/quizzes/quizzes.type";
import { CoursePageContent } from "./course-page-content";
import { formatArabicDate, formatLessonsCount, toArabicNumerals } from "./track-courses-step";
import type { TrackStageItem } from "./track-structure-step";

type QuizOptionPreview = { id?: string; text: string; isCorrect?: boolean };
const toQuizOptions = (value: unknown): QuizOptionPreview[] =>
	Array.isArray(value)
		? value.filter(
				(option): option is QuizOptionPreview =>
					typeof option === "object" &&
					option !== null &&
					"text" in option &&
					typeof option.text === "string",
				)
		: [];

export interface PreviewTarget {
	type: "COURSE" | "QUIZ" | "PAGE" | "LIBRARY";
	id: string;
}

// أيقونة نوع الدرس
function getLessonIcon(type?: string) {
	switch (type) {
		case "VIDEO":
			return IconVideo;
		case "AUDIO":
			return IconHeadphones;
		case "PAGE":
			return IconArticle;
		case "QUIZ":
			return IconListCheck;
		default:
			return IconFileText;
	}
}

// تنسيق مدة الدرس بالثواني
function formatSeconds(secs?: number | null) {
	if (!secs || secs <= 0) return null;
	const mins = Math.round(secs / 60);
	if (mins < 1) return "أقل من دقيقة";
	if (mins === 1) return "دقيقة واحدة";
	if (mins === 2) return "دقيقتان";
	if (mins <= 10) return `${toArabicNumerals(mins)} دقائق`;
	return `${toArabicNumerals(mins)} دقيقة`;
}

// ─── 1. معاينة الدورة التدريبية الحقيقية ───────────────────────────────────────
export function CourseLivePreview({
	courseId,
	fallbackCourse,
	isSelected,
	onToggle,
}: {
	courseId: string;
	fallbackCourse?: {
		name: string;
		category?: string;
		code?: string;
		durationText?: string | null;
		coverKey?: string | null;
		description?: string;
	};
	isSelected?: boolean;
	onToggle?: () => void;
}) {
	const { course, isLoading } = useCourse(courseId);

	const title = course?.name || fallbackCourse?.name || "دورة تدريبية";
	const category = course?.category || fallbackCourse?.category || "عام";
	const code = course?.code || fallbackCourse?.code || "";
	const rawDesc = course?.description || fallbackCourse?.description || "";
	const cleanDesc = stripSystemTags(rawDesc);
	const { Icon: CourseIcon, colorClass } = resolveCourseAppearance(rawDesc);
	const cover = resolveCover(course?.coverKey || fallbackCourse?.coverKey);

	// حساب إجمالي الدروس
	const units = course?.units || [];
	const totalLessons = units.reduce(
		(sum, u) => sum + ((u as { lessons?: unknown[] }).lessons?.length || 0),
		0,
	);

	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 text-right">
			{/* بطاقة الترويسة العلوية للدورة */}
			<div className="rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs space-y-3">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-start gap-3 min-w-0">
						{/* غلاف الدورة */}
						{cover?.type === "image" ? (
							<div className="size-12 rounded-xl overflow-hidden shrink-0 border border-border bg-muted">
								<img
									src={cover.url}
									alt={title}
									className="size-full object-cover"
								/>
							</div>
						) : cover?.type === "color" ? (
							<div
								className="size-12 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-2xs"
								style={{ backgroundColor: cover.color }}
							>
								{title.slice(0, 2)}
							</div>
						) : (
							<div
								className={cn(
									"size-12 rounded-xl shrink-0 flex items-center justify-center border shadow-2xs",
									colorClass,
								)}
							>
								<CourseIcon className="size-6 stroke-[1.8]" />
							</div>
						)}

						<div className="min-w-0 space-y-1">
							<div className="flex items-center gap-2 flex-wrap">
								<Badge
									variant="secondary"
									className="text-[10px] h-4.5 px-2 bg-purple-100/70 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-semibold"
								>
									دورة تدريبية
								</Badge>
								{code && (
									<span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
										{code}
									</span>
								)}
								<Badge
									variant="outline"
									className="text-[10px] h-4.5 px-2 text-muted-foreground"
								>
									{category}
								</Badge>
							</div>

							<h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
								{title}
							</h3>
						</div>
					</div>

					{/* زر الإضافة/الإزالة للمسار إن وجد */}
					{onToggle && (
						<Button
							type="button"
							size="sm"
							variant={isSelected ? "outline" : "default"}
							onClick={onToggle}
							className={cn(
								"h-8 px-3 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-all gap-1.5",
								isSelected
									? "border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
									: "bg-purple-600 hover:bg-purple-700 text-white shadow-2xs",
							)}
						>
							{isSelected ? (
								<>
									<IconTrash className="size-3.5" />
									<span>إزالة من المسار</span>
								</>
							) : (
								<>
									<IconPlus className="size-3.5 stroke-[2.5]" />
									<span>إضافة للمسار</span>
								</>
							)}
						</Button>
					)}
				</div>

				{/* شريط الإحصائيات السريعة */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<IconClock className="size-3.5 text-purple-600" />
						<span>
							المدة:{" "}
							<b className="text-foreground">
								{course?.estimatedDurationWeeks
									? `${toArabicNumerals(course.estimatedDurationWeeks)} أسابيع`
									: fallbackCourse?.durationText || "محددة"}
							</b>
						</span>
					</div>

					<div className="flex items-center gap-1.5">
						<IconBook2 className="size-3.5 text-purple-600" />
						<span>
							الدروس:{" "}
							<b className="text-foreground">
								{formatLessonsCount(totalLessons)}
							</b>
						</span>
					</div>

					<div className="flex items-center gap-1.5">
						<IconRosetteDiscountCheck className="size-3.5 text-purple-600" />
						<span>
							التكلفة:{" "}
							<b className="text-foreground">
								{course?.trainingCost && course.trainingCost > 0
									? `${toArabicNumerals(course.trainingCost)} ج.م`
									: "مجانية"}
							</b>
						</span>
					</div>

					<div className="flex items-center gap-1.5">
						<IconAward className="size-3.5 text-purple-600" />
						<span>
							الشهادة:{" "}
							<b className="text-foreground">
								{course?.completionSettings?.certificateEnabled ? "معتمدة" : "بدون شهادة"}
							</b>
						</span>
					</div>
				</div>
			</div>

			{/* نبذة عن الدورة */}
			{cleanDesc && (
				<div className="rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs space-y-1.5">
					<h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
						<IconFileText className="size-3.5 text-purple-600" />
						<span>نبذة عن محتوى الدورة</span>
					</h4>
					<p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
						{cleanDesc}
					</p>
				</div>
			)}

			{/* فصول ومحتوى الدورة الحقيقي (Units & Lessons) */}
			<div className="rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs space-y-2.5">
				<div className="flex items-center justify-between">
					<h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
						<IconBook2 className="size-3.5 text-purple-600" />
						<span>منهج وفصول الدورة التدريبية</span>
					</h4>
					<span className="text-[11px] font-semibold text-muted-foreground">
						{toArabicNumerals(units.length)} وحدات تدريبية
					</span>
				</div>

				{isLoading ? (
					<Spinner
						containerClassName="py-8 min-h-0"
						className="size-6 text-primary"
					/>
				) : units.length === 0 ? (
					<div className="rounded-lg border border-dashed border-border/80 p-5 text-center text-xs text-muted-foreground">
						لم يتم إضافة فصول أو دروس لهذه الدورة حتى الآن.
					</div>
				) : (
					<div className="space-y-2">
						{units.map((unit, uIdx) => {
							const lessons =
								(
									unit as {
										lessons?: Array<{
											id: string;
											title: string;
											type?: string;
											durationSeconds?: number | null;
										}>;
									}
								).lessons || [];
							return (
								<div
									key={unit.id}
									className="rounded-lg border border-border/60 bg-muted/20 overflow-hidden"
								>
									<div className="px-3 py-2 bg-muted/40 border-b border-border/40 flex items-center justify-between text-xs font-bold text-foreground">
										<div className="flex items-center gap-2">
											<span className="size-5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-600 text-[10px] font-bold flex items-center justify-center">
												{toArabicNumerals(uIdx + 1)}
											</span>
											<span>{unit.title}</span>
										</div>
										<Badge
											variant="secondary"
											className="text-[10px] h-4 px-1.5 font-normal"
										>
											{formatLessonsCount(lessons.length)}
										</Badge>
									</div>

									{lessons.length === 0 ? (
										<div className="p-2.5 text-center text-[11px] text-muted-foreground">
											لا توجد دروس في هذه الوحدة
										</div>
									) : (
										<div className="divide-y divide-border/30">
											{lessons.map((lesson) => {
												const LessonIcon = getLessonIcon(lesson.type);
												const duration = formatSeconds(lesson.durationSeconds);
												return (
													<div
														key={lesson.id}
														className="px-3 py-2 flex items-center justify-between gap-2 text-xs hover:bg-muted/30 transition-colors"
													>
														<div className="flex items-center gap-2 min-w-0">
															<LessonIcon className="size-3.5 text-purple-600/80 shrink-0" />
															<span className="truncate text-foreground font-medium">
																{lesson.title}
															</span>
														</div>
														{duration && (
															<span className="text-[10px] text-muted-foreground shrink-0 bg-background px-1.5 py-0.5 rounded border border-border/60">
																{duration}
															</span>
														)}
													</div>
												);
											})}
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* المدربون المشرفون (إن وجدوا) */}
			{course?.trainers && course.trainers.length > 0 && (
				<div className="rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs space-y-2">
					<h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
						<IconUsers className="size-3.5 text-purple-600" />
						<span>المدربون المشرفون على الدورة</span>
					</h4>
					<div className="flex flex-wrap gap-2">
						{course.trainers.map((t) => (
							<div
								key={t.staffId}
								className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/70 bg-muted/30 text-xs font-medium"
							>
								<IconUser className="size-3 text-muted-foreground" />
								<span>{t.staff?.name || "مدرب"}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

// ─── 2. معاينة التقييم والاختبار الحقيقي ───────────────────────────────────────
export function QuizLivePreview({
	quizId,
	fallbackQuiz,
	isSelected,
	onToggle,
}: {
	quizId: string;
	fallbackQuiz?: Partial<QuizListItemResponse>;
	isSelected?: boolean;
	onToggle?: () => void;
}) {
	const { quiz, isLoading } = useQuiz(quizId);

	const title = quiz?.title || fallbackQuiz?.title || "تقييم واختبار";
	const code = quiz?.code || fallbackQuiz?.code || "";
	const description = stripSystemTags(quiz?.description || "");
	const timeLimit = quiz?.timeLimitMinutes || fallbackQuiz?.timeLimitMinutes;
	const passMark = quiz?.passMark ?? fallbackQuiz?.passMark;
	const questions = quiz?.questions || [];

	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 text-right">
			{/* ترويسة التقييم */}
			<div className="rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs space-y-3">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-start gap-3 min-w-0">
						<div className="size-12 rounded-xl shrink-0 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/40">
							<IconListCheck className="size-6 stroke-[1.8]" />
						</div>

						<div className="min-w-0 space-y-1">
							<div className="flex items-center gap-2 flex-wrap">
								<Badge
									variant="secondary"
									className="text-[10px] h-4.5 px-2 bg-amber-100/70 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-semibold"
								>
									تقييم واختبار
								</Badge>
								{code && (
									<span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
										{code}
									</span>
								)}
								<Badge
									variant="outline"
									className="text-[10px] h-4.5 px-2 text-muted-foreground"
								>
									{toArabicNumerals(questions.length || fallbackQuiz?._count?.questions || 0)}{" "}
									سؤال
								</Badge>
							</div>

							<h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
								{title}
							</h3>
						</div>
					</div>

					{/* زر الإضافة/الإزالة إن وجد */}
					{onToggle && (
						<Button
							type="button"
							size="sm"
							variant={isSelected ? "outline" : "default"}
							onClick={onToggle}
							className={cn(
								"h-8 px-3 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-all gap-1.5",
								isSelected
									? "border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
									: "bg-purple-600 hover:bg-purple-700 text-white shadow-2xs",
							)}
						>
							{isSelected ? (
								<>
									<IconTrash className="size-3.5" />
									<span>إزالة من المسار</span>
								</>
							) : (
								<>
									<IconPlus className="size-3.5 stroke-[2.5]" />
									<span>إضافة للمسار</span>
								</>
							)}
						</Button>
					)}
				</div>

				{/* مؤشرات التقييم */}
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<IconClock className="size-3.5 text-amber-600" />
						<span>
							الوقت:{" "}
							<b className="text-foreground">
								{timeLimit ? `${toArabicNumerals(timeLimit)} دقيقة` : "بدون وقت محدد"}
							</b>
						</span>
					</div>

					<div className="flex items-center gap-1.5">
						<IconRosetteDiscountCheck className="size-3.5 text-amber-600" />
						<span>
							درجة النجاح:{" "}
							<b className="text-foreground">
								{passMark ? `${toArabicNumerals(passMark)}%` : "غير محددة"}
							</b>
						</span>
					</div>

					<div className="flex items-center gap-1.5">
						<IconCertificate className="size-3.5 text-amber-600" />
						<span>
							إجمالي الأسئلة:{" "}
							<b className="text-foreground">
								{toArabicNumerals(questions.length || fallbackQuiz?._count?.questions || 0)}
							</b>
						</span>
					</div>
				</div>
			</div>

			{/* نبذة عن التقييم */}
			{description && (
				<div className="rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs space-y-1.5">
					<h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
						<IconFileText className="size-3.5 text-amber-600" />
						<span>تعليمات التقييم</span>
					</h4>
					<p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
						{description}
					</p>
				</div>
			)}

			{/* بنك الأسئلة الحقيقي */}
			<div className="rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs space-y-3">
				<div className="flex items-center justify-between">
					<h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
						<IconListCheck className="size-3.5 text-amber-600" />
						<span>أسئلة الاختبار الحقيقية</span>
					</h4>
					<span className="text-[11px] font-semibold text-muted-foreground">
						{toArabicNumerals(questions.length)} سؤال
					</span>
				</div>

				{isLoading ? (
					<Spinner
						containerClassName="py-8 min-h-0"
						className="size-6 text-primary"
					/>
				) : questions.length === 0 ? (
					<div className="rounded-lg border border-dashed border-border/80 p-5 text-center text-xs text-muted-foreground">
						لم يتم إضافة أسئلة لهذا التقييم حتى الآن.
					</div>
				) : (
					<div className="space-y-3">
						{questions.map((q, qIdx) => (
							<div
								key={q.id}
								className="rounded-lg border border-border/70 bg-muted/15 p-3 space-y-2 text-xs"
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex items-start gap-2">
										<span className="size-5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0">
											{toArabicNumerals(qIdx + 1)}
										</span>
										<span className="font-semibold text-foreground leading-relaxed">
											{q.text}
										</span>
									</div>
									{q.points && (
										<span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/40 shrink-0">
											{toArabicNumerals(q.points)} درجات
										</span>
									)}
								</div>

								{/* خيارات الإجابة */}
								{toQuizOptions(q.options).length > 0 && (
									<div className="space-y-1.5 pt-1 pr-6">
										{toQuizOptions(q.options).map((opt, oIdx) => (
											<div
												key={opt.id || oIdx}
												className={cn(
													"flex items-center justify-between px-2.5 py-1.5 rounded-md border text-[11px] transition-colors",
													opt.isCorrect
														? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium"
														: "border-border/60 bg-card text-muted-foreground",
												)}
											>
												<span>{opt.text}</span>
												{opt.isCorrect && (
													<span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
														<IconCheck className="size-3 stroke-[2.5]" />
														<span>إجابة صحيحة</span>
													</span>
												)}
											</div>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

// ─── 3. معاينة الصفحة والمستند الحقيقي من قاعدة البيانات ────────────────────────
export function PageLivePreview({
	page,
	isSelected,
	onToggle,
}: {
	page: TrainingPage;
	isSelected?: boolean;
	onToggle?: () => void;
}) {
	const contentStr = useMemo(() => {
		if (typeof page.content === "string") return page.content;
		if (page.content) return JSON.stringify(page.content);
		return "";
	}, [page.content]);

	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 text-right">
			{/* شريط المعاينة المباشرة الحية لمحرر BlockNote */}
			<div className="rounded-xl border border-border/80 bg-card p-2.5 px-3.5 shadow-2xs flex items-center justify-between gap-2 text-xs">
				<div className="flex items-center gap-2">
					<span className="flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-400">
						<span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
						<span>معاينة مباشرة حية</span>
					</span>
					<span className="text-[10px] text-muted-foreground hidden sm:inline">
						التغييرات تنعكس مباشرة في المعاينة
					</span>
				</div>

				<Badge
					variant="outline"
					className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 flex items-center gap-1 font-semibold"
				>
					<IconFileText className="size-3 text-purple-600" />
					<span>محرر الكتل والمحتوى (BlockNote)</span>
				</Badge>
			</div>

			{/* ترويسة الصفحة */}
			<div className="rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs space-y-3">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-start gap-3 min-w-0">
						<div className="size-12 rounded-xl shrink-0 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200/60 dark:border-sky-800/40">
							<IconFileText className="size-6 stroke-[1.8]" />
						</div>

						<div className="min-w-0 space-y-1">
							<div className="flex items-center gap-2 flex-wrap">
								<Badge
									variant="secondary"
									className="text-[10px] h-4.5 px-2 bg-sky-100/70 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-semibold"
								>
									صفحة ومستند
								</Badge>
								<Badge
									variant="outline"
									className="text-[10px] h-4.5 px-2 text-muted-foreground"
								>
									{page.category || "عام"}
								</Badge>
								<span
									className={cn(
										"text-[10px] px-1.5 py-0.5 rounded font-bold",
										page.status === "PUBLISHED"
											? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
											: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
									)}
								>
									{page.status === "PUBLISHED" ? "منشورة" : "مسودة"}
								</span>
							</div>

							<h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
								{page.title}
							</h3>
						</div>
					</div>

					{/* زر الإضافة/الإزالة إن وجد */}
					{onToggle && (
						<Button
							type="button"
							size="sm"
							variant={isSelected ? "outline" : "default"}
							onClick={onToggle}
							className={cn(
								"h-8 px-3 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-all gap-1.5",
								isSelected
									? "border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
									: "bg-purple-600 hover:bg-purple-700 text-white shadow-2xs",
							)}
						>
							{isSelected ? (
								<>
									<IconTrash className="size-3.5" />
									<span>إزالة من المسار</span>
								</>
							) : (
								<>
									<IconPlus className="size-3.5 stroke-[2.5]" />
									<span>إضافة للمسار</span>
								</>
							)}
						</Button>
					)}
				</div>

				<div className="flex items-center gap-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<IconClock className="size-3.5 text-sky-600" />
						<span>آخر تحديث: {formatArabicDate(page.updatedAt)}</span>
					</div>
					{page.viewsCount !== undefined && (
						<div className="flex items-center gap-1.5">
							<IconUsers className="size-3.5 text-sky-600" />
							<span>{toArabicNumerals(page.viewsCount)} مشاهدة</span>
						</div>
					)}
				</div>
			</div>

			{/* موجز الصفحة */}
			{page.summary && (
				<div className="rounded-xl border border-sky-200/60 dark:border-sky-900/40 bg-sky-50/40 dark:bg-sky-950/20 p-3.5 text-xs leading-relaxed text-foreground space-y-1">
					<span className="font-bold text-sky-700 dark:text-sky-300 block">
						وصف وموجز الصفحة:
					</span>
					<p className="text-muted-foreground leading-relaxed">{page.summary}</p>
				</div>
			)}

			{/* المعاينة الحية لمحتوى BlockNote المحفوظ في قاعدة البيانات */}
			<div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-2xs space-y-3">
				<div className="flex items-center justify-between border-b border-border/60 pb-2.5">
					<h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
						<IconFileDescription className="size-3.5 text-sky-600" />
						<span>محتوى الصفحة الفعلي (BlockNote)</span>
					</h4>
					<span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
						معاينة حية مباشرة
					</span>
				</div>

				{contentStr ? (
					<div className="min-h-[200px]">
						<CoursePageContent content={contentStr} />
					</div>
				) : (
					<div className="py-10 text-center text-xs text-muted-foreground">
						لم يتم كتابة أي محتوى تفصيلي في هذه الصفحة حتى الآن.
					</div>
				)}
			</div>
		</div>
	);
}

// ─── 4. معاينة مورد المكتبة ───────────────────────────────────────────────────
export function LibraryLivePreview({
	item,
	isSelected,
	onToggle,
}: {
	item: LibraryItem;
	isSelected?: boolean;
	onToggle?: () => void;
}) {
	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 text-right">
			<div className="rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs space-y-3">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-start gap-3 min-w-0">
						<div className="size-12 rounded-xl shrink-0 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200/60 dark:border-teal-800/40">
							<IconFolder className="size-6 stroke-[1.8]" />
						</div>

						<div className="min-w-0 space-y-1">
							<div className="flex items-center gap-2 flex-wrap">
								<Badge
									variant="secondary"
									className="text-[10px] h-4.5 px-2 bg-teal-100/70 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-semibold"
								>
									مورد مكتبة
								</Badge>
								<Badge
									variant="outline"
									className="text-[10px] h-4.5 px-2 text-muted-foreground"
								>
									{item.categoryLabel}
								</Badge>
								<span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">
									{item.type}
								</span>
							</div>

							<h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
								{item.title}
							</h3>
						</div>
					</div>

					{onToggle && (
						<Button
							type="button"
							size="sm"
							variant={isSelected ? "outline" : "default"}
							onClick={onToggle}
							className={cn(
								"h-8 px-3 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-all gap-1.5",
								isSelected
									? "border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
									: "bg-purple-600 hover:bg-purple-700 text-white shadow-2xs",
							)}
						>
							{isSelected ? (
								<>
									<IconTrash className="size-3.5" />
									<span>إزالة من المسار</span>
								</>
							) : (
								<>
									<IconPlus className="size-3.5 stroke-[2.5]" />
									<span>إضافة للمسار</span>
								</>
							)}
						</Button>
					)}
				</div>

				<div className="flex items-center gap-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
					<span>
						المؤلف: <b className="text-foreground">{item.author}</b>
					</span>
					<span>
						الحجم: <b className="text-foreground">{item.size}</b>
					</span>
				</div>
			</div>

			<div className="rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs space-y-1.5">
				<h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
					<IconFileText className="size-3.5 text-teal-600" />
					<span>وصف المورد</span>
				</h4>
				<p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
			</div>
		</div>
	);
}

// ─── 5. مكوّن المعاينة الحية المخصص لخطوة هيكل ومراحل المسار (Step 3) ────────
export function TrackStageItemLivePreview({
	item,
	onClearSelection,
	onSwitchToRoadmap,
}: {
	item: TrackStageItem;
	onClearSelection: () => void;
	onSwitchToRoadmap: () => void;
}) {
	const { pages: serverPages } = useTrainingPages();

	// استخراج المعرّف الحقيقي للعنصر
	const realId = useMemo(() => {
		if (item.courseId) return item.courseId;
		if (item.refId) return item.refId;
		return item.id.replace(/^item-(course|quiz|page|lib)-/, "");
	}, [item]);

	const isLib = item.id.startsWith("item-lib-");

	return (
		<div className="flex-1 flex flex-col min-h-0 rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
			{/* جسم المعاينة التفاعلي حسب النوع الفعلي للمادة */}
			<div className="flex-1 min-h-0 overflow-hidden flex flex-col">
				{item.type === "COURSE" && (
					<CourseLivePreview
						courseId={realId}
						fallbackCourse={{
							name: item.title,
							description: item.description,
							durationText: item.durationText,
							coverKey: item.coverKey,
						}}
					/>
				)}

				{item.type === "QUIZ" && (
					<QuizLivePreview
						quizId={realId}
						fallbackQuiz={{
							id: realId,
							title: item.title,
							code: "QZ",
							_count: { questions: item.lessonsCount || 0, assignments: 0 },
						}}
					/>
				)}

				{item.type === "PAGE" &&
					isLib &&
					(() => {
						const libItem =
							INITIAL_RESOURCES.find((r) => r.id === realId) || INITIAL_RESOURCES[0];
						return <LibraryLivePreview item={libItem} />;
					})()}

				{item.type === "PAGE" &&
					!isLib &&
					(() => {
						const cleanRealId = realId.replace(/^item-(page|course|quiz|lib)-/, "");
						const foundPage = serverPages.find(
							(p) =>
								String(p.id) === String(realId) ||
								String(p.id) === String(cleanRealId) ||
								p.title === item.title ||
								(item.title &&
									p.title &&
									(p.title.includes(item.title) || item.title.includes(p.title))),
						);
						const pageData: TrainingPage = foundPage || {
							id: realId,
							title: item.title,
							summary: item.description || "",
							content: null,
							category: "عام وتوجيهي",
							status: item.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
							readingTimeMinutes: 5,
							updatedAt: item.updatedDate || new Date().toISOString(),
							createdAt: new Date().toISOString(),
							viewsCount: 0,
						};
						return <PageLivePreview page={pageData} />;
					})()}
			</div>

			{/* تذييل الإجراءات المطابق تماماً للخطوة الثالثة */}
			<div className="p-3 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onClearSelection}
					className="text-xs text-muted-foreground hover:text-foreground h-7 cursor-pointer"
				>
					إلغاء التحديد
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onSwitchToRoadmap}
					className="text-xs text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 h-7 gap-1 cursor-pointer font-semibold"
				>
					<IconRoute className="size-3" />
					<span>عرض خارطة المسار</span>
				</Button>
			</div>
		</div>
	);
}
