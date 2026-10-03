import type { Prisma } from "@/generated/prisma/client";
export declare const settingsSelect: {
    id: true;
    clinicId: true;
    name: true;
    logo: true;
    email: true;
    phone: true;
    licenseNumber: true;
    taxRegistryNumber: true;
    website: true;
    city: true;
    address: true;
    countryCode: true;
    timezone: true;
    calendarType: true;
    timeFormat: true;
    vatRate: true;
    currencyCode: true;
    attendanceEnabled: true;
    kioskEnabled: true;
    kioskPin: true;
    isVerified: true;
    clinic: {
        select: {
            slug: true;
        };
    };
};
type ClinicSettingsPayload = Prisma.ClinicSettingsGetPayload<{
    select: typeof settingsSelect;
}>;
export type ClinicSettingsResponse = Omit<ClinicSettingsPayload, "clinic"> & {
    slug: string | null;
};
export type UpdateSettingsInput = Partial<Omit<ClinicSettingsResponse, "id" | "clinicId" | "isVerified" | "slug">> & {
    slug?: string | null;
};
export {};
