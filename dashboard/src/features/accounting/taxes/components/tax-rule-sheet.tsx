import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

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
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import {
	usePurchaseTaxTemplates,
	useSalesTaxTemplates,
	useTaxActions,
	useTaxCategories,
} from "@/features/accounting/taxes/hooks/use-taxes";
import {
	type CreateTaxRuleFormInput,
	type CreateTaxRuleFormValues,
	createTaxRuleSchema,
} from "@sanad/contracts/runtime/server/accounting/tax/tax.type";

const NONE = "__none__";

const DEFAULTS: CreateTaxRuleFormInput = {
	taxType: "SALES",
	salesTaxTemplateId: null,
	purchaseTaxTemplateId: null,
	partyType: null,
	partyId: null,
	itemId: null,
	itemCategory: null,
	taxCategoryId: null,
	fromDate: null,
	toDate: null,
	priority: 1,
};

export type TaxRuleSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

/** [P4.4] Tax Rule sheet — wildcard filters; the resolver picks most-specific-then-priority. */
export const TaxRuleSheet = ({ open, onOpenChange }: TaxRuleSheetProps) => {
	const { createRule } = useTaxActions();
	const { rows: salesTemplates } = useSalesTaxTemplates();
	const { rows: purchaseTemplates } = usePurchaseTaxTemplates();
	const { rows: categories } = useTaxCategories();
	const { parties } = useParties();

	const {
		register,
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<CreateTaxRuleFormInput, unknown, CreateTaxRuleFormValues>({
		resolver: zodResolver(createTaxRuleSchema),
		defaultValues: DEFAULTS,
	});
	const taxType = useWatch({ control, name: "taxType" }) ?? "SALES";

	useEffect(() => {
		if (open) reset(DEFAULTS);
	}, [open, reset]);

	const onSubmit = handleSubmit((values) => {
		createRule(values);
		onOpenChange(false);
	});

	const templates = taxType === "SALES" ? salesTemplates : purchaseTemplates;
	const templateField = taxType === "SALES" ? "salesTaxTemplateId" : "purchaseTaxTemplateId";

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title="قاعدة ضريبة جديدة"
			description="مرشِّحات فارغة = أي قيمة؛ الأكثر تحديدًا ثم الأعلى أولوية يفوز (§4.11)."
			onSubmit={onSubmit}
			isSaving={false}
			submitLabel="إنشاء"
		>
			<div className="grid grid-cols-2 gap-3">
				<Controller
					name="taxType"
					control={control}
					render={({ field }) => (
						<Field>
							<Label>النوع</Label>
							<Select
								value={field.value}
								onValueChange={(v) => {
									field.onChange(v);
									setValue("salesTaxTemplateId", null);
									setValue("purchaseTaxTemplateId", null);
								}}
								dir="rtl"
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="SALES">مبيعات</SelectItem>
									<SelectItem value="PURCHASE">مشتريات</SelectItem>
								</SelectContent>
							</Select>
						</Field>
					)}
				/>
				<Field data-invalid={!!errors.priority}>
					<Label>الأولوية</Label>
					<Input
						dir="ltr"
						type="number"
						min={1}
						{...register("priority")}
					/>
					<FieldError errors={[errors.priority]} />
				</Field>
			</div>

			<Controller
				name={templateField}
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!(errors.salesTaxTemplateId || errors.purchaseTaxTemplateId)}>
						<Label>
							القالب المُطبَّق <span className="text-rose-500">*</span>
						</Label>
						<Select
							value={field.value ?? ""}
							onValueChange={field.onChange}
							dir="rtl"
						>
							<SelectTrigger>
								<SelectValue placeholder="اختر القالب..." />
							</SelectTrigger>
							<SelectContent>
								{templates.map((template) => (
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

			<Controller
				name="partyId"
				control={control}
				render={({ field }) => (
					<Field>
						<Label>الطرف (اختياري)</Label>
						<Select
							value={field.value ?? NONE}
							onValueChange={(v) => {
								if (v === NONE) {
									field.onChange(null);
									setValue("partyType", null);
								} else {
									const party = parties.find((p) => p.partyId === v);
									field.onChange(v);
									setValue("partyType", party?.partyType ?? null);
								}
							}}
							dir="rtl"
						>
							<SelectTrigger>
								<SelectValue placeholder="أي طرف" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NONE}>— أي طرف —</SelectItem>
								{parties.map((party) => (
									<SelectItem
										key={`${party.partyType}:${party.partyId}`}
										value={party.partyId}
									>
										{party.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				)}
			/>

			<Controller
				name="taxCategoryId"
				control={control}
				render={({ field }) => (
					<Field>
						<Label>فئة الضريبة (اختياري)</Label>
						<Select
							value={field.value ?? NONE}
							onValueChange={(v) => field.onChange(v === NONE ? null : v)}
							dir="rtl"
						>
							<SelectTrigger>
								<SelectValue placeholder="أي فئة" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NONE}>— أي فئة —</SelectItem>
								{categories.map((category) => (
									<SelectItem
										key={category.id}
										value={category.id}
									>
										{category.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				)}
			/>

			<div className="grid grid-cols-2 gap-3">
				<Field>
					<Label>من تاريخ (اختياري)</Label>
					<Input
						dir="ltr"
						placeholder="YYYY-MM-DD"
						{...register("fromDate", {
							setValueAs: (v: string) => (v === "" ? null : v),
						})}
					/>
				</Field>
				<Field>
					<Label>إلى تاريخ (اختياري)</Label>
					<Input
						dir="ltr"
						placeholder="YYYY-MM-DD"
						{...register("toDate", {
							setValueAs: (v: string) => (v === "" ? null : v),
						})}
					/>
				</Field>
			</div>
		</AccountingFormSheet>
	);
};
