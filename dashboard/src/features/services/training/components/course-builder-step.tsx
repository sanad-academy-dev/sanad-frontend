import type {
	CreateLessonFormInput,
	LessonContentItem,
	LessonFormValues,
	LessonResponse,
	LessonType,
	ReorderLessonInput,
	UnitResponse,
	UpdateLessonPayload,
} from "@sanad/contracts/runtime/server/training/training.type";
import {
	IconArrowsHorizontal,
	IconCheck,
	IconChevronDown,
	IconCopy,
	IconDots,
	IconEye,
	IconFileCheck,
	IconFileDescription,
	IconFileDiff,
	IconFileText,
	IconFocusCentered,
	IconGripVertical,
	IconInfoCircle,
	IconMinus,
	IconPencil,
	IconPlus,
	IconSparkles,
	IconStack2,
	IconTrash,
	IconVideoPlus,
	IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { type DragEvent, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { showUndoToast } from "@/components/common/undo-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { CoverPicker } from "@/features/services/training/components/cover-picker";
import { DeleteConfirmDialog } from "@/features/services/training/components/delete-confirm-dialog";
import { LessonForm } from "@/features/services/training/components/lesson-form";
import { LessonPreview } from "@/features/services/training/components/lesson-preview";
import {
	LessonSuppliesPanel,
	type LessonSupplyItem,
} from "@/features/services/training/components/lesson-supplies-sheet";
import {
	type TrainerMember,
	TrainersCell,
} from "@/features/services/training/components/trainers-cell";
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

const LESSON_TYPE_AR_LABELS: Record<string, string> = {
	PAGE: "صفحة",
	VIDEO: "فيديو",
	QUIZ: "تقييم واختبار",
	TEXT: "محتوى نصي",
	DOCUMENT: "مستند",
	AUDIO: "ملف صوتي",
	SURVEY: "استبيان",
};

const ADD_CONTENT_TYPE_OPTIONS: { type: LessonType; label: string }[] = [
	{ type: "PAGE", label: "صفحة" },
	{ type: "VIDEO", label: "فيديو" },
	{ type: "DOCUMENT", label: "مستند" },
	{ type: "AUDIO", label: "ملف صوتي" },
	{ type: "QUIZ", label: "تقييم واختبار" },
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
	onAddLesson,
	onAddContent,
	onEdit,
	onDuplicate,
	onDelete,
}: {
	label: string;
	onAddLesson?: () => void;
	onAddContent?: (type: LessonType) => void;
	onEdit?: () => void;
	onDuplicate?: () => void;
	onDelete: () => void;
}) {
	return (
		<DropdownMenu dir="rtl">
			<DropdownMenuTrigger
				aria-label={label}
				className="flex h-[15px] w-6 shrink-0 items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[#161616] cursor-pointer hover:border-primary/60 transition-colors"
			>
				<IconDots className="size-3" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="flex w-[177px] flex-col gap-1.5 rounded-[4px] border border-[#E5E5E5] bg-white px-1.5 py-3 shadow-[0px_4px_12px_rgba(0,0,0,0.12)] ring-0"
			>
				{onAddLesson && (
					<DropdownMenuItem
						onSelect={onAddLesson}
						className="h-[29px] gap-2 rounded-[4px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#F2F2F2] cursor-pointer"
					>
						<IconPlus className="size-4 text-primary" />
						إضافة درس جديد
					</DropdownMenuItem>
				)}
				{onAddContent && (
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="h-[29px] gap-2 rounded-[4px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#F2F2F2] cursor-pointer">
							<IconPlus className="size-4 text-primary" />
							<span>إضافة محتوى للدرس</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent className="flex w-[160px] flex-col gap-1 rounded-[4px] border border-[#E5E5E5] bg-white p-1.5 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]">
							{ADD_CONTENT_TYPE_OPTIONS.map((opt) => {
								const TypeIcon = LESSON_TYPE_ICONS[opt.type];
								return (
									<DropdownMenuItem
										key={opt.type}
										onSelect={() => onAddContent(opt.type)}
										className="h-[28px] gap-2 rounded-[4px] px-2 text-[11px] font-medium text-[#08090A] focus:bg-[#F2F2F2] cursor-pointer"
									>
										<TypeIcon className="size-3.5 text-primary" />
										<span>{opt.label}</span>
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				)}
				{onEdit && (
					<DropdownMenuItem
						onSelect={onEdit}
						className="h-[29px] gap-2 rounded-[4px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#F2F2F2] cursor-pointer"
					>
						<IconPencil className="size-4" />
						تعديل
					</DropdownMenuItem>
				)}
				{onDuplicate && (
					<DropdownMenuItem
						onSelect={onDuplicate}
						className="h-[29px] gap-2 rounded-[4px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#EBEBEB] cursor-pointer"
					>
						<IconCopy className="size-[15px]" />
						استنساخ
					</DropdownMenuItem>
				)}
				<DropdownMenuItem
					variant="destructive"
					onSelect={onDelete}
					className="h-[29px] gap-2 rounded-[4px] px-2 text-[12px] font-bold text-[#DC2626] focus:bg-[#EBEBEB] focus:text-[#DC2626] [&_svg]:text-[#EF4444] cursor-pointer"
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

type DragHandlers = {
	draggedUnitId: string | null;
	dragOverUnitTargetId: string | null;
	draggedLesson: { lessonId: string; fromUnitId: string } | null;
	dragOverUnitId: string | null;
	dragOverLessonTarget: { unitId: string; lessonIndex: number } | null;
	draggedContent: {
		contentId: string;
		fromLessonId: string;
		fromUnitId: string;
	} | null;
	dragOverLessonId: string | null;
	dragOverContentTarget: { lessonId: string; contentIndex: number } | null;
	onUnitDragStart: (e: DragEvent, unitId: string) => void;
	onUnitDragEnd: () => void;
	onUnitReorderDragOver: (e: DragEvent, targetUnitId: string) => void;
	onUnitReorderDragLeave: (e: DragEvent, unitId: string) => void;
	onUnitReorderDrop: (e: DragEvent, targetUnitId: string) => void;
	onLessonDragStart: (e: DragEvent, lessonId: string, fromUnitId: string) => void;
	onLessonDragEnd: () => void;
	onLessonDragOver: (
		e: DragEvent,
		unitId: string,
		lessonIndex: number,
		lessonId: string,
	) => void;
	onLessonDrop: (
		e: DragEvent,
		targetUnitId: string,
		targetIndex: number,
		targetLessonId: string,
	) => void;
	onContentDragStart: (
		e: DragEvent,
		contentId: string,
		fromLessonId: string,
		fromUnitId: string,
	) => void;
	onContentDragEnd: () => void;
	onContentDragOver: (e: DragEvent, lessonId: string, contentIndex: number) => void;
	onContentDrop: (e: DragEvent, targetLessonId: string, targetIndex: number) => void;
};

function DraggableLessonRow({
	lesson,
	unit,
	index,
	isActive,
	activeContentId,
	drag,
	onEdit,
	onSelectContent,
	onDelete,
	onDuplicate,
	onDeleteContent,
	onAddContent,
	onOpenSupplies,
	suppliesCount = 0,
}: {
	lesson: LessonResponse;
	unit: UnitResponse;
	index: number;
	isActive: boolean;
	activeContentId?: string | null;
	drag: DragHandlers;
	onEdit: () => void;
	onSelectContent: (contentId: string) => void;
	onDelete: () => void;
	onDuplicate?: () => void;
	onDeleteContent: (content: LessonContentItem) => void;
	onAddContent?: (type: LessonType) => void;
	onOpenSupplies?: () => void;
	suppliesCount?: number;
}) {
	const TypeIcon = LESSON_TYPE_ICONS[lesson.type];
	const contents = lesson.contents ?? [];
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		if (isActive || (activeContentId && contents.some((c) => c.id === activeContentId))) {
			setExpanded(true);
		}
	}, [isActive, activeContentId, contents]);

	const isThisLessonDragged = drag.draggedLesson?.lessonId === lesson.id;
	const isLessonDragOverThis =
		drag.dragOverLessonTarget?.unitId === unit.id &&
		drag.dragOverLessonTarget?.lessonIndex === index &&
		!isThisLessonDragged;
	const isContentDropOnLesson =
		drag.draggedContent !== null &&
		drag.draggedContent.fromLessonId !== lesson.id &&
		drag.dragOverLessonId === lesson.id;

	return (
		<li>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: draggable lesson row matching track stages */}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: lesson click opens editor */}
			<div
				data-draggable-lesson="true"
				draggable
				onDragStart={(e) => {
					e.stopPropagation();
					const target = e.target as HTMLElement;
					if (target.closest("button, input, textarea, a, [data-draggable-content]")) {
						e.preventDefault();
						return;
					}
					drag.onLessonDragStart(e, lesson.id, unit.id);
				}}
				onDragEnd={drag.onLessonDragEnd}
				onDragOver={(e) => drag.onLessonDragOver(e, unit.id, index, lesson.id)}
				onDrop={(e) => drag.onLessonDrop(e, unit.id, index, lesson.id)}
				onClick={(e) => {
					const target = e.target as HTMLElement;
					if (target.closest("button, input, textarea, a, [data-drag-handle]")) {
						return;
					}
					if (contents.length > 0) {
						setExpanded((prev) => !prev);
					}
					onEdit();
				}}
				className={cn(
					"group overflow-hidden rounded-[5px] border transition-all duration-150 cursor-pointer select-none",
					isThisLessonDragged
						? "opacity-35 scale-[0.98] border-dashed border-purple-500 bg-purple-50/60"
						: isLessonDragOverThis
							? "border-t-2 border-t-purple-600 border-[#E5E5E5] bg-purple-50/25"
							: isContentDropOnLesson
								? "border-purple-500 bg-purple-50/40 ring-2 ring-purple-400/40"
								: isActive
									? "border-primary/70 bg-primary/[0.04] shadow-xs"
									: "border-[#E5E5E5] dark:border-border bg-white dark:bg-card hover:border-primary/50 hover:bg-[#F9FAFB] dark:hover:bg-muted/40 hover:shadow-xs",
				)}
			>
				<div className="flex h-[37px] w-full items-center justify-between gap-2 px-2 text-right">
					<div className="flex min-w-0 flex-1 items-center gap-[6px]">
						<div
							data-drag-handle="true"
							title="اسحب لتغيير ترتيب الدرس أو نقله لوحدة أخرى"
							className="cursor-grab text-[#828283] hover:text-primary active:cursor-grabbing shrink-0 transition-colors p-0.5"
						>
							<IconGripVertical className="size-3 shrink-0" />
						</div>
						<span className="flex size-4.5 shrink-0 items-center justify-center rounded bg-[#F2F2F2] dark:bg-muted text-[10px] font-semibold text-[#6B6B67] tabular-nums">
							{index + 1}
						</span>
						<TypeIcon className="size-4.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
						<span className="truncate text-xs font-semibold leading-[14px] text-[#08090A] dark:text-foreground group-hover:text-primary transition-colors">
							{lesson.title}
						</span>
						{contents.length > 1 && (
							<span className="shrink-0 rounded bg-primary/10 px-1 py-0.5 text-[8.5px] font-semibold text-primary">
								{contents.length} محتويات
							</span>
						)}
						{(hasEditLessonDraft(lesson.id) ||
							contents.some((c) => hasEditLessonDraft(lesson.id, c.id))) && (
							<span className="shrink-0 rounded bg-amber-100 px-1 py-0.5 text-[8px] font-semibold text-amber-700">
								مسودة تعديل
							</span>
						)}
					</div>
					{/* biome-ignore lint/a11y/noStaticElementInteractions: stop propagation for action buttons */}
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: stop propagation for action buttons */}
					<div
						className="flex shrink-0 items-center gap-1.5"
						onClick={(e) => e.stopPropagation()}
					>
						{onDuplicate && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onDuplicate();
								}}
								title="استنساخ الدرس"
								className="h-[22px] rounded border border-[#E5E5E5] dark:border-border bg-white dark:bg-card px-2 text-[10px] font-medium text-[#08090A] dark:text-foreground hover:bg-[#FAFAFA] dark:hover:bg-muted transition-colors cursor-pointer"
							>
								استنساخ
							</button>
						)}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
							}}
							title="حذف الدرس"
							className="flex size-6 items-center justify-center rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
						>
							<IconTrash className="size-3.5" />
						</button>
						{contents.length > 0 && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									setExpanded((value) => !value);
								}}
								aria-label={expanded ? "طي مواد الدرس" : "عرض مواد الدرس"}
								className="rounded p-1 text-[#828283] hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
							>
								<IconChevronDown
									className={cn(
										"size-3.5 transition-transform duration-200",
										!expanded && "rotate-90",
									)}
								/>
							</button>
						)}
					</div>
				</div>

				{expanded && (contents.length > 0 || onAddContent) && (
					<div className="flex flex-col gap-1.5 border-t border-[#F0F0F0] dark:border-border/60 bg-[#FAFAFA]/80 dark:bg-muted/20 p-2">
						{contents.map((content, contentIndex) => (
							<DraggableLessonContent
								key={content.id}
								content={content}
								lessonId={lesson.id}
								unitId={unit.id}
								index={contentIndex}
								drag={drag}
								isActive={activeContentId === content.id}
								onSelect={() => onSelectContent(content.id)}
								onDelete={() => onDeleteContent(content)}
							/>
						))}
						{onAddContent && (
							<div className="pt-0.5">
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={(e) => {
										e.stopPropagation();
										onAddContent("PAGE");
									}}
									className="w-full h-[28px] border border-dashed border-[#DCDCF0] bg-white hover:bg-primary/5 hover:border-primary/50 text-primary text-[11px] font-medium gap-1.5 rounded-[4px] cursor-pointer transition-colors"
								>
									<IconPlus className="size-3.5" />
									<span>إضافة محتوى إضافي للدرس</span>
								</Button>
							</div>
						)}
					</div>
				)}
				{/* شريط إعدادات المستلزمات لهذا الدرس — يفتح لوحة إعداد مواد الخدمة والمخزون */}
				<div className="px-2 pb-2 pt-1 border-t border-[#F0F0F0]/60 dark:border-border/40">
					<div className="flex items-center justify-between gap-2 rounded-[4px] border border-[#E5E5E5] dark:border-border bg-[#F9FAFB] dark:bg-muted/30 p-2">
						<div className="flex items-center gap-2 min-w-0">
							<div className="flex size-6 shrink-0 items-center justify-center rounded border border-[#E5E5E5] dark:border-border bg-white dark:bg-card text-muted-foreground">
								<IconFileDescription className="size-3.5" />
							</div>
							<div className="flex flex-col text-right min-w-0">
								<span className="text-[11px] font-semibold text-[#08090A] dark:text-foreground">
									إعدادات المستلزمات
								</span>
								<span className="truncate text-[9.5px] text-muted-foreground leading-tight">
									{suppliesCount > 0
										? `${suppliesCount} ${suppliesCount === 1 ? "مستلزم محدد" : "مستلزمات محددة"}`
										: "حدد المستلزمات المطلوبة لهذا الدرس، لخصمها تلقائيًا من المخزون عند تنفيذ الدرس."}
								</span>
							</div>
						</div>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onOpenSupplies?.();
							}}
							aria-label="إعداد المستلزمات"
							className="flex size-6 shrink-0 items-center justify-center rounded border border-[#E5E5E5] dark:border-border bg-white dark:bg-card text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
						>
							<IconPlus className="size-3" />
						</button>
					</div>
				</div>
			</div>
		</li>
	);
}

function DraggableLessonContent({
	content,
	lessonId,
	unitId,
	index,
	drag,
	isActive = false,
	onSelect,
	onDelete,
}: {
	content: LessonContentItem;
	lessonId: string;
	unitId: string;
	index: number;
	drag: DragHandlers;
	isActive?: boolean;
	onSelect: () => void;
	onDelete?: () => void;
}) {
	const Icon = LESSON_TYPE_ICONS[content.type] || IconFileText;
	const isThisContentDragged = drag.draggedContent?.contentId === content.id;
	const isContentDragOverThis =
		drag.dragOverContentTarget?.lessonId === lessonId &&
		drag.dragOverContentTarget?.contentIndex === index &&
		!isThisContentDragged;

	const typeLabel = LESSON_TYPE_AR_LABELS[content.type] || "محتوى";

	return (
		/* biome-ignore lint/a11y/noStaticElementInteractions: draggable lesson content chip */
		/* biome-ignore lint/a11y/useKeyWithClickEvents: chip click opens content in editor */
		<div
			data-draggable-content="true"
			draggable
			onDragStart={(e) => {
				e.stopPropagation();
				const target = e.target as HTMLElement;
				if (target.closest("input, textarea, a, button")) {
					e.preventDefault();
					return;
				}
				drag.onContentDragStart(e, content.id, lessonId, unitId);
			}}
			onDragEnd={drag.onContentDragEnd}
			onDragOver={(e) => drag.onContentDragOver(e, lessonId, index)}
			onDrop={(e) => drag.onContentDrop(e, lessonId, index)}
			onClick={(e) => {
				e.stopPropagation();
				onSelect();
			}}
			className={cn(
				"group/content flex w-full h-[36px] items-center justify-between gap-2 rounded-[5px] border bg-white dark:bg-card px-2.5 transition-all cursor-pointer select-none",
				isThisContentDragged
					? "opacity-35 scale-[0.98] border-dashed border-purple-500 bg-purple-50/60"
					: isContentDragOverThis
						? "border-purple-600 bg-purple-50/40 ring-2 ring-purple-400/50"
						: isActive
							? "border-primary bg-primary/[0.06] shadow-2xs"
							: "border-[#E5E5E5] dark:border-border hover:border-primary/50 hover:bg-[#F9FAFB] dark:hover:bg-muted/40 hover:shadow-2xs",
			)}
		>
			<div className="flex min-w-0 flex-1 items-center gap-2">
				<div
					data-drag-handle="true"
					title="اسحب لإعادة ترتيب المحتوى أو نقله لدرس آخر"
					className="cursor-grab text-[#9B9B9D] hover:text-primary active:cursor-grabbing shrink-0 transition-colors p-0.5"
				>
					<IconGripVertical className="size-3" />
				</div>
				<Icon className="size-4 shrink-0 text-primary" />
				<span className="truncate text-xs font-medium text-foreground group-hover/content:text-primary transition-colors">
					{content.title || "محتوى بلا عنوان"}
				</span>
			</div>

			<div className="flex shrink-0 items-center gap-1.5">
				<span className="rounded bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
					{typeLabel}
				</span>
				{onDelete && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
						aria-label={`حذف ${content.title || "المحتوى"}`}
						title="حذف هذا المحتوى"
						className="rounded p-1 text-[#9B9B9D] hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
					>
						<IconTrash className="size-3.5" />
					</button>
				)}
			</div>
		</div>
	);
}

// فاصل زمني بين الدروس أو الوحدات المتعاقبة — مطابق لتصميم لوحة الخطط والزيارات
function IntervalDivider({
	value,
	unit,
	label = "الفاصل الزمني",
	title = "الفاصل الزمني التلقائي",
	className,
	onValueChange,
	onUnitChange,
}: {
	value: number;
	unit: "DAY" | "WEEK" | "MONTH";
	label?: string;
	title?: string;
	className?: string;
	onValueChange: (value: number) => void;
	onUnitChange: (unit: "DAY" | "WEEK" | "MONTH") => void;
}) {
	return (
		<div
			className={cn("flex items-center gap-2.5 my-1", className)}
			dir="rtl"
		>
			<span className="h-px flex-1 bg-[#E5E5E5] dark:bg-border" />
			<div className="flex items-center gap-1.5 text-[11px] text-[#08090A] dark:text-foreground">
				<span className="font-medium text-[#6B6B67] dark:text-muted-foreground">{label}</span>
				<div title={title}>
					<IconInfoCircle className="size-3.5 text-[#9B9B9D]" />
				</div>
				<div className="flex h-[26px] items-center gap-1 rounded-[4px] border border-[#E5E5E5] dark:border-border bg-white dark:bg-card px-1.5 shadow-2xs">
					<button
						type="button"
						onClick={() => onValueChange(value + 1)}
						className="flex size-4 items-center justify-center text-[#828283] hover:text-foreground cursor-pointer transition-colors"
						title="زيادة"
					>
						<IconPlus className="size-3" />
					</button>
					<span className="w-5 text-center text-[11px] tabular-nums font-semibold">
						{value.toString().padStart(2, "0")}
					</span>
					<button
						type="button"
						onClick={() => onValueChange(Math.max(0, value - 1))}
						className="flex size-4 items-center justify-center text-[#828283] hover:text-foreground cursor-pointer transition-colors"
						title="إنقاص"
					>
						<IconMinus className="size-3" />
					</button>
				</div>
				<Select
					value={unit}
					onValueChange={(v) => onUnitChange(v as "DAY" | "WEEK" | "MONTH")}
					dir="rtl"
				>
					<SelectTrigger
						size="sm"
						className="h-[26px] min-h-[26px] py-0 pe-1.5 ps-2 text-[11px] rounded-[4px] border-[#E5E5E5] dark:border-border bg-white dark:bg-card text-[#08090A] dark:text-foreground gap-1 shadow-2xs font-normal [&_svg]:size-3"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent dir="rtl">
						<SelectItem
							value="DAY"
							className="text-right text-xs"
						>
							يوم
						</SelectItem>
						<SelectItem
							value="WEEK"
							className="text-right text-xs"
						>
							أسبوع
						</SelectItem>
						<SelectItem
							value="MONTH"
							className="text-right text-xs"
						>
							شهر
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<span className="h-px flex-1 bg-[#E5E5E5] dark:bg-border" />
		</div>
	);
}

// أكورديون وحدة واحدة — يرفع أحداث اختيار/إضافة الدرس للمحرر المركزي ويدعم السحب والإفلات السلس
function UnitAccordion({
	unit,
	courseName,
	drag,
	onDuplicate,
	onRenameUnit,
	onRemoveLesson,
	onAddLesson,
	onEditLesson,
	onSelectLessonContent,
	onDeleteUnit,
	onDeleteContent,
	onAddLessonContent,
	activeEditorLessonId,
	activeEditorContentId,
	isSelected,
	onSelect,
	pendingAddDraft,
	onResumeDraft,
	onDiscardDraft,
	onOpenSupplies,
	getLessonSuppliesCount,
	getLessonInterval,
	onUpdateLessonInterval,
	onDuplicateLesson,
}: {
	unit: UnitResponse;
	courseName: string;
	drag: DragHandlers;
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
	onDeleteContent: (lesson: LessonResponse, content: LessonContentItem) => void;
	onAddLessonContent: (
		lesson: LessonResponse,
		unitTitle: string,
		unitId: string,
		type: LessonType,
	) => void;
	activeEditorLessonId?: string | null;
	activeEditorContentId?: string | null;
	isSelected?: boolean;
	onSelect?: () => void;
	pendingAddDraft?: StoredLessonDraft | null;
	onResumeDraft?: (unitId: string, unitTitle: string, draftType?: LessonType) => void;
	onDiscardDraft?: (unitId: string) => void;
	onOpenSupplies?: (lesson: LessonResponse) => void;
	getLessonSuppliesCount?: (lessonId: string) => number;
	getLessonInterval?: (
		lessonId: string,
	) => { value: number; unit: "DAY" | "WEEK" | "MONTH" } | undefined;
	onUpdateLessonInterval?: (
		lessonId: string,
		value: number,
		unit: "DAY" | "WEEK" | "MONTH",
	) => void;
	onDuplicateLesson?: (lesson: LessonResponse) => void;
}) {
	const [expanded, setExpanded] = useState(true);
	const [editingName, setEditingName] = useState(false);
	const [title, setTitle] = useState(unit.title);
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [deletingLesson, setDeletingLesson] = useState<LessonResponse | null>(null);

	// تفعيل الفواصل الزمنية تلقائيًا إذا كانت الوحدة تحتوي على أكثر من درس واحد
	const [intervalsEnabled, setIntervalsEnabled] = useState(() => unit.lessons.length > 1);
	const prevLessonsCountRef = useRef(unit.lessons.length);
	useEffect(() => {
		if (unit.lessons.length > 1 && prevLessonsCountRef.current <= 1) {
			setIntervalsEnabled(true);
		}
		prevLessonsCountRef.current = unit.lessons.length;
	}, [unit.lessons.length]);

	const commitRename = () => {
		setEditingName(false);
		if (title.trim() && title !== unit.title) onRenameUnit(unit.id, title.trim());
		else setTitle(unit.title);
	};

	const hasLessons = unit.lessons.length > 0;
	const isThisUnitDragged = drag.draggedUnitId === unit.id;
	const isUnitReorderTarget =
		drag.draggedUnitId !== null &&
		drag.draggedUnitId !== unit.id &&
		drag.dragOverUnitTargetId === unit.id;
	const isUnitLessonDropActive =
		drag.dragOverUnitId === unit.id &&
		drag.draggedLesson !== null &&
		drag.draggedLesson.fromUnitId !== unit.id;

	return (
		/* biome-ignore lint/a11y/noStaticElementInteractions: dropzone container for unit and lessons */
		<div
			onDragOver={(e) => drag.onUnitReorderDragOver(e, unit.id)}
			onDragLeave={(e) => drag.onUnitReorderDragLeave(e, unit.id)}
			onDrop={(e) => drag.onUnitReorderDrop(e, unit.id)}
			className={cn(
				"flex w-full flex-col rounded-[6px] transition-all duration-200",
				isThisUnitDragged &&
					"opacity-40 scale-[0.99] ring-1 ring-dashed ring-purple-500 bg-purple-50/20",
				isUnitReorderTarget && "ring-2 ring-purple-600 bg-purple-50/40 scale-[1.01]",
				!isThisUnitDragged &&
					!isUnitReorderTarget &&
					(isUnitLessonDropActive
						? "ring-2 ring-purple-500 bg-purple-50/40"
						: isSelected && "ring-1 ring-[#6366F1]/50 shadow-2xs"),
			)}
		>
			{/* رأس الوحدة — قابل للسحب مثل المرحلة في المسارات */}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: header delegates unit selection */}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: draggable unit header */}
			<div
				draggable={!editingName}
				onDragStart={(e) => {
					const target = e.target as HTMLElement;
					if (
						target.closest(
							"button, input, textarea, a, [data-draggable-lesson], [data-draggable-content]",
						)
					) {
						return;
					}
					drag.onUnitDragStart(e, unit.id);
				}}
				onDragEnd={drag.onUnitDragEnd}
				onClick={(e) => {
					const target = e.target as HTMLElement;
					if (target.closest("button, input, textarea, a, [data-drag-handle]")) {
						return;
					}
					setExpanded((v) => !v);
					onSelect?.();
				}}
				className={cn(
					"flex h-[32px] items-center justify-between border-[0.75px] border-[#E5E5E5] dark:border-border bg-[#FAFAFA] dark:bg-muted/30 ps-2.5 pe-3 cursor-pointer select-none transition-colors",
					"hover:bg-[#F3F4F6] hover:border-[#D1D5DB] dark:hover:bg-muted/60",
					expanded ? "rounded-t-[5px]" : "rounded-[5px]",
					isSelected && "bg-primary/[0.05] border-primary/40",
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
						className="flex size-4 items-center justify-center text-[#9B9B9D] hover:text-foreground cursor-pointer transition-colors"
					>
						<IconChevronDown
							className={cn(
								"size-3 transition-transform duration-200",
								!expanded && "rotate-90",
							)}
						/>
					</button>
					{/* biome-ignore lint/a11y/noStaticElementInteractions: draggable unit grip handle */}
					<div
						data-drag-handle="true"
						draggable
						onDragStart={(e) => drag.onUnitDragStart(e, unit.id)}
						onDragEnd={drag.onUnitDragEnd}
						title="اسحبي لتغيير ترتيب الوحدة"
						className="cursor-grab text-[#828283] hover:text-primary active:cursor-grabbing transition-colors p-0.5"
					>
						<IconGripVertical className="size-3 shrink-0" />
					</div>

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
						onAddLesson={() => onAddLesson(unit.id, unit.title)}
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
				<div className="flex flex-col gap-2.5 rounded-b-[4px] border-[0.75px] border-t-0 border-[#E5E5E5] bg-white px-2 pt-2.5 pb-[4.5px]">
					{/* شريط تنبيه تفعيل الفواصل الزمنية تلقائياً عند إضافة أكثر من درس */}
					{unit.lessons.length > 1 && (
						<div className="flex items-center justify-center rounded-[4px] border border-amber-200/90 bg-amber-50/90 py-1.5 px-3 text-center text-[11px] font-medium text-amber-800">
							تُفعَّل الفواصل الزمنية تلقائيًا عند إضافة أكثر من درس.
						</div>
					)}

					{/* شريط عدد الدروس وزر تفعيل/تعطيل الفواصل الزمنية */}
					{hasLessons && (
						<div className="flex items-center justify-between px-0.5 text-xs">
							<span className="text-[11px] font-medium text-[#08090A] dark:text-foreground">
								{unit.lessons.length}{" "}
								{unit.lessons.length === 1
									? "درس"
									: unit.lessons.length === 2
										? "درسان"
										: unit.lessons.length <= 10
											? "دروس"
											: "درس"}
							</span>
							<div className="flex items-center gap-2">
								<span className="text-[11px] font-medium text-muted-foreground select-none">
									فواصل زمنية
								</span>
								<Switch
									checked={intervalsEnabled}
									onCheckedChange={setIntervalsEnabled}
									size="sm"
									aria-label="تفعيل الفواصل الزمنية"
								/>
							</div>
						</div>
					)}

					{/* الدروس المحفوظة */}
					{hasLessons && (
						<ul className="flex flex-col gap-1.5">
							{unit.lessons.map((lesson, index) => (
								<Fragment key={lesson.id}>
									<DraggableLessonRow
										lesson={lesson}
										unit={unit}
										index={index}
										drag={drag}
										isActive={activeEditorLessonId === lesson.id}
										activeContentId={
											activeEditorLessonId === lesson.id ? activeEditorContentId : undefined
										}
										onEdit={() => onEditLesson(lesson, unit.title, unit.id)}
										onDuplicate={() => onDuplicateLesson?.(lesson)}
										onSelectContent={(contentId) =>
											onSelectLessonContent(lesson, unit.title, unit.id, contentId)
										}
										onDelete={() => setDeletingLesson(lesson)}
										onDeleteContent={(content) => onDeleteContent(lesson, content)}
										onAddContent={(type) =>
											onAddLessonContent(lesson, unit.title, unit.id, type)
										}
										onOpenSupplies={() => onOpenSupplies?.(lesson)}
										suppliesCount={getLessonSuppliesCount?.(lesson.id) ?? 0}
									/>
									{intervalsEnabled && index < unit.lessons.length - 1 && (
										<IntervalDivider
											value={getLessonInterval?.(lesson.id)?.value ?? 0}
											unit={getLessonInterval?.(lesson.id)?.unit ?? "DAY"}
											label="الفاصل الزمني"
											title="الفاصل الزمني بين هذا الدرس والدرس التالي"
											onValueChange={(val) =>
												onUpdateLessonInterval?.(
													lesson.id,
													val,
													getLessonInterval?.(lesson.id)?.unit ?? "DAY",
												)
											}
											onUnitChange={(u) =>
												onUpdateLessonInterval?.(
													lesson.id,
													getLessonInterval?.(lesson.id)?.value ?? 0,
													u,
												)
											}
										/>
									)}
								</Fragment>
							))}
						</ul>
					)}

					{isUnitLessonDropActive && (
						<div className="rounded-[4px] border border-dashed border-purple-500 bg-purple-50/70 px-2 py-2 text-center text-[10px] font-medium text-purple-700">
							أفلتي الدرس هنا لنقله إلى «{unit.title}»
						</div>
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

					{/* زر إضافة درس جديد — بعرض كامل مع إزالة زر درس بصفحة */}
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
						className="w-full h-8 gap-1.5 rounded-[5px] border-dashed border-[#D4D4D8] dark:border-border bg-white dark:bg-card/50 text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/[0.04] transition-all cursor-pointer justify-center shadow-2xs"
					>
						<IconPlus className="size-3.5 text-primary" />
						<span>إضافة درس جديد</span>
					</Button>
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
	trainers,
	onGenerateAI,
	onEnsureCourseCreated,
	onDirtyChange,
	activeSuppliesLesson: externalActiveSuppliesLesson,
	onOpenSuppliesLesson,
	lessonSupplies: externalLessonSupplies,
	onSaveLessonSupplies: externalSaveLessonSupplies,
}: {
	courseId: string | null;
	trainers?: TrainerMember[];
	onGenerateAI?: () => void;
	onEnsureCourseCreated?: () => Promise<string>;
	onDirtyChange?: (hasUnsaved: boolean) => void;
	activeSuppliesLesson?: LessonResponse | null;
	onOpenSuppliesLesson?: (lesson: LessonResponse | null) => void;
	lessonSupplies?: Record<string, LessonSupplyItem[]>;
	onSaveLessonSupplies?: (lessonId: string, items: LessonSupplyItem[]) => void;
}) {
	const [internalCourseId, setInternalCourseId] = useState<string | null>(courseId);
	useEffect(() => {
		if (courseId) setInternalCourseId(courseId);
	}, [courseId]);

	const effectiveCourseId = courseId || internalCourseId;
	const { course, isLoading } = useCourse(effectiveCourseId);

	// قائمة المدربين المعينين للدورة لعرضها في ترويسة الهيكل أعلى اليمين
	const effectiveTrainers = useMemo(() => {
		if (trainers && trainers.length > 0) return trainers;
		if (course?.trainers && course.trainers.length > 0) {
			return course.trainers.map((t) => {
				const staffObj = t as unknown as {
					id?: string;
					staffId?: string;
					name?: string;
					avatar?: string;
					staff?: { id?: string; name?: string; avatar?: string };
				};
				return {
					id: staffObj.id || staffObj.staffId || staffObj.staff?.id || "",
					name: staffObj.name || staffObj.staff?.name || "مدرب",
					avatar: staffObj.avatar || staffObj.staff?.avatar,
				};
			});
		}
		return [];
	}, [trainers, course?.trainers]);
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
	const [draggedUnitId, setDraggedUnitId] = useState<string | null>(null);
	const [dragOverUnitTargetId, setDragOverUnitTargetId] = useState<string | null>(null);
	const [draggedLesson, setDraggedLesson] = useState<{
		lessonId: string;
		fromUnitId: string;
	} | null>(null);
	const [dragOverUnitId, setDragOverUnitId] = useState<string | null>(null);
	const [dragOverLessonTarget, setDragOverLessonTarget] = useState<{
		unitId: string;
		lessonIndex: number;
	} | null>(null);
	const [draggedContent, setDraggedContent] = useState<{
		contentId: string;
		fromLessonId: string;
		fromUnitId: string;
	} | null>(null);
	const [dragOverLessonId, setDragOverLessonId] = useState<string | null>(null);
	const [dragOverContentTarget, setDragOverContentTarget] = useState<{
		lessonId: string;
		contentIndex: number;
	} | null>(null);
	const [copyingUnitId, setCopyingUnitId] = useState<string | null>(null);
	const [deletingContent, setDeletingContent] = useState<{
		lesson: LessonResponse;
		content: LessonContentItem;
	} | null>(null);
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

	// لوحة إعداد مواد الخدمة والمخزون للدرس
	const [activeSuppliesLesson, setActiveSuppliesLesson] = useState<LessonResponse | null>(
		null,
	);
	const effectiveActiveSuppliesLesson =
		externalActiveSuppliesLesson !== undefined
			? externalActiveSuppliesLesson
			: activeSuppliesLesson;
	const [lessonSupplies, setLessonSupplies] = useState<Record<string, LessonSupplyItem[]>>(
		() => {
			if (typeof window !== "undefined") {
				try {
					const stored = localStorage.getItem(
						`sanad_course_supplies_${effectiveCourseId || "default"}`,
					);
					if (stored) return JSON.parse(stored);
				} catch {}
			}
			return {};
		},
	);
	const effectiveLessonSupplies = externalLessonSupplies ?? lessonSupplies;

	const handleOpenSupplies = (lesson: LessonResponse) => {
		onOpenSuppliesLesson?.(lesson);
		setActiveSuppliesLesson(lesson);
	};

	const handleCloseSupplies = () => {
		onOpenSuppliesLesson?.(null);
		setActiveSuppliesLesson(null);
	};

	// الفواصل الزمنية بين الدروس
	const [lessonIntervals, setLessonIntervals] = useState<
		Record<string, { value: number; unit: "DAY" | "WEEK" | "MONTH" }>
	>(() => {
		if (typeof window !== "undefined") {
			try {
				const stored = localStorage.getItem(
					`sanad_course_intervals_${effectiveCourseId || "default"}`,
				);
				if (stored) return JSON.parse(stored);
			} catch {}
		}
		return {};
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem(
					`sanad_course_supplies_${effectiveCourseId || "default"}`,
					JSON.stringify(lessonSupplies),
				);
			} catch {}
		}
	}, [lessonSupplies, effectiveCourseId]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem(
					`sanad_course_intervals_${effectiveCourseId || "default"}`,
					JSON.stringify(lessonIntervals),
				);
			} catch {}
		}
	}, [lessonIntervals, effectiveCourseId]);

	const handleUpdateLessonInterval = (
		lessonId: string,
		value: number,
		unit: "DAY" | "WEEK" | "MONTH",
	) => {
		setLessonIntervals((prev) => ({
			...prev,
			[lessonId]: { value, unit },
		}));
	};

	const handleSaveLessonSupplies = (lessonId: string, items: LessonSupplyItem[]) => {
		setLessonSupplies((prev) => ({
			...prev,
			[lessonId]: items,
		}));
		externalSaveLessonSupplies?.(lessonId, items);
	};

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

	// الفواصل الزمنية بين الوحدات
	const [unitIntervalsEnabled, setUnitIntervalsEnabled] = useState(() => units.length > 1);
	const prevUnitsCountRef = useRef(units.length);
	useEffect(() => {
		if (units.length > 1 && prevUnitsCountRef.current <= 1) {
			setUnitIntervalsEnabled(true);
		}
		prevUnitsCountRef.current = units.length;
	}, [units.length]);

	const [unitIntervals, setUnitIntervals] = useState<
		Record<string, { value: number; unit: "DAY" | "WEEK" | "MONTH" }>
	>(() => {
		if (typeof window !== "undefined") {
			try {
				const stored = localStorage.getItem(
					`sanad_course_unit_intervals_${effectiveCourseId || "default"}`,
				);
				if (stored) return JSON.parse(stored);
			} catch {}
		}
		return {};
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem(
					`sanad_course_unit_intervals_${effectiveCourseId || "default"}`,
					JSON.stringify(unitIntervals),
				);
			} catch {}
		}
	}, [unitIntervals, effectiveCourseId]);

	const handleUpdateUnitInterval = (
		unitId: string,
		value: number,
		unit: "DAY" | "WEEK" | "MONTH",
	) => {
		setUnitIntervals((prev) => ({
			...prev,
			[unitId]: { value, unit },
		}));
	};

	const resetAllDragState = () => {
		setDraggedUnitId(null);
		setDragOverUnitTargetId(null);
		setDraggedLesson(null);
		setDragOverUnitId(null);
		setDragOverLessonTarget(null);
		setDraggedContent(null);
		setDragOverLessonId(null);
		setDragOverContentTarget(null);
	};

	const moveUnit = (unitToMoveId: string, targetUnitId: string) => {
		if (unitToMoveId === targetUnitId) return;
		const from = units.findIndex((unit) => unit.id === unitToMoveId);
		const to = units.findIndex((unit) => unit.id === targetUnitId);
		if (from < 0 || to < 0 || from === to) return;
		const reordered = [...units];
		const [moved] = reordered.splice(from, 1);
		if (!moved) return;
		reordered.splice(to, 0, moved);
		void reorderContents(
			reordered.map((unit, position) => ({
				unitId: unit.id,
				levelId: unit.levelId,
				position,
			})),
		);
		toast.success(`تم تغيير ترتيب الوحدة «${moved.title}»`);
	};

	const moveLesson = (
		lessonId: string,
		fromUnitId: string,
		targetUnitId: string,
		targetIndex?: number,
	) => {
		const sourceUnit = units.find((u) => u.id === fromUnitId);
		const targetUnit = units.find((u) => u.id === targetUnitId);
		if (!sourceUnit || !targetUnit) return;
		const sourceIndex = sourceUnit.lessons.findIndex((l) => l.id === lessonId);
		if (sourceIndex < 0) return;
		if (
			fromUnitId === targetUnitId &&
			targetIndex !== undefined &&
			sourceIndex === targetIndex
		) {
			return;
		}

		const reorderedUnits = units.map((unit) => ({
			...unit,
			lessons: [...unit.lessons],
		}));
		const source = reorderedUnits.find((unit) => unit.id === fromUnitId);
		const target = reorderedUnits.find((unit) => unit.id === targetUnitId);
		if (!source || !target) return;
		const [moved] = source.lessons.splice(sourceIndex, 1);
		if (!moved) return;

		const insertAt =
			targetIndex !== undefined && targetIndex >= 0 && targetIndex <= target.lessons.length
				? targetIndex
				: target.lessons.length;
		target.lessons.splice(insertAt, 0, { ...moved, unitId: target.id });

		const items: ReorderLessonInput[] = reorderedUnits.flatMap((unit) =>
			unit.lessons.map((lesson, position) => ({
				lessonId: lesson.id,
				unitId: unit.id,
				position,
			})),
		);
		void reorderLessons(items);
		toast.success(
			fromUnitId !== targetUnitId
				? `تم نقل «${moved.title}» إلى ${targetUnit.title}`
				: `تمت إعادة ترتيب «${moved.title}»`,
		);
	};

	const moveContent = (
		contentId: string,
		fromLessonId: string,
		targetLessonId: string,
		targetIndex?: number,
	) => {
		const reorderedUnits = units.map((unit) => ({
			...unit,
			lessons: unit.lessons.map((lesson) => ({
				...lesson,
				contents: Array.isArray(lesson.contents) ? [...lesson.contents] : [],
			})),
		}));
		const sourceLesson = reorderedUnits
			.flatMap((unit) => unit.lessons)
			.find((lesson) => lesson.id === fromLessonId);
		const targetLesson = reorderedUnits
			.flatMap((unit) => unit.lessons)
			.find((lesson) => lesson.id === targetLessonId);
		if (!sourceLesson || !targetLesson) return;

		const sourceContents = sourceLesson.contents ?? [];
		const from = sourceContents.findIndex((item) => item.id === contentId);
		if (from < 0) return;
		if (fromLessonId === targetLessonId && targetIndex !== undefined && from === targetIndex) {
			return;
		}
		const [moved] = sourceContents.splice(from, 1);
		if (!moved) return;
		const targetContents = targetLesson.contents ?? [];
		const insertAt =
			targetIndex !== undefined && targetIndex >= 0 && targetIndex <= targetContents.length
				? targetIndex
				: targetContents.length;
		targetContents.splice(insertAt, 0, moved);
		targetLesson.contents = targetContents;

		const items: ReorderLessonInput[] = reorderedUnits.flatMap((unit) =>
			unit.lessons.map((lesson, position) => ({
				lessonId: lesson.id,
				unitId: unit.id,
				position,
				contents: lesson.contents ?? [],
			})),
		);
		void reorderLessons(items);
		toast.success(
			fromLessonId !== targetLessonId
				? `تم نقل «${moved.title}» إلى ${targetLesson.title}`
				: `تمت إعادة ترتيب «${moved.title}»`,
		);
	};

	const dragHandlers: DragHandlers = {
		draggedUnitId,
		dragOverUnitTargetId,
		draggedLesson,
		dragOverUnitId,
		dragOverLessonTarget,
		draggedContent,
		dragOverLessonId,
		dragOverContentTarget,
		onUnitDragStart: (e, unitId) => {
			e.stopPropagation();
			setDraggedUnitId(unitId);
			try {
				e.dataTransfer.setData("application/course-unit-id", unitId);
			} catch {
				// ignore
			}
			e.dataTransfer.effectAllowed = "move";
		},
		onUnitDragEnd: resetAllDragState,
		onUnitReorderDragOver: (e, targetUnitId) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = "move";
			if (draggedUnitId) {
				e.stopPropagation();
				if (dragOverUnitTargetId !== targetUnitId) {
					setDragOverUnitTargetId(targetUnitId);
				}
				return;
			}
			if (draggedLesson && dragOverUnitId !== targetUnitId) {
				setDragOverUnitId(targetUnitId);
			}
		},
		onUnitReorderDragLeave: (e, unitId) => {
			const related = e.relatedTarget as HTMLElement | null;
			if (!e.currentTarget.contains(related)) {
				if (draggedUnitId && dragOverUnitTargetId === unitId) {
					setDragOverUnitTargetId(null);
				}
				if (dragOverUnitId === unitId) {
					setDragOverUnitId(null);
				}
			}
		},
		onUnitReorderDrop: (e, targetUnitId) => {
			e.preventDefault();
			e.stopPropagation();
			let unitToMove = draggedUnitId;
			if (!unitToMove) {
				try {
					unitToMove = e.dataTransfer.getData("application/course-unit-id") || null;
				} catch {
					// ignore
				}
			}
			let lessonData = draggedLesson;
			if (!lessonData) {
				try {
					const raw = e.dataTransfer.getData("application/course-lesson");
					if (raw) lessonData = JSON.parse(raw);
				} catch {
					// ignore
				}
			}
			resetAllDragState();
			if (unitToMove) {
				moveUnit(unitToMove, targetUnitId);
				return;
			}
			if (lessonData) {
				moveLesson(lessonData.lessonId, lessonData.fromUnitId, targetUnitId);
			}
		},
		onLessonDragStart: (e, lessonId, fromUnitId) => {
			setDraggedLesson({ lessonId, fromUnitId });
			try {
				e.dataTransfer.setData(
					"application/course-lesson",
					JSON.stringify({ lessonId, fromUnitId }),
				);
			} catch {
				// ignore
			}
			e.dataTransfer.effectAllowed = "move";
		},
		onLessonDragEnd: resetAllDragState,
		onLessonDragOver: (e, unitId, lessonIndex, lessonId) => {
			e.preventDefault();
			e.stopPropagation();
			e.dataTransfer.dropEffect = "move";
			if (draggedUnitId) {
				if (dragOverUnitTargetId !== unitId) setDragOverUnitTargetId(unitId);
				return;
			}
			if (draggedContent) {
				if (dragOverLessonId !== lessonId) setDragOverLessonId(lessonId);
				return;
			}
			if (
				dragOverLessonTarget?.unitId !== unitId ||
				dragOverLessonTarget?.lessonIndex !== lessonIndex
			) {
				setDragOverLessonTarget({ unitId, lessonIndex });
				setDragOverUnitId(unitId);
			}
		},
		onLessonDrop: (e, targetUnitId, targetIndex, targetLessonId) => {
			e.preventDefault();
			e.stopPropagation();
			let unitToMove = draggedUnitId;
			if (!unitToMove) {
				try {
					unitToMove = e.dataTransfer.getData("application/course-unit-id") || null;
				} catch {
					// ignore
				}
			}
			let lessonData = draggedLesson;
			if (!lessonData) {
				try {
					const raw = e.dataTransfer.getData("application/course-lesson");
					if (raw) lessonData = JSON.parse(raw);
				} catch {
					// ignore
				}
			}
			let contentData = draggedContent;
			if (!contentData) {
				try {
					const raw = e.dataTransfer.getData("application/course-content");
					if (raw) contentData = JSON.parse(raw);
				} catch {
					// ignore
				}
			}
			resetAllDragState();
			if (unitToMove) {
				moveUnit(unitToMove, targetUnitId);
				return;
			}
			if (contentData) {
				moveContent(contentData.contentId, contentData.fromLessonId, targetLessonId);
				return;
			}
			if (lessonData) {
				moveLesson(lessonData.lessonId, lessonData.fromUnitId, targetUnitId, targetIndex);
			}
		},
		onContentDragStart: (e, contentId, fromLessonId, fromUnitId) => {
			setDraggedContent({ contentId, fromLessonId, fromUnitId });
			try {
				e.dataTransfer.setData(
					"application/course-content",
					JSON.stringify({ contentId, fromLessonId, fromUnitId }),
				);
			} catch {
				// ignore
			}
			e.dataTransfer.effectAllowed = "move";
		},
		onContentDragEnd: resetAllDragState,
		onContentDragOver: (e, lessonId, contentIndex) => {
			e.preventDefault();
			e.stopPropagation();
			e.dataTransfer.dropEffect = "move";
			if (
				dragOverContentTarget?.lessonId !== lessonId ||
				dragOverContentTarget?.contentIndex !== contentIndex
			) {
				setDragOverContentTarget({ lessonId, contentIndex });
				setDragOverLessonId(lessonId);
			}
		},
		onContentDrop: (e, targetLessonId, targetIndex) => {
			e.preventDefault();
			e.stopPropagation();
			let contentData = draggedContent;
			if (!contentData) {
				try {
					const raw = e.dataTransfer.getData("application/course-content");
					if (raw) contentData = JSON.parse(raw);
				} catch {
					// ignore
				}
			}
			resetAllDragState();
			if (contentData) {
				moveContent(
					contentData.contentId,
					contentData.fromLessonId,
					targetLessonId,
					targetIndex,
				);
			}
		},
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

	// حذف محتوى من داخل درس
	const handleDeleteContent = async (lesson: LessonResponse, contentId: string) => {
		const existingContents = lesson.contents ?? [];
		if (existingContents.length <= 1) {
			await removeLesson(lesson);
			if (editor?.mode === "edit" && editor.lesson.id === lesson.id) {
				closeEditorPanel(true);
			}
			clearLessonDraft(getLessonDraftKey({ lessonId: lesson.id, contentId }));
			refreshDraftBadges();
			toast.success("تم حذف الدرس بنجاح");
			return;
		}

		const nextContents = existingContents.filter((item) => item.id !== contentId);
		const isFirstDeleted = existingContents[0]?.id === contentId;
		const nextPrimary = nextContents[0];

		const updatePayload: UpdateLessonPayload =
			isFirstDeleted && nextPrimary
				? {
						title: lesson.title || nextPrimary.title,
						type: nextPrimary.type,
						description: nextPrimary.description,
						mediaSource: nextPrimary.mediaSource,
						mediaKey: nextPrimary.mediaKey,
						mediaUrl: nextPrimary.mediaUrl,
						content: nextPrimary.content,
						durationSeconds: nextPrimary.durationSeconds,
						contents: nextContents,
					}
				: {
						contents: nextContents,
					};

		const updated = await updateLesson(lesson.id, updatePayload).catch((err) => {
			console.error("handleDeleteContent error:", err);
			toast.error("تعذّر حذف المحتوى");
			return null;
		});

		if (updated) {
			clearLessonDraft(getLessonDraftKey({ lessonId: lesson.id, contentId }));
			if (editor?.mode === "edit" && editor.lesson.id === lesson.id) {
				if (editor.selectedContentId === contentId) {
					setEditor({
						...editor,
						lesson: updated,
						selectedContentId: undefined,
					});
				} else {
					setEditor({
						...editor,
						lesson: updated,
					});
				}
			}
			refreshDraftBadges();
			toast.success("تم حذف المحتوى بنجاح");
		}
	};

	// إضافة محتوى جديد لدرس موجود
	const handleAddContentToLesson = async (
		lesson: LessonResponse,
		unitTitle: string,
		unitId: string,
		type: LessonType = "PAGE",
	) => {
		const existingContents = lesson.contents ?? [];
		const fallbackPrimary: LessonContentItem = {
			id: `content-${Date.now()}-primary`,
			type: lesson.type,
			title: lesson.title || "المحتوى الأساسي",
			description: lesson.description ?? null,
			mediaSource: lesson.mediaSource ?? null,
			mediaKey: lesson.mediaKey ?? null,
			mediaUrl: lesson.mediaUrl ?? null,
			durationSeconds: lesson.durationSeconds ?? null,
			content: lesson.content ?? null,
		};

		const primary = existingContents[0] ?? fallbackPrimary;
		const existingExtras = existingContents.length > 0 ? existingContents.slice(1) : [];

		const typeLabel = LESSON_TYPE_AR_LABELS[type] || "محتوى";
		const newContentItem: LessonContentItem = {
			id: `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
			type,
			title: `محتوى جديد (${typeLabel})`,
			mediaSource: "DEVICE",
			content: type === "PAGE" ? "" : null,
		};

		const nextContents: LessonContentItem[] = [primary, ...existingExtras, newContentItem];

		const updated = await updateLesson(lesson.id, {
			contents: nextContents,
		}).catch((err) => {
			console.error("handleAddContentToLesson error:", err);
			toast.error("تعذّر إضافة المحتوى للدرس");
			return null;
		});

		if (updated) {
			toast.success(`تمت إضافة محتوى (${typeLabel}) للدرس بنجاح`);
			handleOpenEditLesson(updated, unitTitle, unitId, newContentItem.id);
		}
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
			await qc.invalidateQueries({
				queryKey: ["training", "course", currentCourseId],
			});
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

		const effectiveLessonTitle =
			values.lessonTitle?.trim() || values.title?.trim() || "درس جديد";
		const effectiveContentTitle =
			values.title?.trim() || values.lessonTitle?.trim() || "المحتوى الأساسي";

		const isMedia =
			values.type === "VIDEO" || values.type === "AUDIO" || values.type === "DOCUMENT";
		const initialContents = buildLessonContents({
			...values,
			title: effectiveContentTitle,
			lessonTitle: effectiveLessonTitle,
		});

		const saved = await addLesson({
			unitId: targetUnitId,
			title: effectiveLessonTitle,
			type: values.type,
			description: values.description || null,
			mediaSource: isMedia ? (values.mediaSource ?? null) : null,
			mediaKey: isMedia ? values.mediaKey || null : null,
			mediaUrl: isMedia ? values.mediaUrl || null : null,
			content:
				values.type === "QUIZ" || values.type === "SURVEY"
					? JSON.stringify({ questions: values.questions ?? [] })
					: values.content || null,
			contents: initialContents,
			durationSeconds: toDurationSeconds(values),
		}).catch((err) => {
			console.error("handleSaveNewLesson error:", err);
			const msg = err instanceof Error ? err.message : "تعذّر حفظ الدرس الجديد";
			toast.error(msg);
			return null;
		});

		if (saved) {
			toast.success(`تمت إضافة درس "${effectiveLessonTitle}" بنجاح`);
			clearLessonDraft(
				getLessonDraftKey({ courseId: effectiveCourseId, unitId: editor.unitId }),
			);
			clearLessonDraft(getLessonDraftKey({ courseId: currentCourseId, unitId: targetUnitId }));
			setLiveDraft(null);
			setHasFormUnsavedChanges(false);
			const lessonToSet: LessonResponse = {
				...saved,
				contents:
					Array.isArray(saved.contents) && saved.contents.length > 0
						? saved.contents
						: initialContents,
			};
			writeOpenEditorSession(currentCourseId, {
				mode: "edit",
				lessonId: saved.id,
				unitId: targetUnitId,
				unitTitle: targetUnitTitle,
			});
			setEditor({
				mode: "edit",
				lesson: lessonToSet,
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
		const selectedIdx =
			editor.selectedContentId && editor.lesson.contents
				? editor.lesson.contents.findIndex((item) => item.id === editor.selectedContentId)
				: -1;
		const isSecondaryContent = selectedIdx > 0;
		const effectiveLessonTitle =
			values.lessonTitle?.trim() || values.title?.trim() || editor.lesson.title || "درس جديد";
		const effectiveContentTitle =
			values.title?.trim() || values.lessonTitle?.trim() || "المحتوى الأساسي";
		const nextContents = buildLessonContents(
			{ ...values, title: effectiveContentTitle, lessonTitle: effectiveLessonTitle },
			editor.lesson.contents,
			editor.selectedContentId,
		);
		const isMedia =
			values.type === "VIDEO" || values.type === "AUDIO" || values.type === "DOCUMENT";
		const saved = await updateLesson(
			editor.lesson.id,
			isSecondaryContent
				? {
						title: effectiveLessonTitle,
						contents: nextContents,
					}
				: {
						title: effectiveLessonTitle,
						type: values.type,
						description: values.description || null,
						mediaSource: isMedia ? (values.mediaSource ?? null) : null,
						mediaKey: isMedia ? values.mediaKey || null : null,
						mediaUrl: isMedia ? values.mediaUrl || null : null,
						content:
							values.type === "QUIZ" || values.type === "SURVEY"
								? JSON.stringify({ questions: values.questions ?? [] })
								: values.content || null,
						contents: nextContents,
						durationSeconds: toDurationSeconds(values),
					},
		).catch((err) => {
			console.error("handleUpdateLesson error:", err);
			const msg = err instanceof Error ? err.message : "تعذّر حفظ تعديلات الدرس";
			toast.error(msg);
			return null;
		});
		if (saved) {
			toast.success("تم حفظ تعديلات الدرس بنجاح");
			clearLessonDraft(
				getLessonDraftKey({
					lessonId: editor.lesson.id,
					contentId: isSecondaryContent ? editor.selectedContentId : undefined,
				}),
			);
			setLiveDraft(null);
			setHasFormUnsavedChanges(false);
			const lessonToSet: LessonResponse = {
				...saved,
				contents:
					Array.isArray(saved.contents) && saved.contents.length > 0
						? saved.contents
						: nextContents,
			};
			setEditor({
				mode: "edit",
				lesson: lessonToSet,
				unitTitle: editor.unitTitle,
				unitId: editor.unitId,
				selectedContentId: editor.selectedContentId,
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
			type === "QUIZ" || type === "SURVEY"
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
						editor.mode === "edit" ? editor.selectedContentId : undefined,
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
				className="flex min-h-0 shrink-0 flex-col gap-2.5 self-stretch overflow-hidden px-3 pt-3"
			>
				{/* بطاقة المدربين/الموظفين المعينين للدورة — أعلى يمين الخطوة الثانية */}
				<div className="flex items-center justify-between gap-2 rounded-[6px] border border-[#E5E5E5] dark:border-border bg-white dark:bg-card px-2.5 py-1.5 shadow-2xs shrink-0">
					<div className="flex items-center gap-1.5 min-w-0">
						<span className="text-[11px] font-semibold text-[#08090A] dark:text-foreground">
							المدربون:
						</span>
						<span className="text-[10px] text-muted-foreground truncate">
							{effectiveTrainers.length > 0
								? `${effectiveTrainers.length} ${effectiveTrainers.length === 1 ? "معيّن" : "معيّنون"}`
								: "لم يتم التعيين"}
						</span>
					</div>
					<div className="flex shrink-0 items-center">
						<TrainersCell
							trainers={effectiveTrainers}
							maxVisible={4}
							emptyText="بدون مدرب"
						/>
					</div>
				</div>

				{/* ترويسة الهيكل والأزرار */}
				<div className="flex items-center justify-between gap-1.5">
					<div className="flex min-w-0 flex-col">
						<h2 className="truncate text-[12px] font-bold leading-tight text-[#08090A]">
							هيكل الصفحات
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
							إضافة قسم
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
						<>
							{/* شريط تنبيه تفعيل الفواصل الزمنية بين الوحدات تلقائياً عند إضافة أكثر من وحدة */}
							{units.length > 1 && (
								<div className="flex items-center justify-center rounded-[4px] border border-amber-200/90 bg-amber-50/90 py-1.5 px-3 text-center text-[11px] font-medium text-amber-800 shrink-0">
									تُفعَّل الفواصل الزمنية بين الوحدات تلقائيًا عند إضافة أكثر من وحدة.
								</div>
							)}

							{/* شريط عدد الوحدات وزر تفعيل/تعطيل الفواصل الزمنية بين الوحدات */}
							{units.length > 1 && (
								<div className="flex items-center justify-between px-0.5 text-xs shrink-0">
									<span className="text-[11px] font-medium text-[#08090A] dark:text-foreground">
										{units.length}{" "}
										{units.length === 2 ? "وحدتان" : units.length <= 10 ? "وحدات" : "وحدة"}
									</span>
									<div className="flex items-center gap-2">
										<span className="text-[11px] font-medium text-muted-foreground select-none">
											فواصل الوحدات
										</span>
										<Switch
											checked={unitIntervalsEnabled}
											onCheckedChange={setUnitIntervalsEnabled}
											size="sm"
											aria-label="تفعيل الفواصل الزمنية بين الوحدات"
										/>
									</div>
								</div>
							)}

							{units.map((unit, unitIndex) => (
								<Fragment key={unit.id}>
									<UnitAccordion
										unit={unit}
										courseName={course?.name ?? ""}
										drag={dragHandlers}
										isSelected={activeUnitId === unit.id}
										onSelect={() => setSelectedUnitId(unit.id)}
										onDuplicate={() => handleDuplicateUnit(unit)}
										onRenameUnit={renameUnit}
										onRemoveLesson={removeLesson}
										onDeleteUnit={handleDeleteUnit}
										onDeleteContent={(lesson, content) =>
											setDeletingContent({ lesson, content })
										}
										onAddLesson={handleOpenAddLesson}
										onAddLessonContent={handleAddContentToLesson}
										onEditLesson={handleOpenEditLesson}
										onSelectLessonContent={(lesson, unitTitle, unitId, contentId) =>
											handleOpenEditLesson(lesson, unitTitle, unitId, contentId)
										}
										pendingAddDraft={pendingAddDrafts[unit.id] ?? null}
										onResumeDraft={(unitId, unitTitle, draftType) => {
											handleOpenAddLesson(unitId, unitTitle, draftType);
										}}
										onDiscardDraft={(unitId) => {
											clearLessonDraft(
												getLessonDraftKey({
													courseId: effectiveCourseId,
													unitId,
												}),
											);
											refreshDraftBadges();
										}}
										activeEditorLessonId={activeEditorLessonId}
										activeEditorContentId={
											editor?.mode === "edit" ? editor.selectedContentId : undefined
										}
										onOpenSupplies={handleOpenSupplies}
										getLessonSuppliesCount={(lessonId) =>
											effectiveLessonSupplies[lessonId]?.length ?? 0
										}
										getLessonInterval={(lessonId) => lessonIntervals[lessonId]}
										onUpdateLessonInterval={handleUpdateLessonInterval}
										onDuplicateLesson={(lesson) =>
											addLesson(lessonToPayload(lesson, unit.id)).catch(() => null)
										}
									/>
									{copyingUnitId === unit.id && <UnitCopyingSkeleton unit={unit} />}
									{unitIntervalsEnabled && unitIndex < units.length - 1 && (
										<IntervalDivider
											value={unitIntervals[unit.id]?.value ?? 0}
											unit={unitIntervals[unit.id]?.unit ?? "DAY"}
											label="الفاصل بين الوحدات"
											title="الفاصل الزمني بين هذه الوحدة والوحدة التالية"
											onValueChange={(val) =>
												handleUpdateUnitInterval(
													unit.id,
													val,
													unitIntervals[unit.id]?.unit ?? "DAY",
												)
											}
											onUnitChange={(u) =>
												handleUpdateUnitInterval(
													unit.id,
													unitIntervals[unit.id]?.value ?? 0,
													u,
												)
											}
											className="my-2 px-1"
										/>
									)}
								</Fragment>
							))}
						</>
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
									key={`edit-${editor.lesson.id}-${editor.selectedContentId ?? "primary"}`}
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
									onDeleteContent={
										editor.selectedContentId && editor.lesson.contents
											? () => {
													const currentItem = editor.lesson.contents?.find(
														(c) => c.id === editor.selectedContentId,
													);
													if (currentItem) {
														setDeletingContent({
															lesson: editor.lesson,
															content: currentItem,
														});
													}
												}
											: undefined
									}
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

			{deletingContent && (
				<Dialog
					open
					onOpenChange={(open) => {
						if (!open) setDeletingContent(null);
					}}
				>
					<DialogContent
						className="sm:max-w-md p-5"
						dir="rtl"
					>
						<div className="flex items-start gap-3">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
								<IconTrash className="size-5" />
							</div>
							<div className="flex flex-col gap-1 flex-1 min-w-0">
								<DialogTitle className="text-sm font-bold text-[#08090A]">
									حذف محتوى الدرس
								</DialogTitle>
								<DialogDescription className="text-xs text-muted-foreground leading-relaxed">
									{deletingContent.lesson.contents &&
									deletingContent.lesson.contents.length <= 1
										? `هذا هو المحتوى الوحيد في الدرس "${deletingContent.lesson.title}". حذفه سيؤدي لحذف الدرس كاملاً. هل تريد المتابعة؟`
										: `هل أنت متأكد من حذف محتوى "${deletingContent.content.title || "المحتوى"}" من درس "${deletingContent.lesson.title}"؟`}
								</DialogDescription>
							</div>
						</div>
						<div className="flex justify-end items-center gap-2 mt-4 pt-3 border-t border-[#E5E5E5]">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setDeletingContent(null)}
								className="h-8 rounded-[4px] px-3 text-xs font-medium cursor-pointer"
							>
								إلغاء
							</Button>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								onClick={async () => {
									const { lesson, content } = deletingContent;
									setDeletingContent(null);
									await handleDeleteContent(lesson, content.id);
								}}
								className="h-8 rounded-[4px] px-3.5 text-xs font-semibold bg-[#DC2626] hover:bg-[#DC2626]/90 text-white cursor-pointer"
							>
								حذف المحتوى
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			)}
			{/* سايدشيت المستلزمات — ينزلق بسلاسة في الجنب الأيسر لباني المحتوى داخل نافذة الدورة دون أن تختفي الدورة أبداً */}
			{effectiveActiveSuppliesLesson && (
				<aside
					aria-label="إعداد مواد الخدمة والمخزون للدرس"
					className="absolute inset-y-0 left-0 z-40 w-[520px] max-w-[calc(100%-340px)] border-r border-[#E5E5E5] dark:border-border bg-white dark:bg-card shadow-2xl flex flex-col overflow-hidden animate-in fade-in-0 slide-in-from-left duration-200"
					dir="rtl"
				>
					<LessonSuppliesPanel
						lessonTitle={effectiveActiveSuppliesLesson.title || "الدرس"}
						initialItems={effectiveLessonSupplies[effectiveActiveSuppliesLesson.id] ?? []}
						onClose={handleCloseSupplies}
						onSave={(items) => {
							handleSaveLessonSupplies(effectiveActiveSuppliesLesson.id, items);
							handleCloseSupplies();
						}}
					/>
				</aside>
			)}
		</div>
	);
}
