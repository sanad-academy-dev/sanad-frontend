import { type BankAccountResponse, type BankResponse, type CreateBankAccountInput, type CreateBankInput } from "@/server/accounting/bank/bank.type";
export declare function listBanks(clinicId: string): Promise<BankResponse[]>;
export declare function createBank(input: CreateBankInput): Promise<BankResponse>;
export declare function updateBank(clinicId: string, id: string, patch: Partial<Omit<CreateBankInput, "clinicId" | "createdById">>): Promise<BankResponse>;
export declare function deleteBank(clinicId: string, id: string): Promise<void>;
export declare function listBankAccounts(clinicId: string): Promise<BankAccountResponse[]>;
export declare function createBankAccount(input: CreateBankAccountInput): Promise<BankAccountResponse>;
export declare function updateBankAccount(clinicId: string, id: string, patch: Partial<Omit<CreateBankAccountInput, "clinicId" | "createdById">>): Promise<BankAccountResponse>;
export declare function deleteBankAccount(clinicId: string, id: string): Promise<void>;
