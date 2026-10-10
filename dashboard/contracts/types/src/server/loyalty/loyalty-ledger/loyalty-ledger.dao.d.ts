import { type LoyaltyLedgerEntryResponse } from "@/server/loyalty/loyalty-ledger/loyalty-ledger.type";
/**
 * [LY-P1] قراءات دفتر النقاط — استعلامات فقط، بلا منطق عمل (AGENTS.md).
 *
 * ولا كتابةَ هنا البتّة: كل صفٍّ يُكتب داخل معاملة الدفع أو الردّ في
 * `loyalty-ledger.service.ts`. دالّة كتابةٍ مستقلّة كانت ستفتح طريقًا ثانيًا يمنح نقاطًا
 * خارج المعاملة التي حصّلت المال.
 */
export declare const loyaltyLedgerDao: {
    /** §10.3 — كشف حساب وليّ الأمر، الأحدث أولًا. */
    statement(clinicId: string, ownerId: string, limit: number): Promise<LoyaltyLedgerEntryResponse[]>;
};
