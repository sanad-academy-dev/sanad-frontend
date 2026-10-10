import { IconCircleDot, IconDownload, IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import { SalesInvoiceSheet } from "@/features/accounting/sales-invoices/components/sales-invoice-sheet";
import { SalesInvoicesTable } from "@/features/accounting/sales-invoices/components/sales-invoices-table";
import {
	useSalesInvoice,
	useSalesInvoiceActions,
	useSalesInvoices,
} from "@/features/accounting/sales-invoices/hooks/use-sales-invoices";
import { SALES_INVOICE_STATUS_APPEARANCE } from "@/features/accounting/utils/accounting-status";
import { sumAmountStrings } from "@/features/accounting/utils/amount-strings";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { SalesInvoiceStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import type {
	CreateSalesInvoiceFormValues,
	SalesInvoiceListRow,
} from "@/server/accounting/sales-invoice/sales-invoice.type";
import { DocStatus } from "@sanad/contracts/runtime/server/accounting/sales-invoice/sales-invoice.type";

/**
 * [P5.7 / P5-UI-fix] «فواتير المبيعات» — the ACCOUNTING invoice list.
 *
 * Anatomy is the twin of the legacy invoices screen (contract carve-out: invoice-type
 * screens follow that table, masters/vouchers keep the §4.1 list recipe): full-height flex
 * column → title+scope line → Stats → TableToolbar → `<Table>` body.
 *
 * Status filtering goes through the app's standard «التصفية» menu — the floating chip row
 * it replaced was a third pattern that existed on no other screen, and it left the
 * toolbar's own inert فلترة button sitting beside it as a second, fake affordance.
 *
 * Contract C3: this is the accounting invoice. The clinic's operational `Invoice`
 * («الفواتير») is a separate document with its own screen and is NOT touched here.
 */

const STATUS_OPTIONS = Object.values(SalesInvoiceStatus).map((status) => ({
	value: status,
	label: SALES_INVOICE_STATUS_APPEARANCE[status].label,
}));

export const SalesInvoicesPage = () => {
	const { isRtl } = useI18n();
	const { invoices, isLoading } = useSalesInvoices();
	const actions = useSalesInvoiceActions();

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<string[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [prefill, setPrefill] = useState<CreateSalesInvoiceFormValues | null>(null);
	const [deleting, setDeleting] = useState<SalesInvoiceListRow | null>(null);
	const [cancelling, setCancelling] = useState<SalesInvoiceListRow | null>(null);

	const { invoice: editing } = useSalesInvoice(editingId);

	const stats = useMemo<StatItem[]>(() => {
		const submitted = invoices.filter((row) => row.docstatus === DocStatus.SUBMITTED);
		return [
			{
				title: "إجمالي الفواتير",
				value: invoices.length,
				tooltip: "كل فواتير المبيعات المحاسبية.",
			},
			{
				title: "المتبقي (ر.س)",
				// `valueLabel` carries the exact figure; `value` is never rendered when it is set.
				// The sum runs on strings so a Decimal(21,9) never becomes a JS float (C2).
				value: 0,
				valueLabel: formatAmount(
					sumAmountStrings(submitted.map((row) => row.outstandingAmount.toString())),
				),
				tooltip: "مجموع المتبقي — مشتق من سجل الذمم (BR-5.2.2) حصريًا.",
			},
			{
				title: "متأخرة",
				value: invoices.filter((row) => row.status === SalesInvoiceStatus.OVERDUE).length,
				tooltip: "فواتير تجاوزت تاريخ استحقاقها (BR-7.2.1).",
			},
			{
				title: "مرتجعات",
				value: invoices.filter((row) => row.isReturn).length,
				tooltip: "إشعارات دائنة — تسوّي أصلها عبر against_voucher (BR-7.2.2).",
			},
		];
	}, [invoices]);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		return invoices.filter((row) => {
			if (statusFilter.length > 0 && !statusFilter.includes(row.status)) return false;
			if (!q) return true;
			return (
				(row.documentNo ?? "").toLowerCase().includes(q) ||
				(row.partyName ?? "").toLowerCase().includes(q)
			);
		});
	}, [invoices, search, statusFilter]);

	const isFiltered = search.trim() !== "" || statusFilter.length > 0;

	const filterGroups: FilterGroup[] = [
		{
			key: "status",
			label: "الحالة",
			Icon: IconCircleDot,
			options: STATUS_OPTIONS,
			selected: statusFilter,
			onToggle: (value) =>
				setStatusFilter((prev) =>
					prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
				),
		},
	];

	const exportCsv = () =>
		downloadCsv(
			"sales-invoices",
			[
				"رقم المستند",
				"العميل",
				"تاريخ الترحيل",
				"تاريخ الاستحقاق",
				"الإجمالي",
				"المتبقي",
				"الحالة",
			],
			visible.map((row) => [
				row.documentNo ?? "",
				row.partyName ?? "",
				isoDay(row.postingDate.toString()),
				row.dueDate ? isoDay(row.dueDate.toString()) : "",
				(row.disableRoundedTotal ? row.grandTotal : row.roundedTotal).toString(),
				row.outstandingAmount.toString(),
				SALES_INVOICE_STATUS_APPEARANCE[row.status].label,
			]),
		);

	const openCreate = () => {
		setEditingId(null);
		setPrefill(null);
		setSheetOpen(true);
	};
	const openEdit = (row: SalesInvoiceListRow) => {
		setEditingId(row.id);
		setPrefill(null);
		setSheetOpen(true);
	};
	const openReturn = async (row: SalesInvoiceListRow) => {
		const draft = await actions.fetchReturnDraft(row.id);
		setEditingId(null);
		setPrefill(draft);
		setSheetOpen(true);
	};

	const save = (values: CreateSalesInvoiceFormValues) => {
		if (editingId) actions.update(editingId, values);
		else actions.create(values);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">فواتير المبيعات</h1>
				{/* scope line — «الفواتير» (التشغيلية) sits one tab away; say which is which */}
				<p className="text-muted-foreground text-sm">
					الفوترة المحاسبية — تُرحَّل إلى دفتر الأستاذ وسجل الذمم ({invoices.length}).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث برقم المستند، اسم العميل..."
				searchValue={search}
				onSearchChange={setSearch}
				buttonSize="xs"
				showFilter={false}
				showExport={false}
				leftExtra={
					<>
						<FiltersMenu groups={filterGroups} />
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
					</>
				}
				actions={
					<Button
						size="sm"
						onClick={openCreate}
					>
						<IconPlus className="size-4" /> فاتورة جديدة
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 border-t">
				<SalesInvoicesTable
					invoices={visible}
					isLoading={isLoading}
					isFiltered={isFiltered}
					selectedIds={selectedIds}
					onSelectionChange={setSelectedIds}
					dir={isRtl ? "rtl" : "ltr"}
					isPending={actions.isPending}
					onEdit={openEdit}
					onSubmit={(row) => actions.submit(row.id)}
					onReturn={openReturn}
					onAmend={(row) => actions.amend(row.id)}
					onCancel={setCancelling}
					onDelete={setDeleting}
				/>
			</div>

			<SalesInvoiceSheet
				open={sheetOpen}
				onOpenChange={(next) => {
					setSheetOpen(next);
					if (!next) {
						setEditingId(null);
						setPrefill(null);
					}
				}}
				editing={editingId ? editing : null}
				prefill={prefill}
				onSave={save}
				isSaving={actions.isPending}
			/>

			<AccountingConfirmDialog
				open={deleting !== null}
				onOpenChange={(next) => !next && setDeleting(null)}
				title="حذف مسودة الفاتورة؟"
				description="المسودات لا أثر لها على الدفاتر — الحذف نهائي."
				confirmLabel="حذف"
				onConfirm={() => {
					if (deleting) actions.remove(deleting.id);
					setDeleting(null);
				}}
			/>
			<AccountingConfirmDialog
				open={cancelling !== null}
				onOpenChange={(next) => !next && setCancelling(null)}
				title={`إلغاء ${cancelling?.documentNo ?? "الفاتورة"}؟`}
				description="الإلغاء يعكس قيود الأستاذ وسجل الذمم حسب وضع الدفتر (AR-2) — لا حذف."
				confirmLabel="إلغاء الفاتورة"
				onConfirm={() => {
					if (cancelling) actions.cancel(cancelling.id);
					setCancelling(null);
				}}
			/>
		</div>
	);
};
