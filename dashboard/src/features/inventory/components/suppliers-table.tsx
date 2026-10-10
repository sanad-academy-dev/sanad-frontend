import {
	IconBuildingWarehouse,
	IconDots,
	IconEye,
	IconInfoCircle,
	IconMail,
	IconPhone,
	IconPlus,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddSupplierSheet } from "@/features/inventory/components/add-supplier-sheet";
import { useSuppliers } from "@/features/inventory/hooks/use-suppliers";
import { cn } from "@/lib/utils";
import type { SupplierResponse } from "@/server/suppliers/suppliers.type";

const headerWithInfo = (label: string) => () => (
	<>
		<span>{label}</span>
		<IconInfoCircle
			className="size-[10px] text-[#9B9B9D] opacity-45"
			stroke={0.833}
		/>
	</>
);

export function SuppliersTable() {
	const [sheetOpen, setSheetOpen] = useState(false);
	const { suppliers, isLoading } = useSuppliers();

	const columns = useMemo<ColumnDef<SupplierResponse>[]>(
		() => [
			{
				id: "select",
				size: 48,
				header: () => (
					<Checkbox className="size-[18px] rounded-[4px] border-[1.5px] border-[#E5E5E5]" />
				),
				cell: () => (
					<Checkbox className="size-[18px] rounded-[4px] border-[1.5px] border-[#E5E5E5]" />
				),
			},
			{
				accessorKey: "legalName",
				header: "المورد / المعرّف",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<span className="font-semibold text-sm">{row.original.legalName}</span>
						<span className="text-xs text-muted-foreground tabular-nums">
							{row.original.code}
						</span>
					</div>
				),
			},
			{
				accessorKey: "contactName",
				header: "جهة الاتصال",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<span className="text-sm">{row.original.contactName}</span>
						{row.original.contactTitle && (
							<span className="text-xs text-muted-foreground">
								{row.original.contactTitle}
							</span>
						)}
					</div>
				),
			},
			{
				id: "phoneEmail",
				header: "الجوال/ البريد",
				cell: ({ row }) => (
					<div className="flex flex-col gap-0.5">
						<span className="flex items-center gap-1.5 text-sm tabular-nums">
							<IconPhone className="size-3 shrink-0 text-muted-foreground" />
							{row.original.phone}
						</span>
						{row.original.email && (
							<span className="flex max-w-[160px] items-center gap-1.5 text-xs text-muted-foreground">
								<IconMail className="size-3 shrink-0" />
								<span className="truncate">{row.original.email}</span>
							</span>
						)}
					</div>
				),
			},
			{
				id: "products",
				header: headerWithInfo("المنتجات"),
				cell: ({ row }) => (
					<span className="text-sm tabular-nums text-muted-foreground">
						{row.original.products.length} منتج
					</span>
				),
			},
			{
				id: "orders",
				header: headerWithInfo("الطلبات"),
				cell: () => <span className="text-sm tabular-nums text-muted-foreground">0</span>,
			},
			{
				id: "purchases",
				header: headerWithInfo("إجمالي المشتريات"),
				cell: () => <span className="text-sm tabular-nums text-muted-foreground">٠٠ ر.س</span>,
			},
			{
				id: "status",
				header: headerWithInfo("حالة"),
				cell: ({ row }) => {
					const active = row.original.active;
					return (
						<span
							className={cn(
								"inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
								active ? "text-emerald-600" : "text-muted-foreground",
							)}
						>
							<span
								className={cn(
									"size-1.5 rounded-full",
									active ? "bg-emerald-500" : "bg-muted-foreground",
								)}
							/>
							{active ? "نشط" : "غير نشط"}
						</span>
					);
				},
			},
			{
				id: "actions",
				size: 64,
				header: "الإجراءات",
				cell: () => (
					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-8"
							>
								<IconDots className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem className="gap-2">
								<IconEye className="size-4" />
								فتح
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: suppliers,
		columns,
		enableSorting: false,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	const search = (table.getState().globalFilter as string) ?? "";
	const emptyIcon: ReactNode = <IconBuildingWarehouse className="size-10 text-[#A3A8B0]" />;

	return (
		<>
			<AddSupplierSheet
				open={sheetOpen}
				standalone
				onClose={() => setSheetOpen(false)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchClassName="w-[414px]"
					searchPlaceholder="ابحث عن المورد بالاسم أو المعرف..."
					searchValue={search}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					actions={
						<Button
							size="sm"
							onClick={() => setSheetOpen(true)}
						>
							<IconPlus />
							إضافة مورد جديد
						</Button>
					}
				/>

				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					keepHeaderOnEmpty
					headerTextClassName="text-[#5C5C5E] text-[12px] font-semibold"
					emptyState={{
						title: "لا يوجد أي مورد مضاف حتى الآن",
						description:
							"ابدأ بإضافة أول مورد لإدارة المنتجات، أوامر الشراء، وتتبع التوريد داخل الأكاديمية بسهولة.",
						icon: emptyIcon,
						action: { label: "إضافة أول مورد", onClick: () => setSheetOpen(true) },
					}}
				/>
			</div>
		</>
	);
}
