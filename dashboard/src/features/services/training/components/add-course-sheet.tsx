import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconAlertCircle,
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconInfoCircle,
	IconKeyboard,
} from "@tabler/icons-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { FormHeader } from "@/components/common/form-header";
import { showSuccessToast } from "@/components/common/success-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { AiCourseSheet } from "@/features/services/training/components/ai-course-sheet";
import { AssignLearnersStep } from "@/features/services/training/components/assign-learners-step";
import { CourseBuilderStep } from "@/features/services/training/components/course-builder-step";
import { CourseCompletionStep } from "@/features/services/training/components/course-completion-step";
import { CourseSheetStepper } from "@/features/services/training/components/course-sheet-stepper";
import {
	CourseTimeSection,
	type CourseTimeValue,
	isCourseTimeValid,
	LOCAL_TZ,
} from "@/features/services/training/components/course-time-section";
import {
	COURSE_DEPARTMENT_OPTIONS,
	COURSE_LOCATION_OPTIONS,
	COURSE_TYPE_OPTIONS,
} from "@/features/services/training/data/training";
import { useAssignTime } from "@/features/services/training/hooks/use-assign-time";
import {
	useCourse,
	useCreateCourse,
	useSetTrainers,
	useUpdateCourse,
} from "@/features/services/training/hooks/use-courses";
import { useFormProgress } from "@/hooks/use-form-progress";
import { cn } from "@/lib/utils";
import { CourseLocationMode, CourseType } from "@sanad/contracts/runtime/server/training/training.type";

// خطوات اللوحة: 1 معلومات، 2 باني الدورة، 3 المتدربون + وقت الدورة، 4 الإكمال والنشر
type Step = 1 | 2 | 3 | 4;
type PublishError = { step: Step; message: string };

// مخطط النموذج الأصلي لللوحة الجانبية (department نص حر) — محلي لتفادي انجراف
// createCourseSchema الذي صار يتطلّب targetRoleId من أجل المعالج المُركَن.
const sheetCourseSchema = z.object({
	name: z.string({ error: "اسم الدورة التدريبية مطلوب" }).min(1, "اسم الدورة التدريبية مطلوب"),
	department: z.string({ error: "القسم المستهدف مطلوب" }).min(1, "القسم المستهدف مطلوب"),
	type: z.enum(CourseType, { error: "نوع الدورة مطلوب" }),
	description: z.string().optional(),
	// حقول القائمة الجديدة (اختيارية) — الرقم يُحوَّل في الإدخال عبر setValueAs (الفراغ → undefined)
	trainingCost: z.number({ error: "التكلفة يجب أن تكون رقمًا" }).int().min(0).optional(),
	institution: z.string().optional(),
	locationMode: z.enum(CourseLocationMode).optional(),
});
type SheetCourseFormInput = z.infer<typeof sheetCourseSchema>;

// ترويسة قسم: العنوان يمين + خط فاصل يمتد لليسار
function SectionHeader({ title }: { title: string }) {
	return (
		<div className="flex w-full items-center gap-1.5">
			<span className="shrink-0 text-[11px] font-semibold leading-[16px] text-[#08090A]">
				{title}
			</span>
			<span className="h-px flex-1 bg-[#E5E5E5]" />
		</div>
	);
}

// تسمية الحقل — في RTL: النص أولًا (يمين) ثم شارة «مطلوب» ثم أيقونة المعلومات
function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
	return (
		<div className="flex items-center gap-1.5">
			<span className="text-[11px] font-medium leading-[16px] text-[#08090A]">{label}</span>
			{required && (
				<span className="rounded-[4px] bg-[#DC2626]/[0.06] px-[4.5px] py-[1.5px] text-[8px] font-medium leading-[12px] text-[#DC2626]">
					مطلوب
				</span>
			)}
			<IconInfoCircle className="size-2.5 shrink-0 text-[#9B9B9D] opacity-50" />
		</div>
	);
}

export function AddCourseSheet({
	open,
	onClose,
	onSubmit,
	editCourseId,
}: {
	open: boolean;
	onClose: () => void;
	onSubmit?: (course: SheetCourseFormInput) => void;
	// عند تمريره تُفتح اللوحة لتعديل مسودة قائمة: تبدأ من الخطوة 1 بحالة محمّلة
	editCourseId?: string | null;
}) {
	// 1 = معلومات الدورة، 2 = باني الدورة، 3 = المتدربون + وقت الدورة، 4 = الإكمال والنشر
	const [step, setStep] = useState<Step>(1);
	// توسيع اللوحة لكامل عرض الشاشة — زر «توسيع» في الهيدر (خطوة المحتوى)
	const [expanded, setExpanded] = useState(false);
	// أبعد خطوة وُصِل إليها — تُبقي الخطوات المزارة قابلة للنقر في المؤشّر (رجوع فقط)
	const [furthest, setFurthest] = useState<Step>(1);
	// منشئ الدورة بالذكاء الاصطناعي — لوحة جانبية تُنشئ مسودّة ثم نُكمل داخل هذه اللوحة
	const [aiOpen, setAiOpen] = useState(false);
	// معرّف الدورة: من مسودة قائمة (تعديل) أو بعد إنشائها في نهاية الخطوة الأولى (إنشاء)
	const [courseId, setCourseId] = useState<string | null>(editCourseId ?? null);
	// وقت الدورة (تاريخ بدء/استحقاق) — يُحفظ عند الانتقال من الخطوة 3، ويُروى من المسودة عند التعديل
	const [time, setTime] = useState<CourseTimeValue>({ start: null, due: null });
	const [timeError, setTimeError] = useState<string | undefined>(undefined);
	const [publishError, setPublishError] = useState<PublishError | null>(null);

	// المدربون — قائمة منفصلة (نقطة نهاية مستقلة) تُروى من المسودة وتُحفظ بعد إنشاء/تعديل الدورة
	const [trainerIds, setTrainerIds] = useState<string[]>([]);

	const { createCourse, isPending: isCreating } = useCreateCourse();
	const { updateCourse, isUpdating } = useUpdateCourse(courseId);
	const { setTrainers } = useSetTrainers();
	const { saveTime } = useAssignTime(courseId);
	const { staff } = useStaff();

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<SheetCourseFormInput>({
		resolver: zodResolver(sheetCourseSchema),
		defaultValues: {
			name: "",
			department: "",
			type: undefined,
			description: "",
			trainingCost: undefined,
			institution: "",
			locationMode: undefined,
		},
	});

	const values = watch();
	const formProgress = useFormProgress({ schema: sheetCourseSchema, values });

	const courseName = values.name;

	// الدورة مقروءة من كاش react-query (باني الدورة جالبها أصلًا) — بلا طلب إضافي
	const { course } = useCourse(courseId);

	// عدد مرات تعديل السجل المحفوظ في قاعدة البيانات — لا علاقة له بالتغييرات الحالية
	const changesCount = course?.editsCount ?? 0;

	// عند فتح اللوحة لتعديل مسودة، ثبّت معرّفها في الحالة
	useEffect(() => {
		if (open && editCourseId) setCourseId(editCourseId);
	}, [open, editCourseId]);

	// روِّ النموذج + وقت الدورة من المسودة مرة واحدة لكل دورة (لا نطمس تعديلات المستخدم عند إعادة الجلب)
	const hydratedRef = useRef<string | null>(null);
	useEffect(() => {
		if (!course || hydratedRef.current === course.id) return;
		hydratedRef.current = course.id;
		reset({
			name: course.name,
			department: course.department ?? "",
			type: course.type,
			description: course.description ?? "",
			trainingCost: course.trainingCost ?? undefined,
			institution: course.institution ?? "",
			locationMode: course.locationMode ?? undefined,
		});
		setTime({
			start: course.startDate ? new Date(course.startDate) : null,
			due: course.dueDate ? new Date(course.dueDate) : null,
		});
		setTrainerIds(course.trainers.map((t) => t.staffId));
	}, [course, reset]);

	// أبقِ خطأ النشر ظاهرًا فقط على خطوته المخالفة؛ يُمسح عند مغادرتها
	useEffect(() => {
		setPublishError((e) => (e && e.step === step ? e : null));
	}, [step]);

	// تتبّع أبعد خطوة وُصِل إليها (للسماح بالرجوع إليها عبر المؤشّر)
	useEffect(() => {
		setFurthest((f) => (step > f ? step : f));
	}, [step]);

	const close = () => {
		reset();
		setStep(1);
		setFurthest(1);
		setCourseId(null);
		setTime({ start: null, due: null });
		setTimeError(undefined);
		setPublishError(null);
		setTrainerIds([]);
		hydratedRef.current = null;
		onClose();
	};

	// حفظ وقت الدورة عبر نقطة النهاية الحالية (تُستدعى عند الانتقال من الخطوة 3)
	const persistTime = () =>
		saveTime({
			startDate: time.start ? time.start.toISOString() : null,
			dueDate: time.due ? time.due.toISOString() : null,
			timezone: LOCAL_TZ,
		});

	// الخطوة 1: تحقّق من النموذج ثم أنشئ الدورة (إنشاء) أو احفظها (تعديل مسودة)، ثم احفظ المدربين وافتح الباني
	const submitStep1 = handleSubmit(async (values) => {
		try {
			let id = courseId;
			if (id) {
				await updateCourse(values);
			} else {
				const created = await createCourse(values);
				id = created.id;
				setCourseId(created.id);
			}
			// المدربون عبر نقطة نهاية مستقلة (بمعرّف الدورة الطازج) — لا نُفشل الانتقال إذا فشل حفظهم
			if (id) await setTrainers(id, trainerIds).catch(() => null);
			setStep(2);
		} catch {
			// الخطأ معروض عبر التوست — نبقى في الخطوة الأولى
		}
	});

	// الانتقال من الخطوة 3: due > start فقط عند تحديد الاثنين؛ الفراغ مسموح (الخطوة اختيارية)
	const goFromStep3 = () => {
		if (!isCourseTimeValid(time)) {
			setTimeError("تاريخ الاستحقاق يجب أن يكون بعد تاريخ البدء.");
			return;
		}
		setTimeError(undefined);
		persistTime();
		setStep(4);
	};

	// تحقّق جاهزية النشر — يعيد الخطوة المخالفة ورسالتها أو null
	const validateForPublish = (): PublishError | null => {
		const hasContent = !!course?.units.some((u) => u.lessons.length > 0);
		if (!hasContent)
			return {
				step: 2,
				message: "أضف وحدة واحدة تحتوي على درس واحد على الأقل قبل نشر الدورة.",
			};
		if (!isCourseTimeValid(time))
			return { step: 3, message: "تاريخ الاستحقاق يجب أن يكون بعد تاريخ البدء." };
		return null;
	};

	// النشر (من الخطوة 4): تحقّق ثم اقفز للخطوة المخالفة عند الفشل، أو انشر وأغلق عند النجاح
	const publish = async () => {
		const problem = validateForPublish();
		if (problem) {
			if (problem.step === 3) setTimeError(problem.message);
			setPublishError(problem);
			setStep(problem.step);
			return;
		}
		try {
			await updateCourse({ status: "PUBLISHED" });
			onSubmit?.(getValues());
			close();
			showSuccessToast("تم نشر الدورة التدريبية بنجاح", { iconAtStart: true });
		} catch {
			// الخطأ معروض عبر التوست في الـ hook
		}
	};

	// حفظ كمسودة: احفظ وقت الدورة إن كنا في الخطوة 3، أظهر توستًا، ثم أغلق (بقية الحالة تُحفظ تلقائيًا)
	const saveDraft = () => {
		if (courseId && step === 3 && isCourseTimeValid(time)) persistTime();
		if (courseId) showSuccessToast("تم حفظ المسودة", { iconAtStart: true });
		close();
	};

	// الزر الأساسي حسب الخطوة — الخطوات 2/3 تنتقل مباشرة دون إعادة التحقق من نموذج الخطوة 1
	// (وإلا قد يتعطّل الزر إذا اعتبر react-hook-form الحقول المخفية غير صالحة)
	const submit = (e?: FormEvent) => {
		e?.preventDefault();
		if (step === 1) return void submitStep1();
		if (step === 2) return setStep(3);
		if (step === 3) return goFromStep3();
		void publish();
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(o) => {
				if (!o) close();
			}}
		>
			{/* الحد على الحافة الداخلية (اليمين في RTL) — border-e الافتراضي يقع على حافة الشاشة */}
			<SheetContent
				side="left"
				showCloseButton={false}
				className={cn(
					"flex flex-col gap-0 border-e-0 border-s-[0.75px] border-s-[#E5E5E5] p-0",
					// العرض يتبع الخطوة فقط — لوحة الـ AI تفتح فوقها بلا تضييقها
					// w-full! لتجاوز w-3/4 الافتراضي في SheetContent
					"w-full!",
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
					className="flex min-h-0 flex-1 flex-col"
					dir="rtl"
				>
					<FormHeader
						title={
							step === 1
								? editCourseId
									? "تعديل الدورة التدريبية"
									: "إنشاء دورة تدريبية جديدة"
								: "الدورات التدريبية"
						}
						identity={step === 1 ? null : { name: courseName || "دورة جديدة" }}
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

					{/* مؤشّر خطوات إنشاء الدورة + خط التقدّم — يمشي مع الخطوات 1→4 */}
					<CourseSheetStepper
						step={step}
						furthest={furthest}
						onStepChange={(s) => setStep(s as Step)}
					/>

					{/* خطأ النشر — يظهر أعلى محتوى الخطوة المخالفة عند فشل التحقق */}
					{publishError?.step === step && (
						<div className="flex shrink-0 items-center gap-2 border-b border-destructive/30 bg-destructive/5 px-3 py-2 text-[12px] font-medium text-destructive">
							<IconAlertCircle className="size-4 shrink-0" />
							{publishError.message}
						</div>
					)}

					{/* المحتوى — الخطوة الثانية: باني الدورة */}
					{step === 2 && (
						<CourseBuilderStep
							courseId={courseId}
							onGenerateAI={() => setAiOpen(true)}
						/>
					)}

					{/* المحتوى — الخطوة الثالثة: اختيار الموظفين + وقت الدورة */}
					{step === 3 && courseId && (
						<AssignLearnersStep courseId={courseId}>
							<CourseTimeSection
								value={time}
								onChange={(v) => {
									setTime(v);
									if (timeError) setTimeError(undefined);
								}}
								error={timeError}
							/>
						</AssignLearnersStep>
					)}

					{/* المحتوى — الخطوة الرابعة: الإكمال والنشر */}
					{step === 4 && courseId && course && (
						<CourseCompletionStep
							course={course}
							courseId={courseId}
						/>
					)}

					{/* المحتوى — الخطوة الأولى: معلومات الدورة */}
					<div
						className={cn(
							"flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pt-4",
							step !== 1 && "hidden",
						)}
					>
						<SectionHeader title="معلومات الأساسية" />

						{/* في RTL أول عنصر يمين: المعرّف (108px) يمينًا واسم الدورة (يتمدد) يسارًا */}
						<div className="flex items-start gap-[5px]">
							<div className="flex w-[108px] shrink-0 flex-col gap-1">
								<span className="text-[11px] font-semibold leading-[16px] text-[#08090A]">
									المعرّف يُولد تلقائياً
								</span>
								<Input
									readOnly
									value="مثال: PR-02"
									className="h-[34px] bg-[#9B9B9D]/[0.07] text-[11px] text-[#08090A]"
								/>
							</div>

							<Field
								className="flex-1 gap-[5px]"
								data-invalid={!!errors.name}
							>
								<FieldLabel
									label="اسم الدورة التدريبية"
									required
								/>
								<Input
									placeholder="مثال: بروتكول التخدير الطبي المتقدم"
									className="h-[34px] text-[11px]"
									aria-invalid={!!errors.name}
									disabled={isSubmitting}
									{...register("name")}
								/>
								<FieldError errors={[errors.name]} />
							</Field>
						</div>

						{/* القسم المستهدف */}
						<Controller
							name="department"
							control={control}
							render={({ field }) => (
								<Field
									className="gap-[5px]"
									data-invalid={!!errors.department}
								>
									<FieldLabel
										label="القسم المستهدف"
										required
									/>
									<Select
										dir="rtl"
										value={field.value}
										onValueChange={field.onChange}
										disabled={isSubmitting}
									>
										<SelectTrigger
											className="h-[34px]! w-full text-[11px]"
											aria-invalid={!!errors.department}
										>
											<SelectValue placeholder="حدد القسم..." />
										</SelectTrigger>
										<SelectContent>
											{COURSE_DEPARTMENT_OPTIONS.map((opt) => (
												<SelectItem
													key={opt.value}
													value={opt.value}
												>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[errors.department]} />
								</Field>
							)}
						/>

						{/* نوع الدورة */}
						<Controller
							name="type"
							control={control}
							render={({ field }) => (
								<Field
									className="gap-[5px]"
									data-invalid={!!errors.type}
								>
									<FieldLabel
										label="نوع الدورة"
										required
									/>
									<Select
										dir="rtl"
										value={field.value}
										onValueChange={field.onChange}
										disabled={isSubmitting}
									>
										<SelectTrigger
											className="h-[34px]! w-full text-[11px]"
											aria-invalid={!!errors.type}
										>
											<SelectValue placeholder="اختر..." />
										</SelectTrigger>
										<SelectContent>
											{COURSE_TYPE_OPTIONS.map((opt) => (
												<SelectItem
													key={opt.value}
													value={opt.value}
												>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldError errors={[errors.type]} />
								</Field>
							)}
						/>

						{/* وصف الدورة */}
						<Field className="gap-[5px]">
							<span className="text-[12px] font-medium leading-[18px] text-[#08090A]">
								وصف الدورة
							</span>
							<Textarea
								placeholder="أضف وصف..."
								className="min-h-[74px] text-[13px]"
								disabled={isSubmitting}
								{...register("description")}
							/>
						</Field>

						<SectionHeader title="تفاصيل إضافية" />

						{/* في RTL أول عنصر يمين: تكلفة التدريب يمينًا والجهة يسارًا */}
						<div className="flex items-start gap-[5px]">
							<Field className="flex-1 gap-[5px]">
								<FieldLabel label="تكلفة التدريب" />
								<Input
									type="number"
									min={0}
									inputMode="numeric"
									placeholder="مثال: 1500"
									className="h-[34px] text-[11px]"
									disabled={isSubmitting}
									{...register("trainingCost", {
										setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)),
									})}
								/>
							</Field>
							<Field className="flex-1 gap-[5px]">
								<FieldLabel label="الجهة" />
								<Input
									placeholder="مثال: المعهد العالي للجراحة"
									className="h-[34px] text-[11px]"
									disabled={isSubmitting}
									{...register("institution")}
								/>
							</Field>
						</div>

						{/* مكان الدورة */}
						<Controller
							name="locationMode"
							control={control}
							render={({ field }) => (
								<Field className="gap-[5px]">
									<FieldLabel label="مكان الدورة" />
									<Select
										dir="rtl"
										value={field.value}
										onValueChange={field.onChange}
										disabled={isSubmitting}
									>
										<SelectTrigger className="h-[34px]! w-full text-[11px]">
											<SelectValue placeholder="اختر..." />
										</SelectTrigger>
										<SelectContent>
											{COURSE_LOCATION_OPTIONS.map((opt) => (
												<SelectItem
													key={opt.value}
													value={opt.value}
												>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>

						{/* المدربون — اختيار متعدّد من موظفي الأكاديمية */}
						<Field className="gap-[5px]">
							<FieldLabel label="المدربون" />
							<Combobox
								multiple
								value={trainerIds}
								onValueChange={(v) => setTrainerIds(Array.isArray(v) ? v : [])}
							>
								<ComboboxChips className="min-h-[34px] gap-1 px-2 py-1">
									{staff
										.filter((s) => trainerIds.includes(s.id))
										.map((s) => (
											<ComboboxChip
												key={s.id}
												value={s.id}
												className="text-[11px]"
											>
												{s.name}
											</ComboboxChip>
										))}
									<ComboboxChipsInput
										placeholder={trainerIds.length === 0 ? "اختر المدربين..." : ""}
										className="text-[11px]"
									/>
								</ComboboxChips>
								<ComboboxContent>
									<ComboboxList>
										{staff.length === 0 && <ComboboxEmpty>لا يوجد موظفون</ComboboxEmpty>}
										{staff.map((s) => (
											<ComboboxItem
												key={s.id}
												value={s.id}
											>
												{s.name}
											</ComboboxItem>
										))}
									</ComboboxList>
								</ComboboxContent>
							</Combobox>
						</Field>
					</div>

					{/* الفوتر — في RTL: أول عنصر يمين (الخيار)، آخر عنصر يسار (الأزرار) */}
					<div className="flex shrink-0 items-center justify-between border-t px-4 py-2">
						{/* يمين: حفظ ومتابعة الإضافة + اختصار لوحة المفاتيح */}
						<div className="flex items-center gap-[9px]">
							<div className="flex items-center gap-[4.5px]">
								<Checkbox
									id="keep-adding-course"
									className="size-[18px] rounded-[4px] border-[1.5px] border-[#E5E5E5]"
								/>
								<label
									htmlFor="keep-adding-course"
									className="text-[10px] leading-[15px] text-[#9B9B9D]"
								>
									حفظ ومتابعة الإضافة
								</label>
							</div>
							<span className="flex items-center gap-[3px] opacity-50">
								<IconKeyboard className="size-[9px] text-[#9B9B9D]" />
								<span className="text-[8px] leading-[12px] text-[#9B9B9D]">Ctrl+Enter</span>
							</span>
						</div>

						{/* يسار: إلغاء ← حفظ كمسودة ← التالي */}
						<div className="flex items-center gap-1.5">
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={close}
								className="h-[27px] rounded-[4px] px-[9px] text-[11px] font-medium"
							>
								إلغاء
							</Button>
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={saveDraft}
								className="h-[27px] rounded-[4px] px-[9px] text-[11px] font-medium"
							>
								حفظ كمسودة
							</Button>
							{/* في RTL: أول عنصر يمين — النص يمين والاختصار يساره.
							    الخطوة 4 = «نشر الدورة»، وبقية الخطوات = «التالي» */}
							<Button
								type="submit"
								size="sm"
								disabled={isSubmitting || isCreating || isUpdating}
								className="h-[25.5px] gap-2 rounded-[4px] px-3 text-[11px] font-semibold"
							>
								{step === 4 ? "نشر الدورة" : "التالي"}
								<Kbd className="text-white">⌘↵</Kbd>
							</Button>
						</div>
					</div>
				</form>
			</SheetContent>

			{/* منشئ الدورة بالذكاء الاصطناعي — عند الحفظ نغلق اللوحة وننتقل إلى باني الدورة */}
			<AiCourseSheet
				open={aiOpen}
				onClose={() => setAiOpen(false)}
				onCreated={(newCourseId) => {
					// نُكمل داخل نفس اللوحة: نحمّل الدورة المولّدة وننتقل لخطوة «إضافة المحتوى»
					setAiOpen(false);
					hydratedRef.current = null; // إعادة ترطيب النموذج من الدورة الجديدة
					setCourseId(newCourseId);
					setStep(2);
				}}
			/>
		</Sheet>
	);
}
