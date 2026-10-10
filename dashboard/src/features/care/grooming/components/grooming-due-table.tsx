import { IconClockHour4 } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { useGroomingDue } from "@/features/care/grooming/hooks/use-grooming";
import type { GroomingDueRow } from "@/server/grooming/grooming.type";

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const fmt = (v: Date | string | null) => (v ? dateFmt.format(new Date(v)) : "—");

/**
 * قائمة الاستحقاق — «من تأخّر عن موعد تجميله؟»
 *
 * تقرأ العمود المخزَّن `nextGroomDueAt` لا تحسبه لكل طفل: هذا ما يجعل السؤال
 * مسحًا مفهرسًا واحدًا، وهو نفس عُرف استحقاق اللقاحات.
 */
export function GroomingDueTable() {
	const { rows, isLoading } = useGroomingDue();
	const [search, setSearch] = useState("");

	const columns = useMemo<ColumnDef<GroomingDueRow>[]>(
		() => [
			{
				accessorKey: "patientName",
				header: "الطفل",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-medium">{row.original.patientName}</span>
						<span className="truncate text-muted-foreground text-xs tabular-nums">
							{row.original.patientCode}
						</span>
					</div>
				),
			},
			{
				accessorKey: "ownerName",
				header: "وليّ الأمر",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate">{row.original.ownerName ?? "—"}</span>
						<span
							className="truncate text-muted-foreground text-xs tabular-nums"
							dir="ltr"
						>
							{row.original.ownerPhone ?? ""}
						</span>
					</div>
				),
			},
			{
				accessorKey: "lastGroomedAt",
				header: "آخر تجميل",
				cell: ({ row }) => (
					<span className="tabular-nums">{fmt(row.original.lastGroomedAt)}</span>
				),
			},
			{
				accessorKey: "nextGroomDueAt",
				header: "الاستحقاق",
				cell: ({ row }) => (
					<span className="tabular-nums">{fmt(row.original.nextGroomDueAt)}</span>
				),
			},
			{
				accessorKey: "daysOverdue",
				header: "الحالة",
				cell: ({ row }) =>
					row.original.daysOverdue > 0 ? (
						<Badge variant="destructive">متأخّر {row.original.daysOverdue} يومًا</Badge>
					) : (
						<Badge variant="outline">قادم</Badge>
					),
			},
			{
				accessorKey: "preferredGroomerName",
				header: "المُجمِّل المفضّل",
				cell: ({ row }) => (
					<span className="truncate">{row.original.preferredGroomerName ?? "—"}</span>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: rows,
		columns,
		state: { globalFilter: search },
		onGlobalFilterChange: (updater) =>
			setSearch(typeof updater === "function" ? updater(search) : String(updater)),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<TableToolbar
				className="border-t"
				searchValue={search}
				onSearchChange={setSearch}
				searchPlaceholder="ابحث بالطفل أو وليّ الأمر..."
			/>
			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				emptyState={{
					title: "لا أحد مستحقّ للتجميل الآن",
					description:
						"تظهر هنا الأطفال التي حلّ أو قارب موعد تجميلها، وفق دورية كرت التجميل",
					icon: <IconClockHour4 className="size-10 text-[#9CA3AF]" />,
				}}
			/>
		</div>
	);
}
