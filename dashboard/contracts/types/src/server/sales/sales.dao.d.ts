import type { PaymentMethod, SaleFulfillment } from "@/generated/prisma/enums";
import { type SaleResponse } from "@/server/sales/sales.type";
interface CreateSaleArgs {
    clinicId: string;
    items: {
        inventoryItemId?: string;
        name: string;
        unitPrice: number;
        quantity: number;
    }[];
    discount?: number;
    discountCode?: string;
    /** [P12B.3] عميل معروف (وليّ أمر) — يُمرَّر لمحرّك قواعد الضريبة ليُطابق القواعد الخاصّة بالطرف */
    partyId?: string | null;
    paymentMethod?: PaymentMethod;
    customerName?: string;
    customerPhone?: string;
    notes?: string | null;
    /** [P12.4] §16 — الكاشير؛ بدونه لا يُنسب البيع إلى عهدة أحد (قيد KL-5) */
    createdById?: string | null;
    /**
     * [PH16] متى يُخصم المخزون. الافتراضي عند الدفع (نقطة البيع). كاونتر الصيدلية
     * يمرّر ON_DISPENSE: الفاتورة تُسدَّد أولًا ثم يخصم زرّ الصرف — لا الدفع — الرفّ.
     */
    fulfillment?: SaleFulfillment;
    /** [LY-P2] §6.1 — نقاط يختار الكاشير استبدالها على هذه السلّة */
    redeemPoints?: number | null;
}
export declare const salesDao: {
    list(clinicId: string): Promise<SaleResponse[]>;
    /**
     * [P12B.3] الإجماليات كلّها من محرّك §8 عبر `priceSale` — لا حساب محلّي هنا ولا نسبة
     * ضريبة قادمة من العميل. المتصفّح كان يرسل `taxRate` والخادم يثق بها، فكان بوسع أي
     * عميل أن يبيع بضريبة صفر.
     */
    create(args: CreateSaleArgs): Promise<SaleResponse>;
    /** دفع فاتورة معلّقة: تحويلها PAID وخصم الكميات من المخزون (حركة بيع لكل منتج) */
    markPaid(clinicId: string, saleId: string, paymentMethod?: PaymentMethod): Promise<SaleResponse>;
    /**
     * [P12B.2] إرجاع بيع مدفوع: الأصناف تعود للمخزون، والحالة تصير REFUNDED فيلتقطها
     * محول نقطة البيع ([P12B.4]) ويعكس قيدها إلحاقًا (AR-2) — نفس مبدأ ردّ فاتورة
     * الأكاديمية في [P12B.1].
     *
     * الإرجاع كامل فقط في v1 (قرار D14): الإرجاع الجزئي يحتاج خريطة سطور تُقابل بها
     * الكميات المُعادة، وهي غير موجودة بعد.
     *
     * كل شيء داخل معاملة واحدة: إعادة المخزون وتغيير الحالة يقعان معًا أو لا يقعان،
     * وإلا صار البيع مُرتجَعًا وبضاعته خارج الرفّ (أو العكس).
     */
    refundSale(clinicId: string, saleId: string, userId: string, reason: string): Promise<SaleResponse | "not-found" | "not-paid" | "already-refunded">;
};
export {};
