import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CreateLessonFormInput,
	createLessonSchema,
	type LessonFormValues,
	type LessonResponse,
	type LessonType,
	MEDIA_LESSON_TYPES,
	parseQuizContent,
	REQUIRE_LESSON_MEDIA,
} from "@sanad/contracts/runtime/server/training/training.type";
import { IconFileTextSpark, IconInfoCircle, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChangesBadge } from "@/components/common/changes-badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploadField } from "@/features/services/training/components/media-upload-field";
import { QuizBuilder } from "@/features/services/training/components/quiz-builder";
import { UnsavedChangesDialog } from "@/features/services/training/components/unsaved-changes-dialog";
import {
	LESSON_ACCEPT,
	LESSON_TYPE_ICONS,
	LESSON_TYPE_OPTIONS,
} from "@/features/services/training/data/training";
import { useUploadMedia } from "@/features/services/training/hooks/use-upload-media";
import { cn } from "@/lib/utils";

// تسميات الحقول حسب نوع الدرس
const MEDIA_LABEL: Partial<Record<LessonType, string>> = {
	VIDEO: "رفع فيديو",
	AUDIO: "رفع ملف صوتي",
	DOCUMENT: "رفع مستند",
};
const SOURCE_LABEL: Partial<Record<LessonType, string>> = {
	VIDEO: "مصدر الفيديو",
	AUDIO: "مصدر الصوت",
	DOCUMENT: "مصدر المستند",
};
const MEDIA_NOUN: Partial<Record<LessonType, string>> = {
	VIDEO: "فيديو",
	AUDIO: "ملف صوتي",
	DOCUMENT: "مستند",
};
const DURATION_LABEL: Partial<Record<LessonType, string>> = {
	VIDEO: "المدة الزمنيه للفيديو",
	AUDIO: "المدة الزمنيه للصوت",
};

const FIELD_LABELS: Record<string, string> = {
	title: "اسم الدرس",
	type: "نوع الدرس",
	description: "الوصف",
	mediaSource: "مصدر الوسيط",
	mediaKey: "الملف",
	mediaUrl: "رابط الملف",
	content: "محتوى الدرس",
	hours: "الساعات",
	minutes: "الدقائق",
	seconds: "الثواني",
	questions: "أسئلة الاختبار",
};

// تسمية الحقل — في RTL: النص ← «مطلوب» ← أيقونة المعلومات
function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
	return (
		<div className="flex items-center gap-1.5">
			<span className="text-[11px] font-medium leading-4 text-[#08090A]">{label}</span>
			{required && (
				<span className="rounded-[4px] bg-[#DC2626]/[0.06] px-[4.5px] py-[1.5px] text-[8px] font-medium leading-3 text-[#DC2626]">
					مطلوب
				</span>
			)}
			<IconInfoCircle className="size-2.5 shrink-0 text-[#9B9B9D] opacity-50" />
		</div>
	);
}

// اسم الملف المعروض من مفتاح S3: uploads/<uuid>_<name> → <name>
const fileNameFromKey = (key?: string | null) =>
	key ? (key.split("/").pop() ?? "").replace(/^[0-9a-f-]{36}_/i, "") : "";

// ساعة/دقيقة/ثانية من المدة المخزّنة بالثواني
const splitDuration = (total?: number | null) =>
	total
		? {
				hours: Math.floor(total / 3600) || undefined,
				minutes: Math.floor((total % 3600) / 60) || undefined,
				seconds: total % 60 || undefined,
			}
		: { hours: undefined, minutes: undefined, seconds: undefined };

export function LessonForm({
	onCancel,
	onSave,
	isSaving,
	lesson,
	unitTitle = "",
	restored,
	onValuesChange,
	initialType = "VIDEO",
}: {
	// يستقبل القيم غير المحفوظة عند «تجاهل وخروج» لتمكين «تراجع» من استرجاعها
	onCancel: (discarded?: CreateLessonFormInput) => void;
	onSave: (values: LessonFormValues) => Promise<unknown>;
	isSaving: boolean;
	// وجوده يعني وضع التعديل: الحقول مُعبّأة ونوع الدرس ثابت (Figma node 4573-517610)
	lesson?: LessonResponse;
	unitTitle?: string;
	restored?: CreateLessonFormInput;
	onValuesChange?: (values: CreateLessonFormInput) => void;
	initialType?: LessonType;
}) {
	const isEditing = !!lesson;
	const [confirmingDiscard, setConfirmingDiscard] = useState(false);
	const [fileName, setFileName] = useState(fileNameFromKey(lesson?.mediaKey));
	const { upload, reset: resetUpload, progress, isUploading } = useUploadMedia();
	const busy = isSaving || isUploading;

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		getValues,
		reset,
		formState: { errors, dirtyFields },
	} = useForm<CreateLessonFormInput, unknown, LessonFormValues>({
		resolver: zodResolver(createLessonSchema),
		defaultValues: lesson
			? {
					title: lesson.title,
					type: lesson.type,
					description: lesson.description ?? "",
					mediaSource: lesson.mediaSource ?? "DEVICE",
					mediaKey: lesson.mediaKey ?? undefined,
					mediaUrl: lesson.mediaUrl ?? undefined,
					content: lesson.type === "QUIZ" ? "" : (lesson.content ?? ""),
					questions: lesson.type === "QUIZ" ? parseQuizContent(lesson.content) : [],
					...splitDuration(lesson.durationSeconds),
				}
			: {
					title: "",
					type: initialType || "VIDEO",
					description: "",
					mediaSource: "DEVICE",
					// تُترك فارغة ليظهر نص ساعة/دقيقة/ثانية كـ placeholder مطابقًا للتصميم
					hours: undefined,
					minutes: undefined,
					seconds: undefined,
				},
	});

	// مزامنة initialType عند اختياره من الخارج
	useEffect(() => {
		if (!lesson && initialType) {
			setValue("type", initialType);
		}
	}, [initialType, lesson, setValue]);

	// استعادة تعديلات مُهمَلة: نضع القيم مع إبقاء defaultValues مرجعًا حتى تبقى الحقول «معدّلة»
	useEffect(() => {
		if (restored) reset(restored, { keepDefaultValues: true });
	}, [restored, reset]);

	// إرسال القيم المحدّثة للمعاينة المباشرة
	useEffect(() => {
		if (onValuesChange) {
			onValuesChange(getValues() as CreateLessonFormInput);
			const subscription = watch((values) => {
				onValuesChange(values as CreateLessonFormInput);
			});
			return () => subscription.unsubscribe();
		}
	}, [watch, getValues, onValuesChange]);

	// عدّاد التعديلات في الشارة، وهو أيضًا شرط تفعيل زر الحفظ
	const editCount = Object.keys(dirtyFields).length;

	const type = watch("type");
	const mediaSource = watch("mediaSource");
	const questions = watch("questions") ?? [];

	// أول سؤال يبدأ بخيار واحد محدَّد كإجابة صحيحة
	const addFirstQuestion = () =>
		setValue(
			"questions",
			[{ text: "", answerType: "SINGLE", options: [{ text: "", correct: true }] }],
			{ shouldDirty: true, shouldValidate: true },
		);

	const needsMedia = MEDIA_LESSON_TYPES.includes(type);
	const showDuration = type === "VIDEO" || type === "AUDIO";

	// في وضع التعديل التسميات تتبع نوع المادة نفسها («عنوان الملف»، «وصف الصوت»...)
	const mediaNoun = MEDIA_NOUN[type];
	const titleLabel = isEditing && mediaNoun ? "عنوان الملف" : "اسم الدرس";
	const sourceLabel =
		isEditing && mediaNoun ? `مصدر ملف ${mediaNoun}` : (SOURCE_LABEL[type] ?? "مصدر الملف");
	const descriptionLabel =
		type === "QUIZ"
			? "وصف التقييم"
			: isEditing && mediaNoun
				? `وصف ${mediaNoun}`
				: "وصف الدرس";

	const fieldLabels: Record<string, string> = {
		...FIELD_LABELS,
		title: titleLabel,
		mediaSource: sourceLabel,
		description: descriptionLabel,
	};

	// يرفع الملف إلى S3 مع تتبّع التقدّم ثم يخزّن المفتاح في النموذج
	const handleFile = async (file: File | undefined) => {
		if (!file) return;
		setFileName(file.name);
		try {
			const uploaded = await upload(file);
			setValue("mediaKey", uploaded.key, { shouldDirty: true, shouldValidate: true });
		} catch {
			// الإلغاء أو الفشل يعيد الحقل لحالته الفارغة
			setFileName("");
			setValue("mediaKey", undefined, { shouldDirty: true, shouldValidate: true });
		}
	};

	// إزالة الملف (أو إلغاء الرفع الجاري)
	const clearFile = () => {
		resetUpload();
		setFileName("");
		setValue("mediaKey", undefined, { shouldDirty: true, shouldValidate: true });
	};

	const changedFields = Object.keys(dirtyFields).map((key) => fieldLabels[key] ?? key);

	const executeSubmit = handleSubmit(
		(values) => onSave(values),
		(validationErrors) => {
			console.error("LessonForm validation errors:", validationErrors);
			const firstKey = Object.keys(validationErrors)[0] as keyof typeof validationErrors;
			const firstError = validationErrors[firstKey];
			const rootMsg = (firstError as { root?: { message?: string } })?.root?.message;
			const message =
				firstError?.message ||
				rootMsg ||
				`يرجى التحقق من حقل: ${fieldLabels[firstKey] ?? String(firstKey)}`;
			toast.error(String(message));
		},
	);

	const submit = () => {
		if (isEditing && editCount === 0) {
			toast.info("لم تقم بإجراء أي تغييرات على الدرس لحفظها");
			return;
		}
		return executeSubmit();
	};

	// الخروج من التعديل يمرّ بتأكيد إن كانت هناك تغييرات غير محفوظة
	const handleCancel = () => {
		if (isEditing && editCount > 0) setConfirmingDiscard(true);
		else onCancel();
	};
	const saveLabel = isEditing
		? "حفظ تغييرات الدرس"
		: type === "QUIZ"
			? "حفظ التقييم"
			: "حفظ الدرس";

	return (
		<div className="flex flex-col gap-3">
			{/* رأس وضع التعديل — في RTL: العنوان يمينًا وشارة عدد مرات التعديل المحفوظة يسارًا */}
			{isEditing && (
				<div className="flex items-center gap-1.5">
					<span className="text-[11px] font-medium leading-3 text-[#08090A]">تعديل الدرس</span>
					<ChangesBadge count={lesson?.editsCount ?? 0} />
				</div>
			)}

			<div className="flex flex-col gap-3.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white p-3 shadow-2xs">
				{/* 1. اسم الدرس أولاً */}
				<Field
					className="gap-[5px]"
					data-invalid={!!errors.title}
				>
					<FieldLabel
						label={type === "QUIZ" ? "عنوان التقييم" : titleLabel}
						required
					/>
					<Input
						placeholder={
							type === "QUIZ"
								? "مثال: تقييم سريع عن الوحدة الأولى"
								: "مثال: خطوات تجهيز قاعة العمليات قبل الجراحة"
						}
						className="h-[34px] text-[11px]"
						aria-invalid={!!errors.title}
						disabled={busy}
						{...register("title")}
					/>
					<FieldError errors={[errors.title]} />
				</Field>

				{/* 2. نوع ومواد المحتوى التعليمي ثانياً */}
				<div className={cn("flex flex-col gap-2", isEditing && "hidden")}>
					<FieldLabel label="نوع ومواد المحتوى التعليمي للدرس" />
					<Controller
						name="type"
						control={control}
						render={({ field }) => (
							<div className="flex items-start gap-[7px]">
								{LESSON_TYPE_OPTIONS.map((opt) => {
									const Icon = LESSON_TYPE_ICONS[opt.value];
									const active = field.value === opt.value;
									return (
										<button
											key={opt.value}
											type="button"
											onClick={() => field.onChange(opt.value)}
											className={cn(
												"flex h-[36px] flex-1 items-center justify-center gap-1.5 rounded-[4px] border-[0.75px] text-[12px] transition-all cursor-pointer",
												active
													? "border-[#6366F1] bg-[#6366F1]/10 text-[#4F46E5] font-semibold shadow-2xs ring-1 ring-[#6366F1]/30"
													: "border-[#E5E5E5] bg-white text-[#08090A] hover:bg-[#FAFAFA]",
											)}
										>
											<span>{opt.label}</span>
											<Icon className="size-[17px] shrink-0" />
										</button>
									);
								})}
							</div>
						)}
					/>
				</div>

				{/* 3. تفاصيل المحتوى ثالثاً */}
				{type === "QUIZ" ? (
					/* باني التقييم — الحالة الفارغة حتى يُضاف أول سؤال */
					questions.length === 0 ? (
						<div className="flex h-[161px] flex-col items-center justify-center gap-[11px] rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-[#9B9B9D]/[0.09] px-1.5 py-[4.5px]">
							<span className="flex size-[29px] items-center justify-center rounded-full border border-[#E5E5E5] bg-[#ECECED]">
								<IconFileTextSpark className="size-[15px] text-[#9B9B9D]" />
							</span>
							<div className="flex flex-col items-center gap-2">
								<p className="text-[12px] font-semibold leading-[10px] text-[#121217]">
									باني التقييم
								</p>
								<p className="text-[10px] leading-[10px] text-[#121217]">
									لا يوجد أي أسئلة حتي الأن، ابدأ بإضافة أول سؤال
								</p>
							</div>
							<Button
								type="button"
								variant="outline"
								onClick={addFirstQuestion}
								disabled={busy}
								className="h-[26px] gap-1 rounded-[4px] px-[7px] text-[12px] font-medium cursor-pointer"
							>
								إضافة أول سؤال
								<IconPlus className="size-[15px]" />
							</Button>
						</div>
					) : (
						<QuizBuilder
							control={control}
							register={register}
							setValue={setValue}
							getValues={getValues}
							errors={errors}
							disabled={busy}
						/>
					)
				) : (
					<>
						{/* الوسيط — في RTL: المصدر يمينًا (137px) وحقل الرفع يسارًا */}
						{needsMedia && (
							<div className="flex items-start gap-[5px]">
								<div className="flex w-[137px] shrink-0 flex-col gap-1">
									<span className="text-[12px] font-semibold leading-4 text-[#08090A]">
										{sourceLabel}
									</span>
									<Controller
										name="mediaSource"
										control={control}
										render={({ field }) => (
											<Select
												dir="rtl"
												value={field.value}
												onValueChange={field.onChange}
												disabled={busy}
											>
												<SelectTrigger className="h-[34px]! w-full text-[11px]">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="DEVICE">رفع من الجهاز</SelectItem>
													<SelectItem value="URL">رابط خارجي</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								<Field
									className="flex-1 gap-[5px]"
									data-invalid={!!errors.mediaKey}
								>
									<FieldLabel
										label={MEDIA_LABEL[type] ?? "رفع ملف"}
										required={REQUIRE_LESSON_MEDIA}
									/>
									{mediaSource === "URL" ? (
										<Input
											placeholder="ألصق رابط الملف هنا..."
											className="h-[34px] text-[11px]"
											disabled={busy}
											{...register("mediaUrl")}
										/>
									) : (
										<MediaUploadField
											fileName={fileName}
											progress={progress}
											isUploading={isUploading}
											placeholder={`أضف ${MEDIA_NOUN[type] ?? "ملف"} بسحب والإفلات أو الضغط علي الأيقون للتحميل...`}
											accept={LESSON_ACCEPT[type]}
											disabled={busy}
											onPick={handleFile}
											onClear={clearFile}
										/>
									)}
									<FieldError errors={[errors.mediaKey]} />
								</Field>
							</div>
						)}

						{/* نص الدرس */}
						{type === "TEXT" && (
							<Field
								className="gap-[5px]"
								data-invalid={!!errors.content}
							>
								<FieldLabel
									label="محتوى الدرس"
									required
								/>
								<Textarea
									placeholder="اكتب محتوى الدرس هنا..."
									className="min-h-[120px] text-[13px]"
									disabled={busy}
									{...register("content")}
								/>
								<FieldError errors={[errors.content]} />
							</Field>
						)}

						{/* المدة الزمنية — في RTL: ساعة يمينًا ثم دقيقة ثم ثانية */}
						{showDuration && (
							<div className="flex flex-col gap-[5px]">
								<FieldLabel
									label={DURATION_LABEL[type] ?? "المدة الزمنيه"}
									required
								/>
								<div className="flex items-start gap-[5px]">
									{(
										[
											["hours", "ساعة", 99],
											["minutes", "دقيقة", 59],
											["seconds", "ثانية", 59],
										] as const
									).map(([name, label, max]) => (
										<Input
											key={name}
											type="number"
											min={0}
											max={max}
											placeholder={label}
											aria-label={label}
											className="h-[34px] flex-1 text-[11px]"
											disabled={busy}
											{...register(name)}
										/>
									))}
								</div>
							</div>
						)}
					</>
				)}

				{/* 4. وصف الدرس */}
				<Field className="gap-[5px]">
					<span className="text-[12px] font-medium leading-[18px] text-[#08090A]">
						{descriptionLabel}
					</span>
					<Textarea
						placeholder="أضف ملخصًا قصيرًا يوضح ما سيتعلمه المتدرب من هذا الدرس...."
						className="min-h-[74px] text-[13px]"
						disabled={busy}
						{...register("description")}
					/>
				</Field>

				{/* 5. أزرار البطاقة — في RTL: إلغاء يمين، حفظ الدرس يسار */}
				<div className="sticky bottom-0 z-20 -mx-3 -mb-3 flex items-center justify-between border-t border-[#E5E5E5] bg-white px-3 py-2.5 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] rounded-b-[4px]">
					<Button
						type="button"
						variant="outline"
						onClick={handleCancel}
						disabled={busy}
						className="h-[27px] rounded-[4px] px-3 text-[11px] font-medium cursor-pointer"
					>
						إلغاء وتراجع
					</Button>
					<Button
						type="button"
						onClick={submit}
						disabled={busy}
						className={cn(
							"h-[28px] rounded-[4px] px-3.5 text-[11px] font-semibold text-white cursor-pointer bg-[#4F6AE0] hover:bg-[#4F6AE0]/90 transition-all",
							isEditing && editCount === 0 && "opacity-60",
						)}
					>
						{busy ? (
							<span className="flex items-center gap-1.5">
								<Spinner className="size-3.5" />
								<span>جارٍ الحفظ...</span>
							</span>
						) : (
							saveLabel
						)}
					</Button>
				</div>
			</div>

			{isEditing && lesson && (
				<UnsavedChangesDialog
					open={confirmingDiscard}
					onOpenChange={setConfirmingDiscard}
					unitTitle={unitTitle}
					lessonTitle={lesson.title}
					changedFields={changedFields}
					onSave={submit}
					onDiscard={() => onCancel(getValues())}
				/>
			)}
		</div>
	);
}
