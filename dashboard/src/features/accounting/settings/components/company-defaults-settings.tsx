import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Container, ContainerRow } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { useCostCenters } from "@/features/accounting/cost-centers/hooks/use-cost-centers";
import { useCurrencies } from "@/features/accounting/currency-exchanges/hooks/use-currency-exchanges";
import { usePaymentTermsTemplates } from "@/features/accounting/payment-terms/hooks/use-payment-terms";
import {
	COMPANY_DEFAULTS_DEFINITIONS,
	COMPANY_DEFAULTS_GROUPS,
	COMPANY_DEFAULTS_KEYS,
	type CompanyDefaultDefinition,
	type CompanyDefaultsKey,
} from "@/features/accounting/settings/data/company-defaults-definitions";
import {
	useCompanyAccountingSettings,
	useFinanceBooks,
	useUpdateCompanyAccountingSettings,
} from "@/features/accounting/settings/hooks/use-company-settings";
import { useI18n } from "@/hooks/use-i18n";
import type { CompanyAccountingSettingsResponse } from "@/server/accounting/company-settings/company-settings.type";
import {
	type UpdateCompanyAccountingSettingsFormInput,
	updateCompanyAccountingSettingsSchema,
} from "@sanad/contracts/runtime/server/accounting/company-settings/company-settings.type";

/**
 * [P2-fix] Company accounting defaults section (BRD §4.1) on /management/settings/accounts.
 *
 * The round-off account gap: the PATCH API existed since P0.1 but nothing exposed it — the
 * Phase-2 "0.004 round-off" demo needs حساب التقريب set HERE. Settings-area anatomy
 * (`Container`/`ContainerRow`, page-level form, dirty-fields-only PATCH), same as the §19
 * flags below it; account pickers list POSTABLE accounts only (!isGroup && !freezeAccount
 * && !disabled — the engine's assertPostableAccount mirror).
 */

/** Combobox items can't carry null — sentinel row maps back to null on change. */
const NONE = "__none__";

export const CompanyDefaultsSettings = () => {
	const { isRtl } = useI18n();
	const { settings, isLoading } = useCompanyAccountingSettings();
	const { updateSettings, isPending } = useUpdateCompanyAccountingSettings();
	const { accounts } = useAccounts();
	const { costCenters } = useCostCenters();
	const { currencies } = useCurrencies();
	const { financeBooks } = useFinanceBooks();
	const { templates: paymentTermsTemplates } = usePaymentTermsTemplates();

	const postable = accounts.filter((a) => !a.isGroup && !a.freezeAccount && !a.disabled);
	const leafCostCenters = costCenters.filter((c) => !c.isGroup && !c.disabled);
	const activeBooks = financeBooks.filter((b) => !b.disabled);

	const label = (item: { labelAr: string; labelEn: string }) =>
		isRtl ? item.labelAr : item.labelEn;
	const description = (item: { descriptionAr: string; descriptionEn: string }) =>
		isRtl ? item.descriptionAr : item.descriptionEn;

	const accountLabel = (id: string | null | undefined) => {
		if (!id) return "";
		const account = accounts.find((a) => a.id === id);
		if (!account) return id;
		return account.accountNumber
			? `${account.accountName} (${account.accountNumber})`
			: account.accountName;
	};

	const {
		control,
		handleSubmit,
		register,
		reset,
		formState: { errors, dirtyFields, isDirty },
	} = useForm<UpdateCompanyAccountingSettingsFormInput>({
		resolver: zodResolver(updateCompanyAccountingSettingsSchema),
	});

	useEffect(() => {
		if (settings) reset(toFormValues(settings));
	}, [settings, reset]);

	const onSubmit = async (values: UpdateCompanyAccountingSettingsFormInput) => {
		// PATCH only what changed — same discipline as the §19 flags form below
		const changed = COMPANY_DEFAULTS_KEYS.filter(
			(key) => dirtyFields[key],
		).reduce<UpdateCompanyAccountingSettingsFormInput>(
			(acc, key) => Object.assign(acc, { [key]: values[key] }),
			{},
		);
		if (Object.keys(changed).length === 0) return;
		try {
			await updateSettings(changed);
			reset(values);
		} catch {
			// the mutation hook owns the toast
		}
	};

	if (isLoading || !settings) {
		return <Skeleton className="h-64 w-full" />;
	}

	const renderIdPicker = (
		key: CompanyDefaultsKey,
		definition: CompanyDefaultDefinition,
		options: { id: string; label: string }[],
		emptyText: string,
	) => (
		<Controller
			name={key}
			control={control}
			render={({ field }) => (
				<Field
					data-invalid={!!errors[key]}
					className="w-72"
				>
					<Combobox
						value={(field.value as string | null) ?? NONE}
						onValueChange={(value) =>
							field.onChange(typeof value === "string" && value !== NONE ? value : null)
						}
					>
						<ComboboxTrigger className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-2 text-sm">
							<ComboboxValue
								placeholder={label(definition)}
								className="truncate"
							>
								{field.value
									? (options.find((o) => o.id === field.value)?.label ?? field.value)
									: "— بدون —"}
							</ComboboxValue>
						</ComboboxTrigger>
						<ComboboxContent dir={isRtl ? "rtl" : "ltr"}>
							<ComboboxList>
								<ComboboxItem value={NONE}>— بدون —</ComboboxItem>
								{options.length === 0 ? (
									<ComboboxEmpty>{emptyText}</ComboboxEmpty>
								) : (
									options.map((option) => (
										<ComboboxItem
											key={option.id}
											value={option.id}
										>
											{option.label}
										</ComboboxItem>
									))
								)}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
					<FieldError errors={[errors[key]]} />
				</Field>
			)}
		/>
	);

	const renderControl = (key: CompanyDefaultsKey, definition: CompanyDefaultDefinition) => {
		switch (definition.kind) {
			case "account":
				return renderIdPicker(
					key,
					definition,
					postable.map((a) => ({ id: a.id, label: accountLabel(a.id) })),
					"لا حسابات قابلة للترحيل",
				);
			case "costCenter":
				return renderIdPicker(
					key,
					definition,
					leafCostCenters.map((c) => ({
						id: c.id,
						label: c.costCenterNumber
							? `${c.costCenterName} (${c.costCenterNumber})`
							: c.costCenterName,
					})),
					"لا مراكز تكلفة",
				);
			case "financeBook":
				return renderIdPicker(
					key,
					definition,
					activeBooks.map((b) => ({ id: b.id, label: b.financeBookName })),
					"لا دفاتر مالية",
				);
			case "paymentTermsTemplate":
				return renderIdPicker(
					key,
					definition,
					paymentTermsTemplates.map((t) => ({ id: t.id, label: t.templateName })),
					"لا قوالب شروط دفع",
				);
			case "currency":
				return (
					<Controller
						name={key}
						control={control}
						render={({ field }) => (
							<Field
								data-invalid={!!errors[key]}
								className="w-56"
							>
								<Select
									value={(field.value as string | null) ?? ""}
									onValueChange={field.onChange}
									disabled={isPending}
									dir={isRtl ? "rtl" : "ltr"}
								>
									<SelectTrigger
										size="sm"
										aria-invalid={!!errors[key]}
									>
										<SelectValue placeholder={label(definition)} />
									</SelectTrigger>
									<SelectContent dir={isRtl ? "rtl" : "ltr"}>
										{currencies
											.filter((c) => c.enabled || c.code === field.value)
											.map((currency) => (
												<SelectItem
													key={currency.code}
													value={currency.code}
												>
													{`${currency.code} — ${isRtl ? currency.nameAr : currency.name}`}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
								<FieldError errors={[errors[key]]} />
							</Field>
						)}
					/>
				);
			case "boolean":
				return (
					<Controller
						name={key}
						control={control}
						render={({ field }) => (
							<Switch
								checked={(field.value as boolean | undefined) ?? false}
								onCheckedChange={field.onChange}
								disabled={isPending}
								aria-label={label(definition)}
							/>
						)}
					/>
				);
			case "money":
				return (
					<Field
						data-invalid={!!errors[key]}
						className="w-40"
					>
						<Input
							type="text"
							inputMode="decimal"
							aria-invalid={!!errors[key]}
							aria-label={label(definition)}
							disabled={isPending}
							// numbers read left-to-right in both locales
							dir="ltr"
							{...register(key, {
								setValueAs: (v: string) => (v === "" || v == null ? null : v),
							})}
						/>
						<FieldError errors={[errors[key]]} />
					</Field>
				);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-8"
		>
			{COMPANY_DEFAULTS_GROUPS.map((group) => {
				const keys = COMPANY_DEFAULTS_KEYS.filter(
					(key) => COMPANY_DEFAULTS_DEFINITIONS[key].group === group.id,
				);
				if (keys.length === 0) return null;
				return (
					<Container
						key={group.id}
						title={label(group)}
					>
						{keys.map((key) => {
							const definition = COMPANY_DEFAULTS_DEFINITIONS[key];
							return (
								<ContainerRow
									key={key}
									title={label(definition)}
									subtitle={description(definition)}
									action={renderControl(key, definition)}
								/>
							);
						})}
					</Container>
				);
			})}

			{/* section-scoped save row (non-sticky — the §19 form below owns the sticky bar) */}
			<div className="flex justify-end gap-2 border-t py-3">
				<Button
					type="button"
					variant="outline"
					disabled={!isDirty || isPending}
					onClick={() => reset(toFormValues(settings))}
				>
					إلغاء
				</Button>
				<Button
					type="submit"
					disabled={!isDirty || isPending}
				>
					حفظ الإعدادات الافتراضية
				</Button>
			</div>
		</form>
	);
};

/** Response → form values: id fields pass through; Decimal creditLimit travels as string. */
function toFormValues(
	settings: CompanyAccountingSettingsResponse,
): UpdateCompanyAccountingSettingsFormInput {
	return {
		defaultCurrencyCode: settings.defaultCurrencyCode,
		defaultReceivableAccountId: settings.defaultReceivableAccountId,
		defaultPayableAccountId: settings.defaultPayableAccountId,
		defaultIncomeAccountId: settings.defaultIncomeAccountId,
		defaultExpenseAccountId: settings.defaultExpenseAccountId,
		defaultCashAccountId: settings.defaultCashAccountId,
		defaultBankAccountId: settings.defaultBankAccountId,
		roundOffAccountId: settings.roundOffAccountId,
		roundOffForOpeningAccountId: settings.roundOffForOpeningAccountId,
		writeOffAccountId: settings.writeOffAccountId,
		exchangeGainLossAccountId: settings.exchangeGainLossAccountId,
		unrealizedExchangeGainLossAccountId: settings.unrealizedExchangeGainLossAccountId,
		unrealizedProfitLossAccountId: settings.unrealizedProfitLossAccountId,
		defaultDiscountAccountId: settings.defaultDiscountAccountId,
		defaultDeferredRevenueAccountId: settings.defaultDeferredRevenueAccountId,
		defaultDeferredExpenseAccountId: settings.defaultDeferredExpenseAccountId,
		defaultAdvanceReceivedAccountId: settings.defaultAdvanceReceivedAccountId,
		defaultAdvancePaidAccountId: settings.defaultAdvancePaidAccountId,
		roundOffCostCenterId: settings.roundOffCostCenterId,
		defaultCostCenterId: settings.defaultCostCenterId,
		defaultFinanceBookId: settings.defaultFinanceBookId,
		defaultPaymentTermsTemplateId: settings.defaultPaymentTermsTemplateId,
		creditLimit: settings.creditLimit == null ? null : String(settings.creditLimit),
		bypassCreditLimitCheck: settings.bypassCreditLimitCheck,
	};
}
