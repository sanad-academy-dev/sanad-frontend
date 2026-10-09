import type { CampaignRequest } from "../types/campaign-request.types";

export const mockCampaignRequests: CampaignRequest[] = [
    {
        id: "1",
        code: "APP-1001",
        column: "WAITING",
        statusLabel: "معلق",
        statusVariant: "warning",
        patientName: "ليان محمد",
        patientDetails: "2 سنوات - أنثى",
        guardianName: "محمد السالم",
        tags: [
            { label: "حساسية فول سوداني", variant: "warning" },
            { label: "ربو خفيف", variant: "destructive" },
        ],
        date: "1/02/2026",
        documents: { count: 2, total: 3, status: "ناقص" },
    },
    {
        id: "2",
        code: "APP-1016",
        column: "REVIEW",
        statusLabel: "قيد التنفيذ",
        statusVariant: "info",
        patientName: "ليان محمد",
        patientDetails: "5 سنوات - ذكر",
        guardianName: "محمد السالم",
        tags: [
            { label: "حساسية فول سوداني", variant: "warning" },
        ],
        date: "16/02/2026",
        documents: { count: 2, total: 8, status: "ناقص" },
    },
    {
        id: "3",
        code: "APP-1011",
        column: "WAITING_REPLY",
        statusLabel: "معلق",
        statusVariant: "warning",
        patientName: "يوسف عبدالله",
        patientDetails: "4 سنوات - أنثى",
        guardianName: "محمد السالم",
        tags: [],
        date: "",
        documents: { count: 3, total: 8, status: "" },
    }
];
