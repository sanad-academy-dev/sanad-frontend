import { z } from "zod";
/** [CRM-P6] §12 — مرشّحات التقارير وأشكال نتائجها. */
export declare const crmReportFilterSchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    agentId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CrmReportFilterInput = z.infer<typeof crmReportFilterSchema>;
/**
 * الشكل الذي تعيده نقطة التقارير الواحدة.
 *
 * نقطةٌ واحدة لا سبع: الشاشة تعرضها معًا وتُرشِّحها معًا، وسبع رحلاتٍ شبكية بنفس
 * المرشّحات كانت ستُظهر أرقامًا من لحظاتٍ مختلفة على شاشةٍ واحدة — وهو أسوأ من البطء.
 */
export type CrmReportsResponse = {
    leadsByStatus: {
        statusId: string;
        name: string;
        color: string | null;
        count: number;
    }[];
    dealsByStatus: {
        statusId: string;
        name: string;
        color: string | null;
        kind: string;
        count: number;
        dealValue: number;
        expectedValue: number;
    }[];
    funnel: {
        totalLeads: number;
        convertedLeads: number;
        wonDeals: number;
        conversionRate: number;
        winRate: number;
    };
    forecast: {
        month: string;
        total: number;
    }[];
    avgDaysToConvert: number | null;
    avgDaysToWin: number | null;
    lostReasons: {
        reasonId: string | null;
        name: string;
        count: number;
    }[];
    agents: {
        userId: string;
        name: string;
        assignedLeads: number;
        convertedLeads: number;
        wonDeals: number;
    }[];
};
