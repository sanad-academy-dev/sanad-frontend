import {
	IconDots,
	IconDownload,
	IconExternalLink,
	IconFileDescription,
	IconLink,
	IconPencil,
	IconTrash,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { useMemo } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatFileSize } from "@/features/dashboard/utils/file";
import { ExpiryBadge } from "@/features/documents/components/expiry-badge";
import { categoryMeta } from "@/features/documents/data/categories";
import { useI18n } from "@/hooks/use-i18n";
import { getFileUrl } from "@/lib/file-url";
import type { ClinicDocumentResponse } from "@/server/clinic-documents/clinic-documents.type";

export function DocumentsTable({
	documents,
	isLoading,
	canEdit,
	canDelete,
	canCreate,
	onEdit,
	onDelete,
	onAdd,
}: {
	documents: ClinicDocumentResponse[];
	isLoading: boolean;
	canEdit: boolean;
	canDelete: boolean;
	canCreate: boolean;
	onEdit: (document: ClinicDocumentResponse) => void;
	onDelete: (document: ClinicDocumentResponse) => void;
	onAdd: () => void;
}) {
	const { t, isRtl } = useI18n();
	const dateLocale = isRtl ? arSA : enUS;

	const columns = useMemo<ColumnDef<ClinicDocumentResponse>[]>(
		() => [
			{
				accessorKey: "title",
				header: t("documents.table.document"),
				cell: ({ row }) => {
					const doc = row.original;
					const Icon = doc.kind === "LINK" ? IconLink : IconFileDescription;
					return (
						<div className="flex items-center gap-2">
							<Icon className="size-4 shrink-0 text-muted-foreground" />
							<div className="flex min-w-0 flex-col">
								<a
									href={getFileUrl(doc.url) ?? doc.url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1.5 font-medium text-sm hover:underline"
								>
									<span className="truncate">{doc.title}</span>
									<IconExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
								</a>
								{doc.description && (
									<span className="truncate text-muted-foreground text-xs">
										{doc.description}
									</span>
								)}
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "category",
				header: t("documents.table.category"),
				cell: ({ row }) => {
					const meta = categoryMeta(row.original.category);
					return (
						<div className="flex items-center gap-1.5">
							<meta.icon className="size-3.5 text-muted-foreground" />
							<span className="text-sm">{t(meta.labelKey)}</span>
						</div>
					);
				},
			},
			{
				id: "branch",
				header: t("documents.table.branch"),
				cell: ({ row }) => (
					<span className="text-sm">
						{row.original.branch?.name ?? t("documents.table.allBranches")}
					</span>
				),
			},
			{
				accessorKey: "expiresAt",
				header: t("documents.table.expiresAt"),
				cell: ({ row }) => <ExpiryBadge expiresAt={row.original.expiresAt} />,
			},
			{
				accessorKey: "sizeBytes",
				header: t("documents.table.size"),
				cell: ({ row }) => (
					<span className="text-muted-foreground text-xs tabular-nums">
						{row.original.sizeBytes ? formatFileSize(row.original.sizeBytes) : "—"}
					</span>
				),
			},
			{
				id: "author",
				header: t("documents.table.author"),
				cell: ({ row }) => (
					<div className="flex flex-col">
						<span className="text-sm">{row.original.author?.name ?? "—"}</span>
						<span className="text-muted-foreground text-xs tabular-nums">
							{format(new Date(row.original.createdAt), "d MMM yyyy", {
								locale: dateLocale,
							})}
						</span>
					</div>
				),
			},
			{
				id: "actions",
				size: 56,
				header: "",
				cell: ({ row }) => {
					const doc = row.original;
					return (
						// محتوى Radix مُنقَل خارج الشجرة فلا يرث اتجاه الصفحة
						<DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="size-7"
									aria-label={t("documents.actions.options")}
								>
									<IconDots className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuItem asChild>
									<a
										href={getFileUrl(doc.url) ?? doc.url}
										target="_blank"
										rel="noopener noreferrer"
										className="gap-2"
									>
										<IconDownload className="size-4" />
										{doc.kind === "LINK"
											? t("documents.actions.openLink")
											: t("documents.actions.download")}
									</a>
								</DropdownMenuItem>

								{canEdit && (
									<DropdownMenuItem
										className="gap-2"
										onSelect={() => onEdit(doc)}
									>
										<IconPencil className="size-4" />
										{t("documents.actions.edit")}
									</DropdownMenuItem>
								)}

								{canDelete && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="gap-2 text-destructive"
											onSelect={() => onDelete(doc)}
										>
											<IconTrash className="size-4" />
											{t("documents.actions.delete")}
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[t, isRtl, dateLocale, canEdit, canDelete, onEdit, onDelete],
	);

	const table = useReactTable({
		data: documents,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 15 } },
	});

	return (
		<TableDataView
			table={table}
			columns={columns}
			isPending={isLoading}
			keepHeaderOnEmpty
			tableContainerClassName="px-3"
			emptyState={{
				title: t("documents.list.emptyTitle"),
				description: t("documents.list.emptyDescription"),
				icon: <IconFileDescription className="size-6 text-muted-foreground" />,
				...(canCreate ? { action: { label: t("documents.list.add"), onClick: onAdd } } : {}),
			}}
		/>
	);
}
