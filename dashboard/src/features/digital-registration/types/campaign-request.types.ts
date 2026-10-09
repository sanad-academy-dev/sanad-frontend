export interface CampaignRequest {
    id: string;
    code: string;
    column: string;
    statusLabel: string;
    statusVariant: "warning" | "info" | "default";
    patientName: string;
    patientDetails: string;
    guardianName: string;
    tags: { label: string; variant: "warning" | "destructive" | "default" }[];
    date: string;
    documents: { count: number; total: number; status: string };
}
