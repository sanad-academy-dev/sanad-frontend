import { IconDownload, IconFileImport, IconPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountImportDialog } from "@/features/accounting/chart-of-accounts/components/account-import-dialog";
import { AccountSheet } from "@/features/accounting/chart-of-accounts/components/account-sheet";
import { AccountTree } from "@/features/accounting/chart-of-accounts/components/account-tree";
import { buildAccountTree } from "@/features/accounting/chart-of-accounts/data/build-account-tree";
import {
	useAccountActions,
	useAccountImport,
	useAccounts,
} from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import { downloadCsv } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { LedgerAccountResponse } from "@/server/accounting/account/account.type";

/**
 * [P1.2] Chart of Accounts tree screen (CONTRACT gap G1), standard list-screen anatomy:
 * Stats bar → TableToolbar (search filters the tree and expands to reveal matches; export
 * writes the P1.3 import-format CSV so it round-trips) → tree body → standard side Sheet
 * for create/edit → standard confirm dialog for delete.
 */

/** Export the current chart in the P1.3 import format — the same columns the importer reads. */
function exportChartCsv(accounts: LedgerAccountResponse[]) {
	const numberOf = new Map(accounts.map((a) => [a.id, a.accountNumber ?? ""]));
	downloadCsv(
		"chart-of-accounts",
		[
			"Account Name",
			"Parent Account",
			"Account Number",
			"Is Group",
			"Account Type",
			"Root Type",
			"Currency",
		],
		accounts.map((a) => [
			a.accountName,
			a.parentAccountId ? (numberOf.get(a.parentAccountId) ?? "") : "",
			a.accountNumber ?? "",
			a.isGroup ? "Yes" : "No",
			a.accountType ?? "",
			a.rootType,
			a.accountCurrencyCode,
		]),
	);
}

export const ChartOfAccountsPage = () => {
	const { accounts, isLoading } = useAccounts();
	const { setDisabled, remove } = useAccountActions();
	const { applyStandard } = useAccountImport();

	const [search, setSearch] = useState("");
	const [expanded, setExpanded] = useState<Set<string>>(new Set());
	const [sheetOpen, setSheetOpen] = useState(false);
	const [importOpen, setImportOpen] = useState(false);
	const [editing, setEditing] = useState<LedgerAccountResponse | null>(null);
	const [parent, setParent] = useState<LedgerAccountResponse | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<LedgerAccountResponse | null>(null);

	// expand all groups the first time the chart loads
	useEffect(() => {
		if (accounts.length > 0 && expanded.size === 0) {
			setExpanded(new Set(accounts.filter((a) => a.isGroup).map((a) => a.id)));
		}
	}, [accounts, expanded.size]);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "إجمالي الحسابات",
				value: accounts.length,
				tooltip: "العدد الكلي لحسابات دليل الحسابات في هذه المنشأة.",
			},
			{
				title: "مجموعات",
				value: accounts.filter((a) => a.isGroup).length,
				tooltip: "حسابات المجموعات — تنظيمية فقط ولا تقبل الترحيل.",
			},
			{
				title: "حسابات فرعية",
				value: accounts.filter((a) => !a.isGroup).length,
				tooltip: "الحسابات الورقية القابلة للترحيل.",
			},
			{
				title: "معطّلة",
				value: accounts.filter((a) => a.disabled).length,
				tooltip: "حسابات معطّلة لا تظهر في القوائم ولا تقبل قيودًا جديدة.",
			},
		],
		[accounts],
	);

	// search prunes the tree to matches + their ancestors, and force-expands the chain so
	// every match is revealed in place (no flat fallback list)
	const { roots, effectiveExpanded } = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return { roots: buildAccountTree(accounts), effectiveExpanded: expanded };

		const byId = new Map(accounts.map((a) => [a.id, a]));
		const keep = new Set<string>();
		for (const a of accounts) {
			const matches =
				a.accountName.toLowerCase().includes(q) ||
				(a.accountNumber ?? "").toLowerCase().includes(q);
			if (!matches) continue;
			let current: LedgerAccountResponse | undefined = a;
			while (current && !keep.has(current.id)) {
				keep.add(current.id);
				current = current.parentAccountId ? byId.get(current.parentAccountId) : undefined;
			}
		}
		const subset = accounts.filter((a) => keep.has(a.id));
		return {
			roots: buildAccountTree(subset),
			effectiveExpanded: new Set(subset.filter((a) => a.isGroup).map((a) => a.id)),
		};
	}, [search, accounts, expanded]);

	const openCreateRoot = () => {
		setEditing(null);
		setParent(null);
		setSheetOpen(true);
	};

	const handlers = {
		expanded: effectiveExpanded,
		onToggle: (id: string) =>
			setExpanded((prev) => {
				const next = new Set(prev);
				next.has(id) ? next.delete(id) : next.add(id);
				return next;
			}),
		onAddChild: (p: LedgerAccountResponse) => {
			setEditing(null);
			setParent(p);
			setSheetOpen(true);
		},
		onEdit: (a: LedgerAccountResponse) => {
			setParent(null);
			setEditing(a);
			setSheetOpen(true);
		},
		onToggleDisabled: (a: LedgerAccountResponse) => setDisabled(a.id, !a.disabled),
		onDelete: (a: LedgerAccountResponse) => setDeleteTarget(a),
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="text-lg font-medium">شجرة الحسابات</h1>
				<p className="text-sm text-muted-foreground">
					دليل الحسابات المحاسبي للشركة ({accounts.length} حساب)
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث بالاسم أو الرقم..."
				searchValue={search}
				onSearchChange={setSearch}
				buttonSize="xs"
				showExport={false}
				leftExtra={
					<Button
						type="button"
						variant="outline"
						size="xs"
						onClick={() => exportChartCsv(accounts)}
						disabled={accounts.length === 0}
						className="gap-1.5 px-2"
					>
						<IconDownload className="size-3.5" />
						تصدير
					</Button>
				}
				actions={
					<>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setImportOpen(true)}
						>
							<IconFileImport className="size-4" /> استيراد
						</Button>
						<Button
							size="sm"
							onClick={openCreateRoot}
						>
							<IconPlus className="size-4" /> حساب رئيسي جديد
						</Button>
					</>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{isLoading ? (
					<div className="space-y-2 p-3">
						{Array.from({ length: 8 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
							<Skeleton
								key={i}
								className="h-8 w-full"
							/>
						))}
					</div>
				) : accounts.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
						<p className="text-sm text-muted-foreground">لا توجد حسابات بعد.</p>
						<div className="flex items-center gap-2">
							<Button
								onClick={() => applyStandard()}
								variant="outline"
							>
								تطبيق الشجرة القياسية
							</Button>
							<Button onClick={openCreateRoot}>
								<IconPlus className="size-4" /> أنشئ أول حساب
							</Button>
						</div>
					</div>
				) : roots.length === 0 ? (
					<div className="p-6 text-center text-sm text-muted-foreground">لا نتائج</div>
				) : (
					<AccountTree
						roots={roots}
						handlers={handlers}
					/>
				)}
			</div>

			<AccountSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				editing={editing}
				parent={parent}
			/>

			<AccountImportDialog
				open={importOpen}
				onOpenChange={setImportOpen}
			/>

			<AccountingConfirmDialog
				open={!!deleteTarget}
				onOpenChange={(o) => {
					if (!o) setDeleteTarget(null);
				}}
				title="حذف الحساب"
				description={`هل تريد حذف «${deleteTarget?.accountName ?? ""}»؟ لا يمكن حذف حساب له حسابات فرعية.`}
				onConfirm={() => {
					if (deleteTarget) remove(deleteTarget.id);
					setDeleteTarget(null);
				}}
			/>
		</div>
	);
};
