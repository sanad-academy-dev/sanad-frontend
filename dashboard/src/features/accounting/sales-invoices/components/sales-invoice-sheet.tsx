import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalculator, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useCostCenters } from "@/features/accounting/cost-centers/hooks/use-cost-centers";
import { useStatusLabel } from "@/features/accounting/hooks/use-status-label";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import { usePaymentTermsTemplates } from "@/features/accounting/payment-terms/hooks/use-payment-terms";
import { CHARGE_TYPE_LABEL } from "@/features/accounting/taxes/components/tax-template-sheet";
import {
	useItemTaxTemplates,
	useSalesTaxTemplates,
	useTaxPreview,
} from "@/features/accounting/taxes/hooks/use-taxes";
import { salesInvoiceStatusAppearance } from "@/features/accounting/utils/accounting-status";
import {
	formatAmount,
	formatDisplayDate,
	formatMoney,
} from "@/features/accounting/utils/format-amount";
import {
	type CreateSalesInvoiceFormInput,
	type CreateSalesInvoiceFormValues,
	createSalesInvoiceSchema,
	type SalesInvoiceResponse,
	TaxChargeType,
} from "@sanad/contracts/runtime/server/accounting/sales-invoice/sales-invoice.type";
import type { CalcResult } from "@/server/accounting/tax/tax-calculator";

/**
 * [P5.7] The Sales Invoice form (BRD §7.2): customer header, item grid, taxes panel with
 * template-apply + add-row, discount block, totals card, schedule/advances sections and a
 * status ribbon. Totals are NEVER computed here — «احسب» round-trips the P4 §8 engine via
 * the preview endpoint, and save persists the server's own calculation.
 */

const EMPTY_ITEM: CreateSalesInvoiceFormInput["items"][number] = {
	itemName: "",
	qty: "1",
	rate: "0",
	incomeAccountId: "",
	costCenterId: "",
};

const todayString = () => new Date().toISOString().slice(0, 10);

const DEFAULTS: CreateSalesInvoiceFormInput = {
	postingDate: todayString(),
	partyType: "Owner",
	partyId: "",
	items: [EMPTY_ITEM],
	taxes: [],
	schedule: [],
};

/**
 * [P5-UI-fix] The status label/variant map used to live here, which meant the list and the
 * sheet each owned a copy. It now lives in `utils/accounting-status.ts` beside the docstatus
 * map — one source for every accounting screen.
 */

export type SalesInvoiceSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** editing an existing draft (or viewing); null = new invoice */
	editing: SalesInvoiceResponse | null;
	/** pre-fill (e.g. «إنشاء مرتجع») — overrides DEFAULTS for a NEW draft */
	prefill: CreateSalesInvoiceFormValues | null;
	onSave: (values: CreateSalesInvoiceFormValues) => void;
	isSaving: boolean;
};

const toFormValues = (invoice: SalesInvoiceResponse): CreateSalesInvoiceFormInput => ({
	postingDate: invoice.postingDate.toString().slice(0, 10),
	dueDate: invoice.dueDate ? invoice.dueDate.toString().slice(0, 10) : null,
	partyType: invoice.partyType,
	partyId: invoice.partyId,
	debitToId: invoice.debitToId,
	isReturn: invoice.isReturn,
	returnAgainstId: invoice.returnAgainstId,
	isOpening: invoice.isOpening,
	poNo: invoice.poNo,
	taxesAndChargesTemplateId: invoice.taxesAndChargesTemplateId,
	applyDiscountOn: invoice.applyDiscountOn,
	additionalDiscountPercentage: invoice.additionalDiscountPercentage.toString(),
	discountAmount: invoice.discountAmount.toString(),
	disableRoundedTotal: invoice.disableRoundedTotal,
	paymentTermsTemplateId: invoice.paymentTermsTemplateId,
	ignoreDefaultPaymentTermsTemplate: invoice.ignoreDefaultPaymentTermsTemplate,
	remarks: invoice.remarks,
	items: invoice.items.map((item) => ({
		itemCode: item.itemCode,
		itemName: item.itemName,
		description: item.description,
		qty: item.qty.toString(),
		rate: item.rate.toString(),
		discountPercentage: item.discountPercentage?.toString() ?? null,
		isFreeItem: item.isFreeItem,
		incomeAccountId: item.incomeAccountId,
		costCenterId: item.costCenterId,
		itemTaxTemplateId: item.itemTaxTemplateId,
	})),
	taxes: invoice.taxes.map((row) => ({
		chargeType: row.chargeType,
		accountHeadId: row.accountHeadId,
		rate: row.rate.toString(),
		taxAmount: row.chargeType === "ACTUAL" ? row.taxAmount.toString() : "0",
		rowId: row.rowId,
		description: row.description,
		includedInPrintRate: row.includedInPrintRate,
	})),
	schedule: [],
});

export const SalesInvoiceSheet = ({
	open,
	onOpenChange,
	editing,
	prefill,
	onSave,
	isSaving,
}: SalesInvoiceSheetProps) => {
	const statusLabel = useStatusLabel();
	const { parties } = useParties();
	const { accounts } = useAccounts();
	const { costCenters } = useCostCenters();
	const { rows: salesTemplates } = useSalesTaxTemplates();
	const { rows: itemTaxTemplates } = useItemTaxTemplates();
	const { templates: termsTemplates } = usePaymentTermsTemplates();
	const { preview, isCalculating } = useTaxPreview();
	const [previewResult, setPreviewResult] = useState<CalcResult | null>(null);

	// sales side is always a receivable party — «Owner» in v1 (contract C6)
	const customers = parties.filter((party) => party.partyType === "Owner");
	const leafAccounts = accounts.filter((account) => !account.isGroup);
	const leafCostCenters = costCenters.filter((costCenter) => !costCenter.isGroup);

	const readOnly = editing !== null && editing.docstatus !== "DRAFT";

	const {
		register,
		control,
		handleSubmit,
		reset,
		getValues,
		setValue,
		formState: { errors },
	} = useForm<CreateSalesInvoiceFormInput, unknown, CreateSalesInvoiceFormValues>({
		resolver: zodResolver(createSalesInvoiceSchema),
		defaultValues: DEFAULTS,
	});
	const items = useFieldArray({ control, name: "items" });
	const taxes = useFieldArray({ control, name: "taxes" });
	const watchedTaxes = useWatch({ control, name: "taxes" }) ?? [];
	const isReturn = useWatch({ control, name: "isReturn" }) ?? false;

	useEffect(() => {
		if (!open) return;
		setPreviewResult(null);
		if (editing) reset(toFormValues(editing));
		else if (prefill) reset(prefill);
		else reset(DEFAULTS);
	}, [open, editing, prefill, reset]);

	/** «تطبيق القالب» — copy the template's rows into the taxes grid (editable after). */
	const applyTaxTemplate = (templateId: string) => {
		setValue("taxesAndChargesTemplateId", templateId);
		const template = salesTemplates.find((t) => t.id === templateId);
		if (!template) return;
		taxes.replace(
			template.taxes.map((row) => ({
				chargeType: row.chargeType,
				accountHeadId: row.accountHeadId,
				rate: row.rate.toString(),
				taxAmount: "0",
				rowId: row.rowId,
				description: row.description,
				includedInPrintRate: row.includedInPrintRate,
				costCenterId: row.costCenterId,
			})),
		);
	};

	/** «احسب» — the §8 engine via the preview endpoint; zero local math (phase law). */
	const runPreview = async () => {
		const values = getValues();
		const result = await preview({
			applyDiscountOn: values.applyDiscountOn ?? "GRAND_TOTAL",
			discountAmount:
				values.discountAmount && values.discountAmount !== "0" ? values.discountAmount : null,
			isCashOrNonTradeDiscount: values.isCashOrNonTradeDiscount ?? false,
			items: (values.items ?? []).map((item, index) => ({
				key: String(index),
				qty: item.qty || "0",
				rate: item.rate || "0",
				discountPercentage: item.discountPercentage ?? null,
				isFreeItem: item.isFreeItem ?? false,
			})),
			taxes: (values.taxes ?? []).map((row, index) => ({
				key: String(index),
				chargeType: row.chargeType,
				accountHead: row.accountHeadId,
				rate: row.rate ?? "0",
				taxAmount: row.taxAmount ?? "0",
				rowId: row.rowId != null && `${row.rowId}` !== "" ? Number(row.rowId) : null,
				includedInPrintRate: row.includedInPrintRate ?? false,
			})),
		});
		setPreviewResult(result);
	};

	const onSubmit = handleSubmit((values) => {
		onSave(values);
		onOpenChange(false);
	});

	const totals = previewResult
		? {
				net: previewResult.netTotal,
				tax: previewResult.taxTotal,
				grand: previewResult.grandTotal,
				rounded: previewResult.roundedTotal,
			}
		: editing
			? {
					net: editing.netTotal.toString(),
					tax: editing.totalTaxesAndCharges.toString(),
					grand: editing.grandTotal.toString(),
					rounded: editing.roundedTotal.toString(),
				}
			: null;

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={
				editing
					? `فاتورة مبيعات ${editing.documentNo ?? "(مسودة)"}`
					: prefill?.isReturn
						? "إشعار دائن (مرتجع)"
						: "فاتورة مبيعات جديدة"
			}
			description="الإجماليات تُحسب في الخادم بمحرك §8 حصريًا — زر «احسب» للمعاينة."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel={editing ? "حفظ المسودة" : "إنشاء المسودة"}
			submitDisabled={readOnly}
			wide
		>
			{/* status ribbon */}
			{editing ? (
				<div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 p-2">
					<Badge variant={salesInvoiceStatusAppearance(editing.status).variant}>
						{statusLabel(salesInvoiceStatusAppearance(editing.status))}
					</Badge>
					{editing.isReturn && editing.returnAgainst?.documentNo ? (
						<span className="text-muted-foreground text-xs">
							مرتجع عن {editing.returnAgainst.documentNo}
						</span>
					) : null}
					<span
						className="ms-auto text-muted-foreground text-xs"
						dir="ltr"
					>
						المتبقي: {formatMoney(editing.outstandingAmount?.toString())}
					</span>
				</div>
			) : null}

			{/* customer header */}
			<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
				<Controller
					name="partyId"
					control={control}
					render={({ field }) => (
						<Field
							data-invalid={!!errors.partyId}
							className="col-span-2"
						>
							<Label>
								العميل <span className="text-rose-500">*</span>
							</Label>
							<Select
								value={field.value ?? ""}
								onValueChange={field.onChange}
								disabled={readOnly}
								dir="rtl"
							>
								<SelectTrigger>
									<SelectValue placeholder="اختر العميل..." />
								</SelectTrigger>
								<SelectContent>
									{customers.map((party) => (
										<SelectItem
											key={party.partyId}
											value={party.partyId}
										>
											{party.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError errors={[errors.partyId]} />
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
				<Field data-invalid={!!errors.dueDate}>
					<Label>تاريخ الاستحقاق</Label>
					<Input
						dir="ltr"
						type="date"
						disabled={readOnly}
						{...register("dueDate", { setValueAs: (v: string) => (v === "" ? null : v) })}
					/>
					<FieldError errors={[errors.dueDate ?? undefined]} />
				</Field>
				<Field>
					<Label>أمر شراء العميل (PO)</Label>
					<Input
						dir="ltr"
						disabled={readOnly}
						{...register("poNo")}
					/>
				</Field>
				<Controller
					name="paymentTermsTemplateId"
					control={control}
					render={({ field }) => (
						<Field>
							<Label>قالب شروط الدفع</Label>
							<Select
								value={field.value ?? "__none__"}
								onValueChange={(v) => field.onChange(v === "__none__" ? null : v)}
								disabled={readOnly || isReturn}
								dir="rtl"
							>
								<SelectTrigger>
									<SelectValue placeholder="السلسلة الافتراضية" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__none__">— الافتراضي (العميل ثم المنشأة) —</SelectItem>
									{termsTemplates.map((template) => (
										<SelectItem
											key={template.id}
											value={template.id}
										>
											{template.templateName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					)}
				/>
				<Controller
					name="isOpening"
					control={control}
					render={({ field }) => (
						<div className="flex items-end gap-2 pb-1.5">
							<Switch
								checked={field.value ?? false}
								onCheckedChange={field.onChange}
								disabled={readOnly}
								id="si-opening"
							/>
							<Label htmlFor="si-opening">فاتورة افتتاحية</Label>
						</div>
					)}
				/>
				<Field className="col-span-2">
					<Label>ملاحظات</Label>
					<Input
						disabled={readOnly}
						{...register("remarks")}
					/>
				</Field>
			</div>

			{/* item grid — G2/G3 pattern: labelled header row, then one flex row per item so
			    the controls line up in columns instead of reflowing inside a 12-col grid */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label>الأصناف</Label>
					{!readOnly && (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => items.append(EMPTY_ITEM)}
						>
							<IconPlus className="size-4" />
							صنف
						</Button>
					)}
				</div>

				{/* RTL flow: name (widest) → qty → rate → discount → delete */}
				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					<span className="flex-1">الصنف</span>
					<span className="w-16 text-center">الكمية</span>
					<span className="w-24 text-center">السعر</span>
					<span className="w-20 text-center">خصم %</span>
					{!readOnly && <span className="w-8" />}
				</div>

				{items.fields.map((row, index) => (
					<div
						key={row.id}
						className="space-y-1.5 rounded-md border border-border p-2"
					>
						<div className="flex items-start gap-2">
							<Field
								className="flex-1"
								data-invalid={!!errors.items?.[index]?.itemName}
							>
								<Input
									placeholder="اسم الصنف *"
									disabled={readOnly}
									aria-invalid={!!errors.items?.[index]?.itemName}
									{...register(`items.${index}.itemName`)}
								/>
							</Field>
							<Field
								className="w-16"
								data-invalid={!!errors.items?.[index]?.qty}
							>
								<Input
									dir="ltr"
									inputMode="decimal"
									className="text-end tabular-nums"
									disabled={readOnly}
									aria-label="الكمية"
									aria-invalid={!!errors.items?.[index]?.qty}
									{...register(`items.${index}.qty`)}
								/>
							</Field>
							<Field
								className="w-24"
								data-invalid={!!errors.items?.[index]?.rate}
							>
								<Input
									dir="ltr"
									inputMode="decimal"
									className="text-end tabular-nums"
									disabled={readOnly}
									aria-label="السعر"
									aria-invalid={!!errors.items?.[index]?.rate}
									{...register(`items.${index}.rate`)}
								/>
							</Field>
							<Field className="w-20">
								<Input
									dir="ltr"
									inputMode="decimal"
									className="text-end tabular-nums"
									disabled={readOnly}
									aria-label="نسبة الخصم"
									{...register(`items.${index}.discountPercentage`, {
										setValueAs: (v: string) => (v === "" ? null : v),
									})}
								/>
							</Field>
							{!readOnly && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="text-muted-foreground"
									aria-label="حذف الصنف"
									onClick={() => items.remove(index)}
									disabled={items.fields.length === 1}
								>
									<IconTrash className="size-4" />
								</Button>
							)}
						</div>

						{/* account row — Combobox (searchable) like the JE grid; a plain Select is
						    unusable once the chart passes a few dozen accounts */}
						<div className="flex items-start gap-2">
							<Controller
								name={`items.${index}.incomeAccountId`}
								control={control}
								render={({ field }) => (
									<Field
										className="flex-1"
										data-invalid={!!errors.items?.[index]?.incomeAccountId}
									>
										<Combobox
											value={field.value ?? ""}
											onValueChange={(value) =>
												field.onChange(typeof value === "string" ? value : "")
											}
										>
											<ComboboxTrigger
												disabled={readOnly}
												className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-2 text-sm"
											>
												<ComboboxValue
													placeholder="حساب الإيراد *"
													className="truncate"
												>
													{leafAccounts.find((a) => a.id === field.value)?.accountName}
												</ComboboxValue>
											</ComboboxTrigger>
											<ComboboxContent dir="rtl">
												<ComboboxList>
													{leafAccounts.length === 0 ? (
														<ComboboxEmpty>لا حسابات قابلة للترحيل</ComboboxEmpty>
													) : (
														leafAccounts.map((account) => (
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
							<Controller
								name={`items.${index}.costCenterId`}
								control={control}
								render={({ field }) => (
									<Field
										className="w-44"
										data-invalid={!!errors.items?.[index]?.costCenterId}
									>
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
							<Controller
								name={`items.${index}.itemTaxTemplateId`}
								control={control}
								render={({ field }) => (
									<Field className="w-40">
										<Select
											value={field.value ?? "__none__"}
											onValueChange={(v) => field.onChange(v === "__none__" ? null : v)}
											disabled={readOnly}
											dir="rtl"
										>
											<SelectTrigger aria-label="ضريبة الصنف">
												<SelectValue placeholder="ضريبة الصنف" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="__none__">— بدون تخصيص —</SelectItem>
												{itemTaxTemplates.map((template) => (
													<SelectItem
														key={template.id}
														value={template.id}
													>
														{template.title}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>
							{!readOnly && <span className="w-8 shrink-0" />}
						</div>
					</div>
				))}
				<FieldError errors={[errors.items?.root ?? errors.items]} />
			</div>

			{/* taxes panel */}
			<div className="space-y-2">
				<div className="flex items-center justify-between gap-2">
					<Label>الضرائب والرسوم</Label>
					<div className="flex items-center gap-2">
						<Controller
							name="taxesAndChargesTemplateId"
							control={control}
							render={({ field }) => (
								<Select
									value={field.value ?? ""}
									onValueChange={applyTaxTemplate}
									disabled={readOnly}
									dir="rtl"
								>
									<SelectTrigger className="h-8 w-44">
										<SelectValue placeholder="تطبيق قالب..." />
									</SelectTrigger>
									<SelectContent>
										{salesTemplates.map((template) => (
											<SelectItem
												key={template.id}
												value={template.id}
											>
												{template.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						{!readOnly && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() =>
									taxes.append({
										chargeType: "ON_NET_TOTAL",
										accountHeadId: "",
										rate: "0",
										taxAmount: "0",
										description: "",
										includedInPrintRate: false,
									})
								}
							>
								<IconPlus className="size-4" />
								سطر
							</Button>
						)}
					</div>
				</div>
				{taxes.fields.map((row, index) => {
					const chargeType = watchedTaxes[index]?.chargeType;
					return (
						<div
							key={row.id}
							className="grid grid-cols-2 items-start gap-2 rounded-md border border-border p-2 md:grid-cols-10"
						>
							<Controller
								name={`taxes.${index}.chargeType`}
								control={control}
								render={({ field }) => (
									<Field className="col-span-2 md:col-span-2">
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={readOnly}
											dir="rtl"
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.values(TaxChargeType).map((type) => (
													<SelectItem
														key={type}
														value={type}
													>
														{CHARGE_TYPE_LABEL[type] ?? type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>
							<Controller
								name={`taxes.${index}.accountHeadId`}
								control={control}
								render={({ field }) => (
									<Field
										className="col-span-2 md:col-span-3"
										data-invalid={!!errors.taxes?.[index]?.accountHeadId}
									>
										<Select
											value={field.value ?? ""}
											onValueChange={field.onChange}
											disabled={readOnly}
											dir="rtl"
										>
											<SelectTrigger>
												<SelectValue placeholder="حساب الضريبة *" />
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
							{chargeType === "ACTUAL" ? (
								<Field>
									<Input
										dir="ltr"
										placeholder="المبلغ"
										disabled={readOnly}
										{...register(`taxes.${index}.taxAmount`)}
									/>
								</Field>
							) : (
								<Field>
									<Input
										dir="ltr"
										placeholder="النسبة %"
										disabled={readOnly}
										{...register(`taxes.${index}.rate`)}
									/>
								</Field>
							)}
							{(chargeType === "ON_PREVIOUS_ROW_AMOUNT" ||
								chargeType === "ON_PREVIOUS_ROW_TOTAL") && (
								<Field>
									<Input
										dir="ltr"
										placeholder="سطر مرجعي"
										disabled={readOnly}
										{...register(`taxes.${index}.rowId`)}
									/>
								</Field>
							)}
							<Field
								className="col-span-2 md:col-span-2"
								data-invalid={!!errors.taxes?.[index]?.description}
							>
								<Input
									placeholder="الوصف *"
									disabled={readOnly}
									{...register(`taxes.${index}.description`)}
								/>
							</Field>
							<Controller
								name={`taxes.${index}.includedInPrintRate`}
								control={control}
								render={({ field }) => (
									<div className="flex items-center gap-1.5">
										<Switch
											checked={field.value ?? false}
											onCheckedChange={field.onChange}
											disabled={readOnly}
											id={`si-tax-incl-${index}`}
										/>
										<Label
											htmlFor={`si-tax-incl-${index}`}
											className="text-xs"
										>
											شاملة
										</Label>
									</div>
								)}
							/>
							{!readOnly && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="text-muted-foreground"
									onClick={() => taxes.remove(index)}
								>
									<IconTrash className="size-4" />
								</Button>
							)}
						</div>
					);
				})}
			</div>

			{/* discount block */}
			<div className="grid grid-cols-1 gap-3">
				<div className="space-y-2 rounded-md border border-border p-3">
					<Label>الخصم على مستوى الفاتورة (§8)</Label>
					<div className="grid grid-cols-3 gap-2">
						<Controller
							name="applyDiscountOn"
							control={control}
							render={({ field }) => (
								<Select
									value={field.value ?? "GRAND_TOTAL"}
									onValueChange={field.onChange}
									disabled={readOnly}
									dir="rtl"
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="GRAND_TOTAL">على الإجمالي</SelectItem>
										<SelectItem value="NET_TOTAL">على الصافي</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
						<Field data-invalid={!!errors.additionalDiscountPercentage}>
							<Input
								dir="ltr"
								placeholder="نسبة %"
								disabled={readOnly}
								{...register("additionalDiscountPercentage")}
							/>
						</Field>
						<Field data-invalid={!!errors.discountAmount}>
							<Input
								dir="ltr"
								placeholder="مبلغ"
								disabled={readOnly}
								{...register("discountAmount")}
							/>
						</Field>
					</div>
				</div>
			</div>

			{/* schedule + advances */}
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				<div className="space-y-1 rounded-md border border-border p-3">
					<Label>جدول الدفعات (BR-4.9.1)</Label>
					{editing && editing.schedule.length > 0 ? (
						<table className="w-full text-xs">
							<thead>
								<tr className="text-muted-foreground">
									<th className="py-1 text-start">الوصف</th>
									<th className="py-1 text-start">الاستحقاق</th>
									<th className="py-1 text-end">النسبة</th>
									<th className="py-1 text-end">المبلغ</th>
								</tr>
							</thead>
							<tbody>
								{editing.schedule.map((row) => (
									<tr
										key={row.id}
										className="border-border border-t"
									>
										<td className="py-1">{row.description ?? "—"}</td>
										{/* `dueDate.toString().slice(0, 10)` rendered "Sat Sep 05": a Date
										    stringifies to its locale form, not ISO. Same formatter as the list. */}
										<td
											className="py-1 ps-2 tabular-nums"
											dir="ltr"
										>
											{formatDisplayDate(row.dueDate?.toString())}
										</td>
										<td
											className="py-1 text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(row.invoicePortion?.toString())}%
										</td>
										<td
											className="py-1 text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(row.paymentAmount?.toString())}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p className="text-muted-foreground text-xs">
							يتولد تلقائيًا عند الحفظ من قالب الشروط (المستند ← العميل ← المنشأة).
						</p>
					)}
				</div>
				<div className="space-y-1 rounded-md border border-border p-3">
					<Label>الدفعات المقدمة (§11)</Label>
					<Controller
						name="allocateAdvancesAutomatically"
						control={control}
						render={({ field }) => (
							<div className="flex items-center gap-2 pt-1">
								<Switch
									checked={field.value ?? false}
									onCheckedChange={field.onChange}
									disabled={readOnly || isReturn}
									id="si-auto-advances"
								/>
								<Label
									htmlFor="si-auto-advances"
									className="text-xs"
								>
									تخصيص الدفعات المقدمة تلقائيًا (FIFO — FR-11.1)
								</Label>
							</div>
						)}
					/>
					{editing && editing.advances.length > 0 ? (
						<table className="w-full text-xs">
							<thead>
								<tr className="text-muted-foreground">
									<th className="py-1 text-start">المرجع</th>
									<th className="py-1 text-end">الرصيد</th>
									<th className="py-1 text-end">المخصص</th>
								</tr>
							</thead>
							<tbody>
								{editing.advances.map((row) => (
									<tr
										key={row.id}
										className="border-border border-t"
									>
										<td
											className="py-1 font-mono"
											dir="ltr"
										>
											{row.referenceId.slice(0, 10)}…
										</td>
										<td
											className="py-1 text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(row.advanceAmount?.toString())}
										</td>
										<td
											className="py-1 text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(row.allocatedAmount?.toString())}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p className="text-muted-foreground text-xs">
							تُسحب الأرصدة المفتوحة (سندات + قيود) عند الحفظ ويُعاد ربطها عند الترحيل (BR-11.2).
						</p>
					)}
				</div>
			</div>

			{/* Totals — sticky to the bottom of the scroll area so «احسب» and its result stay on
			    screen while items and taxes are being edited, instead of sitting below the fold.
			    Figures are §8 engine output verbatim; this card never computes. */}
			<div className="sticky bottom-0 z-10 -mx-4 border-border border-t bg-background/95 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<Label className="text-xs">الإجماليات (§8)</Label>
						<Button
							type="button"
							variant="outline"
							size="xs"
							onClick={runPreview}
							disabled={isCalculating}
						>
							<IconCalculator className="size-3.5" />
							احسب
						</Button>
					</div>

					{totals ? (
						<dl
							className="flex items-center gap-4 text-xs"
							dir="ltr"
						>
							<div className="flex flex-col items-end">
								<dt className="text-[10px] text-muted-foreground">الصافي</dt>
								<dd className="tabular-nums">{formatAmount(totals.net)}</dd>
							</div>
							<div className="flex flex-col items-end">
								<dt className="text-[10px] text-muted-foreground">الضرائب</dt>
								<dd className="tabular-nums">{formatAmount(totals.tax)}</dd>
							</div>
							<div className="flex flex-col items-end">
								<dt className="text-[10px] text-muted-foreground">بعد التقريب</dt>
								<dd className="tabular-nums">{formatAmount(totals.rounded)}</dd>
							</div>
							<div className="flex flex-col items-end">
								<dt className="text-[10px] text-muted-foreground">الإجمالي</dt>
								<dd className="font-semibold text-sm tabular-nums">
									{formatMoney(totals.grand)}
								</dd>
							</div>
						</dl>
					) : (
						<p className="text-muted-foreground text-xs">
							اضغط «احسب» للمعاينة، أو احفظ ليحتسب الخادم نهائيًا.
						</p>
					)}
				</div>
			</div>
		</AccountingFormSheet>
	);
};
