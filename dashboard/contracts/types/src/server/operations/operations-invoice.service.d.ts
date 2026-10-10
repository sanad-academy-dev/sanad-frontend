import { Prisma } from "@/generated/prisma/client";
type Tx = Prisma.TransactionClient;
export declare const operationInvoiceSelect: {
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
export type OperationInvoiceResponse = Prisma.InvoiceGetPayload<{
    select: typeof operationInvoiceSelect;
}>;
/**
 * مجموع بنود الحالة = لقطات أسعار الإجراءات + البنود الإضافية وحدها.
 * عدة القالب (KIT) والمحروقات (BURNED) ضمن سعر الإجراء فلا تدخل الفاتورة.
 */
export declare const computeOperationTotals: (caseId: string, clinicId: string, discount: Prisma.Decimal, client?: Tx) => Promise<{
    subtotal: import("@prisma/client-runtime-utils").Decimal;
    vatRate: import("@prisma/client-runtime-utils").Decimal;
    vatAmount: import("@prisma/client-runtime-utils").Decimal;
    total: import("@prisma/client-runtime-utils").Decimal;
    taxRows: {
        idx: number;
        chargeType: import("../accounting/tax/tax-calculator").CalcChargeType;
        accountHeadId: string;
        rate: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        rowId: number | null;
        description: string;
        includedInPrintRate: boolean;
    }[];
    taxTemplateId: string;
    membershipId: string | null;
    membershipAdjustmentRows: {
        clinicId: string;
        idx: number;
        lineRef: string;
        benefitType: import("@/generated/prisma/client").MembershipBenefitType;
        membershipId: string;
        benefitId: string;
        serviceId: string | null;
        amount: string;
        unitsConsumed: number;
        entitlementId: string | null;
        periodStart: Date | null;
        periodEnd: Date | null;
    }[];
    ownerId: string | null;
    patientId: string | null;
    pricedLines: {
        lineRef: string;
        serviceId: string | null;
        inventoryItemId: string | null;
        effectiveAmount: string;
    }[];
}>;
/**
 * تُنشئ فاتورة الحالة أو تُحدّث مجاميعها من البنود الحالية.
 * الفاتورة المسدَّدة لا تُمسّ مجاميعها أبدًا (نمط فاتورة الأشعة).
 */
export declare const createOrRefreshOperationInvoice: (caseId: string, clinicId: string, client?: Tx) => Promise<OperationInvoiceResponse>;
/**
 * سداد فاتورة حالة العملية — دفعة حرّة على الفاتورة كلها؛ الجزئي يبقيها
 * PARTIAL وبوابة السداد G10 تفتح على الاكتمال وحده.
 */
export declare const payOperationInvoice: (caseId: string, clinicId: string, userId: string | null, input: {
    amountPaid: number;
    paymentMethod: Prisma.InvoiceUncheckedCreateInput["paymentMethod"];
    /** [MI-P4] §9.1 — تأكيد المشغّل للمطالبة بعد معاينة القسمة (BR-I9.1.2) */
    insurance?: {
        apply?: boolean;
        excludedLineRefs?: string[];
    };
}) => Promise<OperationInvoiceResponse | "not-found" | "empty" | "already-paid">;
export {};
