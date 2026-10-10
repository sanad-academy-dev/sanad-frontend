import {
	IconBook,
	IconChevronDown,
	IconDots,
	IconFile,
	IconFileCheck,
	IconGripVertical,
	IconPencil,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
	CourseContentType,
	LessonFormValues,
	LessonResponse,
	UnitResponse,
} from "@/server/training/training.type";
import { DeleteConfirmDialog } from "../../components/delete-confirm-dialog";
import { LessonForm } from "../../components/lesson-form";
import { LESSON_TYPE_ICONS } from "../../data/training";
import { useCourseContent } from "../../hooks/use-course-content";

const CONTENT_TYPE = {
	PAGE: { label: "صفحة", Icon: IconFile },
	LESSON: { label: "درس", Icon: IconBook },
	QUIZ: { label: "اختبار", Icon: IconFileCheck },
} as const satisfies Record<CourseContentType, { label: string; Icon: typeof IconFile }>;

function toDurationSeconds(v: LessonFormValues) {
	const total = (v.hours ?? 0) * 3600 + (v.minutes ?? 0) * 60 + (v.seconds ?? 0);
	return total > 0 ? total : null;
}

function lessonPayload(unitId: string, v: LessonFormValues) {
	return {
		unitId,
		title: v.title,
		type: v.type,
		description: v.description || null,
		mediaSource: v.mediaSource ?? null,
		mediaKey: v.mediaKey || null,
		mediaUrl: v.mediaUrl || null,
		content:
			v.type === "QUIZ" ? JSON.stringify({ questions: v.questions ?? [] }) : v.content || null,
		durationSeconds: toDurationSeconds(v),
	};
}

// بطاقة محتوى (Trenning): أيقونة النوع، عنوان، شارة النوع، عدد الفصول + آخر تحديث،
// شارة الحالة، زر تعديل + ⋯ — تُوسّع لتُظهر محرّر الدروس/الاختبار المعاد استخدامه (LessonForm).
export function ContentCard({
	unit,
	courseId,
	courseName,
	autoOpen,
	dragRef,
	dragHandleProps,
	style,
	isDragging,
}: {
	unit: UnitResponse;
	courseId: string;
	courseName: string;
	// بطاقة مُنشأة حديثًا: تُفتح موسّعة، وإن كانت بلا فصول يُفتح نموذج «إضافة فصل» مباشرة
	autoOpen?: boolean;
	// خصائص السحب (dnd-kit) — تُمرَّر من الغلاف القابل للفرز؛ المقبض على أيقونة القبضة فقط
	dragRef?: Ref<HTMLDivElement>;
	dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
	style?: CSSProperties;
	isDragging?: boolean;
}) {
	const [expanded, setExpanded] = useState(autoOpen ?? false);
	const [editingName, setEditingName] = useState(false);
	const [title, setTitle] = useState(unit.title);
	// للبطاقة المُنشأة حديثًا بلا فصول (درس): افتح نموذج الفصل فورًا لاختيار نوع المادة
	const [addingLesson, setAddingLesson] = useState(
		(autoOpen ?? false) && unit.lessons.length === 0,
	);
	const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [deletingLesson, setDeletingLesson] = useState<LessonResponse | null>(null);
	const {
		renameUnit,
		removeUnit,
		updateUnitMeta,
		addLesson,
		updateLesson,
		removeLesson,
		isSavingLesson,
	} = useCourseContent(courseId);

	const type = CONTENT_TYPE[unit.contentType];
	const TypeIcon = type.Icon;
	const published = unit.status === "PUBLISHED";
	const updated = new Date(unit.updatedAt).toLocaleDateString("ar", {
		day: "numeric",
		month: "short",
	});

	const commitRename = () => {
		setEditingName(false);
		if (title.trim() && title !== unit.title) renameUnit(unit.id, title.trim());
		else setTitle(unit.title);
	};

	const saveLesson = async (v: LessonFormValues) => {
		const ok = await addLesson(lessonPayload(unit.id, v)).catch(() => null);
		if (ok) setAddingLesson(false);
	};
	const editLesson = async (id: string, v: LessonFormValues) => {
		const { unitId, ...rest } = lessonPayload(unit.id, v);
		const ok = await updateLesson(id, rest).catch(() => null);
		if (ok) setEditingLessonId(null);
	};

	return (
		<div
			ref={dragRef}
			style={style}
			className={cn(
				"group/card flex w-full flex-col overflow-hidden rounded-xl border border-[#E7E7EE] bg-white shadow-[0_1px_2px_rgba(16,16,24,0.04)]",
				isDragging && "opacity-40",
			)}
		>
			{/* رأس البطاقة — في RTL أول عنصر يمين */}
			<div className="flex items-center gap-3 px-3 py-2.5">
				<button
					type="button"
					aria-label="سحب لإعادة الترتيب"
					{...dragHandleProps}
					className="shrink-0 cursor-grab touch-none text-[#C4C4CC] active:cursor-grabbing"
				>
					<IconGripVertical className="size-4" />
				</button>
				<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<TypeIcon className="size-[18px]" />
				</span>

				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<div className="flex items-center gap-2">
						{editingName ? (
							<Input
								autoFocus
								value={title}
								maxLength={60}
								onChange={(e) => setTitle(e.target.value)}
								onBlur={commitRename}
								onKeyDown={(e) => {
									if (e.key === "Enter") commitRename();
									if (e.key === "Escape") {
										setTitle(unit.title);
										setEditingName(false);
									}
								}}
								className="h-7 w-[240px] text-[13px]"
							/>
						) : (
							<>
								<span className="truncate text-[13px] font-semibold text-[#08090A]">
									{unit.title}
								</span>
								<span className="rounded-md bg-[#F0F0F5] px-1.5 py-0.5 text-[10px] font-medium text-[#6B6B67]">
									{type.label}
								</span>
							</>
						)}
					</div>
					<span className="text-[11px] text-[#9B9B9D]">
						{unit.lessons.length} فصول • آخر تحديث {updated}
					</span>
				</div>

				{/* شارة الحالة — قابلة للنقر للتبديل */}
				<button
					type="button"
					onClick={() =>
						updateUnitMeta({ id: unit.id, status: published ? "DRAFT" : "PUBLISHED" })
					}
					className={cn(
						"flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
						published ? "bg-[#E7F8EE] text-[#008A2E]" : "bg-[#F0F0F5] text-[#6B6B67]",
					)}
				>
					<span
						className={cn(
							"size-1.5 rounded-full",
							published ? "bg-[#008A2E]" : "bg-[#9B9B9D]",
						)}
					/>
					{published ? "منشور" : "مسودة"}
				</button>

				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => setExpanded((v) => !v)}
					className="h-8 gap-1.5 rounded-lg text-[12px]"
				>
					<IconPencil className="size-3.5" />
					تعديل
					<IconChevronDown
						className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
					/>
				</Button>

				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger
						aria-label="خيارات البطاقة"
						className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E7E7EE] text-[#6B6B67]"
					>
						<IconDots className="size-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-[170px]"
					>
						<DropdownMenuItem onSelect={() => setEditingName(true)}>
							<IconPencil className="size-4" />
							إعادة تسمية
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							onSelect={() => setConfirmingDelete(true)}
						>
							<IconTrash className="size-4" />
							حذف
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<DeleteConfirmDialog
				title="حذف بطاقة المحتوى"
				context={courseName}
				name={unit.title}
				nameLabel="اسم المحتوى"
				question={`هل أنت متأكد من حذف "${unit.title}"؟ لا يمكن التراجع عن هذه الخطوة.`}
				consequences={["سيتم حذف جميع الفصول (الدروس/الاختبارات) المرتبطة بها نهائيًا."]}
				confirmLabel="حذف"
				open={confirmingDelete}
				onOpenChange={setConfirmingDelete}
				onConfirm={() => removeUnit(unit)}
			/>

			{deletingLesson && (
				<DeleteConfirmDialog
					title="حذف الفصل"
					context={unit.title}
					name={deletingLesson.title}
					nameLabel="اسم الفصل"
					question={`هل أنت متأكد من حذف "${deletingLesson.title}"؟`}
					consequences={["سيتم حذف محتوى الفصل نهائيًا."]}
					confirmLabel="حذف"
					open
					onOpenChange={(next) => !next && setDeletingLesson(null)}
					onConfirm={() => removeLesson(deletingLesson)}
				/>
			)}

			{/* جسم البطاقة — محرّر الفصول (يعيد استخدام LessonForm) */}
			{expanded && (
				<div className="flex flex-col gap-2.5 border-t border-[#F0F0F5] bg-[#FAFAFC] px-3 py-3">
					{unit.lessons.map((lesson) => {
						const LessonIcon = LESSON_TYPE_ICONS[lesson.type];
						return (
							<div
								key={lesson.id}
								className="flex flex-col gap-2"
							>
								<div className="flex h-10 items-center gap-2.5 rounded-lg border border-[#E7E7EE] bg-white px-3">
									<IconGripVertical className="size-3.5 shrink-0 cursor-grab text-[#C4C4CC]" />
									<LessonIcon className="size-4 shrink-0 text-[#6B6B67]" />
									<span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[#08090A]">
										{lesson.title}
									</span>
									<button
										type="button"
										onClick={() =>
											setEditingLessonId((id) => (id === lesson.id ? null : lesson.id))
										}
										className="text-[11px] font-medium text-primary"
									>
										تعديل
									</button>
									<button
										type="button"
										onClick={() => setDeletingLesson(lesson)}
										aria-label="حذف الفصل"
										className="text-[#DC2626]"
									>
										<IconTrash className="size-4" />
									</button>
								</div>
								{editingLessonId === lesson.id && (
									<LessonForm
										lesson={lesson}
										unitTitle={unit.title}
										isSaving={isSavingLesson}
										onCancel={() => setEditingLessonId(null)}
										onSave={(v) => editLesson(lesson.id, v)}
									/>
								)}
							</div>
						);
					})}

					{addingLesson ? (
						<LessonForm
							unitTitle={unit.title}
							isSaving={isSavingLesson}
							onCancel={() => setAddingLesson(false)}
							onSave={saveLesson}
						/>
					) : (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setAddingLesson(true)}
							className="h-8 w-fit gap-1.5 rounded-lg text-[12px]"
						>
							<IconPlus className="size-4" />
							إضافة فصل
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
