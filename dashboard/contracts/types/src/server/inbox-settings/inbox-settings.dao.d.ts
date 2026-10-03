import { type InboxSettingsResponse, type UpdateInboxSettingsInput } from "@/server/inbox-settings/inbox-settings.type";
export declare const inboxSettingsDao: {
    get(userId: string, clinicId: string): Promise<InboxSettingsResponse>;
    upsert(userId: string, clinicId: string, data: UpdateInboxSettingsInput): Promise<InboxSettingsResponse>;
};
