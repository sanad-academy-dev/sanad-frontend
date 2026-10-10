import type { Prisma } from "@/generated/prisma/client";
import { SubscriptionStatus } from "@/generated/prisma/enums";
import type { AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
export type SubscriptionRunResult = {
    asOf: string;
    generated: {
        subscriptionId: string;
        periodStartDate: string;
        periodEndDate: string;
        salesInvoiceId: string;
        documentNo: string | null;
        submitted: boolean;
    }[];
    errors: {
        subscriptionId: string;
        message: string;
    }[];
    statusChanges: {
        subscriptionId: string;
        status: SubscriptionStatus;
    }[];
};
export declare function runSubscriptionBilling(params: {
    clinicId: string;
    asOf: Date;
    actor: AccountingActor;
    /** limit the run to one subscription — the "generate now" button */
    subscriptionId?: string;
}): Promise<SubscriptionRunResult>;
export type UpsertSubscriptionInput = {
    clinicId: string;
    partyType: string;
    partyId: string;
    interval: Prisma.SubscriptionCreateInput["interval"];
    intervalCount: number;
    startDate: Date;
    endDate?: Date | null;
    trialEndDate?: Date | null;
    generateInvoiceAtPeriodStart: boolean;
    daysUntilDue: number;
    submitGeneratedInvoice: boolean;
    taxTemplateId?: string | null;
    plans: {
        itemName: string;
        qty: string;
        rate: string;
        incomeAccountId: string;
        costCenterId: string;
        /** [MI-P1] يظهر على أول فاتورة فقط (رسم التسجيل) */
        firstPeriodOnly?: boolean;
        /** [MI-P1] تأجيل الإيراد على بند الفاتورة المولَّدة — يلزمه حساب التأجيل */
        enableDeferredRevenue?: boolean;
        deferredAccountId?: string | null;
    }[];
    createdById?: string | null;
};
export declare function createSubscription(input: UpsertSubscriptionInput): Prisma.Prisma__SubscriptionClient<{
    plans: {
        id: string;
        rate: import("@prisma/client-runtime-utils").Decimal;
        costCenterId: string;
        incomeAccountId: string;
        itemName: string;
        qty: import("@prisma/client-runtime-utils").Decimal;
        enableDeferredRevenue: boolean;
        deferredAccountId: string | null;
        subscriptionId: string;
        firstPeriodOnly: boolean;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: SubscriptionStatus;
    interval: import("@/generated/prisma/enums").SubscriptionInterval;
    partyType: string;
    partyId: string;
    startDate: Date;
    endDate: Date | null;
    taxTemplateId: string | null;
    intervalCount: number;
    trialEndDate: Date | null;
    lastInvoicedPeriodEnd: Date | null;
    generateInvoiceAtPeriodStart: boolean;
    daysUntilDue: number;
    submitGeneratedInvoice: boolean;
}, never, import("@prisma/client/runtime/client").DefaultArgs, {
    omit: Prisma.GlobalOmitConfig | undefined;
}>;
export declare function updateSubscription(clinicId: string, id: string, input: Omit<UpsertSubscriptionInput, "clinicId" | "createdById">): Promise<{
    plans: {
        id: string;
        rate: import("@prisma/client-runtime-utils").Decimal;
        costCenterId: string;
        incomeAccountId: string;
        itemName: string;
        qty: import("@prisma/client-runtime-utils").Decimal;
        enableDeferredRevenue: boolean;
        deferredAccountId: string | null;
        subscriptionId: string;
        firstPeriodOnly: boolean;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: SubscriptionStatus;
    interval: import("@/generated/prisma/enums").SubscriptionInterval;
    partyType: string;
    partyId: string;
    startDate: Date;
    endDate: Date | null;
    taxTemplateId: string | null;
    intervalCount: number;
    trialEndDate: Date | null;
    lastInvoicedPeriodEnd: Date | null;
    generateInvoiceAtPeriodStart: boolean;
    daysUntilDue: number;
    submitGeneratedInvoice: boolean;
}>;
export declare function listSubscriptions(clinicId: string, status?: SubscriptionStatus): Prisma.PrismaPromise<({
    _count: {
        invoices: number;
    };
    plans: {
        id: string;
        rate: import("@prisma/client-runtime-utils").Decimal;
        costCenterId: string;
        incomeAccountId: string;
        itemName: string;
        qty: import("@prisma/client-runtime-utils").Decimal;
        enableDeferredRevenue: boolean;
        deferredAccountId: string | null;
        subscriptionId: string;
        firstPeriodOnly: boolean;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: SubscriptionStatus;
    interval: import("@/generated/prisma/enums").SubscriptionInterval;
    partyType: string;
    partyId: string;
    startDate: Date;
    endDate: Date | null;
    taxTemplateId: string | null;
    intervalCount: number;
    trialEndDate: Date | null;
    lastInvoicedPeriodEnd: Date | null;
    generateInvoiceAtPeriodStart: boolean;
    daysUntilDue: number;
    submitGeneratedInvoice: boolean;
})[]>;
export declare function getSubscription(clinicId: string, id: string): Promise<{
    invoices: {
        id: string;
        createdAt: Date;
        periodStartDate: Date;
        periodEndDate: Date;
        salesInvoiceId: string;
        subscriptionId: string;
    }[];
    plans: {
        id: string;
        rate: import("@prisma/client-runtime-utils").Decimal;
        costCenterId: string;
        incomeAccountId: string;
        itemName: string;
        qty: import("@prisma/client-runtime-utils").Decimal;
        enableDeferredRevenue: boolean;
        deferredAccountId: string | null;
        subscriptionId: string;
        firstPeriodOnly: boolean;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: SubscriptionStatus;
    interval: import("@/generated/prisma/enums").SubscriptionInterval;
    partyType: string;
    partyId: string;
    startDate: Date;
    endDate: Date | null;
    taxTemplateId: string | null;
    intervalCount: number;
    trialEndDate: Date | null;
    lastInvoicedPeriodEnd: Date | null;
    generateInvoiceAtPeriodStart: boolean;
    daysUntilDue: number;
    submitGeneratedInvoice: boolean;
}>;
export declare function cancelSubscription(clinicId: string, id: string): Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: SubscriptionStatus;
    interval: import("@/generated/prisma/enums").SubscriptionInterval;
    partyType: string;
    partyId: string;
    startDate: Date;
    endDate: Date | null;
    taxTemplateId: string | null;
    intervalCount: number;
    trialEndDate: Date | null;
    lastInvoicedPeriodEnd: Date | null;
    generateInvoiceAtPeriodStart: boolean;
    daysUntilDue: number;
    submitGeneratedInvoice: boolean;
}>;
