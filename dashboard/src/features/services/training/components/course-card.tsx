import {
	IconDots,
	IconLayersSubtract,
	IconPencil,
	IconSchool,
	IconTrash,
	IconWorld,
} from "@tabler/icons-react";
import { AvatarCirclesStack } from "@/components/common/avatar-circles-stack";
import { StaffHoverCard, type StaffHoverData } from "@/components/common/hover-cards";
import { CompletionRing } from "@/components/ui/completion-ring";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	courseLocationLabel,
	formatTrainingCost,
} from "@/features/services/training/data/training";
import {
	extractCourseAcademicStage,
	resolveCourseAppearance,
} from "@/features/services/training/utils/course-meta";
import { resolveCover } from "@/features/services/training/utils/cover";
import { cn } from "@/lib/utils";
import type { CourseListItemResponse } from "@sanad/contracts/runtime/server/training/training.type";

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

type AssigneeWithExtra = {
	id: string;
	name: string;
	avatar?: string | null;
	phone?: string | null;
	email?: string | null;
	role?: string | null;
	branch?: string | null;
	employmentType?: string | null;
	active?: boolean;
};

// مكدّس صور المدربين + عدّاد الزائد مع بطاقة التحويم
export function AssigneeStack({ course }: { course: CourseListItemResponse }) {
	const trainers = (
		course.trainers && course.trainers.length > 0 ? course.trainers : course.assignees || []
	) as AssigneeWithExtra[];
	const totalCount = course.assignedCount || trainers.length;

	if (!trainers.length && !totalCount) {
		return <span className="text-[11px] text-muted-foreground select-none">—</span>;
	}

	const items = trainers.map((s) => {
		const staffData: StaffHoverData = {
			id: s.id,
			name: s.name,
			image: s.avatar || null,
			phone: s.phone || null,
			email: s.email || null,
			role: s.role || "TEACHER",
			branch: s.branch || null,
			employmentType: s.employmentType || null,
			active: s.active !== false,
		};

		return {
			id: s.id,
			name: s.name,
			title: s.name,
			image: s.avatar || null,
			data: staffData,
		};
		
	});

	return (
		<AvatarCirclesStack
			items={items}
			totalCount={totalCount}
			variant="mauve"
			maxVisible={3}
			renderItem={(item, element) => {
				const staff = (item.data as StaffHoverData) || {
					id: String(item.id),
					name: item.name,
				};
				return <StaffHoverCard staff={staff}>{element}</StaffHoverCard>;
			}}
		/>
	);
}

function CardTags({ course }: { course: CourseListItemResponse }) {
	const stage = extractCourseAcademicStage(course);
	const category = course.category?.trim() || course.department?.trim();
	const location = courseLocationLabel(course.locationMode);
	return (
		<div className="flex flex-wrap items-center gap-1">
			{stage && (
				<Chip className="bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
					<IconSchool className="size-2.5" />
					{stage}
				</Chip>
			)}
			{category && <Chip>{category}</Chip>}
			{location && (
				<Chip>
					<IconWorld className="size-2.5" />
					{location}
				</Chip>
			)}
			{course.trainingCost != null && (
				<Chip>{formatTrainingCost(course.trainingCost, course)}</Chip>
			)}
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
	const { Icon: CourseIcon, colorClass } = resolveCourseAppearance(course.description);
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
					<div
						className={cn(
							"flex size-12 items-center justify-center rounded-xl border",
							colorClass,
						)}
					>
						<CourseIcon className="size-6" />
					</div>
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
