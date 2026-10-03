import {
	IconBan,
	IconDots,
	IconPlus,
	IconShoppingCart,
	IconTruckDelivery,
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
import { PurchaseOrderSheet } from "@/features/inventory/components/purchasing/purchase-order-sheet";
import { ReceiveOrderDialog } from "@/features/inventory/components/purchasing/receive-order-dialog";
import { PURCHASE_STATUS_META } from "@/features/inventory/data/constants";
import { usePurchaseOrderMutations } from "@/features/inventory/hooks/use-purchase-order-mutations";
import { usePurchaseOrders } from "@/features/inventory/hooks/use-purchase-orders";
import { cn } from "@/lib/utils";
import type { PurchaseOrderResponse } from "@/server/purchasing/purchasing.type";

const dateFmt = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" });

const orderTotal = (po: PurchaseOrderResponse) =>
	po.items.reduce((s, it) => s + it.qtyOrdered * Number(it.unitCost), 0);

interface PurchasesViewProps {
	sheetOpen: boolean;
	setSheetOpen: (open: boolean) => void;
}

export function PurchasesView({ sheetOpen, setSheetOpen }: PurchasesViewProps) {
	const { purchaseOrders, isLoading } = usePurchaseOrders();
	const { cancelPurchaseOrder } = usePurchaseOrderMutations();
	const [receiving, setReceiving] = useState<PurchaseOrderResponse | null>(null);

	const columns = useMemo<ColumnDef<PurchaseOrderResponse>[]>(
		() => [
			{
				accessorKey: "code",
				header: "المعرّف",
				cell: ({ row }) => (
					<span className="text-sm font-semibold tabular-nums">{row.original.code}</span>
				),
			},
			{
				id: "supplier",
				accessorFn: (r) => r.supplier.legalName,
				header: "المورد",
				cell: ({ row }) => <span className="text-sm">{row.original.supplier.legalName}</span>,
			},
			{
				id: "warehouse",
				header: "المستودع",
				cell: ({ row }) => (
					<span className="text-sm text-muted-foreground">{row.original.warehouse.name}</span>
				),
			},
			{
				id: "items",
				header: "الأصناف",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums text-muted-foreground">
						{row.original.items.length}
					</span>
				),
			},
			{
				id: "total",
				header: "الإجمالي",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">
						{orderTotal(row.original).toLocaleString("ar-EG")} ر.س
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				cell: ({ row }) => {
					const meta = PURCHASE_STATUS_META[row.original.status];
					return (
						<span
							className={cn(
								"inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
								meta.className,
							)}
						>
							<span className="size-1.5 rounded-full bg-current" />
							{meta.label}
						</span>
					);
				},
			},
			{
				accessorKey: "createdAt",
				header: "التاريخ",
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
					const po = row.original;
					const canReceive = po.status === "ORDERED" || po.status === "PARTIALLY_RECEIVED";
					const canCancel = po.status !== "RECEIVED" && po.status !== "CANCELLED";
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
									disabled={!canReceive}
									onClick={() => setReceiving(po)}
								>
									<IconTruckDelivery className="size-4" />
									استلام
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2 text-destructive"
									disabled={!canCancel}
									onClick={() => cancelPurchaseOrder(po.id)}
								>
									<IconBan className="size-4" />
									إلغاء الأمر
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[cancelPurchaseOrder],
	);

	const table = useReactTable({
		data: purchaseOrders,
		columns,
		enableSorting: false,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	const search = (table.getState().globalFilter as string) ?? "";
	const emptyIcon: ReactNode = <IconShoppingCart className="size-10 text-[#A3A8B0]" />;

	return (
		<>
			<PurchaseOrderSheet
				open={sheetOpen}
				onClose={() => setSheetOpen(false)}
			/>
			<ReceiveOrderDialog
				order={receiving}
				onClose={() => setReceiving(null)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchClassName="w-[414px]"
					searchPlaceholder="ابحث عن أمر شراء بالمعرّف أو المورد..."
					searchValue={search}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					actions={
						<Button
							size="sm"
							onClick={() => setSheetOpen(true)}
						>
							<IconPlus />
							أمر شراء جديد
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
						title: "لا توجد أوامر شراء بعد",
						description:
							"أنشئ أول أمر شراء من مورد لتجديد المخزون، ثم سجّل الاستلام ليُحدَّث الرصيد تلقائيًا.",
						icon: emptyIcon,
						action: { label: "أمر شراء جديد", onClick: () => setSheetOpen(true) },
					}}
				/>
			</div>
		</>
	);
}
