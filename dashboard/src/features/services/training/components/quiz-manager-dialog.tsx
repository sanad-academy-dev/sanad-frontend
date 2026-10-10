import { IconArrowRight, IconChevronLeft, IconSparkles, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { QuizResultView } from "@/features/services/training/components/quiz-result-view";
import {
	useAttemptGrading,
	useAttemptResult,
	useGradeActions,
	useQuizManagerRoster,
} from "@/features/services/training/hooks/use-quiz-grading";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import type { QuizGradingStatus } from "@/server/quiz-attempts/quiz-attempts.type";

type View = "roster" | "grading" | "result";

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase() || "؟";

const STATUS_LABEL: Record<QuizGradingStatus, { label: string; cls: string }> = {
	AUTO_DONE: { label: "مكتمل", cls: "bg-[#008A2E]/10 text-[#008A2E]" },
	GRADED: { label: "مُصحّح", cls: "bg-[#008A2E]/10 text-[#008A2E]" },
	NEEDS_MANUAL: { label: "بانتظار التصحيح", cls: "bg-[#F59E0B]/10 text-[#B45309]" },
};

// حوار نتائج المدير — روستر الموظفين، تصحيح نصّي (يدوي + AI)، وعرض النتيجة.
export function QuizManagerDialog({
	open,
	quizId,
	onClose,
}: {
	open: boolean;
	quizId: string | null;
	onClose: () => void;
}) {
	const [view, setView] = useState<View>("roster");
	const [attemptId, setAttemptId] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			setView("roster");
			setAttemptId(null);
		}
	}, [open]);

	const { rows, isLoading } = useQuizManagerRoster(quizId, open && view === "roster");

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="flex max-h-[86vh] w-[760px] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-[12px] border-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[760px]"
			>
				<div
					dir="rtl"
					className="flex shrink-0 items-center justify-between gap-2 border-b border-[#E5E5E5] px-4 py-3"
				>
					<div className="flex items-center gap-1.5">
						{view !== "roster" && (
							<button
								type="button"
								onClick={() => setView("roster")}
								aria-label="رجوع"
								className="flex size-6 items-center justify-center rounded-[6px] text-[#6B6B67] hover:bg-muted"
							>
								<IconArrowRight className="size-4" />
							</button>
						)}
						<DialogTitle className="text-[14px] font-bold text-[#08090A]">
							{view === "grading"
								? "تصحيح الأسئلة النصّية"
								: view === "result"
									? "نتيجة الموظف"
									: "نتائج الاختبار"}
						</DialogTitle>
					</div>
					<DialogDescription className="sr-only">
						روستر نتائج الاختبار وتصحيح الأسئلة النصّية.
					</DialogDescription>
					<button
						type="button"
						onClick={onClose}
						aria-label="إغلاق"
						className="flex size-7 items-center justify-center rounded-[6px] text-[#9B9B9D] hover:bg-muted"
					>
						<IconX className="size-[15px]" />
					</button>
				</div>

				<div
					dir="rtl"
					className="min-h-0 flex-1 overflow-y-auto p-4"
				>
					{view === "roster" && (
						<RosterView
							rows={rows}
							isLoading={isLoading}
							onGrade={(id) => {
								setAttemptId(id);
								setView("grading");
							}}
							onResult={(id) => {
								setAttemptId(id);
								setView("result");
							}}
						/>
					)}
					{view === "grading" && attemptId && (
						<GradingView
							attemptId={attemptId}
							onGraded={() => setView("roster")}
						/>
					)}
					{view === "result" && attemptId && <ResultView attemptId={attemptId} />}
				</div>
			</DialogContent>
		</Dialog>
	);
}

function RosterView({
	rows,
	isLoading,
	onGrade,
	onResult,
}: {
	rows: import("@/server/quiz-attempts/quiz-attempts.type").QuizRosterRowResponse[];
	isLoading: boolean;
	onGrade: (attemptId: string) => void;
	onResult: (attemptId: string) => void;
}) {
	if (isLoading)
		return (
			<p className="py-16 text-center text-[13px] text-muted-foreground">جارٍ التحميل...</p>
		);
	if (rows.length === 0)
		return (
			<p className="py-16 text-center text-[13px] text-muted-foreground">
				لا يوجد موظفون معيّنون على هذا الاختبار بعد.
			</p>
		);

	return (
		<div className="flex flex-col gap-2">
			{rows.map((r) => (
				<div
					key={r.assignmentId}
					className="flex items-center gap-3 rounded-[8px] border border-[#E5E5E5] p-2.5"
				>
					<Avatar className="size-8">
						<AvatarImage
							src={getFileUrl(r.staff.avatar) ?? undefined}
							alt={r.staff.name}
						/>
						<AvatarFallback className="text-xs">{initials(r.staff.name)}</AvatarFallback>
					</Avatar>
					<div className="flex min-w-0 flex-1 flex-col">
						<span className="truncate text-[13px] font-semibold text-[#08090A]">
							{r.staff.name}
						</span>
						<span className="text-[11px] text-[#9B9B9D]">
							{r.staff.code} • {r.attemptsUsed} محاولة
						</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-[13px] font-bold tabular-nums text-[#08090A]">
							{r.bestScore != null ? `${r.bestScore}%` : "—"}
						</span>
						{r.gradingStatus && (
							<span
								className={cn(
									"rounded-md px-2 py-0.5 text-[10px] font-semibold",
									STATUS_LABEL[r.gradingStatus].cls,
								)}
							>
								{r.gradingStatus === "NEEDS_MANUAL"
									? STATUS_LABEL.NEEDS_MANUAL.label
									: r.passed
										? "ناجح"
										: "راسب"}
							</span>
						)}
						{r.pendingAttemptId ? (
							<Button
								type="button"
								size="sm"
								onClick={() => onGrade(r.pendingAttemptId as string)}
								className="h-7 text-[11px]"
							>
								تصحيح
							</Button>
						) : r.bestAttemptId ? (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => onResult(r.bestAttemptId as string)}
								className="h-7 text-[11px]"
							>
								عرض النتيجة
							</Button>
						) : (
							<span className="text-[11px] text-[#9B9B9D]">لم يبدأ</span>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

function GradingView({ attemptId, onGraded }: { attemptId: string; onGraded: () => void }) {
	const { grading, isLoading } = useAttemptGrading(attemptId);
	const { grade, aiSuggest } = useGradeActions();
	const [points, setPoints] = useState<Record<string, string>>({});
	const [rationale, setRationale] = useState<Record<string, string>>({});

	// تهيئة الحقول من الدرجات الحالية
	useEffect(() => {
		if (!grading) return;
		const init: Record<string, string> = {};
		for (const t of grading.textAnswers)
			init[t.questionId] = t.awardedPoints != null ? String(t.awardedPoints) : "";
		setPoints(init);
	}, [grading]);

	if (isLoading || !grading)
		return (
			<p className="py-16 text-center text-[13px] text-muted-foreground">جارٍ التحميل...</p>
		);

	if (grading.textAnswers.length === 0)
		return (
			<p className="py-16 text-center text-[13px] text-muted-foreground">
				لا توجد أسئلة نصّية في هذه المحاولة.
			</p>
		);

	const runAi = async (questionId: string, maxPts: number) => {
		try {
			const s = await aiSuggest.mutateAsync({ attemptId, questionId });
			setPoints((p) => ({ ...p, [questionId]: String(Math.min(s.suggestedPoints, maxPts)) }));
			setRationale((r) => ({ ...r, [questionId]: s.rationale }));
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	const save = () => {
		const grades = grading.textAnswers.map((t) => ({
			questionId: t.questionId,
			awardedPoints: Math.max(0, Math.min(Number(points[t.questionId] || 0), t.points)),
		}));
		toast.promise(grade.mutateAsync({ attemptId, grades }), {
			loading: "جارٍ اعتماد الدرجات...",
			success: () => {
				onGraded();
				return "تم اعتماد الدرجات";
			},
			error: (e: Error) => e.message || "تعذّر اعتماد الدرجات",
		});
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-1.5 text-[12px] text-[#6B6B67]">
				<IconChevronLeft className="size-3.5" />
				<span className="font-semibold text-[#08090A]">{grading.staffName}</span> —{" "}
				{grading.quiz.title}
			</div>

			{grading.textAnswers.map((t) => (
				<div
					key={t.questionId}
					className="flex flex-col gap-2 rounded-[8px] border border-[#E5E5E5] p-3"
				>
					<span className="text-[13px] font-semibold text-[#08090A]">{t.text}</span>

					<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
						<div className="flex flex-col gap-1">
							<span className="text-[10px] font-semibold text-[#9B9B9D]">
								الإجابة النموذجية
							</span>
							<div className="rounded-[6px] bg-[#F0FDF4] px-2.5 py-1.5 text-[12px] text-[#08090A]">
								{t.modelAnswer?.trim() || <span className="text-[#9B9B9D]">غير محددة</span>}
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-[10px] font-semibold text-[#9B9B9D]">إجابة الموظف</span>
							<div className="rounded-[6px] bg-[#FAFAFC] px-2.5 py-1.5 text-[12px] text-[#08090A]">
								{t.staffAnswer?.trim() || (
									<span className="text-[#9B9B9D]">لا توجد إجابة</span>
								)}
							</div>
						</div>
					</div>

					{rationale[t.questionId] && (
						<div className="flex items-start gap-1.5 rounded-[6px] border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[11px] text-[#08090A]">
							<IconSparkles className="mt-0.5 size-3 shrink-0 text-primary" />
							<span>اقتراح الذكاء: {rationale[t.questionId]}</span>
						</div>
					)}

					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-1.5">
							<span className="text-[11px] font-medium text-[#08090A]">الدرجة</span>
							<Input
								type="number"
								min={0}
								max={t.points}
								value={points[t.questionId] ?? ""}
								onChange={(e) => setPoints((p) => ({ ...p, [t.questionId]: e.target.value }))}
								className="h-8 w-[64px] text-[12px]"
							/>
							<span className="text-[11px] text-[#9B9B9D]">/ {t.points}</span>
						</div>
						{grading.aiAvailable && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={aiSuggest.isPending}
								onClick={() => runAi(t.questionId, t.points)}
								className="h-8 gap-1.5 text-[11px]"
							>
								<IconSparkles className="size-3.5 text-primary" />
								تصحيح بالذكاء الاصطناعي
							</Button>
						)}
					</div>
				</div>
			))}

			<div className="flex justify-start">
				<Button
					type="button"
					onClick={save}
					disabled={grade.isPending}
					className="h-9 text-[12px] font-semibold"
				>
					اعتماد الدرجات
				</Button>
			</div>
		</div>
	);
}

function ResultView({ attemptId }: { attemptId: string }) {
	const { result, isLoading } = useAttemptResult(attemptId);
	if (isLoading || !result)
		return (
			<p className="py-16 text-center text-[13px] text-muted-foreground">جارٍ التحميل...</p>
		);
	return <QuizResultView result={result} />;
}
