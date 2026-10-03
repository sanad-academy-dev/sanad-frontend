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
import { LeadStatusPill } from "@/features/crm/components/lead-status-pill";
import { SlaBadge } from "@/features/crm/components/sla-badge";
import type { CrmLeadListResponse } from "@/server/crm/crm-leads/crm-leads.type";

/**
 * [CRM-P1] §11.2 — the list half of the leads screen. Filtering/sorting is server-driven.
 *
 * [UI] On the `/services/staff` contract: `TableDataView` brings the shared skeleton, empty
 * state and pagination. The status cell keeps `LeadStatusPill` rather than the reference's
 * dashed status Select — changing a lead's status is a behavioural path with its own rules
 * (a LOST needs a reason, CONVERTED is never set by hand), and visual symmetry is not worth
 * opening that path from a new place.
 */
export const LeadsTable = ({
	leads,
	isLoading,
	onOpenCreate,
}: {
	leads: CrmLeadListResponse[];
	isLoading: boolean;
	onOpenCreate?: () => void;
}) => {
	// useReactTable يشترط مرجعًا ثابتًا لـ data — مصفوفة جديدة كل رسم تُعيد ضبط الترقيم بلا نهاية
	const rows = useMemo(() => leads, [leads]);

	const columns = useMemo<ColumnDef<CrmLeadListResponse>[]>(
		() => [
			{
				accessorKey: "fullName",
				header: "الاسم",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<Link
							to="/crm/leads/$leadId"
							params={{ leadId: row.original.id }}
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
				// phone numbers are an LTR island inside the RTL page
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
				header: "الحالة",
				cell: ({ row }) => (
					<LeadStatusPill
						name={row.original.status.name}
						color={row.original.status.color}
					/>
				),
			},
			{
				// [CRM-P5] §10.4 — الشارة قبل المصدر: ما يحتاج تصرّفًا الآن يسبق ما يصف الأصل
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
				accessorKey: "source",
				header: "المصدر",
				cell: ({ row }) => <span className="text-sm">{row.original.source?.name ?? "—"}</span>,
			},
			{
				accessorKey: "ownerUser",
				header: "المسؤول",
				cell: ({ row }) => (
					<span className="text-sm">{row.original.ownerUser?.name ?? "غير مُسنَد"}</span>
				),
			},
			{
				accessorKey: "city",
				header: "المدينة",
				cell: ({ row }) => <span className="text-sm">{row.original.city ?? "—"}</span>,
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
				title: "لا يوجد عملاء محتملون بعد",
				description: "أضِف عميلًا محتملًا لتتابع مساره حتى التحويل إلى صفقة",
				...(onOpenCreate ? { action: { label: "عميل محتمل", onClick: onOpenCreate } } : {}),
			}}
		/>
	);
};
