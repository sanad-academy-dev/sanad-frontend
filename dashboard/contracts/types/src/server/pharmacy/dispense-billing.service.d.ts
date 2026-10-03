import type { Prisma } from "@/generated/prisma/client";
/**
 * [PH5.1] فوترة المصروف — BRD_Pharmacy_Module.md §10.
 *
 * **لا حساب ضريبة هنا ولا شكل فاتورة جديد** (§0.5). الصنف المصروف يُقيَّد صفًّا في
 * `appointment_product`، وهو المسار الذي تسلكه أصناف الزيارة أصلًا: التسعير يمرّ
 * على `priceClinicInvoice` ومنه على محرّك §8 مع تجاوز `itemTaxTemplateId` لكل صنف
 * (P12C.1). أي حساب ضريبة يُكتب هنا كان سيصير النسخة الخامسة من `DEFAULT_VAT_RATE`
 * التي أُنفقت مرحلتان كاملتان في حذفها.
 *
 * ── الخطر الحقيقي في هذا الملفّ: الخصم المزدوج ────────────────────────────────
 * مسار الفاتورة يخصم المخزون عند سداد قسم الأصناف، ويحرسه `issuedAt: null`. والصيدلية
 * تكون قد خصمت الكمّية بالفعل لحظة الصرف. فيُكتب الصفّ بـ**`issuedAt` مضبوطًا مسبقًا**:
 * يُفوتَر ولا يُخصم ثانيةً. تركُه فارغًا كان سيُنقص الرصيد مرّتين عن كل دواء يُصرف
 * ويُدفع — عجزٌ صامت لا يظهر إلا في الجرد.
 */
export declare function recordDispenseOnInvoice(tx: Prisma.TransactionClient, input: {
    appointmentId: string;
    inventoryItemId: string;
    quantity: number;
    nameSnapshot: string;
}): Promise<{
    id: string;
    quantity: number;
    priceSnapshot: import("@prisma/client-runtime-utils").Decimal;
    nameSnapshot: string;
} | null>;
