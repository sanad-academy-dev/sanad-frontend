import type { Prisma } from "@/generated/prisma/client";
type Tx = Prisma.TransactionClient;
export interface PayrollPostingInput {
    clinicId: string;
    runId: string;
    runCode: string;
    periodYear: number;
    periodMonth: number;
    totalCompanyCost: number;
    requesterId: string;
    branchId?: string | null;
}
/**
 * ينشئ مصروفًا مُرحَّلًا من مسير رواتب معتمد.
 *
 * يُستدعى داخل معاملة `approveRun`. يعيد المصروف المُنشأ، أو `null` إن كان
 * الترحيل قد تم سابقًا (القيد الفريد) — وهي حالة غير خطأ.
 */
export declare function postPayrollRunToFinance(tx: Tx, input: PayrollPostingInput): Promise<{
    id: string;
    code: string;
} | null>;
/** يزامن حالة المصروف المُرحَّل عند تأكيد صرف المسير. */
export declare function markPostedExpensePaid(tx: Tx, runId: string): Promise<void>;
export {};
