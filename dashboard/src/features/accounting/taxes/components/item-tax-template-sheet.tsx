import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

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
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useTaxActions } from "@/features/accounting/taxes/hooks/use-taxes";
import {
	type CreateItemTaxTemplateFormInput,
	type CreateItemTaxTemplateFormValues,
	createItemTaxTemplateSchema,
	type ItemTaxTemplateResponse,
} from "@sanad/contracts/runtime/server/accounting/tax/tax.type";

const DEFAULTS: CreateItemTaxTemplateFormInput = {
	title: "",
	disabled: false,
	rows: [{ taxTypeAccountId: "", taxRate: "0" }],
};

export type ItemTaxTemplateSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editing?: ItemTaxTemplateResponse | null;
};

/** [P4.4] Item Tax Template sheet — account→rate overrides; an explicit 0 MEANS zero (§8). */
export const ItemTaxTemplateSheet = ({
	open,
	onOpenChange,
	editing,
}: ItemTaxTemplateSheetProps) => {
	const { saveItemTemplate } = useTaxActions();
	const { accounts } = useAccounts();
	const taxAccounts = accounts.filter((a) => !a.isGroup && !a.disabled);
	const isEdit = !!editing;

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateItemTaxTemplateFormInput, unknown, CreateItemTaxTemplateFormValues>({
		resolver: zodResolver(createItemTaxTemplateSchema),
		defaultValues: DEFAULTS,
	});
	const { fields, append, remove } = useFieldArray({ control, name: "rows" });

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				title: editing.title,
				disabled: editing.disabled,
				rows: editing.rows.map((row) => ({
					taxTypeAccountId: row.taxTypeAccountId,
					taxRate: row.taxRate.toString(),
				})),
			});
		} else {
			reset(DEFAULTS);
		}
	}, [open, editing, reset]);

	const onSubmit = handleSubmit((values) => {
		saveItemTemplate(values, editing?.id);
		onOpenChange(false);
	});

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={isEdit ? "تعديل قالب ضريبة الصنف" : "قالب ضريبة صنف جديد"}
			description="معدل بديل لكل حساب ضريبة — الصفر الصريح يعني صفرًا (§8)."
			onSubmit={onSubmit}
			isSaving={false}
			submitLabel={isEdit ? "حفظ" : "إنشاء"}
		>
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

			<div className="space-y-2">
				<Label>الحسابات ومعدلاتها</Label>
				{fields.map((rowField, index) => (
					<div
						key={rowField.id}
						className="flex items-center gap-2"
					>
						<Controller
							name={`rows.${index}.taxTypeAccountId`}
							control={control}
							render={({ field }) => (
								<Field className="min-w-0 flex-1">
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
						<Field className="w-24">
							<Input
								dir="ltr"
								inputMode="decimal"
								placeholder="%"
								className="h-8 text-end tabular-nums"
								{...register(`rows.${index}.taxRate`)}
							/>
						</Field>
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="حذف"
							disabled={fields.length <= 1}
							onClick={() => remove(index)}
						>
							<IconTrash className="size-4" />
						</Button>
					</div>
				))}
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => append({ taxTypeAccountId: "", taxRate: "0" })}
				>
					<IconPlus className="size-4" /> إضافة حساب
				</Button>
			</div>
		</AccountingFormSheet>
	);
};
