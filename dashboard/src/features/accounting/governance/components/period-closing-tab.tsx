import { IconLock, IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { TableToolbar } from "@/components/common/table-toolbar";
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
import {
	DocstatusBadge,
	JobStatusBadge,
} from "@/features/accounting/governance/components/governance-badges";
import { PeriodClosingSheet } from "@/features/accounting/governance/components/period-closing-sheet";
import {
	usePeriodClosingActions,
	usePeriodClosingVouchers,
} from "@/features/accounting/governance/hooks/use-period-closing-vouchers";
import { formatDisplayDate } from "@/features/accounting/utils/format-amount";
import { AccountingJobStatus } from "@/generated/prisma/enums";
import type { PeriodClosingVoucherResponse } from "@/server/accounting/period-closing/period-closing.type";

/**
 * [P11.6] Tab «إقفال الفترة» (FR-12.3) — Period Closing Vouchers + the live job monitor:
 * submit enqueues the closing build (AR-7), so the list shows `gleProcessingStatus` as a
 * badge (with the failure text when FAILED) and polls only while a job is running.
 */

export const PeriodClosingTab = () => {
	const { vouchers, isLoading } = usePeriodClosingVouchers();
	const actions = usePeriodClosingActions();

	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [running, setRunning] = useState<PeriodClosingVoucherResponse | null>(null);
	const [cancelling, setCancelling] = useState<PeriodClosingVoucherResponse | null>(null);
	const [deleting, setDeleting] = useState<PeriodClosingVoucherResponse | null>(null);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return vouchers;
		return vouchers.filter(
			(row) =>
				(row.documentNo ?? "").toLowerCase().includes(q) ||
				row.closingAccountHead.accountName.toLowerCase().includes(q),
		);
	}, [vouchers, search]);

	return (
		<>
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث برقم المستند أو حساب الإقفال..."
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
						<IconPlus className="size-4" /> سند إقفال جديد
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-40">رقم المستند</TableHead>
							<TableHead className="w-56">الفترة</TableHead>
							<TableHead>حساب الإقفال</TableHead>
							<TableHead className="w-24">الحالة</TableHead>
							<TableHead className="w-64">حالة المهمة</TableHead>
							<TableHead className="w-44">إجراءات</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{visible.map((row) => (
							<TableRow key={row.id}>
								<TableCell dir="ltr">{row.documentNo ?? "—"}</TableCell>
								<TableCell
									dir="ltr"
									className="text-end tabular-nums"
								>
									{formatDisplayDate(row.periodStartDate.toString())} –{" "}
									{formatDisplayDate(row.periodEndDate.toString())}
								</TableCell>
								<TableCell className="font-medium">
									{row.closingAccountHead.accountName}
								</TableCell>
								<TableCell>
									<DocstatusBadge docstatus={row.docstatus} />
								</TableCell>
								<TableCell>
									{/* the job only exists once the voucher leaves DRAFT (submit enqueues it) */}
									{row.docstatus === "DRAFT" ? (
										<span className="text-muted-foreground text-xs">—</span>
									) : (
										<div className="flex flex-col gap-1">
											<div>
												<JobStatusBadge status={row.gleProcessingStatus} />
											</div>
											{row.gleProcessingStatus === AccountingJobStatus.FAILED &&
											row.errorMessage ? (
												<p className="text-destructive text-xs">{row.errorMessage}</p>
											) : null}
										</div>
									)}
								</TableCell>
								<TableCell>
									<div className="flex gap-1.5">
										{row.docstatus === "DRAFT" ? (
											<>
												<Button
													size="xs"
													variant="outline"
													disabled={actions.isPending}
													onClick={() => setRunning(row)}
												>
													تشغيل الإقفال
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
									colSpan={6}
									className="py-8 text-center text-muted-foreground"
								>
									{isLoading ? (
										"جارٍ التحميل..."
									) : search ? (
										"لا نتائج"
									) : (
										<span className="inline-flex items-center gap-2">
											<IconLock className="size-4" />
											لا سندات إقفال بعد.
										</span>
									)}
								</TableCell>
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</div>

			<PeriodClosingSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
			/>

			<AccountingConfirmDialog
				open={!!running}
				onOpenChange={(open) => {
					if (!open) setRunning(null);
				}}
				title="تشغيل إقفال الفترة؟"
				description="الاعتماد يرقّم السند ويرحّل قيود الإقفال في الخلفية — تابع حالة المهمة في القائمة حتى تكتمل (FR-12.3)."
				confirmLabel="تشغيل الإقفال"
				onConfirm={() => {
					if (running) actions.submit(running.id);
					setRunning(null);
				}}
			/>
			<AccountingConfirmDialog
				open={!!cancelling}
				onOpenChange={(open) => {
					if (!open) setCancelling(null);
				}}
				title={`إلغاء ${cancelling?.documentNo ?? "سند الإقفال"}؟`}
				description="الإلغاء يعكس قيود الإقفال (AR-2) عبر مهمة خلفية — لا حذف للقيود المرحّلة."
				confirmLabel="إلغاء السند"
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
				title="حذف مسودة سند الإقفال؟"
				description="المسودات لا أثر لها على الدفاتر — الحذف نهائي."
				onConfirm={() => {
					if (deleting) actions.remove(deleting.id);
					setDeleting(null);
				}}
			/>
		</>
	);
};
