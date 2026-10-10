import { IconCheck, IconLink, IconSparkles, IconX } from "@tabler/icons-react";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAiQuiz } from "@/features/services/training/hooks/use-ai-quiz";
import { cn } from "@/lib/utils";
import type {
	AiQuizOptions,
	AiQuizPreview,
	QuizAnswerType,
	QuizQuestionFormInput,
} from "@/server/quizzes/quizzes.type";

const QUESTION_COUNT_OPTIONS = [3, 5, 8, 10, 15, 20] as const;

const DIFFICULTY_OPTIONS: {
	value: NonNullable<AiQuizOptions["difficulty"]>;
	label: string;
}[] = [
	{ value: "BEGINNER", label: "مبتدئ" },
	{ value: "INTERMEDIATE", label: "متوسط" },
	{ value: "ADVANCED", label: "متقدم" },
];

const LANG_OPTIONS: { value: NonNullable<AiQuizOptions["language"]>; label: string }[] = [
	{ value: "AR", label: "العربية" },
	{ value: "EN", label: "الإنجليزية" },
];

// أنواع الأسئلة الثلاثة — يختار المستخدم أيّها يولّد
const TYPE_OPTIONS: { value: QuizAnswerType; label: string; desc: string }[] = [
	{ value: "SINGLE", label: "اختيار واحد", desc: "خيار واحد صحيح من عدة خيارات." },
	{ value: "MULTIPLE", label: "اختيار متعدد", desc: "أكثر من إجابة صحيحة." },
	{ value: "TEXT", label: "إجابة نصّية", desc: "يكتب الموظف إجابته، مع إجابة نموذجية." },
];

const TYPE_LABEL: Record<QuizAnswerType, string> = {
	SINGLE: "اختيار واحد",
	MULTIPLE: "اختيار متعدد",
	TEXT: "إجابة نصّية",
};

const DEFAULT_OPTIONS: AiQuizOptions = {
	questionCount: 5,
	difficulty: "BEGINNER",
	language: "AR",
	answerTypes: ["SINGLE", "MULTIPLE", "TEXT"],
	pointsPerQuestion: 1,
	researchTopic: false,
};

// لوحة «إنشاء اختبار بالذكاء الاصطناعي» — نفس تدفّق منشئ الدورة:
// موجز + إعدادات ← توليد ← معاينة ← «إضافة الأسئلة» تضيفها لباني الاختبار (بلا حفظ مباشر).
export function AiQuizSheet({
	open,
	onClose,
	onApply,
}: {
	open: boolean;
	onClose: () => void;
	// تُستدعى بالأسئلة المولّدة بعد موافقة المستخدم — اللوحة الأمّ تضيفها للنموذج
	onApply: (
		questions: QuizQuestionFormInput[],
		meta: { title: string; description: string },
	) => void;
}) {
	const { generate, isGenerating } = useAiQuiz();

	const [brief, setBrief] = useState("");
	const [opts, setOpts] = useState<AiQuizOptions>(DEFAULT_OPTIONS);
	const [preview, setPreview] = useState<AiQuizPreview | null>(null);

	const setOpt = <K extends keyof AiQuizOptions>(key: K, value: AiQuizOptions[K]) =>
		setOpts((p) => ({ ...p, [key]: value }));

	const toggleType = (type: QuizAnswerType) =>
		setOpts((p) => {
			const current = p.answerTypes ?? [];
			const next = current.includes(type)
				? current.filter((t) => t !== type)
				: [...current, type];
			// نمنع تفريغ الأنواع كليًّا — لا معنى لتوليد بلا نوع
			return next.length ? { ...p, answerTypes: next } : p;
		});

	const reset = () => {
		setBrief("");
		setOpts(DEFAULT_OPTIONS);
		setPreview(null);
	};

	const close = () => {
		reset();
		onClose();
	};

	const runGenerate = async () => {
		if (!brief.trim()) return;
		try {
			const result = await generate({ brief: brief.trim(), options: opts });
			setPreview(result);
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	// الموافقة — نحوّل المعاينة لشكل نموذج الباني ونمرّرها للوحة الأمّ
	const confirmApply = () => {
		if (!preview) return;
		const questions: QuizQuestionFormInput[] = preview.questions.map((q) => ({
			text: q.text,
			answerType: q.answerType,
			points: q.points,
			options: q.answerType === "TEXT" ? [] : q.options.map((o) => ({ ...o })),
			answerText: q.answerType === "TEXT" ? q.answerText : "",
		}));
		onApply(questions, { title: preview.title, description: preview.description });
		toast.success(`تمت إضافة ${questions.length} سؤالًا`);
		close();
	};

	const totalPoints = preview?.questions.reduce((n, q) => n + q.points, 0) ?? 0;

	return (
		// المحتوى يُطبع في body خارج شجرة الصفحة، وRadix لا يقرأ dir من الـ DOM — لذا يُمرَّر صراحةً
		<Sheet
			open={open}
			onOpenChange={(next) => {
				if (!next) close();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				// بلا تعتيم — لوحة إعدادات ضيّقة (460) تقف يمين لوحة الاختبار بلا تضييقها.
				// 1588 = left-2 (8px) + أقصى عرض للوحة الاختبار في خطوة الأسئلة (1574px) + فراغ 6px.
				showOverlay={false}
				className="flex w-full! flex-col gap-0 border-e-0 border-s-[0.75px] border-s-[#E5E5E5] p-0 shadow-[0_0_40px_rgba(0,0,0,0.16)] left-[min(1588px,calc(100vw-468px))]! sm:max-w-[460px]!"
			>
				<div
					dir="rtl"
					className="flex min-h-0 flex-1 flex-col"
				>
					{/* الهيدر */}
					<div className="flex h-11 shrink-0 items-center justify-between border-b border-[#E5E5E5] px-3">
						<SheetTitle className="flex items-center gap-1.5 text-[13px] font-bold text-[#08090A]">
							<span className="flex size-6 items-center justify-center rounded-[6px] bg-primary/10 text-primary">
								<IconSparkles className="size-3.5" />
							</span>
							إنشاء اختبار بالذكاء الاصطناعي
						</SheetTitle>

						<button
							type="button"
							onClick={close}
							aria-label="إغلاق"
							className="flex size-7 items-center justify-center rounded-[6px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconX className="size-[15px]" />
						</button>
					</div>

					{preview ? (
						/* ===== المعاينة ===== */
						<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
							<div className="flex items-start gap-2 rounded-[6px] border border-primary/20 bg-primary/5 px-3 py-2.5">
								<IconSparkles className="mt-0.5 size-4 shrink-0 text-primary" />
								<div className="flex flex-col gap-0.5">
									<span className="text-[12px] font-semibold text-primary">
										تم توليد {preview.questions.length} سؤالًا ({totalPoints} درجة)
									</span>
									<span className="text-[11px] leading-5 text-[#6B6B67]">
										راجع الأسئلة ثم اضغط «إضافة الأسئلة» لإضافتها إلى باني الاختبار.
									</span>
								</div>
							</div>

							{/* ملخّص الاختبار المقترح */}
							<div className="flex flex-col gap-1">
								<span className="text-[14px] font-bold text-[#08090A]">{preview.title}</span>
								{preview.description && (
									<p className="text-[12px] leading-5 text-[#6B6B67]">{preview.description}</p>
								)}
							</div>

							{/* الأسئلة */}
							{preview.questions.map((q, qi) => (
								<div
									key={`${q.text}-${qi}`}
									className="flex flex-col gap-2 rounded-[8px] border border-[#E5E5E5] p-3"
								>
									<div className="flex items-start justify-between gap-2">
										<span className="text-[12px] font-bold text-[#08090A]">
											<span className="text-[#9B9B9D] tabular-nums">{qi + 1}. </span>
											{q.text}
										</span>
										<span className="shrink-0 rounded-[4px] bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
											{TYPE_LABEL[q.answerType]}
										</span>
									</div>

									{q.answerType === "TEXT" ? (
										<div className="rounded-[6px] bg-[#FAFAFC] px-2.5 py-1.5 text-[11px] text-[#08090A]">
											<span className="text-[#9B9B9D]">الإجابة النموذجية: </span>
											{q.answerText || "—"}
										</div>
									) : (
										<div className="flex flex-col gap-1">
											{q.options.map((o, oi) => (
												<div
													key={`${o.text}-${oi}`}
													className={cn(
														"flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-[11px]",
														o.correct
															? "bg-primary/10 font-medium text-primary"
															: "bg-[#FAFAFC] text-[#08090A]",
													)}
												>
													{o.correct && <IconCheck className="size-3 shrink-0" />}
													{o.text}
												</div>
											))}
										</div>
									)}

									{q.explanation && (
										<p className="text-[10px] leading-4 text-[#9B9B9D]">{q.explanation}</p>
									)}
								</div>
							))}

							{/* رجوع للإعدادات لإعادة التوليد */}
							<button
								type="button"
								onClick={() => setPreview(null)}
								className="flex h-8 w-fit items-center gap-1.5 rounded-[6px] border-[0.75px] border-[#E5E5E5] px-3 text-[12px] font-medium text-[#08090A] hover:bg-muted"
							>
								رجوع للإعدادات
							</button>
						</div>
					) : (
						/* ===== الإعدادات ===== */
						<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
							{/* الموجز */}
							<div className="flex flex-col gap-2">
								<span className="text-[12px] font-semibold text-[#08090A]">
									ما موضوع الاختبار؟
								</span>
								<Textarea
									autoFocus
									value={brief}
									onChange={(e) => setBrief(e.target.value)}
									placeholder="مثال: اختبار لفريق الاستقبال حول التعامل مع حالات الطوارئ وأولويات الفرز..."
									className="min-h-[120px] text-[13px]"
									disabled={isGenerating}
								/>
								<p className="text-[11px] leading-5 text-[#9B9B9D]">
									اكتب موضوع الاختبار، اضبط الإعدادات بالأسفل، ثم اضغط «توليد الأسئلة» لعرض
									معاينة قبل الإضافة.
								</p>
							</div>

							{/* إعدادات التوليد */}
							<div className="flex flex-col gap-3">
								<span className="text-[12px] font-bold text-[#08090A]">إعدادات التوليد</span>

								<div className="grid grid-cols-2 gap-3">
									<SelectRow
										label="عدد الأسئلة"
										desc="كم سؤالًا تريد توليده."
										value={String(opts.questionCount ?? "")}
										onChange={(v) => setOpt("questionCount", Number(v))}
										options={QUESTION_COUNT_OPTIONS.map((n) => ({
											value: String(n),
											label: String(n),
										}))}
									/>
									<SelectRow
										label="مستوى الصعوبة"
										desc="مستوى خبرة الموظفين المستهدفين."
										value={opts.difficulty ?? ""}
										onChange={(v) => setOpt("difficulty", v as AiQuizOptions["difficulty"])}
										options={DIFFICULTY_OPTIONS.map((o) => ({ ...o }))}
									/>
									<SelectRow
										label="لغة الأسئلة"
										desc="لغة توليد الأسئلة."
										value={opts.language ?? ""}
										onChange={(v) => setOpt("language", v as AiQuizOptions["language"])}
										options={LANG_OPTIONS.map((o) => ({ ...o }))}
									/>
									<SelectRow
										label="درجة كل سؤال"
										desc="الدرجة الافتراضية للسؤال."
										value={String(opts.pointsPerQuestion ?? "")}
										onChange={(v) => setOpt("pointsPerQuestion", Number(v))}
										options={[1, 2, 3, 5, 10].map((n) => ({
											value: String(n),
											label: String(n),
										}))}
									/>
								</div>

								{/* أنواع الأسئلة — الأنواع الثلاثة المتاحة في الباني */}
								<div className="flex flex-col gap-2 rounded-[6px] border border-[#E5E5E5] bg-white px-3 py-2.5">
									<div className="flex flex-col gap-0.5">
										<span className="text-[12px] font-semibold text-[#08090A]">
											أنواع الأسئلة
										</span>
										<span className="text-[10px] leading-4 text-[#9B9B9D]">
											يولّد الذكاء من الأنواع المفعّلة فقط.
										</span>
									</div>
									{TYPE_OPTIONS.map((t) => (
										<ToggleRow
											key={t.value}
											label={t.label}
											desc={t.desc}
											checked={(opts.answerTypes ?? []).includes(t.value)}
											onCheckedChange={() => toggleType(t.value)}
										/>
									))}
								</div>

								{/* ===== متقدّم ===== */}
								<div className="flex items-center gap-2 pt-1">
									<span className="text-[11px] font-bold text-[#6B6B67]">متقدّم</span>
									<span className="h-px flex-1 bg-[#E5E5E5]" />
								</div>
								<ToggleRow
									icon={<IconLink className="size-3.5 text-primary" />}
									label="بحث عن الموضوع في الويب"
									desc="يبحث الذكاء عن معلومات حديثة عن الموضوع قبل صياغة الأسئلة (قد يضيف وقتًا للتوليد)."
									checked={opts.researchTopic ?? false}
									onCheckedChange={(v) => setOpt("researchTopic", v)}
								/>
							</div>
						</div>
					)}

					{/* التذييل — الإجراء الأساسي أسفل اللوحة */}
					<div className="flex shrink-0 items-center justify-end border-t border-[#E5E5E5] px-3 py-2.5">
						{preview ? (
							<PrimaryBtn
								onClick={confirmApply}
								icon={<IconCheck className="size-3.5" />}
								label={`إضافة ${preview.questions.length} سؤالًا`}
							/>
						) : (
							<PrimaryBtn
								onClick={runGenerate}
								disabled={!brief.trim() || isGenerating}
								icon={<IconSparkles className="size-3.5" />}
								label={isGenerating ? "جارٍ التوليد..." : "توليد الأسئلة"}
							/>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

// صفّ اختيار من قائمة — الوسم والوصف ثم القائمة بعرض كامل
function SelectRow({
	label,
	desc,
	value,
	onChange,
	options,
}: {
	label: string;
	desc: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}) {
	return (
		<div className="flex flex-col gap-1.5 rounded-[6px] border border-[#E5E5E5] bg-white px-3 py-2.5">
			<div className="flex flex-col gap-0.5">
				<span className="text-[12px] font-semibold text-[#08090A]">{label}</span>
				<span className="text-[10px] leading-4 text-[#9B9B9D]">{desc}</span>
			</div>
			<Select
				dir="rtl"
				value={value}
				onValueChange={onChange}
			>
				<SelectTrigger className="h-8! w-full text-[12px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{options.map((o) => (
						<SelectItem
							key={o.value}
							value={o.value}
						>
							{o.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

// صفّ مبدّل (Switch) بوسم ووصف
function ToggleRow({
	label,
	desc,
	checked,
	onCheckedChange,
	icon,
}: {
	label: string;
	desc: string;
	checked: boolean;
	onCheckedChange: (value: boolean) => void;
	icon?: ReactNode;
}) {
	return (
		<div className="flex items-start justify-between gap-2 rounded-[6px] border border-[#E5E5E5] bg-white px-3 py-2.5">
			<div className="flex min-w-0 flex-col gap-0.5">
				<span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#08090A]">
					{icon}
					{label}
				</span>
				<span className="text-[10px] leading-4 text-[#9B9B9D]">{desc}</span>
			</div>
			<Switch
				checked={checked}
				onCheckedChange={onCheckedChange}
				aria-label={label}
			/>
		</div>
	);
}

function PrimaryBtn({
	onClick,
	disabled,
	label,
	icon,
}: {
	onClick: () => void;
	disabled?: boolean;
	label: string;
	icon: ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"flex h-[27px] items-center gap-1.5 rounded-[6px] px-3 text-[11px] font-semibold primarytransition-colors",
				disabled ? "cursor-not-allowed bg-primary/40" : "bg-primary hover:bg-primary/90",
			)}
		>
			{icon}
			{label}
		</button>
	);
}
