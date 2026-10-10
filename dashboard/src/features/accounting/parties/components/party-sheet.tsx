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
import { Switch } from "@/components/ui/switch";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useCurrencies } from "@/features/accounting/currency-exchanges/hooks/use-currency-exchanges";
import { usePartyActions } from "@/features/accounting/parties/hooks/use-parties";
import {
	type PartyListRow,
	partySideOf,
	type UpdatePartyAccountingFormInput,
	updatePartyAccountingSchema,
} from "@sanad/contracts/runtime/server/accounting/party/party.type";

/**
 * [P3.1] Party accounting sheet (BRD §4.10) — edits the accounting children of an
 * EXISTING master (parties are created in their own modules; this screen never creates).
 * The account picker offers postable accounts of the party's natural side only
 * (Receivable for Owners, Payable for Suppliers/Staff — BR-4.10.1's type check, applied
 * at the door instead of at save-fail time).
 */

const NO_ACCOUNT = "__none__";
const NO_CURRENCY = "__none__";

export type PartySheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	party: PartyListRow | null;
};

export const PartySheet = ({ open, onOpenChange, party }: PartySheetProps) => {
	const { update, isSaving } = usePartyActions();
	const { accounts } = useAccounts();
	const { currencies } = useCurrencies();

	const side = party ? partySideOf(party.partyType) : "RECEIVABLE";
	const eligible = accounts.filter(
		(a) => !a.isGroup && !a.freezeAccount && !a.disabled && a.accountType === side,
	);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UpdatePartyAccountingFormInput>({
		resolver: zodResolver(updatePartyAccountingSchema),
	});

	useEffect(() => {
		if (!open || !party) return;
		reset({
			accountId: party.account?.accountId ?? null,
			defaultCurrencyCode: party.config?.defaultCurrencyCode ?? null,
			creditLimit: party.creditLimit ? String(party.creditLimit.creditLimit) : null,
			bypassCreditLimitCheck: party.creditLimit?.bypassCreditLimitCheck ?? false,
			isFrozen: party.config?.isFrozen ?? false,
			disabled: party.config?.disabled ?? false,
		});
	}, [open, party, reset]);

	const onSubmit = handleSubmit((values) => {
		if (!party) return;
		update(party.partyType, party.partyId, values);
		onOpenChange(false);
	});

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={party ? `إعدادات الطرف: ${party.name}` : "إعدادات الطرف"}
			description="حساب الطرف وحد الائتمان وحالة التجميد (BRD §4.10)."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel="حفظ"
		>
			<Controller
				name="accountId"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.accountId}>
						<Label>
							{side === "RECEIVABLE"
								? "حساب الذمم المدينة المخصص"
								: "حساب الذمم الدائنة المخصص"}
						</Label>
						<Select
							value={field.value ?? NO_ACCOUNT}
							onValueChange={(v) => field.onChange(v === NO_ACCOUNT ? null : v)}
							dir="rtl"
							disabled={isSaving}
						>
							<SelectTrigger>
								<SelectValue placeholder="افتراضي الشركة" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NO_ACCOUNT}>— افتراضي الشركة —</SelectItem>
								{eligible.map((a) => (
									<SelectItem
										key={a.id}
										value={a.id}
									>
										{a.accountName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError errors={[errors.accountId]} />
					</Field>
				)}
			/>

			<Controller
				name="defaultCurrencyCode"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.defaultCurrencyCode}>
						<Label>العملة الافتراضية</Label>
						<Select
							value={field.value ?? NO_CURRENCY}
							onValueChange={(v) => field.onChange(v === NO_CURRENCY ? null : v)}
							dir="rtl"
							disabled={isSaving}
						>
							<SelectTrigger>
								<SelectValue placeholder="عملة الشركة" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NO_CURRENCY}>— عملة الشركة —</SelectItem>
								{currencies
									.filter((c) => c.enabled)
									.map((c) => (
										<SelectItem
											key={c.code}
											value={c.code}
										>
											{`${c.code} — ${c.nameAr}`}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
						<FieldError errors={[errors.defaultCurrencyCode]} />
					</Field>
				)}
			/>

			<Field data-invalid={!!errors.creditLimit}>
				<Label>حد الائتمان</Label>
				<Input
					inputMode="decimal"
					dir="ltr"
					placeholder="0"
					aria-invalid={!!errors.creditLimit}
					{...register("creditLimit", {
						setValueAs: (v: string) => (v === "" || v == null ? null : v),
					})}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.creditLimit]} />
			</Field>

			<Controller
				name="bypassCreditLimitCheck"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>تجاوز فحص حد الائتمان</Label>
						<Switch
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							disabled={isSaving}
						/>
					</Field>
				)}
			/>

			<Controller
				name="isFrozen"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>مجمّد (الترحيل لمراقب الائتمان فقط)</Label>
						<Switch
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							disabled={isSaving}
						/>
					</Field>
				)}
			/>

			<Controller
				name="disabled"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>معطّل محاسبيًا (لا ترحيل إطلاقًا)</Label>
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
