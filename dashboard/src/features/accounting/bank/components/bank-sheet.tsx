import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBankActions } from "@/features/accounting/bank/hooks/use-banks";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import {
	type BankResponse,
	type UpsertBankFormInput,
	upsertBankSchema,
} from "@sanad/contracts/runtime/server/accounting/bank/bank.type";

/** [P11.1] Create/edit sheet for the Bank master (§14) — standard accounting form shell. */

type BankFormInput = z.input<typeof upsertBankSchema>;

const DEFAULTS: BankFormInput = {
	bankName: "",
	swiftNumber: null,
	website: null,
	disabled: false,
};

/** empty text inputs post as null — the schema's nullish strings reject "" */
const emptyToNull = (value: unknown) =>
	typeof value === "string" && value.trim() === "" ? null : value;

export type BankSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** when set, the sheet edits this bank; otherwise it creates */
	editing?: BankResponse | null;
};

export const BankSheet = ({ open, onOpenChange, editing }: BankSheetProps) => {
	const { createBank, updateBank, isSaving } = useBankActions();
	const isEdit = !!editing;

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<BankFormInput, unknown, UpsertBankFormInput>({
		resolver: zodResolver(upsertBankSchema),
		defaultValues: DEFAULTS,
	});

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				bankName: editing.bankName,
				swiftNumber: editing.swiftNumber,
				website: editing.website,
				disabled: editing.disabled,
			});
		} else {
			reset(DEFAULTS);
		}
	}, [open, editing, reset]);

	// toast.promise (inside the hook) owns success/error feedback; close the sheet immediately.
	const onSubmit = handleSubmit((values) => {
		if (isEdit && editing) updateBank(editing.id, values);
		else createBank(values);
		onOpenChange(false);
	});

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={isEdit ? "تعديل البنك" : "بنك جديد"}
			description="بيانات البنك الأساسية — الحسابات البنكية تُعرَّف أسفل القائمة."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel={isEdit ? "حفظ" : "إنشاء"}
		>
			<Field data-invalid={!!errors.bankName}>
				<Label>
					اسم البنك <span className="text-rose-500">*</span>
				</Label>
				<Input
					aria-invalid={!!errors.bankName}
					{...register("bankName")}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.bankName]} />
			</Field>

			<Field data-invalid={!!errors.swiftNumber}>
				<Label>رمز SWIFT (اختياري)</Label>
				<Input
					dir="ltr"
					aria-invalid={!!errors.swiftNumber}
					{...register("swiftNumber", { setValueAs: emptyToNull })}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.swiftNumber]} />
			</Field>

			<Field data-invalid={!!errors.website}>
				<Label>الموقع الإلكتروني (اختياري)</Label>
				<Input
					dir="ltr"
					aria-invalid={!!errors.website}
					{...register("website", { setValueAs: emptyToNull })}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.website]} />
			</Field>

			<Controller
				name="disabled"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>معطّل</Label>
						<Switch
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							disabled={isSaving}
						/>
					</Field>
				)}
			/>
		</AccountingFormSheet>
	);
};
