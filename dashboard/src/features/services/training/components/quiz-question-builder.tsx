import {
	IconCircleMinus,
	IconCircleX,
	IconGripVertical,
	IconInfoCircle,
	IconPlus,
	IconTrashX,
} from "@tabler/icons-react";
import { useState } from "react";
import type {
	Control,
	FieldErrors,
	UseFormGetValues,
	UseFormRegister,
	UseFormSetValue,
} from "react-hook-form";
import { useController, useFieldArray, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	arabicOrdinal,
	QUIZ_ANSWER_TYPE_OPTIONS,
} from "@/features/services/training/data/training";
import { cn } from "@/lib/utils";
import type { CreateQuizFormInput, QuizAnswerType } from "@/server/quizzes/quizzes.type";

// باني أسئلة الاختبار المستقل — مقتبس من quiz-builder (دروس الدورة) لكنه مربوط بمخطط
// الاختبار المستقل (CreateQuizFormInput) ويضيف حقل «الدرجة» (points) لكل سؤال.
type QuizProps = {
	control: Control<CreateQuizFormInput>;
	register: UseFormRegister<CreateQuizFormInput>;
	setValue: UseFormSetValue<CreateQuizFormInput>;
	getValues: UseFormGetValues<CreateQuizFormInput>;
	errors: FieldErrors<CreateQuizFormInput>;
	disabled?: boolean;
};

// دائرة اختيار بنمط التصميم — تُملأ بالبنفسجي عند التحديد
function ChoiceDot({ checked }: { checked: boolean }) {
	return (
		<span
			className={cn(
				"size-[14.5px] shrink-0 rounded-full border-[1.5px] border-[#D1D1DB] shadow-[0px_1px_2px_rgba(18,18,23,0.05)]",
				checked ? "bg-[#6366F1]" : "bg-white",
			)}
		/>
	);
}

// تسمية مصغّرة — في RTL: النص ← «مطلوب» ← أيقونة المعلومات
function SmallLabel({ label, required = false }: { label: string; required?: boolean }) {
	return (
		<div className="flex shrink-0 items-center gap-[5px]">
			<span className="text-[10px] font-medium leading-4 text-[#08090A]">{label}</span>
			{required && (
				<span className="rounded-[3px] bg-[#DC2626]/[0.06] px-[4.5px] py-[1.5px] text-[8px] font-medium leading-3 text-[#DC2626]">
					مطلوب
				</span>
			)}
			<IconInfoCircle className="size-2.5 shrink-0 text-[#9B9B9D] opacity-50" />
		</div>
	);
}

// سؤال واحد: نصّه ← نوع إجاباته ← درجته ← خياراته
function QuestionRow({
	index,
	control,
	register,
	setValue,
	getValues,
	errors,
	disabled,
	onRemove,
}: QuizProps & { index: number; onRemove: () => void }) {
	const [collapsed, setCollapsed] = useState(false);
	const { fields, append, remove } = useFieldArray({
		control,
		name: `questions.${index}.options`,
	});

	const { field: answerTypeField } = useController({
		control,
		name: `questions.${index}.answerType`,
	});
	const answerType = (answerTypeField.value ?? "SINGLE") as QuizAnswerType;

	// نقرأ الخيارات من الحالة الحيّة (لا من لقطة fields) حتى لا يُمحى ما كتبه المستخدم
	const options = useWatch({ control, name: `questions.${index}.options` }) ?? [];

	// «خيارات» تسمح بإجابة صحيحة واحدة؛ «خيارات متعددة» تسمح بأكثر من واحدة
	const toggleCorrect = (optionIndex: number) => {
		const current = getValues(`questions.${index}.options`) ?? [];
		setValue(
			`questions.${index}.options`,
			current.map((opt, i) => ({
				...opt,
				correct:
					answerType === "MULTIPLE"
						? i === optionIndex
							? !opt.correct
							: opt.correct
						: i === optionIndex,
			})),
			{ shouldDirty: true },
		);
	};

	// تغيير نوع الإجابة — عند التحويل إلى SINGLE نُبقي إجابة صحيحة واحدة فقط (أول صحيحة)
	const changeAnswerType = (next: QuizAnswerType) => {
		answerTypeField.onChange(next);
		if (next === "SINGLE") {
			const current = getValues(`questions.${index}.options`) ?? [];
			const firstCorrect = current.findIndex((o) => o.correct);
			setValue(
				`questions.${index}.options`,
				current.map((opt, i) => ({ ...opt, correct: i === firstCorrect })),
				{ shouldDirty: true },
			);
		}
	};

	const questionError = errors.questions?.[index];

	return (
		<div className="flex flex-col gap-2.5">
			{/* صف السؤال — في RTL: المقبض ← التسمية ← الحقل ← أيقونتا الطيّ والحذف */}
			<div className="flex items-center gap-2.5">
				<IconGripVertical className="size-2.5 shrink-0 cursor-grab text-[#828283]" />
				<SmallLabel
					label={`السؤال ${arabicOrdinal(index)}`}
					required
				/>
				<Input
					placeholder="أكتب سؤالك هنا"
					className="h-[25px] flex-1 text-[11px]"
					aria-invalid={!!questionError?.text}
					disabled={disabled}
					{...register(`questions.${index}.text`)}
				/>
				<div className="flex shrink-0 items-center gap-0.5">
					<button
						type="button"
						onClick={() => setCollapsed((v) => !v)}
						aria-label={collapsed ? "توسيع السؤال" : "طي السؤال"}
						aria-expanded={!collapsed}
						disabled={disabled}
					>
						<IconCircleMinus className="size-3 text-[#6366F1]/[0.32]" />
					</button>
					<button
						type="button"
						onClick={onRemove}
						aria-label="حذف السؤال"
						disabled={disabled}
					>
						<IconCircleX className="size-3 text-[#EF4444]" />
					</button>
				</div>
			</div>

			{!collapsed && (
				<>
					<span className="h-px w-full bg-[#E8E8E8]" />

					<div className="flex flex-col gap-3">
						{/* شريط نوع الإجابات — في RTL: التسمية والأنواع يمينًا، ثم الدرجة وزر الإضافة يسارًا */}
						<div className="flex min-h-[26px] flex-wrap items-center justify-between gap-3">
							<div className="flex shrink-0 items-center gap-3.5">
								<div className="flex items-center gap-[5px]">
									<span className="text-[11px] font-medium leading-4 text-[#08090A]">
										نوع الإجابات
									</span>
									<IconInfoCircle className="size-2.5 shrink-0 text-[#9B9B9D] opacity-50" />
								</div>
								{QUIZ_ANSWER_TYPE_OPTIONS.map((opt) => (
									<label
										key={opt.value}
										className="flex cursor-pointer items-center gap-1.5"
									>
										{/* المدخل الحقيقي مخفي بصريًا؛ الدائرة أدناه هي شكل التصميم */}
										<input
											type="radio"
											className="sr-only"
											name={`answer-type-${index}`}
											checked={answerType === opt.value}
											onChange={() => changeAnswerType(opt.value as QuizAnswerType)}
											disabled={disabled}
										/>
										<ChoiceDot checked={answerType === opt.value} />
										<span className="text-[10px] leading-[10px] text-[#121217]">
											{opt.label}
										</span>
									</label>
								))}
							</div>

							<div className="flex shrink-0 items-center gap-3">
								{/* الدرجة — وزن السؤال في احتساب النتيجة */}
								<div className="flex items-center gap-1.5">
									<span className="text-[10px] font-medium leading-4 text-[#08090A]">
										الدرجة
									</span>
									<Input
										type="number"
										min={1}
										max={100}
										className="h-[26px] w-[52px] text-[11px]"
										aria-invalid={!!questionError?.points}
										disabled={disabled}
										{...register(`questions.${index}.points`, {
											setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)),
										})}
									/>
								</div>

								{answerType !== "TEXT" && (
									<Button
										type="button"
										variant="outline"
										onClick={() => append({ text: "", correct: false })}
										disabled={disabled}
										className="h-[26px] shrink-0 gap-1 rounded-[4px] px-[7px] text-[12px] font-medium"
									>
										إضافة خيار جديد
										<IconPlus className="size-[15px]" />
									</Button>
								)}
							</div>
						</div>

						{/* إجابة نموذجية للأسئلة النصّية — تغذّي التصحيح اليدوي/بالذكاء الاصطناعي */}
						{answerType === "TEXT" && (
							<div className="flex flex-col gap-[5px]">
								<span className="text-[10px] font-medium leading-4 text-[#08090A]">
									الإجابة النموذجية (اختياري):
								</span>
								<Textarea
									placeholder="أكتب الإجابة النموذجية التي تُقارَن بها إجابة الموظف"
									className="min-h-[79px] px-3 py-[4.5px] text-[11px]"
									disabled={disabled}
									{...register(`questions.${index}.answerText`)}
								/>
							</div>
						)}

						{/* الخيارات — في RTL: المقبض ← التسمية ← الحقل ← تحديد الإجابة ← الحذف */}
						{answerType !== "TEXT" &&
							fields.map((field, optionIndex) => (
								<div
									key={field.id}
									className="flex h-6 items-center gap-[5px]"
								>
									<IconGripVertical className="size-2.5 shrink-0 cursor-grab text-[#828283]" />
									<span className="shrink-0 text-[10px] font-medium leading-4 text-[#08090A]">
										الخيار {arabicOrdinal(optionIndex)}:
									</span>
									<Input
										placeholder="أكتب إجابتك هنا"
										className="h-[23px] flex-1 text-[11px]"
										aria-invalid={!!questionError?.options?.[optionIndex]?.text}
										disabled={disabled}
										{...register(`questions.${index}.options.${optionIndex}.text`)}
									/>
									<label className="flex shrink-0 cursor-pointer items-center gap-0.5">
										<input
											type={answerType === "MULTIPLE" ? "checkbox" : "radio"}
											className="sr-only"
											name={`correct-${index}`}
											checked={!!options[optionIndex]?.correct}
											onChange={() => toggleCorrect(optionIndex)}
											disabled={disabled}
										/>
										<ChoiceDot checked={!!options[optionIndex]?.correct} />
										<span className="text-[10px] leading-6 text-[#121217]">
											تحديد كإجابة صحيحة
										</span>
									</label>
									<button
										type="button"
										onClick={() => remove(optionIndex)}
										aria-label="حذف الخيار"
										disabled={disabled}
										className="shrink-0"
									>
										<IconTrashX className="size-4 text-[#DC2626]" />
									</button>
								</div>
							))}
					</div>
				</>
			)}
		</div>
	);
}

export function QuizQuestionBuilder(props: QuizProps) {
	const { control, disabled } = props;
	const { fields, append, remove } = useFieldArray({ control, name: "questions" });

	const addQuestion = () =>
		append({
			text: "",
			answerType: "SINGLE",
			points: 1,
			options: [{ text: "", correct: true }],
			answerText: "",
		});

	return (
		<div className="flex flex-col gap-3">
			{fields.length > 0 && (
				<div className="flex flex-col gap-2.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-[#9B9B9D]/[0.09] px-1.5 pt-[11px] pb-[4.5px]">
					{fields.map((field, index) => (
						<QuestionRow
							key={field.id}
							{...props}
							index={index}
							onRemove={() => remove(index)}
						/>
					))}
				</div>
			)}

			{fields.length === 0 && (
				<div className="flex flex-col items-center gap-1 rounded-[6px] border border-dashed border-[#E5E5E5] py-10 text-center">
					<span className="text-[13px] font-semibold text-[#08090A]">لا توجد أسئلة بعد</span>
					<span className="text-[11px] text-[#9B9B9D]">
						أضف سؤالاً واحداً على الأقل لنشر الاختبار.
					</span>
				</div>
			)}

			{/* زر إضافة سؤال — في RTL يلتصق باليمين */}
			<div className="flex justify-start">
				<Button
					type="button"
					variant="outline"
					onClick={addQuestion}
					disabled={disabled}
					className="h-[26px] gap-1 rounded-[4px] px-[7px] text-[12px] font-medium"
				>
					إضافة سؤال جديد
					<IconPlus className="size-[15px]" />
				</Button>
			</div>
		</div>
	);
}
