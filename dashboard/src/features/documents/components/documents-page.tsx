import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { ToggleChip } from "@/components/common/toggle-chip";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { DeleteDocumentDialog } from "@/features/documents/components/delete-document-dialog";
import { DocumentSheet } from "@/features/documents/components/document-sheet";
import { DocumentsTable } from "@/features/documents/components/documents-table";
import { DOCUMENT_CATEGORIES } from "@/features/documents/data/categories";
import { useClinicDocuments } from "@/features/documents/hooks/use-clinic-documents";
import { useClinicDocumentsSummary } from "@/features/documents/hooks/use-clinic-documents-summary";
import { useDeleteClinicDocument } from "@/features/documents/hooks/use-delete-clinic-document";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useI18n } from "@/hooks/use-i18n";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import type {
	ClinicDocumentCategory,
	ClinicDocumentResponse,
	ExpiryFilter,
} from "@/server/clinic-documents/clinic-documents.type";

// Radix يحجز "" لمسح الاختيار، فلا يصلح قيمةً لعنصر — سنتينل صريح لـ«كل الفروع»
const ALL_BRANCHES = "__all__";

const EXPIRY_OPTIONS: ExpiryFilter[] = ["all", "expiring", "expired", "valid"];

export function DocumentsPage() {
	const { t, isRtl } = useI18n();
	const { hasPermission, isAdmin } = usePermissions();
	const { branches } = useBranches();

	const [search, setSearch] = useState("");
	const [category, setCategory] = useState<ClinicDocumentCategory | "all">("all");
	const [branchId, setBranchId] = useState<string>(ALL_BRANCHES);
	const [expiry, setExpiry] = useState<ExpiryFilter>("all");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editing, setEditing] = useState<ClinicDocumentResponse | null>(null);
	const [deleting, setDeleting] = useState<ClinicDocumentResponse | null>(null);

	// البحث يمرّ على الخادم — بلا تأخير كانت كل ضغطة مفتاح طلبًا
	const debouncedSearch = useDebouncedValue(search, 300);

	const { documents, isLoading } = useClinicDocuments({
		...(category !== "all" ? { category } : {}),
		...(branchId !== ALL_BRANCHES ? { branchId } : {}),
		...(expiry !== "all" ? { expiry } : {}),
		...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
	});
	const { summary } = useClinicDocumentsSummary();
	const { deleteDocument, isPending: isDeleting } = useDeleteClinicDocument();

	const canCreate = isAdmin || hasPermission(PERMISSIONS.DOCUMENTS_CREATE);
	const canEdit = isAdmin || hasPermission(PERMISSIONS.DOCUMENTS_EDIT);
	const canDelete = isAdmin || hasPermission(PERMISSIONS.DOCUMENTS_DELETE);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: t("documents.stats.total"),
				value: summary?.total ?? 0,
				tooltip: t("documents.stats.totalTooltip"),
			},
			{
				title: t("documents.stats.expiring"),
				value: summary?.expiring ?? 0,
				tooltip: t("documents.stats.expiringTooltip"),
			},
			{
				title: t("documents.stats.expired"),
				value: summary?.expired ?? 0,
				tooltip: t("documents.stats.expiredTooltip"),
			},
			{
				title: t("documents.stats.addedThisMonth"),
				value: summary?.addedThisMonth ?? 0,
				tooltip: t("documents.stats.addedThisMonthTooltip"),
			},
		],
		[summary, t],
	);

	const openAdd = () => {
		setEditing(null);
		setSheetOpen(true);
	};

	const openEdit = (document: ClinicDocumentResponse) => {
		setEditing(document);
		setSheetOpen(true);
	};

	const confirmDelete = async () => {
		if (!deleting) return;
		await deleteDocument(deleting.id);
		setDeleting(null);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<Stats
				className="gap-3 px-3 py-3"
				variant="compact"
				stats={stats}
			/>

			<TableToolbar
				className="border-y"
				buttonSize="xs"
				searchValue={search}
				onSearchChange={setSearch}
				searchPlaceholder={t("documents.list.searchPlaceholder")}
				leftExtra={
					<div className="flex flex-wrap items-center gap-1">
						<ToggleChip
							active={category === "all"}
							onClick={() => setCategory("all")}
							className="h-6 px-2.5"
						>
							{t("documents.categories.all")}
						</ToggleChip>
						{DOCUMENT_CATEGORIES.map((entry) => (
							<ToggleChip
								key={entry.id}
								active={category === entry.id}
								onClick={() => setCategory(entry.id)}
								className="h-6 px-2.5"
							>
								{t(entry.labelKey)}
							</ToggleChip>
						))}
					</div>
				}
				actions={
					<div className="flex items-center gap-2">
						<Select
							value={expiry}
							onValueChange={(value) => setExpiry(value as ExpiryFilter)}
						>
							<SelectTrigger className="h-6 w-32 text-xs">
								<SelectValue />
							</SelectTrigger>
							{/* popper إلزامي — الوضع الافتراضي يخرج خارج الشاشة في RTL */}
							<SelectContent
								position="popper"
								dir={isRtl ? "rtl" : "ltr"}
							>
								{EXPIRY_OPTIONS.map((option) => (
									<SelectItem
										key={option}
										value={option}
									>
										{t(`documents.expiry.${option}`)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{branches.length > 0 && (
							<Select
								value={branchId}
								onValueChange={setBranchId}
							>
								<SelectTrigger className="h-6 w-32 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent
									position="popper"
									dir={isRtl ? "rtl" : "ltr"}
								>
									<SelectItem value={ALL_BRANCHES}>
										{t("documents.table.allBranches")}
									</SelectItem>
									{branches.map((branch) => (
										<SelectItem
											key={branch.id}
											value={branch.id}
										>
											{branch.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}

						{canCreate && (
							<Button
								type="button"
								size="xs"
								className="gap-1.5"
								onClick={openAdd}
							>
								<IconPlus className="size-3.5" />
								{t("documents.list.add")}
							</Button>
						)}
					</div>
				}
			/>

			<div className="min-h-0 flex-1 overflow-y-auto py-3">
				<DocumentsTable
					documents={documents}
					isLoading={isLoading}
					canEdit={canEdit}
					canDelete={canDelete}
					canCreate={canCreate}
					onEdit={openEdit}
					onDelete={setDeleting}
					onAdd={openAdd}
				/>
			</div>

			<DocumentSheet
				open={sheetOpen}
				document={editing}
				onClose={() => {
					setSheetOpen(false);
					setEditing(null);
				}}
			/>

			<DeleteDocumentDialog
				document={deleting}
				onOpenChange={(open) => {
					if (!open) setDeleting(null);
				}}
				onConfirm={confirmDelete}
				isDeleting={isDeleting}
			/>
		</div>
	);
}
