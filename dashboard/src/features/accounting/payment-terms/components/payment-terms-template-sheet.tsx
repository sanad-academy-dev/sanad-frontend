import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowDown, IconArrowUp, IconTrash } from "@tabler/icons-react";
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
import { Switch } from "@/components/ui/switch";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import {
	usePaymentTerms,
	usePaymentTermsActions,
} from "@/features/accounting/payment-terms/hooks/use-payment-terms";
import {
	type CreatePaymentTermsTemplateFormInput,
	type CreatePaymentTermsTemplateFormValues,
	createPaymentTermsTemplateSchema,
	type PaymentTermsTemplateResponse,
} from "@sanad/contracts/runtime/server/accounting/payment-terms/payment-terms.type";

/**
 * [P3.5] Template sheet (§4.9): ordered term rows; the server enforces Σ portions = 100%,
 * the live indicator here shows the running total before save.
 */

const DEFAULTS: CreatePaymentTermsTemplateFormInput = {
	templateName: "",
	allocatePaymentBasedOnPaymentTerms: false,
	termIds: [],
};

export type PaymentTermsTemplateSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editing?: PaymentTermsTemplateResponse | null;
};

export const PaymentTermsTemplateSheet = ({
	open,
	onOpenChange,
	editing,
}: PaymentTermsTemplateSheetProps) => {
	const { createTemplate, updateTemplate, isSaving } = usePaymentTermsActions();
	const { terms } = usePaymentTerms();
	const isEdit = !!editing;

	const {
		register,
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<
		CreatePaymentTermsTemplateFormInput,
		unknown,
		CreatePaymentTermsTemplateFormValues
	>({
		resolver: zodResolver(createPaymentTermsTemplateSchema),
		defaultValues: DEFAULTS,
	});
	const { fields, append, remove, move } = useFieldArray({
		control,
		// termIds is a string[] — RHF needs object rows, so it rides as {value} pairs
		name: "termIds" as never,
	});

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				templateName: editing.templateName,
				allocatePaymentBasedOnPaymentTerms: editing.allocatePaymentBasedOnPaymentTerms,
				termIds: editing.rows.map((row) => row.termId),
			});
		} else {
			reset(DEFAULTS);
		}
	}, [open, editing, reset]);

	const selectedIds = (watch("termIds") ?? []) as string[];
	const portionTotal = selectedIds.reduce((total, id) => {
		const term = terms.find((t) => t.id === id);
		return total + (term ? Number(term.invoicePortion) : 0);
	}, 0);

	const onSubmit = handleSubmit((values) => {
		if (isEdit && editing) updateTemplate(editing.id, values);
		else createTemplate(values);
		onOpenChange(false);
	});

	const termLabel = (id: string) => {
		const term = terms.find((t) => t.id === id);
		return term ? `${term.paymentTermName} (${term.invoicePortion.toString()}%)` : id;
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={isEdit ? "تعديل قالب شروط الدفع" : "قالب شروط دفع جديد"}
			description="سطور مرتّبة من الشروط؛ مجموع النسب يجب أن يبلغ 100%."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel={isEdit ? "حفظ" : "إنشاء"}
		>
			<Field data-invalid={!!errors.templateName}>
				<Label>
					اسم القالب <span className="text-rose-500">*</span>
				</Label>
				<Input
					aria-invalid={!!errors.templateName}
					{...register("templateName")}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.templateName]} />
			</Field>

			<Controller
				name="allocatePaymentBasedOnPaymentTerms"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>توزيع الدفعات حسب الشروط</Label>
						<Switch
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							disabled={isSaving}
						/>
					</Field>
				)}
			/>

			<div className="space-y-2">
				<Label>الشروط (بالترتيب)</Label>
				{fields.map((row, index) => (
					<div
						key={row.id}
						className="flex items-center gap-2"
					>
						<span className="min-w-0 flex-1 truncate rounded-[4px] border px-3 py-1.5 text-sm">
							{termLabel(selectedIds[index] ?? "")}
						</span>
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="أعلى"
							disabled={index === 0 || isSaving}
							onClick={() => move(index, index - 1)}
						>
							<IconArrowUp className="size-4" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="أسفل"
							disabled={index === fields.length - 1 || isSaving}
							onClick={() => move(index, index + 1)}
						>
							<IconArrowDown className="size-4" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="إزالة"
							disabled={isSaving}
							onClick={() => remove(index)}
						>
							<IconTrash className="size-4" />
						</Button>
					</div>
				))}

				<Select
					value=""
					onValueChange={(id) => append(id as never)}
					dir="rtl"
					disabled={isSaving}
				>
					<SelectTrigger>
						<SelectValue placeholder="أضف شرطًا..." />
					</SelectTrigger>
					<SelectContent>
						{terms
							.filter((term) => !selectedIds.includes(term.id))
							.map((term) => (
								<SelectItem
									key={term.id}
									value={term.id}
								>
									{`${term.paymentTermName} (${term.invoicePortion.toString()}%)`}
								</SelectItem>
							))}
					</SelectContent>
				</Select>

				<div
					className={
						portionTotal === 100 ? "text-emerald-600 text-xs" : "text-rose-600 text-xs"
					}
				>
					مجموع النسب: {portionTotal}% {portionTotal === 100 ? "✓" : "— يجب أن يبلغ 100%"}
				</div>
				<FieldError errors={[errors.termIds as never]} />
			</div>
		</AccountingFormSheet>
	);
};
