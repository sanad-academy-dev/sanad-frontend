import type { Prisma } from "@/generated/prisma/client";
export declare const protocolsSelect: {
    id: true;
    clinicId: true;
    avma: true;
    soapNotes: true;
    avmaMedicine: true;
    fecava: true;
    wsava: true;
    esccap: true;
    operationPaymentGate: true;
    operationCountsForMinor: true;
    operationRecoveryScoreMin: true;
};
export type ClinicProtocolsResponse = Prisma.ClinicProtocolsGetPayload<{
    select: typeof protocolsSelect;
}>;
export type UpdateProtocolsInput = Partial<Omit<ClinicProtocolsResponse, "id" | "clinicId">>;
