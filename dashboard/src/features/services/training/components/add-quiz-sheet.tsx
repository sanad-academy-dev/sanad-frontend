import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconAlertCircle,
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconInfoCircle,
	IconKeyboard,
	IconListCheck,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormHeader } from "@/components/common/form-header";
import { showSuccessToast } from "@/components/common/success-toast";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AiQuizSheet } from "@/features/services/training/components/ai-quiz-sheet";
import { QuizAssignLearnersStep } from "@/features/services/training/components/quiz-assign-learners-step";
import { QuizBuilderStep } from "@/features/services/training/components/quiz-builder-step";
import {
	type SheetStep,
	SheetStepper,
} from "@/features/services/training/components/sheet-stepper";
import {
	useCreateQuiz,
	usePublishQuiz,
	useQuiz,
	useUpdateQuiz,
} from "@/features/services/training/hooks/use-quizzes";
import { useStaffRoles } from "@/features/settings/roles-permissions/hooks/use-staff-roles";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
	type CreateQuizFormInput,
	createQuizSchema,
	type QuizQuestionFormInput,
	type QuizResponse,
} from "@sanad/contracts/runtime/server/quizzes/quizzes.type";

type Step = 1 | 2 | 3;
type PublishError = { step: Step; message: string };

const STEPS: readonly SheetStep[] = [
	{ step: 1, title: "الإعدادات", icon: IconSettings },
	{ step: 2, title: "الأسئلة", icon: IconListCheck },
	{ step: 3, title: "تعيين الموظفين", icon: IconUsers },
];

// تحويل "" → undefined لحقول رقمية اختيارية (بلا حد) بدل 0 الذي يكسر الحد الأدنى
const numOpt = { setValueAs: (v: string) => (v === "" || v == null ? undefined : Number(v)) };

// يحوّل استجابة اختبار محفوظ إلى قيم النموذج (لترطيب التعديل)
function toFormValues(quiz: QuizResponse): CreateQuizFormInput {
	return {
		title: quiz.title,
		description: quiz.description ?? "",
		targetRoleId: quiz.targetRoleId ?? "",
		coverKey: quiz.coverKey ?? null,
		passMark: quiz.passMark,
		timeLimitMinutes: quiz.timeLimitMinutes ?? undefined,
		maxAttempts: quiz.maxAttempts ?? undefined,
		shuffleQuestions: quiz.shuffleQuestions,
		showAnswers: quiz.showAnswers,
		gamificationPoints: quiz.gamificationPoints,
		questions: quiz.questions.map((q) => ({
			text: q.text,
			answerType: q.answerType,
			points: q.points,
			options: Array.isArray(q.options)
				? (q.options as { text?: string; correct?: boolean }[]).map((o) => ({
						text: o.text ?? "",
						correct: !!o.correct,
					}))
				: [],
			answerText: q.answerText ?? "",
		})),
	};
}

const DEFAULTS: CreateQuizFormInput = {
	title: "",
	description: "",
	targetRoleId: "",
	coverKey: null,
	passMark: 60,
	timeLimitMinutes: undefined,
	maxAttempts: undefined,
	shuffleQuestions: false,
	showAnswers: true,
	gamificationPoints: 0,
	questions: [],
};

// لوحة «إنشاء اختبار» — تحاكي لوحة الدورة: خطوات، حفظ-مسودّة-أولاً، فوتر إلغاء/حفظ كمسودة/التالي.
// الخطوة 1 تُنشئ الاختبار كمسودّة وتلتقط المعرّف؛ ثم الأسئلة؛ ثم النشر (فحص جاهزية على الخادم).
export function AddQuizSheet({
	open,
	onClose,
	editQuizId,
}: {
	open: boolean;
	onClose: () => void;
	editQuizId?: string | null;
}) {
	const dir = useI18n().isRtl ? "rtl" : "ltr";
	const { roles, isLoading: rolesLoading } = useStaffRoles();

	const [step, setStep] = useState<Step>(1);
	// توسيع اللوحة لكامل عرض الشاشة — زر «توسيع» في الهيدر (خطوة الأسئلة)
	const [expanded, setExpanded] = useState(false);
	// منشئ الأسئلة بالذكاء الاصطناعي — لوحة جانبية تولّد معاينة ثم تُضاف للباني
	const [aiOpen, setAiOpen] = useState(false);
	const [furthest, setFurthest] = useState<Step>(1);
	const [quizId, setQuizId] = useState<string | null>(editQuizId ?? null);
	const [publishError, setPublishError] = useState<PublishError | null>(null);

	const { createQuiz, isPending: isCreating } = useCreateQuiz();
	const { updateQuiz, isPending: isUpdating } = useUpdateQuiz(quizId);
	const { publishQuiz, isPending: isPublishing } = usePublishQuiz();
	const { quiz } = useQuiz(editQuizId ?? null);

	const {
		register,
		handleSubmit,
		control,
		reset,
		getValues,
		setValue,
		watch,
		formState: { errors },
	} = useForm<CreateQuizFormInput>({
		resolver: zodResolver(createQuizSchema),
		defaultValues: DEFAULTS,
	});

	const values = watch();
	const formProgress = useFormProgress({ schema: createQuizSchema, values });
	// عدد مرات تعديل السجل المحفوظ في قاعدة البيانات — لا علاقة له بالتغييرات الحالية
	const changesCount = quiz?.editsCount ?? 0;

	// ترطيب لمرة واحدة عند التعديل — يملأ النموذج من الاختبار المحفوظ
	const hydratedRef = useRef<string | null>(null);
	useEffect(() => {
		if (!editQuizId || !quiz || hydratedRef.current === editQuizId) return;
		hydratedRef.current = editQuizId;
		reset(toFormValues(quiz));
		setQuizId(editQuizId);
		setFurthest(2);
	}, [editQuizId, quiz, reset]);

	// مسح خطأ النشر عند مغادرة الخطوة المعنيّة
	useEffect(() => {
		if (publishError && publishError.step !== step) setPublishError(null);
	}, [step, publishError]);

	const advance = (to: Step) => {
		setStep(to);
		setFurthest((f) => (to > f ? to : f));
	};

	const close = () => {
		reset(DEFAULTS);
		setStep(1);
		setFurthest(1);
		setQuizId(null);
		setPublishError(null);
		hydratedRef.current = null;
		onClose();
	};

	// الخطوة 1 → إنشاء/تحديث المسودّة والتقاط المعرّف ثم الانتقال للأسئلة
	const submitStep1 = handleSubmit(async (values) => {
		try {
			if (quizId) {
				await updateQuiz(values);
			} else {
				const created = await createQuiz(values);
				setQuizId(created.id);
			}
			advance(2);
		} catch {
			/* الخطأ يظهر عبر التوست؛ نبقى على الخطوة 1 */
		}
	});

	// النشر — نُثبّت الأسئلة أولاً ثم نشغّل فحص الجاهزية على الخادم
	const publish = async () => {
		if (!quizId) return;
		try {
			await updateQuiz(getValues());
			await publishQuiz(quizId);
			close();
			showSuccessToast("تم نشر الاختبار بنجاح", { iconAtStart: true });
		} catch (e) {
			// «غير جاهز» (400) أو أي فشل نشر — نعرضه كخطأ مضمّن على خطوة الأسئلة
			setPublishError({ step: 2, message: (e as Error).message });
			setStep(2);
		}
	};

	// الخطوة 2 → تثبيت الأسئلة ثم الانتقال لخطوة التعيين
	const goToAssign = async () => {
		try {
			if (quizId) await updateQuiz(getValues());
			advance(3);
		} catch {
			/* التوست يعرض الخطأ؛ نبقى على خطوة الأسئلة */
		}
	};

	const submit = (e?: FormEvent) => {
		e?.preventDefault();
		if (step === 1) return void submitStep1();
		if (step === 2) return void goToAssign();
		void publish();
	};

	// إضافة الأسئلة المولّدة بالذكاء الاصطناعي إلى الباني (بعد موافقة المستخدم في المعاينة)
	const applyAiQuestions = (
		generated: QuizQuestionFormInput[],
		meta: { title: string; description: string },
	) => {
		const current = getValues("questions") ?? [];
		setValue("questions", [...current, ...generated], { shouldDirty: true });
		// عنوان/وصف مقترحان يملآن الفراغ فقط — لا نطمس ما كتبه المستخدم
		if (!getValues("title")?.trim() && meta.title) setValue("title", meta.title);
		if (!getValues("description")?.trim() && meta.description)
			setValue("description", meta.description);
	};

	// حفظ الغلاف فورًا على المسودّة — نفس سلوك غلاف الدورة (لون "color:#HEX" أو مفتاح صورة أو null)
	const saveCover = async (coverKey: string | null) => {
		setValue("coverKey", coverKey, { shouldDirty: true });
		if (quizId) await updateQuiz({ ...getValues(), coverKey });
	};

	// حفظ كمسودة — يثبّت القيم الحالية ويغلق
	const saveDraft = async () => {
		try {
			const values = getValues();
			if (quizId) await updateQuiz(values);
			else {
				const created = await createQuiz(values);
				setQuizId(created.id);
			}
			showSuccessToast("تم حفظ المسودة", { iconAtStart: true });
			close();
		} catch {
			/* التوست يعرض الخطأ */
		}
	};

	const busy = isCreating || isUpdating || isPublishing;

	return (
		<Sheet
			open={open}
			onOpenChange={(o) => {
				if (!o) close();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className={cn(
					"flex w-full! flex-col gap-0 border-e-0 border-s-[0.75px] border-s-[#E5E5E5] p-0",
					expanded
						? "sm:max-w-[calc(100vw-16px)]!"
						: step === 1
							? "sm:max-w-[578px]!"
							: step === 2
								? "sm:max-w-[1574px]!"
								: "sm:max-w-[820px]!",
				)}
			>
				<form
					onSubmit={submit}
					dir="rtl"
					className="flex min-h-0 flex-1 flex-col"
				>
					<FormHeader
						title={
							step === 1 ? (editQuizId ? "تعديل الاختبار" : "إنشاء اختبار جديد") : "الاختبارات"
						}
						identity={step === 1 ? null : { name: values.title || "اختبار جديد" }}
						changesCount={changesCount}
						progress={formProgress}
						onClose={close}
						actions={
							step === 2 ? (
								<Button
									variant="ghost"
									size="icon-sm"
									type="button"
									onClick={() => setExpanded((v) => !v)}
									aria-label={expanded ? "تصغير" : "توسيع"}
								>
									{expanded ? (
										<IconArrowsDiagonalMinimize2 className="size-3 text-[#9B9B9D]" />
									) : (
										<IconArrowsDiagonal className="size-3 text-[#9B9B9D]" />
									)}
								</Button>
							) : undefined
						}
						className="shrink-0 border-b-0 px-3 py-[7.5px]"
					/>

					{/* الخطوات — نفس مؤشّر لوحة الدورة */}
					<SheetStepper
						steps={STEPS}
						step={step}
						furthest={furthest}
						onStepChange={(s) => setStep(s as Step)}
					/>

					{/* شريط خطأ النشر — يظهر أعلى الخطوة المعنيّة */}
					{publishError?.step === step && (
						<div className="flex shrink-0 items-center gap-2 border-b border-destructive/30 bg-destructive/5 px-3 py-2 text-[12px] font-medium text-destructive">
							<IconAlertCircle className="size-4 shrink-0" />
							{publishError.message}
						</div>
					)}

					{/* ===== الخطوة 1: الإعدادات ===== */}
					<div
						className={cn(
							"flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pt-4",
							step !== 1 && "hidden",
						)}
					>
						<div className="flex flex-col gap-4">
							<Field
								className="gap-1.5"
								data-invalid={!!errors.title}
							>
								<Label
									text="عنوان الاختبار"
									required
								/>
								<Input
									placeholder="مثال: اختبار سلامة التعامل مع الأطفال"
									className="h-10 text-[13px]"
									aria-invalid={!!errors.title}
									disabled={busy}
									{...register("title")}
								/>
								<FieldError errors={[errors.title]} />
							</Field>

							<Field className="gap-1.5">
								<Label text="الوصف" />
								<Textarea
									placeholder="وصف موجز لهدف الاختبار..."
									className="min-h-[72px] text-[13px]"
									disabled={busy}
									{...register("description")}
								/>
							</Field>

							{/* القسم المستهدف (اختياري) */}
							<Controller
								name="targetRoleId"
								control={control}
								render={({ field }) => (
									<Field className="gap-1.5">
										<Label text="القسم المستهدف" />
										<Combobox
											value={field.value ?? ""}
											onValueChange={(v) => field.onChange(typeof v === "string" ? v : "")}
										>
											<ComboboxTrigger
												disabled={rolesLoading || busy}
												className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 text-[13px]"
											>
												<ComboboxValue
													placeholder="اختر القسم (اختياري)..."
													className="truncate"
												>
													{roles.find((r) => r.id === field.value)?.name}
												</ComboboxValue>
											</ComboboxTrigger>
											<ComboboxContent dir={dir}>
												<ComboboxList>
													{roles.length === 0 ? (
														<ComboboxEmpty>لا توجد أقسام</ComboboxEmpty>
													) : (
														roles.map((r) => (
															<ComboboxItem
																key={r.id}
																value={r.id}
															>
																{r.name}
															</ComboboxItem>
														))
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
									</Field>
								)}
							/>

							{/* الإعدادات الرقمية — شبكة عمودين */}
							<div className="grid grid-cols-2 gap-3">
								<Field
									className="gap-1.5"
									data-invalid={!!errors.passMark}
								>
									<Label
										text="نسبة النجاح (%)"
										required
									/>
									<Input
										type="number"
										min={0}
										max={100}
										className="h-10 text-[13px]"
										aria-invalid={!!errors.passMark}
										disabled={busy}
										{...register("passMark", numOpt)}
									/>
									<FieldError errors={[errors.passMark]} />
								</Field>

								<Field className="gap-1.5">
									<Label text="المدة (دقائق)" />
									<Input
										type="number"
										min={0}
										max={600}
										placeholder="بلا حد"
										className="h-10 text-[13px]"
										disabled={busy}
										{...register("timeLimitMinutes", numOpt)}
									/>
								</Field>

								<Field className="gap-1.5">
									<Label text="عدد المحاولات" />
									<Input
										type="number"
										min={1}
										max={100}
										placeholder="بلا حد"
										className="h-10 text-[13px]"
										disabled={busy}
										{...register("maxAttempts", numOpt)}
									/>
								</Field>

								<Field className="gap-1.5">
									<Label text="نقاط التحفيز" />
									<Input
										type="number"
										min={0}
										className="h-10 text-[13px]"
										disabled={busy}
										{...register("gamificationPoints", numOpt)}
									/>
								</Field>
							</div>

							{/* مبدّلات */}
							<Controller
								name="shuffleQuestions"
								control={control}
								render={({ field }) => (
									<ToggleRow
										label="خلط الأسئلة"
										desc="عرض الأسئلة بترتيب عشوائي لكل محاولة."
										checked={!!field.value}
										onCheckedChange={field.onChange}
										disabled={busy}
									/>
								)}
							/>
							<Controller
								name="showAnswers"
								control={control}
								render={({ field }) => (
									<ToggleRow
										label="إظهار الإجابات بعد التسليم"
										desc="يرى الموظف الإجابات الصحيحة في شاشة النتيجة."
										checked={!!field.value}
										onCheckedChange={field.onChange}
										disabled={busy}
									/>
								)}
							/>
						</div>
					</div>

					{/* ===== الخطوة 2: الأسئلة — باني ومعاينة ===== */}
					{step === 2 && (
						<QuizBuilderStep
							control={control}
							register={register}
							setValue={setValue}
							getValues={getValues}
							watch={watch}
							errors={errors}
							disabled={busy}
							onCoverChange={saveCover}
							onGenerateAI={() => setAiOpen(true)}
						/>
					)}

					{/* ===== الخطوة 3: تعيين الموظفين ===== */}
					{step === 3 && quizId && (
						<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pt-4">
							<QuizAssignLearnersStep quizId={quizId} />
						</div>
					)}

					{/* الفوتر — في RTL: يمين اختصار، يسار إلغاء ← حفظ كمسودة ← التالي/نشر */}
					<div className="flex shrink-0 items-center justify-between border-t border-[#E5E5E5] px-3 py-[7.5px]">
						<span className="flex items-center gap-[3px] opacity-50">
							<IconKeyboard className="size-[10px] text-[#9B9B9D]" />
							<span className="text-[8px] leading-[12px] text-[#9B9B9D]">Ctrl+Enter</span>
						</span>

						<div className="flex items-center gap-1.5">
							<Button
								type="button"
								variant="outline"
								onClick={close}
								className="h-[27px] rounded-[4px] px-[9px] text-[11px] font-medium"
							>
								إلغاء
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={saveDraft}
								disabled={busy}
								className="h-[27px] rounded-[4px] px-[9px] text-[11px] font-medium"
							>
								حفظ كمسودة
							</Button>
							<Button
								type="submit"
								disabled={busy}
								className="h-[27px] gap-2 rounded-[5px] px-3 text-[11px] font-semibold"
							>
								{step === 3 ? "نشر الاختبار" : "التالي"}
								<Kbd className="text-white">⌘↵</Kbd>
							</Button>
						</div>
					</div>
				</form>
			</SheetContent>

			{/* منشئ الأسئلة بالذكاء الاصطناعي — يولّد معاينة ثم يضيفها للباني بعد الموافقة */}
			<AiQuizSheet
				open={aiOpen}
				onClose={() => setAiOpen(false)}
				onApply={applyAiQuestions}
			/>
		</Sheet>
	);
}

// تسمية حقل — النص ثم شارة «مطلوب» ثم أيقونة معلومات
function Label({ text, required }: { text: string; required?: boolean }) {
	return (
		<div className="flex items-center gap-1.5">
			<span className="text-[12px] font-medium text-[#08090A]">{text}</span>
			{required && (
				<span className="rounded bg-[#DC2626]/[0.06] px-1 py-px text-[9px] font-medium text-[#DC2626]">
					مطلوب
				</span>
			)}
			<IconInfoCircle className="size-3 text-[#C4C4CC]" />
		</div>
	);
}

// صفّ مبدّل بوسم ووصف
function ToggleRow({
	label,
	desc,
	checked,
	onCheckedChange,
	disabled,
}: {
	label: string;
	desc: string;
	checked: boolean;
	onCheckedChange: (v: boolean) => void;
	disabled?: boolean;
}) {
	return (
		<div className="flex items-start justify-between gap-2 rounded-[6px] border border-[#E5E5E5] bg-white px-3 py-2.5">
			<div className="flex min-w-0 flex-col gap-0.5">
				<span className="text-[12px] font-semibold text-[#08090A]">{label}</span>
				<span className="text-[10px] leading-4 text-[#9B9B9D]">{desc}</span>
			</div>
			<Switch
				checked={checked}
				onCheckedChange={onCheckedChange}
				disabled={disabled}
				aria-label={label}
			/>
		</div>
	);
}
