import {
	type CollisionDetection,
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	IconArrowsHorizontal,
	IconCheck,
	IconChevronDown,
	IconCopy,
	IconDots,
	IconEye,
	IconFileCheck,
	IconFileDiff,
	IconFileText,
	IconFocusCentered,
	IconGripVertical,
	IconPencil,
	IconPlus,
	IconSparkles,
	IconStack2,
	IconTrash,
	IconVideoPlus,
	IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
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
import { useReorderContents } from "@/features/services/training/hooks/use-reorder-contents";
import { useReorderLessons } from "@/features/services/training/hooks/use-reorder-lessons";
import { resolveCover } from "@/features/services/training/utils/cover";
import { lessonToPayload } from "@/features/services/training/utils/lesson";
import { buildLessonContents } from "@/features/services/training/utils/lesson-contents";
import {
	clearLessonDraft,
	getLessonDraftKey,
	hasEditLessonDraft,
	listAddLessonDraftsForCourse,
	readOpenEditorSession,
	type StoredLessonDraft,
	writeOpenEditorSession,
} from "@/features/services/training/utils/lesson-draft";
import { backendUrl } from "@/lib/backend-fetch";
import { cn } from "@/lib/utils";
import type {
	CreateLessonFormInput,
	LessonContentItem,
	LessonFormValues,
	LessonResponse,
	LessonType,
	ReorderLessonInput,
	UnitResponse,
} from "@/server/training/training.type";

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

const structureCollisionDetection: CollisionDetection = (args) => {
	if (args.active.data.current?.kind !== "unit") return closestCenter(args);
	return closestCenter({
		...args,
		droppableContainers: args.droppableContainers.filter(
			(container) => container.data.current?.kind === "unit",
		),
	});
};

// النتائج المترتبة على الحذف — تختلف بين الوحدة والدرس
const UNIT_CONSEQUENCES = [
	"سيتم حذف جميع الدروس والتقييمات والمواد التعليمية المرتبطة بها بشكل نهائي، ولن تتمكن من استعادتها لاحقًا",
	"إذا كانت الدورة منشورة أو يوجد متدربون بدأوا هذه الوحدة، فقد يؤثر الحذف على تقدمهم.",
];
const LESSON_CONSEQUENCES = [
	"سيتم حذف محتوى الدرس والمواد التعليمية المرتبطة به بشكل نهائي، ولن تتمكن من استعادته لاحقًا",
	"إذا كانت الدورة منشورة أو يوجد متدربون بدأوا هذا الدرس، فقد يؤثر الحذف على تقدمهم.",
];

const LESSON_TYPE_AR_LABELS: Record<string, string> = {
	PAGE: "صفحة",
	VIDEO: "فيديو",
	QUIZ: "تقييم واختبار",
	TEXT: "محتوى نصي",
	DOCUMENT: "مستند",
	AUDIO: "ملف صوتي",
	SURVEY: "استبيان",
};

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
	onPointerDown,
	onDoubleClick,
	title,
}: {
	isDragging: boolean;
	onPointerDown: (e: React.PointerEvent) => void;
	onDoubleClick?: () => void;
	title?: string;
}) {
	return (
		<div
			aria-hidden="true"
			onPointerDown={onPointerDown}
			onDoubleClick={onDoubleClick}
			title={title ?? "اسحب لتغيير العرض (نقر مزدوج لإعادة الضبط)"}
			className="group relative z-20 flex h-full w-[11px] -mx-[5.5px] cursor-col-resize shrink-0 items-center justify-center select-none touch-none"
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

function SortableLessonRow({
	lesson,
	unit,
	index,
	isActive,
	onEdit,
	onSelectContent,
	onDelete,
}: {
	lesson: LessonResponse;
	unit: UnitResponse;
	index: number;
	isActive: boolean;
	onEdit: () => void;
	onSelectContent: (contentId: string) => void;
	onDelete: () => void;
}) {
	const TypeIcon = LESSON_TYPE_ICONS[lesson.type];
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable(
		{
			id: `lesson:${lesson.id}`,
			data: { kind: "lesson", lessonId: lesson.id, unitId: unit.id, index },
		},
	);
	const contents = lesson.contents ?? [];
	const [expanded, setExpanded] = useState(false);

	return (
		<li
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={cn(isDragging && "relative z-10 opacity-70")}
		>
			<div className="overflow-hidden rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white">
				<div
					className={cn(
						"flex h-[37px] w-full items-center justify-between gap-2 px-2 text-right transition-colors",
						isActive && "bg-[#6366F1]/5",
					)}
				>
					<button
						type="button"
						{...attributes}
						{...listeners}
						aria-label={`تحريك الدرس ${lesson.title}`}
						className="touch-none cursor-grab text-[#828283] active:cursor-grabbing"
					>
						<IconGripVertical className="size-3 shrink-0" />
					</button>
					<button
						type="button"
						onClick={() => {
							if (contents.length === 0) onEdit();
							else setExpanded((value) => !value);
						}}
						aria-expanded={expanded}
						className="flex min-w-0 flex-1 items-center gap-[5px] text-right cursor-pointer"
					>
						<TypeIcon className="size-5 shrink-0 text-[#808080]" />
						<span className="truncate text-[10px] font-semibold leading-[10px] text-[#08090A]">
							{lesson.title}
						</span>
						<span className="shrink-0 rounded bg-[#F1F0FF] px-1 py-0.5 text-[8px] font-semibold text-[#5B4AE8]">
							{contents.length} {contents.length === 1 ? "محتوى" : "محتويات"}
						</span>
						{hasEditLessonDraft(lesson.id) && (
							<span className="shrink-0 rounded bg-amber-100 px-1 py-0.5 text-[8px] font-semibold text-amber-700">
								مسودة تعديل
							</span>
						)}
					</button>
					<div className="flex shrink-0 items-center gap-1.5">
						<button
							type="button"
							onClick={() => setExpanded((value) => !value)}
							aria-label={expanded ? "طي مواد الدرس" : "عرض مواد الدرس"}
							className="rounded p-1 text-[#828283] hover:bg-muted"
						>
							<IconChevronDown
								className={cn("size-3 transition-transform", !expanded && "rotate-90")}
							/>
						</button>
						<RowMenu
							label="خيارات الدرس"
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					</div>
				</div>
				{expanded && contents.length > 0 && (
					<SortableContext
						items={contents.map((content) => `content:${content.id}`)}
						strategy={rectSortingStrategy}
					>
						<div className="flex flex-wrap gap-1 border-t border-[#F0F0F0] bg-[#FCFCFD] px-2 py-1.5">
							{contents.map((content, contentIndex) => (
								<SortableLessonContent
									key={content.id}
									content={content}
									lessonId={lesson.id}
									unitId={unit.id}
									index={contentIndex}
									onSelect={() => onSelectContent(content.id)}
								/>
							))}
						</div>
					</SortableContext>
				)}
			</div>
		</li>
	);
}

function SortableLessonContent({
	content,
	lessonId,
	unitId,
	index,
	onSelect,
}: {
	content: LessonContentItem;
	lessonId: string;
	unitId: string;
	index: number;
	onSelect: () => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable(
		{
			id: `content:${content.id}`,
			data: { kind: "content", contentId: content.id, lessonId, unitId, index },
		},
	);
	const Icon = LESSON_TYPE_ICONS[content.type];
	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={cn(
				"flex max-w-full items-center gap-1 rounded border border-[#E5E5E5] bg-white ps-1 pe-1.5 py-0.5",
				isDragging && "z-10 border-primary opacity-70 shadow-md",
			)}
		>
			<button
				type="button"
				{...attributes}
				{...listeners}
				aria-label={`نقل محتوى ${content.title}`}
				className="touch-none cursor-grab text-[#9B9B9D] active:cursor-grabbing"
			>
				<IconGripVertical className="size-2.5" />
			</button>
			<button
				type="button"
				onClick={onSelect}
				className="flex min-w-0 items-center gap-1 text-right"
			>
				<Icon className="size-3 shrink-0 text-[#6F62E8]" />
				<span className="max-w-28 truncate text-[9px] text-[#5E5E64]">
					{content.title || "محتوى بلا عنوان"}
				</span>
			</button>
		</div>
	);
}

// أكورديون وحدة واحدة — يرفع أحداث اختيار/إضافة الدرس للمحرر المركزي
function UnitAccordion({
	unit,
	courseName,
	onDuplicate,
	onRenameUnit,
	onRemoveLesson,
	onAddLesson,
	onEditLesson,
	onSelectLessonContent,
	onDeleteUnit,
	activeEditorLessonId,
	isSelected,
	onSelect,
	onAddPage,
	pendingAddDraft,
	onResumeDraft,
	onDiscardDraft,
}: {
	unit: UnitResponse;
	courseName: string;
	onDuplicate: () => void;
	onRenameUnit: (unitId: string, title: string) => void;
	onRemoveLesson: (lesson: LessonResponse) => void;
	onAddLesson: (unitId: string, unitTitle: string) => void;
	onEditLesson: (lesson: LessonResponse, unitTitle: string, unitId: string) => void;
	onSelectLessonContent: (
		lesson: LessonResponse,
		unitTitle: string,
		unitId: string,
		contentId: string,
	) => void;
	onDeleteUnit: (unit: UnitResponse) => void;
	activeEditorLessonId?: string | null;
	isSelected?: boolean;
	onSelect?: () => void;
	onAddPage?: (unitId: string) => void;
	pendingAddDraft?: StoredLessonDraft | null;
	onResumeDraft?: (unitId: string, unitTitle: string, draftType?: LessonType) => void;
	onDiscardDraft?: (unitId: string) => void;
}) {
	const [expanded, setExpanded] = useState(true);
	const [editingName, setEditingName] = useState(false);
	const [title, setTitle] = useState(unit.title);
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [deletingLesson, setDeletingLesson] = useState<LessonResponse | null>(null);
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable(
		{
			id: `unit:${unit.id}`,
			data: { kind: "unit", unitId: unit.id },
		},
	);

	const commitRename = () => {
		setEditingName(false);
		if (title.trim() && title !== unit.title) onRenameUnit(unit.id, title.trim());
		else setTitle(unit.title);
	};

	const hasLessons = unit.lessons.length > 0;

	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={cn(
				"flex w-full flex-col rounded-[4px] transition-colors",
				isSelected && "ring-1 ring-[#6366F1]/50 shadow-2xs",
				isDragging && "relative z-10 opacity-70 shadow-lg",
			)}
		>
			{/* رأس الوحدة */}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: header delegates unit selection */}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: clickable header for active unit */}
			<div
				onClick={() => onSelect?.()}
				className={cn(
					"flex h-[27px] items-center justify-between border-[0.75px] border-[#E5E5E5] bg-[#FAFAFA] ps-2 pe-3 cursor-pointer",
					expanded ? "rounded-t-[4px]" : "rounded-[4px]",
					isSelected && "bg-[#6366F1]/[0.04]",
				)}
			>
				<div className="flex min-w-0 items-center gap-1.5">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setExpanded((v) => !v);
						}}
						aria-label={expanded ? "طي الوحدة" : "توسيع الوحدة"}
						className="flex size-2.5 items-center justify-center text-[#9B9B9D]"
					>
						<IconChevronDown
							className={cn("size-2.5 transition-transform", !expanded && "rotate-90")}
						/>
					</button>
					<button
						type="button"
						{...attributes}
						{...listeners}
						aria-label={`تحريك الوحدة ${unit.title}`}
						onClick={(event) => event.stopPropagation()}
						className="touch-none cursor-grab text-[#828283] active:cursor-grabbing"
					>
						<IconGripVertical className="size-2.5 shrink-0" />
					</button>

					{editingName ? (
						<Input
							autoFocus
							value={title}
							maxLength={UNIT_NAME_MAX}
							onChange={(e) => setTitle(e.target.value)}
							onClick={(e) => e.stopPropagation()}
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
								onClick={(e) => {
									e.stopPropagation();
									setEditingName(true);
								}}
								aria-label="تعديل اسم الوحدة"
								className="text-[#9B9B9D]"
							>
								<IconPencil className="size-[15px]" />
							</button>
						</>
					)}
				</div>

				{/* biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation for menu */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation for menu */}
				<div onClick={(e) => e.stopPropagation()}>
					<RowMenu
						label="خيارات الوحدة"
						onDuplicate={onDuplicate}
						onDelete={() => setConfirmingDelete(true)}
					/>
				</div>
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
					onConfirm={() => {
						onRemoveLesson(deletingLesson);
						setDeletingLesson(null);
					}}
				/>
			)}

			{/* جسم الوحدة */}
			{expanded && (
				<div className="flex flex-col gap-3 rounded-b-[4px] border-[0.75px] border-t-0 border-[#E5E5E5] bg-white px-2 pt-[11px] pb-[4.5px]">
					{/* الدروس المحفوظة */}
					{hasLessons && (
						<SortableContext
							items={unit.lessons.map((lesson) => `lesson:${lesson.id}`)}
							strategy={verticalListSortingStrategy}
						>
							<ul className="flex flex-col gap-1.5">
								{unit.lessons.map((lesson, index) => (
									<SortableLessonRow
										key={lesson.id}
										lesson={lesson}
										unit={unit}
										index={index}
										isActive={activeEditorLessonId === lesson.id}
										onEdit={() => onEditLesson(lesson, unit.title, unit.id)}
										onSelectContent={(contentId) =>
											onSelectLessonContent(lesson, unit.title, unit.id, contentId)
										}
										onDelete={() => setDeletingLesson(lesson)}
									/>
								))}
							</ul>
						</SortableContext>
					)}

					{/* مسودة درس/صفحة محفوظة محليًا ولم تُنشر في الوحدة بعد */}
					{pendingAddDraft && onResumeDraft && (
						<div className="flex items-center justify-between gap-2 rounded-[4px] border border-dashed border-amber-300 bg-amber-50/70 px-2 py-1.5">
							<button
								type="button"
								onClick={() => onResumeDraft(unit.id, unit.title, pendingAddDraft.values.type)}
								className="flex min-w-0 flex-1 items-center gap-1.5 text-right cursor-pointer"
							>
								<span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800">
									مسودة غير محفوظة
								</span>
								<span className="truncate text-[10px] font-medium text-[#08090A]">
									{pendingAddDraft.values.title?.trim() || "صفحة / درس بدون عنوان"} — متابعة
								</span>
							</button>
							{onDiscardDraft && (
								<button
									type="button"
									onClick={() => onDiscardDraft(unit.id)}
									aria-label="حذف المسودة المحلية"
									title="حذف المسودة"
									className="rounded p-1 text-rose-600 hover:bg-rose-100 cursor-pointer"
								>
									<IconTrash className="size-3" />
								</button>
							)}
						</div>
					)}

					{/* زر إضافة درس جديد */}
					{hasLessons ? (
						<div className="flex items-center gap-1.5 justify-start">
							<Button
								type="button"
								variant="outline"
								onClick={(event) => {
									event.preventDefault();
									event.stopPropagation();
									setExpanded(true);
									onSelect?.();
									onAddLesson(unit.id, unit.title);
								}}
								aria-label={`إضافة درس إلى ${unit.title}`}
								className="h-[26px] gap-1 rounded-[4px] px-[7px] text-[12px] font-medium"
							>
								إضافة درس جديد
								<IconPlus className="size-[15px]" />
							</Button>
							{onAddPage && (
								<Button
									type="button"
									variant="outline"
									onClick={(event) => {
										event.preventDefault();
										event.stopPropagation();
										setExpanded(true);
										onSelect?.();
										onAddPage(unit.id);
									}}
									aria-label={`إضافة درس بصفحة إلى ${unit.title}`}
									className="h-[26px] gap-1 rounded-[4px] px-[7px] text-[11px] font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
								>
									<IconFileText className="size-3.5" />
									درس بصفحة
								</Button>
							)}
						</div>
					) : (
						<div className="flex items-center gap-1.5 w-full">
							<button
								type="button"
								onClick={(event) => {
									event.preventDefault();
									event.stopPropagation();
									setExpanded(true);
									onSelect?.();
									onAddLesson(unit.id, unit.title);
								}}
								className="flex-1 flex items-center justify-center gap-1.5 rounded-[4px] border border-dashed border-[#E5E5E5] bg-[#FAFAFA]/60 py-2.5 text-[11px] font-medium text-[#6B6B67] hover:border-[#6366F1]/50 hover:bg-[#6366F1]/5 hover:text-[#6366F1] transition-all cursor-pointer"
							>
								<IconPlus className="size-3.5" />
								<span>إضافة أول درس للوحدة</span>
							</button>
							{onAddPage && (
								<button
									type="button"
									onClick={(event) => {
										event.preventDefault();
										event.stopPropagation();
										setExpanded(true);
										onSelect?.();
										onAddPage(unit.id);
									}}
									className="flex items-center justify-center gap-1 rounded-[4px] border border-dashed border-purple-200 bg-purple-50/60 px-2 py-2.5 text-[11px] font-medium text-purple-600 hover:border-purple-400 hover:bg-purple-100/60 transition-all cursor-pointer shrink-0"
								>
									<IconFileText className="size-3.5" />
									<span>درس بصفحة</span>
								</button>
							)}
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
	| {
			mode: "edit";
			lesson: LessonResponse;
			unitTitle: string;
			unitId: string;
			selectedContentId?: string;
	  }
	| null;

export function CourseBuilderStep({
	courseId,
	onGenerateAI,
	onEnsureCourseCreated,
	onDirtyChange,
}: {
	courseId: string | null;
	onGenerateAI?: () => void;
	onEnsureCourseCreated?: () => Promise<string>;
	onDirtyChange?: (hasUnsaved: boolean) => void;
}) {
	const [internalCourseId, setInternalCourseId] = useState<string | null>(courseId);
	useEffect(() => {
		if (courseId) setInternalCourseId(courseId);
	}, [courseId]);

	const effectiveCourseId = courseId || internalCourseId;
	const { course, isLoading } = useCourse(effectiveCourseId);
	const {
		addUnit,
		duplicateUnit,
		removeUnit,
		addLesson,
		updateLesson,
		removeLesson,
		renameUnit,
		isSavingLesson,
	} = useCourseContent(effectiveCourseId);
	const { reorderContents } = useReorderContents(effectiveCourseId);
	const { reorderLessons } = useReorderLessons(effectiveCourseId);
	const structureSensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);
	const [copyingUnitId, setCopyingUnitId] = useState<string | null>(null);
	// إضافة وحدة جديدة عبر الإدخال المباشر
	const [isAddingUnit, setIsAddingUnit] = useState(false);
	const [newUnitTitle, setNewUnitTitle] = useState("");
	const newUnitInputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (isAddingUnit) newUnitInputRef.current?.focus();
	}, [isAddingUnit]);
	// المحرر المركزي — في العمود الأوسط
	const [editor, setEditor] = useState<EditorState>(null);
	// تعديلات مُهمَلة محفوظة ليستعيدها زر «تراجع»
	const [restoredEdit, setRestoredEdit] = useState<CreateLessonFormInput | undefined>(
		undefined,
	);
	// القيم الحية للدرس قيد الإنشاء أو التعديل للمعاينة المباشرة في العمود الأيسر
	const [liveDraft, setLiveDraft] = useState<CreateLessonFormInput | null>(null);
	const [activePreviewPageId, setActivePreviewPageId] = useState<string | null>(null);
	const [hasFormUnsavedChanges, setHasFormUnsavedChanges] = useState(false);
	const [cancelSignal, setCancelSignal] = useState(0);
	const [draftTick, setDraftTick] = useState(0);
	const qc = useQueryClient();
	const editorColumnRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!editor) return;
		const frame = window.requestAnimationFrame(() => {
			editorColumnRef.current?.scrollTo({ top: 0, behavior: "smooth" });
		});
		return () => window.cancelAnimationFrame(frame);
	}, [editor]);

	useEffect(() => {
		onDirtyChange?.(Boolean(editor && hasFormUnsavedChanges));
	}, [editor, hasFormUnsavedChanges, onDirtyChange]);

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

		const handlePointerMove = (e: PointerEvent) => updateResize(e.clientX);

		const handleEnd = () => {
			setIsDragging(null);
			try {
				localStorage.setItem(STORAGE_KEY_RIGHT, String(widthsRef.current.right));
				localStorage.setItem(STORAGE_KEY_LEFT, String(widthsRef.current.left));
			} catch {}
		};

		document.body.style.userSelect = "none";
		document.body.style.cursor = "col-resize";

		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handleEnd);
		window.addEventListener("pointercancel", handleEnd);

		return () => {
			document.body.style.userSelect = "";
			document.body.style.cursor = "";
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handleEnd);
			window.removeEventListener("pointercancel", handleEnd);
		};
	}, [isDragging]);

	const units = course?.units ?? [];
	const cover = resolveCover(course?.coverKey);
	const handleStructureDragEnd = ({ active, over }: DragEndEvent) => {
		if (!over || active.id === over.id) return;
		const activeData = active.data.current as
			| { kind: "unit"; unitId: string }
			| { kind: "lesson"; lessonId: string; unitId: string; index: number }
			| { kind: "content"; contentId: string; lessonId: string; unitId: string; index: number }
			| undefined;
		const overData = over.data.current as
			| { kind: "unit"; unitId: string }
			| { kind: "lesson"; lessonId: string; unitId: string; index: number }
			| { kind: "content"; contentId: string; lessonId: string; unitId: string; index: number }
			| undefined;
		if (!activeData || !overData) return;

		if (activeData.kind === "unit") {
			if (overData.kind !== "unit") return;
			const from = units.findIndex((unit) => unit.id === activeData.unitId);
			const to = units.findIndex((unit) => unit.id === overData.unitId);
			if (from < 0 || to < 0 || from === to) return;
			const reordered = arrayMove(units, from, to);
			void reorderContents(
				reordered.map((unit, position) => ({
					unitId: unit.id,
					levelId: unit.levelId,
					position,
				})),
			);
			return;
		}

		if (activeData.kind === "content") {
			if (overData.kind === "unit") return;
			const reorderedUnits = units.map((unit) => ({
				...unit,
				lessons: unit.lessons.map((lesson) => ({
					...lesson,
					contents: Array.isArray(lesson.contents) ? [...lesson.contents] : [],
				})),
			}));
			const sourceLesson = reorderedUnits
				.flatMap((unit) => unit.lessons)
				.find((lesson) => lesson.id === activeData.lessonId);
			const targetLesson = reorderedUnits
				.flatMap((unit) => unit.lessons)
				.find((lesson) => lesson.id === overData.lessonId);
			if (!sourceLesson || !targetLesson) return;
			const sourceContents = sourceLesson.contents ?? [];
			const from = sourceContents.findIndex((item) => item.id === activeData.contentId);
			if (from < 0) return;
			if (sourceLesson.id === targetLesson.id) {
				const to =
					overData.kind === "content"
						? sourceContents.findIndex((item) => item.id === overData.contentId)
						: sourceContents.length - 1;
				if (to < 0 || to === from) return;
				sourceLesson.contents = arrayMove(sourceContents, from, to);
			} else {
				const [moved] = sourceContents.splice(from, 1);
				if (!moved) return;
				const targetContents = targetLesson.contents ?? [];
				const insertAt =
					overData.kind === "content"
						? Math.max(
								0,
								targetContents.findIndex((item) => item.id === overData.contentId),
							)
						: targetContents.length;
				targetContents.splice(insertAt, 0, moved);
				targetLesson.contents = targetContents;
			}
			const items: ReorderLessonInput[] = reorderedUnits.flatMap((unit) =>
				unit.lessons.map((lesson, position) => ({
					lessonId: lesson.id,
					unitId: unit.id,
					position,
					contents: lesson.contents ?? [],
				})),
			);
			void reorderLessons(items);
			return;
		}

		const targetUnitId = overData.unitId;
		const sourceUnit = units.find((unit) => unit.id === activeData.unitId);
		const targetUnit = units.find((unit) => unit.id === targetUnitId);
		if (!sourceUnit || !targetUnit) return;
		if (overData.kind === "unit" && sourceUnit.id === targetUnit.id) return;
		const sourceIndex = sourceUnit.lessons.findIndex(
			(lesson) => lesson.id === activeData.lessonId,
		);
		if (sourceIndex < 0) return;

		const reorderedUnits = units.map((unit) => ({ ...unit, lessons: [...unit.lessons] }));
		const source = reorderedUnits.find((unit) => unit.id === sourceUnit.id);
		const target = reorderedUnits.find((unit) => unit.id === targetUnitId);
		if (!source || !target) return;
		if (source.id === target.id) {
			const to =
				overData.kind === "lesson"
					? source.lessons.findIndex((lesson) => lesson.id === overData.lessonId)
					: overData.kind === "content"
						? source.lessons.findIndex((lesson) => lesson.id === overData.lessonId)
						: source.lessons.length - 1;
			if (to < 0 || to === sourceIndex) return;
			source.lessons = arrayMove(source.lessons, sourceIndex, to);
		} else {
			const [moved] = source.lessons.splice(sourceIndex, 1);
			if (!moved) return;
			const insertAt =
				overData.kind === "lesson"
					? Math.max(
							0,
							target.lessons.findIndex((lesson) => lesson.id === overData.lessonId),
						)
					: overData.kind === "content"
						? Math.max(
								0,
								target.lessons.findIndex((lesson) => lesson.id === overData.lessonId),
							)
						: target.lessons.length;
			target.lessons.splice(insertAt, 0, { ...moved, unitId: target.id });
		}
		const items: ReorderLessonInput[] = reorderedUnits.flatMap((unit) =>
			unit.lessons.map((lesson, position) => ({
				lessonId: lesson.id,
				unitId: unit.id,
				position,
			})),
		);
		void reorderLessons(items);
	};
	const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
	const activeUnit =
		units.find((u) => u.id === (editor ? editor.unitId : selectedUnitId || units[0]?.id)) ||
		units[0] ||
		null;
	const activeUnitId = activeUnit?.id || null;

	const handleAddUnit = () => {
		setIsAddingUnit(true);
	};

	const handleConfirmAddUnit = async () => {
		const trimmed = newUnitTitle.trim() || `الوحدة ${units.length + 1}`;
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
		setIsAddingUnit(false);
		setNewUnitTitle("");
	};

	// فتح المحرر تلقائياً: يستعيد أولاً آخر محرر كان مفتوحًا قبل إعادة التحميل، وإلا أول درس محفوظ
	const autoOpenedEditorRef = useRef(false);
	useEffect(() => {
		if (autoOpenedEditorRef.current || !units.length || editor !== null) return;
		autoOpenedEditorRef.current = true;
		const savedSession = readOpenEditorSession(effectiveCourseId);
		if (savedSession) {
			const sessionUnit = units.find((u) => u.id === savedSession.unitId);
			if (sessionUnit) {
				setSelectedUnitId(sessionUnit.id);
				if (savedSession.mode === "edit") {
					const sessionLesson = sessionUnit.lessons.find(
						(l) => l.id === savedSession.lessonId,
					);
					if (sessionLesson) {
						setEditor({
							mode: "edit",
							lesson: sessionLesson,
							unitTitle: sessionUnit.title,
							unitId: sessionUnit.id,
						});
						return;
					}
				} else {
					setEditor({
						mode: "add",
						unitId: sessionUnit.id,
						unitTitle: sessionUnit.title,
						initialType: savedSession.initialType,
					});
					return;
				}
			}
		}
		const firstUnit = units[0];
		if (firstUnit && firstUnit.lessons.length > 0) {
			setEditor({
				mode: "edit",
				lesson: firstUnit.lessons[0],
				unitTitle: firstUnit.title,
				unitId: firstUnit.id,
			});
		}
	}, [units, editor, effectiveCourseId]);

	const refreshDraftBadges = () => {
		setTimeout(() => setDraftTick((n) => n + 1), 0);
	};

	const closeEditorPanel = (clearSession = true) => {
		setEditor(null);
		setLiveDraft(null);
		setActivePreviewPageId(null);
		setHasFormUnsavedChanges(false);
		if (clearSession) writeOpenEditorSession(effectiveCourseId, null);
		refreshDraftBadges();
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
		try {
			const res = await fetch(backendUrl(`/api/training/courses/${currentCourseId}`), {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ coverKey }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "تعذّر حفظ الغلاف");
			}
			await qc.invalidateQueries({ queryKey: ["training", "course", currentCourseId] });
			await qc.invalidateQueries({ queryKey: ["training", "courses"] });
		} catch (e) {
			console.error("saveCover error:", e);
			toast.error((e as Error).message || "تعذّر حفظ الغلاف");
		}
	};

	// المحرر: إضافة درس
	const handleOpenAddLesson = (
		unitId: string,
		unitTitle: string,
		initialType?: LessonType,
	) => {
		if (hasFormUnsavedChanges) {
			toast.info("تم حفظ مسودة الدرس السابق محليًا — يمكنك العودة إليها من قائمته");
		}
		setSelectedUnitId(unitId);
		setRestoredEdit(undefined);
		setLiveDraft(null);
		setActivePreviewPageId(null);
		setHasFormUnsavedChanges(false);
		writeOpenEditorSession(effectiveCourseId, {
			mode: "add",
			unitId,
			unitTitle,
			initialType,
		});
		setEditor({ mode: "add", unitId, unitTitle, initialType });
		refreshDraftBadges();
	};

	// المحرر: تعديل درس
	const handleOpenEditLesson = (
		lesson: LessonResponse,
		unitTitle: string,
		unitId: string,
		selectedContentId?: string,
	) => {
		if (hasFormUnsavedChanges && activeEditorLessonId !== lesson.id) {
			toast.info("تم حفظ المسودة السابقة تلقائياً");
		}
		setSelectedUnitId(unitId);
		setRestoredEdit(undefined);
		setLiveDraft(null);
		setActivePreviewPageId(null);
		setHasFormUnsavedChanges(false);
		writeOpenEditorSession(effectiveCourseId, {
			mode: "edit",
			lessonId: lesson.id,
			unitId,
			unitTitle,
		});
		setEditor({ mode: "edit", lesson, unitTitle, unitId, selectedContentId });
		refreshDraftBadges();
	};

	// حفظ درس جديد
	const handleSaveNewLesson = async (values: LessonFormValues): Promise<boolean> => {
		if (editor?.mode !== "add") return false;

		let currentCourseId = effectiveCourseId;
		if (!currentCourseId && onEnsureCourseCreated) {
			try {
				currentCourseId = await onEnsureCourseCreated();
				setInternalCourseId(currentCourseId);
			} catch (e) {
				toast.error((e as Error).message);
				return false;
			}
		}

		if (!currentCourseId) {
			toast.error("يرجى التأكد من بيانات الدورة أولاً");
			return false;
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
					return false;
				}
			}
		}

		const isMedia =
			values.type === "VIDEO" || values.type === "AUDIO" || values.type === "DOCUMENT";
		const saved = await addLesson({
			unitId: targetUnitId,
			title: values.title,
			type: values.type,
			description: values.description || null,
			mediaSource: isMedia ? (values.mediaSource ?? null) : null,
			mediaKey: isMedia ? values.mediaKey || null : null,
			mediaUrl: isMedia ? values.mediaUrl || null : null,
			content:
				values.type === "QUIZ"
					? JSON.stringify({ questions: values.questions ?? [] })
					: values.content || null,
			contents: buildLessonContents(values),
			durationSeconds: toDurationSeconds(values),
		}).catch((err) => {
			console.error("handleSaveNewLesson error:", err);
			return null;
		});

		if (saved) {
			clearLessonDraft(
				getLessonDraftKey({ courseId: effectiveCourseId, unitId: editor.unitId }),
			);
			clearLessonDraft(getLessonDraftKey({ courseId: currentCourseId, unitId: targetUnitId }));
			setLiveDraft(null);
			setHasFormUnsavedChanges(false);
			writeOpenEditorSession(currentCourseId, {
				mode: "edit",
				lessonId: saved.id,
				unitId: targetUnitId,
				unitTitle: targetUnitTitle,
			});
			setEditor({
				mode: "edit",
				lesson: saved,
				unitTitle: targetUnitTitle,
				unitId: targetUnitId,
			});
			refreshDraftBadges();
			return true;
		}
		return false;
	};

	// حفظ تعديل درس
	const handleUpdateLesson = async (values: LessonFormValues): Promise<boolean> => {
		if (editor?.mode !== "edit") return false;
		const isMedia =
			values.type === "VIDEO" || values.type === "AUDIO" || values.type === "DOCUMENT";
		const saved = await updateLesson(editor.lesson.id, {
			title: values.title,
			type: values.type,
			description: values.description || null,
			mediaSource: isMedia ? (values.mediaSource ?? null) : null,
			mediaKey: isMedia ? values.mediaKey || null : null,
			mediaUrl: isMedia ? values.mediaUrl || null : null,
			content:
				values.type === "QUIZ"
					? JSON.stringify({ questions: values.questions ?? [] })
					: values.content || null,
			contents: buildLessonContents(values, editor.lesson.contents),
			durationSeconds: toDurationSeconds(values),
		}).catch((err) => {
			console.error("handleUpdateLesson error:", err);
			return null;
		});
		if (saved) {
			clearLessonDraft(getLessonDraftKey({ lessonId: editor.lesson.id }));
			setLiveDraft(null);
			setHasFormUnsavedChanges(false);
			setEditor({
				mode: "edit",
				lesson: saved,
				unitTitle: editor.unitTitle,
				unitId: editor.unitId,
			});
			refreshDraftBadges();
			return true;
		}
		return false;
	};

	// إلغاء تعديل: توست مع «تراجع»
	const handleDiscardEdit = (discarded?: CreateLessonFormInput) => {
		if (!discarded || editor?.mode !== "edit") {
			closeEditorPanel(true);
			return;
		}
		const prevLesson = editor.lesson;
		const prevUnitTitle = editor.unitTitle;
		const prevUnitId = editor.unitId;
		closeEditorPanel(true);
		showUndoToast(
			"خرجت قبل حفظ التغييرات المطلوبه لبيانات الدرس...",
			() => {
				setRestoredEdit(discarded);
				writeOpenEditorSession(effectiveCourseId, {
					mode: "edit",
					lessonId: prevLesson.id,
					unitId: prevUnitId,
					unitTitle: prevUnitTitle,
				});
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

	const pendingAddDrafts = useMemo(() => {
		void draftTick;
		return listAddLessonDraftsForCourse(effectiveCourseId);
	}, [effectiveCourseId, draftTick]);

	// استنساخ درس من المحرر
	const handleDuplicateLesson = () => {
		if (editor?.mode !== "edit") return;
		addLesson(lessonToPayload(editor.lesson, editor.unitId)).catch(() => null);
	};

	const activeEditorLessonId = editor?.mode === "edit" ? editor.lesson.id : null;

	// تكوين كائن الدرس الحي للمعاينة المباشرة في العمود الأيسر
	const liveLesson = useMemo<LessonResponse | null>(() => {
		if (!editor) return null;
		const type =
			liveDraft?.type ||
			(editor.mode === "edit" ? editor.lesson.type : editor.initialType) ||
			"VIDEO";
		const title =
			liveDraft?.title !== undefined
				? liveDraft.title.trim() ||
					(type === "PAGE" ? "درس بصفحة بدون عنوان" : "درس بدون عنوان")
				: editor.mode === "edit"
					? editor.lesson.title
					: type === "PAGE"
						? "درس بصفحة جديد"
						: "درس جديد";
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
			title: title || (type === "PAGE" ? "درس بصفحة جديد" : "درس جديد"),
			type,
			description: description || null,
			mediaSource,
			mediaKey: mediaKey || null,
			mediaUrl: mediaUrl || null,
			content: content || null,
			contents: liveDraft
				? buildLessonContents(
						liveDraft,
						editor.mode === "edit" ? editor.lesson.contents : null,
					)
				: editor.mode === "edit"
					? editor.lesson.contents
					: null,
			durationSeconds,
			order: editor.mode === "edit" ? editor.lesson.order : 1,
			editsCount: editor.mode === "edit" ? editor.lesson.editsCount : 0,
			createdAt: editor.mode === "edit" ? editor.lesson.createdAt : new Date(),
		};
	}, [editor, liveDraft]);

	const activeEditorType: LessonType =
		liveDraft?.type ||
		(editor?.mode === "edit" ? editor.lesson.type : editor?.initialType) ||
		"VIDEO";
	const ActiveTypeIcon = LESSON_TYPE_ICONS[activeEditorType] || IconVideoPlus;

	return (
		<div
			ref={containerRef}
			className="relative flex min-h-0 flex-1 w-full h-full items-stretch gap-0 overflow-hidden"
		>
			{/* ===== 1. يمين: هيكل الدورة (الوحدات والدروس والمحتوى) ===== */}
			<div
				style={{ width: `${rightWidth}px` }}
				className="flex min-h-0 shrink-0 flex-col gap-3 self-stretch overflow-hidden px-3 pt-3"
			>
				{/* ترويسة الهيكل والأزرار */}
				<div className="flex items-center justify-between gap-1.5">
					<div className="flex min-w-0 flex-col">
						<h2 className="truncate text-[12px] font-bold leading-tight text-[#08090A]">
							وحدات الدورة
						</h2>
						<span className="truncate text-[10px] leading-tight text-[#6B6B67]">
							اسحبي لإعادة الترتيب أو النقل
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
							إضافة وحدة
						</button>
					</div>
				</div>

				{/* حقل إدخال اسم الوحدة الجديدة */}
				{isAddingUnit && (
					<div className="flex items-center gap-2 rounded-[4px] border border-[#6366F1] bg-white px-2.5 py-1.5 shadow-2xs shrink-0">
						<input
							ref={newUnitInputRef}
							value={newUnitTitle}
							onChange={(e) => setNewUnitTitle(e.target.value)}
							maxLength={UNIT_NAME_MAX}
							placeholder="اسم الوحدة"
							onKeyDown={(e) => {
								if (e.key === "Enter") handleConfirmAddUnit();
								if (e.key === "Escape") {
									setIsAddingUnit(false);
									setNewUnitTitle("");
								}
							}}
							className="flex-1 text-[11px] text-[#08090A] bg-transparent outline-none border-0 p-0"
						/>
						<span className="text-[10px] text-[#9B9B9D] tabular-nums">
							{newUnitTitle.length}/{UNIT_NAME_MAX}
						</span>
						<button
							type="button"
							onClick={handleConfirmAddUnit}
							className="text-[#6366F1] hover:text-[#4F46E5] p-0.5 cursor-pointer"
							title="تأكيد"
						>
							<IconCheck className="size-4" />
						</button>
						<button
							type="button"
							onClick={() => {
								setIsAddingUnit(false);
								setNewUnitTitle("");
							}}
							className="text-[#9B9B9D] hover:text-[#08090A] p-0.5 cursor-pointer"
							title="إلغاء"
						>
							<IconX className="size-4" />
						</button>
					</div>
				)}

				{/* قائمة الوحدات ودروسها ومحتويات كل درس */}
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
								onClick={() => setIsAddingUnit(true)}
								className="mt-1 flex h-[24px] items-center gap-1 rounded-[4px] border border-[#6366F1] bg-white px-2.5 text-[10px] font-medium text-[#4F46E5] hover:bg-[#6366F1]/5 transition-colors cursor-pointer"
							>
								<IconPlus className="size-3" />
								إضافة وحدة
							</button>
						</div>
					) : (
						<DndContext
							sensors={structureSensors}
							collisionDetection={structureCollisionDetection}
							onDragEnd={handleStructureDragEnd}
						>
							<SortableContext
								items={units.map((unit) => `unit:${unit.id}`)}
								strategy={verticalListSortingStrategy}
							>
								{units.map((unit) => (
									<Fragment key={unit.id}>
										<UnitAccordion
											unit={unit}
											courseName={course?.name ?? ""}
											isSelected={activeUnitId === unit.id}
											onSelect={() => setSelectedUnitId(unit.id)}
											onDuplicate={() => handleDuplicateUnit(unit)}
											onRenameUnit={renameUnit}
											onRemoveLesson={removeLesson}
											onDeleteUnit={handleDeleteUnit}
											onAddLesson={handleOpenAddLesson}
											onEditLesson={handleOpenEditLesson}
											onSelectLessonContent={(lesson, unitTitle, unitId, contentId) =>
												handleOpenEditLesson(lesson, unitTitle, unitId, contentId)
											}
											onAddPage={(unitId) => {
												handleOpenAddLesson(unitId, unit.title, "PAGE");
											}}
											pendingAddDraft={pendingAddDrafts[unit.id] ?? null}
											onResumeDraft={(unitId, unitTitle, draftType) => {
												handleOpenAddLesson(unitId, unitTitle, draftType);
											}}
											onDiscardDraft={(unitId) => {
												clearLessonDraft(
													getLessonDraftKey({ courseId: effectiveCourseId, unitId }),
												);
												refreshDraftBadges();
											}}
											activeEditorLessonId={activeEditorLessonId}
										/>
										{copyingUnitId === unit.id && <UnitCopyingSkeleton unit={unit} />}
									</Fragment>
								))}
							</SortableContext>
						</DndContext>
					)}
				</div>
			</div>

			{/* فاصل قابل للسحب بالماوس بين الهيكل والوسط */}
			<ResizeHandle
				isDragging={isDragging === "right"}
				onPointerDown={(e) => {
					e.preventDefault();
					setIsDragging("right");
				}}
				onDoubleClick={() => setRightWidth(DEFAULT_RIGHT_WIDTH)}
				title="اسحبي لتعديل عرض لوحة الوحدات (نقر مزدوج لإعادة الضبط)"
			/>

			{/* ===== 2. وسط: محرر المحتوى والتابس + الغلاف — مرن يتسع تلقائياً ===== */}
			<div
				ref={editorColumnRef}
				className="flex min-h-0 min-w-[340px] flex-1 flex-col self-stretch overflow-y-auto bg-[#FBFBFC]"
			>
				{/* غلاف الدورة أعلى العمود الأوسط */}
				<div
					className={cn(
						"relative flex shrink-0 overflow-hidden border-b border-[#E5E5E5] px-5 transition-all duration-300",
						editor ? "h-[46px] items-center py-2" : "h-[125px] items-end py-3",
					)}
					style={cover?.type === "color" ? { backgroundColor: cover.color } : undefined}
				>
					{cover?.type === "image" && (
						<img
							key={cover.url}
							src={cover.url}
							alt="غلاف الدورة"
							className="absolute inset-0 size-full object-cover"
						/>
					)}
					{!cover && <div className="absolute inset-0 bg-[#6366F1]/[0.38]" />}
					<div className="relative z-10 flex items-center justify-between w-full">
						<CoverPicker
							value={course?.coverKey ?? null}
							onChange={saveCover}
							disabled={!effectiveCourseId && !onEnsureCourseCreated}
							triggerLabel={course?.coverKey ? "تغيير الغلاف" : "رفع غلاف الدورة"}
						/>
						{editor && (
							<span className="text-[10px] font-medium text-white/95 bg-black/40 px-2.5 py-0.5 rounded backdrop-blur-xs">
								غلاف الدورة التدريبية
							</span>
						)}
					</div>
				</div>
				{editor ? (
					<div className="flex min-h-0 flex-1 flex-col bg-white">
						{/* شريط ترويسة محرر الدرس — موحّد لجميع أنواع الدروس بما فيها الصفحة */}
						<div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-[#E5E5E5] px-4 py-2.5 bg-white shadow-2xs">
							<div className="flex items-center gap-2">
								<span className="flex size-7 items-center justify-center rounded-md bg-[#6366F1]/10 text-[#6366F1]">
									<ActiveTypeIcon className="size-4" />
								</span>
								<div className="flex flex-col">
									<div className="flex items-center gap-1.5">
										<span className="text-[12px] font-bold text-[#08090A]">
											{activeEditorType === "PAGE"
												? editor.mode === "add"
													? "إضافة درس جديد"
													: "تعديل بيانات الدرس"
												: editor.mode === "add"
													? "إضافة درس جديد"
													: "تعديل بيانات الدرس"}
										</span>
										<span className="rounded bg-[#6366F1]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#6366F1]">
											{LESSON_TYPE_AR_LABELS[activeEditorType] || "درس"}
										</span>
									</div>
									<span className="text-[10px] text-[#6B6B67]">
										الوحدة:{" "}
										<span className="font-semibold text-[#08090A]">{editor.unitTitle}</span>
									</span>
								</div>
							</div>

							<div className="flex items-center gap-2">
								{editor.mode === "edit" && (
									<button
										type="button"
										onClick={handleDuplicateLesson}
										disabled={isSavingLesson}
										className="flex h-[24px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 text-[10px] font-medium text-[#08090A] hover:bg-[#FAFAFA] disabled:opacity-50 cursor-pointer"
									>
										<IconCopy className="size-3" />
										استنساخ
									</button>
								)}
								<button
									type="button"
									onClick={() => {
										if (hasFormUnsavedChanges) {
											setCancelSignal((n) => n + 1);
										} else {
											closeEditorPanel(true);
										}
									}}
									className="flex size-6 items-center justify-center rounded-md text-[#9B9B9D] hover:bg-[#FAFAFA] hover:text-[#08090A] cursor-pointer transition-colors"
									aria-label="إغلاق المحرر"
								>
									<IconX className="size-4" />
								</button>
							</div>
						</div>

						<div className="flex-1 px-5 py-4 pb-10">
							{editor.mode === "add" ? (
								<LessonForm
									key={`add-${editor.unitId}-${editor.initialType ?? "default"}`}
									courseId={effectiveCourseId}
									unitId={editor.unitId}
									unitTitle={editor.unitTitle}
									onCancel={() => closeEditorPanel(true)}
									onKeepDraft={() => closeEditorPanel(true)}
									onSave={handleSaveNewLesson}
									isSaving={isSavingLesson}
									onValuesChange={setLiveDraft}
									onDirtyChange={setHasFormUnsavedChanges}
									onActivePageChange={setActivePreviewPageId}
									cancelSignal={cancelSignal}
									initialType={editor.initialType}
								/>
							) : (
								<LessonForm
									key={`edit-${editor.lesson.id}`}
									lesson={editor.lesson}
									courseId={effectiveCourseId}
									unitId={editor.unitId}
									unitTitle={editor.unitTitle}
									selectedContentId={editor.selectedContentId}
									isSaving={isSavingLesson}
									restored={restoredEdit}
									onCancel={handleDiscardEdit}
									onKeepDraft={() => closeEditorPanel(true)}
									onSave={handleUpdateLesson}
									onValuesChange={setLiveDraft}
									onDirtyChange={setHasFormUnsavedChanges}
									onActivePageChange={setActivePreviewPageId}
									cancelSignal={cancelSignal}
								/>
							)}
						</div>
					</div>
				) : (
					/* الحالة المركزية عند عدم فتح محرر: مركز تفاعلي حديث وسهل جداً لإضافة المحتوى */
					<div className="flex flex-1 flex-col items-center justify-center p-8 max-w-[620px] mx-auto text-center">
						{units.length === 0 ? (
							<div className="flex flex-col items-center gap-4">
								<div className="flex size-14 items-center justify-center rounded-full border border-dashed border-[#6366F1]/30 bg-[#6366F1]/5 shadow-2xs">
									<IconStack2 className="size-7 text-[#6366F1]" />
								</div>
								<div className="flex flex-col items-center gap-1.5">
									<h3 className="text-center text-[15px] font-bold text-[#08090A]">
										ابدأ بإضافة أول وحدة للدورة
									</h3>
									<p className="text-center text-[12px] leading-5 text-[#6B6B67] max-w-[380px]">
										أضف وحدة، ثم أنشئ دروسًا وضع داخل كل درس الصفحات والفيديوهات والمستندات.
									</p>
								</div>
								<Button
									type="button"
									onClick={() => setIsAddingUnit(true)}
									className="h-[36px] gap-2 rounded-[6px] px-5 text-[12px] font-semibold cursor-pointer shadow-xs"
								>
									<IconPlus className="size-4" />
									إضافة أول وحدة الآن
								</Button>
							</div>
						) : (
							<div className="flex flex-col items-center gap-6 w-full">
								<div className="flex flex-col items-center gap-2">
									<div className="flex size-12 items-center justify-center rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/10 text-[#6366F1] shadow-2xs">
										<IconSparkles className="size-6" />
									</div>
									<h3 className="text-[15px] font-bold text-[#08090A]">
										إضافة درس إلى وحدة "{activeUnit?.title || units[0]?.title}"
									</h3>
									<p className="text-[12px] leading-5 text-[#6B6B67] max-w-[420px]">
										اختاري المحتوى الأساسي للدرس. بعد إنشائه يمكنك إضافة صفحات أو فيديوهات أو
										مستندات أخرى.
									</p>
								</div>

								{/* شبكة خيارات سريعة لإضافة المحتوى مباشرة بنقرة واحدة */}
								<div className="grid grid-cols-2 gap-3 w-full">
									{[
										{
											type: "PAGE" as LessonType,
											title: "درس بصفحة",
											desc: "كتابة وتنسيق درس كامل بمحرر بلوكات تفاعلي مثل Notion و Word",
											icon: IconFileText,
											badge: "نوشن / وورد",
											color:
												"text-purple-600 bg-purple-50 border-purple-200 group-hover:border-purple-400",
										},
										{
											type: "VIDEO" as LessonType,
											title: "درس فيديو",
											desc: "رفع ملف فيديو أو رابط YouTube / Vimeo",
											icon: IconVideoPlus,
											badge: "مرئي",
											color:
												"text-blue-600 bg-blue-50 border-blue-200 group-hover:border-blue-400",
										},
										{
											type: "QUIZ" as LessonType,
											title: "تقييم واختبار",
											desc: "أسئلة تفاعلية وخيارات لقياس الفهم",
											icon: IconFileCheck,
											badge: "تفاعلي",
											color:
												"text-indigo-600 bg-indigo-50 border-indigo-200 group-hover:border-indigo-400",
										},
										{
											type: "DOCUMENT" as LessonType,
											title: "مستند وملف مرفق",
											desc: "ملفات PDF وعروض توضيحية ومراجع",
											icon: IconFileDiff,
											badge: "ملفات ومراجع",
											color:
												"text-amber-600 bg-amber-50 border-amber-200 group-hover:border-amber-400",
										},
									].map((item) => (
										<button
											key={item.title}
											type="button"
											onClick={() => {
												const targetUnit = activeUnit || units[0];
												if (targetUnit) {
													handleOpenAddLesson(
														targetUnit.id,
														targetUnit.title,
														item.type as LessonType,
													);
												}
											}}
											className={cn(
												"flex items-start gap-3 rounded-[8px] border border-[#E5E5E5] bg-white p-3.5 text-right hover:border-[#6366F1] hover:bg-[#6366F1]/5 hover:shadow-xs transition-all cursor-pointer group",
												item.type === "PAGE"
													? "col-span-2 border-purple-200 bg-gradient-to-r from-purple-50/60 via-indigo-50/30 to-white hover:border-purple-400 hover:bg-purple-50/80 shadow-2xs"
													: "",
											)}
										>
											<div
												className={cn(
													"flex size-9 shrink-0 items-center justify-center rounded-[6px] border transition-transform group-hover:scale-105",
													item.color,
												)}
											>
												<item.icon className="size-5" />
											</div>
											<div className="flex flex-col min-w-0 flex-1">
												<div className="flex items-center justify-between gap-1 mb-0.5">
													<span className="text-[12px] font-bold text-[#08090A] group-hover:text-[#4F46E5] transition-colors">
														{item.title}
													</span>
													<span
														className={cn(
															"text-[9px] text-[#9B9B9D] font-medium",
															item.type === "PAGE" && "text-purple-600 font-semibold",
														)}
													>
														{item.badge}
													</span>
												</div>
												<span className="text-[10px] text-[#6B6B67] leading-4 line-clamp-2">
													{item.desc}
												</span>
											</div>
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* فاصل قابل للسحب بالماوس بين الوسط والمعاينة */}
			<ResizeHandle
				isDragging={isDragging === "left"}
				onPointerDown={(e) => {
					e.preventDefault();
					setIsDragging("left");
				}}
				onDoubleClick={() => setLeftWidth(DEFAULT_LEFT_WIDTH)}
				title="اسحبي لتعديل عرض لوحة المعاينة (نقر مزدوج لإعادة الضبط)"
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
						<div className="flex flex-col gap-3 p-4">
							<div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
								<span className="truncate text-[11px] font-semibold text-[#6B6B67]">
									الوحدة: <span className="text-[#08090A]">{editor?.unitTitle}</span>
								</span>
								<div className="flex shrink-0 items-center gap-1 rounded-[4px] bg-[#6366F1]/10 px-2 py-0.5 text-[10px] font-medium text-[#4F46E5]">
									<IconEye className="size-3" />
									{activeEditorType === "PAGE" ? "معاينة الصفحة مباشرة" : "معاينة فورية"}
								</div>
							</div>

							{/* بطاقة المعاينة للدرس المباشر */}
							<LessonPreview
								lesson={liveLesson}
								index={
									editor?.mode === "edit"
										? Math.max(
												1,
												(units
													.find((u) => u.id === editor.unitId)
													?.lessons.findIndex((l) => l.id === editor.lesson.id) ?? 0) + 1,
											)
										: (units.find((u) => u.id === editor?.unitId)?.lessons.length ?? 0) + 1
								}
								preferredPageId={activePreviewPageId}
							/>

							{/* باقي الدروس المحفوظة في الدورة تحتها إن وُجدت */}
							{units.some((u) => u.lessons.length > 0) && (
								<div className="mt-2 flex flex-col gap-3 border-t border-[#E5E5E5] pt-4">
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
																"flex items-center justify-between rounded-[4px] border border-[#E5E5E5] p-2 text-right transition-colors hover:bg-[#FAFAFA] cursor-pointer",
																activeEditorLessonId === l.id &&
																	"border-[#6366F1]/40 bg-[#6366F1]/5",
															)}
														>
															<span className="truncate text-[11px] font-medium text-[#08090A]">
																{i + 1}. {l.title}
															</span>
															<span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[9px] text-[#6B6B67]">
																{LESSON_TYPE_AR_LABELS[l.type] ?? l.type}
															</span>
														</button>
													))}
												</div>
											</div>
										))}
								</div>
							)}
						</div>
					) : units.some((u) => u.lessons.length > 0) ||
						Object.keys(pendingAddDrafts).length > 0 ? (
						/* عند عدم فتح محرر ولكن توجد دروس محفوظة أو مسودات غير منشورة */
						<div className="flex flex-col gap-5 p-4">
							{units
								.filter((unit) => unit.lessons.length > 0 || pendingAddDrafts[unit.id])
								.map((unit) => {
									const unitDraft = pendingAddDrafts[unit.id];
									return (
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
												{unitDraft && (
													<div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-amber-300 bg-amber-50/40 p-2">
														<div className="flex items-center justify-between px-1">
															<span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800">
																مسودة غير محفوظة
															</span>
															<button
																type="button"
																onClick={() =>
																	handleOpenAddLesson(
																		unit.id,
																		unit.title,
																		unitDraft.values.type,
																	)
																}
																className="text-[10px] font-semibold text-[#4F46E5] hover:underline cursor-pointer"
															>
																متابعة التحرير
															</button>
														</div>
														<LessonPreview
															lesson={{
																id: `draft-${unit.id}`,
																unitId: unit.id,
																title:
																	unitDraft.values.title?.trim() || "صفحة / درس بدون عنوان",
																type: unitDraft.values.type,
																description: unitDraft.values.description || null,
																mediaSource:
																	(unitDraft.values.mediaSource as "DEVICE" | "URL" | null) ??
																	null,
																mediaKey: unitDraft.values.mediaKey || null,
																mediaUrl: unitDraft.values.mediaUrl || null,
																content:
																	unitDraft.values.type === "QUIZ"
																		? JSON.stringify({
																				questions: unitDraft.values.questions ?? [],
																			})
																		: unitDraft.values.content || null,
																contents: buildLessonContents(unitDraft.values),
																durationSeconds: toDurationSeconds(unitDraft.values),
																order: unit.lessons.length + 1,
																editsCount: 0,
																createdAt: new Date(unitDraft.updatedAt),
															}}
															index={unit.lessons.length + 1}
														/>
													</div>
												)}
											</div>
										</div>
									);
								})}
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
