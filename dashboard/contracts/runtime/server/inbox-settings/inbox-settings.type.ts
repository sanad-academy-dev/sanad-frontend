import type { Prisma } from "@/generated/prisma/client";

// تفضيلات التنبيه المباشر للوارد لمستخدم واحد داخل أكاديمية واحدة.
// id/userId/clinicId غير مُعادة — العميل لا يحتاجها ولا يجب أن يرسلها.
export const inboxSettingsSelect = {
	liveEnabled: true,
	toastEnabled: true,
	soundEnabled: true,
	soundName: true,
	soundVolume: true,
	desktopEnabled: true,
	onlyHighImportance: true,
	typeAppointments: true,
	typeLab: true,
	typeRadiology: true,
	typeTasks: true,
	typeStock: true,
	typeInvoices: true,
	typeMentions: true,
	typeApprovals: true,
	typeSystem: true,
	typeInpatients: true,
} satisfies Prisma.UserInboxSettingsSelect;

export type InboxSettingsResponse = Prisma.UserInboxSettingsGetPayload<{
	select: typeof inboxSettingsSelect;
}>;

export type UpdateInboxSettingsInput = Partial<InboxSettingsResponse>;

// نفس قيم @default في prisma/schema.prisma — تُعاد قبل أن يحفظ المستخدم أي تفضيل،
// حتى لا يحتاج العميل إلى `?? true` عند كل حقل.
export const DEFAULT_INBOX_SETTINGS: InboxSettingsResponse = {
	liveEnabled: true,
	toastEnabled: true,
	soundEnabled: true,
	soundName: "CHIME",
	soundVolume: 75,
	desktopEnabled: false,
	onlyHighImportance: false,
	typeAppointments: true,
	typeLab: true,
	typeRadiology: true,
	typeTasks: true,
	typeStock: true,
	typeInvoices: true,
	typeMentions: true,
	typeApprovals: true,
	typeSystem: true,
	typeInpatients: true,
};
