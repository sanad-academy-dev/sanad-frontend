import {
	IconChartBar,
	IconClock,
	IconDots,
	IconListCheck,
	IconPencil,
	IconPlayerPlay,
	IconRosetteDiscountCheck,
	IconRotateClockwise,
	IconStack2,
	IconTrash,
	IconUsers,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { resolveCover } from "@/features/services/training/utils/cover";
import { cn } from "@/lib/utils";
import type { QuizListItemResponse, QuizStatus } from "@/server/quizzes/quizzes.type";

const fmtDate = (d: Date | string) =>
	new Date(d).toLocaleDateString("ar", { day: "numeric", month: "short", year: "numeric" });

// نفس ألوان شارة الحالة في جدول الاختبارات
const STATUS: Record<QuizStatus, { label: string; text: string; dot: string }> = {
	PUBLISHED: { label: "منشور", text: "text-[#008A2E]", dot: "bg-[#008A2E]" },
	DRAFT: { label: "مسودة", text: "text-muted-foreground", dot: "bg-muted-foreground" },
	ARCHIVED: { label: "مؤرشف", text: "text-[#B45309]", dot: "bg-[#F59E0B]" },
};

function StatusPill({ status }: { status: QuizStatus }) {
	const s = STATUS[status] ?? STATUS.DRAFT;
	return (
		<span
			className={cn(
				"inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md border bg-background px-2 py-0.5 text-[10px] font-medium",
				s.text,
			)}
		>
			<span className={cn("size-1.5 rounded-full", s.dot)} />
			{s.label}
		</span>
	);
}

function Chip({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
			{children}
		</span>
	);
}

// بطاقة اختبار في عرض «قائمة» (الشبكة) — تقابل CourseCard للدورات
export function QuizCard({
	quiz,
	onOpen,
	onEdit,
	onPlay,
	onResults,
	onPublish,
	onUnpublish,
	onDelete,
}: {
	quiz: QuizListItemResponse;
	// الضغط على جسم البطاقة يفتح المعيَّنين ونتائجهم (كصفّ الجدول)
	onOpen: () => void;
	onEdit: () => void;
	onPlay: () => void;
	onResults: () => void;
	onPublish: () => void;
	onUnpublish: () => void;
	onDelete: () => void;
}) {
	const cover = resolveCover(quiz.coverKey);
	const published = quiz.status === "PUBLISHED";

	return (
		<div className="relative flex flex-col overflow-hidden rounded-lg border bg-card">
			{/* طبقة شفافة تغطّي البطاقة لفتح النتائج — والقائمة فوقها بـ z-20 */}
			<button
				type="button"
				onClick={onOpen}
				aria-label={`فتح نتائج ${quiz.title}`}
				className="absolute inset-0 z-10 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-primary"
			/>

			{/* الغلاف */}
			<div
				className="flex h-28 items-center justify-center bg-muted"
				style={cover?.type === "color" ? { backgroundColor: cover.color } : undefined}
			>
				{cover?.type === "image" ? (
					<img
						src={cover.url}
						alt={quiz.title}
						className="size-full object-cover"
					/>
				) : cover?.type === "color" ? null : (
					<IconListCheck className="size-8 text-muted-foreground" />
				)}
			</div>

			<div className="flex flex-1 flex-col gap-2.5 p-3.5">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<span className="line-clamp-1 text-[14px] font-bold text-foreground">
							{quiz.title}
						</span>
						<span className="text-[11px] text-muted-foreground">
							{quiz.code} • {fmtDate(quiz.createdAt)}
						</span>
					</div>
					<StatusPill status={quiz.status} />
				</div>

				<div className="flex flex-wrap items-center gap-1">
					{quiz.targetRole && <Chip>{quiz.targetRole.name}</Chip>}
					<Chip>
						<IconRosetteDiscountCheck className="size-2.5" />
						النجاح {quiz.passMark}%
					</Chip>
					<Chip>
						<IconClock className="size-2.5" />
						{quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} دقيقة` : "بلا حد"}
					</Chip>
					<Chip>
						<IconRotateClockwise className="size-2.5" />
						{quiz.maxAttempts ? `${quiz.maxAttempts} محاولات` : "محاولات بلا حد"}
					</Chip>
				</div>

				<div className="mt-auto flex items-center justify-between gap-2 border-t pt-2.5">
					<div className="flex items-center gap-3 text-[11px] text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<IconStack2 className="size-3.5" />
							الأسئلة: {quiz._count.questions}
						</span>
						<span className="flex items-center gap-1.5">
							<IconUsers className="size-3.5" />
							{quiz._count.assignments}
						</span>
					</div>

					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger
							aria-label="خيارات الاختبار"
							className="relative z-20 flex size-7 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted"
						>
							<IconDots className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-[160px]"
						>
							{published && (
								<DropdownMenuItem onSelect={onPlay}>
									<IconPlayerPlay className="size-4" />
									بدء الاختبار
								</DropdownMenuItem>
							)}
							<DropdownMenuItem onSelect={onEdit}>
								<IconPencil className="size-4" />
								تعديل
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={onResults}>
								<IconChartBar className="size-4" />
								النتائج
							</DropdownMenuItem>
							{published ? (
								<DropdownMenuItem onSelect={onUnpublish}>
									<IconRotateClockwise className="size-4" />
									إلغاء النشر
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem onSelect={onPublish}>
									<IconRosetteDiscountCheck className="size-4" />
									نشر
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
				</div>
			</div>
		</div>
	);
}
