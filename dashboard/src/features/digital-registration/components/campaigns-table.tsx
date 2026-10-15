import {
	IconCheck,
	IconClock,
	IconFileDescription,
	IconDots,
	IconEye,
	IconEdit,
	IconTrash,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { TableDataView } from "@/components/common/table-data-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Campaign } from "../types/campaign.types";
import { AddCampaignSheet } from "./add-campaign-sheet";
import { useDeleteCampaign } from "../hooks/use-digital-registration";

interface CampaignsTableProps {
	data: Campaign[];
	globalFilter?: string;
	onGlobalFilterChange?: (val: string) => void;
	statusFilter?: string;
}

const columnHelper = createColumnHelper<Campaign>();

export function CampaignsTable({
	data,
	globalFilter = "",
	onGlobalFilterChange,
	statusFilter = "ALL",
}: CampaignsTableProps) {
	const [rowSelection, setRowSelection] = useState({});
	const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
	const navigate = useNavigate({ from: "/digital-registration" });
	const deleteMutation = useDeleteCampaign();

	const filteredData = useMemo(() => {
		if (!statusFilter || statusFilter === "ALL") return data;
		return data.filter((c) => c.status === statusFilter);
	}, [data, statusFilter]);

	// إضافة النوع بشكل صريح هنا لتفادي أي تعارض في الأنواع
	const columns = useMemo<ColumnDef<Campaign, any>[]>(
		() => [
			columnHelper.display({
				id: "select",
				size: 50,
				header: ({ table }) => (
					<div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
						<Checkbox
							checked={
								table.getIsAllPageRowsSelected() ||
								(table.getIsSomePageRowsSelected() && "indeterminate")
							}
							onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
							aria-label="تحديد الكل"
							className="translate-y-0.5"
						/>
					</div>
				),
				cell: ({ row }) => (
					<div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
						<Checkbox
							checked={row.getIsSelected()}
							onCheckedChange={(value) => row.toggleSelected(!!value)}
							aria-label="تحديد الصف"
							className="translate-y-0.5"
						/>
					</div>
				),
				enableSorting: false,
				enableHiding: false,
			}),
			columnHelper.accessor("name", {
				header: "الحملة",
				size: 350,
				cell: (info) => {
					const c = info.row.original;
					return (
						<div className="flex items-center gap-3">
							<div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-primary/5 text-primary shadow-2xs">
								<IconFileDescription size={18} />
							</div>
							<div className="flex flex-col text-start gap-1">
								<span className="font-semibold text-foreground text-[14px] leading-tight">
									{info.getValue()}
								</span>
								<div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
									<span
										dir="ltr"
										className="font-mono text-[11px] font-medium px-1.5 py-0.5 rounded bg-muted/80 text-foreground/80 border border-border/50"
									>
										{c.code}
									</span>
									<span className="text-muted-foreground/40">•</span>
									<span className="font-medium">{c.ageGroup}</span>
									{c.targetClass && (
										<>
											<span className="text-muted-foreground/40">•</span>
											<span className="text-primary/90 font-medium">{c.targetClass}</span>
										</>
									)}
								</div>
							</div>
						</div>
					);
				},
			}),
			columnHelper.accessor("requests", {
				header: "الطلبات",
				size: 100,
				cell: (info) => <div className="font-medium text-[14px]">{info.getValue()}</div>,
			}),
			columnHelper.accessor("accepted", {
				header: "مقبول",
				size: 100,
				cell: (info) => <div className="text-emerald-600 font-semibold text-[14px]">{info.getValue()}</div>,
			}),
			columnHelper.accessor("pending", {
				header: "معلق",
				size: 100,
				cell: (info) => <div className="text-amber-500 font-semibold text-[14px]">{info.getValue()}</div>,
			}),
			columnHelper.accessor("capacity", {
				header: "السعة",
				size: 180,
				cell: (info) => {
					const val = info.getValue();
					const max = info.row.original.maxCapacity;
					const percentage = (val / max) * 100;
					return (
						<div className="flex items-center gap-3 w-full max-w-[150px]">
							<span className="text-[13px] text-muted-foreground w-10 text-start font-medium shrink-0">
								{val}/{max}
							</span>
							<Progress value={percentage} className="h-1.5 flex-1 bg-muted/50" />
						</div>
					);
				},
			}),
			columnHelper.accessor("status", {
				header: "الحالة",
				size: 120,
				cell: (info) => {
					const val = info.getValue();
					let badgeClass = "";
					let label = "";
					let icon = null;

					switch (val) {
						case "ACTIVE":
							badgeClass = "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100";
							label = "نشط";
							icon = <IconCheck size={14} className="me-1" />;
							break;
						case "COMPLETED":
							badgeClass = "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100";
							label = "مكتمل";
							icon = <IconCheck size={14} className="me-1" />;
							break;
						case "DRAFT":
							badgeClass = "bg-muted/50 text-muted-foreground hover:bg-muted/50 border-border";
							label = "مسودة";
							icon = <IconClock size={14} className="me-1" />;
							break;
						case "CLOSED":
							badgeClass = "bg-muted/50 text-muted-foreground hover:bg-muted/50 border-border";
							label = "مغلق";
							icon = <IconClock size={14} className="me-1" />;
							break;
					}

					return (
						<div className="flex justify-start">
							<Badge variant="outline" className={cn("px-2.5 py-0.5 text-xs font-medium", badgeClass)}>
								{icon}
								{label}
							</Badge>
						</div>
					);
				},
			}),
			columnHelper.accessor("startDate", {
				header: "تاريخ البدء",
				size: 130,
				cell: (info) => {
					const val = info.getValue();
					if (!val) {
						return <span className="text-xs text-muted-foreground/60 font-medium">—</span>;
					}
					try {
						const d = new Date(val);
						if (isNaN(d.getTime())) {
							return <span className="text-xs text-muted-foreground/60 font-medium">—</span>;
						}
						return (
							<div className="flex flex-col text-start">
								<span className="text-[13px] font-medium text-foreground tabular-nums">
									{new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
										year: "numeric",
										month: "short",
										day: "numeric",
									}).format(d)}
								</span>
								{info.row.original.endDate && (
									<span className="text-[11px] text-muted-foreground tabular-nums">
										إلى: {new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
											year: "numeric",
											month: "short",
											day: "numeric",
										}).format(new Date(info.row.original.endDate))}
									</span>
								)}
							</div>
						);
					} catch {
						return <span className="text-xs text-muted-foreground">{String(val)}</span>;
					}
				},
			}),
			columnHelper.display({
				id: "actions",
				size: 50,
				cell: ({ row }) => (
					<div onClick={(e) => e.stopPropagation()}>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">فتح القائمة</span>
									<IconDots className="h-4 w-4 text-muted-foreground" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-[160px]">
								<DropdownMenuItem
									onClick={() => {
										navigate({
											to: "/digital-registration/$campaignId",
											params: { campaignId: row.original.id },
										});
									}}
									className="cursor-pointer"
								>
									<IconEye className="me-2 h-4 w-4" />
									عرض التفاصيل
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() => setEditingCampaign(row.original)}
								>
									<IconEdit className="me-2 h-4 w-4" />
									تعديل
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
									onClick={() => {
										if (window.confirm(`هل أنت متأكد من حذف حملة «${row.original.name}»؟`)) {
											deleteMutation.mutate(row.original.id);
										}
									}}
								>
									<IconTrash className="me-2 h-4 w-4" />
									حذف
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
			}),
		],
		[navigate],
	);

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange,
		getRowId: (row) => row.id,
		enableRowSelection: true,
		state: {
			rowSelection,
			globalFilter,
		},
	});

	return (
		<>
			<TableDataView
				table={table}
				columns={columns}
				onRowClick={(row) => {
					navigate({
						to: "/digital-registration/$campaignId",
						params: { campaignId: row.original.id },
					});
				}}
			/>
			<AddCampaignSheet
				open={!!editingCampaign}
				onClose={() => setEditingCampaign(null)}
				campaign={editingCampaign}
			/>
		</>
	);
}
