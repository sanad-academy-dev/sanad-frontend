import type { Prisma } from "@/generated/prisma/client";
import type { AdapterKey, AdapterReversal } from "@/server/accounting/adapters/adapter.type";
/**
 * [P12A-fix5] The shared AR-2 reversal collector.
 *
 * WHY THIS EXISTS. Both adapters used to answer "which postings must be reversed?" by
 * loading the source documents that carry a reversing status (`CANCELED` / `VOIDED`) and
 * reversing only those. The owner's UI pass broke that assumption in the most ordinary way
 * possible: they HARD-DELETED a posted expense. A deleted source carries no status at all,
 * so it never appeared in that query — the posting stayed active, the report read a
 * permanent −453 residual with the orphan correctly named, and re-running the adapter
 * answered `0 ترحيل · 0 عكس · 0 خطأ` forever. Nothing in the product could bring it back
 * to zero.
 *
 * So "reversal-eligible" is now TWO cases, not one:
 *   · `source_reversed` — the source still exists and has entered its reversing state;
 *   · `source_missing`  — the source is GONE. In the real world rows do get deleted, and a
 *     ledger that can only be corrected when the operational module cooperates is not a
 *     ledger. The GL reversal never re-reads the source (it keys on voucherType+voucherId),
 *     so a vanished source reverses exactly as cleanly as a cancelled one.
 *
 * Living here rather than in each adapter means the third adapter (POS, [P12B.4]) inherits
 * both cases by construction instead of re-deriving the bug.
 */
type Tx = Prisma.TransactionClient;
/**
 * Load the postings this adapter still holds open and decide which must reverse.
 *
 * @param loadLiveStates given the posted source ids, return a map of the ones that STILL
 * EXIST to whether they are in a reversing state. Ids absent from the returned map are
 * treated as vanished — that is the whole point, so a loader must never silently drop ids
 * it merely failed to classify.
 */
export declare function collectReversalsByLiveState(tx: Tx, clinicId: string, adapterKey: AdapterKey, loadLiveStates: (sourceIds: string[]) => Promise<Map<string, boolean>>): Promise<AdapterReversal[]>;
export {};
