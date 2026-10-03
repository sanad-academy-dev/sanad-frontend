import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import {
	type ColumnDef,
	flexRender,
	type Row,
	type Table as TableType,
} from "@tanstack/react-table";
import { Fragment, type ReactNode, useEffect, useRef } from "react";
import { NoResultsTableView } from "@/components/common/table-no-results";
import { TablePagination } from "@/components/common/table-pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface TableEmptyState {
	title: string;
	description?: string;
	icon?: ReactNode;
	action?: {
		label: string;
		onClick: () => void;
	};
}

export interface TableDataViewProps<TData> {
	table: TableType<TData>;
	columns: ColumnDef<TData>[];
	isPending?: boolean;
	tableContainerClassName?: string;
	tableClassName?: string;
	pagination?: boolean;
	onRowClick?: (row: Row<TData>) => void;
	emptyState?: TableEmptyState;
	headerTextClassName?: string;
	/** يُبقي صف رؤوس الأعمدة ظاهرًا ويعرض الحالة الفارغة داخل جسم الجدول (افتراضي: false) */
	keepHeaderOnEmpty?: boolean;
	/** عنصر إضافي يُعرض كصفٍّ يلي صفَّ بيانات محدّد (مثل شريط تقدّم مضمّن). يُعيد null لتخطّي الصف. */
	renderAfterRow?: (row: Row<TData>) => ReactNode;
}

const SkeletonCell = ({ className }: { className?: string }) => (
	<Skeleton className={cn("h-4", className)} />
);

const SkeletonRow = <TData,>({ columns }: { columns: ColumnDef<TData>[] }) => (
	<TableRow>
		{columns.map((col, index) => (
			<TableCell
				key={
					(col as { id?: string; accessorKey?: string }).id ??
					(col as { accessorKey?: string }).accessorKey ??
					index
				}
				className="last:py-0"
			>
				<SkeletonCell
					className={index === 0 ? "w-3/4" : index === columns.length - 1 ? "w-1/2" : "w-full"}
				/>
			</TableCell>
		))}
	</TableRow>
);

export function TableDataView<TData>({
	table,
	columns,
	isPending,
	tableContainerClassName,
	tableClassName,
	pagination = true,
	onRowClick,
	emptyState,
	headerTextClassName = "text-[#3C4150]",
	keepHeaderOnEmpty = false,
	renderAfterRow,
}: TableDataViewProps<TData>) {
	const hasActiveFilters = !!table.getState().globalFilter;
	const rows = table.getRowModel().rows;

	// آخر عنصر بدأ عنده الضغط. لازم لأن إغلاق قائمة منسدلة (Radix، في portal) عند اختيار
	// عنصر منها يُفرغ مكانها قبل إرسال حدث click، فيصل النقر إلى الصفّ الذي كانت تغطّيه
	// ويُشعل onRowClick بلا قصد. نعتدّ بنقر الصف فقط إن بدأ الضغط داخله.
	const pressTarget = useRef<Node | null>(null);
	useEffect(() => {
		const onDown = (e: PointerEvent) => {
			pressTarget.current = e.target as Node;
		};
		document.addEventListener("pointerdown", onDown, true);
		return () => document.removeEventListener("pointerdown", onDown, true);
	}, []);

	// قيم الترقيم من حالة TanStack — تُمرَّر إلى TablePagination الموحّد
	const { pageIndex, pageSize } = table.getState().pagination;
	const totalRows = table.getFilteredRowModel().rows.length;
	const fromRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
	const toRow = Math.min((pageIndex + 1) * pageSize, totalRows);

	const isEmpty = !isPending && rows.length === 0 && !hasActiveFilters && !!emptyState;

	// محتوى الحالة الفارغة — تخطيط get_code عند تمرير icon، وإلا التخطيط الافتراضي
	const emptyContent = emptyState ? (
		emptyState.icon ? (
			<div className="flex flex-col items-center justify-center gap-[16px] py-20">
				{/* icon box — 146×135 #F5F5F6 radius 4 */}
				<div className="flex h-[135px] w-[146px] items-center justify-center rounded-[4px] bg-[#F5F5F6]">
					{emptyState.icon}
				</div>
				<div className="flex w-[153px] flex-col items-end gap-[4px] text-right">
					<p className="text-[14px] font-bold leading-[27px] text-[#08090A]">
						{emptyState.title}
					</p>
					{emptyState.description && (
						<p className="text-[12px] font-medium leading-[18px] text-[#08090A]">
							{emptyState.description}
						</p>
					)}
				</div>
				{emptyState.action && (
					<button
						type="button"
						onClick={emptyState.action.onClick}
						className="flex w-[153px] items-center justify-center rounded-[4px] bg-[#6366F1] p-[10px] text-[12px] font-medium leading-[16px] text-white"
					>
						{emptyState.action.label}
					</button>
				)}
			</div>
		) : (
			<div className="flex flex-col items-center justify-center gap-4 py-20">
				<div className="flex flex-col items-center gap-2 text-center">
					<p className="text-xl font-semibold text-foreground">{emptyState.title}</p>
					{emptyState.description && (
						<p className="max-w-sm text-sm text-muted-foreground">{emptyState.description}</p>
					)}
				</div>
				{emptyState.action && (
					<Button onClick={emptyState.action.onClick}>{emptyState.action.label}</Button>
				)}
			</div>
		)
	) : null;

	// السلوك الافتراضي (owners): استبدال الجدول كله بالحالة الفارغة
	if (isEmpty && !keepHeaderOnEmpty) {
		return <div className={tableContainerClassName}>{emptyContent}</div>;
	}

	return (
		// عمود بكامل الارتفاع: الجدول يمرّر داخليًا والترقيم مثبّت أسفل الصفحة
		<div className="flex min-h-0 flex-1 flex-col">
			<div className={cn("min-h-0 flex-1 overflow-auto", tableContainerClassName)}>
				<Table className={cn("table-fixed border-y", tableClassName)}>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="hover:bg-transparent"
							>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										style={{ width: `${header.getSize()}px` }}
										className="h-11"
									>
										{header.isPlaceholder ? null : header.column.getCanSort() ? (
											<button
												type="button"
												className={cn(
													"flex h-full w-full cursor-pointer items-center gap-2 select-none",
													headerTextClassName,
												)}
												onClick={header.column.getToggleSortingHandler()}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														header.column.getToggleSortingHandler()?.(e);
													}
												}}
											>
												{flexRender(header.column.columnDef.header, header.getContext())}
												{{
													asc: (
														<IconChevronUp
															className="shrink-0 opacity-60"
															size={16}
															aria-hidden
														/>
													),
													desc: (
														<IconChevronDown
															className="shrink-0 opacity-60"
															size={16}
															aria-hidden
														/>
													),
												}[header.column.getIsSorted() as string] ?? null}
											</button>
										) : (
											<div
												className={cn(
													"flex h-full items-center gap-2 select-none",
													headerTextClassName,
												)}
											>
												{flexRender(header.column.columnDef.header, header.getContext())}
											</div>
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{isPending ? (
							<>
								<SkeletonRow columns={columns} />
								<SkeletonRow columns={columns} />
								<SkeletonRow columns={columns} />
								<SkeletonRow columns={columns} />
								<SkeletonRow columns={columns} />
							</>
						) : rows.length ? (
							rows.map((row) => (
								<Fragment key={row.id}>
									<TableRow
										data-state={row.getIsSelected() && "selected"}
										onClick={(e) => {
											// نقر عابر بعد إغلاق قائمة منسدلة كانت فوق الصف — نتجاهله
											const from = pressTarget.current;
											if (from && !e.currentTarget.contains(from)) return;
											onRowClick?.(row);
										}}
										className={cn(onRowClick && "cursor-pointer")}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className="last:py-0"
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
									{renderAfterRow?.(row)}
								</Fragment>
							))
						) : isEmpty ? (
							<TableRow className="hover:bg-transparent">
								<TableCell
									colSpan={columns.length}
									className="p-0"
								>
									{emptyContent}
								</TableCell>
							</TableRow>
						) : (
							<TableRow className="hover:bg-transparent">
								<TableCell
									colSpan={columns.length}
									className="py-16 text-center"
								>
									<NoResultsTableView />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{pagination && rows.length > 0 && (
				<TablePagination
					page={pageIndex}
					pageCount={table.getPageCount()}
					pageSize={pageSize}
					totalRows={totalRows}
					fromRow={fromRow}
					toRow={toRow}
					onPageChange={(i) => table.setPageIndex(i)}
					onPageSizeChange={(s) => table.setPageSize(s)}
				/>
			)}
		</div>
	);
}
