import type { Prisma } from "@/generated/prisma/client";
import { type PartyAccountingConfigResponse, type PartyAccountResponse, type PartyCreditLimitResponse, type PartyListRow, type PartyTypeKey } from "@/server/accounting/party/party.type";
/**
 * [P3.1] Party DAO — reads the three operational masters (identity only) and the
 * accounting child tables, composes {@link PartyListRow}s. Prisma queries only.
 */
type MasterRow = {
    partyId: string;
    name: string;
    code: string | null;
};
export declare const partyDao: {
    /** All parties of all types with their accounting children (the screen's one query). */
    list(clinicId: string): Promise<PartyListRow[]>;
    /** The operational master row, or null — party existence check (tenant-scoped). */
    findMaster(clinicId: string, partyType: PartyTypeKey, partyId: string, tx?: Prisma.TransactionClient): Promise<MasterRow | null>;
    getAccount(clinicId: string, partyType: PartyTypeKey, partyId: string, tx?: Prisma.TransactionClient): Promise<PartyAccountResponse | null>;
    getConfig(clinicId: string, partyType: PartyTypeKey, partyId: string, tx?: Prisma.TransactionClient): Promise<PartyAccountingConfigResponse | null>;
    getCreditLimit(clinicId: string, partyType: PartyTypeKey, partyId: string, tx?: Prisma.TransactionClient): Promise<PartyCreditLimitResponse | null>;
    upsertAccount(clinicId: string, partyType: PartyTypeKey, partyId: string, accountId: string | null): Promise<void>;
    upsertCreditLimit(clinicId: string, partyType: PartyTypeKey, partyId: string, data: {
        creditLimit?: string | null;
        bypassCreditLimitCheck?: boolean;
    }): Promise<void>;
    upsertConfig(clinicId: string, partyType: PartyTypeKey, partyId: string, data: {
        defaultCurrencyCode?: string | null;
        isFrozen?: boolean;
        disabled?: boolean;
    }): Promise<void>;
};
export {};
