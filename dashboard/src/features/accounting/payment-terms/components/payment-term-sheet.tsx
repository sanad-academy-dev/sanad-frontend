import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

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
import { useModesOfPayment } from "@/features/accounting/modes-of-payment/hooks/use-modes-of-payment";
import { usePaymentTermsActions } from "@/features/accounting/payment-terms/hooks/use-payment-terms";
import {
	type CreatePaymentTermFormInput,
	type CreatePaymentTermFormValues,
	createPaymentTermSchema,
	DueDateBasis,
	PaymentDiscountType,
	type PaymentTermResponse,
} from "@sanad/contracts/runtime/server/accounting/payment-terms/payment-terms.type";

export const DUE_DATE_BASIS_LABEL: Record<DueDateBasis, string> = {
	DAYS_AFTER_INVOICE_DATE: "أيام بعد تاريخ الفاتورة",
	DAYS_AFTER_INVOICE_MONTH_END: "أيام بعد نهاية شهر الفاتورة",
	MONTHS_AFTER_INVOICE_MONTH_END: "شهور بعد نهاية شهر الفاتورة",
};

const DISCOUNT_TYPE_LABEL: Record<PaymentDiscountType, string> = {
	PERCENTAGE: "نسبة مئوية",
	AMOUNT: "مبلغ",
};

const NO_MODE = "__none__";

const DEFAULTS: CreatePaymentTermFormInput = {
	paymentTermName: "",
	invoicePortion: "100",
	dueDateBasedOn: "DAYS_AFTER_INVOICE_DATE",
	creditDays: 0,
	creditMonths: 0,
	modeOfPaymentId: null,
	discountType: "PERCENTAGE",
	discount: "0",
	discountValidityBasedOn: "DAYS_AFTER_INVOICE_DATE",
	discountValidity: 0,
};

export type PaymentTermSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editing?: PaymentTermResponse | null;
};

/** [P3.5] Payment Term sheet (§4.9): portion, due-date rule, early-discount window. */
export const PaymentTermSheet = ({ open, onOpenChange, editing }: PaymentTermSheetProps) => {
	const { createTerm, updateTerm, isSaving } = usePaymentTermsActions();
	const { modes } = useModesOfPayment();
	const isEdit = !!editing;

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreatePaymentTermFormInput, unknown, CreatePaymentTermFormValues>({
		resolver: zodResolver(createPaymentTermSchema),
		defaultValues: DEFAULTS,
	});

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				paymentTermName: editing.paymentTermName,
				invoicePortion: editing.invoicePortion.toString(),
				dueDateBasedOn: editing.dueDateBasedOn,
				creditDays: editing.creditDays,
				creditMonths: editing.creditMonths,
				modeOfPaymentId: editing.modeOfPaymentId,
				discountType: editing.discountType,
				discount: editing.discount.toString(),
				discountValidityBasedOn: editing.discountValidityBasedOn,
				discountValidity: editing.discountValidity,
			});
		} else {
			reset(DEFAULTS);
		}
	}, [open, editing, reset]);

	const onSubmit = handleSubmit((values) => {
		if (isEdit && editing) updateTerm(editing.id, values);
		else createTerm(values);
		onOpenChange(false);
	});

	const basisSelect = (name: "dueDateBasedOn" | "discountValidityBasedOn", label: string) => (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<Field>
					<Label>{label}</Label>
					<Select
						value={field.value}
						onValueChange={field.onChange}
						dir="rtl"
						disabled={isSaving}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.values(DueDateBasis).map((basis) => (
								<SelectItem
									key={basis}
									value={basis}
								>
									{DUE_DATE_BASIS_LABEL[basis]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
			)}
		/>
	);

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={isEdit ? "تعديل شرط الدفع" : "شرط دفع جديد"}
			description="نسبة من الفاتورة وقاعدة استحقاقها وخصم السداد المبكر (BRD §4.9)."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel={isEdit ? "حفظ" : "إنشاء"}
		>
			<Field data-invalid={!!errors.paymentTermName}>
				<Label>
					اسم الشرط <span className="text-rose-500">*</span>
				</Label>
				<Input
					aria-invalid={!!errors.paymentTermName}
					{...register("paymentTermName")}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.paymentTermName]} />
			</Field>

			<div className="grid grid-cols-2 gap-3">
				<Field data-invalid={!!errors.invoicePortion}>
					<Label>نسبة الفاتورة %</Label>
					<Input
						dir="ltr"
						inputMode="decimal"
						aria-invalid={!!errors.invoicePortion}
						{...register("invoicePortion")}
						disabled={isSaving}
					/>
					<FieldError errors={[errors.invoicePortion]} />
				</Field>
				<Controller
					name="modeOfPaymentId"
					control={control}
					render={({ field }) => (
						<Field>
							<Label>طريقة الدفع</Label>
							<Select
								value={field.value ?? NO_MODE}
								onValueChange={(v) => field.onChange(v === NO_MODE ? null : v)}
								dir="rtl"
								disabled={isSaving}
							>
								<SelectTrigger>
									<SelectValue placeholder="بدون" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={NO_MODE}>— بدون —</SelectItem>
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
			</div>

			{basisSelect("dueDateBasedOn", "أساس الاستحقاق")}
			<div className="grid grid-cols-2 gap-3">
				<Field data-invalid={!!errors.creditDays}>
					<Label>أيام الائتمان</Label>
					<Input
						dir="ltr"
						type="number"
						min={0}
						{...register("creditDays")}
						disabled={isSaving}
					/>
					<FieldError errors={[errors.creditDays]} />
				</Field>
				<Field data-invalid={!!errors.creditMonths}>
					<Label>شهور الائتمان</Label>
					<Input
						dir="ltr"
						type="number"
						min={0}
						{...register("creditMonths")}
						disabled={isSaving}
					/>
					<FieldError errors={[errors.creditMonths]} />
				</Field>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<Controller
					name="discountType"
					control={control}
					render={({ field }) => (
						<Field>
							<Label>نوع خصم السداد المبكر</Label>
							<Select
								value={field.value}
								onValueChange={field.onChange}
								dir="rtl"
								disabled={isSaving}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.values(PaymentDiscountType).map((type) => (
										<SelectItem
											key={type}
											value={type}
										>
											{DISCOUNT_TYPE_LABEL[type]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					)}
				/>
				<Field data-invalid={!!errors.discount}>
					<Label>قيمة الخصم</Label>
					<Input
						dir="ltr"
						inputMode="decimal"
						aria-invalid={!!errors.discount}
						{...register("discount")}
						disabled={isSaving}
					/>
					<FieldError errors={[errors.discount]} />
				</Field>
			</div>

			{basisSelect("discountValidityBasedOn", "أساس صلاحية الخصم")}
			<Field data-invalid={!!errors.discountValidity}>
				<Label>مدة صلاحية الخصم</Label>
				<Input
					dir="ltr"
					type="number"
					min={0}
					{...register("discountValidity")}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.discountValidity]} />
			</Field>
		</AccountingFormSheet>
	);
};
