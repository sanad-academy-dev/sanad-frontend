import { Prisma as PrismaNs } from "@/generated/prisma/client";
import type { GlMapRow } from "@/server/accounting/gl/gl-map";
import type { PaymentEntryPayload } from "@/server/accounting/payment-entry/payment-entry.type";
/** structural — both [P7.3] RevalidatedReference and the stored rows satisfy it */
export type ComposableReference = {
    referenceDoctype: string;
    referenceId: string;
    /** allocation in the PARTY account's currency (the BR-5.2.2 unit) */
    allocated: PrismaNs.Decimal;
    /** [P8.2] the rate the reference was booked at (defaults to the party leg's rate) */
    exchangeRate?: PrismaNs.Decimal;
    /** [P8.2] signed realized gain/loss of this slice (+ = loss, base currency) */
    exchangeGainLoss?: PrismaNs.Decimal;
};
export type PaymentEntryGlContext = {
    /** display name of the party for the `against` text */
    partyName: string | null;
    /** [P12.6] FR-11.3 — the separate advance account for the unallocated remainder, or null */
    advanceAccountId?: string | null;
    /** [P8.2] FX behavior — omitted ⇒ the pre-P8 single-currency map, bit-identical */
    fx?: {
        baseCurrencyCode: string;
        /** `Payment` mode: the Σ gain/loss books as a row INSIDE this map */
        egolInMap: boolean;
        /** required iff egolInMap and Σ gain/loss ≠ 0 */
        egolAccountId: string | null;
    };
};
export declare function buildPaymentEntryGlMap(doc: PaymentEntryPayload, references: ComposableReference[], ctx: PaymentEntryGlContext): GlMapRow[];
