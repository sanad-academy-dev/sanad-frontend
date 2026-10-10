import { type CreateModeOfPaymentInput, type UpdateModeOfPaymentInput } from "@/server/accounting/mode-of-payment/mode-of-payment.type";
export declare function createModeOfPayment(input: CreateModeOfPaymentInput): Promise<{
    type: import("@/server/accounting/mode-of-payment/mode-of-payment.type").ModeOfPaymentType;
    id: string;
    clinicId: string;
    createdAt: Date;
    updatedAt: Date;
    enabled: boolean;
    modeOfPaymentName: string;
    defaultAccountId: string | null;
    defaultAccount: {
        id: string;
        accountName: string;
        accountNumber: string | null;
    } | null;
}>;
export declare function updateModeOfPayment(clinicId: string, id: string, data: UpdateModeOfPaymentInput): Promise<{
    type: import("@/server/accounting/mode-of-payment/mode-of-payment.type").ModeOfPaymentType;
    id: string;
    clinicId: string;
    createdAt: Date;
    updatedAt: Date;
    enabled: boolean;
    modeOfPaymentName: string;
    defaultAccountId: string | null;
    defaultAccount: {
        id: string;
        accountName: string;
        accountNumber: string | null;
    } | null;
}>;
export declare function deleteModeOfPayment(clinicId: string, id: string): Promise<void>;
