import { useEffect, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import {
	useCreateDunning,
	useCreateDunningType,
	useDunningTypes,
	useOverdueInvoices,
} from "@/features/accounting/extended/hooks/use-extended";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import { sumAmountStrings } from "@/features/accounting/utils/amount-strings";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";

/**
 * [P12.15] Create a dunning letter (FR-17.1), and the type that prices one.
 *
 * THE OVERDUE PULL IS THE SCREEN. Everything else is two numbers and a date; what the
 * operator actually needs to decide is *which* late invoices this letter chases, and they
 * cannot decide that without seeing them — how late each one is and how much of it is still
 * outstanding. So the party picker loads the pull immediately and every row is selectable,
 * all selected by default (the common case is "chase everything"), with the running total of
 * what the letter will cover shown live.
 *
 * THE FEE IS ON THE LETTER, THE INTEREST IS PER INVOICE. The type's fee is charged ONCE per
 * dunning, not once per invoice — stating that here matters, because an operator who expects
 * per-invoice fees will read the resulting total as a bug.
 *
 * ONLY CUSTOMERS. A dunning chases a receivable, so the party list is filtered to the
 * RECEIVABLE side of the C6 registry — an operator cannot accidentally send a collection
 * letter to a supplier.
 */

const AMOUNT_PATTERN = /^\d+(\.\d{1,9})?$/;
const NONE = "__none__";
const today = () => new Date().toISOString().slice(0, 10);

/* ── the dunning itself ───────────────────────────────────────────────────────────────── */

export const DunningSheet = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { parties } = useParties();
	const { types } = useDunningTypes();
	const { createDunning, isPending } = useCreateDunning();

	const [partyId, setPartyId] = useState("");
	const [postingDate, setPostingDate] = useState(today);
	const [typeId, setTypeId] = useState<string>(NONE);
	const [selected, setSelected] = useState<string[]>([]);
	const [rate, setRate] = useState("");
	const [fee, setFee] = useState("");

	// المطالبة تلاحق ذمّة مدينة — الموردون والموظفون ليسوا طرفًا فيها
	const customers = parties.filter((party) => party.partyType === "Owner");
	const { overdue, isLoading: overdueLoading } = useOverdueInvoices(
		partyId ? "Owner" : null,
		partyId || null,
	);

	useEffect(() => {
		if (!open) return;
		setPartyId("");
		setPostingDate(today());
		setTypeId(NONE);
		setSelected([]);
		setRate("");
		setFee("");
	}, [open]);

	// كل فاتورة متأخّرة مختارة افتراضيًا: الحالة الشائعة ملاحقة الكلّ، والاستثناء يُلغى بنقرة
	useEffect(() => {
		setSelected(overdue.map((row) => row.salesInvoiceId));
	}, [overdue]);

	const activeType = types.find((type) => type.id === typeId);
	const chosen = overdue.filter((row) => selected.includes(row.salesInvoiceId));
	const chosenTotal = sumAmountStrings(chosen.map((row) => row.outstanding));

	const rateInvalid = rate.trim() !== "" && !AMOUNT_PATTERN.test(rate.trim());
	const feeInvalid = fee.trim() !== "" && !AMOUNT_PATTERN.test(fee.trim());
	const blocked = !partyId || chosen.length === 0 || rateInvalid || feeInvalid;

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (blocked) return;
		createDunning({
			partyType: "Owner",
			partyId,
			postingDate,
			typeId: typeId === NONE ? null : typeId,
			salesInvoiceIds: selected,
			// حقل فارغ = خُذ قيمة النوع؛ إرسال "0" يعني «صفر صراحةً» وهما ليسا سواء
			rateOfInterest: rate.trim() === "" ? null : rate.trim(),
			dunningFee: fee.trim() === "" ? null : fee.trim(),
		});
		onOpenChange(false);
	};

	const partyLabel = (id: string) => customers.find((p) => p.partyId === id)?.name ?? id;

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title="مطالبة جديدة"
			description="تجمع فواتير العميل المتأخّرة حتى تاريخ المطالبة وتُسعّر التأخير. تُنشأ مسودّة — لا شيء يُرحَّل حتى الاعتماد."
			onSubmit={onSubmit}
			isSaving={isPending}
			submitLabel="إنشاء مسودّة"
			submitDisabled={blocked}
			wide
		>
			<Field>
				<Label>
					العميل <span className="text-rose-500">*</span>
				</Label>
				<Combobox
					value={partyId}
					onValueChange={(value) => setPartyId(typeof value === "string" ? value : "")}
				>
					<ComboboxTrigger
						className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-1.5 text-sm"
						aria-disabled={isPending}
					>
						<ComboboxValue
							placeholder="اختر العميل…"
							className="truncate"
						>
							{partyId ? partyLabel(partyId) : undefined}
						</ComboboxValue>
					</ComboboxTrigger>
					<ComboboxContent dir="rtl">
						<ComboboxList>
							{customers.length === 0 ? (
								<ComboboxEmpty>لا عملاء مسجّلون في الأطراف</ComboboxEmpty>
							) : (
								customers.map((party) => (
									<ComboboxItem
										key={party.partyId}
										value={party.partyId}
									>
										<span className="truncate">{party.name}</span>
									</ComboboxItem>
								))
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			<Field>
				<Label>
					تاريخ المطالبة <span className="text-rose-500">*</span>
				</Label>
				<DateField
					value={postingDate}
					onChange={setPostingDate}
					placeholder="اختر التاريخ..."
					triggerDisabled={isPending}
				/>
				<p className="text-muted-foreground text-xs">
					أيام التأخير والفائدة تُحسب حتى هذا التاريخ، لا حتى اليوم.
				</p>
			</Field>

			<Field>
				<Label>نوع المطالبة</Label>
				<Combobox
					value={typeId}
					onValueChange={(value) => setTypeId(typeof value === "string" ? value : NONE)}
				>
					<ComboboxTrigger
						className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-1.5 text-sm"
						aria-disabled={isPending}
					>
						<ComboboxValue
							placeholder="بلا نوع — بلا فائدة ولا رسم ما لم تُدخلهما يدويًا"
							className="truncate"
						>
							{activeType?.title}
						</ComboboxValue>
					</ComboboxTrigger>
					<ComboboxContent dir="rtl">
						<ComboboxList>
							<ComboboxItem value={NONE}>— بلا نوع —</ComboboxItem>
							{types.length === 0 ? (
								<ComboboxEmpty>لا أنواع بعد</ComboboxEmpty>
							) : (
								types.map((type) => (
									<ComboboxItem
										key={type.id}
										value={type.id}
									>
										<span className="truncate">{type.title}</span>
										<span
											dir="ltr"
											className="ms-auto font-mono text-[10px] text-muted-foreground"
										>
											{String(type.rateOfInterest)}% · {String(type.dunningFee)}
										</span>
									</ComboboxItem>
								))
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			<div className="grid grid-cols-2 gap-3">
				<Field data-invalid={rateInvalid}>
					<Label>نسبة الفائدة السنوية</Label>
					<Input
						dir="ltr"
						inputMode="decimal"
						className="text-end tabular-nums"
						placeholder={activeType ? String(activeType.rateOfInterest) : "0"}
						value={rate}
						onChange={(event) => setRate(event.target.value)}
						aria-invalid={rateInvalid}
						disabled={isPending}
					/>
				</Field>
				<Field data-invalid={feeInvalid}>
					<Label>رسم المطالبة</Label>
					<Input
						dir="ltr"
						inputMode="decimal"
						className="text-end tabular-nums"
						placeholder={activeType ? String(activeType.dunningFee) : "0"}
						value={fee}
						onChange={(event) => setFee(event.target.value)}
						aria-invalid={feeInvalid}
						disabled={isPending}
					/>
				</Field>
			</div>
			<p className="-mt-2 text-muted-foreground text-xs">
				اترك الحقلين فارغين ليؤخذا من النوع. الرسم يُفرض مرّة واحدة على المطالبة كلّها، لا مرّة لكل
				فاتورة؛ الفائدة بسيطة وتُحسب لكل فاتورة من تاريخ استحقاقها.
			</p>

			<Field>
				<Label>الفواتير المتأخّرة</Label>
				{!partyId ? (
					<p className="py-4 text-center text-muted-foreground text-sm">
						اختر عميلًا لعرض فواتيره المتأخّرة.
					</p>
				) : overdueLoading ? (
					<p className="py-4 text-center text-muted-foreground text-sm">جارٍ السحب…</p>
				) : overdue.length === 0 ? (
					<p className="py-4 text-center text-muted-foreground text-sm">
						لا فواتير متأخّرة لهذا العميل حتى هذا التاريخ — لا شيء يُطالَب به.
					</p>
				) : (
					<div className="space-y-1 rounded-[4px] border p-2">
						{overdue.map((row) => {
							const checked = selected.includes(row.salesInvoiceId);
							return (
								<label
									key={row.salesInvoiceId}
									htmlFor={`overdue-${row.salesInvoiceId}`}
									className="flex cursor-pointer items-center gap-2 rounded-[4px] px-1.5 py-1 text-xs hover:bg-muted/50"
								>
									<Checkbox
										id={`overdue-${row.salesInvoiceId}`}
										checked={checked}
										onCheckedChange={(next) =>
											setSelected((prev) =>
												next === true
													? [...prev, row.salesInvoiceId]
													: prev.filter((id) => id !== row.salesInvoiceId),
											)
										}
										disabled={isPending}
									/>
									<span className="truncate font-medium">{row.invoiceNo}</span>
									<span className="text-muted-foreground">
										استحقّت {formatDisplayDate(row.dueDate)} · متأخّرة {row.overdueDays} يومًا
									</span>
									<span className="ms-auto tabular-nums">{formatAmount(row.outstanding)}</span>
								</label>
							);
						})}
						<div className="flex items-center justify-between border-t px-1.5 pt-2 text-xs">
							<span className="font-medium">
								المختار {chosen.length} من {overdue.length}
							</span>
							<span className="font-medium tabular-nums">{formatAmount(chosenTotal)}</span>
						</div>
					</div>
				)}
			</Field>
		</AccountingFormSheet>
	);
};

/* ── the type that prices it ──────────────────────────────────────────────────────────── */

export const DunningTypeSheet = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { createDunningType, isPending } = useCreateDunningType();
	const { accounts } = useAccounts();

	const [title, setTitle] = useState("");
	const [rate, setRate] = useState("0");
	const [fee, setFee] = useState("0");
	const [letterBody, setLetterBody] = useState("");
	const [incomeAccountId, setIncomeAccountId] = useState<string>(NONE);

	useEffect(() => {
		if (!open) return;
		setTitle("");
		setRate("0");
		setFee("0");
		setLetterBody("");
		setIncomeAccountId(NONE);
	}, [open]);

	// إيراد الفائدة والرسم يذهب إلى حساب دخل — نفس مرآة الأوراق القابلة للترحيل
	const income = accounts.filter(
		(a) => !a.isGroup && !a.freezeAccount && !a.disabled && a.rootType === "INCOME",
	);
	const accountLabel = (id: string) => {
		const account = accounts.find((a) => a.id === id);
		if (!account) return id;
		return account.accountNumber
			? `${account.accountName} (${account.accountNumber})`
			: account.accountName;
	};

	const titleInvalid = title.trim() === "";
	const rateInvalid = !AMOUNT_PATTERN.test(rate.trim());
	const feeInvalid = !AMOUNT_PATTERN.test(fee.trim());

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (titleInvalid || rateInvalid || feeInvalid) return;
		createDunningType({
			title: title.trim(),
			rateOfInterest: rate.trim(),
			dunningFee: fee.trim(),
			letterBody: letterBody.trim() || null,
			incomeAccountId: incomeAccountId === NONE ? null : incomeAccountId,
		});
		onOpenChange(false);
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title="نوع مطالبة جديد"
			description="النوع يحمل تسعيرة التأخير: نسبة فائدة سنوية ورسمًا ثابتًا، وحساب الدخل الذي يستقبلهما عند الاعتماد."
			onSubmit={onSubmit}
			isSaving={isPending}
			submitLabel="إنشاء"
			submitDisabled={titleInvalid || rateInvalid || feeInvalid}
		>
			<Field data-invalid={titleInvalid}>
				<Label>
					العنوان <span className="text-rose-500">*</span>
				</Label>
				<Input
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder="مثال: تذكير أوّل"
					aria-invalid={titleInvalid}
					disabled={isPending}
				/>
			</Field>

			<div className="grid grid-cols-2 gap-3">
				<Field data-invalid={rateInvalid}>
					<Label>
						نسبة الفائدة السنوية <span className="text-rose-500">*</span>
					</Label>
					<Input
						dir="ltr"
						inputMode="decimal"
						className="text-end tabular-nums"
						value={rate}
						onChange={(event) => setRate(event.target.value)}
						aria-invalid={rateInvalid}
						disabled={isPending}
					/>
				</Field>
				<Field data-invalid={feeInvalid}>
					<Label>
						رسم المطالبة <span className="text-rose-500">*</span>
					</Label>
					<Input
						dir="ltr"
						inputMode="decimal"
						className="text-end tabular-nums"
						value={fee}
						onChange={(event) => setFee(event.target.value)}
						aria-invalid={feeInvalid}
						disabled={isPending}
					/>
				</Field>
			</div>

			<Field>
				<Label>حساب الدخل</Label>
				<Combobox
					value={incomeAccountId}
					onValueChange={(value) =>
						setIncomeAccountId(typeof value === "string" ? value : NONE)
					}
				>
					<ComboboxTrigger
						className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-1.5 text-sm"
						aria-disabled={isPending}
					>
						<ComboboxValue
							placeholder="افتراضي — حساب الدخل من إعدادات المحاسبة"
							className="truncate"
						>
							{incomeAccountId === NONE ? undefined : accountLabel(incomeAccountId)}
						</ComboboxValue>
					</ComboboxTrigger>
					<ComboboxContent dir="rtl">
						<ComboboxList>
							<ComboboxItem value={NONE}>— الافتراضي —</ComboboxItem>
							{income.length === 0 ? (
								<ComboboxEmpty>لا حسابات دخل قابلة للترحيل</ComboboxEmpty>
							) : (
								income.map((account) => (
									<ComboboxItem
										key={account.id}
										value={account.id}
									>
										<span className="truncate">{accountLabel(account.id)}</span>
									</ComboboxItem>
								))
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			<Field>
				<Label>نصّ الخطاب</Label>
				<Textarea
					value={letterBody}
					onChange={(event) => setLetterBody(event.target.value)}
					placeholder="اختياري — النصّ الذي يُرفق بالمطالبة"
					rows={4}
					disabled={isPending}
				/>
			</Field>
		</AccountingFormSheet>
	);
};
