import {
	IconArrowsExchange,
	IconCashBanknote,
	IconFileImport,
	IconLinkOff,
	IconReceipt2,
} from "@tabler/icons-react";
import { useRef, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
	useBankAccounts,
	useBankReconciliationActions,
	useBankTransactions,
	useImportPresets,
	useReconciliationCandidates,
} from "@/features/accounting/bank/hooks/use-bank-reconciliation";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";
import { cn } from "@/lib/utils";
import type {
	BankTransactionResponse,
	BankTransactionStatus,
	ImportStatementResult,
} from "@/server/accounting/bank/bank-transaction.type";
import { DUPLICATE_CANDIDATE_SCORE } from "@sanad/contracts/runtime/server/accounting/bank/bank-transaction.type";

/**
 * [P11.3] «التسوية البنكية» (FR-14.2) — the bank-side two-pane matcher: right the imported
 * bank transactions, left the ranked book-side candidates for the selected one. «سوِّ»
 * allocates a candidate in full; the JE/internal-transfer actions book the missing voucher
 * on the spot; «فك» breaks an allocation. All matching/scoring is server-side.
 */

const STATUS_LABELS: Record<BankTransactionStatus, string> = {
	PENDING: "معلّقة",
	UNRECONCILED: "غير مسوّاة",
	RECONCILED: "مسوّاة",
	SETTLED: "مقفلة",
	CANCELLED: "ملغاة",
};

const STATUS_VARIANTS: Record<
	BankTransactionStatus,
	"default" | "secondary" | "outline" | "destructive" | "primary"
> = {
	PENDING: "outline",
	UNRECONCILED: "secondary",
	RECONCILED: "default",
	SETTLED: "primary",
	CANCELLED: "destructive",
};

type StatusFilter = "UNRECONCILED" | "RECONCILED" | "ALL";

export const BankReconciliationPage = () => {
	const { bankAccounts } = useBankAccounts();
	const [bankAccountId, setBankAccountId] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("UNRECONCILED");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [importOpen, setImportOpen] = useState(false);
	const [journalOpen, setJournalOpen] = useState(false);
	const [paymentOpen, setPaymentOpen] = useState(false);

	const { transactions, isLoading } = useBankTransactions({
		bankAccountId: bankAccountId ?? undefined,
		status: statusFilter === "ALL" ? undefined : statusFilter,
		fromDate: fromDate || undefined,
		toDate: toDate || undefined,
	});
	const selected = transactions.find((row) => row.id === selectedId) ?? null;
	const { candidates, isLoading: candidatesLoading } = useReconciliationCandidates(
		selected?.id ?? null,
	);
	const actions = useBankReconciliationActions();

	const companyAccounts = bankAccounts.filter((account) => account.isCompanyAccount);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">التسوية البنكية</h1>
				<p className="text-muted-foreground text-sm">
					FR-14.2 — طابِق حركات كشف الحساب البنكي مع سندات الدفاتر؛ المطابقة تختم تاريخ المقاصة
					على السند.
				</p>
			</div>

			{/* toolbar */}
			<div className="flex flex-wrap items-center gap-2 px-4 py-3">
				<div className="w-56">
					<Select
						value={bankAccountId ?? "ALL"}
						onValueChange={(value) => {
							setBankAccountId(value === "ALL" ? null : value);
							setSelectedId(null);
						}}
						dir="rtl"
					>
						<SelectTrigger className="h-8">
							<SelectValue placeholder="الحساب البنكي..." />
						</SelectTrigger>
						<SelectContent dir="rtl">
							<SelectItem value="ALL">كل الحسابات البنكية</SelectItem>
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
				<div className="flex items-center gap-1">
					{(
						[
							["UNRECONCILED", "غير مسوّاة"],
							["RECONCILED", "مسوّاة"],
							["ALL", "الكل"],
						] as const
					).map(([value, label]) => (
						<button
							key={value}
							type="button"
							onClick={() => {
								setStatusFilter(value);
								setSelectedId(null);
							}}
							className={cn(
								"rounded-full border border-border px-2.5 py-0.5 text-xs transition-colors",
								statusFilter === value
									? "border-primary bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted",
							)}
						>
							{label}
						</button>
					))}
				</div>
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
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="ms-auto"
					onClick={() => setImportOpen(true)}
				>
					<IconFileImport className="size-4" />
					استيراد كشف
				</Button>
			</div>

			<div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-auto border-t md:grid-cols-2">
				{/* right pane (first in DOM = right in RTL) — the bank statement side */}
				<div className="min-h-0 overflow-auto border-e">
					<p className="px-3 pt-2 font-semibold text-muted-foreground text-xs">
						حركات البنك (اختر حركة لمطابقتها)
					</p>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>المستند</TableHead>
								<TableHead>التاريخ</TableHead>
								<TableHead>البيان</TableHead>
								<TableHead className="text-end">إيداع</TableHead>
								<TableHead className="text-end">سحب</TableHead>
								<TableHead className="text-end">غير المخصص</TableHead>
								<TableHead>الحالة</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{transactions.map((row) => (
								<TableRow
									key={row.id}
									className={cn("cursor-pointer", selectedId === row.id && "bg-muted")}
									onClick={() => setSelectedId(row.id)}
								>
									<TableCell dir="ltr">{row.documentNo ?? row.id}</TableCell>
									<TableCell dir="ltr">
										{formatDisplayDate(row.postingDate?.toString())}
									</TableCell>
									<TableCell className="max-w-40 truncate">{row.description ?? "—"}</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.deposit.toString())}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.withdrawal.toString())}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.unallocatedAmount.toString())}
									</TableCell>
									<TableCell>
										<Badge variant={STATUS_VARIANTS[row.status]}>
											{STATUS_LABELS[row.status]}
										</Badge>
									</TableCell>
								</TableRow>
							))}
							{transactions.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={7}
										className="py-8 text-center text-muted-foreground"
									>
										{isLoading ? "جارٍ التحميل..." : "لا حركات بنكية ضمن هذا النطاق."}
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</div>

				{/* left pane — book-side candidates + actions for the selected transaction */}
				<div className="min-h-0 overflow-auto">
					{selected ? (
						<div className="flex flex-col gap-2 pb-4">
							<div className="flex flex-wrap items-center gap-2 px-3 pt-2 text-xs">
								<span
									dir="ltr"
									className="font-semibold"
								>
									{selected.documentNo ?? selected.id}
								</span>
								<span className="text-muted-foreground">
									{selected.bankAccount.accountName} ·{" "}
									<span dir="ltr">{formatDisplayDate(selected.postingDate?.toString())}</span>
								</span>
								<span className="text-muted-foreground">
									المبلغ:{" "}
									<span
										dir="ltr"
										className="tabular-nums"
									>
										{formatAmount(
											selected.deposit.toString() !== "0"
												? selected.deposit.toString()
												: selected.withdrawal.toString(),
										)}
									</span>{" "}
									— غير المخصص:{" "}
									<span
										dir="ltr"
										className="tabular-nums"
									>
										{formatAmount(selected.unallocatedAmount.toString())}
									</span>
								</span>
							</div>

							<p className="px-3 font-semibold text-muted-foreground text-xs">
								المطابقات المقترحة (FR-14.2)
							</p>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>المستند</TableHead>
										<TableHead>التاريخ</TableHead>
										<TableHead>الطرف</TableHead>
										<TableHead>المرجع</TableHead>
										<TableHead className="text-end">المبلغ</TableHead>
										<TableHead>النقاط</TableHead>
										<TableHead className="w-16" />
									</TableRow>
								</TableHeader>
								<TableBody>
									{candidates.map((candidate) => (
										<TableRow
											key={`${candidate.paymentEntryId}:${candidate.paymentRowId ?? ""}`}
										>
											<TableCell dir="ltr">
												{candidate.documentNo ?? candidate.paymentEntryId}
											</TableCell>
											<TableCell dir="ltr">
												{formatDisplayDate(candidate.postingDate?.toString())}
											</TableCell>
											<TableCell>{candidate.partyName ?? "—"}</TableCell>
											<TableCell dir="ltr">{candidate.referenceNo ?? "—"}</TableCell>
											<TableCell
												className="text-end tabular-nums"
												dir="ltr"
											>
												{formatAmount(candidate.amount)}
											</TableCell>
											<TableCell>
												<span
													dir="ltr"
													className="tabular-nums"
												>
													{candidate.score}
												</span>{" "}
												<span className="text-muted-foreground text-xs">
													{candidate.matchedBy.join("، ")}
												</span>
											</TableCell>
											<TableCell>
												<Button
													type="button"
													size="xs"
													disabled={actions.isPending}
													onClick={() =>
														actions.allocate(selected.id, [
															{
																paymentDocument: candidate.paymentDocument,
																paymentEntryId: candidate.paymentEntryId,
																paymentRowId: candidate.paymentRowId,
																amount: candidate.amount,
															},
														])
													}
												>
													سوِّ
												</Button>
											</TableCell>
										</TableRow>
									))}
									{candidates.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={7}
												className="py-8 text-center text-muted-foreground"
											>
												{candidatesLoading
													? "جارٍ تحميل المطابقات..."
													: "لا مطابقات مقترحة — أنشئ السند من الإجراءات أدناه."}
											</TableCell>
										</TableRow>
									) : null}
								</TableBody>
							</Table>

							{/* the "book it now" actions */}
							<div className="flex flex-wrap items-center gap-2 border-t px-3 pt-3">
								<Button
									type="button"
									variant="outline"
									size="sm"
									disabled={actions.isPending}
									onClick={() => setJournalOpen(true)}
								>
									<IconReceipt2 className="size-4" />
									قيد مصاريف/إيراد
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									disabled={actions.isPending}
									onClick={() => setPaymentOpen(true)}
								>
									<IconCashBanknote className="size-4" />
									سند قبض/صرف
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									disabled={actions.isPending}
									onClick={() => actions.internalTransfer(selected.id)}
								>
									<IconArrowsExchange className="size-4" />
									تحويل داخلي
								</Button>
							</div>

							{selected.payments.length > 0 ? (
								<div className="px-3 pt-2">
									<p className="mb-2 font-semibold text-muted-foreground text-xs">
										التخصيصات القائمة (اضغط «فك» لإلغاء التخصيص)
									</p>
									<div className="flex flex-wrap gap-2">
										{selected.payments.map((payment) => (
											<Button
												key={payment.id}
												type="button"
												variant="outline"
												size="xs"
												disabled={actions.isPending}
												onClick={() => actions.unallocate(selected.id, payment.id)}
											>
												<IconLinkOff className="size-3.5" />
												{payment.paymentDocument === "journal_entry" ? "قيد" : "سند"}{" "}
												<span
													dir="ltr"
													className="tabular-nums"
												>
													{formatAmount(payment.allocatedAmount.toString())}
												</span>{" "}
												— فك
											</Button>
										))}
									</div>
								</div>
							) : null}
						</div>
					) : (
						<p className="py-10 text-center text-muted-foreground text-sm">
							اختر حركة بنكية من الجدول لعرض المطابقات المقترحة.
						</p>
					)}
				</div>
			</div>

			<ContraJournalDialog
				open={journalOpen}
				onOpenChange={setJournalOpen}
				transaction={selected}
			/>
			<PaymentEntryDialog
				open={paymentOpen}
				onOpenChange={setPaymentOpen}
				transaction={selected}
			/>
			<StatementImportDialog
				open={importOpen}
				onOpenChange={setImportOpen}
				defaultBankAccountId={bankAccountId}
			/>
		</div>
	);
};

/** «قيد مصاريف/إيراد» — book a charges/income JE against a contra account and allocate it. */
const ContraJournalDialog = ({
	open,
	onOpenChange,
	transaction,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	transaction: BankTransactionResponse | null;
}) => {
	const { accounts } = useAccounts();
	const actions = useBankReconciliationActions();
	const [contraAccountId, setContraAccountId] = useState("");
	const [remark, setRemark] = useState("");

	const leaves = accounts.filter((account) => !account.isGroup);

	const submit = async () => {
		if (!transaction || !contraAccountId) return;
		await actions.createJournalEntry(transaction.id, {
			contraAccountId,
			remark: remark.trim() || null,
		});
		setContraAccountId("");
		setRemark("");
		onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="sm:max-w-md"
			>
				<DialogHeader>
					<DialogTitle>قيد مصاريف/إيراد</DialogTitle>
					<DialogDescription>
						يُنشأ قيد يومية بين حساب البنك والحساب المقابل بمبلغ الحركة ويُخصص لها فورًا.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-3">
					<div>
						<Label className="mb-1 text-xs">الحساب المقابل</Label>
						<Select
							value={contraAccountId}
							onValueChange={setContraAccountId}
							dir="rtl"
						>
							<SelectTrigger>
								<SelectValue placeholder="اختر الحساب..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{leaves.map((account) => (
									<SelectItem
										key={account.id}
										value={account.id}
									>
										{account.accountName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label className="mb-1 text-xs">ملاحظة (اختياري)</Label>
						<Input
							value={remark}
							onChange={(event) => setRemark(event.target.value)}
							placeholder="بيان القيد..."
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						disabled={!contraAccountId || actions.isPending}
						onClick={submit}
					>
						إنشاء القيد
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

/**
 * «سند قبض/صرف» — closes #95 D5: book a party payment entry from the transaction on the
 * spot. The server (`createPaymentEntryFromTransaction`) derives everything but the party
 * from the transaction itself — direction decides RECEIVE/PAY, the bank GL is the paid
 * to/from side and the unallocated amount is the paid amount — so the dialog only picks
 * the party (deposit → Owner, withdrawal → Supplier, the payment-entry-sheet convention).
 *
 * [P12A-fix5] It also has to argue AGAINST itself. «سوِّ» and «سند قبض/صرف» sat side by
 * side with no warning, so booking a fresh PE on a row that already had a 90-scored exact
 * match double-booked the money (the owner's UI pass: JV uncleared forever + PE cleared).
 * The top candidate is now shown here, and above the server's duplicate threshold the
 * button demands an explicit acknowledgement that this really is a SEPARATE payment.
 */
const PaymentEntryDialog = ({
	open,
	onOpenChange,
	transaction,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	transaction: BankTransactionResponse | null;
}) => {
	const { parties } = useParties();
	const actions = useBankReconciliationActions();
	const [partyId, setPartyId] = useState("");
	const [confirmDuplicate, setConfirmDuplicate] = useState(false);

	const isDeposit = transaction ? transaction.deposit.toString() !== "0" : true;
	const partySide = isDeposit ? "Owner" : "Supplier";
	const partyOptions = parties.filter((party) => party.partyType === partySide);

	// the same ranked list the left pane shows — read here so the dialog can name what it
	// would duplicate instead of letting the server refuse with no context
	const { candidates } = useReconciliationCandidates(transaction?.id ?? null);
	const topCandidate = candidates[0];
	const duplicateRisk = !!topCandidate && topCandidate.score >= DUPLICATE_CANDIDATE_SCORE;

	const submit = async () => {
		if (!transaction || !partyId) return;
		if (duplicateRisk && !confirmDuplicate) return;
		await actions.createPaymentEntry(transaction.id, {
			partyType: partySide,
			partyId,
			confirmDuplicate,
		});
		setPartyId("");
		setConfirmDuplicate(false);
		onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) {
					setPartyId("");
					setConfirmDuplicate(false);
				}
				onOpenChange(next);
			}}
		>
			<DialogContent
				dir="rtl"
				className="sm:max-w-md"
			>
				<DialogHeader>
					<DialogTitle>{isDeposit ? "سند قبض" : "سند صرف"}</DialogTitle>
					<DialogDescription>
						يُنشأ سند {isDeposit ? "قبض من العميل" : "صرف للمورّد"} على حساب البنك بمبلغ الحركة
						غير المخصص، ويُرحَّل ويُخصص لها فورًا.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-3">
					<div>
						<Label className="mb-1 text-xs">{isDeposit ? "العميل" : "المورّد"}</Label>
						<Select
							value={partyId}
							onValueChange={setPartyId}
							dir="rtl"
						>
							<SelectTrigger>
								<SelectValue placeholder="اختر الطرف..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{partyOptions.map((party) => (
									<SelectItem
										key={party.partyId}
										value={party.partyId}
									>
										{party.name}
										{party.code ? ` (${party.code})` : ""}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{transaction ? (
						<p className="text-muted-foreground text-xs">
							المبلغ:{" "}
							<span
								dir="ltr"
								className="tabular-nums"
							>
								{formatAmount(transaction.unallocatedAmount.toString())}
							</span>
						</p>
					) : null}
					{/* [P12A-fix5] تحذير الازدواج: الحركة الدفترية المطابقة تُعرض هنا بالاسم
					    والمبلغ، ولا يُسمح بالإنشاء فوقها إلا بإقرار صريح. */}
					{duplicateRisk && topCandidate ? (
						<div className="space-y-2 rounded-md border border-amber-300 bg-amber-50/70 p-3 text-xs dark:border-amber-800 dark:bg-amber-950/30">
							<p className="font-medium text-amber-900 dark:text-amber-200">
								تحذير: توجد حركة دفترية غير مُقاصّة تطابق هذه الحركة
							</p>
							<p className="text-amber-900/90 dark:text-amber-200/90">
								{topCandidate.documentNo ?? "بدون رقم"}
								{" — "}
								<span
									dir="ltr"
									className="tabular-nums"
								>
									{formatAmount(topCandidate.amount)}
								</span>
								{` · درجة التطابق ${topCandidate.score}`}
							</p>
							<p className="text-amber-900/90 dark:text-amber-200/90">
								إن كانت هي نفسها فأغلق هذا الحوار واستخدم «سوِّ» — إنشاء سند جديد سيُسجّل المبلغ
								مرتين.
							</p>
							<div className="flex items-center gap-2">
								<Checkbox
									id="confirm-duplicate-payment"
									checked={confirmDuplicate}
									onCheckedChange={(checked) => setConfirmDuplicate(checked === true)}
								/>
								<Label
									htmlFor="confirm-duplicate-payment"
									className="text-amber-900 dark:text-amber-200"
								>
									أؤكّد أن هذه دفعة منفصلة وليست الحركة أعلاه
								</Label>
							</div>
						</div>
					) : null}
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						disabled={!partyId || actions.isPending || (duplicateRisk && !confirmDuplicate)}
						onClick={submit}
					>
						إنشاء السند
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

/** FR-14.1 — the statement import dialog: file → preset mapping → server import + summary. */
const StatementImportDialog = ({
	open,
	onOpenChange,
	defaultBankAccountId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultBankAccountId: string | null;
}) => {
	const { bankAccounts } = useBankAccounts();
	const { presets } = useImportPresets();
	const actions = useBankReconciliationActions();

	const [bankAccountId, setBankAccountId] = useState("");
	const [presetKey, setPresetKey] = useState("");
	const [file, setFile] = useState<{
		fileName: string;
		format: "csv" | "xlsx";
		content: string;
	} | null>(null);
	const [result, setResult] = useState<ImportStatementResult | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const companyAccounts = bankAccounts.filter((account) => account.isCompanyAccount);
	const effectiveBankAccountId = bankAccountId || defaultBankAccountId || "";

	const reset = () => {
		setBankAccountId("");
		setPresetKey("");
		setFile(null);
		setResult(null);
	};

	const onFile = (picked: File | undefined) => {
		if (!picked) return;
		setResult(null);
		const reader = new FileReader();
		if (picked.name.toLowerCase().endsWith(".xlsx")) {
			reader.onload = () => {
				const bytes = new Uint8Array(reader.result as ArrayBuffer);
				// btoa in 32KB chunks — one big fromCharCode call overflows the stack
				let binary = "";
				const chunk = 0x8000;
				for (let i = 0; i < bytes.length; i += chunk) {
					binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
				}
				setFile({ fileName: picked.name, format: "xlsx", content: btoa(binary) });
			};
			reader.readAsArrayBuffer(picked);
		} else {
			reader.onload = () =>
				setFile({ fileName: picked.name, format: "csv", content: reader.result as string });
			reader.readAsText(picked);
		}
	};

	const submit = async () => {
		if (!effectiveBankAccountId || !file) return;
		const summary = await actions.importStatement({
			bankAccountId: effectiveBankAccountId,
			fileName: file.fileName,
			format: file.format,
			content: file.content,
			...(presetKey ? { presetKey } : {}),
		});
		setResult(summary);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) reset();
				onOpenChange(next);
			}}
		>
			<DialogContent
				dir="rtl"
				className="max-h-[85vh] overflow-hidden sm:max-w-lg"
			>
				<DialogHeader>
					<DialogTitle>استيراد كشف حساب بنكي</DialogTitle>
					<DialogDescription>
						FR-14.1 — ارفع ملف CSV أو XLSX؛ التكرارات تُكتشف تلقائيًا ولا تُستورد مرتين.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-3 overflow-y-auto">
					<div>
						<Label className="mb-1 text-xs">الحساب البنكي</Label>
						<Select
							value={effectiveBankAccountId}
							onValueChange={setBankAccountId}
							dir="rtl"
						>
							<SelectTrigger>
								<SelectValue placeholder="اختر الحساب..." />
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
					<div>
						<Label className="mb-1 text-xs">قالب البنك</Label>
						<Select
							value={presetKey}
							onValueChange={setPresetKey}
							dir="rtl"
						>
							<SelectTrigger>
								<SelectValue placeholder="اختر قالب الأعمدة..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{presets.map((preset) => (
									<SelectItem
										key={preset.key}
										value={preset.key}
									>
										{preset.labelAr}
										{preset.verified ? "" : " ⚠"}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label className="mb-1 text-xs">ملف الكشف</Label>
						<input
							ref={fileInputRef}
							type="file"
							accept=".csv,.xlsx"
							onChange={(event) => onFile(event.target.files?.[0])}
							className="block w-full text-sm"
						/>
					</div>

					{result ? (
						<div className="space-y-2 rounded-[4px] border p-2 text-sm">
							<p>
								المستورد: <strong dir="ltr">{result.importedRows}</strong> — المكرر:{" "}
								<strong dir="ltr">{result.duplicateRows}</strong> — الأخطاء:{" "}
								<strong
									dir="ltr"
									className={result.errorRows ? "text-destructive" : ""}
								>
									{result.errorRows}
								</strong>
							</p>
							{result.errors.length > 0 ? (
								<ul className="max-h-32 space-y-1 overflow-y-auto rounded-[4px] border border-destructive/40 bg-destructive/5 p-2 text-destructive text-xs">
									{result.errors.slice(0, 5).map((error) => (
										<li key={`${error.rowNumber}-${error.message}`}>
											سطر {error.rowNumber}: {error.message}
										</li>
									))}
									{result.errors.length > 5 ? (
										<li>… و{result.errors.length - 5} أخطاء أخرى</li>
									) : null}
								</ul>
							) : null}
						</div>
					) : null}
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						{result ? "إغلاق" : "إلغاء"}
					</Button>
					<Button
						type="button"
						disabled={!effectiveBankAccountId || !file || actions.isPending}
						onClick={submit}
					>
						<IconFileImport className="size-4" /> استيراد
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
