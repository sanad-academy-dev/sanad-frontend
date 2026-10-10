import type { Prisma } from "@/generated/prisma/client";
import type { StockVoucherType } from "@/generated/prisma/enums";
export interface BatchReceiptArgs {
    clinicId: string;
    itemId: string;
    warehouseId: string;
    batchNo: string;
    qty: number;
    expiryDate?: Date | null;
    productionDate?: Date | null;
    voucherType: StockVoucherType;
    voucherId?: string | null;
    note?: string | null;
    createdById?: string | null;
    inRate?: number | null;
}
/**
 * استلام كمية إلى دفعة (يُنشئ الدفعة أو يضيف إليها)، ثم يسجّل حركة إدخال
 * مرتبطة بالدفعة عبر دفتر المخزون. يُعيد رصيد المستودع بعد الحركة.
 */
export declare function postBatchReceipt(tx: Prisma.TransactionClient, args: BatchReceiptArgs): Promise<number>;
export interface IssueArgs {
    clinicId: string;
    itemId: string;
    warehouseId: string;
    qty: number;
    voucherType: StockVoucherType;
    voucherId?: string | null;
    note?: string | null;
    createdById?: string | null;
}
/**
 * صرف كمية باتّباع FEFO (الأقرب انتهاءً أولًا) عبر دُفعات الصنف في المستودع.
 * يُنشئ سطر دفتر لكل دفعة مستهلَكة. إن لم تكفِ الدُفعات (مخزون قديم بلا دفعة)
 * يُسجَّل الباقي كحركة بلا دفعة حتى يبقى الإجمالي متّسقًا.
 */
export declare function consumeFEFO(tx: Prisma.TransactionClient, args: IssueArgs): Promise<void>;
/**
 * صرف ذكي حسب نوع الصنف: يتّبع FEFO للأصناف المتتبّعة بالدُفعات،
 * وإلا حركة إخراج عادية مفردة.
 */
export declare function issueStock(tx: Prisma.TransactionClient, args: IssueArgs): Promise<void>;
export interface IssueFromBatchArgs extends IssueArgs {
    /** الدفعة التي يجب الصرف منها بعينها */
    batchId: string;
    /**
     * السماح بالصرف من دفعة منتهية الصلاحية. القيمة الافتراضية `false` والرفض هو
     * السلوك الصحيح؛ التجاوز قرار سريري صريح يُوثَّق سببه على المستند المصدر.
     */
    allowExpired?: boolean;
}
export interface IssuedBatchSnapshot {
    batchId: string;
    batchNo: string;
    expiryDate: Date | null;
    /** الكمية المتبقّية في الدفعة بعد الصرف */
    remainingQty: number;
}
/**
 * صرف كمية من **دفعة محدَّدة بعينها**، ويُعيد لقطة عنها.
 *
 * لماذا لا `issueStock`/`consumeFEFO`؟ لأنهما يـ«ختاران» الدفعة نيابةً عن المستخدم.
 * التطعيم يوجب تسجيل رقم الدفعة (lot) التي حملتها العبوة في يد المدرّب فعلًا: الدفعة
 * هنا مُدخَل لا نتيجة، وأي اختيار آلي يجعل التتبّع كذبةً موثّقة. الترتيب المعروض في
 * الواجهة يبقى FEFO، لكن القرار للمستخدم.
 *
 * يجب استدعاؤها داخل معاملة.
 */
export declare function issueFromBatch(tx: Prisma.TransactionClient, args: IssueFromBatchArgs): Promise<IssuedBatchSnapshot>;
/**
 * إعادة كمية إلى دفعة بعينها — حركة معاكسة لا حذف. تُستعمل عند إلغاء مستند صرف
 * (مثل إبطال سجل تطعيم): الدفتر إلحاقي، فالتراجع يُسجَّل ولا يُمحى.
 */
export declare function returnToBatch(tx: Prisma.TransactionClient, args: Omit<IssueFromBatchArgs, "allowExpired">): Promise<void>;
