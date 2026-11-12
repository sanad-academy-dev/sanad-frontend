import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CreateLessonFormInput,
	createLessonSchema,
	type LessonContentItem,
	type LessonFormValues,
	type LessonResponse,
	type LessonType,
	MEDIA_LESSON_TYPES,
	parseQuizContent,
	REQUIRE_LESSON_MEDIA,
} from "@sanad/contracts/runtime/server/training/training.type";
import { IconFileTextSpark, IconInfoCircle, IconPlus } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { CourseLessonContentsField } from "@/features/services/training/components/course-lesson-contents-field";
import {
	CoursePageBlocksField,
	readPages,
} from "@/features/services/training/components/course-page-inline-editor";
import { MediaUploadField } from "@/features/services/training/components/media-upload-field";
import { QuizBuilder } from "@/features/services/training/components/quiz-builder";
import { UnsavedChangesDialog } from "@/features/services/training/components/unsaved-changes-dialog";
import {
	LESSON_ACCEPT,
	LESSON_TYPE_ICONS,
	LESSON_TYPE_OPTIONS,
} from "@/features/services/training/data/training";
import { useUploadMedia } from "@/features/services/training/hooks/use-upload-media";
import {
	clearLessonDraft,
	getLessonDraftKey,
	hasMeaningfulLessonInput,
	readLessonDraft,
	type StoredLessonDraft,
	writeLessonDraft,
} from "@/features/services/training/utils/lesson-draft";
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
	onKeepDraft,
	onSave,
	isSaving,
	lesson,
	courseId,
	unitId,
	unitTitle = "",
	restored,
	onValuesChange,
	onDirtyChange,
	onActivePageChange,
	cancelSignal = 0,
	initialType = "VIDEO",
}: {
	// يستقبل القيم غير المحفوظة عند «تجاهل وخروج» لتمكين «تراجع» من استرجاعها
	onCancel: (discarded?: CreateLessonFormInput) => void;
	// الاحتفاظ بالمسودة في التخزين المحلي والخروج دون حذفها
	onKeepDraft?: () => void;
	onSave: (values: LessonFormValues) => Promise<unknown>;
	isSaving: boolean;
	// وجوده يعني وضع التعديل: الحقول مُعبّأة ونوع الدرس ثابت (Figma node 4573-517610)
	lesson?: LessonResponse;
	courseId?: string | null;
	unitId?: string;
	unitTitle?: string;
	restored?: CreateLessonFormInput;
	onValuesChange?: (values: CreateLessonFormInput) => void;
	onDirtyChange?: (hasUnsaved: boolean) => void;
	onActivePageChange?: (pageId: string) => void;
	cancelSignal?: number;
	initialType?: LessonType;
}) {
	const isEditing = !!lesson;
	const draftKey = getLessonDraftKey({ lessonId: lesson?.id, courseId, unitId });
	const [initialDraft] = useState<StoredLessonDraft | null>(() =>
		restored ? null : readLessonDraft(draftKey),
	);
	const [restoredDraftBanner, setRestoredDraftBanner] = useState(() => Boolean(initialDraft));
	const [confirmingDiscard, setConfirmingDiscard] = useState(false);
	const [fileName, setFileName] = useState(() =>
		fileNameFromKey(initialDraft?.values.mediaKey ?? lesson?.mediaKey),
	);
	const { upload, reset: resetUpload, progress, isUploading } = useUploadMedia();
	const busy = isSaving || isUploading;

	const baselineValues: CreateLessonFormInput = lesson
		? {
				title: lesson.title,
				type: lesson.type,
				description: lesson.description ?? "",
				mediaSource: lesson.mediaSource ?? "DEVICE",
				mediaKey: lesson.mediaKey ?? undefined,
				mediaUrl: lesson.mediaUrl ?? undefined,
				content: lesson.type === "QUIZ" ? "" : (lesson.content ?? ""),
				questions: lesson.type === "QUIZ" ? parseQuizContent(lesson.content) : [],
				contents: lesson.contents?.slice(1) ?? [],
				...splitDuration(lesson.durationSeconds),
			}
		: {
				title: "",
				type: initialType || "VIDEO",
				description: "",
				mediaSource: "DEVICE",
				contents: [],
				// تُترك فارغة ليظهر نص ساعة/دقيقة/ثانية كـ placeholder مطابقًا للتصميم
				hours: undefined,
				minutes: undefined,
				seconds: undefined,
			};

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
		// في وضع الإضافة نستعيد المسودة مباشرة؛ وفي وضع التعديل نُبقي القيم الأصلية مرجعًا لـ dirtyFields
		defaultValues: !isEditing && initialDraft ? initialDraft.values : baselineValues,
	});

	const [hasUnsaved, setHasUnsaved] = useState(() =>
		initialDraft ? hasMeaningfulLessonInput(initialDraft.values, lesson) : false,
	);
	const hasUnsavedRef = useRef(hasUnsaved);
	hasUnsavedRef.current = hasUnsaved;
	const skipUnmountDraftRef = useRef(false);
	const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const appliedEditDraftRef = useRef(false);
	const lastCancelSignalRef = useRef(cancelSignal);

	// تطبيق مسودة التعديل المحفوظة محليًا مع الحفاظ على defaultValues المرجعية
	useEffect(() => {
		if (!isEditing || !initialDraft || appliedEditDraftRef.current || restored) return;
		appliedEditDraftRef.current = true;
		reset(initialDraft.values, { keepDefaultValues: true });
		setHasUnsaved(hasMeaningfulLessonInput(initialDraft.values, lesson));
		onValuesChange?.({ ...initialDraft.values });
	}, [isEditing, initialDraft, restored, reset, lesson, onValuesChange]);

	// مزامنة initialType عند اختياره من الخارج (ما لم توجد مسودة محفوظة لنوع آخر)
	useEffect(() => {
		if (!lesson && initialType && !initialDraft) {
			setValue("type", initialType);
		}
	}, [initialType, lesson, initialDraft, setValue]);

	// استعادة تعديلات مُهمَلة: نضع القيم مع إبقاء defaultValues مرجعًا حتى تبقى الحقول «معدّلة»
	useEffect(() => {
		if (restored) {
			reset(restored, { keepDefaultValues: true });
			setHasUnsaved(hasMeaningfulLessonInput(restored, lesson));
			onValuesChange?.({ ...restored });
		}
	}, [restored, reset, lesson, onValuesChange]);

	const flushDraft = useCallback(
		(values: CreateLessonFormInput) => {
			if (skipUnmountDraftRef.current) return;
			if (!hasMeaningfulLessonInput(values, lesson)) {
				clearLessonDraft(draftKey);
				return;
			}
			writeLessonDraft(draftKey, {
				values,
				unitId,
				mode: isEditing ? "edit" : "add",
				lessonId: lesson?.id,
				updatedAt: Date.now(),
			});
		},
		[draftKey, isEditing, lesson, unitId],
	);

	// إرسال القيم المحدّثة للمعاينة المباشرة وحفظها تلقائيًا كمسودة محلية
	useEffect(() => {
		const initialValues = { ...(getValues() as CreateLessonFormInput) };
		onValuesChange?.(initialValues);
		const subscription = watch(() => {
			const current = { ...(getValues() as CreateLessonFormInput) };
			onValuesChange?.(current);
			const dirty = hasMeaningfulLessonInput(current, lesson);
			setHasUnsaved(dirty);
			if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
			if (!dirty) {
				clearLessonDraft(draftKey);
				setRestoredDraftBanner(false);
				return;
			}
			draftTimerRef.current = setTimeout(() => {
				flushDraft(current);
			}, 300);
		});
		return () => {
			subscription.unsubscribe();
		};
	}, [watch, getValues, onValuesChange, lesson, draftKey, flushDraft]);

	// إبلاغ المكوّن الأب بحالة التغييرات غير المحفوظة
	useEffect(() => {
		onDirtyChange?.(hasUnsaved);
	}, [hasUnsaved, onDirtyChange]);

	// حماية ضد إعادة تحميل الصفحة أو إغلاق التبويب بالخطأ + تفريغ فوري للمسودة عند المغادرة/فكّ التحميل
	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (!hasUnsavedRef.current) return;
			flushDraft(getValues() as CreateLessonFormInput);
			event.preventDefault();
			event.returnValue = "";
		};
		const handlePageHide = () => {
			if (hasUnsavedRef.current) {
				flushDraft(getValues() as CreateLessonFormInput);
			}
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		window.addEventListener("pagehide", handlePageHide);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
			window.removeEventListener("pagehide", handlePageHide);
			if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
			if (!skipUnmountDraftRef.current && hasUnsavedRef.current) {
				flushDraft(getValues() as CreateLessonFormInput);
			}
		};
	}, [flushDraft, getValues]);

	// عدّاد التعديلات في الشارة، وهو أيضًا شرط تفعيل زر الحفظ
	const editCount = Object.keys(dirtyFields).length;

	const type = watch("type");
	const mediaSource = watch("mediaSource");
	const contentValue = watch("content");
	const lessonContents = watch("contents") ?? [];
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
	const titleLabel = type === "QUIZ" ? "عنوان التقييم" : "اسم الدرس";
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
		async (values) => {
			skipUnmountDraftRef.current = true;
			try {
				const result = await onSave(values);
				if (result === false) {
					skipUnmountDraftRef.current = false;
					return;
				}
				if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
				clearLessonDraft(draftKey);
				setRestoredDraftBanner(false);
				setHasUnsaved(false);
			} catch (err) {
				skipUnmountDraftRef.current = false;
				throw err;
			}
		},
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
		if (isEditing && !hasUnsaved && editCount === 0) {
			toast.info("لم تقم بإجراء أي تغييرات على الدرس لحفظها");
			return;
		}
		return executeSubmit();
	};

	const discardDraftAndReset = () => {
		skipUnmountDraftRef.current = false;
		if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
		clearLessonDraft(draftKey);
		reset(baselineValues);
		setFileName(fileNameFromKey(lesson?.mediaKey));
		setRestoredDraftBanner(false);
		setHasUnsaved(false);
		onValuesChange?.(baselineValues);
		toast.info("تم مسح المسودة غير المحفوظة");
	};

	// الخروج مع وجود محتوى غير محفوظ يفتح تأكيد الخروج (في وضعي الإضافة والتعديل)
	const handleCancel = useCallback(() => {
		if (hasUnsavedRef.current || (isEditing && editCount > 0)) {
			setConfirmingDiscard(true);
		} else {
			skipUnmountDraftRef.current = true;
			clearLessonDraft(draftKey);
			onCancel();
		}
	}, [draftKey, editCount, isEditing, onCancel]);

	useEffect(() => {
		if (cancelSignal === lastCancelSignalRef.current) return;
		lastCancelSignalRef.current = cancelSignal;
		handleCancel();
	}, [cancelSignal, handleCancel]);

	const handleKeepDraftAndClose = () => {
		flushDraft(getValues() as CreateLessonFormInput);
		toast.success("تم الاحتفاظ بالمحتوى كمسودة — يمكنك متابعتها لاحقاً");
		onKeepDraft?.();
	};

	const handleConfirmDiscard = () => {
		const currentValues = getValues();
		skipUnmountDraftRef.current = true;
		if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
		clearLessonDraft(draftKey);
		setRestoredDraftBanner(false);
		setHasUnsaved(false);
		onCancel(isEditing ? currentValues : undefined);
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
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-1.5">
						<span className="text-[11px] font-medium leading-3 text-[#08090A]">
							تعديل الدرس
						</span>
						<ChangesBadge count={lesson?.editsCount ?? 0} />
					</div>
					{hasUnsaved && (
						<span className="text-[10px] font-medium text-[#4F6AE0]">
							● محفوظة تلقائياً كمسودة محلية
						</span>
					)}
				</div>
			)}

			<div className="flex flex-col gap-3.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white p-3 shadow-2xs">
				{restoredDraftBanner && (
					<div className="flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-amber-200 bg-amber-50/70 px-2.5 py-1.5 text-[11px]">
						<span className="font-medium text-amber-800">
							تم استرجاع المسودة المحفوظة تلقائياً قبل فقدانها
						</span>
						<button
							type="button"
							onClick={discardDraftAndReset}
							className="rounded px-2 py-0.5 text-[10px] font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
						>
							تجاهل المسودة والبدء من جديد
						</button>
					</div>
				)}
				{!isEditing && hasUnsaved && !restoredDraftBanner && (
					<div className="flex items-center justify-between gap-2 text-[10px] text-[#4F6AE0]">
						<span className="font-medium">
							● تُحفظ المسودة تلقائياً أثناء الكتابة لحمايتها عند الخروج أو إعادة التحميل
						</span>
					</div>
				)}
				{/* 1. عنوان الدرس أو الصفحة */}
				<Field
					className="gap-[5px]"
					data-invalid={!!errors.title}
				>
					<FieldLabel
						label={type === "QUIZ" ? "عنوان التقييم" : titleLabel}
						required
					/>
					<Input
						autoFocus={!isEditing}
						placeholder={
							type === "QUIZ"
								? "مثال: تقييم سريع عن الوحدة الأولى"
								: type === "PAGE"
									? "مثال: خطوات تجهيز قاعة العمليات قبل الجراحة"
									: "مثال: خطوات تجهيز قاعة العمليات قبل الجراحة"
						}
						className="h-[34px] text-[11px]"
						aria-invalid={!!errors.title}
						disabled={busy}
						{...register("title")}
					/>
					<FieldError errors={[errors.title]} />
				</Field>

				{/* المحتوى الأساسي للدرس */}
				<div className={cn("flex flex-col gap-2", isEditing && "hidden")}>
					<FieldLabel label="المحتوى الأساسي للدرس" />
					<Controller
						name="type"
						control={control}
						render={({ field }) => (
							<div className="flex flex-wrap items-start gap-[6px]">
								{LESSON_TYPE_OPTIONS.map((opt) => {
									const Icon = LESSON_TYPE_ICONS[opt.value];
									const active = field.value === opt.value;
									return (
										<button
											key={opt.value}
											type="button"
											onClick={() => {
												if (
													opt.value === "TEXT" &&
													contentValue?.trim().startsWith('{"version":1,"pages":')
												) {
													const plain = readPages(contentValue)
														.flatMap((page) =>
															page.content.flatMap((block) =>
																Array.isArray(block.content)
																	? block.content
																			.map((item) =>
																				typeof item === "object" && item && "text" in item
																					? String(item.text)
																					: "",
																			)
																			.join("")
																	: [],
															),
														)
														.filter(Boolean)
														.join("\n");
													setValue("content", plain, { shouldDirty: true });
												}
												field.onChange(opt.value);
											}}
											className={cn(
												"flex h-[36px] min-w-[74px] flex-1 items-center justify-center gap-1.5 rounded-[4px] border-[0.75px] px-2 text-[12px] transition-all cursor-pointer",
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

						{/* نص الدرس (أو درس قديم محفوظ كصفحة بلوكات قبل فصل نوع PAGE) */}
						{type === "TEXT" && !contentValue?.trim().startsWith('{"version":1,"pages":') && (
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

						{/* صفحة تفاعلية (محرر البلوكات BlockNote) */}
						{(type === "PAGE" ||
							(isEditing &&
								type === "TEXT" &&
								contentValue?.trim().startsWith('{"version":1,"pages":'))) && (
							<Field
								className="gap-[5px]"
								data-invalid={!!errors.content}
							>
								<FieldLabel
									label="محتوى الصفحة"
									required
								/>
								<CoursePageBlocksField
									value={contentValue}
									onActivePageChange={onActivePageChange}
									onChange={(serialized) =>
										setValue("content", serialized, {
											shouldDirty: true,
											shouldValidate: true,
										})
									}
									disabled={busy}
								/>
								<FieldError errors={[errors.content]} />
							</Field>
						)}

						<CourseLessonContentsField
							value={lessonContents as LessonContentItem[]}
							disabled={busy}
							onChange={(contents) =>
								setValue("contents", contents, { shouldDirty: true, shouldValidate: true })
							}
						/>

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
							isEditing && !hasUnsaved && editCount === 0 && "opacity-60",
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

			<UnsavedChangesDialog
				open={confirmingDiscard}
				onOpenChange={setConfirmingDiscard}
				unitTitle={unitTitle}
				lessonTitle={getValues("title") || lesson?.title || ""}
				changedFields={changedFields}
				onSave={submit}
				onKeepDraft={onKeepDraft ? handleKeepDraftAndClose : undefined}
				onDiscard={handleConfirmDiscard}
			/>
		</div>
	);
}
