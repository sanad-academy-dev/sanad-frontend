import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { TableDataView } from "@/components/common/table-data-view";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusCell } from "@/features/settings/branches/components/status-cell";
import {
	ROOM_TYPE_LABELS,
	ROOM_TYPE_VARIANTS,
} from "@/features/settings/branches/data/room-table";
import { useRooms } from "@/features/settings/branches/hooks/use-rooms";
import { useToggleRoomStatus } from "@/features/settings/branches/hooks/use-toggle-room-status";
import type {
	RoomStatusCellProps,
	RoomsTableProps,
} from "@/features/settings/branches/types/rooms-table.types";
import { formatCompactRelativeDate } from "@/features/settings/utils/format-relative-date";
import type { RoomResponse } from "@/server/rooms/rooms.type";

function RoomStatusCell({ branchId, room }: RoomStatusCellProps) {
	const { toggleStatus, isPending } = useToggleRoomStatus(branchId);
	return (
		<StatusCell
			checked={room.active}
			disabled={isPending}
			onCheckedChange={(checked) => toggleStatus(room.id, checked)}
		/>
	);
}

export function RoomsTable({ branchId }: RoomsTableProps) {
	const { rooms, isLoading } = useRooms(branchId);

	const columns = useMemo<ColumnDef<RoomResponse>[]>(
		() => [
			{
				accessorKey: "name",
				header: "اسم القاعة",
				cell: ({ row }) => <span className="font-semibold text-sm">{row.original.name}</span>,
			},
			{
				accessorKey: "type",
				header: "النوع",
				cell: ({ row }) => (
					<Badge variant={ROOM_TYPE_VARIANTS[row.original.type]}>
						{ROOM_TYPE_LABELS[row.original.type]}
					</Badge>
				),
			},
			{
				id: "occupancy",
				header: "نسبة الاشغال",
				cell: ({ row }) => (
					<div className="flex items-center gap-2 min-w-24">
						<Progress
							value={0}
							className="h-1.5 flex-1"
						/>
						<span className="text-xs text-muted-foreground tabular-nums">
							0/{row.original.capacity}
						</span>
					</div>
				),
			},
			{
				accessorKey: "active",
				header: "الحالة",
				cell: ({ row }) => (
					<RoomStatusCell
						branchId={branchId}
						room={row.original}
					/>
				),
			},
			{
				accessorKey: "abilities",
				header: "القدرات",
				cell: ({ row }) => {
					const abilities = row.original.abilities;
					if (!abilities.length)
						return <span className="text-muted-foreground text-xs">—</span>;
					return (
						<div className="flex flex-wrap gap-1">
							{abilities.slice(0, 3).map((ability) => (
								<Badge
									key={ability}
									variant="outline"
									className="text-xs h-5 px-1.5"
								>
									{ability}
								</Badge>
							))}
						</div>
					);
				},
			},
			{
				accessorKey: "createdAt",
				header: "تاريخ الانشاء",
				cell: ({ row }) => {
					const label = formatCompactRelativeDate(row.original.createdAt);
					return (
						<p
							className={
								label === "اليوم"
									? "text-xs font-semibold rounded-[4px] w-fit px-2 py-0.5 text-primary bg-primary/10"
									: "text-xs font-semibold rounded-[4px] w-fit px-2 py-0.5 text-secondary-foreground bg-secondary"
							}
						>
							{label}
						</p>
					);
				},
			},
		],
		[branchId],
	);

	const table = useReactTable({
		data: rooms,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="w-full border rounded-[4px] overflow-hidden">
			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				pagination={false}
				emptyState={{
					title: "لا يوجد غرف في هذا الفرع",
					description: "أضف غرف للفرع لتتمكن من جدولة الزيارات والعمليات",
				}}
			/>
		</div>
	);
}
