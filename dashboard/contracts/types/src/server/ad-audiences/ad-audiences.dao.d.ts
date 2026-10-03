import type { Prisma } from "@/generated/prisma/client";
import { type AdAudienceResponse } from "@/server/ad-audiences/ad-audiences.type";
export type CreateAdAudienceInput = Pick<Prisma.AdAudienceUncheckedCreateInput, "name" | "ageMin" | "ageMax"> & Partial<Pick<Prisma.AdAudienceUncheckedCreateInput, "locations" | "languages" | "interests" | "isAiSuggested" | "aiRationale">>;
export declare const adAudiencesDao: {
    list(clinicId: string): Promise<AdAudienceResponse[]>;
    create(clinicId: string, input: CreateAdAudienceInput): Promise<AdAudienceResponse>;
    remove(clinicId: string, id: string): Promise<boolean>;
};
