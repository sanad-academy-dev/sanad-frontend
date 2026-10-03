import {
	IconCirclePlus,
	IconDots,
	IconEdit,
	IconPlayerPause,
	IconPlayerPlay,
	IconTrash,
	IconTruck,
	IconUsers,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { type ReactNode, useMemo, useState } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileUnitFormSheet } from "@/features/mobile-clinics/components/mobile-unit-form-sheet";
import { MobileUnitSheet } from "@/features/mobile-clinics/components/mobile-unit-sheet";
import { MOBILE_UNIT_STATUS_META } from "@/features/mobile-clinics/data/status-meta";
import { useMobileUnitMutations } from "@/features/mobile-clinics/hooks/use-mobile-unit-mutations";
import { useMobileUnits } from "@/features/mobile-clinics/hooks/use-mobile-units";
import { cn } from "@/lib/utils";
import type { MobileUnitResponse } from "@/server/mobile-clinics/mobile-units/mobile-units.type";

export function MobileUnitsView() {
	// scope: "all" — الموقوفة إداريًّا يجب أن تبقى مرئية، وإلّا اختفت الوحدة التي أوقفها
	// المسؤول للتوّ ولا يجد سبيلًا لإعادة تفعيلها.
	const { units, isLoading } = useMobileUnits({ scope: "all" });
	const { setUnitActive, deleteUnit } = useMobileUnitMutations();

	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<MobileUnitResponse | null>(null);
	const [detailId, setDetailId] = useState<string | null>(null);

	const openAdd = () => {
		setEditing(null);
		setFormOpen(true);
	};

	const columns = useMemo<ColumnDef<MobileUnitResponse>[]>(
		() => [
			{
				accessorKey: "name",
				header: "الوحدة",
				cell: ({ row }) => {
					const unit = row.original;
					return (
						<div className="flex flex-col gap-0.5">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">{unit.name}</span>
								{!unit.active && (
									<span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
										موقوفة
									</span>
								)}
							</div>
							{unit.plateNumber && (
								// لوحة المركبة جزيرة LTR داخل صفحة RTL — الأرقام والحروف اللاتينية
								// تنعكس بلا هذا التحديد.
								<span
									dir="ltr"
									className="text-start font-mono text-[11px] text-muted-foreground"
								>
									{unit.plateNumber}
								</span>
							)}
						</div>
					);
				},
			},
			{
				accessorKey: "code",
				header: "المعرّف",
				cell: ({ row }) => (
					<span
						dir="ltr"
						className="block text-start font-mono text-sm tabular-nums"
					>
						{row.original.code}
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				cell: ({ row }) => {
					const unit = row.original;
					const meta = MOBILE_UNIT_STATUS_META[unit.status];
					const Icon = meta.icon;
					return (
						<span
							className={cn(
								"inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
								unit.active ? meta.color : "text-muted-foreground",
							)}
						>
							<Icon className="size-3.5" />
							{unit.active ? meta.label : "موقوفة إداريًّا"}
						</span>
					);
				},
			},
			{
				id: "branch",
				header: "الفرع",
				cell: ({ row }) => (
					<span className="text-sm text-muted-foreground">
						{row.original.branch?.name ?? "—"}
					</span>
				),
			},
			{
				id: "crew",
				header: "الطاقم",
				cell: ({ row }) => (
					<span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground tabular-nums">
						<IconUsers className="size-4" />
						{row.original._count.crew}
					</span>
				),
			},
			{
				id: "warehouse",
				header: "المستودع",
				cell: ({ row }) => (
					<span className="text-xs text-muted-foreground">
						{row.original.warehouse?.name ?? "—"}
					</span>
				),
			},
			{
				id: "actions",
				size: 64,
				header: "الإجراءات",
				cell: ({ row }) => {
					const unit = row.original;
					return (
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="size-8"
									onClick={(e) => e.stopPropagation()}
								>
									<IconDots className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuItem
									className="gap-2"
									onClick={() => {
										setEditing(unit);
										setFormOpen(true);
									}}
								>
									<IconEdit className="size-4" />
									تعديل
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2"
									onClick={() => setUnitActive(unit.id, !unit.active)}
								>
									{unit.active ? (
										<>
											<IconPlayerPause className="size-4" />
											إيقاف الوحدة
										</>
									) : (
										<>
											<IconPlayerPlay className="size-4" />
											تفعيل الوحدة
										</>
									)}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="gap-2 text-destructive"
									onClick={() => deleteUnit(unit.id)}
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
		[setUnitActive, deleteUnit],
	);

	const table = useReactTable({
		data: units,
		columns,
		enableSorting: false,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	const search = (table.getState().globalFilter as string) ?? "";
	const emptyIcon: ReactNode = <IconTruck className="size-10 text-muted-foreground" />;

	return (
		<>
			<MobileUnitFormSheet
				open={formOpen}
				unit={editing}
				onClose={() => setFormOpen(false)}
			/>
			<MobileUnitSheet
				unitId={detailId}
				onClose={() => setDetailId(null)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchClassName="w-[414px]"
					searchPlaceholder="ابحث عن وحدة بالاسم أو المعرّف أو رقم اللوحة..."
					searchValue={search}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					actions={
						<Button
							size="sm"
							onClick={openAdd}
						>
							<IconCirclePlus />
							إضافة وحدة متنقلة
						</Button>
					}
				/>

				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					keepHeaderOnEmpty
					onRowClick={(row) => setDetailId(row.original.id)}
					headerTextClassName="text-[12px] font-semibold text-muted-foreground"
					emptyState={{
						title: "لا توجد وحدات متنقلة بعد",
						description: "أضف مركبة لتبدأ: يُنشأ لها مستودعها الخاص تلقائيًا، ثم عيّن طاقمها.",
						icon: emptyIcon,
						action: { label: "إضافة وحدة متنقلة", onClick: openAdd },
					}}
				/>
			</div>
		</>
	);
}
