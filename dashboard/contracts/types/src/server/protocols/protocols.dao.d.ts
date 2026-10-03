import { type UpdateProtocolsInput } from "@/server/protocols/protocols.type";
export declare const protocolsDao: {
    get(clinicId: string): Promise<{
        id: string;
        clinicId: string;
        soapNotes: boolean;
        avma: boolean;
        avmaMedicine: boolean;
        fecava: boolean;
        wsava: boolean;
        esccap: boolean;
        operationPaymentGate: boolean;
        operationCountsForMinor: boolean;
        operationRecoveryScoreMin: number;
    } | null>;
    upsert(clinicId: string, data: UpdateProtocolsInput): Promise<{
        id: string;
        clinicId: string;
        soapNotes: boolean;
        avma: boolean;
        avmaMedicine: boolean;
        fecava: boolean;
        wsava: boolean;
        esccap: boolean;
        operationPaymentGate: boolean;
        operationCountsForMinor: boolean;
        operationRecoveryScoreMin: number;
    }>;
};
