import { zodResolver } from "@hookform/resolvers/zod";
import { IconDownload, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useCostCenters } from "@/features/accounting/cost-centers/hooks/use-cost-centers";
import { useModesOfPayment } from "@/features/accounting/modes-of-payment/hooks/use-modes-of-payment";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import { useGetOutstanding } from "@/features/accounting/payment-entries/hooks/use-payment-entries";
import {
	PAYMENT_TYPE_APPEARANCE,
	paymentEntryStatusAppearance,
} from "@/features/accounting/utils/accounting-status";
import {
	diffAmountStrings,
	sumAmountStrings,
} from "@/features/accounting/utils/amount-strings";
import { formatAmount, formatMoney } from "@/features/accounting/utils/format-amount";
import {
	type CreatePaymentEntryFormInput,
	type CreatePaymentEntryFormValues,
	createPaymentEntrySchema,
	type PaymentEntryResponse,
	PaymentType,
	type PeReferenceDoctype,
} from "@sanad/contracts/runtime/server/accounting/payment-entry/payment-entry.type";

/**
 * [P7.9] The Payment Entry form (BRD §7.4): type + party header per BR-7.4.1, the
 * mode-of-payment defaulting note (FR-7.5.4 — the server resolves the account when the
 * leg is left empty), «جلب المستحقات» pulling the FR-7.5.1 dialog into the references
 * grid, deductions, and the totals ribbon. All figures the ribbon shows are STRING sums
 * (C2 — no JS floats); the server recomputes and re-validates everything at save/submit.
 */

const todayString = () => new Date().toISOString().slice(0, 10);

const DEFAULTS: CreatePaymentEntryFormInput = {
	paymentType: "RECEIVE",
	postingDate: todayString(),
	partyType: "Owner",
	partyId: "",
	paidAmount: "0",
	references: [],
	deductions: [],
};

export type PaymentEntrySheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editing: PaymentEntryResponse | null;
	onSave: (values: CreatePaymentEntryFormValues) => void;
	isSaving: boolean;
};

const toFormValues = (entry: PaymentEntryResponse): CreatePaymentEntryFormInput => ({
	paymentType: entry.paymentType,
	postingDate: entry.postingDate.toString().slice(0, 10),
	partyType: entry.partyType,
	partyId: entry.partyId,
	modeOfPaymentId: entry.modeOfPaymentId,
	paidFromId: entry.paidFromId,
	paidToId: entry.paidToId,
	paidAmount: entry.paidAmount.toString(),
	receivedAmount: entry.receivedAmount.toString(),
	referenceNo: entry.referenceNo,
	referenceDate: entry.referenceDate ? entry.referenceDate.toString().slice(0, 10) : null,
	costCenterId: entry.costCenterId,
	remarks: entry.remarks,
	references: entry.references.map((row) => ({
		referenceDoctype: row.referenceDoctype as PeReferenceDoctype,
		referenceId: row.referenceId,
		allocatedAmount: row.allocatedAmount.toString(),
	})),
	deductions: entry.deductions.map((row) => ({
		accountId: row.accountId,
		costCenterId: row.costCenterId,
		amount: row.amount.toString(),
	})),
});

export const PaymentEntrySheet = ({
	open,
	onOpenChange,
	editing,
	onSave,
	isSaving,
}: PaymentEntrySheetProps) => {
	const { parties } = useParties();
	const { accounts } = useAccounts();
	const { costCenters } = useCostCenters();
	const { modes } = useModesOfPayment();
	const { fetchOutstanding, isFetching } = useGetOutstanding();

	const leafAccounts = accounts.filter((account) => !account.isGroup);
	const cashBankAccounts = leafAccounts.filter(
		(account) => account.accountType === "BANK" || account.accountType === "CASH",
	);
	const leafCostCenters = costCenters.filter((costCenter) => !costCenter.isGroup);

	const readOnly = editing !== null && editing.docstatus !== "DRAFT";

	const {
		register,
		control,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm<CreatePaymentEntryFormInput, unknown, CreatePaymentEntryFormValues>({
		resolver: zodResolver(createPaymentEntrySchema),
		defaultValues: DEFAULTS,
	});
	const references = useFieldArray({ control, name: "references" });
	const deductions = useFieldArray({ control, name: "deductions" });
	const paymentType = useWatch({ control, name: "paymentType" }) ?? "RECEIVE";
	const partyId = useWatch({ control, name: "partyId" });
	const paidAmount = useWatch({ control, name: "paidAmount" }) ?? "0";
	const watchedReferences = useWatch({ control, name: "references" }) ?? [];

	const isTransfer = paymentType === "INTERNAL_TRANSFER";
	const partySide = paymentType === "RECEIVE" ? "Owner" : "Supplier";
	const partyOptions = parties.filter((party) => party.partyType === partySide);

	useEffect(() => {
		if (!open) return;
		if (editing) reset(toFormValues(editing));
		else reset(DEFAULTS);
	}, [open, editing, reset]);

	/** FR-7.5.1 — pull the party's outstanding invoices into the references grid */
	const pullOutstanding = async () => {
		const values = getValues();
		if (!values.partyId) return;
		const result = await fetchOutstanding({
			partyType: partySide,
			partyId: values.partyId,
		});
		references.replace(
			result.invoices.map((row) => ({
				referenceDoctype: row.voucherType as PeReferenceDoctype,
				referenceId: row.voucherId,
				allocatedAmount: row.outstanding,
			})),
		);
	};

	const onSubmit = handleSubmit((values) => {
		onSave(values);
		onOpenChange(false);
	});

	// display-only string sums (C2 — the server owns the real math)
	const totalAllocated = sumAmountStrings(
		watchedReferences.map((row) => row?.allocatedAmount || "0"),
	);
	const unallocated = diffAmountStrings([paidAmount || "0"], [totalAllocated || "0"]);

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={
				editing
					? `${PAYMENT_TYPE_APPEARANCE[editing.paymentType].label} ${editing.documentNo ?? "(مسودة)"}`
					: "سند جديد"
			}
			description="الحسابات تُحل في الخادم (BR-7.4.1) والتخصيص يُعاد التحقق منه عند الترحيل بأقفال صفوف (BR-7.4.3)."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel={editing ? "حفظ المسودة" : "إنشاء المسودة"}
			submitDisabled={readOnly}
			wide
		>
			{editing ? (
				<div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 p-2">
					<Badge variant={paymentEntryStatusAppearance(editing.status).variant}>
						{paymentEntryStatusAppearance(editing.status).label}
					</Badge>
					<Badge variant={PAYMENT_TYPE_APPEARANCE[editing.paymentType].variant}>
						{PAYMENT_TYPE_APPEARANCE[editing.paymentType].label}
					</Badge>
					<span
						className="ms-auto text-muted-foreground text-xs"
						dir="ltr"
					>
						غير المخصص: {formatMoney(editing.unallocatedAmount?.toString())}
					</span>
				</div>
			) : null}

			{/* header — type drives the BR-7.4.1 sides */}
			<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
				<Controller
					name="paymentType"
					control={control}
					render={({ field }) => (
						<Field>
							<Label>نوع السند</Label>
							<Select
								value={field.value}
								onValueChange={(value) => {
									field.onChange(value);
									references.replace([]);
								}}
								disabled={readOnly || editing !== null}
								dir="rtl"
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.values(PaymentType).map((type) => (
										<SelectItem
											key={type}
											value={type}
										>
											{PAYMENT_TYPE_APPEARANCE[type].label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					)}
				/>
				<Field data-invalid={!!errors.postingDate}>
					<Label>تاريخ الترحيل</Label>
					<Input
						dir="ltr"
						type="date"
						disabled={readOnly}
						{...register("postingDate")}
					/>
					<FieldError errors={[errors.postingDate]} />
				</Field>
				{!isTransfer && (
					<Controller
						name="partyId"
						control={control}
						render={({ field }) => (
							<Field
								data-invalid={!!errors.partyId}
								className="col-span-2"
							>
								<Label>
									{partySide === "Owner" ? "العميل" : "المورد"}{" "}
									<span className="text-rose-500">*</span>
								</Label>
								<Select
									value={field.value ?? ""}
									onValueChange={field.onChange}
									disabled={readOnly}
									dir="rtl"
								>
									<SelectTrigger>
										<SelectValue placeholder="اختر الطرف..." />
									</SelectTrigger>
									<SelectContent>
										{partyOptions.map((party) => (
											<SelectItem
												key={party.partyId}
												value={party.partyId}
											>
												{party.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError errors={[errors.partyId ?? undefined]} />
							</Field>
						)}
					/>
				)}
				<Controller
					name="modeOfPaymentId"
					control={control}
					render={({ field }) => (
						<Field>
							<Label>وسيلة الدفع</Label>
							<Select
								value={field.value ?? "__none__"}
								onValueChange={(value) => field.onChange(value === "__none__" ? null : value)}
								disabled={readOnly}
								dir="rtl"
							>
								<SelectTrigger>
									<SelectValue placeholder="—" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__none__">— بدون —</SelectItem>
									{modes.map((mode) => (
										<SelectItem
											key={mode.id}
											value={mode.id}
										>
											{mode.modeOfPaymentName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					)}
				/>
				{/* the company-side leg; empty ⇒ FR-7.5.4 resolves it from the MoP */}
				<Controller
					name={paymentType === "PAY" || isTransfer ? "paidFromId" : "paidToId"}
					control={control}
					render={({ field }) => (
						<Field className="col-span-2">
							<Label>
								{isTransfer ? "الحساب المحوَّل منه" : "حساب البنك/النقد"}
								{isTransfer ? <span className="text-rose-500"> *</span> : null}
							</Label>
							<Combobox
								value={field.value ?? ""}
								onValueChange={(value) =>
									field.onChange(typeof value === "string" && value !== "" ? value : null)
								}
							>
								<ComboboxTrigger
									disabled={readOnly}
									className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-2 text-sm"
								>
									<ComboboxValue
										placeholder="افتراضي وسيلة الدفع"
										className="truncate"
									>
										{cashBankAccounts.find((a) => a.id === field.value)?.accountName}
									</ComboboxValue>
								</ComboboxTrigger>
								<ComboboxContent dir="rtl">
									<ComboboxList>
										{cashBankAccounts.length === 0 ? (
											<ComboboxEmpty>لا حسابات بنك/نقد</ComboboxEmpty>
										) : (
											cashBankAccounts.map((account) => (
												<ComboboxItem
													key={account.id}
													value={account.id}
												>
													<span className="truncate">{account.accountName}</span>
												</ComboboxItem>
											))
										)}
									</ComboboxList>
								</ComboboxContent>
							</Combobox>
						</Field>
					)}
				/>
				{isTransfer && (
					<Controller
						name="paidToId"
						control={control}
						render={({ field }) => (
							<Field className="col-span-2">
								<Label>
									الحساب المحوَّل إليه <span className="text-rose-500">*</span>
								</Label>
								<Combobox
									value={field.value ?? ""}
									onValueChange={(value) =>
										field.onChange(typeof value === "string" && value !== "" ? value : null)
									}
								>
									<ComboboxTrigger
										disabled={readOnly}
										className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-2 text-sm"
									>
										<ComboboxValue
											placeholder="اختر الحساب..."
											className="truncate"
										>
											{cashBankAccounts.find((a) => a.id === field.value)?.accountName}
										</ComboboxValue>
									</ComboboxTrigger>
									<ComboboxContent dir="rtl">
										<ComboboxList>
											{cashBankAccounts.map((account) => (
												<ComboboxItem
													key={account.id}
													value={account.id}
												>
													<span className="truncate">{account.accountName}</span>
												</ComboboxItem>
											))}
										</ComboboxList>
									</ComboboxContent>
								</Combobox>
							</Field>
						)}
					/>
				)}
				<Field data-invalid={!!errors.paidAmount}>
					<Label>المبلغ</Label>
					<Input
						dir="ltr"
						inputMode="decimal"
						className="text-end tabular-nums"
						disabled={readOnly}
						{...register("paidAmount")}
					/>
					<FieldError errors={[errors.paidAmount]} />
				</Field>
				<Field>
					<Label>المبلغ المستلم (فرقه بالخصومات)</Label>
					<Input
						dir="ltr"
						inputMode="decimal"
						className="text-end tabular-nums"
						placeholder="= المبلغ"
						disabled={readOnly}
						{...register("receivedAmount", {
							setValueAs: (v: string) => (v === "" ? null : v),
						})}
					/>
				</Field>
				<Field>
					<Label>رقم المرجع (إلزامي للبنوك)</Label>
					<Input
						dir="ltr"
						disabled={readOnly}
						{...register("referenceNo")}
					/>
				</Field>
				<Field>
					<Label>تاريخ المرجع</Label>
					<Input
						dir="ltr"
						type="date"
						disabled={readOnly}
						{...register("referenceDate", {
							setValueAs: (v: string) => (v === "" ? null : v),
						})}
					/>
				</Field>
				<Field className="col-span-2">
					<Label>ملاحظات</Label>
					<Input
						disabled={readOnly}
						{...register("remarks")}
					/>
				</Field>
			</div>

			{/* references — FR-7.5.1 pull + BR-7.4.3 allocations */}
			{!isTransfer && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label>التخصيص على المستندات</Label>
						{!readOnly && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={pullOutstanding}
								disabled={isFetching || !partyId}
							>
								<IconDownload className="size-4" />
								جلب المستحقات
							</Button>
						)}
					</div>
					{references.fields.length === 0 ? (
						<p className="rounded-md border border-border border-dashed p-3 text-muted-foreground text-xs">
							بلا تخصيص، يبقى كامل المبلغ دفعة مقدمة للطرف (is_advance) — تُخصَّص لاحقًا من
							الفاتورة أو من شاشة تسوية المدفوعات.
						</p>
					) : (
						references.fields.map((row, index) => (
							<div
								key={row.id}
								className="flex items-center gap-2 rounded-md border border-border p-2"
							>
								<span
									className="flex-1 truncate font-mono text-xs"
									dir="ltr"
								>
									{watchedReferences[index]?.referenceId}
								</span>
								<Field className="w-32">
									<Input
										dir="ltr"
										inputMode="decimal"
										className="text-end tabular-nums"
										disabled={readOnly}
										aria-label="المبلغ المخصص"
										{...register(`references.${index}.allocatedAmount`)}
									/>
								</Field>
								{!readOnly && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="text-muted-foreground"
										aria-label="حذف السطر"
										onClick={() => references.remove(index)}
									>
										<IconTrash className="size-4" />
									</Button>
								)}
							</div>
						))
					)}
				</div>
			)}

			{/* deductions — §7.4 signed rows */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label>الخصومات (رسوم بنكية ونحوها)</Label>
					{!readOnly && (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() =>
								deductions.append({ accountId: "", costCenterId: "", amount: "0" })
							}
						>
							<IconPlus className="size-4" />
							سطر
						</Button>
					)}
				</div>
				{deductions.fields.map((row, index) => (
					<div
						key={row.id}
						className="flex items-start gap-2 rounded-md border border-border p-2"
					>
						<Controller
							name={`deductions.${index}.accountId`}
							control={control}
							render={({ field }) => (
								<Field className="flex-1">
									<Select
										value={field.value ?? ""}
										onValueChange={field.onChange}
										disabled={readOnly}
										dir="rtl"
									>
										<SelectTrigger>
											<SelectValue placeholder="الحساب *" />
										</SelectTrigger>
										<SelectContent>
											{leafAccounts.map((account) => (
												<SelectItem
													key={account.id}
													value={account.id}
												>
													{account.accountName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>
						<Controller
							name={`deductions.${index}.costCenterId`}
							control={control}
							render={({ field }) => (
								<Field className="w-44">
									<Select
										value={field.value ?? ""}
										onValueChange={field.onChange}
										disabled={readOnly}
										dir="rtl"
									>
										<SelectTrigger aria-label="مركز التكلفة">
											<SelectValue placeholder="مركز التكلفة *" />
										</SelectTrigger>
										<SelectContent>
											{leafCostCenters.map((costCenter) => (
												<SelectItem
													key={costCenter.id}
													value={costCenter.id}
												>
													{costCenter.costCenterName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>
						<Field className="w-28">
							<Input
								dir="ltr"
								inputMode="decimal"
								className="text-end tabular-nums"
								disabled={readOnly}
								aria-label="المبلغ (موجب = مدين)"
								{...register(`deductions.${index}.amount`)}
							/>
						</Field>
						{!readOnly && (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="text-muted-foreground"
								aria-label="حذف السطر"
								onClick={() => deductions.remove(index)}
							>
								<IconTrash className="size-4" />
							</Button>
						)}
					</div>
				))}
			</div>

			{/* ribbon — display-only string sums; the server recomputes at save (BR-7.4.2) */}
			<div className="sticky bottom-0 z-10 -mx-4 border-border border-t bg-background/95 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
				<dl
					className="flex items-center justify-end gap-4 text-xs"
					dir="ltr"
				>
					<div className="flex flex-col items-end">
						<dt className="text-[10px] text-muted-foreground">المخصص</dt>
						<dd className="tabular-nums">{formatAmount(totalAllocated)}</dd>
					</div>
					<div className="flex flex-col items-end">
						<dt className="text-[10px] text-muted-foreground">غير المخصص (دفعة مقدمة)</dt>
						<dd className="tabular-nums">{formatAmount(unallocated)}</dd>
					</div>
					<div className="flex flex-col items-end">
						<dt className="text-[10px] text-muted-foreground">المبلغ</dt>
						<dd className="font-semibold text-sm tabular-nums">{formatMoney(paidAmount)}</dd>
					</div>
				</dl>
			</div>
		</AccountingFormSheet>
	);
};
