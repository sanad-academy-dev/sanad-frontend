import { IconPlus, IconShieldCog } from "@tabler/icons-react";
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
import { AccountingPeriodSheet } from "@/features/accounting/governance/components/accounting-period-sheet";
import { DocstatusBadge } from "@/features/accounting/governance/components/governance-badges";
import {
	useAccountingPeriodActions,
	useAccountingPeriods,
} from "@/features/accounting/governance/hooks/use-accounting-periods";
import { formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { AccountingPeriodResponse } from "@/server/accounting/accounting-period/accounting-period.type";
import { findAccountingDoctype } from "@sanad/contracts/accounting/permissions";

/**
 * [P11.6] Tab «الفترات المحاسبية» (FR-12.2) — the submittable date-range locks. A period
 * shows WHICH doctypes it closes; draft → اعتماد/حذف, submitted → إلغاء (lifts the lock).
 */

const doctypeLabel = (key: string): string => findAccountingDoctype(key)?.labelAr ?? key;

export const AccountingPeriodsTab = () => {
	const { periods, isLoading } = useAccountingPeriods();
	const actions = useAccountingPeriodActions();

	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [cancelling, setCancelling] = useState<AccountingPeriodResponse | null>(null);
	const [deleting, setDeleting] = useState<AccountingPeriodResponse | null>(null);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return periods;
		return periods.filter((row) => row.periodName.toLowerCase().includes(q));
	}, [periods, search]);

	return (
		<>
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث باسم الفترة..."
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
						<IconPlus className="size-4" /> فترة جديدة
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>اسم الفترة</TableHead>
							<TableHead className="w-56">المدى الزمني</TableHead>
							<TableHead>المستندات المقفلة</TableHead>
							<TableHead className="w-28">الحالة</TableHead>
							<TableHead className="w-40">إجراءات</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{visible.map((row) => (
							<TableRow key={row.id}>
								<TableCell className="font-medium">{row.periodName}</TableCell>
								<TableCell
									dir="ltr"
									className="text-end tabular-nums"
								>
									{formatDisplayDate(row.startDate.toString())} –{" "}
									{formatDisplayDate(row.endDate.toString())}
								</TableCell>
								<TableCell>
									<div className="flex flex-wrap gap-1">
										{row.closedDocuments
											.filter((doc) => doc.closed)
											.map((doc) => (
												<Badge
													key={doc.id}
													variant="secondary"
												>
													{doctypeLabel(doc.documentType)}
												</Badge>
											))}
									</div>
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
									colSpan={5}
									className="py-8 text-center text-muted-foreground"
								>
									{isLoading ? (
										"جارٍ التحميل..."
									) : search ? (
										"لا نتائج"
									) : (
										<span className="inline-flex items-center gap-2">
											<IconShieldCog className="size-4" />
											لا فترات محاسبية بعد.
										</span>
									)}
								</TableCell>
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</div>

			<AccountingPeriodSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
			/>

			<AccountingConfirmDialog
				open={!!cancelling}
				onOpenChange={(open) => {
					if (!open) setCancelling(null);
				}}
				title={`إلغاء «${cancelling?.periodName ?? ""}»؟`}
				description="الإلغاء يرفع قفل الفترة — يعود الترحيل والإلغاء متاحين داخل مداها (FR-12.2)."
				confirmLabel="إلغاء الفترة"
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
				title="حذف مسودة الفترة؟"
				description={`سيتم حذف «${deleting?.periodName ?? ""}» نهائيًا — المسودات لا أثر لها على القفل.`}
				onConfirm={() => {
					if (deleting) actions.remove(deleting.id);
					setDeleting(null);
				}}
			/>
		</>
	);
};
