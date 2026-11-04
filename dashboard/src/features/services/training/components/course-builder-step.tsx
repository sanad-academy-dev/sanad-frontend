import {
	IconAlignRight,
	IconArrowsHorizontal,
	IconBuildingBank,
	IconCheck,
	IconCheckbox,
	IconChevronDown,
	IconCopy,
	IconDots,
	IconEye,
	IconFileCheck,
	IconFileDiff,
	IconFileText,
	IconFileTextSpark,
	IconFocusCentered,
	IconGripVertical,
	IconInfoCircle,
	IconMicrophone,
	IconPencil,
	IconPlus,
	IconSchool,
	IconSparkles,
	IconStack2,
	IconTrash,
	IconVideoPlus,
	IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
import { backendUrl } from "@/lib/backend-fetch";
import { cn } from "@/lib/utils";
import type {
	CreateLessonFormInput,
	LessonFormValues,
	LessonResponse,
	LessonType,
	UnitResponse,
} from "@/server/training/training.type";
import { toast } from "sonner";

const UNIT_NAME_MAX = 60;

// ثوابت وحدود تغيير أحجام الأعمدة الثلاثة بالماوس
const DEFAULT_RIGHT_WIDTH = 320;
const DEFAULT_LEFT_WIDTH = 380;
const MIN_RIGHT_WIDTH = 220;
const MAX_RIGHT_WIDTH = 520;
const MIN_LEFT_WIDTH = 250;
const MAX_LEFT_WIDTH = 650;
const MIN_MIDDLE_WIDTH = 340;

const STORAGE_KEY_RIGHT = "course_builder_right_width";
const STORAGE_KEY_LEFT = "course_builder_left_width";

// النتائج المترتبة على الحذف — تختلف بين الوحدة والدرس
const UNIT_CONSEQUENCES = [
	"سيتم حذف جميع الدروس والتقييمات والمواد التعليمية المرتبطة بها بشكل نهائي، ولن تتمكن من استعادتها لاحقًا",
	"إذا كانت الدورة منشورة أو يوجد متدربون بدأوا هذه الوحدة، فقد يؤثر الحذف على تقدمهم.",
];
const LESSON_CONSEQUENCES = [
	"سيتم حذف محتوى الدرس والمواد التعليمية المرتبطة به بشكل نهائي، ولن تتمكن من استعادته لاحقًا",
	"إذا كانت الدورة منشورة أو يوجد متدربون بدأوا هذا الدرس، فقد يؤثر الحذف على تقدمهم.",
];

// يحوّل ساعة/دقيقة/ثانية إلى ثوانٍ، ويعيد null إذا كانت المدة صفرًا
function toDurationSeconds(
	v?: { hours?: unknown; minutes?: unknown; seconds?: unknown } | null,
) {
	if (!v) return null;
	const h = Number(v.hours) || 0;
	const m = Number(v.minutes) || 0;
	const s = Number(v.seconds) || 0;
	const total = h * 3600 + m * 60 + s;
	return total > 0 ? total : null;
}

// مقبض الفاصل القابل للسحب لتعديل عرض الأعمدة بالماوس
function ResizeHandle({
	isDragging,
	onMouseDown,
	onTouchStart,
	onDoubleClick,
	title,
}: {
	isDragging: boolean;
	onMouseDown: (e: React.MouseEvent) => void;
	onTouchStart: (e: React.TouchEvent) => void;
	onDoubleClick?: () => void;
	title?: string;
}) {
	return (
		<div
			aria-hidden="true"
			onMouseDown={onMouseDown}
			onTouchStart={onTouchStart}
			onDoubleClick={onDoubleClick}
			title={title ?? "اسحب لتغيير العرض (نقر مزدوج لإعادة الضبط)"}
			className="group relative z-20 flex h-full w-[11px] -mx-[5.5px] cursor-col-resize shrink-0 items-center justify-center select-none"
		>
			{/* الخط العمودي الفاصل */}
			<div
				className={cn(
					"h-full w-[1.5px] transition-all",
					isDragging
						? "w-[2.5px] bg-[#6366F1]"
						: "bg-[#E5E5E5] group-hover:w-[2px] group-hover:bg-[#6366F1]/80",
				)}
			/>
			{/* مقبض السهم الموف القابل للسحب بالماوس */}
			<div
				className={cn(
					"pointer-events-none absolute flex h-7 w-4 items-center justify-center rounded-[4px] border border-[#4F46E5] bg-[#6366F1] text-white shadow-[0_2px_6px_rgba(99,102,241,0.35)] transition-all duration-150",
					isDragging
						? "opacity-100 scale-110 bg-[#4F46E5] shadow-[0_2px_10px_rgba(79,70,229,0.5)]"
						: "opacity-85 group-hover:opacity-100 group-hover:scale-105",
				)}
			>
				<IconArrowsHorizontal className="size-3 text-white stroke-[2.2]" />
			</div>
		</div>
	);
}

// قائمة النقاط الثلاث بنمط التصميم
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

// حالة «جارٍ النسخ» — هيكل الوحدة نفسه مع أشرطة رمادية
function UnitCopyingSkeleton({ unit }: { unit: UnitResponse }) {
	return (
		<div className="flex w-full flex-col">
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

// أكورديون وحدة واحدة — يرفع أحداث اختيار/إضافة الدرس للمحرر المركزي
function UnitAccordion({
	unit,
	courseId,
	courseName,
	onDuplicate,
	onAddLesson,
	onEditLesson,
	onDeleteUnit,
	activeEditorLessonId,
}: {
	unit: UnitResponse;
	courseId: string;
	courseName: string;
	onDuplicate: () => void;
	onAddLesson: (unitId: string, unitTitle: string) => void;
	onEditLesson: (lesson: LessonResponse, unitTitle: string, unitId: string) => void;
	onDeleteUnit: (unit: UnitResponse) => void;
	activeEditorLessonId?: string | null;
}) {
	const [expanded, setExpanded] = useState(true);
	const [editingName, setEditingName] = useState(false);
	const [title, setTitle] = useState(unit.title);
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [deletingLesson, setDeletingLesson] = useState<LessonResponse | null>(null);
	const { renameUnit, removeLesson } = useCourseContent(courseId);

	const commitRename = () => {
		setEditingName(false);
		if (title.trim() && title !== unit.title) renameUnit(unit.id, title.trim());
		else setTitle(unit.title);
	};

	const hasLessons = unit.lessons.length > 0;

	return (
		<div className="flex w-full flex-col">
			{/* رأس الوحدة */}
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
				onConfirm={() => onDeleteUnit(unit)}
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
								const isActive = activeEditorLessonId === lesson.id;
								return (
									<li key={lesson.id}>
										<button
											type="button"
											onClick={() => onEditLesson(lesson, unit.title, unit.id)}
											className={cn(
												"flex h-[37px] w-full items-center justify-between gap-2 rounded-[4px] border-[0.75px] px-2 text-right transition-colors",
												isActive
													? "border-[#6366F1]/50 bg-[#6366F1]/5 shadow-xs"
													: "border-[#E5E5E5] bg-white hover:bg-[#FAFAFA]",
											)}
										>
											<div className="flex min-w-0 items-center gap-[5px]">
												<IconGripVertical className="size-2.5 shrink-0 cursor-grab text-[#828283]" />
												<TypeIcon className="size-5 shrink-0 text-[#808080]" />
												<span className="truncate text-[10px] font-semibold leading-[10px] text-[#08090A]">
													{lesson.title}
												</span>
											</div>

											{/* biome-ignore lint/a11y/useKeyWithClickEvents: wrapper button handles keyboard */}
											{/* biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation for menu */}
											<div
												className="flex shrink-0 items-center gap-1.5"
												onClick={(e) => e.stopPropagation()}
											>
												<RowMenu
													label="خيارات الدرس"
													onEdit={() => onEditLesson(lesson, unit.title, unit.id)}
													onDelete={() => setDeletingLesson(lesson)}
												/>
											</div>
										</button>
									</li>
								);
							})}
						</ul>
					)}

					{/* زر إضافة درس جديد */}
					{hasLessons ? (
						<div className="flex justify-start">
							<Button
								type="button"
								variant="outline"
								onClick={() => onAddLesson(unit.id, unit.title)}
								className="h-[26px] gap-1 rounded-[4px] px-[7px] text-[12px] font-medium"
							>
								إضافة درس جديد
								<IconPlus className="size-[15px]" />
							</Button>
						</div>
					) : (
						<div className="flex h-[130px] flex-col items-center justify-center gap-2.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-[#FAFAFA]/40 px-4 py-3">
							<IconFileText className="size-5 text-[#9B9B9D]" />
							<div className="flex flex-col items-center gap-1">
								<p className="text-center text-[11px] font-semibold text-[#08090A]">
									ابدأ بإضافة أول درس
								</p>
								<p className="text-center text-[10px] leading-4 text-[#6B6B67]">
									أضف محتوى تعليمياً كفيديو أو مستند أو تقييم.
								</p>
							</div>
							<Button
								type="button"
								variant="outline"
								onClick={() => onAddLesson(unit.id, unit.title)}
								className="h-[24px] gap-1 rounded-[4px] px-2 text-[11px] font-medium"
							>
								إضافة أول درس
								<IconPlus className="size-3" />
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

// حالة المحرر المركزي
type EditorState =
	| { mode: "add"; unitId: string; unitTitle: string; initialType?: LessonType }
	| { mode: "edit"; lesson: LessonResponse; unitTitle: string; unitId: string }
	| null;

export function CourseBuilderStep({
	courseId,
	onGenerateAI,
	onEnsureCourseCreated,
}: {
	courseId: string | null;
	onGenerateAI?: () => void;
	onEnsureCourseCreated?: () => Promise<string>;
}) {
	const [internalCourseId, setInternalCourseId] = useState<string | null>(courseId);
	useEffect(() => {
		if (courseId) setInternalCourseId(courseId);
	}, [courseId]);

	const effectiveCourseId = courseId || internalCourseId;
	const { course, isLoading } = useCourse(effectiveCourseId);
	const { addUnit, duplicateUnit, removeUnit, addLesson, updateLesson, isSavingLesson } =
		useCourseContent(effectiveCourseId);
	const [copyingUnitId, setCopyingUnitId] = useState<string | null>(null);
	// إضافة قسم جديد عبر الإدخال المباشر
	const [isAddingSection, setIsAddingSection] = useState(false);
	const [newSectionTitle, setNewSectionTitle] = useState("");
	// المحرر المركزي — في العمود الأوسط
	const [editor, setEditor] = useState<EditorState>(null);
	// تعديلات مُهمَلة محفوظة ليستعيدها زر «تراجع»
	const [restoredEdit, setRestoredEdit] = useState<CreateLessonFormInput | undefined>(
		undefined,
	);
	// القيم الحية للدرس قيد الإنشاء أو التعديل للمعاينة المباشرة في العمود الأيسر
	const [liveDraft, setLiveDraft] = useState<CreateLessonFormInput | null>(null);
	const qc = useQueryClient();

	// أحجام الأعمدة القابلة للتغيير بالسحب بالماوس مع الحفظ في localStorage
	const [rightWidth, setRightWidth] = useState(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY_RIGHT);
			if (saved) {
				const n = Number(saved);
				if (n >= MIN_RIGHT_WIDTH && n <= MAX_RIGHT_WIDTH) return n;
			}
		} catch {}
		return DEFAULT_RIGHT_WIDTH;
	});

	const [leftWidth, setLeftWidth] = useState(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY_LEFT);
			if (saved) {
				const n = Number(saved);
				if (n >= MIN_LEFT_WIDTH && n <= MAX_LEFT_WIDTH) return n;
			}
		} catch {}
		return DEFAULT_LEFT_WIDTH;
	});

	const [isDragging, setIsDragging] = useState<"right" | "left" | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const widthsRef = useRef({ right: rightWidth, left: leftWidth });

	useEffect(() => {
		widthsRef.current = { right: rightWidth, left: leftWidth };
	}, [rightWidth, leftWidth]);

	// معالجة سحب الفواصل بالماوس واللمس بدقة في بيئة RTL
	useEffect(() => {
		if (!isDragging) return;

		const updateResize = (clientX: number) => {
			if (!containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			const containerWidth = rect.width;
			const { right, left } = widthsRef.current;

			if (isDragging === "right") {
				// في RTL: الهيكل يبدأ من الحافة اليمنى للحاوية (rect.right)
				const rawWidth = rect.right - clientX;
				const maxAllowed = Math.min(MAX_RIGHT_WIDTH, containerWidth - left - MIN_MIDDLE_WIDTH);
				const clamped = Math.max(MIN_RIGHT_WIDTH, Math.min(rawWidth, maxAllowed));
				setRightWidth(clamped);
			} else if (isDragging === "left") {
				// في RTL: المعاينة تبدأ من الحافة اليسرى للحاوية (rect.left)
				const rawWidth = clientX - rect.left;
				const maxAllowed = Math.min(MAX_LEFT_WIDTH, containerWidth - right - MIN_MIDDLE_WIDTH);
				const clamped = Math.max(MIN_LEFT_WIDTH, Math.min(rawWidth, maxAllowed));
				setLeftWidth(clamped);
			}
		};

		const handleMouseMove = (e: MouseEvent) => updateResize(e.clientX);
		const handleTouchMove = (e: TouchEvent) => {
			if (e.touches[0]) updateResize(e.touches[0].clientX);
		};

		const handleEnd = () => {
			setIsDragging(null);
			try {
				localStorage.setItem(STORAGE_KEY_RIGHT, String(widthsRef.current.right));
				localStorage.setItem(STORAGE_KEY_LEFT, String(widthsRef.current.left));
			} catch {}
		};

		document.body.style.userSelect = "none";
		document.body.style.cursor = "col-resize";

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleEnd);
		window.addEventListener("touchmove", handleTouchMove, { passive: true });
		window.addEventListener("touchend", handleEnd);

		return () => {
			document.body.style.userSelect = "";
			document.body.style.cursor = "";
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleEnd);
			window.removeEventListener("touchmove", handleTouchMove);
			window.removeEventListener("touchend", handleEnd);
		};
	}, [isDragging]);

	const units = course?.units ?? [];
	const cover = resolveCover(course?.coverKey);

	const handleAddUnit = () => {
		setIsAddingSection(true);
	};

	const handleConfirmAddSection = async () => {
		const trimmed = newSectionTitle.trim() || `الوحدة ${units.length + 1}`;
		let currentCourseId = effectiveCourseId;
		if (!currentCourseId && onEnsureCourseCreated) {
			try {
				currentCourseId = await onEnsureCourseCreated();
				setInternalCourseId(currentCourseId);
			} catch (e) {
				toast.error((e as Error).message);
				return;
			}
		}
		if (!currentCourseId) {
			toast.error("يرجى التأكد من بيانات الدورة أولاً");
			return;
		}
		await addUnit(trimmed, currentCourseId);
		setIsAddingSection(false);
		setNewSectionTitle("");
	};

	// فتح المحرر تلقائياً على أول درس فقط إن كانت هناك دروس مسبقاً
	const autoOpenedEditorRef = useRef(false);
	useEffect(() => {
		if (autoOpenedEditorRef.current || !units.length || editor !== null) return;
		autoOpenedEditorRef.current = true;
		const firstUnit = units[0];
		if (firstUnit && firstUnit.lessons.length > 0) {
			setEditor({
				mode: "edit",
				lesson: firstUnit.lessons[0],
				unitTitle: firstUnit.title,
				unitId: firstUnit.id,
			});
		}
	}, [units, editor]);

	// إنشاء أول درس للدورة — مجرد فتح محرر الدرس محلياً بدون إرسال إلى قاعدة البيانات
	const handleCreateFirstLesson = () => {
		const existingUnit = units[0];
		setRestoredEdit(undefined);
		setLiveDraft(null);
		setEditor({
			mode: "add",
			unitId: existingUnit ? existingUnit.id : "pending",
			unitTitle: existingUnit ? existingUnit.title : "الوحدة 1",
		});
	};

	const handleDuplicateUnit = async (unit: UnitResponse) => {
		setCopyingUnitId(unit.id);
		try {
			await duplicateUnit(unit);
		} catch {
			// الخطأ معروض كتوست
		} finally {
			setCopyingUnitId(null);
		}
	};

	const handleDeleteUnit = async (unit: UnitResponse) => {
		if (editor?.unitId === unit.id) {
			setEditor(null);
			setLiveDraft(null);
		}
		await removeUnit(unit);
	};

	const saveCover = async (coverKey: string | null) => {
		let currentCourseId = effectiveCourseId;
		if (!currentCourseId && onEnsureCourseCreated) {
			try {
				currentCourseId = await onEnsureCourseCreated();
				setInternalCourseId(currentCourseId);
			} catch (e) {
				toast.error((e as Error).message);
				return;
			}
		}
		if (!currentCourseId) return;
		await fetch(backendUrl(`/api/training/courses/${currentCourseId}`), {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ coverKey }),
		});
		qc.invalidateQueries({ queryKey: ["training", "course", currentCourseId] });
	};

	// المحرر: إضافة درس
	const handleOpenAddLesson = (
		unitId: string,
		unitTitle: string,
		initialType?: LessonType,
	) => {
		setRestoredEdit(undefined);
		setLiveDraft(null);
		setEditor({ mode: "add", unitId, unitTitle, initialType });
	};

	// المحرر: تعديل درس
	const handleOpenEditLesson = (lesson: LessonResponse, unitTitle: string, unitId: string) => {
		setRestoredEdit(undefined);
		setLiveDraft(null);
		setEditor({ mode: "edit", lesson, unitTitle, unitId });
	};

	// حفظ درس جديد
	const handleSaveNewLesson = async (values: LessonFormValues) => {
		if (editor?.mode !== "add") return;

		let currentCourseId = effectiveCourseId;
		if (!currentCourseId && onEnsureCourseCreated) {
			try {
				currentCourseId = await onEnsureCourseCreated();
				setInternalCourseId(currentCourseId);
			} catch (e) {
				toast.error((e as Error).message);
				return;
			}
		}

		if (!currentCourseId) {
			toast.error("يرجى التأكد من بيانات الدورة أولاً");
			return;
		}

		let targetUnitId = editor.unitId;
		let targetUnitTitle = editor.unitTitle;
		if (!targetUnitId || targetUnitId === "pending") {
			const existingUnit = units[0];
			if (existingUnit) {
				targetUnitId = existingUnit.id;
				targetUnitTitle = existingUnit.title;
			} else {
				try {
					const newUnit = await addUnit(targetUnitTitle || "الوحدة 1", currentCourseId);
					targetUnitId = newUnit.id;
					targetUnitTitle = newUnit.title;
				} catch (e) {
					toast.error((e as Error).message);
					return;
				}
			}
		}

		const saved = await addLesson({
			unitId: targetUnitId,
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
			setLiveDraft(null);
			setEditor({
				mode: "edit",
				lesson: saved,
				unitTitle: targetUnitTitle,
				unitId: targetUnitId,
			});
		}
	};

	// حفظ تعديل درس
	const handleUpdateLesson = async (values: LessonFormValues) => {
		if (editor?.mode !== "edit") return;
		const saved = await updateLesson(editor.lesson.id, {
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
			setLiveDraft(null);
			setEditor({
				mode: "edit",
				lesson: saved,
				unitTitle: editor.unitTitle,
				unitId: editor.unitId,
			});
		}
	};

	// إلغاء تعديل: توست مع «تراجع»
	const handleDiscardEdit = (discarded?: CreateLessonFormInput) => {
		if (!discarded || editor?.mode !== "edit") {
			setEditor(null);
			setLiveDraft(null);
			return;
		}
		const prevLesson = editor.lesson;
		const prevUnitTitle = editor.unitTitle;
		const prevUnitId = editor.unitId;
		setEditor(null);
		setLiveDraft(null);
		showUndoToast(
			"خرجت قبل حفظ التغييرات المطلوبه لبيانات الدرس...",
			() => {
				setRestoredEdit(discarded);
				setEditor({
					mode: "edit",
					lesson: prevLesson,
					unitTitle: prevUnitTitle,
					unitId: prevUnitId,
				});
			},
			{ textClassName: "text-[12px]" },
		);
	};

	// استنساخ درس من المحرر
	const handleDuplicateLesson = () => {
		if (editor?.mode !== "edit") return;
		addLesson(lessonToPayload(editor.lesson, editor.unitId)).catch(() => null);
	};

	const activeEditorLessonId = editor?.mode === "edit" ? editor.lesson.id : null;

	// تكوين كائن الدرس الحي للمعاينة المباشرة في العمود الأيسر
	const liveLesson = useMemo<LessonResponse | null>(() => {
		if (!editor) return null;
		const title =
			liveDraft?.title || (editor.mode === "edit" ? editor.lesson.title : "عنوان الدرس");
		const type = liveDraft?.type || (editor.mode === "edit" ? editor.lesson.type : "TEXT");
		const description =
			liveDraft?.description !== undefined
				? liveDraft.description
				: editor.mode === "edit"
					? editor.lesson.description
					: null;
		const mediaSource =
			liveDraft?.mediaSource !== undefined
				? (liveDraft.mediaSource as "DEVICE" | "URL" | null)
				: editor.mode === "edit"
					? editor.lesson.mediaSource
					: null;
		const mediaKey =
			liveDraft?.mediaKey !== undefined
				? liveDraft.mediaKey
				: editor.mode === "edit"
					? editor.lesson.mediaKey
					: null;
		const mediaUrl =
			liveDraft?.mediaUrl !== undefined
				? liveDraft.mediaUrl
				: editor.mode === "edit"
					? editor.lesson.mediaUrl
					: null;
		const content =
			type === "QUIZ"
				? JSON.stringify({ questions: liveDraft?.questions ?? [] })
				: liveDraft?.content !== undefined
					? liveDraft.content
					: editor.mode === "edit"
						? editor.lesson.content
						: null;
		const durationSeconds = liveDraft
			? toDurationSeconds(liveDraft)
			: editor.mode === "edit"
				? editor.lesson.durationSeconds
				: null;

		return {
			id: editor.mode === "edit" ? editor.lesson.id : "draft-preview",
			unitId: editor.unitId,
			title: title || "درس جديد",
			type,
			description: description || null,
			mediaSource,
			mediaKey: mediaKey || null,
			mediaUrl: mediaUrl || null,
			content: content || null,
			durationSeconds,
			order: editor.mode === "edit" ? editor.lesson.order : 1,
			editsCount: editor.mode === "edit" ? editor.lesson.editsCount : 0,
			createdAt: editor.mode === "edit" ? editor.lesson.createdAt : new Date(),
		};
	}, [editor, liveDraft]);

	return (
		<div
			ref={containerRef}
			className="relative flex min-h-0 flex-1 items-start gap-0 overflow-hidden"
		>
			{/* ===== 1. يمين: الهيكل (الأقسام والوحدات) — قابل لتعديل العرض ===== */}
			<div
				style={{ width: `${rightWidth}px` }}
				className="flex min-h-0 shrink-0 flex-col gap-3 self-stretch overflow-hidden px-3 pt-3"
			>
				{/* ترويسة الهيكل والأزرار */}
				<div className="flex items-center justify-between gap-1.5">
					<div className="flex min-w-0 flex-col">
						<h2 className="truncate text-[12px] font-bold leading-tight text-[#08090A]">
							الهيكل
						</h2>
						<span className="truncate text-[10px] leading-tight text-[#6B6B67]">
							إضافة قسم ومحتوى
						</span>
					</div>

					<div className="flex shrink-0 items-center gap-1.5">
						<button
							type="button"
							onClick={onGenerateAI}
							className="flex h-[24px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#6366F1] bg-white px-2 text-[10px] font-medium text-[#4F6AE0] hover:bg-[#6366F1]/5 transition-colors"
						>
							<IconSparkles className="size-3" />
							إنشاء دورة بـ AI
						</button>
						<button
							type="button"
							onClick={handleAddUnit}
							disabled={!effectiveCourseId && !onEnsureCourseCreated}
							className="flex h-[24px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 text-[10px] font-medium text-[#08090A] hover:bg-[#FAFAFA] disabled:opacity-50 transition-colors"
						>
							<IconPlus className="size-3" />
							إضافة قسم
						</button>
					</div>
				</div>

				{/* حقل إدخال اسم القسم الجديد المباشر المطابق للتصميم */}
				{isAddingSection && (
					<div className="flex items-center gap-2 rounded-[4px] border border-[#6366F1] bg-white px-2.5 py-1.5 shadow-2xs shrink-0">
						<input
							autoFocus
							value={newSectionTitle}
							onChange={(e) => setNewSectionTitle(e.target.value)}
							maxLength={UNIT_NAME_MAX}
							placeholder="أدخل اسم القسم"
							onKeyDown={(e) => {
								if (e.key === "Enter") handleConfirmAddSection();
								if (e.key === "Escape") {
									setIsAddingSection(false);
									setNewSectionTitle("");
								}
							}}
							className="flex-1 text-[11px] text-[#08090A] bg-transparent outline-none border-0 p-0"
						/>
						<span className="text-[10px] text-[#9B9B9D] tabular-nums">
							{newSectionTitle.length}/{UNIT_NAME_MAX}
						</span>
						<button
							type="button"
							onClick={handleConfirmAddSection}
							className="text-[#6366F1] hover:text-[#4F46E5] p-0.5 cursor-pointer"
							title="تأكيد"
						>
							<IconCheck className="size-4" />
						</button>
						<button
							type="button"
							onClick={() => {
								setIsAddingSection(false);
								setNewSectionTitle("");
							}}
							className="text-[#9B9B9D] hover:text-[#08090A] p-0.5 cursor-pointer"
							title="إلغاء"
						>
							<IconX className="size-4" />
						</button>
					</div>
				)}

				{/* قائمة الأقسام والوحدات */}
				<div className="flex min-h-0 flex-1 flex-col gap-[9px] overflow-y-auto pb-4">
					{isLoading ? (
						<div className="flex justify-center py-6">
							<Spinner />
						</div>
					) : units.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-2 rounded-[4px] border border-dashed border-[#E5E5E5] bg-[#FAFAFA]/60 p-4 text-center">
							<IconStack2 className="size-5 text-[#9B9B9D]" />
							<span className="text-[11px] font-semibold text-[#08090A]">
								لا توجد وحدات حتى الآن
							</span>
							<p className="text-[10px] text-[#6B6B67] leading-4">
								ابدأ بإضافة أول وحدة لتنظيم دروس ومحتوى الدورة
							</p>
							<button
								type="button"
								onClick={() => setIsAddingSection(true)}
								className="mt-1 flex h-[24px] items-center gap-1 rounded-[4px] border border-[#6366F1] bg-white px-2.5 text-[10px] font-medium text-[#4F46E5] hover:bg-[#6366F1]/5 transition-colors cursor-pointer"
							>
								<IconPlus className="size-3" />
								إضافة وحدة
							</button>
						</div>
					) : (
						units.map((unit) => (
							<Fragment key={unit.id}>
								<UnitAccordion
									unit={unit}
									courseId={(effectiveCourseId || courseId) as string}
									courseName={course?.name ?? ""}
									onDuplicate={() => handleDuplicateUnit(unit)}
									onDeleteUnit={handleDeleteUnit}
									onAddLesson={handleOpenAddLesson}
									onEditLesson={handleOpenEditLesson}
									activeEditorLessonId={activeEditorLessonId}
								/>
								{copyingUnitId === unit.id && <UnitCopyingSkeleton unit={unit} />}
							</Fragment>
						))
					)}
				</div>
			</div>

			{/* فاصل قابل للسحب بالماوس بين الهيكل والوسط */}
			<ResizeHandle
				isDragging={isDragging === "right"}
				onMouseDown={(e) => {
					e.preventDefault();
					setIsDragging("right");
				}}
				onTouchStart={() => setIsDragging("right")}
				onDoubleClick={() => setRightWidth(DEFAULT_RIGHT_WIDTH)}
				title="اسحب لتعديل عرض قسم الهيكل (نقر مزدوج لإعادة الضبط)"
			/>

			{/* ===== 2. وسط: محرر المحتوى والتابس + الغلاف — مرن يتسع تلقائياً ===== */}
			<div className="flex min-h-0 min-w-[340px] flex-1 flex-col self-stretch overflow-hidden">
				{/* الغلاف أعلى العمود الأوسط — مطابق للصورة 2 */}
				<div
					className="relative flex h-[135px] shrink-0 flex-col items-start justify-end overflow-hidden border-b border-[#E5E5E5] px-6 py-3"
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
							disabled={!effectiveCourseId && !onEnsureCourseCreated}
							triggerLabel={course?.coverKey ? "تغيير الغلاف" : "رفع غلاف"}
						/>
					</div>
				</div>

				{/* المحرر وأسفله النموذج أو الحالة الفارغة النظيفة */}
				{editor ? (
					<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
						{/* شريط معلومات الدرس قيد التحرير */}
						<div className="flex shrink-0 items-center justify-between border-b border-[#E5E5E5] px-4 py-2 bg-[#FAFAFA]/70">
							<div className="flex flex-col gap-0.5">
								<span className="text-[11px] font-bold text-[#08090A]">
									{editor.mode === "add" ? "إضافة درس جديد" : "تعديل الدرس"}
								</span>
								<span className="text-[10px] text-[#6B6B67]">القسم: {editor.unitTitle}</span>
							</div>
							<div className="flex items-center gap-2">
								{editor.mode === "edit" && (
									<button
										type="button"
										onClick={handleDuplicateLesson}
										disabled={isSavingLesson}
										className="flex h-[22px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 text-[10px] font-medium text-[#08090A] disabled:opacity-50 cursor-pointer"
									>
										<IconCopy className="size-3" />
										استنساخ
									</button>
								)}
								<button
									type="button"
									onClick={() => {
										setEditor(null);
										setLiveDraft(null);
									}}
									className="flex size-5 items-center justify-center rounded text-[#9B9B9D] hover:text-[#08090A] cursor-pointer"
									aria-label="إغلاق المحرر"
								>
									<IconX className="size-3.5" />
								</button>
							</div>
						</div>

						{/* نموذج الدرس بالتابس والحقول */}
						<div className="flex-1 overflow-y-auto px-4 py-3">
							{editor.mode === "add" ? (
								<LessonForm
									onCancel={() => {
										setEditor(null);
										setLiveDraft(null);
									}}
									onSave={handleSaveNewLesson}
									isSaving={isSavingLesson}
									onValuesChange={setLiveDraft}
									initialType={editor.initialType}
								/>
							) : (
								<LessonForm
									lesson={editor.lesson}
									unitTitle={editor.unitTitle}
									isSaving={isSavingLesson}
									restored={restoredEdit}
									onCancel={handleDiscardEdit}
									onSave={handleUpdateLesson}
									onValuesChange={setLiveDraft}
								/>
							)}
						</div>
					</div>
				) : (
					/* الحالة المركزية عند عدم اختيار درس: إضافة وحدة أولاً إن لم تكن هناك وحدات، ثم إضافة درس */
					<div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
						<div className="flex size-11 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FAFAFA]">
							{units.length === 0 ? (
								<IconStack2 className="size-5 text-[#9B9B9D]" />
							) : (
								<IconFileText className="size-5 text-[#9B9B9D]" />
							)}
						</div>
						<div className="flex flex-col items-center gap-1">
							<p className="text-center text-[12px] font-semibold text-[#08090A]">
								{units.length === 0
									? "ابدأ بإضافة أول وحدة للدورة"
									: "ابدأ بإضافة درس جديد"}
							</p>
							<p className="text-center text-[10px] leading-5 text-[#6B6B67]">
								{units.length === 0
									? "أنشئ وحدة أو قسماً لتنظيم الدروس والمحتوى التعليمي بداخلها"
									: `أضف درساً ومحتوى تعليمياً إلى "${units[0]?.title || "الوحدة 1"}"`}
							</p>
						</div>
						{units.length === 0 ? (
							<Button
								type="button"
								onClick={() => setIsAddingSection(true)}
								className="h-[30px] gap-1.5 rounded-[4px] px-3.5 text-[11px] font-semibold cursor-pointer"
							>
								<IconPlus className="size-3.5" />
								إضافة أول وحدة للدورة
							</Button>
						) : (
							<Button
								type="button"
								onClick={handleCreateFirstLesson}
								className="h-[30px] gap-1.5 rounded-[4px] px-3.5 text-[11px] font-semibold cursor-pointer"
							>
								<IconPlus className="size-3.5" />
								إضافة درس جديد
							</Button>
						)}
					</div>
				)}
			</div>

			{/* فاصل قابل للسحب بالماوس بين الوسط والمعاينة */}
			<ResizeHandle
				isDragging={isDragging === "left"}
				onMouseDown={(e) => {
					e.preventDefault();
					setIsDragging("left");
				}}
				onTouchStart={() => setIsDragging("left")}
				onDoubleClick={() => setLeftWidth(DEFAULT_LEFT_WIDTH)}
				title="اسحب لتعديل عرض قسم المعاينة (نقر مزدوج لإعادة الضبط)"
			/>

			{/* ===== 3. شمال: المعاينة الحية للمحتوى المكتوب أو المنزّل — قابل لتعديل العرض ===== */}
			<div
				style={{ width: `${leftWidth}px` }}
				className="flex min-h-0 shrink-0 flex-col gap-2.5 self-stretch overflow-hidden px-3 pt-3"
			>
				{/* ترويسة المعاينة */}
				<div className="flex items-center justify-between py-1">
					<div className="flex items-center gap-2">
						<h2 className="text-[12px] font-bold leading-tight text-[#08090A]">
							معاينة الدورة التدريبية
						</h2>
						{editor && (
							<span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
								<span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
								مباشر
							</span>
						)}
					</div>
					<span className="text-[10px] text-[#6B6B67]">عرض كما سيراه المتدرب</span>
				</div>

				{/* حاوية المعاينة */}
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white">
					{/* في حالة وجود محرر نشط: إبراز المعاينة الحية للدرس المكتوب/المنزل حالياً */}
					{liveLesson ? (
						<div className="flex flex-col gap-4 p-4">
							<div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
								<div className="flex flex-col">
									<span className="text-[10px] text-[#6B6B67]">{editor?.unitTitle}</span>
									<span className="text-[12px] font-bold text-[#08090A]">
										{liveLesson.title}
									</span>
								</div>
								<div className="flex items-center gap-1 rounded-[4px] bg-[#9B9B9D]/[0.08] px-2 py-0.5 text-[10px] text-[#6B6B67]">
									<IconEye className="size-3" />
									معاينة الدرس
								</div>
							</div>

							{/* بطاقة المعاينة للدرس */}
							<LessonPreview
								lesson={liveLesson}
								index={1}
							/>

							{/* باقي الدروس المحفوظة في الدورة تحتها إن وُجدت */}
							{units.some((u) => u.lessons.length > 0) && (
								<div className="mt-4 flex flex-col gap-3 border-t border-[#E5E5E5] pt-4">
									<span className="text-[11px] font-bold text-[#08090A]">كل دروس الدورة:</span>
									{units
										.filter((u) => u.lessons.length > 0)
										.map((u) => (
											<div
												key={u.id}
												className="flex flex-col gap-2"
											>
												<span className="text-[10px] font-semibold text-[#6B6B67]">
													{u.title}
												</span>
												<div className="flex flex-col gap-1.5">
													{u.lessons.map((l, i) => (
														<button
															key={l.id}
															type="button"
															onClick={() => handleOpenEditLesson(l, u.title, u.id)}
															className={cn(
																"flex items-center justify-between rounded-[4px] border border-[#E5E5E5] p-2 text-right transition-colors hover:bg-[#FAFAFA]",
																activeEditorLessonId === l.id &&
																	"border-[#6366F1]/40 bg-[#6366F1]/5",
															)}
														>
															<span className="truncate text-[11px] font-medium text-[#08090A]">
																{i + 1}. {l.title}
															</span>
															<span className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-[#6B6B67]">
																{l.type}
															</span>
														</button>
													))}
												</div>
											</div>
										))}
								</div>
							)}
						</div>
					) : units.some((u) => u.lessons.length > 0) ? (
						/* عند عدم فتح محرر ولكن توجد دروس محفوظة */
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
						/* الحالة الفارغة المطابقة للصورة 2 */
						<div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-4">
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
