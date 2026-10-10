import { IconAlertTriangle, IconClock, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { QuizResultView } from "@/features/services/training/components/quiz-result-view";
import {
	type AttemptError,
	useMyQuizResult,
	useQuizPlayer,
} from "@/features/services/training/hooks/use-quiz-attempts";
import { cn } from "@/lib/utils";
import type {
	AttemptResultResponse,
	PlayerAttemptResponse,
} from "@/server/quiz-attempts/quiz-attempts.type";

type Answer = { selectedOptions?: number[]; answerText?: string };
type Phase = "loading" | "playing" | "result" | "error";

const two = (n: number) => n.toString().padStart(2, "0");
const fmtRemaining = (ms: number) => {
	const s = Math.max(0, Math.floor(ms / 1000));
	return `${two(Math.floor(s / 60))}:${two(s % 60)}`;
};

// مشغّل أداء الاختبار — يبدأ/يستأنف محاولة، يعرض الأسئلة والمؤقّت، ثم شاشة النتيجة.
// التصحيح كلّه على الخادم؛ لا تصل الإجابات الصحيحة قبل التسليم.
export function QuizPlayerDialog({
	open,
	quizId,
	onClose,
}: {
	open: boolean;
	quizId: string | null;
	onClose: () => void;
}) {
	const { start, submit } = useQuizPlayer();

	const [phase, setPhase] = useState<Phase>("loading");
	const [player, setPlayer] = useState<PlayerAttemptResponse | null>(null);
	const [answers, setAnswers] = useState<Record<string, Answer>>({});
	const [result, setResult] = useState<AttemptResultResponse | null>(null);
	const [errorMsg, setErrorMsg] = useState("");
	const [startFailed, setStartFailed] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [now, setNow] = useState(() => Date.now());

	const { result: myResult, isLoading: myResultLoading } = useMyQuizResult(
		quizId,
		startFailed,
	);
	const submittedRef = useRef(false);

	const begin = (id: string) => {
		setPhase("loading");
		setPlayer(null);
		setAnswers({});
		setResult(null);
		setErrorMsg("");
		setStartFailed(false);
		setConfirm(false);
		submittedRef.current = false;
		start
			.mutateAsync(id)
			.then((p) => {
				setPlayer(p);
				setNow(Date.now());
				setPhase("playing");
			})
			.catch((e: AttemptError) => {
				setErrorMsg(e.message);
				setStartFailed(true);
			});
	};

	// بدء عند فتح الحوار (مرة لكل فتح) — begin مقصود استبعاده لتفادي إعادة التشغيل
	const openedRef = useRef(false);
	// biome-ignore lint/correctness/useExhaustiveDependencies: begin يُستدعى مرة واحدة عند الفتح عبر openedRef
	useEffect(() => {
		if (open && quizId && !openedRef.current) {
			openedRef.current = true;
			begin(quizId);
		}
		if (!open) openedRef.current = false;
	}, [open, quizId]);

	// عند فشل البدء: إن وُجدت نتيجة سابقة نعرضها، وإلا نعرض الخطأ
	useEffect(() => {
		if (!startFailed || myResultLoading) return;
		if (myResult) {
			setResult(myResult);
			setPhase("result");
		} else {
			setPhase("error");
		}
	}, [startFailed, myResult, myResultLoading]);

	// المؤقّت
	const deadline =
		player?.quiz.timeLimitMinutes != null
			? new Date(player.attempt.startedAt).getTime() + player.quiz.timeLimitMinutes * 60_000
			: null;
	const remaining = deadline != null ? deadline - now : null;

	useEffect(() => {
		if (phase !== "playing" || deadline == null) return;
		const t = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(t);
	}, [phase, deadline]);

	const doSubmit = async () => {
		if (!player || submit.isPending || submittedRef.current) return;
		submittedRef.current = true;
		const payload = player.questions.map((q) => {
			const a = answers[q.id] ?? {};
			return {
				questionId: q.id,
				...(a.selectedOptions ? { selectedOptions: a.selectedOptions } : {}),
				...(a.answerText ? { answerText: a.answerText } : {}),
			};
		});
		try {
			const r = await submit.mutateAsync({ attemptId: player.attempt.id, answers: payload });
			setResult(r);
			setPhase("result");
			setConfirm(false);
		} catch (e) {
			submittedRef.current = false;
			toast.error((e as Error).message);
		}
	};

	// تسليم تلقائي عند انتهاء الوقت — doSubmit مقصود استبعاده (محروس بـ submittedRef)
	// biome-ignore lint/correctness/useExhaustiveDependencies: doSubmit مستقر منطقيًا ومحروس ضد التكرار
	useEffect(() => {
		if (phase === "playing" && remaining != null && remaining <= 0 && !submittedRef.current) {
			toast.message("انتهى الوقت — يتم تسليم الاختبار");
			void doSubmit();
		}
	}, [phase, remaining]);

	const setChoice = (qid: string, idx: number, type: string) =>
		setAnswers((prev) => {
			if (type === "SINGLE") return { ...prev, [qid]: { selectedOptions: [idx] } };
			const cur = prev[qid]?.selectedOptions ?? [];
			const next = cur.includes(idx) ? cur.filter((i) => i !== idx) : [...cur, idx];
			return { ...prev, [qid]: { selectedOptions: next } };
		});
	const setText = (qid: string, val: string) =>
		setAnswers((prev) => ({ ...prev, [qid]: { answerText: val } }));

	const canRetry =
		!!result &&
		(result.quiz.maxAttempts == null || result.attemptsUsed < result.quiz.maxAttempts);

	const answeredCount = player
		? player.questions.filter((q) => {
				const a = answers[q.id];
				return a?.answerText?.trim() || (a?.selectedOptions?.length ?? 0) > 0;
			}).length
		: 0;

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="flex max-h-[86vh] w-[720px] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-[12px] border-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[720px]"
			>
				{/* الرأس */}
				<div
					dir="rtl"
					className="flex shrink-0 items-center justify-between gap-2 border-b border-[#E5E5E5] px-4 py-3"
				>
					<DialogTitle className="text-[14px] font-bold text-[#08090A]">
						{phase === "result" ? "نتيجة الاختبار" : (player?.quiz.title ?? "الاختبار")}
					</DialogTitle>
					<DialogDescription className="sr-only">
						أداء الاختبار وعرض النتيجة.
					</DialogDescription>
					<div className="flex items-center gap-2">
						{phase === "playing" && remaining != null && (
							<span
								className={cn(
									"flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-bold tabular-nums",
									remaining < 60_000
										? "bg-destructive/10 text-destructive"
										: "bg-muted text-[#6B6B67]",
								)}
							>
								<IconClock className="size-3.5" />
								{fmtRemaining(remaining)}
							</span>
						)}
						<button
							type="button"
							onClick={onClose}
							aria-label="إغلاق"
							className="flex size-7 items-center justify-center rounded-[6px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconX className="size-[15px]" />
						</button>
					</div>
				</div>

				{/* الجسم */}
				<div
					dir="rtl"
					className="min-h-0 flex-1 overflow-y-auto p-4"
				>
					{phase === "loading" && (
						<p className="py-16 text-center text-[13px] text-muted-foreground">
							جارٍ تحميل الاختبار...
						</p>
					)}

					{phase === "error" && (
						<div className="flex flex-col items-center gap-2 py-16 text-center">
							<IconAlertTriangle className="size-8 text-[#B45309]" />
							<p className="text-[13px] font-semibold text-[#08090A]">{errorMsg}</p>
						</div>
					)}

					{phase === "result" && result && (
						<QuizResultView
							result={result}
							canRetry={canRetry}
							onRetry={() => quizId && begin(quizId)}
						/>
					)}

					{phase === "playing" && player && (
						<div className="flex flex-col gap-3">
							{player.questions.map((q, i) => (
								<div
									key={q.id}
									className="flex flex-col gap-2 rounded-[8px] border border-[#E5E5E5] p-3"
								>
									<div className="flex items-start justify-between gap-2">
										<span className="text-[13px] font-semibold text-[#08090A]">
											{i + 1}. {q.text}
										</span>
										<span className="shrink-0 text-[10px] text-[#9B9B9D]">
											{q.points} درجة
										</span>
									</div>

									{q.answerType === "TEXT" ? (
										<Textarea
											value={answers[q.id]?.answerText ?? ""}
											onChange={(e) => setText(q.id, e.target.value)}
											placeholder="اكتب إجابتك هنا"
											className="min-h-[80px] text-[12px]"
										/>
									) : (
										<div className="flex flex-col gap-1.5">
											{q.options.map((o, idx) => {
												const chosen = (answers[q.id]?.selectedOptions ?? []).includes(idx);
												return (
													<button
														key={`${o.text}-${idx}`}
														type="button"
														onClick={() => setChoice(q.id, idx, q.answerType)}
														className={cn(
															"flex items-center gap-2 rounded-[6px] border px-2.5 py-2 text-start text-[12px] transition-colors",
															chosen
																? "border-primary bg-primary/5 text-[#08090A]"
																: "border-[#E5E5E5] text-[#6B6B67] hover:bg-muted",
														)}
													>
														<span
															className={cn(
																"flex size-4 shrink-0 items-center justify-center border",
																q.answerType === "MULTIPLE" ? "rounded-[4px]" : "rounded-full",
																chosen
																	? "border-primary bg-primary"
																	: "border-[#D1D1DB] bg-white",
															)}
														>
															{chosen && <span className="size-1.5 rounded-full bg-white" />}
														</span>
														{o.text}
													</button>
												);
											})}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* الفوتر */}
				{phase === "playing" && player && (
					<div
						dir="rtl"
						className="flex shrink-0 items-center justify-between gap-2 border-t border-[#E5E5E5] px-4 py-3"
					>
						<span className="text-[11px] text-[#9B9B9D]">
							تمت الإجابة على {answeredCount} من {player.questions.length}
						</span>
						{confirm ? (
							<div className="flex items-center gap-1.5">
								<span className="text-[12px] font-medium text-[#08090A]">تأكيد التسليم؟</span>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setConfirm(false)}
									className="h-8 text-[11px]"
								>
									تراجع
								</Button>
								<Button
									type="button"
									size="sm"
									disabled={submit.isPending}
									onClick={doSubmit}
									className="h-8 text-[11px]"
								>
									نعم، سلّم
								</Button>
							</div>
						) : (
							<Button
								type="button"
								size="sm"
								onClick={() => setConfirm(true)}
								className="h-8 gap-1.5 text-[11px] font-semibold"
							>
								تسليم الاختبار
							</Button>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
