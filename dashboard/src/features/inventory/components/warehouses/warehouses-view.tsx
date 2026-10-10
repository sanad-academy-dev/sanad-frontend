import {
	IconBuildingWarehouse,
	IconDots,
	IconEdit,
	IconPlus,
	IconStar,
	IconTrash,
	IconTruck,
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WarehouseSheet } from "@/features/inventory/components/warehouses/warehouse-sheet";
import { useWarehouseMutations } from "@/features/inventory/hooks/use-warehouse-mutations";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";
import { cn } from "@/lib/utils";
import type { WarehouseResponse } from "@/server/stock/stock.type";

const dateFmt = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" });

export function WarehousesView() {
	const { warehouses, isLoading } = useWarehouses();
	const { updateWarehouse, disableWarehouse } = useWarehouseMutations();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editing, setEditing] = useState<WarehouseResponse | null>(null);

	const openAdd = () => {
		setEditing(null);
		setSheetOpen(true);
	};

	const columns = useMemo<ColumnDef<WarehouseResponse>[]>(
		() => [
			{
				accessorKey: "name",
				header: "المستودع",
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium">{row.original.name}</span>
						{row.original.isDefault && (
							<span className="inline-flex items-center gap-1 rounded-md bg-[#6366F1]/10 px-2 py-0.5 text-[10px] font-medium text-[#6366F1]">
								<IconStar className="size-3" />
								افتراضي
							</span>
						)}
						{/* [MC1.1] مستودع مركبة — يوضّح لماذا لا يُعدّل ولا يُحذف من هنا */}
						{row.original.isMobile && (
							<span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
								<IconTruck className="size-3" />
								أكاديمية متنقلة
							</span>
						)}
					</div>
				),
			},
			{
				accessorKey: "code",
				header: "المعرّف",
				cell: ({ row }) => (
					<span className="font-mono text-sm tabular-nums">{row.original.code}</span>
				),
			},
			{
				accessorKey: "active",
				header: "الحالة",
				cell: ({ row }) => (
					<span
						className={cn(
							"inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
							row.original.active ? "text-emerald-600" : "text-muted-foreground",
						)}
					>
						<span
							className={cn(
								"size-1.5 rounded-full",
								row.original.active ? "bg-emerald-500" : "bg-muted-foreground",
							)}
						/>
						{row.original.active ? "نشط" : "غير نشط"}
					</span>
				),
			},
			{
				accessorKey: "createdAt",
				header: "تاريخ الإنشاء",
				cell: ({ row }) => (
					<span className="text-xs text-muted-foreground tabular-nums">
						{dateFmt.format(new Date(row.original.createdAt))}
					</span>
				),
			},
			{
				id: "actions",
				size: 64,
				header: "الإجراءات",
				cell: ({ row }) => {
					const w = row.original;
					return (
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
								<DropdownMenuItem
									className="gap-2"
									onClick={() => {
										setEditing(w);
										setSheetOpen(true);
									}}
								>
									<IconEdit className="size-4" />
									تعديل
								</DropdownMenuItem>
								{/* مستودع مركبة لا يصلح افتراضيًّا (الافتراضي يستقبل حركات نقطة البيع
								    والرصيد الافتتاحي)، ولا يُحذف من هنا — يُحذف بحذف مركبته */}
								<DropdownMenuItem
									className="gap-2"
									disabled={w.isDefault || w.isMobile}
									onClick={() => updateWarehouse(w.id, { isDefault: true })}
								>
									<IconStar className="size-4" />
									تعيين كافتراضي
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2 text-destructive"
									disabled={w.isDefault || w.isMobile}
									onClick={() => disableWarehouse(w.id)}
								>
									<IconTrash className="size-4" />
									حذف
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[updateWarehouse, disableWarehouse],
	);

	const table = useReactTable({
		data: warehouses,
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
			<WarehouseSheet
				open={sheetOpen}
				warehouse={editing}
				onClose={() => setSheetOpen(false)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchClassName="w-[414px]"
					searchPlaceholder="ابحث عن مستودع بالاسم أو المعرّف..."
					searchValue={search}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					actions={
						<Button
							size="sm"
							onClick={openAdd}
						>
							<IconPlus />
							إضافة مستودع
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
						title: "لا توجد مستودعات بعد",
						description: "أضف مستودعًا (المستودع الرئيسي، صيدلية الفرع، العربة المتنقّلة...).",
						icon: emptyIcon,
						action: { label: "إضافة مستودع", onClick: openAdd },
					}}
				/>
			</div>
		</>
	);
}
