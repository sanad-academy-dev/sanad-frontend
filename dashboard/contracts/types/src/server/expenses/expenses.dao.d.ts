import { type CancelExpenseInput, type CreateExpenseInput, type ExpenseDecision, type ExpenseListItemResponse, type ExpenseResponse, type ExpenseStatsResponse, type UpdateExpenseInput } from "@/server/expenses/expenses.type";
type DaoResult<T> = T | "not-found";
export declare class PostedExpenseImmutableError extends Error {
    constructor();
}
/**
 * [P12A-fix5] A hard DELETE is refused once the C3 expense adapter has posted the expense
 * to the ledger. The owner's UI pass deleted a posted 453 expense: the row vanished, its
 * `adapter_posting` stayed active, and the zero-diff report sat at −453 with no way back.
 * The ledger side now reverses a vanished source too, but deletion still destroys the
 * audit trail the reversal is FOR — so the operational answer is «ألغِ المصروف», which
 * keeps the document, records a reason, and is the adapter's proper AR-2 trigger.
 */
export declare class PostedExpenseUndeletableError extends Error {
    constructor();
}
export declare const expensesDao: {
    list(clinicId: string, opts?: {
        search?: string;
    }): Promise<ExpenseListItemResponse[]>;
    getById(id: string, clinicId: string): Promise<ExpenseResponse | null>;
    listPendingApprovals(clinicId: string, userId: string): Promise<ExpenseResponse[]>;
    getStats(clinicId: string): Promise<ExpenseStatsResponse>;
    create(clinicId: string, currentUserId: string, input: CreateExpenseInput): Promise<ExpenseResponse>;
    update(id: string, clinicId: string, input: UpdateExpenseInput): Promise<DaoResult<ExpenseResponse>>;
    cancel(id: string, clinicId: string, actorId: string, input: CancelExpenseInput): Promise<DaoResult<ExpenseResponse>>;
    sendForReview(id: string, clinicId: string, actorId: string, payload?: {
        recipientIds?: string[];
        subject?: string;
        body?: string;
    }): Promise<DaoResult<ExpenseResponse>>;
    emailRecipients(clinicId: string, recipientIds: string[], subject: string, body: string, expenseName: string): Promise<void>;
    applyDecision(id: string, clinicId: string, stepId: string, actorId: string, payload: {
        decision: ExpenseDecision;
        reason?: string;
        signed?: boolean;
        signatureName?: string;
    }): Promise<DaoResult<ExpenseResponse>>;
    addAttachment(id: string, clinicId: string, attachment: NonNullable<CreateExpenseInput["attachments"]>[number]): Promise<DaoResult<ExpenseResponse>>;
    remove(id: string, clinicId: string): Promise<ExpenseResponse | "not-found">;
};
export {};
