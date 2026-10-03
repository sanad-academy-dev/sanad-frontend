import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
import { useTaxActions } from "@/features/accounting/taxes/hooks/use-taxes";
import {
	type CreateTaxTemplateFormInput,
	type CreateTaxTemplateFormValues,
	createTaxTemplateSchema,
	type PurchaseTaxTemplateResponse,
	type SalesTaxTemplateResponse,
	TaxAddDeduct,
	TaxChargeType,
	TaxRowCategory,
} from "@sanad/contracts/runtime/server/accounting/tax/tax.type";

export const CHARGE_TYPE_LABEL: Record<TaxChargeType, string> = {
	ACTUAL: "مبلغ فعلي",
	ON_NET_TOTAL: "على الصافي",
	ON_PREVIOUS_ROW_AMOUNT: "على مبلغ سطر سابق",
	ON_PREVIOUS_ROW_TOTAL: "على مجموع سطر سابق",
	ON_ITEM_QUANTITY: "على الكمية",
};

const CATEGORY_LABEL: Record<TaxRowCategory, string> = {
	TOTAL: "الإجمالي",
	VALUATION: "التقييم",
	VALUATION_AND_TOTAL: "التقييم والإجمالي",
};

const ADD_DEDUCT_LABEL: Record<TaxAddDeduct, string> = {
	ADD: "إضافة",
	DEDUCT: "خصم",
};

const EMPTY_ROW = {
	chargeType: "ON_NET_TOTAL" as const,
	accountHeadId: "",
	rate: "0",
	taxAmount: "0",
	rowId: null,
	description: "",
	includedInPrintRate: false,
	costCenterId: null,
	category: "TOTAL" as const,
	addDeductTax: "ADD" as const,
};

const DEFAULTS: CreateTaxTemplateFormInput = {
	title: "",
	isDefault: false,
	disabled: false,
	taxCategoryId: null,
	taxes: [{ ...EMPTY_ROW }],
};

export type TaxTemplateSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	purchase: boolean;
	editing?: SalesTaxTemplateResponse | PurchaseTaxTemplateResponse | null;
};

/** [P4.4] Shared sales/purchase template sheet — the §8 row grid (wide voucher variant). */
export const TaxTemplateSheet = ({
	open,
	onOpenChange,
	purchase,
	editing,
}: TaxTemplateSheetProps) => {
	const { saveSalesTemplate, savePurchaseTemplate } = useTaxActions();
	const { accounts } = useAccounts();
	const taxAccounts = accounts.filter((a) => !a.isGroup && !a.disabled);
	const isEdit = !!editing;

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateTaxTemplateFormInput, unknown, CreateTaxTemplateFormValues>({
		resolver: zodResolver(createTaxTemplateSchema),
		defaultValues: DEFAULTS,
	});
	const { fields, append, remove } = useFieldArray({ control, name: "taxes" });
	const watchedRows = useWatch({ control, name: "taxes" }) ?? [];

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				title: editing.title,
				isDefault: editing.isDefault,
				disabled: editing.disabled,
				taxCategoryId: editing.taxCategoryId,
				taxes: editing.taxes.map((row) => ({
					chargeType: row.chargeType,
					accountHeadId: row.accountHeadId,
					rate: row.rate.toString(),
					taxAmount: row.taxAmount.toString(),
					rowId: row.rowId,
					description: row.description,
					includedInPrintRate: row.includedInPrintRate,
					costCenterId: row.costCenterId,
					category: (row as { category?: TaxRowCategory }).category ?? "TOTAL",
					addDeductTax: (row as { addDeductTax?: TaxAddDeduct }).addDeductTax ?? "ADD",
				})),
			});
		} else {
			reset({ ...DEFAULTS, taxes: [{ ...EMPTY_ROW }] });
		}
	}, [open, editing, reset]);

	const onSubmit = handleSubmit((values) => {
		if (purchase) savePurchaseTemplate(values, editing?.id);
		else saveSalesTemplate(values, editing?.id);
		onOpenChange(false);
	});

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={
				isEdit
					? "تعديل قالب الضريبة"
					: purchase
						? "قالب ضرائب مشتريات جديد"
						: "قالب ضرائب مبيعات جديد"
			}
			description="سطور مرتّبة بأنواع الاحتساب الخمسة (BRD §8) — تُتحقق قواعد row_id والشمول عند الحفظ."
			onSubmit={onSubmit}
			isSaving={false}
			submitLabel={isEdit ? "حفظ" : "إنشاء"}
			wide
		>
			<div className="grid grid-cols-2 gap-3">
				<Field data-invalid={!!errors.title}>
					<Label>
						اسم القالب <span className="text-rose-500">*</span>
					</Label>
					<Input
						aria-invalid={!!errors.title}
						{...register("title")}
					/>
					<FieldError errors={[errors.title]} />
				</Field>
				<div className="flex items-end gap-6 pb-1">
					<Controller
						name="isDefault"
						control={control}
						render={({ field }) => (
							<div className="flex items-center gap-2">
								<Switch
									checked={field.value ?? false}
									onCheckedChange={field.onChange}
									id="tax-template-default"
								/>
								<Label htmlFor="tax-template-default">افتراضي</Label>
							</div>
						)}
					/>
					<Controller
						name="disabled"
						control={control}
						render={({ field }) => (
							<div className="flex items-center gap-2">
								<Switch
									checked={field.value ?? false}
									onCheckedChange={field.onChange}
									id="tax-template-disabled"
								/>
								<Label htmlFor="tax-template-disabled">معطّل</Label>
							</div>
						)}
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label>سطور الضريبة (بالترتيب — row_id يشير إلى رقم السطر)</Label>
				{fields.map((rowField, index) => {
					const chargeType = watchedRows[index]?.chargeType;
					const isPrev =
						chargeType === "ON_PREVIOUS_ROW_AMOUNT" || chargeType === "ON_PREVIOUS_ROW_TOTAL";
					return (
						<div
							key={rowField.id}
							className="space-y-2 rounded-[4px] border p-2"
						>
							<div className="flex items-start gap-2">
								<span className="pt-2 text-muted-foreground text-xs tabular-nums">
									{index + 1}
								</span>
								<Controller
									name={`taxes.${index}.chargeType`}
									control={control}
									render={({ field }) => (
										<Field className="w-44">
											<Select
												value={field.value}
												onValueChange={field.onChange}
												dir="rtl"
											>
												<SelectTrigger size="sm">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{Object.values(TaxChargeType).map((type) => (
														<SelectItem
															key={type}
															value={type}
														>
															{CHARGE_TYPE_LABEL[type]}
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
											className="min-w-0 flex-1"
											data-invalid={!!errors.taxes?.[index]?.accountHeadId}
										>
											<Select
												value={field.value || ""}
												onValueChange={field.onChange}
												dir="rtl"
											>
												<SelectTrigger size="sm">
													<SelectValue placeholder="حساب الضريبة..." />
												</SelectTrigger>
												<SelectContent>
													{taxAccounts.map((account) => (
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
									<Field className="w-24">
										<Input
											dir="ltr"
											inputMode="decimal"
											placeholder="المبلغ"
											className="h-8 text-end tabular-nums"
											{...register(`taxes.${index}.taxAmount`)}
										/>
									</Field>
								) : (
									<Field className="w-24">
										<Input
											dir="ltr"
											inputMode="decimal"
											placeholder="%"
											className="h-8 text-end tabular-nums"
											{...register(`taxes.${index}.rate`)}
										/>
									</Field>
								)}
								{isPrev && (
									<Field className="w-16">
										<Input
											dir="ltr"
											type="number"
											min={1}
											placeholder="سطر"
											className="h-8 text-end"
											{...register(`taxes.${index}.rowId`)}
										/>
									</Field>
								)}
								<Button
									type="button"
									variant="ghost"
									size="icon-xs"
									aria-label="حذف السطر"
									disabled={fields.length <= 1}
									onClick={() => remove(index)}
								>
									<IconTrash className="size-4" />
								</Button>
							</div>
							<div className="flex items-center gap-4 ps-6">
								<Field className="min-w-0 flex-1">
									<Input
										placeholder="الوصف *"
										aria-invalid={!!errors.taxes?.[index]?.description}
										className="h-8"
										{...register(`taxes.${index}.description`)}
									/>
								</Field>
								<Controller
									name={`taxes.${index}.includedInPrintRate`}
									control={control}
									render={({ field }) => (
										<div className="flex shrink-0 items-center gap-1.5">
											<Switch
												checked={field.value ?? false}
												onCheckedChange={field.onChange}
												id={`tax-row-included-${index}`}
											/>
											<Label
												htmlFor={`tax-row-included-${index}`}
												className="text-xs"
											>
												شاملة
											</Label>
										</div>
									)}
								/>
								{purchase && (
									<>
										<Controller
											name={`taxes.${index}.category`}
											control={control}
											render={({ field }) => (
												<Field className="w-36 shrink-0">
													<Select
														value={field.value ?? "TOTAL"}
														onValueChange={field.onChange}
														dir="rtl"
													>
														<SelectTrigger size="sm">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{Object.values(TaxRowCategory).map((category) => (
																<SelectItem
																	key={category}
																	value={category}
																>
																	{CATEGORY_LABEL[category]}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</Field>
											)}
										/>
										<Controller
											name={`taxes.${index}.addDeductTax`}
											control={control}
											render={({ field }) => (
												<Field className="w-24 shrink-0">
													<Select
														value={field.value ?? "ADD"}
														onValueChange={field.onChange}
														dir="rtl"
													>
														<SelectTrigger size="sm">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{Object.values(TaxAddDeduct).map((mode) => (
																<SelectItem
																	key={mode}
																	value={mode}
																>
																	{ADD_DEDUCT_LABEL[mode]}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</Field>
											)}
										/>
									</>
								)}
							</div>
						</div>
					);
				})}
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => append({ ...EMPTY_ROW })}
				>
					<IconPlus className="size-4" /> إضافة سطر
				</Button>
				<FieldError errors={[errors.taxes as never]} />
			</div>
		</AccountingFormSheet>
	);
};
