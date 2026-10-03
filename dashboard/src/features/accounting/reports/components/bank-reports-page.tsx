import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Badge } from "@/components/ui/badge";
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
import { useBankAccounts } from "@/features/accounting/bank/hooks/use-bank-reconciliation";
import {
	useBankClearanceSummary,
	useBankReconciliationStatement,
} from "@/features/accounting/reports/hooks/use-bank-reports";
import {
	formatAmount,
	formatDisplayDate,
	toNano,
} from "@/features/accounting/utils/format-amount";
import { cn } from "@/lib/utils";
import type { ClearanceVoucherRow } from "@/server/accounting/bank/bank-clearance.service";

function yearStart(): string {
	return `${new Date().getFullYear()}-01-01`;
}
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

const TABS = [
	{ value: "statement", label: "كشف التسوية البنكية" },
	{ value: "clearance", label: "ملخص المقاصة" },
] as const;
type ReportTab = (typeof TABS)[number]["value"];

const DOCUMENT_LABEL: Record<ClearanceVoucherRow["paymentDocument"], string> = {
	payment_entry: "سند دفع",
	journal_entry: "قيد يومية",
};

const isNonZero = (value: string): boolean => toNano(value.replace("-", "")) !== 0n;

/**
 * [P11.4] «تقارير البنوك» — the two §18 bank reports on the one-tab + in-page pill anatomy
 * (§7.8 hub rule): the FR-14.5 Bank Reconciliation Statement (GL vs bank, delta EXPLAINED
 * voucher by voucher) and the clearance-summary audit companion. Read-only — the stamps are
 * written from «مقاصة البنك» and «التسوية البنكية».
 */
export const BankReportsPage = () => {
	const { bankAccounts } = useBankAccounts();
	const [tab, setTab] = useState<ReportTab>("statement");
	const [bankAccountId, setBankAccountId] = useState<string | null>(null);
	const [asOf, setAsOf] = useState(today());
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(today());

	const companyAccounts = bankAccounts.filter((account) => account.isCompanyAccount);

	const { report: statement, isLoading: statementLoading } = useBankReconciliationStatement({
		bankAccountId: tab === "statement" ? bankAccountId : null,
		asOf,
	});
	const { report: summary, isLoading: summaryLoading } = useBankClearanceSummary({
		bankAccountId: tab === "clearance" ? bankAccountId : null,
		fromDate,
		toDate,
	});

	const loading = tab === "statement" ? statementLoading : summaryLoading;
	const residualNonZero = !!statement && isNonZero(statement.residualDifference);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">تقارير البنوك</h1>
				<p className="text-muted-foreground text-sm">
					FR-14.5 — كشف التسوية البنكية (رصيد الدفاتر مقابل رصيد البنك مع تفسير الفرق)، وملخص
					المقاصة لكل سندات الحساب البنكي.
				</p>
			</div>

			{/* toolbar — pills + bank account + dates */}
			<div className="flex flex-wrap items-center gap-2 border-t px-4 py-3">
				<div className="flex items-center gap-1">
					{TABS.map((entry) => (
						<button
							key={entry.value}
							type="button"
							onClick={() => setTab(entry.value)}
							className={cn(
								"rounded-full border border-border px-2.5 py-0.5 text-xs transition-colors",
								tab === entry.value
									? "border-primary bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted",
							)}
						>
							{entry.label}
						</button>
					))}
				</div>
				<div className="w-56">
					<Select
						value={bankAccountId ?? ""}
						onValueChange={setBankAccountId}
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
				{tab === "statement" ? (
					<DateField
						value={asOf}
						onChange={setAsOf}
						placeholder="حتى تاريخ"
					/>
				) : (
					<>
						<DateField
							value={fromDate}
							onChange={setFromDate}
							placeholder="من تاريخ"
						/>
						<DateField
							value={toDate}
							onChange={setToDate}
							placeholder="إلى تاريخ"
						/>
					</>
				)}
			</div>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{!bankAccountId ? (
					<p className="py-10 text-center text-muted-foreground text-sm">
						اختر حسابًا بنكيًا لعرض التقرير.
					</p>
				) : loading ? (
					<p className="py-10 text-center text-muted-foreground text-sm">جارٍ التحميل...</p>
				) : tab === "statement" ? (
					statement ? (
						<div className="flex flex-col">
							{/* FR-14.5 summary cards */}
							<div className="grid grid-cols-2 gap-2 px-4 py-3 md:grid-cols-5">
								{(
									[
										["رصيد دفتر الأستاذ", statement.glBalance, false],
										["غير المُقاصّ", statement.unclearedTotal, false],
										["الرصيد البنكي المحسوب", statement.calculatedBankBalance, false],
										["رصيد الكشف المستورد", statement.importedFeedBalance, false],
										["الفرق المتبقي", statement.residualDifference, residualNonZero],
									] as const
								).map(([label, value, highlight]) => (
									<div
										key={label}
										className={cn(
											"rounded-md border border-border p-2",
											highlight && "border-destructive bg-destructive/5",
										)}
									>
										<p className="text-muted-foreground text-xs">{label}</p>
										<p
											dir="ltr"
											className={cn(
												"text-end font-semibold tabular-nums",
												highlight && "text-destructive",
											)}
										>
											{formatAmount(value)}
										</p>
									</div>
								))}
							</div>
							{residualNonZero ? (
								<p className="px-4 pb-2 text-destructive text-xs">
									الفرق المتبقي ≠ صفر — الكشف المستورد غير مكتمل أو توجد حركات لم تُسوَّ بعد.
								</p>
							) : (
								// [P12A-fix5] القراءة الأمينة للصفر. في مراجعة وليّ الأمر قرأ الكشف صفرًا بينما
								// كانت دفعة واحدة مُسجَّلة مرتين: الحساب صحيح، لأن القيد المزدوج غير المُقاصّ
								// خارج المقارنة أصلًا. الصفر يعني «البنك يوافق الدفاتر» لا «الدفاتر صحيحة».
								<p className="px-4 pb-2 text-muted-foreground text-xs">
									الفرق المتبقي = صفر يعني أن رصيد البنك يوافق ما هو مُقاصّ في الدفاتر — لا أنّ
									الدفاتر صحيحة. الازدواج أو القيد الخاطئ ما دام غير مُقاصّ لا يظهر في هذه
									المقارنة؛ راجع «السندات غير المُقاصّة» أدناه.
								</p>
							)}

							<p className="px-3 pt-1 font-semibold text-muted-foreground text-xs">
								السندات غير المُقاصّة حتى{" "}
								<span dir="ltr">{formatDisplayDate(statement.asOf?.toString())}</span> —{" "}
								{statement.bankAccountName}
							</p>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>المستند</TableHead>
										<TableHead>النوع</TableHead>
										<TableHead>تاريخ الترحيل</TableHead>
										<TableHead className="text-end">المبلغ</TableHead>
										<TableHead>المرجع</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{statement.unclearedVouchers.map((row) => (
										<TableRow
											key={`${row.paymentDocument}:${row.voucherId}:${row.rowId ?? ""}`}
										>
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
											<TableCell className="max-w-48 truncate">
												{row.referenceNo ?? "—"}
											</TableCell>
										</TableRow>
									))}
									{statement.unclearedVouchers.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={5}
												className="py-8 text-center text-muted-foreground"
											>
												لا سندات غير مُقاصّة حتى هذا التاريخ.
											</TableCell>
										</TableRow>
									) : null}
								</TableBody>
							</Table>
						</div>
					) : null
				) : summary ? (
					<div className="flex flex-col">
						{/* cleared/uncleared totals */}
						<div className="grid grid-cols-2 gap-2 px-4 py-3 md:max-w-md">
							{(
								[
									["إجمالي المُقاصّ", summary.clearedTotal],
									["إجمالي غير المُقاصّ", summary.unclearedTotal],
								] as const
							).map(([label, value]) => (
								<div
									key={label}
									className="rounded-md border border-border p-2"
								>
									<p className="text-muted-foreground text-xs">{label}</p>
									<p
										dir="ltr"
										className="text-end font-semibold tabular-nums"
									>
										{formatAmount(value)}
									</p>
								</div>
							))}
						</div>

						<p className="px-3 pt-1 font-semibold text-muted-foreground text-xs">
							سندات الحساب البنكي — {summary.bankAccountName}
						</p>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>المستند</TableHead>
									<TableHead>النوع</TableHead>
									<TableHead>تاريخ الترحيل</TableHead>
									<TableHead className="text-end">المبلغ</TableHead>
									<TableHead>تاريخ المقاصة</TableHead>
									<TableHead>المرجع</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{summary.rows.map((row) => (
									<TableRow key={`${row.paymentDocument}:${row.voucherId}:${row.rowId ?? ""}`}>
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
										<TableCell>
											{row.clearanceDate ? (
												<span dir="ltr">
													{formatDisplayDate(row.clearanceDate.toString())}
												</span>
											) : (
												<Badge variant="secondary">غير مُقاصّ</Badge>
											)}
										</TableCell>
										<TableCell className="max-w-48 truncate">
											{row.referenceNo ?? "—"}
										</TableCell>
									</TableRow>
								))}
								{summary.rows.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="py-8 text-center text-muted-foreground"
										>
											لا سندات على الحساب البنكي في هذا النطاق.
										</TableCell>
									</TableRow>
								) : null}
							</TableBody>
						</Table>
					</div>
				) : null}
			</div>
		</div>
	);
};
