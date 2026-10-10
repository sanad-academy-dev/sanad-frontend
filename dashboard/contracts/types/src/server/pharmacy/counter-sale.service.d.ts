/**
 * [PH16] بيع الكاونتر في الصيدلية — يُفوتَر أولًا، ويُصرف بعد السداد.
 *
 * ── لماذا خطوتان ─────────────────────────────────────────────────────────────
 * نقطة البيع تُسلّم البضاعة لحظة الدفع، فالدفع هناك هو الصرف. الصيدلية غير ذلك:
 * الفاتورة تُنشأ، تُسدَّد على الكاشير أو هنا، **ثم** يناول الصيدلي الدواء. فالحدث
 * الذي يُخرج الصنف من الرفّ هو مناولته لا تحصيل ثمنه — وهذا ما يقيّده الدفتر.
 *
 * ── الضمانتان ────────────────────────────────────────────────────────────────
 * 1. **لا صرف بلا سداد**: الحالة يجب أن تكون PAID. الفاتورة المعلّقة لا تمسّ الرفّ.
 * 2. **لا صرف مرّتين**: `dispensedAt` يُضبط في المعاملة نفسها، والفحص عليه داخلها.
 *
 * `markPaid` يتخطّى خصم المخزون لهذا النمط (`fulfillment = ON_DISPENSE`)، فالخصم
 * يحدث هنا **مرّة واحدة** — والتكلفة تُحتسب هنا أيضًا لأنها تُقرأ من الحركة الفعلية.
 */
export declare function dispenseCounterSale(input: {
    clinicId: string;
    saleId: string;
    dispensedById: string;
}): Promise<{
    discount: import("@prisma/client-runtime-utils").Decimal;
    id: string;
    createdAt: Date;
    taxRate: import("@prisma/client-runtime-utils").Decimal;
    code: string;
    taxes: {
        id: string;
        description: string;
        idx: number;
        rate: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        includedInPrintRate: boolean;
    }[];
    taxAmount: import("@prisma/client-runtime-utils").Decimal;
    notes: string | null;
    status: import("@/generated/prisma/client").SaleStatus;
    items: {
        name: string;
        id: string;
        lineTotal: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        inventoryItemId: string | null;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }[];
    total: import("@prisma/client-runtime-utils").Decimal;
    netTotal: import("@prisma/client-runtime-utils").Decimal;
    paymentMethod: import("@/generated/prisma/client").PaymentMethod;
    paidAt: Date | null;
    subtotal: import("@prisma/client-runtime-utils").Decimal;
    taxTemplateId: string | null;
    refundedAt: Date | null;
    refundReason: string | null;
    cogsAmount: import("@prisma/client-runtime-utils").Decimal;
    discountCode: string | null;
    customerName: string | null;
    customerPhone: string | null;
    fulfillment: import("@/generated/prisma/client").SaleFulfillment;
    dispensedAt: Date | null;
}>;
/**
 * طابور الكاونتر: ما يُنتظر تحصيله، وما سُدِّد وينتظر الصرف، وآخر ما صُرف.
 * المصروفة تبقى ظاهرة يومًا كاملًا كي يرى الصيدلي ما ناوله للتوّ.
 */
export declare function listCounterSales(clinicId: string): Promise<{
    discount: import("@prisma/client-runtime-utils").Decimal;
    id: string;
    createdAt: Date;
    taxRate: import("@prisma/client-runtime-utils").Decimal;
    code: string;
    taxes: {
        id: string;
        description: string;
        idx: number;
        rate: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        includedInPrintRate: boolean;
    }[];
    taxAmount: import("@prisma/client-runtime-utils").Decimal;
    notes: string | null;
    status: import("@/generated/prisma/client").SaleStatus;
    items: {
        name: string;
        id: string;
        lineTotal: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        inventoryItemId: string | null;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }[];
    total: import("@prisma/client-runtime-utils").Decimal;
    netTotal: import("@prisma/client-runtime-utils").Decimal;
    paymentMethod: import("@/generated/prisma/client").PaymentMethod;
    paidAt: Date | null;
    subtotal: import("@prisma/client-runtime-utils").Decimal;
    taxTemplateId: string | null;
    refundedAt: Date | null;
    refundReason: string | null;
    cogsAmount: import("@prisma/client-runtime-utils").Decimal;
    discountCode: string | null;
    customerName: string | null;
    customerPhone: string | null;
    fulfillment: import("@/generated/prisma/client").SaleFulfillment;
    dispensedAt: Date | null;
}[]>;
