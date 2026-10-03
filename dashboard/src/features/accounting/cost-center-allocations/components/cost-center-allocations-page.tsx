import {
	IconArrowsSplit,
	IconBan,
	IconDots,
	IconDownload,
	IconFileText,
	IconPencil,
	IconPlus,
	IconSend,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CostCenterAllocationSheet } from "@/features/accounting/cost-center-allocations/components/cost-center-allocation-sheet";
import {
	useCostCenterAllocationActions,
	useCostCenterAllocations,
} from "@/features/accounting/cost-center-allocations/hooks/use-cost-center-allocations";
import { docStatusAppearance } from "@/features/accounting/utils/accounting-status";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { DocStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import type { CostCenterAllocationResponse } from "@/server/accounting/cost-center-allocation/cost-center-allocation.type";

const STATUS_LABEL: Record<DocStatus, string> = {
	[DocStatus.DRAFT]: "مسودة",
	[DocStatus.SUBMITTED]: "مُرحّل",
	[DocStatus.CANCELLED]: "ملغى",
};

/**
 * [P1.6 UI] Cost Center Allocation (BRD §4.4), standard list-screen anatomy: Stats →
 * TableToolbar → list body → standard side Sheet (create + draft edit) → lifecycle actions
 * via the row menu. The GL-rewrite split engine lands in P2/P7.
 */
export const CostCenterAllocationsPage = () => {
	const { isRtl } = useI18n();
	const { allocations, isLoading } = useCostCenterAllocations();
	const { submit, cancel, amend, isPending } = useCostCenterAllocationActions();

	const [search, setSearch] = useState("");
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<CostCenterAllocationResponse | null>(null);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "إجمالي التوزيعات",
				value: allocations.length,
				tooltip: "العدد الكلي لمستندات توزيع مراكز التكلفة.",
			},
			{
				title: "مسودة",
				value: allocations.filter((a) => a.docstatus === DocStatus.DRAFT).length,
				tooltip: "توزيعات لم تُرحَّل بعد — لا أثر لها على المحرّك.",
			},
			{
				title: "مُرحّلة",
				value: allocations.filter((a) => a.docstatus === DocStatus.SUBMITTED).length,
				tooltip: "توزيعات نافذة يعتمدها محرّك الترحيل من تاريخ سريانها.",
			},
			{
				title: "ملغاة",
				value: allocations.filter((a) => a.docstatus === DocStatus.CANCELLED).length,
				tooltip: "توزيعات مُلغاة — يبقى رقمها وأثر تدقيقها.",
			},
		],
		[allocations],
	);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return allocations;
		return allocations.filter(
			(a) =>
				a.mainCostCenter.costCenterName.toLowerCase().includes(q) ||
				(a.documentNo ?? "").toLowerCase().includes(q),
		);
	}, [search, allocations]);

	const exportCsv = () =>
		downloadCsv(
			"cost-center-allocations",
			["رقم المستند", "المركز الرئيسي", "تاريخ السريان", "الحالة", "الصفوف"],
			visible.map((a) => [
				a.documentNo ?? "",
				a.mainCostCenter.costCenterName,
				isoDay(a.validFrom.toString()),
				STATUS_LABEL[a.docstatus],
				a.percentages
					.map((p) => `${p.costCenter.costCenterName} ${p.percentage.toString()}%`)
					.join(" | "),
			]),
		);

	const openCreate = () => {
		setEditing(null);
		setOpen(true);
	};
	const openEdit = (a: CostCenterAllocationResponse) => {
		setEditing(a);
		setOpen(true);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">توزيعات مراكز التكلفة</h1>
				<p className="text-muted-foreground text-sm">
					وزّع تكاليف مركز رئيسي على مراكز فرعية بنسب مجموعها 100٪ ({allocations.length}).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث بالمركز أو رقم المستند..."
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
						onClick={openCreate}
					>
						<IconPlus className="size-4" /> توزيع جديد
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{!isLoading && visible.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-muted-foreground text-sm">
						<IconArrowsSplit className="size-6" />
						{search ? "لا نتائج" : "لا توجد توزيعات بعد."}
					</div>
				) : (
					visible.map((a) => {
						const isDraft = a.docstatus === DocStatus.DRAFT;
						const isSubmitted = a.docstatus === DocStatus.SUBMITTED;
						const isCancelled = a.docstatus === DocStatus.CANCELLED;
						const appearance = docStatusAppearance(a.docstatus);
						return (
							<div
								key={a.id}
								className="flex items-center gap-3 border-b px-3 py-2"
							>
								<span
									className="w-32 shrink-0 font-mono text-muted-foreground text-xs"
									dir="ltr"
								>
									{a.documentNo ?? "—"}
								</span>
								<div className="min-w-0 flex-1">
									<div className="truncate font-medium text-sm">
										{a.mainCostCenter.costCenterName}
									</div>
									<div className="truncate text-muted-foreground text-xs">
										{a.percentages
											.map((p) => `${p.costCenter.costCenterName} ${p.percentage.toString()}٪`)
											.join(" · ")}
									</div>
								</div>
								<span
									className="shrink-0 text-muted-foreground text-xs tabular-nums"
									dir="ltr"
								>
									{new Date(a.validFrom).toISOString().slice(0, 10)}
								</span>
								<Badge variant={appearance.variant}>{STATUS_LABEL[a.docstatus]}</Badge>
								<DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label="إجراءات"
										>
											<IconDots className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											disabled={isPending || !isDraft}
											onClick={() => openEdit(a)}
										>
											<IconPencil className="size-4" /> تعديل المسودة
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={isPending || !isDraft}
											onClick={() => submit(a.id)}
										>
											<IconSend className="size-4" /> ترحيل
										</DropdownMenuItem>
										<DropdownMenuItem
											variant="destructive"
											disabled={isPending || !isSubmitted}
											onClick={() => cancel(a.id)}
										>
											<IconBan className="size-4" /> إلغاء
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={isPending || !isCancelled}
											onClick={() => amend(a.id)}
										>
											<IconFileText className="size-4" /> تعديل (نسخة جديدة)
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						);
					})
				)}
			</div>

			<CostCenterAllocationSheet
				open={open}
				onOpenChange={setOpen}
				editing={editing}
			/>
		</div>
	);
};
