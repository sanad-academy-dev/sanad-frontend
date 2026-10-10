import { IconFocusCentered, IconSparkles } from "@tabler/icons-react";
import type {
	Control,
	FieldErrors,
	UseFormGetValues,
	UseFormRegister,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";

import { CoverPicker } from "@/features/services/training/components/cover-picker";
import { QuizQuestionBuilder } from "@/features/services/training/components/quiz-question-builder";
import { resolveCover } from "@/features/services/training/utils/cover";
import type { CreateQuizFormInput } from "@/server/quizzes/quizzes.type";

// خطوة «الأسئلة» — نفس تخطيط خطوة محتوى الدورة: باني (555px) يمينًا ومعاينة يسارًا.
export function QuizBuilderStep({
	control,
	register,
	setValue,
	getValues,
	watch,
	errors,
	disabled,
	onCoverChange,
	onGenerateAI,
}: {
	control: Control<CreateQuizFormInput>;
	register: UseFormRegister<CreateQuizFormInput>;
	setValue: UseFormSetValue<CreateQuizFormInput>;
	getValues: UseFormGetValues<CreateQuizFormInput>;
	watch: UseFormWatch<CreateQuizFormInput>;
	errors: FieldErrors<CreateQuizFormInput>;
	disabled?: boolean;
	onCoverChange: (coverKey: string | null) => void;
	onGenerateAI: () => void;
}) {
	const questions = watch("questions") ?? [];
	const title = watch("title");
	const coverKey = watch("coverKey") ?? null;
	// الغلاف الحالي — لون خالص أو صورة أو لا شيء (نفس منطق غلاف الدورة)
	const cover = resolveCover(coverKey);
	const passMark = watch("passMark");
	const timeLimitMinutes = watch("timeLimitMinutes");
	const maxAttempts = watch("maxAttempts");
	const totalPoints = questions.reduce((n, q) => n + (Number(q.points) || 0), 0);
	const answered = questions.filter((q) => q.text?.trim());

	return (
		<div className="flex min-h-0 flex-1 items-start gap-3 px-3 pt-4">
			{/* ===== يمين: باني الاختبار (555px) ===== */}
			<div className="flex min-h-0 w-[555px] shrink-0 flex-col gap-3 self-stretch">
				<div className="flex items-start justify-between gap-7">
					<div className="flex flex-col gap-2.5">
						<h2 className="text-[11px] font-bold leading-[10px] text-[#08090A]">
							باني الاختبار
						</h2>
						<p className="text-[10px] leading-[10px] text-[#6B6B67]">
							أضف الأسئلة وحدّد الإجابات الصحيحة ودرجة كل سؤال — سؤال واحد على الأقل للنشر
						</p>
					</div>

					<div className="flex shrink-0 items-center gap-[7px]">
						<button
							type="button"
							onClick={onGenerateAI}
							className="flex h-[22px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#6366F1] px-[5px] text-[10px] font-medium text-[#4F6AE0]"
						>
							إنشاء أسئلة بـ AI
							<IconSparkles className="size-[9px]" />
						</button>
					</div>
				</div>

				{/* الأسئلة */}
				<div className="flex min-h-0 flex-1 flex-col gap-[9px] overflow-y-auto">
					<QuizQuestionBuilder
						control={control}
						register={register}
						setValue={setValue}
						getValues={getValues}
						errors={errors}
						disabled={disabled}
					/>
				</div>
			</div>

			{/* الفاصل الرأسي */}
			<span className="w-px shrink-0 self-stretch bg-[#E8E8E8]" />

			{/* ===== يسار: معاينة الاختبار ===== */}
			<div className="flex min-h-0 flex-1 flex-col gap-3 self-stretch">
				<div className="flex items-center py-[5px]">
					<h2 className="text-[11px] font-bold leading-4 text-[#08090A]">معاينة الاختبار</h2>
				</div>

				{/* الغلاف — يعرض اللون/الصورة المختارة، ومنتقي الغلاف أسفل اليمين (items-start في RTL) */}
				<div
					className="relative flex h-[143px] shrink-0 flex-col items-start justify-end gap-2 overflow-hidden rounded-t-[4px] border-[0.75px] border-[#E5E5E5] px-6 py-3"
					style={cover?.type === "color" ? { backgroundColor: cover.color } : undefined}
				>
					{cover?.type === "image" && (
						<img
							src={cover.url}
							alt="غلاف الاختبار"
							className="absolute inset-0 size-full object-cover"
						/>
					)}
					{!cover && <div className="absolute inset-0 bg-[#6366F1]/[0.38]" />}

					<div className="relative flex flex-col gap-1">
						<span className="text-[13px] font-bold text-[#08090A]">
							{title?.trim() || "اختبار جديد"}
						</span>
						<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#08090A]/70">
							<span>نسبة النجاح: {passMark ?? 0}%</span>
							<span>المدة: {timeLimitMinutes ? `${timeLimitMinutes} دقيقة` : "بلا حد"}</span>
							<span>المحاولات: {maxAttempts ?? "بلا حد"}</span>
							<span>الدرجة الكلية: {totalPoints}</span>
						</div>
					</div>

					<div className="relative">
						<CoverPicker
							value={coverKey}
							onChange={onCoverChange}
							disabled={disabled}
							triggerLabel={coverKey ? "تغيير الغلاف" : "إضافة غلاف"}
						/>
					</div>
				</div>

				{/* منطقة المعاينة */}
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white">
					{answered.length > 0 ? (
						<div className="flex flex-col gap-4 p-6">
							{answered.map((q, qi) => (
								<div
									key={`${q.text}-${qi}`}
									className="flex flex-col gap-2"
								>
									<h3 className="text-[12px] font-bold text-[#08090A]">
										<span className="text-[#9B9B9D] tabular-nums">{qi + 1}. </span>
										{q.text}
									</h3>
									<ol className="flex flex-col gap-1">
										{(q.options ?? [])
											.filter((o) => o.text?.trim())
											.map((o, oi) => (
												<li
													key={`${o.text}-${oi}`}
													className="flex items-center gap-2 rounded-[4px] bg-[#FAFAFA] px-3 py-2 text-[11px] text-[#08090A]"
												>
													<span className="text-[#9B9B9D] tabular-nums">{oi + 1}.</span>
													{o.text}
												</li>
											))}
									</ol>
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-3">
							<IconFocusCentered className="size-6 text-[#08090A]" />
							<div className="flex flex-col items-center gap-2">
								<p className="text-center text-[11px] font-semibold leading-6 text-[#08090A]">
									لا يوجد محتوى للمعاينة حتى الآن
								</p>
								<p className="text-center text-[10px] leading-[18px] text-[#6B6B67]">
									بعد إضافة أول سؤال، ستظهر هنا معاينة مباشرة لطريقة عرض الاختبار للموظفين قبل
									نشره.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
