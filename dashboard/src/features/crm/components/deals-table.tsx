import { Link } from "@tanstack/react-router";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import { LeadStatusPill } from "@/features/crm/components/lead-status-pill";
import { SlaBadge } from "@/features/crm/components/sla-badge";
import type { CrmDealListResponse } from "@/server/crm/crm-deals/crm-deals.type";

/**
 * [CRM-P2] §11.2 — the list half of the deals screen. Filtering/sorting is server-driven.
 *
 * Amounts go through `formatAmount`, which groups on the STRING: contract C2 forbids a JS
 * float touching money, and `Number(dealValue).toLocaleString()` would be exactly that.
 *
 * [UI] On the `/services/staff` contract via `TableDataView`. The stage cell keeps
 * `LeadStatusPill` — moving a deal's stage has its own rules (§7), so it is not turned into
 * an inline editor here.
 */
export const DealsTable = ({
	deals,
	isLoading,
	onOpenCreate,
}: {
	deals: CrmDealListResponse[];
	isLoading: boolean;
	onOpenCreate?: () => void;
}) => {
	// useReactTable يشترط مرجعًا ثابتًا لـ data — مصفوفة جديدة كل رسم تُعيد ضبط الترقيم بلا نهاية
	const rows = useMemo(() => deals, [deals]);

	const columns = useMemo<ColumnDef<CrmDealListResponse>[]>(
		() => [
			{
				accessorKey: "fullName",
				header: "الصفقة",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<Link
							to="/crm/deals/$dealId"
							params={{ dealId: row.original.id }}
							className="font-semibold text-sm hover:underline"
						>
							{row.original.fullName}
						</Link>
						<span className="text-muted-foreground text-xs tabular-nums">
							{row.original.code}
						</span>
					</div>
				),
			},
			{
				accessorKey: "mobile",
				header: "الجوال",
				// the mobile is an LTR island inside an RTL page
				cell: ({ row }) => (
					<span
						dir="ltr"
						className="block text-start text-sm tabular-nums"
					>
						{row.original.mobile}
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "المرحلة",
				cell: ({ row }) => (
					<LeadStatusPill
						name={row.original.status.name}
						color={row.original.status.color}
					/>
				),
			},
			{
				accessorKey: "dealValue",
				header: "القيمة",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">
						{formatAmount(String(row.original.dealValue))}
					</span>
				),
			},
			{
				accessorKey: "probability",
				header: "النسبة",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">{Number(row.original.probability)}٪</span>
				),
			},
			{
				accessorKey: "expectedValue",
				header: "القيمة المتوقّعة",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">
						{formatAmount(String(row.original.expectedValue))}
					</span>
				),
			},
			{
				// [CRM-P5] §10.4 — نفس موضعها في قائمة العملاء المحتملين
				id: "sla",
				header: "الاستجابة",
				cell: ({ row }) => (
					<SlaBadge
						responseBy={row.original.responseBy}
						firstRespondedAt={row.original.firstRespondedAt}
					/>
				),
			},
			{
				accessorKey: "ownerUser",
				header: "المسؤول",
				cell: ({ row }) => (
					<span className="text-sm">{row.original.ownerUser?.name ?? "غير مُسنَد"}</span>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 20 } },
	});

	return (
		<TableDataView
			table={table}
			columns={columns}
			isPending={isLoading}
			emptyState={{
				title: "لا توجد صفقات بعد",
				description: "تُنشأ الصفقة بتحويل عميل محتمل، أو مباشرةً من زرّ «صفقة»",
				...(onOpenCreate ? { action: { label: "صفقة", onClick: onOpenCreate } } : {}),
			}}
		/>
	);
};
