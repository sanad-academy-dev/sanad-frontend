import type { Prisma } from "@/generated/prisma/client";
export declare const publicClinicStaffSelect: {
    id: true;
    name: true;
    prefix: true;
    avatar: true;
    primarySpecialization: {
        select: {
            id: true;
            name: true;
        };
    };
    secondarySpecialization: {
        select: {
            id: true;
            name: true;
        };
    };
    branch: {
        select: {
            id: true;
            name: true;
            city: true;
        };
    };
    services: {
        where: {
            isActive: true;
        };
        select: {
            service: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
    };
    consultationTypes: {
        where: {
            isActive: true;
            consultationType: {
                active: true;
            };
        };
        select: {
            consultationType: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
    };
};
export type PublicConsultationType = {
    id: string;
    name: string;
    price: number | null;
};
export type PublicClinicService = {
    id: string;
    name: string;
    durationMinutes: number;
    price: number | null;
};
export type PublicClinicCategory = {
    id: string;
    name: string;
    courseCount: number;
};
export type PublicSlotDay = {
    date: string;
    isWorking: boolean;
    slots: {
        startMinute: number;
        available: boolean;
    }[];
};
export type PublicSlotRangeResponse = {
    durationMinutes: number;
    days: PublicSlotDay[];
};
type PublicClinicStaffBase = Prisma.StaffGetPayload<{
    select: typeof publicClinicStaffSelect;
}>;
export type PublicClinicStaffResponse = Omit<PublicClinicStaffBase, "consultationTypes"> & {
    consultationTypes: PublicConsultationType[];
};
export declare const publicClinicSelect: {
    id: true;
    slug: true;
    name: true;
    settings: {
        select: {
            logo: true;
            email: true;
            phone: true;
            website: true;
            city: true;
            address: true;
            description: true;
            isVerified: true;
        };
    };
};
type PublicClinicPayload = Prisma.ClinicGetPayload<{
    select: typeof publicClinicSelect;
}>;
export type PublicClinicResponse = Omit<PublicClinicPayload, "settings"> & {
    logo: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    city: string | null;
    address: string | null;
    description: string | null;
    isVerified: boolean;
};
export type PublicAnimalType = {
    id: string;
    arName: string;
    enName: string;
};
export {};
