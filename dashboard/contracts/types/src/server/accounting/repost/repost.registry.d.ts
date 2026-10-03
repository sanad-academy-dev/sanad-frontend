import type { VoucherActor, VoucherConfig } from "@/server/accounting/voucher/voucher.service";
/**
 * [P12.9] FR-6.9 — which voucher types can be reposted, and how to rebuild each one.
 *
 * THE KEY INSIGHT THAT MAKES THIS SMALL. Every voucher already carries its ledger
 * construction in the lifecycle's `onSubmit` hook, and its reversal in `onCancel`. A repost
 * is therefore not new posting logic at all — it is *reverse, then run onSubmit again*. That
 * matters beyond brevity: a repost that rebuilt the GL through a second, repost-specific code
 * path would drift from the submit path the moment either changed, and the drift would show
 * up as a ledger that disagrees with itself only for vouchers someone happened to repost.
 *
 * Registered here rather than discovered, because the set of reposting-safe doctypes is a
 * DECISION (BRD `repost_allowed_types`), not a capability — a voucher can be technically
 * repostable and still be something a clinic should never repost.
 */
type AnyConfigFactory = (actor: VoucherActor) => VoucherConfig<any>;
export declare const REPOSTABLE_VOUCHER_TYPES: readonly ["sales_invoice", "purchase_invoice", "journal_entry", "payment_entry"];
export type RepostableVoucherType = (typeof REPOSTABLE_VOUCHER_TYPES)[number];
export declare const REPOST_CONFIGS: Record<RepostableVoucherType, AnyConfigFactory>;
export declare function isRepostable(value: string): value is RepostableVoucherType;
export {};
