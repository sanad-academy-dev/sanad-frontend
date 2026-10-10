import {
	IconBolt,
	IconDots,
	IconLayersSubtract,
	IconPencil,
	IconSchool,
	IconTrash,
	IconWorld,
} from "@tabler/icons-react";

import { CompletionRing } from "@/components/ui/completion-ring";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { resolveCover } from "@/features/services/training/utils/cover";
import { avatarColor, initialsOf } from "@/lib/avatar-color";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import type { CourseListItemResponse } from "@/server/training/training.type";

const PRIORITY_LABEL = { URGENT: "عاجل", NORMAL: "غير عاجل" } as const;
const LANGUAGE_LABEL = { AR: "العربية", EN: "الإنجليزية" } as const;

const fmtDate = (d: Date | string) =>
	new Date(d).toLocaleDateString("ar", { day: "numeric", month: "short", year: "numeric" });

function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground",
				className,
			)}
		>
			{children}
		</span>
	);
}

// مكدّس صور المتدربين + عدّاد الزائد
export function AssigneeStack({ course }: { course: CourseListItemResponse }) {
	const extra = course.assignedCount - course.assignees.length;
	return (
		<div className="flex items-center">
			<div className="flex -space-x-2 rtl:space-x-reverse">
				{course.assignees.map((s) => {
					const color = avatarColor(s.name);
					const url = getFileUrl(s.avatar);
					return (
						<span
							key={s.id}
							title={s.name}
							className="flex size-6 items-center justify-center overflow-hidden rounded-full border-2 border-background text-[9px] font-semibold"
							style={url ? undefined : { backgroundColor: color.bg, color: color.fg }}
						>
							{url ? (
								<img
									src={url}
									alt={s.name}
									className="size-full object-cover"
								/>
							) : (
								initialsOf(s.name)
							)}
						</span>
					);
				})}
			</div>
			{extra > 0 && (
				<span className="z-10 -ms-2 flex size-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[9px] font-semibold text-muted-foreground">
					+{extra}
				</span>
			)}
			{course.assignedCount === 0 && (
				<span className="text-[11px] text-muted-foreground">لا متدربون</span>
			)}
		</div>
	);
}

function CardTags({ course }: { course: CourseListItemResponse }) {
	return (
		<div className="flex flex-wrap items-center gap-1">
			{course.targetRole && <Chip>{course.targetRole.name}</Chip>}
			{course.category && <Chip>{course.category}</Chip>}
			<Chip>
				<IconBolt
					className={cn(
						"size-2.5",
						course.priority === "URGENT" ? "text-destructive" : "text-muted-foreground",
					)}
				/>
				{PRIORITY_LABEL[course.priority]}
			</Chip>
			<Chip>
				<IconWorld className="size-2.5" />
				{LANGUAGE_LABEL[course.language]}
			</Chip>
		</div>
	);
}

// قائمة إجراءات الدورة — التعديل عبر معالج الاستحواذ مُركَّن مؤقتًا، فتقتصر على الحذف
function RowMenu({ onDelete, onEdit }: { onDelete: () => void; onEdit?: () => void }) {
	return (
		<DropdownMenu dir="rtl">
			<DropdownMenuTrigger
				aria-label="خيارات الدورة"
				className="flex size-7 items-center justify-center rounded-md border text-muted-foreground"
			>
				<IconDots className="size-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="w-[150px]"
			>
				{onEdit && (
					<DropdownMenuItem onSelect={onEdit}>
						<IconPencil className="size-4" />
						تعديل
					</DropdownMenuItem>
				)}
				<DropdownMenuItem
					variant="destructive"
					onSelect={onDelete}
				>
					<IconTrash className="size-4" />
					حذف
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// بطاقة الشبكة
export function CourseCard({
	course,
	onDelete,
	onEdit,
}: {
	course: CourseListItemResponse;
	onDelete: (id: string) => void;
	onEdit?: (id: string) => void;
}) {
	const cover = resolveCover(course.coverKey);
	return (
		<div className="flex flex-col overflow-hidden rounded-lg border bg-card">
			{/* الغلاف */}
			<div
				className="flex h-28 items-center justify-center bg-muted"
				style={cover?.type === "color" ? { backgroundColor: cover.color } : undefined}
			>
				{cover?.type === "image" ? (
					<img
						src={cover.url}
						alt={course.name}
						className="size-full object-cover"
					/>
				) : cover?.type === "color" ? null : (
					<IconSchool className="size-8 text-muted-foreground" />
				)}
			</div>

			<div className="flex flex-1 flex-col gap-2.5 p-3.5">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<span className="line-clamp-1 text-[14px] font-bold text-foreground">
							{course.name}
						</span>
						<span className="text-[11px] text-muted-foreground">
							{course.code} • {fmtDate(course.createdAt)}
						</span>
					</div>
					<CompletionRing value={course.completionPct} />
				</div>

				<CardTags course={course} />

				<div className="mt-auto flex items-center justify-between gap-2 border-t pt-2.5">
					<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
						<IconLayersSubtract className="size-3.5" />
						المحتوى: {course.contentCount}
					</div>
					<div className="flex items-center gap-1.5">
						<AssigneeStack course={course} />
						<RowMenu
							onDelete={() => onDelete(course.id)}
							onEdit={onEdit ? () => onEdit(course.id) : undefined}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// صف القائمة
export function CourseListRow({
	course,
	onDelete,
}: {
	course: CourseListItemResponse;
	onDelete: (id: string) => void;
}) {
	const cover = resolveCover(course.coverKey);
	return (
		<div className="flex items-center gap-3 rounded-lg border bg-card p-3">
			<div
				className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted"
				style={cover?.type === "color" ? { backgroundColor: cover.color } : undefined}
			>
				{cover?.type === "image" ? (
					<img
						src={cover.url}
						alt={course.name}
						className="size-full object-cover"
					/>
				) : cover?.type === "color" ? null : (
					<IconSchool className="size-6 text-muted-foreground" />
				)}
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div>
					<span className="line-clamp-1 text-[13px] font-bold text-foreground">
						{course.name}
					</span>
					<span className="text-[11px] text-muted-foreground">
						{course.code} • {fmtDate(course.createdAt)}
					</span>
				</div>
				<CardTags course={course} />
			</div>

			<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
				<IconLayersSubtract className="size-3.5" />
				{course.contentCount}
			</div>
			<AssigneeStack course={course} />
			<CompletionRing
				value={course.completionPct}
				size={38}
			/>
			<RowMenu onDelete={() => onDelete(course.id)} />
		</div>
	);
}
