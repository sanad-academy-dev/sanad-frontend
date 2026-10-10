import { type AccountsSettingRow, type UpsertAccountsSettingInput } from "@/server/accounting/accounts-settings/accounts-settings.type";
export declare const accountsSettingsDao: {
    list(clinicId: string): Promise<AccountsSettingRow[]>;
    /** Seed missing keys only — never overwrites an operator's value (idempotent). */
    createMissing(rows: UpsertAccountsSettingInput[]): Promise<number>;
    /** Write a batch of values in ONE transaction so a settings save is all-or-nothing. */
    upsertMany(rows: UpsertAccountsSettingInput[]): Promise<void>;
};
