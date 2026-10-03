import type { Prisma } from "@/generated/prisma/client";
type Tx = Prisma.TransactionClient;
export declare function postPurchaseOrderToFinance(tx: Tx, purchaseOrderId: string): Promise<{
    id: string;
    code: string;
} | null>;
export {};
