import type { Prisma } from "@/generated/prisma/client";
/**
 * [P12.8] Internal customers/suppliers (§7.2 row 3, BRD §4.2 `is_internal`).
 *
 * WHY THE ROW EXISTS. When two entities under one owner trade with each other, the "profit"
 * on that trade is not profit — nothing has left the group. Booking it as income and then
 * consolidating would overstate revenue on both statements. So an invoice to an INTERNAL
 * customer credits `unrealized_profit_loss_account` instead of income, and the margin only
 * becomes real when the goods are sold onward to a genuine third party.
 *
 * THE GAP THIS CLOSES. The posting row (`sales-invoice.gl.ts` row 3) and the columns have
 * existed since [P5.3], but nothing ever SET `isInternalCustomer` — the flag was dead, so the
 * row could never fire and an internal sale posted as ordinary revenue. This resolves it from
 * the party's own `is_internal` configuration at prepare time, which is the only place that
 * knows both the party and the company defaults.
 *
 * IT REFUSES RATHER THAN SILENTLY FALLING BACK. An internal party with no
 * `unrealized_profit_loss_account` configured would otherwise post to income exactly as
 * before — the failure would be invisible in the UI and visible only in a consolidated
 * statement months later. Better to stop at save time and name the setting.
 */
/**
 * عميلُ المعاملة بلا اتحاد.
 *
 * كان `Prisma.TransactionClient | typeof db`، والاتحاد هو ما يستهلك عمق استنتاج
 * TypeScript: كل استدعاء عبره يوزّع النوع على طرفَي الاتحاد ويضاعف العمل بحجم
 * أنواع Prisma كلّها. هذا الملفّ كان على حافّة السقف، فأسقطه نموّ المخطّط —
 * TS2589 هنا، ثم إفسادُ استنتاج `select` في ملفّات بعيدة، ثم نفادُ الذاكرة.
 *
 * `PrismaClient` متوافق بنيويًّا مع `TransactionClient` لهذه الاستدعاءات، فالتحويل
 * عند القيمة الافتراضية وحده يكفي ولا يغيّر سلوكًا: نفس العميل، نفس الاستعلامات.
 */
type Tx = Prisma.TransactionClient;
export type InternalPartyResolution = {
    isInternal: boolean;
    unrealizedProfitLossAccountId: string | null;
    /** the company this party represents, when internal — for the [P12.8] mirroring seam */
    representsCompany: string | null;
};
export declare function resolveInternalParty(params: {
    clinicId: string;
    partyType: string;
    partyId: string;
    tx?: Tx;
}): Promise<InternalPartyResolution>;
export {};
