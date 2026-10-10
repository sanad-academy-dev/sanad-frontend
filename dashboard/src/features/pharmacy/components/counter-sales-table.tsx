import { IconCash, IconCashRegister, IconPackageExport } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { toast } from "sonner";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePaySale } from "@/features/inventory/hooks/use-create-sale";
import {
	useCounterSales,
	useDispenseCounterSale,
} from "@/features/pharmacy/hooks/use-pharmacy";
import type { SaleResponse } from "@/server/sales/sales.type";

const money = (v: unknown) => Number(v ?? 0).toFixed(2);
const timeFmt = new Intl.DateTimeFormat("ar", { dateStyle: "short", timeStyle: "short" });

/**
 * [PH16] طابور الكاونتر — الفاتورة تمرّ بثلاث محطّات ظاهرة في الصفّ نفسه:
 * **بانتظار التحصيل** ⇢ **مسدَّدة — جاهزة للصرف** ⇢ **صُرفت**. زرّ الصرف لا يظهر
 * قبل السداد، فلا يخرج دواء من الرفّ بلا ثمن، وهو وحده الذي يخصم المخزون.
 */
export function CounterSalesTable({ onSell }: { onSell: () => void }) {
	const { sales, isLoading } = useCounterSales();
	const { paySale, isPending: isPaying } = usePaySale();
	const { dispenseSale, isPending: isDispensing } = useDispenseCounterSale();

	const columns = useMemo<ColumnDef<SaleResponse>[]>(
		() => [
			{
				accessorKey: "code",
				header: "الفاتورة",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-medium">{row.original.customerName || "زبون"}</span>
						<span className="truncate text-muted-foreground text-xs tabular-nums">
							{row.original.code}
							{row.original.customerPhone ? ` · ${row.original.customerPhone}` : ""}
						</span>
					</div>
				),
			},
			{
				id: "items",
				header: "الأصناف",
				cell: ({ row }) => (
					<span className="line-clamp-2 max-w-72 text-xs">
						{row.original.items.map((i) => `${i.name} ×${i.quantity}`).join("، ")}
					</span>
				),
			},
			{
				accessorKey: "total",
				header: "الإجمالي",
				cell: ({ row }) => (
					<span className="tabular-nums">{money(row.original.total)} ر.س</span>
				),
			},
			{
				id: "status",
				header: "الحالة",
				cell: ({ row }) => {
					const s = row.original;
					if (s.dispensedAt)
						return (
							<Badge variant="secondary">صُرفت {timeFmt.format(new Date(s.dispensedAt))}</Badge>
						);
					if (s.status === "PAID") return <Badge>مسدَّدة — جاهزة للصرف</Badge>;
					if (s.status === "REFUNDED") return <Badge variant="destructive">مُرتجَعة</Badge>;
					return <Badge variant="outline">بانتظار التحصيل</Badge>;
				},
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) => {
					const s = row.original;
					if (s.dispensedAt || s.status === "REFUNDED") return null;
					if (s.status === "PENDING")
						return (
							<Button
								size="sm"
								variant="outline"
								disabled={isPaying}
								onClick={() =>
									toast.promise(paySale({ saleId: s.id, paymentMethod: s.paymentMethod }), {
										loading: "جارٍ التحصيل…",
										success: "سُدِّدت الفاتورة — يمكن صرفها الآن",
										error: (e: Error) => e.message || "تعذّر التحصيل",
									})
								}
							>
								<IconCash className="size-4" />
								تحصيل
							</Button>
						);
					return (
						<Button
							size="sm"
							disabled={isDispensing}
							onClick={() =>
								toast.promise(dispenseSale(s.id), {
									loading: "جارٍ الصرف…",
									success: "صُرفت الفاتورة وخُصم المخزون",
									error: (e: Error) => e.message || "تعذّر الصرف",
								})
							}
						>
							<IconPackageExport className="size-4" />
							صرف
						</Button>
					);
				},
			},
		],
		[paySale, dispenseSale, isPaying, isDispensing],
	);

	const table = useReactTable({
		data: sales,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<TableToolbar
				className="border-t"
				actions={
					<Button
						size="sm"
						onClick={onSell}
					>
						<IconCashRegister className="size-4" />
						بيع دواء
					</Button>
				}
			/>
			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				emptyState={{
					title: "لا فواتير كاونتر",
					description:
						"«بيع دواء» يُنشئ فاتورة بلا وصفة. تُسدَّد هنا أو على نقطة البيع، ثم يظهر زرّ «صرف» — وهو وحده ما يخصم المخزون.",
					icon: <IconCashRegister className="size-10 text-muted-foreground/60" />,
				}}
			/>
		</div>
	);
}
