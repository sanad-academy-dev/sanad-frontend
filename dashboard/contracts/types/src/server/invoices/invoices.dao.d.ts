import { Prisma } from "@/generated/prisma/client";
import { membershipAdjustmentWriteData } from "@/server/accounting/membership/membership-pricing.service";
import { invoiceTaxRowsWriteData } from "@/server/invoices/clinic-invoice-pricing.service";
import { type SectionScope } from "@/server/invoices/invoice-sections";
import { type InvoiceListItemResponse, type InvoiceResponse, type InvoiceStatsResponse, type PayInvoiceInput } from "@/server/invoices/invoices.type";
import { type LoyaltyRedemptionIntent } from "@/server/loyalty/loyalty-redemption/loyalty-redemption.service";
type Totals = {
    subtotal: Prisma.Decimal;
    vatRate: Prisma.Decimal;
    vatAmount: Prisma.Decimal;
    total: Prisma.Decimal;
    /** مجموع كل قسم قبل الخصم والضريبة — أساس توزيعهما على الأقسام */
    sections: Record<SectionScope, Prisma.Decimal>;
    /** سطور الضريبة كما ستُحفَظ — كل سطر إلى حساب رأسه */
    taxRows: ReturnType<typeof invoiceTaxRowsWriteData>;
    taxTemplateId: string;
    /** [MI-P2] العضوية المطبَّقة وصفوف تسويتها (BR-M6.7) — null/[] بلا عضوية */
    membershipId: string | null;
    membershipAdjustmentRows: ReturnType<typeof membershipAdjustmentWriteData>;
    /** [MI-P4] هوية المستند وأسطره الفعلية — مدخلا قسمة التأمين (§9.1) */
    ownerId: string | null;
    patientId: string | null;
    pricedLines: import("@/server/invoices/clinic-invoice-pricing.service").ClinicInvoicePricingResult["effectiveLines"];
    /** [LY-P2] نيّة استبدال النقاط على هذه الفاتورة — `null` ما لم تُطلب صراحةً */
    loyalty: LoyaltyRedemptionIntent | null;
};
export declare function computeTotals(appointmentId: string, clinicId: string, discount: Prisma.Decimal, 
/** [LY-P2] ما يطلبه الكاشير من نقاط؛ غيابه يجعل المسار محايدًا بتًّا (BR-L8.4) */
redeemPoints?: number | null): Promise<Totals>;
export declare const invoicesDao: {
    list(clinicId: string): Promise<InvoiceListItemResponse[]>;
    getStats(clinicId: string): Promise<InvoiceStatsResponse>;
    getMonthlyRevenue(clinicId: string): Promise<{
        monthDate: string;
        revenue: number;
    }[]>;
    payByInvoiceId(invoiceId: string, clinicId: string, userId: string, input: PayInvoiceInput): Promise<InvoiceResponse | "not-found" | "empty" | "already-paid" | "section-paid" | "item-paid">;
    /**
     * [LY-P2] §10.4 — معاينة أثر الاستبدال قبل الضغط على «دفع»، بنفس مقعد التسعير.
     *
     * موجودةٌ لأنّ البديل ممنوع: أن تحسب الشاشة الخصم بنفسها من `redemptionRate`. هذا
     * هو عينُ العيب الذي أصلحه [P12B.3] في نسبة الضريبة — رقمٌ على الشاشة وآخر في
     * الفاتورة. القراءة هنا لا تكتب شيئًا: `computeTotals` تُسعّر ولا تحفظ نيّة، والنيّة
     * لا تُكتب إلا داخل معاملة الدفع.
     *
     * وترمي `LoyaltyError` بالعربية متى كُسر شرط §6.2 — فيرى الكاشير السبب قبل الدفع
     * لا بعده.
     */
    previewLoyaltyRedemption(invoiceId: string, clinicId: string, redeemPoints: number): Promise<{
        points: number;
        discount: string;
        total: string;
        vatAmount: string;
    } | "not-found">;
    voidInvoice(invoiceId: string, clinicId: string): Promise<InvoiceResponse | "not-found" | "cannot-void">;
    /**
     * [P12B.1] ردّ فاتورة مدفوعة (contract KL-4).
     *
     * لماذا حالة جديدة لا `VOIDED`؟ لأنّ الإبطال يقول «هذا المستند لم يكن»، والفاتورة
     * المدفوعة كانت: قُبض مالها ورُحِّل أثرها إلى دفتر الأستاذ عبر محول فواتير الأكاديمية.
     * فالتصحيح عكسٌ يُضاف (AR-2) لا محوٌ — ولذلك:
     *   · الحالة تصير REFUNDED فتخرج الفاتورة من مجموعة المحول المؤهَّلة (status: PAID)،
     *     ويلتقطها `collectReversals` فيعكس قيدها ويعود تقرير الفرق إلى صفر؛
     *   · `paidAt` يبقى كما هو عمدًا. هو تاريخ القبض الفعلي، وهو ما رُحِّل به القيد
     *     الأصلي؛ محوه يجعل عكس القيد بلا تاريخ يقابله في التقرير.
     *
     * الردّ كامل فقط في v1: المحول يُرحّل بإجمالي المستند لا بسطوره، فردٌّ جزئي بلا خريطة
     * سطور هو رقم لا يقابله قيد. (قرار D14 — الجزئي مؤجَّل بقرار وليّ الأمر.)
     */
    refundInvoice(invoiceId: string, clinicId: string, userId: string, reason: string): Promise<InvoiceResponse | "not-found" | "not-paid" | "already-refunded">;
    findByAppointmentId(appointmentId: string, clinicId: string): Promise<InvoiceResponse | "not-found" | null>;
    createOrRefresh(appointmentId: string, clinicId: string): Promise<InvoiceResponse | "not-found" | "empty">;
    pay(appointmentId: string, clinicId: string, userId: string, input: PayInvoiceInput): Promise<InvoiceResponse | "not-found" | "empty" | "already-paid" | "section-paid">;
};
export {};
