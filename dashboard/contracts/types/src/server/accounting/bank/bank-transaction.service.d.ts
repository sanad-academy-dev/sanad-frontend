import { type BankTransactionResponse, BankTransactionStatus, type CreateBankTransactionFormInput, type ImportStatementFormInput, type ImportStatementResult } from "@/server/accounting/bank/bank-transaction.type";
import { type VoucherActor } from "@/server/accounting/voucher/voucher.service";
export declare function listBankTransactions(params: {
    clinicId: string;
    bankAccountId?: string;
    status?: BankTransactionStatus;
    fromDate?: Date;
    toDate?: Date;
}): Promise<BankTransactionResponse[]>;
export declare function getBankTransaction(clinicId: string, id: string): Promise<BankTransactionResponse>;
export declare function createBankTransaction(clinicId: string, input: CreateBankTransactionFormInput, createdById: string | null): Promise<BankTransactionResponse>;
export declare function deleteBankTransaction(clinicId: string, id: string): Promise<void>;
export declare function submitBankTransaction(clinicId: string, id: string, actor: VoucherActor): Promise<BankTransactionResponse>;
export declare function cancelBankTransaction(clinicId: string, id: string, actor: VoucherActor): Promise<BankTransactionResponse>;
export declare function importBankStatement(clinicId: string, input: ImportStatementFormInput, actor: VoucherActor): Promise<ImportStatementResult>;
