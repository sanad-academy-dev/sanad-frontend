import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { DateField } from "@/components/common/date-field";
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
	useCurrencies,
	useCurrencyExchangeActions,
} from "@/features/accounting/currency-exchanges/hooks/use-currency-exchanges";
import {
	type CreateCurrencyExchangeFormInput,
	type CreateCurrencyExchangeFormValues,
	createCurrencyExchangeSchema,
} from "@sanad/contracts/runtime/server/accounting/currency-exchange/currency-exchange.type";

const DEFAULTS: CreateCurrencyExchangeFormInput = {
	date: "",
	fromCurrencyCode: "",
	toCurrencyCode: "",
	exchangeRate: "",
	forBuying: true,
	forSelling: true,
};

/**
 * Create-only on purpose: stored rates are immutable history — correcting one is
 * delete + re-add, never an edit (so a rate a document already resolved can't drift).
 */
export type CurrencyExchangeSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const CurrencyExchangeSheet = ({ open, onOpenChange }: CurrencyExchangeSheetProps) => {
	const { create, isSaving } = useCurrencyExchangeActions();
	const { currencies } = useCurrencies();

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateCurrencyExchangeFormInput, unknown, CreateCurrencyExchangeFormValues>({
		resolver: zodResolver(createCurrencyExchangeSchema),
		defaultValues: DEFAULTS,
	});

	useEffect(() => {
		if (open) reset(DEFAULTS);
	}, [open, reset]);

	// toast.promise (inside the hook) owns success/error feedback; close the sheet immediately.
	const onSubmit = handleSubmit((values) => {
		create(values);
		onOpenChange(false);
	});

	const currencySelect = (name: "fromCurrencyCode" | "toCurrencyCode", label: string) => (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<Field data-invalid={!!errors[name]}>
					<Label>
						{label} <span className="text-rose-500">*</span>
					</Label>
					<Select
						value={field.value || undefined}
						onValueChange={field.onChange}
						dir="rtl"
						disabled={isSaving}
					>
						<SelectTrigger>
							<SelectValue placeholder="اختر العملة" />
						</SelectTrigger>
						<SelectContent>
							{currencies.map((c) => (
								<SelectItem
									key={c.code}
									value={c.code}
								>
									{c.nameAr} ({c.code})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError errors={[errors[name]]} />
				</Field>
			)}
		/>
	);

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title="سعر صرف جديد"
			description="يُطبَّق أحدث سعر بتاريخ المستند أو قبله حسب جهة الحركة."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel="إضافة"
		>
			<Controller
				name="date"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.date}>
						<Label>
							التاريخ <span className="text-rose-500">*</span>
						</Label>
						<DateField
							value={field.value}
							onChange={field.onChange}
							placeholder="YYYY-MM-DD"
							invalid={!!errors.date}
							triggerDisabled={isSaving}
						/>
						<FieldError errors={[errors.date]} />
					</Field>
				)}
			/>

			{currencySelect("fromCurrencyCode", "من عملة")}
			{currencySelect("toCurrencyCode", "إلى عملة")}

			<Field data-invalid={!!errors.exchangeRate}>
				<Label>
					سعر الصرف <span className="text-rose-500">*</span>
				</Label>
				<Input
					dir="ltr"
					inputMode="decimal"
					placeholder="3.75"
					aria-invalid={!!errors.exchangeRate}
					{...register("exchangeRate")}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.exchangeRate]} />
			</Field>

			<Controller
				name="forBuying"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>للشراء</Label>
						<Switch
							checked={field.value ?? true}
							onCheckedChange={field.onChange}
							disabled={isSaving}
						/>
					</Field>
				)}
			/>
			<Controller
				name="forSelling"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
						data-invalid={!!errors.forSelling}
					>
						<Label>للبيع</Label>
						<Switch
							checked={field.value ?? true}
							onCheckedChange={field.onChange}
							disabled={isSaving}
						/>
					</Field>
				)}
			/>
			<FieldError errors={[errors.forSelling]} />
		</AccountingFormSheet>
	);
};
