import type { Prisma } from "@/generated/prisma/client";
export declare const onboardingProfileSelect: {
    id: true;
    clinicId: true;
    specialtyType: true;
    mainGoal: true;
    clinicSize: true;
    animalTypes: true;
    monthlyVisits: true;
    monthlyPatients: true;
    multiBranch: true;
    serviceDelivery: true;
    referralSource: true;
};
export type OnboardingProfileResponse = Prisma.ClinicOnboardingProfileGetPayload<{
    select: typeof onboardingProfileSelect;
}>;
export type UpsertProfileInput = Partial<Pick<Prisma.ClinicOnboardingProfileUncheckedCreateInput, "specialtyType" | "mainGoal" | "clinicSize" | "animalTypes" | "monthlyVisits" | "monthlyPatients" | "multiBranch" | "serviceDelivery" | "referralSource">>;
export type ClinicInfoInput = {
    name: string;
    slug?: string | null;
};
