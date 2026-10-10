import { type ClinicSettingsResponse, type UpdateSettingsInput } from "@/server/settings/settings.type";
export declare const settingsDao: {
    get(clinicId: string): Promise<ClinicSettingsResponse | null>;
    upsert(clinicId: string, data: UpdateSettingsInput): Promise<ClinicSettingsResponse>;
};
