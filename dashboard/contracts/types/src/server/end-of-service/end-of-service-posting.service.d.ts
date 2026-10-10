import type { Prisma } from "@/generated/prisma/client";
type Tx = Prisma.TransactionClient;
export interface EosPostingInput {
    clinicId: string;
    settlementId: string;
    code: string;
    staffId: string;
    staffName: string;
    amount: number;
    endDate: Date;
}
export declare function postEosToFinance(tx: Tx, input: EosPostingInput): Promise<{
    id: string;
    code: string;
} | null>;
export {};
