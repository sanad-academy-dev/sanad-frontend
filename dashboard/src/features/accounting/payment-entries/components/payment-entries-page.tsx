import { IconCircleDot, IconDownload, IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import { PaymentEntriesTable } from "@/features/accounting/payment-entries/components/payment-entries-table";
import { PaymentEntrySheet } from "@/features/accounting/payment-entries/components/payment-entry-sheet";
import {
	usePaymentEntries,
	usePaymentEntry,
	usePaymentEntryActions,
} from "@/features/accounting/payment-entries/hooks/use-payment-entries";
import {
	PAYMENT_ENTRY_STATUS_APPEARANCE,
	PAYMENT_TYPE_APPEARANCE,
} from "@/features/accounting/utils/accounting-status";
import { sumAmountStrings } from "@/features/accounting/utils/amount-strings";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { PaymentType } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import type { PaymentEntryListRow } from "@/server/accounting/payment-entry/payment-entry.type";
import { DocStatus } from "@sanad/contracts/runtime/server/accounting/payment-entry/payment-entry.type";

/**
 * [P7.9] «سندات القبض والصرف» — the Payment Entry list, the [P5-UI-fix] twin anatomy
 * (title+scope → Stats → TableToolbar with the standard «التصفية» menu → table body).
 */

const TYPE_OPTIONS = Object.values(PaymentType).map((type) => ({
	value: type,
	label: PAYMENT_TYPE_APPEARANCE[type].label,
}));

export const PaymentEntriesPage = () => {
	const { isRtl } = useI18n();
	const { entries, isLoading } = usePaymentEntries();
	const actions = usePaymentEntryActions();

	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState<string[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<PaymentEntryListRow | null>(null);
	const [cancelling, setCancelling] = useState<PaymentEntryListRow | null>(null);

	const { entry: editing } = usePaymentEntry(editingId);

	const stats = useMemo<StatItem[]>(() => {
		const submitted = entries.filter((row) => row.docstatus === DocStatus.SUBMITTED);
		return [
			{
				title: "إجمالي السندات",
				value: entries.length,
				tooltip: "كل سندات القبض والصرف والتحويلات.",
			},
			{
				title: "مقبوضات (ر.س)",
				value: 0,
				valueLabel: formatAmount(
					sumAmountStrings(
						submitted
							.filter((row) => row.paymentType === "RECEIVE")
							.map((row) => row.paidAmount.toString()),
					),
				),
				tooltip: "مجموع سندات القبض المرحَّلة.",
			},
			{
				title: "مدفوعات (ر.س)",
				value: 0,
				valueLabel: formatAmount(
					sumAmountStrings(
						submitted
							.filter((row) => row.paymentType === "PAY")
							.map((row) => row.paidAmount.toString()),
					),
				),
				tooltip: "مجموع سندات الصرف المرحَّلة.",
			},
			{
				title: "دفعات مقدمة مفتوحة (ر.س)",
				value: 0,
				valueLabel: formatAmount(
					sumAmountStrings(submitted.map((row) => row.unallocatedAmount.toString())),
				),
				tooltip: "غير المخصص — يُخصَّص من الفاتورة (FIFO) أو من تسوية المدفوعات.",
			},
		];
	}, [entries]);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		return entries.filter((row) => {
			if (typeFilter.length > 0 && !typeFilter.includes(row.paymentType)) return false;
			if (!q) return true;
			return (
				(row.documentNo ?? "").toLowerCase().includes(q) ||
				(row.partyName ?? "").toLowerCase().includes(q) ||
				(row.referenceNo ?? "").toLowerCase().includes(q)
			);
		});
	}, [entries, search, typeFilter]);

	const isFiltered = search.trim() !== "" || typeFilter.length > 0;

	const filterGroups: FilterGroup[] = [
		{
			key: "type",
			label: "النوع",
			Icon: IconCircleDot,
			options: TYPE_OPTIONS,
			selected: typeFilter,
			onToggle: (value) =>
				setTypeFilter((prev) =>
					prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
				),
		},
	];

	const exportCsv = () =>
		downloadCsv(
			"payment-entries",
			[
				"رقم المستند",
				"النوع",
				"الطرف",
				"التاريخ",
				"وسيلة الدفع",
				"المبلغ",
				"غير المخصص",
				"الحالة",
			],
			visible.map((row) => [
				row.documentNo ?? "",
				PAYMENT_TYPE_APPEARANCE[row.paymentType].label,
				row.partyName ?? "",
				isoDay(row.postingDate.toString()),
				row.modeOfPayment?.modeOfPaymentName ?? "",
				row.paidAmount.toString(),
				row.unallocatedAmount.toString(),
				// [F9] كان يُصدَّر الرمز الخام (SUBMITTED) بينما توأماه في P5/P6 يصدّران
				// التسمية العربية — الملف نفسه يقرأه المحاسب، لا الشيفرة
				PAYMENT_ENTRY_STATUS_APPEARANCE[row.status]?.label ?? row.status,
			]),
		);

	const openCreate = () => {
		setEditingId(null);
		setSheetOpen(true);
	};
	const openEdit = (row: PaymentEntryListRow) => {
		setEditingId(row.id);
		setSheetOpen(true);
	};

	const save = (values: Parameters<typeof actions.create>[0]) => {
		if (editingId) actions.update(editingId, values);
		else actions.create(values);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">سندات القبض والصرف</h1>
				<p className="text-muted-foreground text-sm">
					تحصيل وسداد وتحويلات — تُرحَّل إلى دفتر الأستاذ وتُسوّي المستندات عبر سجل الذمم (
					{entries.length}).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث برقم المستند، الطرف، رقم المرجع..."
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
						<IconPlus className="size-4" /> سند جديد
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 border-t">
				<PaymentEntriesTable
					entries={visible}
					isLoading={isLoading}
					isFiltered={isFiltered}
					selectedIds={selectedIds}
					onSelectionChange={setSelectedIds}
					dir={isRtl ? "rtl" : "ltr"}
					isPending={actions.isPending}
					onEdit={openEdit}
					onSubmit={(row) => actions.submit(row.id)}
					onAmend={(row) => actions.amend(row.id)}
					onCancel={setCancelling}
					onDelete={setDeleting}
				/>
			</div>

			<PaymentEntrySheet
				open={sheetOpen}
				onOpenChange={(next) => {
					setSheetOpen(next);
					if (!next) setEditingId(null);
				}}
				editing={editingId ? editing : null}
				onSave={save}
				isSaving={actions.isPending}
			/>

			<AccountingConfirmDialog
				open={deleting !== null}
				onOpenChange={(next) => !next && setDeleting(null)}
				title="حذف مسودة السند؟"
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
				title={`إلغاء ${cancelling?.documentNo ?? "السند"}؟`}
				description="الإلغاء يعكس قيود الأستاذ ويعيد مستحقات المستندات المرتبطة (AR-2) — لا حذف."
				confirmLabel="إلغاء السند"
				onConfirm={() => {
					if (cancelling) actions.cancel(cancelling.id);
					setCancelling(null);
				}}
			/>
		</div>
	);
};
