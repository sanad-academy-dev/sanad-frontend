import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Container, ContainerRow } from "@/components/common/container";
import { DateField } from "@/components/common/date-field";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
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
import { CompanyDefaultsSettings } from "@/features/accounting/settings/components/company-defaults-settings";
import {
	useAccountsSettings,
	useUpdateAccountsSettings,
} from "@/features/accounting/settings/hooks/use-accounts-settings";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import { useI18n } from "@/hooks/use-i18n";
import {
	ACCOUNTS_SETTINGS_DEFINITIONS,
	ACCOUNTS_SETTINGS_GROUPS,
	type AccountsSettingDefinition,
	type AccountsSettingsKey,
	type AccountsSettingsValues,
	accountsSettingsFormSchema,
	type UpdateAccountsSettingsInput,
} from "@sanad/contracts/runtime/server/accounting/accounts-settings/accounts-settings.type";
import { ACCOUNTING_DOCTYPES } from "@sanad/contracts/accounting/permissions";

/**
 * [P0.4] Accounts Settings screen (BRD §19) — grouped toggles.
 *
 * Rendered from the definition registry, so a new §19 flag appears here by adding one
 * registry entry; there is no per-flag JSX to forget. Only dirty fields are PATCHed, which
 * is what keeps a save from stamping 44 rows every time one switch moves.
 *
 * Design system: `Container`/`ContainerRow` (the settings row kit already used by the other
 * settings pages) plus `Switch`/`Input`/`Select`/`DateField`/`Combobox`. Tokens only, no new
 * component, no restyle (CONTRACT §3, §5 "not a gap — reuse as-is").
 */

const ACCOUNT_NONE = "__none__";

const REPOSTABLE_DOCTYPES = ACCOUNTING_DOCTYPES.filter((d) => d.kind === "voucher");

const SETTING_KEYS = Object.keys(ACCOUNTS_SETTINGS_DEFINITIONS) as AccountsSettingsKey[];

export const AccountsSettingsPage = () => {
	const { settings, isLoading } = useAccountsSettings();

	// The form is a CHILD that only mounts once the settings are in hand, so `useForm` can
	// seed `defaultValues` synchronously on its very first render. See the note on
	// `AccountsSettingsForm` for why one render holding `undefined` used to break Save.
	if (isLoading || !settings) {
		return (
			<SettingsPageWrapper>
				<CompanyDefaultsSettings />
				{ACCOUNTS_SETTINGS_GROUPS.map((group) => (
					<Skeleton
						key={group.id}
						className="h-40 w-full"
					/>
				))}
			</SettingsPageWrapper>
		);
	}

	return <AccountsSettingsForm settings={settings} />;
};

/**
 * The §19 form. `settings` is already loaded — the parent guarantees it.
 *
 * WHY THIS IS A SEPARATE COMPONENT (defect found in local review, MI branch):
 * `useForm` applies both `reset()`-in-an-effect and the `values` prop AFTER the first
 * commit, so the controls used to mount for one render holding `undefined`. `Switch` and
 * `Input` shrug that off, but Radix `Select` reads an `undefined` value as *uncontrolled*,
 * normalises it to `""` and then fires `onValueChange("")` — writing the empty string into
 * form state on top of the value that had just been loaded. The five enum settings then
 * failed `z.enum` on every submit ("قيمة «…» غير مسموحة"), and since `handleSubmit` never
 * invokes `onSubmit` when validation fails, Save did nothing at all: no PATCH, no toast,
 * no visible reason. Mounting the form only when the values exist lets `defaultValues`
 * seed them synchronously, so no control ever sees `undefined`.
 */
const AccountsSettingsForm = ({ settings }: { settings: AccountsSettingsValues }) => {
	const { t, isRtl } = useI18n();
	const { updateSettings, isPending } = useUpdateAccountsSettings();
	const { accounts } = useAccounts();

	// [P12.6] the same postable-leaf mirror `assertPostableAccount` applies server-side
	const postableAccounts = accounts.filter(
		(account) => !account.isGroup && !account.freezeAccount && !account.disabled,
	);
	const accountLabel = (id: string) => {
		const account = accounts.find((row) => row.id === id);
		if (!account) return id;
		return account.accountNumber
			? `${account.accountName} (${account.accountNumber})`
			: account.accountName;
	};

	// Labels/descriptions live in the definition registry (they belong to the §19 key, and
	// the API serves them too) rather than translation.json; the locale picks the variant.
	const label = (item: { labelAr: string; labelEn: string }) =>
		isRtl ? item.labelAr : item.labelEn;
	const description = (item: { descriptionAr: string; descriptionEn: string }) =>
		isRtl ? item.descriptionAr : item.descriptionEn;

	// `defaultValues` seeds the first render (see the note above); `values` keeps the form in
	// step with the server after a save or a refetch, and `keepDirtyValues` stops a
	// background refetch from throwing away edits the user has not saved yet.
	const {
		control,
		handleSubmit,
		register,
		reset,
		formState: { errors, dirtyFields, isDirty },
	} = useForm<AccountsSettingsValues>({
		resolver: zodResolver(accountsSettingsFormSchema),
		defaultValues: settings,
		values: settings,
		resetOptions: { keepDirtyValues: true },
	});

	const onSubmit = async (values: AccountsSettingsValues) => {
		// send only what changed — a settings save is a partial update (PATCH)
		const changed = SETTING_KEYS.filter(
			(key) => dirtyFields[key],
		).reduce<UpdateAccountsSettingsInput>(
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

	const renderControl = (key: AccountsSettingsKey, definition: AccountsSettingDefinition) => {
		if (definition.type === "boolean") {
			return (
				<Controller
					name={key}
					control={control}
					render={({ field }) => (
						<Switch
							checked={field.value as boolean}
							onCheckedChange={field.onChange}
							disabled={isPending}
							aria-label={label(definition)}
						/>
					)}
				/>
			);
		}

		if (definition.type === "enum") {
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
								value={field.value as string}
								onValueChange={field.onChange}
								disabled={isPending}
								dir={isRtl ? "rtl" : "ltr"}
							>
								<SelectTrigger
									size="sm"
									aria-invalid={!!errors[key]}
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent dir={isRtl ? "rtl" : "ltr"}>
									{definition.options.map((option) => (
										<SelectItem
											key={option}
											value={option}
										>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError errors={[errors[key]]} />
						</Field>
					)}
				/>
			);
		}

		if (definition.type === "date") {
			return (
				<Controller
					name={key}
					control={control}
					render={({ field }) => (
						<Field
							data-invalid={!!errors[key]}
							className="w-56"
						>
							<DateField
								value={(field.value as string | null) ?? ""}
								onChange={(value) => field.onChange(value || null)}
								placeholder={label(definition)}
								invalid={!!errors[key]}
								triggerDisabled={isPending}
							/>
							<FieldError errors={[errors[key]]} />
						</Field>
					)}
				/>
			);
		}

		if (definition.type === "string_list") {
			return (
				<Controller
					name={key}
					control={control}
					render={({ field }) => {
						const selected = (field.value as string[] | undefined) ?? [];
						return (
							<Field
								data-invalid={!!errors[key]}
								className="w-72"
							>
								<Combobox
									multiple
									value={selected}
									onValueChange={(value) => field.onChange(value ?? [])}
								>
									<ComboboxChips className="min-h-8 gap-1 px-2 py-1">
										{selected.map((value) => (
											<ComboboxChip
												key={value}
												value={value}
												className="text-xs"
											>
												{label(
													REPOSTABLE_DOCTYPES.find((d) => d.labelEn === value) ?? {
														labelAr: value,
														labelEn: value,
													},
												)}
											</ComboboxChip>
										))}
										<ComboboxChipsInput className="text-xs" />
									</ComboboxChips>
									<ComboboxContent dir={isRtl ? "rtl" : "ltr"}>
										<ComboboxEmpty>{t("table.noResults")}</ComboboxEmpty>
										<ComboboxList>
											{REPOSTABLE_DOCTYPES.map((doctype) => (
												<ComboboxItem
													key={doctype.key}
													value={doctype.labelEn}
												>
													{label(doctype)}
												</ComboboxItem>
											))}
										</ComboboxList>
									</ComboboxContent>
								</Combobox>
								<FieldError errors={[errors[key]]} />
							</Field>
						);
					}}
				/>
			);
		}

		/**
		 * A setting whose value is a LEDGER ACCOUNT ID gets a picker, not a text box.
		 *
		 * Five keys carry account ids (`adapter_vat`, `adapter_cogs`, `adapter_stock`, and the
		 * two [P12.6] advance accounts). Rendered by the generic string branch they were bare
		 * inputs asking an operator to paste a `cuid()` — unusable in practice, and a typo
		 * would be accepted silently and only surface as a posting failure later. Keyed off the
		 * `_account_id` suffix so a sixth such key is handled the day it is added.
		 */
		if (definition.type === "string" && key.endsWith("_account_id")) {
			return (
				<Controller
					key={key}
					name={key}
					control={control}
					render={({ field }) => (
						<Field
							data-invalid={!!errors[key]}
							className="w-72"
						>
							<Combobox
								value={typeof field.value === "string" ? field.value : ACCOUNT_NONE}
								onValueChange={(value) =>
									field.onChange(
										typeof value === "string" && value !== ACCOUNT_NONE ? value : "",
									)
								}
							>
								<ComboboxTrigger
									className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-1.5 text-sm"
									aria-disabled={isPending}
									aria-label={label(definition)}
								>
									<ComboboxValue
										placeholder="— بلا حساب —"
										className="truncate"
									>
										{typeof field.value === "string" && field.value
											? accountLabel(field.value)
											: undefined}
									</ComboboxValue>
								</ComboboxTrigger>
								<ComboboxContent dir={isRtl ? "rtl" : "ltr"}>
									<ComboboxList>
										<ComboboxItem value={ACCOUNT_NONE}>— بلا حساب —</ComboboxItem>
										{postableAccounts.length === 0 ? (
											<ComboboxEmpty>لا حسابات قابلة للترحيل</ComboboxEmpty>
										) : (
											postableAccounts.map((account) => (
												<ComboboxItem
													key={account.id}
													value={account.id}
												>
													<span className="truncate">{accountLabel(account.id)}</span>
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
		}

		// int / decimal / string
		const isNumeric = definition.type === "int" || definition.type === "decimal";
		return (
			<Field
				data-invalid={!!errors[key]}
				className="w-40"
			>
				<Input
					type={definition.type === "int" ? "number" : "text"}
					inputMode={isNumeric ? "decimal" : undefined}
					min={definition.type === "int" ? definition.min : undefined}
					max={definition.type === "int" ? definition.max : undefined}
					aria-invalid={!!errors[key]}
					aria-label={label(definition)}
					disabled={isPending}
					// numbers read left-to-right in both locales
					dir={isNumeric ? "ltr" : undefined}
					{...register(key)}
				/>
				<FieldError errors={[errors[key]]} />
			</Field>
		);
	};

	return (
		<SettingsPageWrapper>
			{/* [P2-fix] §4.1 company defaults FIRST — setup starts here (round-off account etc.) */}
			<CompanyDefaultsSettings />
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-8"
			>
				{ACCOUNTS_SETTINGS_GROUPS.map((group) => {
					const keys = SETTING_KEYS.filter(
						(key) => ACCOUNTS_SETTINGS_DEFINITIONS[key].group === group.id,
					);
					if (keys.length === 0) return null;

					return (
						<Container
							key={group.id}
							title={label(group)}
						>
							{keys.map((key) => {
								const definition: AccountsSettingDefinition =
									ACCOUNTS_SETTINGS_DEFINITIONS[key];
								// [LY-P0] مفتاح متجاوَز: يبقى معروضًا (§19 يُلزم بالمجموعة الكاملة)
								// لكنّه معطَّل — مفتاحٌ يُقلَب ولا يفعل شيئًا أسوأ من غيابه
								const superseded = Boolean(definition.supersededBy);
								return (
									<ContainerRow
										key={key}
										title={label(definition)}
										subtitle={description(definition)}
										action={
											superseded ? (
												<span className="text-muted-foreground text-xs">معطَّل</span>
											) : (
												renderControl(key, definition)
											)
										}
									/>
								);
							})}
						</Container>
					);
				})}

				<div className="sticky bottom-0 flex justify-end gap-2 border-t bg-background py-3">
					<Button
						type="button"
						variant="outline"
						disabled={!isDirty || isPending}
						onClick={() => reset(settings)}
					>
						{t("accounting.settings.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={!isDirty || isPending}
					>
						{t("accounting.settings.save")}
					</Button>
				</div>
			</form>
		</SettingsPageWrapper>
	);
};
