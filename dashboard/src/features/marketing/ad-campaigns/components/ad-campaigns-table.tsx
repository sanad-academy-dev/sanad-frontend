import { IconDots, IconSpeakerphone, IconTrash } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlatformBadge } from "@/features/marketing/ad-campaigns/components/platform-badge";
import { StatusCell } from "@/features/marketing/ad-campaigns/components/status-cell";
import type { AdCampaignStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import type { AdCampaignListItem } from "@/server/ad-campaigns/ad-campaigns.type";

const numberFormatter = new Intl.NumberFormat("en-US");

export function AdCampaignsTable({
	campaigns,
	isLoading,
	canEdit,
	canDelete,
	onStatusChange,
	onDelete,
	onOpenDetail,
	emptyAction,
}: {
	campaigns: AdCampaignListItem[];
	isLoading: boolean;
	canEdit: boolean;
	canDelete: boolean;
	onStatusChange: (id: string, status: AdCampaignStatus) => void;
	onDelete: (campaign: AdCampaignListItem) => void;
	onOpenDetail: (campaign: AdCampaignListItem) => void;
	emptyAction?: { label: string; onClick: () => void };
}) {
	const { isRtl } = useI18n();

	const columns = useMemo<ColumnDef<AdCampaignListItem>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={table.getIsAllPageRowsSelected()}
						onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
						aria-label="تحديد الكل"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="تحديد الحملة"
					/>
				),
				enableSorting: false,
			},
			{
				accessorKey: "name",
				header: "اسم الحملة الاعلانية",
				cell: ({ row }) => <span className="font-medium text-sm">{row.original.name}</span>,
			},
			{
				accessorKey: "platform",
				header: "المكان",
				cell: ({ row }) => <PlatformBadge platform={row.original.platform} />,
			},
			{
				accessorKey: "impressions",
				header: "عدد الظهور",
				cell: ({ row }) => numberFormatter.format(row.original.impressions),
			},
			{
				accessorKey: "engagements",
				header: "التفاعل",
				cell: ({ row }) => numberFormatter.format(row.original.engagements),
			},
			{
				accessorKey: "reach",
				header: "الوصول",
				cell: ({ row }) => numberFormatter.format(row.original.reach),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				cell: ({ row }) => (
					<StatusCell
						status={row.original.status}
						canEdit={canEdit}
						onChange={(status) => onStatusChange(row.original.id, status)}
					/>
				),
			},
			{
				accessorKey: "durationDays",
				header: "المدة",
				// الفجوة G1: لا حقول جدولة في التصميم بعد، فلا مصدر لهذه القيمة. شرطة
				// صريحة أصدق من «0 يوم» — الصفر رقمٌ يُصدَّق، والشرطة تقول «غير محدَّد».
				cell: ({ row }) =>
					row.original.durationDays ? (
						`${row.original.durationDays} يوم`
					) : (
						<span className="text-muted-foreground">—</span>
					),
			},
			{
				accessorKey: "createdAt",
				header: "التاريخ",
				cell: ({ row }) => (
					<span dir="ltr">{format(new Date(row.original.createdAt), "yyyy/MM/dd")}</span>
				),
			},
			{
				id: "actions",
				header: "الإجراءات",
				enableSorting: false,
				cell: ({ row }) => {
					// الفجوة G5: قائمة الصفّ غير مرسومة. نعرض ما نملك له سلوكًا حقيقيًّا
					// فقط (الحذف)؛ اختراع «تكرار/عرض» بلا تصميم يخلق وعودًا لا تُنجَز.
					if (!canDelete) return null;
					return (
						<DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="size-7"
									aria-label="إجراءات الحملة"
								>
									<IconDots className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									variant="destructive"
									onSelect={() => onDelete(row.original)}
								>
									<IconTrash className="size-4" />
									حذف الحملة
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[canEdit, canDelete, onStatusChange, onDelete, isRtl],
	);

	const table = useReactTable({
		data: campaigns,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<TableDataView
			table={table}
			columns={columns}
			isPending={isLoading}
			onRowClick={(row) => onOpenDetail(row.original)}
			emptyState={{
				title: "لا توجد حملات اعلانية بعد",
				description: "أنشئ حملتك الأولى لتصل إلى أصحاب الأطفال في منطقتك.",
				icon: <IconSpeakerphone className="size-6 text-muted-foreground" />,
				...(emptyAction ? { action: emptyAction } : {}),
			}}
		/>
	);
}
