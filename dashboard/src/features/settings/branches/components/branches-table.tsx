import { IconMapPin, IconPlus } from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BranchSheet } from "@/features/settings/branches/components/branch-sheet";
import { StatusCell } from "@/features/settings/branches/components/status-cell";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { useToggleBranchStatus } from "@/features/settings/branches/hooks/use-toggle-branch-status";
import { useBranchesStore } from "@/features/settings/branches/stores/branch.store";
import type {
	BranchStatusCellProps,
	ManagerAvatarProps,
} from "@/features/settings/branches/types/branches-table.types";
import { formatCompactRelativeDate } from "@/features/settings/utils/format-relative-date";
import { CITIES } from "@/lib/data/cities";
import { cn } from "@/lib/utils";
import type { BranchWithManager } from "@/server/branches/branches.type";

function ManagerAvatar({ name }: ManagerAvatarProps) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary primarytext-xs font-semibold border border-primary/20">
			{initials}
		</div>
	);
}

function BranchStatusCell({ branch }: BranchStatusCellProps) {
	const isPrimary = branch.type === "PRIMARY";
	const { toggleStatus, isPending } = useToggleBranchStatus();
	return (
		<StatusCell
			checked={branch.active}
			disabled={isPending || isPrimary}
			onCheckedChange={(checked) => toggleStatus(branch.id, checked)}
		/>
	);
}

export function BranchesTable() {
	const navigate = useNavigate();
	const { branches, isLoading } = useBranches();
	const { selectedBranch, isOpen, setIsOpen, setSelectedBranch } = useBranchesStore();
	const closeBranchSheet = () => {
		setIsOpen(false);
		setSelectedBranch(null);
	};

	const columns = useMemo<ColumnDef<BranchWithManager>[]>(
		() => [
			{
				accessorKey: "name",
				header: "اسم الفرع",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<span className="font-semibold text-sm">{row.original.name}</span>
						<span className="text-xs text-muted-foreground">{row.original.branchCode}</span>
					</div>
				),
			},
			{
				accessorKey: "type",
				header: "النوع",
				cell: ({ row }) => (
					<Badge variant={row.original.type === "PRIMARY" ? "primary" : "secondary"}>
						{row.original.type === "PRIMARY" ? "رئيسي" : "فرعي"}
					</Badge>
				),
			},
			{
				accessorKey: "manager",
				header: "المسؤول",
				cell: ({ row }) => {
					const manager = row.original.manager;
					if (!manager) return <span className="text-muted-foreground text-sm">—</span>;
					return (
						<div className="flex items-center gap-2">
							<ManagerAvatar name={manager.name} />
							<div className="flex flex-col gap-0.5">
								<span className="font-medium text-sm">{manager.name}</span>
								{manager.phone && (
									<span className="text-xs text-muted-foreground tabular-nums">
										{manager.phone}
									</span>
								)}
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "address",
				header: "العنوان",
				cell: ({ row }) => {
					const parts = [
						CITIES.find((city) => city.value === row.original.city)?.label,
						row.original.address,
					].filter(Boolean);
					if (!parts.length) return <span className="text-muted-foreground text-sm">—</span>;
					return (
						<div className="flex items-start gap-1.5 text-sm">
							<IconMapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
							<span className="leading-snug">{parts.join("، ")}</span>
						</div>
					);
				},
			},
			{
				id: "rooms",
				header: () => <span className="block text-center">عدد القاعات</span>,
				cell: ({ row }) => (
					<span className="block text-center tabular-nums text-sm">
						{row.original._count.rooms}
					</span>
				),
			},
			{
				id: "branchUsers",
				header: () => <span className="block text-center">عدد الموظفين</span>,
				cell: ({ row }) => (
					<span className="block text-center tabular-nums text-sm">
						{row.original._count.branchUsers}
					</span>
				),
			},
			{
				accessorKey: "active",
				header: "حالة",
				cell: ({ row }) => <BranchStatusCell branch={row.original} />,
			},
			{
				accessorKey: "createdAt",
				header: "تاريخ الانشاء",
				cell: ({ row }) => {
					const label = formatCompactRelativeDate(row.original.createdAt);
					return (
						<p
							className={cn(
								"text-xs font-semibold rounded-[4px] w-fit px-2 py-0.5",
								label === "اليوم"
									? "text-primary bg-primary/10"
									: "text-secondary-foreground bg-secondary",
							)}
						>
							{label}
						</p>
					);
				},
			},
		],
		[],
	);

	const table = useReactTable({
		data: branches,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	return (
		<>
			<BranchSheet
				branch={selectedBranch}
				open={isOpen}
				onClose={closeBranchSheet}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchPlaceholder="ابحث باسم الفرع..."
					searchValue={(table.getState().globalFilter as string) ?? ""}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					actions={
						<Link to="/add-branch">
							<Button size="sm">
								<IconPlus />
								فرع جديد
							</Button>
						</Link>
					}
				/>

				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					onRowClick={(row) =>
						navigate({
							to: "/management/settings/branch/$branchId",
							params: { branchId: row.original.id },
						})
					}
					emptyState={{
						title: "لا يوجد فروع حتى الآن",
						description: "أضف فروع الأكاديمية لتتمكن من إدارة القاعات والموظفين والزيارات",
						action: {
							label: "أضف فرع جديد",
							onClick: () => navigate({ to: "/add-branch" }),
						},
					}}
				/>
			</div>
		</>
	);
}
