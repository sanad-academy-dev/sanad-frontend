import {
	IconCopy,
	IconDots,
	IconEye,
	IconFileCheck,
	IconFileDescription,
	IconFileText,
	IconPencil,
	IconSchool,
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
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TrainingPage } from "../hooks/use-training-pages";
import { cleanPageSummary, extractSystemTag } from "./page-dialog";
import { PageStatusSelect, type TrainingPageStatus } from "./page-status-select";

const fmtDate = (d: string) =>
	new Date(d).toLocaleDateString("ar-EG", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

function centeredHeader(label: string) {
	return () => <span className="block w-full text-center font-bold text-xs">{label}</span>;
}

export function PagesTable({
	pages,
	isLoading,
	onEdit,
	onPreview,
	onDuplicate,
	onPublishToggle,
	onDelete,
	onStatusChange,
}: {
	pages: TrainingPage[];
	isLoading: boolean;
	onEdit: (page: TrainingPage) => void;
	onPreview: (page: TrainingPage) => void;
	onDuplicate: (page: TrainingPage) => void;
	onPublishToggle: (page: TrainingPage) => void;
	onDelete: (page: TrainingPage) => void;
	onStatusChange?: (page: TrainingPage, newStatus: TrainingPageStatus) => void;
}) {
	const columns = useMemo<ColumnDef<TrainingPage>[]>(
		() => [
			{
				accessorKey: "title",
				header: "عنوان الصفحة والملخص",
				cell: ({ row }) => {
					const page = row.original;
					return (
						<button
							type="button"
							className="flex items-center gap-3 py-1 cursor-pointer group text-right w-full bg-transparent border-0 p-0"
							onClick={() => onPreview(page)}
						>
							<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
								<IconFileText className="size-4" />
							</span>
							<div className="flex flex-col min-w-0">
								<span className="truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors">
									{page.title || "صفحة بدون عنوان"}
								</span>
								<span className="truncate text-[11px] text-muted-foreground">
									{cleanPageSummary(page.summary) || "لا يوجد ملخص مضاف"}
								</span>
							</div>
						</button>
					);
				},
			},
			{
				id: "academicStage",
				header: centeredHeader("المرحلة الدراسية"),
				cell: ({ row }) => {
					const page = row.original;
					const stage =
						(page as { academicStage?: string }).academicStage ||
						extractSystemTag(page.summary, "stage") ||
						extractSystemTag(page.summary, "المرحلة");
					if (!stage || stage === "بدون مرحلة دراسية" || stage === "بدون مرحلة") {
						return (
							<div className="flex justify-center">
								<span className="inline-flex items-center rounded border border-dashed border-border/80 bg-transparent px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
									بدون مرحلة
								</span>
							</div>
						);
					}
					return (
						<div className="flex justify-center">
							<span className="inline-flex items-center gap-1 rounded border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300">
								<IconSchool className="size-3 shrink-0" />
								<span className="truncate">{stage}</span>
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: "category",
				header: centeredHeader("التصنيف"),
				cell: ({ row }) => (
					<div className="flex justify-center">
						<span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
							{row.original.category || "عام وتوجيهي"}
						</span>
					</div>
				),
			},
			{
				accessorKey: "status",
				header: centeredHeader("الحالة"),
				cell: ({ row }) => (
					<div className="flex justify-center">
						<PageStatusSelect
							status={(row.original.status as TrainingPageStatus) || "DRAFT"}
							onChange={(newStatus) => onStatusChange?.(row.original, newStatus)}
						/>
					</div>
				),
			},
			{
				accessorKey: "viewsCount",
				header: centeredHeader("المشاهدات"),
				cell: ({ row }) => (
					<div className="flex items-center justify-center gap-1 text-xs text-muted-foreground font-medium">
						<IconEye className="size-3.5" />
						<span>{row.original.viewsCount || 0}</span>
					</div>
				),
			},
			{
				accessorKey: "updatedAt",
				header: centeredHeader("آخر تحديث"),
				cell: ({ row }) => (
					<div className="flex justify-center text-xs text-muted-foreground">
						{fmtDate(row.original.updatedAt)}
					</div>
				),
			},
			{
				id: "actions",
				header: centeredHeader("الإجراءات"),
				cell: ({ row }) => {
					const page = row.original;
					const published = page.status === "PUBLISHED";
					return (
						<div className="flex items-center justify-center gap-1.5">
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label="المزيد من الإجراءات"
										className="h-7 w-7 text-muted-foreground hover:text-foreground"
									>
										<IconDots className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-[160px]"
								>
									<DropdownMenuItem onClick={() => onEdit(page)}>
										<IconPencil className="size-4" />
										تحرير المحتوى
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => onPreview(page)}>
										<IconEye className="size-4" />
										معاينة لايف
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => onDuplicate(page)}>
										<IconCopy className="size-4" />
										استنساخ كمسودة
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => onPublishToggle(page)}>
										{published ? (
											<>
												<IconFileDescription className="size-4 text-amber-600" />
												تحويل إلى مسودة
											</>
										) : (
											<>
												<IconFileCheck className="size-4 text-emerald-600" />
												نشر الصفحة
											</>
										)}
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										variant="destructive"
										onClick={() => onDelete(page)}
									>
										<IconTrash className="size-4" />
										حذف الصفحة
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		],
		[onEdit, onPreview, onDuplicate, onPublishToggle, onDelete, onStatusChange],
	);

	const table = useReactTable({
		data: pages,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 10 },
		},
	});

	return (
		<div className="w-full">
			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				tableClassName="w-full"
				keepHeaderOnEmpty
			/>
		</div>
	);
}
