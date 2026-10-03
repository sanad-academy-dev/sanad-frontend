import {
	IconBolt,
	IconCheck,
	IconDotsVertical,
	IconDownload,
	IconFilter,
	IconPlus,
	IconQuestionMark,
	IconSearch,
	IconTrash,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { Stats } from "@/components/common/stats";
import { TableDataView } from "@/components/common/table-data-view";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AddRoom } from "@/features/settings/branches/components/add-room";
import {
	BranchDetailsShell,
	UserAvatarBadge,
} from "@/features/settings/branches/components/branch-details/shared";
import { StatusCell } from "@/features/settings/branches/components/status-cell";
import { ROOM_TYPE_LABELS } from "@/features/settings/branches/data/room-table";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useDeleteRoom } from "@/features/settings/branches/hooks/use-delete-room";
import { useRoomOccupancy } from "@/features/settings/branches/hooks/use-room-occupancy";
import { useRooms } from "@/features/settings/branches/hooks/use-rooms";
import { useToggleRoomStatus } from "@/features/settings/branches/hooks/use-toggle-room-status";
import { formatCompactRelativeDate } from "@/features/settings/utils/format-relative-date";
import type { RoomType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { RoomResponse } from "@/server/rooms/rooms.type";

function RoomStatusCell({ branchId, room }: { branchId: string; room: RoomResponse }) {
	const { toggleStatus, isPending } = useToggleRoomStatus(branchId);
	return (
		<StatusCell
			checked={room.active}
			disabled={isPending}
			onCheckedChange={(checked) => toggleStatus(room.id, checked)}
		/>
	);
}

const TYPE_TABS: { value: RoomType | "ALL"; label: string }[] = [
	{ value: "ALL", label: "الكل" },
	...(Object.entries(ROOM_TYPE_LABELS) as [RoomType, string][]).map(([value, label]) => ({
		value,
		label,
	})),
];

export function BranchRoomsPage({ branchId }: { branchId: string }) {
	const { branch, isLoading: branchLoading } = useBranch(branchId);
	const { rooms, isLoading } = useRooms(branchId);
	// [IP1] الإشغال الحقيقي — كان هذا العمود صفرًا ثابتًا حتى وُجدت الأقفاص
	const { occupancyByRoom } = useRoomOccupancy(branchId);
	const { deleteRoom, isPending: deletePending } = useDeleteRoom(branchId);

	const [isAdding, setIsAdding] = useState(false);
	const [typeTab, setTypeTab] = useState<RoomType | "ALL">("ALL");
	const [deleteTarget, setDeleteTarget] = useState<RoomResponse | null>(null);

	// اختصار «/» يركّز حقل البحث (كما في شريط أدوات المصروفات)
	const searchInputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		const onKeyDown = (e: globalThis.KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			if (
				e.key === "/" &&
				!(target instanceof HTMLInputElement) &&
				!(target instanceof HTMLTextAreaElement)
			) {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	const columns = useMemo<ColumnDef<RoomResponse>[]>(
		() => [
			{
				accessorKey: "name",
				header: "اسم القاعة",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<span className="text-sm font-semibold">{row.original.name}</span>
						{row.original.notes && (
							<span className="max-w-48 truncate text-xs text-muted-foreground">
								{row.original.notes}
							</span>
						)}
					</div>
				),
			},
			{
				accessorKey: "type",
				header: "نوع القاعة",
				filterFn: "equalsString",
				cell: ({ row }) => (
					<span className="w-fit rounded-[4px] bg-primary/10 px-1.5 py-1 text-[10px] leading-none text-primary">
						{ROOM_TYPE_LABELS[row.original.type]}
					</span>
				),
			},
			{
				id: "manager",
				header: "المسؤول",
				cell: ({ row }) => {
					const manager = row.original.manager;
					if (!manager) return <span className="text-xs text-muted-foreground">—</span>;
					return (
						<div className="flex items-center gap-2">
							<UserAvatarBadge name={manager.name} />
							<div className="flex flex-col">
								<span className="text-xs font-medium">{manager.name}</span>
								{manager.phone && (
									<span
										className="text-[10px] tabular-nums text-muted-foreground"
										dir="ltr"
									>
										{manager.phone}
									</span>
								)}
							</div>
						</div>
					);
				},
			},
			{
				id: "occupancy",
				header: "نسبة الإشغال",
				cell: ({ row }) => {
					// الأقفاص هي مصدر الإشغال الحقيقي؛ `capacity` يبقى تقديرًا للغرف
					// التي لم تُقسَّم أقفاصًا بعد، وحينها يُعرض «—» لا صفرٌ كاذب.
					const stat = occupancyByRoom[row.original.id];
					const total = stat?.cages ?? 0;
					if (total === 0) {
						return <span className="text-xs text-muted-foreground">لا أقفاص مُعرَّفة</span>;
					}
					const occupied = stat?.occupied ?? 0;
					return (
						<div className="flex min-w-24 items-center gap-2">
							<Progress
								value={total > 0 ? (occupied / total) * 100 : 0}
								className="h-1.5 flex-1"
							/>
							<span className="text-xs tabular-nums text-muted-foreground">
								{occupied}/{total}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: "abilities",
				header: "القدرات",
				cell: ({ row }) => {
					const chips = [...row.original.abilities, ...row.original.availableDevices];
					if (!chips.length) return <span className="text-xs text-muted-foreground">—</span>;
					return (
						<div className="flex flex-wrap items-center gap-1">
							{chips.slice(0, 3).map((chip) => (
								<span
									key={chip}
									className="rounded-[4px] bg-primary/10 px-1.5 py-1 text-[10px] leading-none text-primary"
								>
									{chip}
								</span>
							))}
							{chips.length > 3 && (
								<span className="text-[10px] text-muted-foreground">+{chips.length - 3}</span>
							)}
						</div>
					);
				},
			},
			{
				accessorKey: "createdAt",
				header: "تاريخ الإنشاء",
				cell: ({ row }) => {
					const label = formatCompactRelativeDate(row.original.createdAt);
					return (
						<p
							className={cn(
								"w-fit rounded-lg px-2 py-0.5 text-xs font-semibold",
								label === "اليوم"
									? "bg-primary/10 text-primary"
									: "bg-secondary text-secondary-foreground",
							)}
						>
							{label}
						</p>
					);
				},
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
				id: "actions",
				header: "",
				cell: ({ row }) => (
					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
							>
								<IconDotsVertical className="size-4" />
								<span className="sr-only">خيارات</span>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem
								variant="destructive"
								onClick={() => setDeleteTarget(row.original)}
							>
								<IconTrash className="size-4" />
								حذف القاعة
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[branchId, occupancyByRoom],
	);

	const table = useReactTable({
		data: rooms,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	if (branchLoading || !branch) {
		return (
			<div className="flex w-full flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	const activeCount = rooms.filter((room) => room.active).length;

	const selectTypeTab = (value: RoomType | "ALL") => {
		setTypeTab(value);
		table.getColumn("type")?.setFilterValue(value === "ALL" ? undefined : value);
	};

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="القاعات والمرافق والقدرات"
			wide
		>
			{isAdding ? (
				<div className="mx-auto w-full max-w-195">
					<AddRoom
						branchId={branchId}
						onBack={() => setIsAdding(false)}
					/>
				</div>
			) : (
				<>
					<Stats
						variant="inventory"
						stats={[
							{
								title: "# القاعات",
								value: rooms.length,
								tooltip: "إجمالي عدد القاعات في هذا الفرع",
							},
							{
								title: "القاعات المتاحة",
								value: activeCount,
								tooltip: "القاعات المفعلة والجاهزة للاستخدام",
							},
							{
								title: "خارج الدورة",
								value: rooms.length - activeCount,
								tooltip: "القاعات المعطلة أو الخارجة عن الدورة حاليًا",
							},
						]}
					/>

					<div className="flex items-center justify-between gap-3">
						{/* يمين (بداية RTL): بحث + فلترة + تصدير + مساعدة */}
						<div className="flex items-center gap-2">
							<InputGroup className="w-64">
								<InputGroupInput
									ref={searchInputRef}
									value={(table.getState().globalFilter as string) ?? ""}
									onChange={(e) => table.setGlobalFilter(e.target.value)}
									placeholder="ابحث عن القاعة..."
								/>
								<InputGroupAddon align="inline-end">
									<IconSearch />
								</InputGroupAddon>
								<InputGroupAddon align="inline-end">
									<Kbd className="bg-primary/10 text-primary">/</Kbd>
									<IconBolt className="text-primary" />
								</InputGroupAddon>
							</InputGroup>

							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										size="sm"
										variant="outline"
									>
										<IconFilter />
										{typeTab === "ALL" ? "فلترة" : ROOM_TYPE_LABELS[typeTab]}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="w-40"
								>
									{TYPE_TABS.map((tab) => (
										<DropdownMenuItem
											key={tab.value}
											onClick={() => selectTypeTab(tab.value)}
										>
											{tab.label}
											<IconCheck
												className={cn(
													"ms-auto size-4",
													typeTab === tab.value ? "opacity-100" : "opacity-0",
												)}
											/>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>

							<Button
								size="sm"
								variant="outline"
							>
								<IconDownload />
								تصدير
							</Button>

							<Button
								size="sm"
								variant="outline"
							>
								<IconQuestionMark />
								نساعدك
							</Button>

							<Separator
								orientation="vertical"
								className="my-auto h-5"
							/>
						</div>

						{/* يسار (نهاية RTL): إجراء الإنشاء الأساسي */}
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								onClick={() => setIsAdding(true)}
							>
								<IconPlus />
								إضافة قاعة جديدة
							</Button>
						</div>
					</div>

					<div className="flex flex-col overflow-hidden rounded-[4px] border bg-card">
						<TableDataView
							table={table}
							columns={columns}
							isPending={isLoading}
							emptyState={{
								title: "لا يوجد غرف في هذا الفرع",
								description: "أضف غرف للفرع لتتمكن من جدولة الزيارات والعمليات",
								action: {
									label: "إضافة قاعة جديدة",
									onClick: () => setIsAdding(true),
								},
							}}
						/>
					</div>
				</>
			)}

			<Dialog
				open={!!deleteTarget}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
			>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>حذف القاعة</DialogTitle>
						<DialogDescription>
							هل أنت متأكد من حذف قاعة «{deleteTarget?.name}»؟ لا يمكن التراجع عن هذا الإجراء.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setDeleteTarget(null)}
						>
							إلغاء
						</Button>
						<Button
							variant="destructive"
							size="sm"
							disabled={deletePending}
							onClick={async () => {
								if (!deleteTarget) return;
								try {
									await deleteRoom(deleteTarget.id);
								} catch {
									return;
								}
								setDeleteTarget(null);
							}}
						>
							حذف القاعة
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</BranchDetailsShell>
	);
}
