import type { AdObjective } from "@/generated/prisma/enums";
export type SuggestedAudience = {
    name: string;
    ageMin: number;
    ageMax: number;
    locations: string[];
    languages: string[];
    interests: string[];
    rationale: string;
};
export declare function suggestAudiences(input: {
    objective: AdObjective;
    clinicName: string;
    /** مدينة الأكاديمية إن عُرفت — الاستهداف الجغرافي بلا مدينة تخمين محض */
    city?: string | null;
    count?: number;
}): Promise<SuggestedAudience[]>;
