import {
	IconChartBar,
	IconDots,
	IconListCheck,
	IconPencil,
	IconPlayerPlay,
	IconRosetteDiscountCheck,
	IconRotateClockwise,
	IconTrash,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContentAvatar } from "@/features/services/training/components/content-avatar";
import { cn } from "@/lib/utils";
import type { QuizListItemResponse, QuizStatus } from "@/server/quizzes/quizzes.type";

const fmtDate = (d: Date | string) =>
	new Date(d).toLocaleDateString("ar-SA-u-nu-latn", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

const Dash = () => <span className="text-muted-foreground">—</span>;

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
				"inline-flex w-fit items-center gap-1.5 rounded-md border bg-background px-2 py-0.5 text-xs font-medium",
				s.text,
			)}
		>
			<span className={cn("size-1.5 rounded-full", s.dot)} />
			{s.label}
		</span>
	);
}

// عنوان عمود مُتوسّط فوق قيمه
function centeredHeader(label: string) {
	return () => <span className="block w-full text-center">{label}</span>;
}
const centered = "flex justify-center";

// مجموع الأحجام < عرض الحاوية ليمتدّ بلا تمرير أفقي (title, role, questions, pass, attempts, assigned, status, created, actions)
const COLUMN_SIZES = [230, 130, 92, 96, 96, 104, 112, 104, 116];

export function QuizTable({
	quizzes,
	isLoading,
	onEdit,
	onPublish,
	onUnpublish,
	onDelete,
	onPlay,
	onResults,
	onRowOpen,
}: {
	quizzes: QuizListItemResponse[];
	isLoading: boolean;
	onEdit: (quiz: QuizListItemResponse) => void;
	onPublish: (quiz: QuizListItemResponse) => void;
	onUnpublish: (quiz: QuizListItemResponse) => void;
	onDelete: (quiz: QuizListItemResponse) => void;
	onPlay: (quiz: QuizListItemResponse) => void;
	onResults: (quiz: QuizListItemResponse) => void;
	onRowOpen?: (quiz: QuizListItemResponse) => void;
}) {
	const columns = useMemo<ColumnDef<QuizListItemResponse>[]>(
		() => [
			{
				accessorKey: "title",
				header: "عنوان الاختبار / المعرّف",
				// في RTL أول عنصر في ترتيب DOM = أقصى اليمين، فالأفاتار يمين العنوان/المعرّف
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<ContentAvatar
							Icon={IconListCheck}
							coverKey={row.original.coverKey}
						/>
						<div className="flex min-w-0 flex-col">
							<span className="line-clamp-1 text-[13px] font-semibold text-foreground">
								{row.original.title}
							</span>
							<span className="text-[11px] text-muted-foreground">{row.original.code}</span>
						</div>
					</div>
				),
			},
			{
				id: "targetRole",
				header: centeredHeader("القسم المستهدف"),
				cell: ({ row }) => (
					<div className={centered}>
						{row.original.targetRole ? (
							<span className="text-[12px] text-foreground">
								{row.original.targetRole.name}
							</span>
						) : (
							<Dash />
						)}
					</div>
				),
			},
			{
				id: "questions",
				header: centeredHeader("الأسئلة"),
				cell: ({ row }) => (
					<div className={cn(centered, "text-[12px] text-foreground")}>
						{row.original._count.questions}
					</div>
				),
			},
			{
				id: "passMark",
				header: centeredHeader("نسبة النجاح"),
				cell: ({ row }) => (
					<div className={cn(centered, "text-[12px] text-foreground")}>
						{row.original.passMark}%
					</div>
				),
			},
			{
				id: "attempts",
				header: centeredHeader("المحاولات"),
				cell: ({ row }) => (
					<div className={cn(centered, "text-[12px] text-foreground")}>
						{row.original.maxAttempts ?? "بلا حد"}
					</div>
				),
			},
			{
				id: "assigned",
				header: centeredHeader("المُعيَّنون"),
				cell: ({ row }) => (
					<div className={cn(centered, "text-[12px] text-foreground")}>
						{row.original._count.assignments}
					</div>
				),
			},
			{
				id: "status",
				header: centeredHeader("الحالة"),
				cell: ({ row }) => (
					<div className={centered}>
						<StatusPill status={row.original.status} />
					</div>
				),
			},
			{
				id: "createdAt",
				header: centeredHeader("تاريخ الإنشاء"),
				cell: ({ row }) => (
					<div className={cn(centered, "text-[12px] text-muted-foreground")}>
						{fmtDate(row.original.createdAt)}
					</div>
				),
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) => {
					const q = row.original;
					return (
						<div className="flex items-center justify-center">
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger
									aria-label="خيارات الاختبار"
									onClick={(e) => e.stopPropagation()}
									className="flex size-7 items-center justify-center rounded-[6px] border border-[#E5E5E5] text-[#161616] hover:bg-muted"
								>
									<IconDots className="size-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-[177px] gap-1 rounded-[6px] border border-[#E5E5E5] p-3 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]"
								>
									{q.status === "PUBLISHED" && (
										<DropdownMenuItem
											onSelect={() => onPlay(q)}
											className="h-[29px] rounded-[5px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#F2F2F2]"
										>
											<IconPlayerPlay className="size-4 text-[#08090A]" />
											بدء الاختبار
										</DropdownMenuItem>
									)}
									<DropdownMenuItem
										onSelect={() => onEdit(q)}
										className="h-[29px] rounded-[5px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#F2F2F2]"
									>
										<IconPencil className="size-4 text-[#08090A]" />
										تعديل
									</DropdownMenuItem>
									<DropdownMenuItem
										onSelect={() => onResults(q)}
										className="h-[29px] rounded-[5px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#F2F2F2]"
									>
										<IconChartBar className="size-4 text-[#08090A]" />
										النتائج
									</DropdownMenuItem>
									{q.status === "PUBLISHED" ? (
										<DropdownMenuItem
											onSelect={() => onUnpublish(q)}
											className="h-[29px] rounded-[5px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#F2F2F2]"
										>
											<IconRotateClockwise className="size-4 text-[#08090A]" />
											إلغاء النشر
										</DropdownMenuItem>
									) : (
										<DropdownMenuItem
											onSelect={() => onPublish(q)}
											className="h-[29px] rounded-[5px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#F2F2F2]"
										>
											<IconRosetteDiscountCheck className="size-4 text-[#08090A]" />
											نشر
										</DropdownMenuItem>
									)}
									<DropdownMenuItem
										variant="destructive"
										onSelect={() => onDelete(q)}
										className="h-[29px] rounded-[5px] px-2 text-[12px] font-bold focus:bg-[#F2F2F2]"
									>
										<IconTrash className="size-4" />
										حذف
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		],
		[onEdit, onPublish, onUnpublish, onDelete, onPlay, onResults],
	);

	const sizedColumns = useMemo(
		() => columns.map((c, i) => ({ ...c, size: COLUMN_SIZES[i] })),
		[columns],
	);

	const table = useReactTable({
		data: quizzes,
		columns: sizedColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<TableDataView
			table={table}
			columns={sizedColumns}
			isPending={isLoading}
			tableClassName="w-full"
			onRowClick={onRowOpen ? (row) => onRowOpen(row.original) : undefined}
		/>
	);
}
