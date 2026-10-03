import type { Prisma } from "@/generated/prisma/client";
export declare const inboxSettingsSelect: {
    liveEnabled: true;
    toastEnabled: true;
    soundEnabled: true;
    soundName: true;
    soundVolume: true;
    desktopEnabled: true;
    onlyHighImportance: true;
    typeAppointments: true;
    typeLab: true;
    typeRadiology: true;
    typeTasks: true;
    typeStock: true;
    typeInvoices: true;
    typeMentions: true;
    typeApprovals: true;
    typeSystem: true;
    typeInpatients: true;
};
export type InboxSettingsResponse = Prisma.UserInboxSettingsGetPayload<{
    select: typeof inboxSettingsSelect;
}>;
export type UpdateInboxSettingsInput = Partial<InboxSettingsResponse>;
export declare const DEFAULT_INBOX_SETTINGS: InboxSettingsResponse;
