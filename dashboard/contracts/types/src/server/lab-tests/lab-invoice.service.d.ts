import { Prisma } from "@/generated/prisma/client";
import { type LabInvoiceResponse } from "@/server/lab-tests/lab-tests.type";
type Tx = Prisma.TransactionClient;
/** مجموع بنود الطلب = لقطات أسعار تحاليله، مُسعَّرة عبر محرّك §8 */
export declare const computeLabTotals: (orderId: string, clinicId: string, discount: Prisma.Decimal, client?: Tx) => Promise<{
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
        benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
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
 * تُنشئ فاتورة الطلب أو تُحدّث مجاميعها. الفاتورة المسدَّدة لا تُمسّ مجاميعها
 * أبدًا حتى لا تتغيّر قيمة سُدِّدت فعلًا.
 */
export declare const createOrRefreshLabInvoice: (orderId: string, clinicId: string, client?: Tx) => Promise<LabInvoiceResponse>;
/**
 * سداد فاتورة طلب التحاليل. الدفع الجزئي يُبقيها PARTIAL — والبوابة تفتح
 * على الاكتمال وحده، فلا يمضي أي تحليل بنصف سداد.
 */
export declare const payLabInvoice: (orderId: string, clinicId: string, userId: string | null, input: {
    amountPaid: number;
    paymentMethod: Prisma.InvoiceUncheckedCreateInput["paymentMethod"];
    /**
     * سداد تحليل بعينه: يحسب الخادم حصّته من الإجمالي ويتجاهل `amountPaid`،
     * فلا يُسدَّد بند بمبلغ لا يخصّه. غيابه = دفعة حرّة على الفاتورة كلها.
     */
    itemId?: string;
    /** [MI-P4] §9.1 — تأكيد المشغّل للمطالبة بعد معاينة القسمة (BR-I9.1.2) */
    insurance?: {
        apply?: boolean;
        excludedLineRefs?: string[];
    };
}) => Promise<LabInvoiceResponse | "not-found" | "empty" | "already-paid" | "item-paid">;
export {};
