export type GenerateLabReportResult = {
    ok: true;
    report: string;
} | {
    ok: false;
    reason: "not-found" | "no-results" | "provider";
};
export declare const generateLabReport: (itemId: string, clinicId: string) => Promise<GenerateLabReportResult>;
