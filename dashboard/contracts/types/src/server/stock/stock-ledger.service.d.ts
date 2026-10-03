import type { Prisma } from "@/generated/prisma/client";
import type { StockVoucherType } from "@/generated/prisma/enums";
export interface StockMovementArgs {
    clinicId: string;
    itemId: string;
    warehouseId: string;
    /** موجب = إدخال، سالب = إخراج */
    qtyChange: number;
    voucherType: StockVoucherType;
    voucherId?: string | null;
    note?: string | null;
    createdById?: string | null;
    /** الدفعة المتأثّرة — تُسجَّل على سطر الدفتر فقط؛ كمية الدفعة تُدار في دورة الدُفعات */
    batchId?: string | null;
    /** تكلفة الوحدة الواردة (للاستلام) — تُحدّث متوسط التكلفة المتحرّك للصنف */
    inRate?: number | null;
}
/** يعيد معرّف المستودع الافتراضي للأكاديمية (المستقبِل لحركات نقطة البيع والرصيد الافتتاحي). */
export declare function getDefaultWarehouseId(tx: Prisma.TransactionClient, clinicId: string): Promise<string>;
/** يجد المستودع الافتراضي أو يُنشئه إن لم يوجد (للأكاديميات الجديدة). */
export declare function ensureDefaultWarehouseId(tx: Prisma.TransactionClient, clinicId: string): Promise<string>;
/**
 * يسجّل حركة مخزون لمستودع محدّد: ينشئ سطرًا في الدفتر (append-only)، يحدّث رصيد
 * المستودع (StockBin) ذرّيًا، ويحدّث الكمية الإجمالية المخزّنة على المنتج (cache).
 * يجب استدعاؤه داخل معاملة (tx). مصدر الحقيقة هو الدفتر. يُعيد رصيد المستودع بعد الحركة.
 */
export declare function postStockMovement(tx: Prisma.TransactionClient, args: StockMovementArgs): Promise<number>;
/** غلاف يفتح معاملة جديدة لحركة مفردة خارج معاملة قائمة. */
export declare function postStockMovementTx(args: StockMovementArgs): Promise<number>;
export interface StockTransferArgs {
    clinicId: string;
    itemId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    qty: number;
    voucherId?: string | null;
    note?: string | null;
    createdById?: string | null;
}
/**
 * تحويل كمية بين مستودعين: حركتان (إخراج من المصدر، إدخال للهدف) داخل معاملة واحدة.
 * يُعيد رصيدي المستودعين بعد التحويل.
 */
export declare function postStockTransfer(tx: Prisma.TransactionClient, args: StockTransferArgs): Promise<{
    fromBalance: number;
    toBalance: number;
}>;
