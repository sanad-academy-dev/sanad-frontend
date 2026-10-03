import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
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
import { useBankActions, useBanks } from "@/features/accounting/bank/hooks/use-banks";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { AccountType } from "@/generated/prisma/enums";
import {
	type BankAccountResponse,
	type UpsertBankAccountFormInput,
	upsertBankAccountSchema,
} from "@sanad/contracts/runtime/server/accounting/bank/bank.type";

/**
 * [P11.1] Create/edit sheet for the Bank Account master (§14). A COMPANY account must link
 * a postable BANK-typed GL leaf — that link is the reconciliation anchor; the server
 * enforces it (bank.service), the form mirrors the rule so the error surfaces inline.
 */

type BankAccountFormInput = z.input<typeof upsertBankAccountSchema>;

const DEFAULTS: BankAccountFormInput = {
	bankId: "",
	accountName: "",
	isCompanyAccount: true,
	glAccountId: null,
	accountType: null,
	accountSubtype: null,
	iban: null,
	branchCode: null,
	bankAccountNo: null,
	partyType: null,
	partyId: null,
	disabled: false,
};

/** empty text inputs post as null — the schema's nullish strings reject "" */
const emptyToNull = (value: unknown) =>
	typeof value === "string" && value.trim() === "" ? null : value;

export type BankAccountSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** when set, the sheet edits this bank account; otherwise it creates */
	editing?: BankAccountResponse | null;
};

export const BankAccountSheet = ({ open, onOpenChange, editing }: BankAccountSheetProps) => {
	const { banks } = useBanks();
	const { accounts } = useAccounts();
	const { createAccount, updateAccount, isSaving } = useBankActions();
	const isEdit = !!editing;

	// the GL link must be a live BANK-typed leaf (§14) — same filter the server enforces
	const bankLeaves = accounts.filter(
		(account) =>
			!account.isGroup && !account.disabled && account.accountType === AccountType.BANK,
	);

	const {
		register,
		control,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm<BankAccountFormInput, unknown, UpsertBankAccountFormInput>({
		resolver: zodResolver(upsertBankAccountSchema),
		defaultValues: DEFAULTS,
	});
	const isCompanyAccount = watch("isCompanyAccount") ?? true;

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				bankId: editing.bankId,
				accountName: editing.accountName,
				isCompanyAccount: editing.isCompanyAccount,
				glAccountId: editing.glAccountId,
				accountType: editing.accountType,
				accountSubtype: editing.accountSubtype,
				iban: editing.iban,
				branchCode: editing.branchCode,
				bankAccountNo: editing.bankAccountNo,
				partyType: editing.partyType,
				partyId: editing.partyId,
				disabled: editing.disabled,
			});
		} else {
			reset(DEFAULTS);
		}
	}, [open, editing, reset]);

	// toast.promise (inside the hook) owns success/error feedback; close the sheet immediately.
	const onSubmit = handleSubmit((values) => {
		if (isEdit && editing) updateAccount(editing.id, values);
		else createAccount(values);
		onOpenChange(false);
	});

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={isEdit ? "تعديل الحساب البنكي" : "حساب بنكي جديد"}
			description="حساب الشركة يرتبط بحساب دفتر أستاذ ورقي من نوع «بنك» (§14)."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel={isEdit ? "حفظ" : "إنشاء"}
		>
			<Controller
				name="bankId"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.bankId}>
						<Label>
							البنك <span className="text-rose-500">*</span>
						</Label>
						<Select
							value={field.value || ""}
							onValueChange={field.onChange}
							dir="rtl"
							disabled={isSaving}
						>
							<SelectTrigger aria-invalid={!!errors.bankId}>
								<SelectValue placeholder="اختر البنك..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{banks
									.filter((bank) => !bank.disabled || bank.id === field.value)
									.map((bank) => (
										<SelectItem
											key={bank.id}
											value={bank.id}
										>
											{bank.bankName}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
						<FieldError errors={[errors.bankId]} />
					</Field>
				)}
			/>

			<Field data-invalid={!!errors.accountName}>
				<Label>
					اسم الحساب <span className="text-rose-500">*</span>
				</Label>
				<Input
					aria-invalid={!!errors.accountName}
					{...register("accountName")}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.accountName]} />
			</Field>

			<Controller
				name="isCompanyAccount"
				control={control}
				render={({ field }) => (
					<Field orientation="horizontal">
						<Checkbox
							checked={field.value ?? true}
							onCheckedChange={(checked) => {
								field.onChange(checked === true);
								if (checked !== true) setValue("glAccountId", null);
							}}
							disabled={isSaving}
							aria-label="حساب شركة"
						/>
						<Label>حساب شركة (يرتبط بدفتر الأستاذ)</Label>
					</Field>
				)}
			/>

			{isCompanyAccount ? (
				<Controller
					name="glAccountId"
					control={control}
					render={({ field }) => (
						<Field data-invalid={!!errors.glAccountId}>
							<Label>
								حساب دفتر الأستاذ <span className="text-rose-500">*</span>
							</Label>
							<Select
								value={field.value ?? ""}
								onValueChange={field.onChange}
								dir="rtl"
								disabled={isSaving}
							>
								<SelectTrigger aria-invalid={!!errors.glAccountId}>
									<SelectValue placeholder="اختر حسابًا ورقيًا من نوع «بنك»..." />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{bankLeaves.map((account) => (
										<SelectItem
											key={account.id}
											value={account.id}
										>
											{account.accountName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError errors={[errors.glAccountId]} />
						</Field>
					)}
				/>
			) : null}

			<Field data-invalid={!!errors.iban}>
				<Label>IBAN (اختياري)</Label>
				<Input
					dir="ltr"
					aria-invalid={!!errors.iban}
					{...register("iban", { setValueAs: emptyToNull })}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.iban]} />
			</Field>

			<Field data-invalid={!!errors.bankAccountNo}>
				<Label>رقم الحساب (اختياري)</Label>
				<Input
					dir="ltr"
					aria-invalid={!!errors.bankAccountNo}
					{...register("bankAccountNo", { setValueAs: emptyToNull })}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.bankAccountNo]} />
			</Field>

			<Field data-invalid={!!errors.branchCode}>
				<Label>رمز الفرع (اختياري)</Label>
				<Input
					dir="ltr"
					aria-invalid={!!errors.branchCode}
					{...register("branchCode", { setValueAs: emptyToNull })}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.branchCode]} />
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
