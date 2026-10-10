import type { Prisma } from "@/generated/prisma/client";
import { fillSize, maxDispensable, refillsConsumed } from "@/server/pharmacy/dispense.rules";
/**
 * [PH3.2] الصرف — BRD_Pharmacy_Module.md §7.
 *
 * **معاملة واحدة دائمًا** (NFR-1): يُخصم المخزون، ويُكتب سطر الدفتر، ويُنشأ صفّ
 * الواقعة، وتُحدَّث حالة الوصفة — أو لا شيء من ذلك. صرفٌ ينجح نصفه يترك دواءً خرج
 * من الرفّ بلا أثر، وهو أسوأ من فشلٍ صريح.
 *
 * **لا يُعيد هذا الملفّ بناء منطق المخزون.** `issueFromBatch` و`issueStock` موجودتان
 * منذ وحدة التطعيمات وتحلّان المسألة نفسها: دفعة يختارها المستخدم لا النظام، ورفض
 * الدفعة المنتهية، ولقطة رقم الدفعة. إعادة كتابتها هنا كانت ستُنتج نسختين تنحرفان.
 */
export type DispenseInput = {
    clinicId: string;
    prescriptionItemId: string;
    warehouseId: string;
    quantity: number;
    batchId?: string | null;
    notesAr?: string | null;
    dispensedById: string | null;
};
/** ما صُرف حتى الآن على البند — يُجمع من الصفوف لا من عمود يُحدَّث (BR-P7.3.1) */
export declare function dispensedSoFar(tx: Prisma.TransactionClient, prescriptionItemId: string): Promise<number>;
export declare function dispense(input: DispenseInput): Promise<{
    id: string;
    dispensedAt: Date;
    quantity: number;
    batchNoSnapshot: string | null;
    expiryDateSnapshot: Date | null;
    isRefill: boolean;
}>;
export { fillSize, maxDispensable, refillsConsumed };
