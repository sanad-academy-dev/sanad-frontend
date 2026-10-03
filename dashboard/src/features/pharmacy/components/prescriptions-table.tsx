import { IconPill } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type React from "react";
import { useMemo } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import type { PrescriptionStatus } from "@/generated/prisma/enums";
import type { PrescriptionListResponse } from "@/server/pharmacy/prescriptions.type";

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
	DRAFT: "مسوّدة",
	ACTIVE: "صادرة",
	COMPLETED: "مكتملة",
	CANCELLED: "ملغاة",
};

/** نبرة الحالة — ما ينتظر فعلًا يُبرز، والنهائي يهدأ (نفس منطق جدول التجميل) */
const STATUS_TONE = (status: PrescriptionStatus) => {
	if (status === "ACTIVE") return "default" as const;
	if (status === "CANCELLED") return "destructive" as const;
	if (status === "COMPLETED") return "secondary" as const;
	return "outline" as const;
};

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const timeFmt = new Intl.DateTimeFormat("ar", { hour: "2-digit", minute: "2-digit" });

export function PrescriptionsTable({
	rows,
	isLoading,
	search,
	onSearchChange,
	onOpen,
	actions,
	emptyState,
}: {
	rows: PrescriptionListResponse[];
	isLoading: boolean;
	search: string;
	onSearchChange: (value: string) => void;
	onOpen: (id: string) => void;
	/** إجراءات شريط الأدوات — البيع على الكاونتر يعيش هنا لا في جسم الصفحة */
	actions?: React.ReactNode;
	/**
	 * الحالة الفارغة تُمرَّر من الصفحة لا تُثبَّت هنا: «لا وصفات في الطابور» بينما
	 * تنتظر مسوّداتٌ الإصدار سؤالٌ بلا جواب، والصفحة وحدها تعرف عددها.
	 */
	emptyState?: { title: string; description: string };
}) {
	const columns = useMemo<ColumnDef<PrescriptionListResponse>[]>(
		() => [
			{
				accessorKey: "code",
				header: "الوصفة",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-medium">{row.original.patient?.name ?? "—"}</span>
						<span className="truncate text-muted-foreground text-xs tabular-nums">
							{row.original.code}
						</span>
					</div>
				),
			},
			{
				id: "prescriber",
				header: "المدرّب الواصف",
				cell: ({ row }) => (
					<span className="truncate">{row.original.prescriber?.name ?? "—"}</span>
				),
			},
			{
				id: "items",
				header: "البنود",
				cell: ({ row }) => <span className="tabular-nums">{row.original._count.items}</span>,
			},
			{
				accessorKey: "status",
				header: "الحالة",
				cell: ({ row }) => (
					<Badge variant={STATUS_TONE(row.original.status)}>
						{PRESCRIPTION_STATUS_LABELS[row.original.status]}
					</Badge>
				),
			},
			{
				accessorKey: "issuedAt",
				header: "التاريخ",
				cell: ({ row }) => {
					// الصادرة تُؤرَّخ بإصدارها، والمسوّدة بإنشائها — عمود واحد لا عمودان
					// فارغان بالتناوب
					const at = row.original.issuedAt ?? row.original.createdAt;
					return (
						<div className="flex min-w-0 flex-col tabular-nums">
							<span>{dateFmt.format(new Date(at))}</span>
							<span className="text-muted-foreground text-xs">
								{timeFmt.format(new Date(at))}
							</span>
						</div>
					);
				},
			},
		],
		[],
	);

	const table = useReactTable({
		data: rows,
		columns,
		state: { globalFilter: search },
		onGlobalFilterChange: (updater) =>
			onSearchChange(typeof updater === "function" ? updater(search) : String(updater)),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<TableToolbar
				className="border-t"
				searchValue={search}
				onSearchChange={onSearchChange}
				searchPlaceholder="ابحث برمز الوصفة أو اسم الطفل"
				actions={actions}
			/>
			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				onRowClick={(row) => onOpen(row.original.id)}
				emptyState={{
					title: emptyState?.title ?? "لا وصفات في هذا التبويب",
					description:
						emptyState?.description ??
						"الوصفات تُكتب من داخل الفحص السريري — الخطوة الرابعة «الخطة العلاجية»، حيث الوزن والنوع معروفان فتُحسب الجرعة.",
					icon: <IconPill className="size-10 text-muted-foreground/60" />,
				}}
			/>
		</div>
	);
}
