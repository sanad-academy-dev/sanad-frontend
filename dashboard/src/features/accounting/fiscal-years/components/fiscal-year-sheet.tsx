import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { DateField } from "@/components/common/date-field";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useFiscalYearActions } from "@/features/accounting/fiscal-years/hooks/use-fiscal-years";
import {
	type CreateFiscalYearFormInput,
	type CreateFiscalYearFormValues,
	createFiscalYearSchema,
	type FiscalYearResponse,
} from "@sanad/contracts/runtime/server/accounting/fiscal-year/fiscal-year.type";

const DEFAULTS: CreateFiscalYearFormInput = {
	year: "",
	yearStartDate: "",
	yearEndDate: "",
	isShortYear: false,
};

export type FiscalYearSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** when set, the sheet edits this fiscal year; otherwise it creates */
	editing?: FiscalYearResponse | null;
};

export const FiscalYearSheet = ({ open, onOpenChange, editing }: FiscalYearSheetProps) => {
	const { create, update, isSaving } = useFiscalYearActions();
	const isEdit = !!editing;

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateFiscalYearFormInput, unknown, CreateFiscalYearFormValues>({
		resolver: zodResolver(createFiscalYearSchema),
		defaultValues: DEFAULTS,
	});

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				year: editing.year,
				yearStartDate: editing.yearStartDate.toString().slice(0, 10),
				yearEndDate: editing.yearEndDate.toString().slice(0, 10),
				isShortYear: editing.isShortYear,
			});
		} else {
			reset(DEFAULTS);
		}
	}, [open, editing, reset]);

	// toast.promise (inside the hook) owns success/error feedback; close the sheet immediately.
	const onSubmit = handleSubmit((values) => {
		if (isEdit && editing) update(editing.id, values);
		else create(values);
		onOpenChange(false);
	});

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={isEdit ? "تعديل سنة مالية" : "سنة مالية جديدة"}
			description="لا يُسمح بتداخل سنتين ماليتين، والمدة لا تتجاوز 12 شهرًا إلا لسنة قصيرة."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel={isEdit ? "حفظ" : "إنشاء"}
		>
			<Field data-invalid={!!errors.year}>
				<Label>
					اسم السنة <span className="text-rose-500">*</span>
				</Label>
				<Input
					placeholder="2026"
					aria-invalid={!!errors.year}
					{...register("year")}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.year]} />
			</Field>

			<div className="grid grid-cols-2 gap-3">
				<Controller
					name="yearStartDate"
					control={control}
					render={({ field }) => (
						<Field data-invalid={!!errors.yearStartDate}>
							<Label>
								من <span className="text-rose-500">*</span>
							</Label>
							<DateField
								value={field.value}
								onChange={field.onChange}
								placeholder="YYYY-MM-DD"
								invalid={!!errors.yearStartDate}
								triggerDisabled={isSaving}
							/>
							<FieldError errors={[errors.yearStartDate]} />
						</Field>
					)}
				/>
				<Controller
					name="yearEndDate"
					control={control}
					render={({ field }) => (
						<Field data-invalid={!!errors.yearEndDate}>
							<Label>
								إلى <span className="text-rose-500">*</span>
							</Label>
							<DateField
								value={field.value}
								onChange={field.onChange}
								placeholder="YYYY-MM-DD"
								invalid={!!errors.yearEndDate}
								triggerDisabled={isSaving}
							/>
							<FieldError errors={[errors.yearEndDate]} />
						</Field>
					)}
				/>
			</div>

			<Controller
				name="isShortYear"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>سنة قصيرة (تسمح بمدة أقل من 12 شهرًا)</Label>
						<Switch
							checked={field.value}
							onCheckedChange={field.onChange}
							disabled={isSaving}
						/>
					</Field>
				)}
			/>
		</AccountingFormSheet>
	);
};
