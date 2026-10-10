import {
	IconDownload,
	IconFolder,
	IconPencil,
	IconPlaylistAdd,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import { CostCenterSheet } from "@/features/accounting/cost-centers/components/cost-center-sheet";
import {
	useCostCenterActions,
	useCostCenters,
} from "@/features/accounting/cost-centers/hooks/use-cost-centers";
import { downloadCsv } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { CostCenterResponse } from "@/server/accounting/cost-center/cost-center.type";

/** [P1.5] Cost Center tree (BRD §4.4), standard list-screen anatomy: Stats → TableToolbar
 * (search keeps matches + their ancestors visible) → indented tree body → standard side
 * Sheet for add/edit → standard confirm dialog for delete. */
export const CostCentersPage = () => {
	const { costCenters, isLoading } = useCostCenters();
	const { remove, isDeleting } = useCostCenterActions();

	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editing, setEditing] = useState<CostCenterResponse | null>(null);
	const [parent, setParent] = useState<CostCenterResponse | null>(null);
	const [deleting, setDeleting] = useState<CostCenterResponse | null>(null);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "إجمالي المراكز",
				value: costCenters.length,
				tooltip: "العدد الكلي لمراكز التكلفة في هذه المنشأة.",
			},
			{
				title: "مجموعات",
				value: costCenters.filter((c) => c.isGroup).length,
				tooltip: "مراكز تنظيمية تحتوي مراكز فرعية ولا تُستخدم على القيود مباشرة.",
			},
			{
				title: "فرعية",
				value: costCenters.filter((c) => !c.isGroup).length,
				tooltip: "المراكز الورقية التي تُسند إليها الحركات والتوزيعات.",
			},
			{
				title: "معطّلة",
				value: costCenters.filter((c) => c.disabled).length,
				tooltip: "مراكز معطّلة لا تظهر في القوائم.",
			},
		],
		[costCenters],
	);

	// search keeps matches + their ancestor chain so results stay in tree context
	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return costCenters;
		const byId = new Map(costCenters.map((c) => [c.id, c]));
		const keep = new Set<string>();
		for (const c of costCenters) {
			const matches =
				c.costCenterName.toLowerCase().includes(q) ||
				(c.costCenterNumber ?? "").toLowerCase().includes(q);
			if (!matches) continue;
			let current: CostCenterResponse | undefined = c;
			while (current && !keep.has(current.id)) {
				keep.add(current.id);
				current = current.parentCostCenterId
					? byId.get(current.parentCostCenterId)
					: undefined;
			}
		}
		return costCenters.filter((c) => keep.has(c.id));
	}, [search, costCenters]);

	// depth per node from the parent chain (list is ordered by lft, parents first)
	const depths = useMemo(() => {
		const parentOf = new Map(costCenters.map((c) => [c.id, c.parentCostCenterId]));
		const memo = new Map<string, number>();
		const depth = (id: string): number => {
			const p = parentOf.get(id) ?? null;
			if (!p) return 0;
			const cached = memo.get(id);
			if (cached !== undefined) return cached;
			const d = depth(p) + 1;
			memo.set(id, d);
			return d;
		};
		return new Map(costCenters.map((c) => [c.id, depth(c.id)]));
	}, [costCenters]);

	const exportCsv = () =>
		downloadCsv(
			"cost-centers",
			["الاسم", "الرقم", "مجموعة", "الحالة"],
			visible.map((c) => [
				c.costCenterName,
				c.costCenterNumber ?? "",
				c.isGroup ? "نعم" : "لا",
				c.disabled ? "معطّل" : "فعّال",
			]),
		);

	const openCreate = (p: CostCenterResponse | null) => {
		setEditing(null);
		setParent(p);
		setSheetOpen(true);
	};
	const openEdit = (cc: CostCenterResponse) => {
		setEditing(cc);
		setParent(null);
		setSheetOpen(true);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="text-lg font-medium">مراكز التكلفة</h1>
				<p className="text-sm text-muted-foreground">
					الفروع والأقسام كأبعاد تحليلية على القيود ({costCenters.length}).
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
						onClick={exportCsv}
						disabled={visible.length === 0}
						className="gap-1.5 px-2"
					>
						<IconDownload className="size-3.5" />
						تصدير
					</Button>
				}
				actions={
					<Button
						size="sm"
						onClick={() => openCreate(null)}
					>
						<IconPlus className="size-4" /> مركز تكلفة جديد
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{!isLoading && visible.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
						{search ? "لا نتائج" : "لا توجد مراكز تكلفة بعد."}
					</div>
				) : (
					visible.map((cc) => (
						<div
							key={cc.id}
							className="flex items-center gap-2 border-b py-2 pe-2"
							style={{ paddingInlineStart: (depths.get(cc.id) ?? 0) * 20 + 8 }}
						>
							{cc.isGroup ? (
								<IconFolder className="size-4 shrink-0 text-primary" />
							) : (
								<span className="size-4 shrink-0" />
							)}
							{cc.costCenterNumber && (
								<span
									dir="ltr"
									className="font-mono text-xs text-muted-foreground"
								>
									{cc.costCenterNumber}
								</span>
							)}
							<span className={cc.isGroup ? "text-sm font-medium" : "text-sm"}>
								{cc.costCenterName}
							</span>
							{cc.disabled && (
								<Badge
									variant="destructive"
									className="text-[10px]"
								>
									معطّل
								</Badge>
							)}
							<div className="ms-auto flex items-center gap-1">
								{cc.isGroup && (
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label="إضافة مركز فرعي"
										onClick={() => openCreate(cc)}
									>
										<IconPlaylistAdd className="size-4" />
									</Button>
								)}
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="تعديل"
									onClick={() => openEdit(cc)}
								>
									<IconPencil className="size-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="حذف"
									onClick={() => setDeleting(cc)}
								>
									<IconTrash className="size-4" />
								</Button>
							</div>
						</div>
					))
				)}
			</div>

			<CostCenterSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				editing={editing}
				parent={parent}
			/>

			<AccountingConfirmDialog
				open={!!deleting}
				onOpenChange={(o) => {
					if (!o) setDeleting(null);
				}}
				title="حذف مركز التكلفة"
				description={`سيتم حذف «${deleting?.costCenterName ?? ""}» نهائيًا. لا يمكن حذف مركز له فروع.`}
				isPending={isDeleting}
				onConfirm={() => {
					if (deleting) remove(deleting.id);
					setDeleting(null);
				}}
			/>
		</div>
	);
};
