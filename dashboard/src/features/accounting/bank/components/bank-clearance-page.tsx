import { IconChecklist } from "@tabler/icons-react";
import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useClearanceActions,
	useClearanceVouchers,
} from "@/features/accounting/bank/hooks/use-bank-clearance";
import { useBankAccounts } from "@/features/accounting/bank/hooks/use-bank-reconciliation";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { ClearanceVoucherRow } from "@/server/accounting/bank/bank-clearance.service";

function yearStart(): string {
	return `${new Date().getFullYear()}-01-01`;
}
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

const DOCUMENT_LABEL: Record<ClearanceVoucherRow["paymentDocument"], string> = {
	payment_entry: "سند دفع",
	journal_entry: "قيد يومية",
};

const rowKey = (row: ClearanceVoucherRow): string =>
	`${row.paymentDocument}:${row.voucherId}:${row.rowId ?? ""}`;

/**
 * [P11.4] «مقاصة البنك» (FR-14.4) — the legacy manual tool: no statement feed needed; pick
 * the uncleared vouchers on the bank GL, pick ONE clearance date, stamp them in bulk.
 * JE clearance is row-level (P11.1), so journal rows carry their rowId into the POST.
 */
export const BankClearancePage = () => {
	const { bankAccounts } = useBankAccounts();
	const [bankAccountId, setBankAccountId] = useState<string | null>(null);
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(today());
	const [clearanceDate, setClearanceDate] = useState(today());
	const [selected, setSelected] = useState<Record<string, boolean>>({});

	const companyAccounts = bankAccounts.filter((account) => account.isCompanyAccount);
	const { vouchers, isLoading } = useClearanceVouchers({ bankAccountId, fromDate, toDate });
	const { stamp, isPending } = useClearanceActions();

	const selectedRows = vouchers.filter((row) => selected[rowKey(row)]);
	const allSelected = vouchers.length > 0 && selectedRows.length === vouchers.length;

	const toggleAll = (checked: boolean) => {
		if (!checked) {
			setSelected({});
			return;
		}
		const next: Record<string, boolean> = {};
		for (const row of vouchers) next[rowKey(row)] = true;
		setSelected(next);
	};

	const submit = () => {
		if (selectedRows.length === 0 || !clearanceDate) return;
		stamp(
			selectedRows.map((row) => ({
				paymentDocument: row.paymentDocument,
				voucherId: row.voucherId,
				// JE clearance is row-level — the rowId from the list response is mandatory
				...(row.paymentDocument === "journal_entry" ? { rowId: row.rowId } : {}),
				clearanceDate,
			})),
		);
		setSelected({});
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">مقاصة البنك</h1>
				<p className="text-muted-foreground text-sm">
					FR-14.4 — ثبّت تاريخ المقاصة يدويًا على السندات غير المُقاصّة دون الحاجة لكشف حساب
					مستورد.
				</p>
			</div>

			{/* toolbar */}
			<div className="flex flex-wrap items-center gap-2 px-4 py-3">
				<div className="w-56">
					<Select
						value={bankAccountId ?? ""}
						onValueChange={(value) => {
							setBankAccountId(value);
							setSelected({});
						}}
						dir="rtl"
					>
						<SelectTrigger className="h-8">
							<SelectValue placeholder="الحساب البنكي..." />
						</SelectTrigger>
						<SelectContent dir="rtl">
							{companyAccounts.map((account) => (
								<SelectItem
									key={account.id}
									value={account.id}
								>
									{account.bank.bankName} — {account.accountName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<DateField
					value={fromDate}
					onChange={(value) => {
						setFromDate(value);
						setSelected({});
					}}
					placeholder="من تاريخ"
				/>
				<DateField
					value={toDate}
					onChange={(value) => {
						setToDate(value);
						setSelected({});
					}}
					placeholder="إلى تاريخ"
				/>
				<div className="ms-auto flex items-center gap-2">
					<span className="text-muted-foreground text-xs">تاريخ المقاصة</span>
					<DateField
						value={clearanceDate}
						onChange={setClearanceDate}
						placeholder="تاريخ المقاصة"
					/>
					<Button
						type="button"
						size="sm"
						onClick={submit}
						disabled={isPending || selectedRows.length === 0 || !clearanceDate}
					>
						<IconChecklist className="size-4" />
						تثبيت تاريخ المقاصة ({selectedRows.length})
					</Button>
				</div>
			</div>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-10">
								<Checkbox
									checked={allSelected}
									onCheckedChange={(checked) => toggleAll(checked === true)}
									disabled={vouchers.length === 0}
									aria-label="اختيار كل السندات"
								/>
							</TableHead>
							<TableHead>المستند</TableHead>
							<TableHead>النوع</TableHead>
							<TableHead>تاريخ الترحيل</TableHead>
							<TableHead className="text-end">المبلغ</TableHead>
							<TableHead>المرجع</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{vouchers.map((row) => {
							const key = rowKey(row);
							return (
								<TableRow
									key={key}
									className="cursor-pointer"
									onClick={() => setSelected((prev) => ({ ...prev, [key]: !prev[key] }))}
								>
									<TableCell onClick={(event) => event.stopPropagation()}>
										<Checkbox
											checked={!!selected[key]}
											onCheckedChange={(checked) =>
												setSelected((prev) => ({ ...prev, [key]: checked === true }))
											}
											aria-label={`اختيار ${row.documentNo ?? row.voucherId}`}
										/>
									</TableCell>
									<TableCell dir="ltr">{row.documentNo ?? row.voucherId}</TableCell>
									<TableCell>
										<Badge variant="outline">{DOCUMENT_LABEL[row.paymentDocument]}</Badge>
									</TableCell>
									<TableCell dir="ltr">
										{formatDisplayDate(row.postingDate?.toString())}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.amount)}
									</TableCell>
									<TableCell className="max-w-48 truncate">{row.referenceNo ?? "—"}</TableCell>
								</TableRow>
							);
						})}
						{vouchers.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="py-8 text-center text-muted-foreground"
								>
									{!bankAccountId
										? "اختر حسابًا بنكيًا أولًا."
										: isLoading
											? "جارٍ التحميل..."
											: "لا سندات غير مُقاصّة في هذا النطاق."}
								</TableCell>
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
