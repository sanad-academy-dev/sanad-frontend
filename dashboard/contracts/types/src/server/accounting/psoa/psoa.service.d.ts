import { Prisma } from "@/generated/prisma/client";
import type { PsoaFrequency, PsoaReportType } from "@/generated/prisma/enums";
export type StatementLine = {
    date: string;
    voucherNo: string | null;
    description: string;
    debit: string;
    credit: string;
    balance: string;
};
export type CustomerStatement = {
    partyType: string;
    partyId: string;
    partyName: string;
    email: string | null;
    fromDate: string;
    toDate: string;
    reportType: PsoaReportType;
    lines: StatementLine[];
    closingBalance: string;
    /** ageing view only — index-aligned with `bucketLabels` */
    bucketLabels: string[];
    bucketTotals: string[];
};
export declare function resolvePeriod(params: {
    frequency: PsoaFrequency;
    fromDate?: Date | null;
    toDate?: Date | null;
    asOf: Date;
}): Promise<{
    fromDate: Date;
    toDate: Date;
}>;
export declare function buildStatements(params: {
    clinicId: string;
    psoaId: string;
    asOf?: Date;
}): Promise<CustomerStatement[]>;
/** RTL, self-contained, no external assets — an email client renders none of them */
export declare function renderStatementHtml(statement: CustomerStatement, clinicName: string, bodyText: string | null): string;
export type SendStatementsResult = {
    sent: {
        partyId: string;
        partyName: string;
        email: string;
    }[];
    skipped: {
        partyId: string;
        partyName: string;
        reason: string;
    }[];
};
export declare function sendStatements(params: {
    clinicId: string;
    psoaId: string;
    asOf?: Date;
}): Promise<SendStatementsResult>;
export type UpsertPsoaInput = {
    title: string;
    reportType: PsoaReportType;
    frequency: PsoaFrequency;
    fromDate?: Date | null;
    toDate?: Date | null;
    subject?: string | null;
    bodyText?: string | null;
    ccEmails: string[];
    enabled: boolean;
    customers: {
        partyType: string;
        partyId: string;
        email?: string | null;
    }[];
};
export declare function listPsoaConfigs(clinicId: string): Prisma.PrismaPromise<({
    customers: {
        id: string;
        email: string | null;
        partyType: string;
        partyId: string;
        psoaId: string;
    }[];
} & {
    subject: string | null;
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    reportType: PsoaReportType;
    enabled: boolean;
    title: string;
    fromDate: Date | null;
    toDate: Date | null;
    frequency: PsoaFrequency;
    bodyText: string | null;
    ccEmails: string[];
    lastSentAt: Date | null;
})[]>;
export declare function getPsoaConfig(clinicId: string, id: string): Promise<{
    customers: {
        id: string;
        email: string | null;
        partyType: string;
        partyId: string;
        psoaId: string;
    }[];
} & {
    subject: string | null;
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    reportType: PsoaReportType;
    enabled: boolean;
    title: string;
    fromDate: Date | null;
    toDate: Date | null;
    frequency: PsoaFrequency;
    bodyText: string | null;
    ccEmails: string[];
    lastSentAt: Date | null;
}>;
export declare function createPsoaConfig(clinicId: string, input: UpsertPsoaInput, createdById?: string | null): Prisma.Prisma__ProcessStatementOfAccountsClient<{
    customers: {
        id: string;
        email: string | null;
        partyType: string;
        partyId: string;
        psoaId: string;
    }[];
} & {
    subject: string | null;
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    reportType: PsoaReportType;
    enabled: boolean;
    title: string;
    fromDate: Date | null;
    toDate: Date | null;
    frequency: PsoaFrequency;
    bodyText: string | null;
    ccEmails: string[];
    lastSentAt: Date | null;
}, never, import("@prisma/client/runtime/client").DefaultArgs, {
    omit: Prisma.GlobalOmitConfig | undefined;
}>;
export declare function updatePsoaConfig(clinicId: string, id: string, input: UpsertPsoaInput): Promise<{
    customers: {
        id: string;
        email: string | null;
        partyType: string;
        partyId: string;
        psoaId: string;
    }[];
} & {
    subject: string | null;
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    reportType: PsoaReportType;
    enabled: boolean;
    title: string;
    fromDate: Date | null;
    toDate: Date | null;
    frequency: PsoaFrequency;
    bodyText: string | null;
    ccEmails: string[];
    lastSentAt: Date | null;
}>;
export declare function deletePsoaConfig(clinicId: string, id: string): Promise<void>;
