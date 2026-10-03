import {
	IconChevronDown,
	IconCopy,
	IconDots,
	IconFileText,
	IconFocusCentered,
	IconGripVertical,
	IconPencil,
	IconPlus,
	IconSparkles,
	IconTrash,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useRef, useState } from "react";
import { showUndoToast } from "@/components/common/undo-toast";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { CoverPicker } from "@/features/services/training/components/cover-picker";
import { DeleteConfirmDialog } from "@/features/services/training/components/delete-confirm-dialog";
import { LessonForm } from "@/features/services/training/components/lesson-form";
import { LessonPreview } from "@/features/services/training/components/lesson-preview";
import { LESSON_TYPE_ICONS } from "@/features/services/training/data/training";
import { useCourseContent } from "@/features/services/training/hooks/use-course-content";
import { useCourse } from "@/features/services/training/hooks/use-courses";
import { resolveCover } from "@/features/services/training/utils/cover";
import { lessonToPayload } from "@/features/services/training/utils/lesson";
import { cn } from "@/lib/utils";
import { backendUrl } from "@/lib/backend-fetch";
import type {
	CreateLessonFormInput,
	LessonFormValues,
	LessonResponse,
	UnitResponse,
} from "@/server/training/training.type";

const UNIT_NAME_MAX = 60;

// النتائج المترتبة على الحذف — تختلف بين الوحدة والدرس
const UNIT_CONSEQUENCES = [
	"سيتم حذف جميع الدروس والاختبارات والمواد التعليمية المرتبطة بها بشكل نهائي، ولن تتمكن من استعادتها لاحقًا",
	"إذا كانت الدورة منشورة أو يوجد متدربون بدأوا هذه الوحدة، فقد يؤثر الحذف على تقدمهم.",
];
const LESSON_CONSEQUENCES = [
	"سيتم حذف محتوى الدرس والمواد التعليمية المرتبطة به بشكل نهائي، ولن تتمكن من استعادته لاحقًا",
	"إذا كانت الدورة منشورة أو يوجد متدربون بدأوا هذا الدرس، فقد يؤثر الحذف على تقدمهم.",
];

// يحوّل ساعة/دقيقة/ثانية إلى ثوانٍ، ويعيد null إذا كانت المدة صفرًا
function toDurationSeconds(v: LessonFormValues) {
	const total = (v.hours ?? 0) * 3600 + (v.minutes ?? 0) * 60 + (v.seconds ?? 0);
	return total > 0 ? total : null;
}

// قائمة النقاط الثلاث بنمط التصميم (Figma node 4573-510511)
// في RTL أول عنصر داخل الصف يمينًا: الأيقونة ← النص
function RowMenu({
	label,
	onEdit,
	onDuplicate,
	onDelete,
}: {
	label: string;
	onEdit?: () => void;
	onDuplicate?: () => void;
	onDelete: () => void;
}) {
	return (
		// dir="rtl" لازم هنا: القائمة تُعرض في portal خارج شجرة الصفحة فلا ترث اتجاهها
		<DropdownMenu dir="rtl">
			<DropdownMenuTrigger
				aria-label={label}
				className="flex h-[15px] w-6 shrink-0 items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[#161616]"
			>
				<IconDots className="size-3" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="flex w-[177px] flex-col gap-1.5 rounded-[4px] border border-[#E5E5E5] bg-white px-1.5 py-3 shadow-[0px_4px_12px_rgba(0,0,0,0.12)] ring-0"
			>
				{onEdit && (
					<DropdownMenuItem
						onSelect={onEdit}
						className="h-[29px] rounded-[4px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#F2F2F2]"
					>
						<IconPencil className="size-4" />
						تعديل
					</DropdownMenuItem>
				)}
				{onDuplicate && (
					<DropdownMenuItem
						onSelect={onDuplicate}
						className="h-[29px] rounded-[4px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#EBEBEB]"
					>
						<IconCopy className="size-[15px]" />
						استنساخ
					</DropdownMenuItem>
				)}
				<DropdownMenuItem
					variant="destructive"
					onSelect={onDelete}
					className="h-[29px] rounded-[4px] px-2 text-[12px] font-bold text-[#DC2626] focus:bg-[#EBEBEB] focus:text-[#DC2626] [&_svg]:text-[#EF4444]"
				>
					<IconTrash className="size-4" />
					حذف
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// حالة «جارٍ النسخ» — هيكل الوحدة نفسه مع أشرطة رمادية بدل عناوين الدروس (Figma node 4573-511261)
function UnitCopyingSkeleton({ unit }: { unit: UnitResponse }) {
	return (
		<div className="flex w-full flex-col">
			{/* الرأس — في RTL أول عنصر يمين: السهم ← المقبض ← النص */}
			<div className="flex h-[27px] items-center rounded-t-[4px] border-[0.75px] border-[#E5E5E5] bg-[#FAFAFA] ps-2 pe-3">
				<div className="flex min-w-0 items-center gap-1.5">
					<IconChevronDown className="size-2.5 shrink-0 text-[#9B9B9D]" />
					<IconGripVertical className="size-2.5 shrink-0 text-[#828283]" />
					<span className="truncate text-[11px] leading-[10px] text-[#08090A]">
						جاري نسخ {unit.title}...
					</span>
				</div>
			</div>

			<div className="flex flex-col gap-[15px] rounded-b-[4px] border-[0.75px] border-t-0 border-[#E5E5E5] bg-white px-2 pt-[11px] pb-[4.5px]">
				{unit.lessons.map((lesson) => {
					const TypeIcon = LESSON_TYPE_ICONS[lesson.type];
					return (
						<div
							key={lesson.id}
							className="flex h-[37px] items-center gap-[5px] rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2"
						>
							<IconGripVertical className="size-2.5 shrink-0 text-[#828283]" />
							<TypeIcon className="size-5 shrink-0 text-[#808080]" />
							<span className="h-3 flex-1 animate-pulse rounded-[4px] bg-[#E3E1E1] opacity-70" />
						</div>
					);
				})}

				<div className="flex justify-start">
					<Button
						type="button"
						variant="outline"
						disabled
						className="h-[26px] gap-1 rounded-[4px] px-[7px] text-[12px] font-medium"
					>
						إضافة درس جديد
						<IconPlus className="size-[15px]" />
					</Button>
				</div>
			</div>
		</div>
	);
}

// أكورديون وحدة واحدة مع دروسها
function UnitAccordion({
	unit,
	courseId,
	courseName,
	onDuplicate,
}: {
	unit: UnitResponse;
	courseId: string;
	courseName: string;
	onDuplicate: () => void;
}) {
	const [expanded, setExpanded] = useState(true);
	const [editingName, setEditingName] = useState(false);
	const [title, setTitle] = useState(unit.title);
	const [addingLesson, setAddingLesson] = useState(false);
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
	const [deletingLesson, setDeletingLesson] = useState<LessonResponse | null>(null);
	// تعديلات مُهمَلة محفوظة مؤقتًا ليستعيدها زر «تراجع» في التوست
	const [restoredEdit, setRestoredEdit] = useState<{
		lessonId: string;
		values: CreateLessonFormInput;
	} | null>(null);
	const { renameUnit, removeUnit, addLesson, updateLesson, removeLesson, isSavingLesson } =
		useCourseContent(courseId);

	const commitRename = () => {
		setEditingName(false);
		if (title.trim() && title !== unit.title) renameUnit(unit.id, title.trim());
		else setTitle(unit.title);
	};

	// الخطأ معروض بالفعل كتوست داخل الـ hook؛ نبتلعه هنا ليبقى النموذج مفتوحًا بلا رفض غير معالَج
	const handleSaveLesson = async (values: LessonFormValues) => {
		const saved = await addLesson({
			unitId: unit.id,
			title: values.title,
			type: values.type,
			description: values.description || null,
			mediaSource: values.mediaSource ?? null,
			mediaKey: values.mediaKey || null,
			mediaUrl: values.mediaUrl || null,
			// أسئلة الاختبار تُخزَّن كـ JSON في content لعدم وجود جداول لها بعد
			content:
				values.type === "QUIZ"
					? JSON.stringify({ questions: values.questions ?? [] })
					: values.content || null,
			durationSeconds: toDurationSeconds(values),
		}).catch(() => null);
		if (saved) setAddingLesson(false);
	};

	const handleUpdateLesson = async (id: string, values: LessonFormValues) => {
		const saved = await updateLesson(id, {
			title: values.title,
			type: values.type,
			description: values.description || null,
			mediaSource: values.mediaSource ?? null,
			mediaKey: values.mediaKey || null,
			mediaUrl: values.mediaUrl || null,
			content:
				values.type === "QUIZ"
					? JSON.stringify({ questions: values.questions ?? [] })
					: values.content || null,
			durationSeconds: toDurationSeconds(values),
		}).catch(() => null);
		if (saved) {
			setEditingLessonId(null);
			setRestoredEdit(null);
		}
	};

	// الخروج بلا حفظ: توست مع «تراجع» يعيد فتح النموذج بالقيم التي كُتبت (Figma node 4573-523020)
	const handleDiscardEdit = (lesson: LessonResponse, discarded?: CreateLessonFormInput) => {
		setEditingLessonId(null);
		if (!discarded) return;
		showUndoToast(
			"خرجت قبل حفظ التغييرات المطلوبه لبيانات الدرس...",
			() => {
				setRestoredEdit({ lessonId: lesson.id, values: discarded });
				setEditingLessonId(lesson.id);
			},
			{ textClassName: "text-[12px]" },
		);
	};

	// استنساخ درس: نسخة مطابقة تُضاف في نهاية الوحدة
	const duplicateLesson = (lesson: LessonResponse) =>
		addLesson(lessonToPayload(lesson, unit.id)).catch(() => null);

	const hasLessons = unit.lessons.length > 0;

	return (
		<div className="flex w-full flex-col">
			{/* رأس الوحدة — في RTL أول عنصر يمين: السهم ← المقبض ← الاسم ← قلم التعديل */}
			<div
				className={cn(
					"flex h-[27px] items-center justify-between border-[0.75px] border-[#E5E5E5] bg-[#FAFAFA] ps-2 pe-3",
					expanded ? "rounded-t-[4px]" : "rounded-[4px]",
				)}
			>
				<div className="flex min-w-0 items-center gap-1.5">
					<button
						type="button"
						onClick={() => setExpanded((v) => !v)}
						aria-label={expanded ? "طي الوحدة" : "توسيع الوحدة"}
						className="flex size-2.5 items-center justify-center text-[#9B9B9D]"
					>
						<IconChevronDown
							className={cn("size-2.5 transition-transform", !expanded && "rotate-90")}
						/>
					</button>
					<IconGripVertical className="size-2.5 shrink-0 cursor-grab text-[#828283]" />

					{editingName ? (
						<Input
							autoFocus
							value={title}
							maxLength={UNIT_NAME_MAX}
							onChange={(e) => setTitle(e.target.value)}
							onBlur={commitRename}
							onKeyDown={(e) => {
								if (e.key === "Enter") commitRename();
								if (e.key === "Escape") {
									setTitle(unit.title);
									setEditingName(false);
								}
							}}
							className="h-[19px] w-[218px] rounded-[4px] px-2 text-[10px] font-light"
						/>
					) : (
						<>
							<span className="truncate text-[11px] leading-[10px] text-[#08090A]">
								{unit.title}
							</span>
							<button
								type="button"
								onClick={() => setEditingName(true)}
								aria-label="تعديل اسم الوحدة"
								className="text-[#9B9B9D]"
							>
								<IconPencil className="size-[15px]" />
							</button>
						</>
					)}
				</div>

				<RowMenu
					label="خيارات الوحدة"
					onDuplicate={onDuplicate}
					onDelete={() => setConfirmingDelete(true)}
				/>
			</div>

			<DeleteConfirmDialog
				title="حذف الوحدة التدريبية"
				context={courseName}
				name={unit.title}
				nameLabel="اسم الوحدة"
				question={`هل أنت متأكد من حذف الوحدة التدريبية "${unit.title}"؟ لا يمكن التراجع عن هذه الخطوة بعد تأكيدها.`}
				consequences={UNIT_CONSEQUENCES}
				confirmLabel="حذف الوحدة"
				open={confirmingDelete}
				onOpenChange={setConfirmingDelete}
				onConfirm={() => removeUnit(unit)}
			/>

			{deletingLesson && (
				<DeleteConfirmDialog
					title="حذف الدرس"
					context={unit.title}
					name={deletingLesson.title}
					nameLabel="اسم الدرس"
					question={`هل أنت متأكد من حذف الدرس "${deletingLesson.title}"؟ لا يمكن التراجع عن هذه الخطوة بعد تأكيدها.`}
					consequences={LESSON_CONSEQUENCES}
					confirmLabel="حذف الدرس"
					open
					onOpenChange={(next) => {
						if (!next) setDeletingLesson(null);
					}}
					onConfirm={() => removeLesson(deletingLesson)}
				/>
			)}

			{/* جسم الوحدة */}
			{expanded && (
				<div className="flex flex-col gap-3 rounded-b-[4px] border-[0.75px] border-t-0 border-[#E5E5E5] bg-white px-2 pt-[11px] pb-[4.5px]">
					{/* الدروس المحفوظة */}
					{hasLessons && (
						<ul className="flex flex-col gap-1.5">
							{unit.lessons.map((lesson) => {
								const TypeIcon = LESSON_TYPE_ICONS[lesson.type];
								return (
									<li
										key={lesson.id}
										className="flex flex-col gap-3"
									>
										<div className="flex h-[37px] items-center justify-between gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2">
											{/* في RTL أول عنصر يمين: المقبض ← أيقونة النوع ← اسم الدرس */}
											<div className="flex min-w-0 items-center gap-[5px]">
												<IconGripVertical className="size-2.5 shrink-0 cursor-grab text-[#828283]" />
												<TypeIcon className="size-5 shrink-0 text-[#808080]" />
												<span className="truncate text-[10px] font-semibold leading-[10px] text-[#08090A]">
													{lesson.title}
												</span>
											</div>

											{/* يسار: زر الاستنساخ ← قائمة النقاط */}
											<div className="flex shrink-0 items-center gap-1.5">
												<button
													type="button"
													onClick={() => duplicateLesson(lesson)}
													disabled={isSavingLesson}
													className="flex h-[17px] items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[7px] text-[10px] font-medium text-[#08090A] disabled:opacity-50"
												>
													استنساخ
												</button>
												{/* الاستنساخ له زر مستقل في صف الدرس، فالقائمة تحمل التعديل والحذف */}
												<RowMenu
													label="خيارات الدرس"
													onEdit={() => {
														setRestoredEdit(null);
														setEditingLessonId(lesson.id);
													}}
													onDelete={() => setDeletingLesson(lesson)}
												/>
											</div>
										</div>

										{/* نموذج التعديل يفتح أسفل صف الدرس مُعبّأً بمحتواه */}
										{editingLessonId === lesson.id && (
											<LessonForm
												lesson={lesson}
												unitTitle={unit.title}
												isSaving={isSavingLesson}
												restored={
													restoredEdit?.lessonId === lesson.id
														? restoredEdit.values
														: undefined
												}
												onCancel={(discarded) => handleDiscardEdit(lesson, discarded)}
												onSave={(values) => handleUpdateLesson(lesson.id, values)}
											/>
										)}
									</li>
								);
							})}
						</ul>
					)}

					{/* نموذج الدرس */}
					{addingLesson ? (
						<LessonForm
							onCancel={() => setAddingLesson(false)}
							onSave={handleSaveLesson}
							isSaving={isSavingLesson}
						/>
					) : hasLessons ? (
						<div className="flex justify-start">
							<Button
								type="button"
								variant="outline"
								onClick={() => setAddingLesson(true)}
								className="h-[26px] gap-1 rounded-[4px] px-[7px] text-[12px] font-medium"
							>
								إضافة درس جديد
								<IconPlus className="size-[15px]" />
							</Button>
						</div>
					) : (
						/* الحالة الفارغة للوحدة */
						<div className="flex h-[148px] flex-col items-center justify-center gap-3 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-6 py-3">
							<IconFileText className="size-6 text-[#08090A]" />
							<div className="flex flex-col items-center gap-2">
								<p className="text-center text-[11px] font-semibold leading-6 text-[#08090A]">
									ابدأ ببناء دورتك التدريبية
								</p>
								<p className="text-center text-[10px] leading-[18px] text-[#6B6B67]">
									أنشئ دورة تدريبية احترافية للموظفين، ثم أضف المحتوى والاختبارات والشهادات في
									مكان واحد.
								</p>
							</div>
							<Button
								type="button"
								variant="outline"
								onClick={() => setAddingLesson(true)}
								className="h-[26px] gap-1 rounded-[4px] px-[7px] text-[12px] font-medium"
							>
								إضافة أول درس للوحدة
								<IconPlus className="size-[15px]" />
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export function CourseBuilderStep({
	courseId,
	onGenerateAI,
}: {
	courseId: string | null;
	// يفتح منشئ الدورة بالذكاء الاصطناعي (اختياري — يُمرَّر من اللوحة الجانبية)
	onGenerateAI?: () => void;
}) {
	const { course, isLoading } = useCourse(courseId);
	const { addUnit, duplicateUnit } = useCourseContent(courseId);
	// الوحدة قيد النسخ تُعرض تحتها نسخة هيكلية حتى يعود الخادم بالنسخة الحقيقية
	const [copyingUnitId, setCopyingUnitId] = useState<string | null>(null);
	const qc = useQueryClient();

	const units = course?.units ?? [];
	// الغلاف الحالي — لون خالص أو صورة أو لا شيء
	const cover = resolveCover(course?.coverKey);

	const handleAddUnit = () => addUnit(`الوحدة ${units.length + 1}`);

	// عند فتح الباني لدورة جديدة (بلا وحدات) نضيف قسمًا أول تلقائيًا — كأن المستخدم
	// ضغط «إضافة قسم جديد» — فلا يظهر الباني فارغًا. حارس بمعرّف الدورة يمنع التكرار.
	const autoAddedForRef = useRef<string | null>(null);
	// handleAddUnit مُستثنى عمدًا: يتغيّر كل تصيير، والحارس يضمن تشغيلًا واحدًا لكل دورة
	// biome-ignore lint/correctness/useExhaustiveDependencies: تأثير تهيئة يُشغَّل مرة واحدة لكل دورة عبر حارس ref
	useEffect(() => {
		if (!courseId || isLoading) return;
		if (autoAddedForRef.current === courseId) return;
		autoAddedForRef.current = courseId;
		// دورة أُعيد فتحها ولها وحدات مسبقًا: نكتفي بتعليمها كمُعالَجة دون إضافة
		if (units.length > 0) return;
		handleAddUnit();
	}, [courseId, isLoading, units.length]);

	const handleDuplicateUnit = async (unit: UnitResponse) => {
		setCopyingUnitId(unit.id);
		try {
			await duplicateUnit(unit);
		} catch {
			// الخطأ معروض كتوست داخل الـ hook — نبتلعه هنا ليُزال الهيكل المؤقت في الحالتين
		} finally {
			setCopyingUnitId(null);
		}
	};

	// حفظ الغلاف (لون خالص "color:#HEX" أو مفتاح صورة أو null للإزالة) وتحديث المعاينة
	const saveCover = async (coverKey: string | null) => {
		if (!courseId) return;
		await fetch(backendUrl(`/api/training/courses/${courseId}`), {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ coverKey }),
		});
		qc.invalidateQueries({ queryKey: ["training", "course", courseId] });
	};

	return (
		<div className="flex min-h-0 flex-1 items-start gap-3 px-3 pt-4">
			{/* ===== يمين: باني الدورة التدريبية (555px) ===== */}
			<div className="flex min-h-0 w-[555px] shrink-0 flex-col gap-3 self-stretch">
				<div className="flex items-start justify-between gap-7">
					<div className="flex flex-col gap-2.5">
						<h2 className="text-[11px] font-bold leading-[10px] text-[#08090A]">
							باني الدورة التدريبية
						</h2>
						<p className="text-[10px] leading-[10px] text-[#6B6B67]">
							أنشئ هيكل دورة تدريبية متكاملة بإضافة الوحدات والدروس والمواد التعليمية
						</p>
					</div>

					{/* في RTL أول عنصر يمين: زر AI يمينًا وزر إضافة قسم يسارًا */}
					<div className="flex shrink-0 items-center gap-[7px]">
						<button
							type="button"
							onClick={onGenerateAI}
							className="flex h-[22px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#6366F1] px-[5px] text-[10px] font-medium text-[#4F6AE0]"
						>
							إنشاء دورة بـ AI
							<IconSparkles className="size-[9px]" />
						</button>
						<button
							type="button"
							onClick={handleAddUnit}
							disabled={!courseId}
							className="flex h-[22px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[7px] text-[10px] font-medium text-[#08090A] disabled:opacity-50"
						>
							إضافة قسم جديد
							<IconPlus className="size-2.5" />
						</button>
					</div>
				</div>

				{/* الوحدات */}
				<div className="flex min-h-0 flex-1 flex-col gap-[9px] overflow-y-auto">
					{isLoading ? (
						<div className="flex justify-center py-6">
							<Spinner />
						</div>
					) : (
						units.map((unit) => (
							<Fragment key={unit.id}>
								<UnitAccordion
									unit={unit}
									courseId={courseId as string}
									courseName={course?.name ?? ""}
									onDuplicate={() => handleDuplicateUnit(unit)}
								/>
								{copyingUnitId === unit.id && <UnitCopyingSkeleton unit={unit} />}
							</Fragment>
						))
					)}
				</div>
			</div>

			{/* الفاصل الرأسي */}
			<span className="w-px shrink-0 self-stretch bg-[#E8E8E8]" />

			{/* ===== يسار: معاينة الدورة التدريبية ===== */}
			<div className="flex min-h-0 flex-1 flex-col gap-3 self-stretch">
				<div className="flex items-center py-[5px]">
					<h2 className="text-[11px] font-bold leading-4 text-[#08090A]">
						معاينة الدورة التدريبية
					</h2>
				</div>

				{/* الغلاف — يعرض اللون/الصورة المختارة، ومنتقي الغلاف أسفل اليمين (items-start في RTL) */}
				<div
					className="relative flex h-[143px] shrink-0 flex-col items-start justify-end overflow-hidden rounded-t-[4px] border-[0.75px] border-[#E5E5E5] px-6 py-3"
					style={cover?.type === "color" ? { backgroundColor: cover.color } : undefined}
				>
					{cover?.type === "image" && (
						<img
							src={cover.url}
							alt="غلاف الدورة"
							className="absolute inset-0 size-full object-cover"
						/>
					)}
					{!cover && <div className="absolute inset-0 bg-[#6366F1]/[0.38]" />}
					<div className="relative">
						<CoverPicker
							value={course?.coverKey ?? null}
							onChange={saveCover}
							disabled={!courseId}
							triggerLabel={course?.coverKey ? "تغيير الغلاف" : "إضافة غلاف"}
						/>
					</div>
				</div>

				{/* منطقة المعاينة */}
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white">
					{units.some((u) => u.lessons.length > 0) ? (
						/* معاينة حيّة: كل درس يُعرض بنفس الطريقة التي سيراه بها الموظف حسب نوعه */
						<div className="flex flex-col gap-5 p-6">
							{units
								.filter((unit) => unit.lessons.length > 0)
								.map((unit) => (
									<div
										key={unit.id}
										className="flex flex-col gap-2.5"
									>
										<h3 className="text-[12px] font-bold text-[#08090A]">{unit.title}</h3>
										<div className="flex flex-col gap-2.5">
											{unit.lessons.map((lesson, i) => (
												<LessonPreview
													key={lesson.id}
													lesson={lesson}
													index={i + 1}
												/>
											))}
										</div>
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
									بعد إضافة أول وحدة أو درس، ستظهر هنا معاينة مباشرة لطريقة عرض الدورة للموظفين
									قبل نشرها.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
