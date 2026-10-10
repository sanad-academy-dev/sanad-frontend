import {
	IconAlertTriangle,
	IconArrowsShuffle,
	IconChevronLeft,
	IconClock,
	IconEye,
	IconFileDescription,
	IconFileText,
	IconListCheck,
	IconRosetteDiscountCheck,
	IconSchool,
	IconStack2,
	IconStar,
	IconTargetArrow,
	IconX,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { QUIZ_ANSWER_TYPE_OPTIONS } from "@/features/services/training/data/training";
import { useQuiz } from "@/features/services/training/hooks/use-quizzes";
import { cn } from "@/lib/utils";
import type { QuizQuestionResponse } from "@/server/quizzes/quizzes.type";

const answerTypeLabel = (t: QuizQuestionResponse["answerType"]) =>
	QUIZ_ANSWER_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t;

// شارة إحصائية علوية: الوسم وأيقونته (يمين) + القيمة (يسار).
// grow لا flex-1 حتى لا يلتفّ نصّ القيمة على سطرين.
function StatChip({ value, label, icon }: { value: string; label: string; icon?: ReactNode }) {
	return (
		<div className="flex h-[37px] grow items-center justify-between gap-2 whitespace-nowrap rounded-[4px] border border-[#E5E5E5] px-3">
			<span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-[#08090A]">
				{icon}
				{label}
			</span>
			<span className="shrink-0 text-[11px] font-bold text-[#08090A]">{value}</span>
		</div>
	);
}

// صف تفاصيل: الوسم + الأيقونة (يمين) والقيمة (يسار)
function DetailRow({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-2 py-1">
			<span className="flex items-center gap-1.5 text-[14px] text-[#737373]">
				{icon}
				{label}
			</span>
			<span className="text-[14px] font-medium text-[#08090A]">{value}</span>
		</div>
	);
}

// لوحة تفاصيل الاختبار — تنزلق من اليسار قبل بدء الاختبار (نفس تخطيط لوحة تفاصيل الدورة)
export function QuizDetailsSheet({
	quizId,
	onClose,
	onStart,
}: {
	quizId: string | null;
	onClose: () => void;
	onStart: (quizId: string) => void;
}) {
	const { quiz, isLoading } = useQuiz(quizId);

	const questions = quiz?.questions ?? [];
	const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
	const hasTextQuestions = questions.some((q) => q.answerType === "TEXT");
	const timeLabel = quiz?.timeLimitMinutes ? `${quiz.timeLimitMinutes} دقيقة` : "بلا حد";
	const attemptsLabel = quiz?.maxAttempts ? String(quiz.maxAttempts) : "بلا حد";

	// تعليمات مشتقّة من إعدادات الاختبار نفسه
	const instructions = [
		"أجب على جميع الأسئلة قبل التسليم — الأسئلة غير المُجابة تُحسب صفرًا.",
		quiz?.timeLimitMinutes
			? `الوقت المتاح ${quiz.timeLimitMinutes} دقيقة، ويُسلَّم الاختبار تلقائيًا عند انتهائه.`
			: "لا يوجد وقت محدد لهذا الاختبار — خذ وقتك في الإجابة.",
		quiz?.maxAttempts
			? `عدد المحاولات المتاحة ${quiz.maxAttempts} — استخدمها بعناية.`
			: "عدد المحاولات غير محدود لهذا الاختبار.",
		`نسبة النجاح ${quiz?.passMark ?? 0}% من الدرجة الكلية (${totalPoints} نقطة).`,
		quiz?.showAnswers
			? "ستظهر لك الإجابات الصحيحة في شاشة النتيجة بعد التسليم."
			: "لن تظهر الإجابات الصحيحة بعد التسليم.",
		...(quiz?.shuffleQuestions ? ["ترتيب الأسئلة عشوائي في كل محاولة."] : []),
	];

	const start = () => {
		if (quiz) onStart(quiz.id);
	};

	return (
		<Sheet
			open={!!quizId}
			onOpenChange={(next) => !next && onClose()}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				dir="rtl"
				// data-[side=left]:sm:max-w-[581px] ضروري لتجاوز max-w-sm الافتراضي للـ Sheet
				className="flex w-[581px] max-w-[calc(100%-2rem)] flex-col gap-0 border-e-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[581px] data-[side=left]:sm:max-w-[581px]"
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") start();
				}}
			>
				{/* الرأس — مسار التنقّل يمينًا وزر الإغلاق يسارًا.
				    ترتيب DOM في RTL: أوّل عنصر يمينًا، فيبدأ المسار بالصفحة الأمّ ثم ينزل إلى الاختبار. */}
				<div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2">
					<nav className="flex min-w-0 items-center gap-1.5">
						<span className="shrink-0 text-[10px] font-bold text-[#08090A]">الاختبارات</span>
						<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
						<span className="truncate text-[10px] font-bold text-[#08090A]">
							{quiz?.title ?? "—"}
						</span>
						<span className="shrink-0 font-mono text-[10px] text-[#9B9B9D]">
							· {quiz?.code ?? "—"}
						</span>
					</nav>

					<button
						type="button"
						onClick={onClose}
						aria-label="إغلاق"
						className="flex size-[21px] shrink-0 items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
					>
						<IconX className="size-3.5" />
					</button>
				</div>

				{/* الجسم */}
				<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pt-4 pb-3">
					<SheetTitle className="text-[14px] font-semibold text-[#08090A]">
						تفاصيل الاختبار
					</SheetTitle>

					{isLoading || !quiz ? (
						<p className="py-16 text-center text-[13px] text-muted-foreground">
							جارٍ تحميل الاختبار...
						</p>
					) : (
						<>
							{/* شارات علوية */}
							<div className="flex flex-wrap items-center gap-3">
								<StatChip
									value={String(questions.length)}
									label="# الأسئلة"
									icon={<IconStack2 className="size-2.5" />}
								/>
								<StatChip
									value={timeLabel}
									label="الوقت"
									icon={<IconClock className="size-2.5" />}
								/>
								<StatChip
									value={`${quiz.passMark}%`}
									label="نسبة النجاح"
									icon={<IconTargetArrow className="size-2.5" />}
								/>
								<StatChip
									value={attemptsLabel}
									label="المحاولات"
									icon={<IconListCheck className="size-2.5" />}
								/>
							</div>

							{/* بطاقة التفاصيل */}
							<div className="flex flex-col gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-3">
								<DetailRow
									label="اسم الاختبار"
									value={quiz.title}
									icon={<IconFileText className="size-3.5" />}
								/>
								<DetailRow
									label="القسم المستهدف"
									value={quiz.targetRole?.name ?? "—"}
									icon={<IconSchool className="size-3.5" />}
								/>
								<DetailRow
									label="الدرجة الكلية"
									value={`${totalPoints} نقطة`}
									icon={<IconTargetArrow className="size-3.5" />}
								/>
								<DetailRow
									label="نقاط التحفيز"
									value={String(quiz.gamificationPoints)}
									icon={<IconStar className="size-3.5" />}
								/>
								<DetailRow
									label="خلط الأسئلة"
									value={quiz.shuffleQuestions ? "نعم" : "لا"}
									icon={<IconArrowsShuffle className="size-3.5" />}
								/>
								<DetailRow
									label="إظهار الإجابات بعد التسليم"
									value={quiz.showAnswers ? "نعم" : "لا"}
									icon={<IconEye className="size-3.5" />}
								/>
								<DetailRow
									label="حالة الاختبار"
									value={quiz.status === "PUBLISHED" ? "منشور" : "مسودة"}
									icon={<IconRosetteDiscountCheck className="size-3.5" />}
								/>
							</div>

							{/* وصف الاختبار — الوسم في بداية السطر (يمينًا في RTL) والنص تحته */}
							<div className="flex flex-col items-start gap-2 py-1">
								<span className="flex items-center gap-1.5 text-[14px] text-[#737373]">
									<IconFileDescription className="size-3.5" />
									وصف الاختبار
								</span>
								<p className="w-full text-start text-[14px] font-medium leading-[21px] text-[#08090A]">
									{quiz.description?.trim() || "لا يوجد وصف لهذا الاختبار."}
								</p>
							</div>

							{/* الأسئلة — النصّ فقط بلا إجابات حتى لا يُفسد الاختبار */}
							<SheetTitle className="text-[14px] font-semibold text-[#08090A]">
								أسئلة الاختبار ({questions.length})
							</SheetTitle>

							{questions.length === 0 ? (
								<p className="text-[11px] text-[#9B9B9D]">
									لا توجد أسئلة في هذا الاختبار بعد.
								</p>
							) : (
								<div className="flex flex-col gap-2">
									{questions.map((q, i) => (
										<div
											key={q.id}
											className="flex items-start justify-between gap-3 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 py-2.5"
										>
											{/* الرقم يمينًا ثم نصّ السؤال، والوسوم في نهاية الصف */}
											<span className="flex min-w-0 items-start gap-1.5">
												<span className="mt-px flex size-[18px] shrink-0 items-center justify-center rounded-[4px] bg-[#F5F5F5] text-[9px] font-bold tabular-nums text-[#08090A]">
													{i + 1}
												</span>
												<span className="text-start text-[10px] font-semibold leading-[14px] text-[#08090A]">
													{q.text}
												</span>
											</span>
											<span className="flex shrink-0 items-center gap-1.5">
												<span className="whitespace-nowrap rounded-[4px] bg-[#6366F1]/[0.125] px-1.5 py-[2px] text-[9px] font-medium text-[#5B6ABF]">
													{answerTypeLabel(q.answerType)}
												</span>
												<span className="whitespace-nowrap text-[9px] font-bold tabular-nums text-[#737373]">
													{q.points} نقطة
												</span>
											</span>
										</div>
									))}
								</div>
							)}

							{/* إرشادات وتعليمات الاختبار */}
							<SheetTitle className="text-[14px] font-semibold text-[#08090A]">
								إرشادات وتعليمات الاختبار
							</SheetTitle>

							{hasTextQuestions && (
								// items-start مع هامش علوي صغير تُبقي الأيقونة على مستوى السطر الأول
								<div className="flex items-start gap-1.5 rounded-[4px] bg-[#F59E0B]/[0.12] px-1.5 py-1">
									<IconAlertTriangle className="mt-[1.5px] size-3 shrink-0 text-[#F59E0B]" />
									<span className="text-start text-[10px] leading-[14px] text-[#F59E0B]">
										يحتوي هذا الاختبار على أسئلة نصّية تُصحَّح يدويًا من المدير، لذا قد تظهر نتيجتك
										النهائية بعد اعتماد التصحيح.
									</span>
								</div>
							)}

							<p className="text-start text-[11px] font-semibold text-[#08090A]">
								قبل البدء، يرجى مراعاة التالي:
							</p>

							<div className="flex flex-col gap-2">
								{instructions.map((line) => (
									<div
										key={line}
										className="flex items-center justify-between gap-3 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 py-2.5"
									>
										<span className="text-start text-[10px] font-semibold leading-[14px] text-[#08090A]">
											{line}
										</span>
										<span className="size-[18px] shrink-0 rounded-[4px] border-[1.5px] border-[#E5E5E5] bg-background" />
									</div>
								))}
							</div>
						</>
					)}
				</div>

				{/* التذييل — الأزرار يسارًا؛ الزر الأساسي أقصى اليسار و«إلغاء» على يمينه */}
				<div className="flex shrink-0 items-center justify-end gap-2 border-t px-4 py-2">
					<button
						type="button"
						onClick={onClose}
						className="flex h-[27px] items-center rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px] text-[11px] font-medium text-[#08090A] hover:bg-muted"
					>
						إلغاء
					</button>
					<button
						type="button"
						onClick={start}
						disabled={!quiz || questions.length === 0}
						className={cn(
							"flex h-[25.5px] items-center justify-center gap-1.5 rounded-[4px] bg-primary px-3 text-[11px] font-semibold primarytransition-colors hover:bg-primary/90",
							(!quiz || questions.length === 0) && "cursor-not-allowed opacity-70",
						)}
					>
						بدء الاختبار
						<span className="rounded-[4px] bg-white/20 px-[3px] py-[1.5px] text-[8px] leading-3 text-white">
							⌘↵
						</span>
					</button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
