import type { CrmReferenceType } from "@/generated/prisma/enums";
import type { CrmTimelinePage } from "@/server/crm/crm-timeline/crm-timeline.type";
export declare function getTimeline(clinicId: string, referenceType: CrmReferenceType, referenceId: string, query: {
    types?: string;
    cursor?: string;
    limit?: number;
}): Promise<CrmTimelinePage>;
