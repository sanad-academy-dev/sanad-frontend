import { type AccountsSettingsKey, type AccountsSettingsValues, type UpdateAccountsSettingsInput } from "@/server/accounting/accounts-settings/accounts-settings.type";
/**
 * [P0.4] Accounts Settings service (BRD §19).
 *
 * Reads always return the COMPLETE §19 set: stored rows are layered over the declared
 * defaults, so a caller in any later phase can read a flag unconditionally — no
 * `?? someDefault` scattered across the posting engine, and a clinic created before a flag
 * existed behaves exactly like one created after it.
 */
/** Materialise the defaults as rows (BRD §19: "ALL §19 keys seeded to defaults"). */
export declare function seedAccountsSettings(clinicId: string): Promise<number>;
/** Every §19 key, stored values layered over the defaults. */
export declare function getAccountsSettings(clinicId: string): Promise<AccountsSettingsValues>;
/** One flag, typed. The read path later phases use (`enable_immutable_ledger`, …). */
export declare function getAccountsSetting<K extends AccountsSettingsKey>(clinicId: string, key: K): Promise<AccountsSettingsValues[K]>;
/**
 * Validate and persist a partial update, then return the full resolved set.
 * Every value is parsed against its definition first: one bad flag rejects the whole save
 * rather than writing a half-valid settings state.
 */
export declare function updateAccountsSettings(clinicId: string, input: UpdateAccountsSettingsInput): Promise<AccountsSettingsValues>;
