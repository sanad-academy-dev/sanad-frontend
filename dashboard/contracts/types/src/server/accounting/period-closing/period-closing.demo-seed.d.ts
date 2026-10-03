import "@/server/accounting/period-closing/period-closing.job";
export declare function seedPeriodControlDemo(clinicId: string): Promise<{
    created: string[];
    existing: string[];
}>;
