import {
	IconBan,
	IconDots,
	IconEdit,
	IconFileText,
	IconPlus,
	IconSend,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { docStatusAppearance } from "@/features/accounting/utils/accounting-status";
import { VoucherDemoSheet } from "@/features/accounting/voucher-demo/components/voucher-demo-sheet";
import {
	useVoucherDemoActions,
	useVoucherDemoList,
} from "@/features/accounting/voucher-demo/hooks/use-voucher-demo";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { DocStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import type { VoucherDemoRecord } from "@/server/accounting/voucher-demo/voucher-demo.type";

/**
 * [P0.2 UI] The clickable proof of the Phase 0 lifecycle: create → submit → cancel → amend
 * on `voucher_demo`, with the document number appearing only on submit (contract C7) and
 * the audit trail visible in the row.
 *
 * CONTRACT recipe §4.1 (list screen): Stats → TableToolbar → TableDataView, with the
 * create/edit Sheet mounted at the bottom. Status colours come from the single G8 map —
 * no hex here.
 */

export const VoucherDemoPage = () => {
	const { t, isRtl } = useI18n();
	const { vouchers, isLoading } = useVoucherDemoList();
	const { submitVoucher, cancelVoucher, amendVoucher, isPending } = useVoucherDemoActions();

	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editing, setEditing] = useState<VoucherDemoRecord | null>(null);

	// stable identities: both are dependencies of the memoised column defs
	const openCreate = useCallback(() => {
		setEditing(null);
		setSheetOpen(true);
	}, []);

	const openEdit = useCallback((voucher: VoucherDemoRecord) => {
		setEditing(voucher);
		setSheetOpen(true);
	}, []);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: t("accounting.docstatus.draft"),
				value: vouchers.filter((v) => v.docstatus === DocStatus.DRAFT).length,
				tooltip: t("accounting.vouchers.stats.draftTooltip"),
			},
			{
				title: t("accounting.docstatus.submitted"),
				value: vouchers.filter((v) => v.docstatus === DocStatus.SUBMITTED).length,
				tooltip: t("accounting.vouchers.stats.submittedTooltip"),
			},
			{
				title: t("accounting.docstatus.cancelled"),
				value: vouchers.filter((v) => v.docstatus === DocStatus.CANCELLED).length,
				tooltip: t("accounting.vouchers.stats.cancelledTooltip"),
			},
		],
		[vouchers, t],
	);

	const columns = useMemo<ColumnDef<VoucherDemoRecord>[]>(
		() => [
			{
				accessorKey: "documentNo",
				header: t("accounting.vouchers.columns.documentNo"),
				cell: ({ row }) => (
					// no number is consumed until submit (contract C7) — say so rather than show a blank
					<span
						className="text-sm tabular-nums"
						dir="ltr"
					>
						{row.original.documentNo ?? (
							<span className="text-muted-foreground">
								{t("accounting.vouchers.noDocumentNo")}
							</span>
						)}
					</span>
				),
			},
			{
				accessorKey: "title",
				header: t("accounting.vouchers.columns.title"),
				cell: ({ row }) => <span className="font-medium text-sm">{row.original.title}</span>,
			},
			{
				accessorKey: "amount",
				header: t("accounting.vouchers.columns.amount"),
				cell: ({ row }) => (
					<span
						className="text-sm tabular-nums"
						dir="ltr"
					>
						{row.original.amount.toString()}
					</span>
				),
			},
			{
				accessorKey: "postingDate",
				header: t("accounting.vouchers.columns.postingDate"),
				cell: ({ row }) => (
					<span
						className="text-sm tabular-nums"
						dir="ltr"
					>
						{new Date(row.original.postingDate).toISOString().slice(0, 10)}
					</span>
				),
			},
			{
				accessorKey: "docstatus",
				header: t("accounting.vouchers.columns.status"),
				cell: ({ row }) => {
					const appearance = docStatusAppearance(row.original.docstatus);
					return <Badge variant={appearance.variant}>{t(appearance.labelKey)}</Badge>;
				},
			},
			{
				id: "amendedFrom",
				header: t("accounting.vouchers.columns.amendedFrom"),
				cell: ({ row }) =>
					row.original.amendedFromId ? (
						<Badge variant="outline">{t("accounting.vouchers.amended")}</Badge>
					) : (
						<span className="text-muted-foreground text-sm">—</span>
					),
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) => {
					const voucher = row.original;
					const isDraft = voucher.docstatus === DocStatus.DRAFT;
					const isSubmitted = voucher.docstatus === DocStatus.SUBMITTED;
					const isCancelled = voucher.docstatus === DocStatus.CANCELLED;

					return (
						// dir on the Radix root: its portaled content does not inherit <html dir>
						<DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label={t("accounting.vouchers.actions.menu")}
								>
									<IconDots className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{/* cancelled documents are immutable — edit is not offered at all */}
								<DropdownMenuItem
									disabled={isPending || isCancelled}
									onClick={() => openEdit(voucher)}
								>
									<IconEdit className="size-4" />
									{t("accounting.vouchers.actions.edit")}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									disabled={isPending || !isDraft}
									onClick={() => submitVoucher(voucher.id)}
								>
									<IconSend className="size-4" />
									{t("accounting.vouchers.actions.submit")}
								</DropdownMenuItem>
								<DropdownMenuItem
									variant="destructive"
									disabled={isPending || !isSubmitted}
									onClick={() => cancelVoucher(voucher.id)}
								>
									<IconBan className="size-4" />
									{t("accounting.vouchers.actions.cancel")}
								</DropdownMenuItem>
								<DropdownMenuItem
									disabled={isPending || !isCancelled}
									onClick={() => amendVoucher(voucher.id)}
								>
									<IconFileText className="size-4" />
									{t("accounting.vouchers.actions.amend")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[t, isRtl, isPending, submitVoucher, cancelVoucher, amendVoucher, openEdit],
	);

	const table = useReactTable({
		data: vouchers,
		columns,
		state: { globalFilter: search },
		onGlobalFilterChange: setSearch,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="flex h-full w-full flex-col px-6 pb-8">
			<Stats
				variant="inventory"
				stats={stats}
			/>
			<hr className="my-2" />
			<TableToolbar
				searchValue={search}
				onSearchChange={setSearch}
				searchPlaceholder={t("accounting.vouchers.searchPlaceholder")}
				actions={
					<Button onClick={openCreate}>
						<IconPlus className="size-4" />
						{t("accounting.vouchers.create")}
					</Button>
				}
			/>
			<hr className="my-2" />

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				emptyState={{
					title: t("accounting.vouchers.empty.title"),
					description: t("accounting.vouchers.empty.description"),
					icon: <IconFileText className="size-5" />,
					action: { label: t("accounting.vouchers.create"), onClick: openCreate },
				}}
			/>

			<VoucherDemoSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				voucher={editing}
			/>
		</div>
	);
};
