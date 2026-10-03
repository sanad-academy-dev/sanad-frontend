import { IconCircleDot, IconDownload, IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import { PurchaseInvoiceHoldDialog } from "@/features/accounting/purchase-invoices/components/purchase-invoice-hold-dialog";
import { PurchaseInvoiceSheet } from "@/features/accounting/purchase-invoices/components/purchase-invoice-sheet";
import { PurchaseInvoicesTable } from "@/features/accounting/purchase-invoices/components/purchase-invoices-table";
import {
	usePurchaseInvoice,
	usePurchaseInvoiceActions,
	usePurchaseInvoices,
} from "@/features/accounting/purchase-invoices/hooks/use-purchase-invoices";
import { PURCHASE_INVOICE_STATUS_APPEARANCE } from "@/features/accounting/utils/accounting-status";
import { sumAmountStrings } from "@/features/accounting/utils/amount-strings";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { PurchaseInvoiceStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import type {
	CreatePurchaseInvoiceFormValues,
	PurchaseInvoiceListRow,
} from "@/server/accounting/purchase-invoice/purchase-invoice.type";
import { DocStatus } from "@sanad/contracts/runtime/server/accounting/purchase-invoice/purchase-invoice.type";

/**
 * [P6.5] «فواتير المشتريات» — the ACCOUNTING purchase-invoice list, the AP twin of
 * `sales-invoices-page.tsx` ([P5-UI-fix] anatomy: full-height flex column → title+scope
 * line → Stats → TableToolbar → table body; status filtering through the standard
 * «التصفية» menu). §7.3 deltas: a hold stat + hold/release actions (BR-7.3.2) and the
 * supplier-bill column (BR-7.3.1).
 *
 * Contract C3: this is the accounting document. The legacy «المصروفات» expense screen is
 * untouched — its adapter into the ledger is a later wiring task.
 */

const STATUS_OPTIONS = Object.values(PurchaseInvoiceStatus).map((status) => ({
	value: status,
	label: PURCHASE_INVOICE_STATUS_APPEARANCE[status].label,
}));

export const PurchaseInvoicesPage = () => {
	const { isRtl } = useI18n();
	const { invoices, isLoading } = usePurchaseInvoices();
	const actions = usePurchaseInvoiceActions();

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<string[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [prefill, setPrefill] = useState<CreatePurchaseInvoiceFormValues | null>(null);
	const [deleting, setDeleting] = useState<PurchaseInvoiceListRow | null>(null);
	const [cancelling, setCancelling] = useState<PurchaseInvoiceListRow | null>(null);
	const [holding, setHolding] = useState<PurchaseInvoiceListRow | null>(null);

	const { invoice: editing } = usePurchaseInvoice(editingId);

	const stats = useMemo<StatItem[]>(() => {
		const submitted = invoices.filter((row) => row.docstatus === DocStatus.SUBMITTED);
		return [
			{
				title: "إجمالي الفواتير",
				value: invoices.length,
				tooltip: "كل فواتير المشتريات المحاسبية.",
			},
			{
				title: "المستحق للموردين (ر.س)",
				// `valueLabel` carries the exact figure; the sum runs on strings so a
				// Decimal(21,9) never becomes a JS float (C2).
				value: 0,
				valueLabel: formatAmount(
					sumAmountStrings(submitted.map((row) => row.outstandingAmount.toString())),
				),
				tooltip: "مجموع المتبقي — مشتق من سجل الذمم (BR-5.2.2) حصريًا.",
			},
			{
				title: "معلّقة",
				value: invoices.filter((row) => row.onHold).length,
				tooltip: "فواتير معلّقة عن الدفع — مستبعدة من سحب المدفوعات (BR-7.3.2).",
			},
			{
				title: "مرتجعات",
				value: invoices.filter((row) => row.isReturn).length,
				tooltip: "إشعارات مدينة — تسوّي أصلها عبر against_voucher.",
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
				(row.partyName ?? "").toLowerCase().includes(q) ||
				(row.billNo ?? "").toLowerCase().includes(q)
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
			"purchase-invoices",
			[
				"رقم المستند",
				"المورد",
				"فاتورة المورد",
				"تاريخ الترحيل",
				"تاريخ الاستحقاق",
				"الإجمالي",
				"المتبقي",
				"الحالة",
				"معلّقة",
			],
			visible.map((row) => [
				row.documentNo ?? "",
				row.partyName ?? "",
				row.billNo ?? "",
				isoDay(row.postingDate.toString()),
				row.dueDate ? isoDay(row.dueDate.toString()) : "",
				(row.disableRoundedTotal ? row.grandTotal : row.roundedTotal).toString(),
				row.outstandingAmount.toString(),
				PURCHASE_INVOICE_STATUS_APPEARANCE[row.status].label,
				row.onHold ? "نعم" : "",
			]),
		);

	const openCreate = () => {
		setEditingId(null);
		setPrefill(null);
		setSheetOpen(true);
	};
	const openEdit = (row: PurchaseInvoiceListRow) => {
		setEditingId(row.id);
		setPrefill(null);
		setSheetOpen(true);
	};
	const openReturn = async (row: PurchaseInvoiceListRow) => {
		const draft = await actions.fetchReturnDraft(row.id);
		setEditingId(null);
		setPrefill(draft);
		setSheetOpen(true);
	};

	const save = (values: CreatePurchaseInvoiceFormValues) => {
		if (editingId) actions.update(editingId, values);
		else actions.create(values);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">فواتير المشتريات</h1>
				{/* scope line — «المصروفات» (التشغيلية) sits one tab away; say which is which */}
				<p className="text-muted-foreground text-sm">
					فوترة الموردين المحاسبية — تُرحَّل إلى دفتر الأستاذ وسجل الذمم ({invoices.length}).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث برقم المستند، المورد، فاتورة المورد..."
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
				<PurchaseInvoicesTable
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
					onHold={setHolding}
					onRelease={(row) => actions.release(row.id)}
				/>
			</div>

			<PurchaseInvoiceSheet
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

			<PurchaseInvoiceHoldDialog
				open={holding !== null}
				onOpenChange={(next) => !next && setHolding(null)}
				documentNo={holding?.documentNo ?? null}
				isPending={actions.isPending}
				onConfirm={(input) => {
					if (holding) actions.hold(holding.id, input);
					setHolding(null);
				}}
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
