import type { ClinicInfoInput, OnboardingProfileResponse, UpsertProfileInput } from "./onboarding.type";
export declare const onboardingDao: {
    status(clinicId: string): Promise<{
        onboardingCompleted: boolean;
    }>;
    saveClinicInfo(clinicId: string, data: ClinicInfoInput): Promise<void>;
    isSlugTaken(slug: string, excludeClinicId: string): Promise<boolean>;
    suggestSlugs(base: string, excludeClinicId: string): Promise<string[]>;
    upsertProfile(clinicId: string, data: UpsertProfileInput): Promise<OnboardingProfileResponse>;
    complete(clinicId: string): Promise<void>;
};
