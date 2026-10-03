import { IconCheck, IconClock, IconRefresh, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { CompletionRing } from "@/components/ui/completion-ring";
import { cn } from "@/lib/utils";
import type {
	AttemptResultResponse,
	ReviewQuestion,
} from "@/server/quiz-attempts/quiz-attempts.type";

const TYPE_LABEL: Record<ReviewQuestion["answerType"], string> = {
	SINGLE: "اختيار واحد",
	MULTIPLE: "متعدد",
	TEXT: "نصّي",
};

// بطاقة مراجعة سؤال — تُظهر إجابة الموظف، وعند كشف الإجابات تُبرز الصحيحة
function ReviewCard({ q, index }: { q: ReviewQuestion; index: number }) {
	// revealed = الخيارات تحمل علم correct (الخادم يكشفها فقط عند showAnswers واكتمال التصحيح)
	const revealed = q.options.some((o) => o.correct !== undefined);
	const state = q.pending ? "pending" : q.isCorrect === true ? "correct" : "wrong";

	return (
		<div className="flex flex-col gap-2 rounded-[8px] border border-[#E5E5E5] p-3">
			<div className="flex items-start justify-between gap-2">
				<span className="text-[13px] font-semibold text-[#08090A]">
					{index + 1}. {q.text}
				</span>
				<span
					className={cn(
						"flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
						state === "correct" && "bg-[#008A2E]/10 text-[#008A2E]",
						state === "wrong" && "bg-destructive/10 text-destructive",
						state === "pending" && "bg-[#F59E0B]/10 text-[#B45309]",
					)}
				>
					{state === "correct" && <IconCheck className="size-3" />}
					{state === "wrong" && <IconX className="size-3" />}
					{state === "pending" && <IconClock className="size-3" />}
					{state === "pending" ? "بانتظار التصحيح" : `${q.awardedPoints ?? 0}/${q.points}`}
				</span>
			</div>
			<span className="text-[10px] text-[#9B9B9D]">{TYPE_LABEL[q.answerType]}</span>

			{q.answerType === "TEXT" ? (
				<div className="rounded-[6px] bg-[#FAFAFC] px-2.5 py-1.5 text-[12px] text-[#08090A]">
					{q.myAnswer.answerText?.trim() || (
						<span className="text-[#9B9B9D]">لا توجد إجابة</span>
					)}
				</div>
			) : (
				<div className="flex flex-col gap-1">
					{q.options.map((o, i) => {
						const chosen = q.myAnswer.selectedOptions.includes(i);
						const isCorrect = o.correct === true;
						return (
							<div
								key={`${o.text}-${i}`}
								className={cn(
									"flex items-center gap-2 rounded-[6px] border px-2.5 py-1.5 text-[12px]",
									revealed && isCorrect
										? "border-[#008A2E]/40 bg-[#008A2E]/5 text-[#08090A]"
										: chosen && revealed && !isCorrect
											? "border-destructive/40 bg-destructive/5 text-[#08090A]"
											: "border-[#EDEDF2] text-[#6B6B67]",
								)}
							>
								<span
									className={cn(
										"flex size-4 shrink-0 items-center justify-center rounded-full border",
										chosen
											? "border-primary bg-primary text-white"
											: "border-[#D1D1DB] bg-white",
									)}
								>
									{chosen && <IconCheck className="size-2.5" />}
								</span>
								<span className="flex-1">{o.text}</span>
								{revealed && isCorrect && (
									<span className="text-[10px] font-semibold text-[#008A2E]">الصحيحة</span>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

// شاشة نتيجة الاختبار — الدرجة، ناجح/راسب، المحاولات، ومراجعة سؤال-بسؤال عند إتاحتها.
export function QuizResultView({
	result,
	onRetry,
	canRetry,
}: {
	result: AttemptResultResponse;
	onRetry?: () => void;
	canRetry?: boolean;
}) {
	const { attempt, quiz, attemptsUsed, review } = result;
	const pending = attempt.gradingStatus === "NEEDS_MANUAL";
	const passed = attempt.passed === true;
	const score = attempt.scorePercent ?? 0;

	const ringColor = pending ? "#B45309" : passed ? "#16A34A" : "#DC2626";

	return (
		<div className="flex flex-col gap-4">
			{/* الملخّص */}
			<div className="flex items-center gap-4 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFC] p-4">
				<CompletionRing
					value={score}
					size={72}
					strokeWidth={6}
					color={ringColor}
				/>
				<div className="flex flex-1 flex-col gap-1">
					<span className="text-[15px] font-bold text-[#08090A]">{quiz.title}</span>
					{pending ? (
						<span className="flex w-fit items-center gap-1.5 rounded-md bg-[#F59E0B]/10 px-2 py-0.5 text-[12px] font-semibold text-[#B45309]">
							<IconClock className="size-3.5" />
							بانتظار تصحيح الأسئلة النصّية — النتيجة مبدئية
						</span>
					) : (
						<span
							className={cn(
								"flex w-fit items-center gap-1.5 rounded-md px-2 py-0.5 text-[12px] font-semibold",
								passed
									? "bg-[#008A2E]/10 text-[#008A2E]"
									: "bg-destructive/10 text-destructive",
							)}
						>
							{passed ? <IconCheck className="size-3.5" /> : <IconX className="size-3.5" />}
							{passed ? "ناجح" : "راسب"} — الحدّ {quiz.passMark}%
						</span>
					)}
					<span className="text-[11px] text-[#9B9B9D]">
						المحاولة {attempt.attemptNo}
						{quiz.maxAttempts ? ` من ${quiz.maxAttempts}` : ""} • استُخدم {attemptsUsed} محاولة
					</span>
				</div>
				{canRetry && onRetry && (
					<Button
						type="button"
						variant="outline"
						onClick={onRetry}
						className="h-9 gap-1.5 text-[12px]"
					>
						<IconRefresh className="size-4" />
						إعادة المحاولة
					</Button>
				)}
			</div>

			{/* المراجعة سؤال-بسؤال */}
			<div className="flex flex-col gap-2">
				<span className="text-[12px] font-bold text-[#08090A]">مراجعة الإجابات</span>
				{review.map((q, i) => (
					<ReviewCard
						key={q.id}
						q={q}
						index={i}
					/>
				))}
			</div>
		</div>
	);
}
