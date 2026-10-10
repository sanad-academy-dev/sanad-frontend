import { Prisma } from "@/generated/prisma/client";
type Tx = Prisma.TransactionClient;
export declare const groomingInvoiceSelect: {
    readonly id: true;
    readonly code: true;
    readonly subtotal: true;
    readonly vatRate: true;
    readonly vatAmount: true;
    readonly discount: true;
    readonly total: true;
    readonly amountPaid: true;
    readonly currencyCode: true;
    readonly status: true;
    readonly paymentMethod: true;
    readonly paidAt: true;
};
export type GroomingInvoiceResponse = Prisma.InvoiceGetPayload<{
    select: typeof groomingInvoiceSelect;
}>;
/**
 * تُنشئ فاتورة الجلسة أو تُحدّث مجاميعها من بنودها الحالية.
 * الفاتورة المسدَّدة لا تُمسّ مجاميعها أبدًا (نمط فاتورة العمليات والأشعة).
 */
export declare const createOrRefreshGroomingInvoice: (sessionId: string, clinicId: string, client?: Tx) => Promise<GroomingInvoiceResponse>;
/** هل سُدِّدت الدفعة المطلوبة؟ أساس البوابة G9 حين تفعّلها إعدادات الفرع */
export declare const groomingDepositSatisfied: (sessionId: string, requiredPercent: Prisma.Decimal | null, client?: Tx) => Promise<boolean>;
/**
 * سداد فاتورة الجلسة — دفعة واحدة على الفاتورة كلها (كليّة أو جزئية).
 *
 * لا سداد على مستوى البند هنا خلافًا للأشعّة: بنود الجلسة تُسعَّر كسلّة واحدة
 * (دورة + رسوم + مستهلكات)، وتقسيم الدفعة عليها يُنتج حصصًا لا يفهمها وليّ الأمر.
 *
 * الفاتورة تُصدَر أو تُحدَّث قبل السداد مباشرةً، فلا يُسدَّد رقم قديم بعد تغيّر
 * البنود — وهذا هو السيناريو الشائع فعلًا: رسوم تُضاف أثناء العمل.
 */
export declare const payGroomingInvoice: (sessionId: string, clinicId: string, userId: string | null, input: {
    amountPaid: number;
    paymentMethod: Prisma.InvoiceUncheckedCreateInput["paymentMethod"];
}) => Promise<GroomingInvoiceResponse | "not-found" | "already-paid" | "empty">;
export {};
