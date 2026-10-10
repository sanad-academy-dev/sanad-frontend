import { IconCoins, IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import { BudgetSheet } from "@/features/accounting/governance/components/budget-sheet";
import { DocstatusBadge } from "@/features/accounting/governance/components/governance-badges";
import {
	useBudgetActions,
	useBudgets,
} from "@/features/accounting/governance/hooks/use-budgets";
import type { BudgetAction } from "@/generated/prisma/enums";
import type { BudgetResponse } from "@/server/accounting/budget/budget.type";

/**
 * [P11.6] Tab «الموازنات» (§13) — the submittable spending caps. The two exceed-actions
 * render as badges (STOP=destructive, WARN=secondary, IGNORE=outline); draft →
 * اعتماد/حذف, submitted → إلغاء.
 */

const ACTION_BADGE: Record<
	BudgetAction,
	{ label: string; variant: "destructive" | "secondary" | "outline" }
> = {
	STOP: { label: "إيقاف", variant: "destructive" },
	WARN: { label: "تحذير", variant: "secondary" },
	IGNORE: { label: "تجاهل", variant: "outline" },
};

const ActionBadge = ({ action }: { action: BudgetAction }) => (
	<Badge variant={ACTION_BADGE[action]?.variant ?? "secondary"}>
		{ACTION_BADGE[action]?.label ?? action}
	</Badge>
);

export const BudgetsTab = () => {
	const { budgets, isLoading } = useBudgets();
	const actions = useBudgetActions();

	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [cancelling, setCancelling] = useState<BudgetResponse | null>(null);
	const [deleting, setDeleting] = useState<BudgetResponse | null>(null);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return budgets;
		return budgets.filter(
			(row) =>
				row.fiscalYear.toLowerCase().includes(q) ||
				(row.costCenter?.costCenterName ?? "").toLowerCase().includes(q),
		);
	}, [budgets, search]);

	return (
		<>
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث بالسنة المالية أو مركز التكلفة..."
				searchValue={search}
				onSearchChange={setSearch}
				buttonSize="xs"
				showFilter={false}
				showExport={false}
				actions={
					<Button
						size="sm"
						onClick={() => setSheetOpen(true)}
					>
						<IconPlus className="size-4" /> موازنة جديدة
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-32">السنة المالية</TableHead>
							<TableHead>مركز التكلفة</TableHead>
							<TableHead className="w-36">تجاوز السقف السنوي</TableHead>
							<TableHead className="w-36">تجاوز المتراكم الشهري</TableHead>
							<TableHead className="w-24 text-end">الحسابات</TableHead>
							<TableHead className="w-28">الحالة</TableHead>
							<TableHead className="w-40">إجراءات</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{visible.map((row) => (
							<TableRow key={row.id}>
								<TableCell
									className="tabular-nums"
									dir="ltr"
								>
									{row.fiscalYear}
								</TableCell>
								<TableCell className="font-medium">
									{row.costCenter?.costCenterName ?? row.project ?? "—"}
								</TableCell>
								<TableCell>
									<ActionBadge action={row.actionIfAnnualExceeded} />
								</TableCell>
								<TableCell>
									<ActionBadge action={row.actionIfAccumulatedMonthlyExceeded} />
								</TableCell>
								<TableCell
									className="text-end tabular-nums"
									dir="ltr"
								>
									{row.accounts.length}
								</TableCell>
								<TableCell>
									<DocstatusBadge docstatus={row.docstatus} />
								</TableCell>
								<TableCell>
									<div className="flex gap-1.5">
										{row.docstatus === "DRAFT" ? (
											<>
												<Button
													size="xs"
													variant="outline"
													disabled={actions.isPending}
													onClick={() => actions.submit(row.id)}
												>
													اعتماد
												</Button>
												<Button
													size="xs"
													variant="ghost"
													disabled={actions.isPending}
													onClick={() => setDeleting(row)}
												>
													حذف
												</Button>
											</>
										) : null}
										{row.docstatus === "SUBMITTED" ? (
											<Button
												size="xs"
												variant="outline"
												disabled={actions.isPending}
												onClick={() => setCancelling(row)}
											>
												إلغاء
											</Button>
										) : null}
									</div>
								</TableCell>
							</TableRow>
						))}
						{visible.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="py-8 text-center text-muted-foreground"
								>
									{isLoading ? (
										"جارٍ التحميل..."
									) : search ? (
										"لا نتائج"
									) : (
										<span className="inline-flex items-center gap-2">
											<IconCoins className="size-4" />
											لا موازنات بعد.
										</span>
									)}
								</TableCell>
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</div>

			<BudgetSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
			/>

			<AccountingConfirmDialog
				open={!!cancelling}
				onOpenChange={(open) => {
					if (!open) setCancelling(null);
				}}
				title="إلغاء الموازنة؟"
				description="الإلغاء يوقف تطبيق حدود هذه الموازنة على الترحيل — يبقى المستند محفوظًا ملغى (AR-1)."
				confirmLabel="إلغاء الموازنة"
				onConfirm={() => {
					if (cancelling) actions.cancel(cancelling.id);
					setCancelling(null);
				}}
			/>
			<AccountingConfirmDialog
				open={!!deleting}
				onOpenChange={(open) => {
					if (!open) setDeleting(null);
				}}
				title="حذف مسودة الموازنة؟"
				description="المسودات لا تُطبَّق على الترحيل — الحذف نهائي."
				onConfirm={() => {
					if (deleting) actions.remove(deleting.id);
					setDeleting(null);
				}}
			/>
		</>
	);
};
