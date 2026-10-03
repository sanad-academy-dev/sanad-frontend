import { type AccountsSettingDefinition, type AccountsSettingsKey, type AccountsSettingsValues } from "@/server/accounting/accounts-settings/accounts-settings.type";
export declare function encodeSettingValue(definition: AccountsSettingDefinition, value: unknown): string | null;
/** Stored string → typed value. Unreadable rows fall back to the declared default. */
export declare function decodeSettingValue(definition: AccountsSettingDefinition, raw: string | null): unknown;
/**
 * Untrusted input → typed value. Throws an Arabic `Error` (repo convention, surfaced by
 * `app.ts`) naming the offending setting, so a bad flag never lands in the table.
 */
export declare function parseSettingValue(key: AccountsSettingsKey, input: unknown): unknown;
/** The declared default for every key — the shape `getAccountsSettings` starts from. */
export declare function defaultSettingValue<K extends AccountsSettingsKey>(key: K): AccountsSettingsValues[K];
