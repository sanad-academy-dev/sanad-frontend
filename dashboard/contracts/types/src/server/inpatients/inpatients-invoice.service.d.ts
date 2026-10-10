import { Prisma } from "@/generated/prisma/client";
/**
 * [IP4] فاتورة الإقامة — الخانة السادسة على `Invoice`.
 *
 * ── لماذا فاتورة مستقلّة عن فاتورة الزيارة (القرار D1) ──────────────────────
 *
 * الزيارة تُقفل بانتهاء الجلسة، والإقامة تعمّر بعدها أيامًا. طيّ الإقامة في
 * فاتورة الزيارة يعني إمّا إبقاء الزيارة مفتوحة أسبوعًا (فتكذب تقارير الزيارات)
 * أو تعديل فاتورة مُقفلة كل يوم (وهو ما تمنعه قاعدة «المسدَّدة لا تُمسّ»).
 * الفصل هو ما تفعله العمليات والأشعّة والتجميل أصلًا.
 *
 * ── لا حساب ضريبة هنا ───────────────────────────────────────────────────────
 *
 * كل الأرقام تمرّ عبر `priceClinicInvoice` كما تفعل مسارات الفواتير الخمسة
 * الأخرى. كتابة حسابٍ ضريبيّ جديد هنا تُعيد إنتاج ما قضى المستودع طورين كاملين
 * في حذفه.
 */
type Tx = Prisma.TransactionClient;
export declare const inpatientInvoiceSelect: {
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
export type InpatientInvoiceResponse = Prisma.InvoiceGetPayload<{
    select: typeof inpatientInvoiceSelect;
}>;
/**
 * بند على فاتورة الإقامة كما يُعرض للطاقم ووليّ الأمر.
 *
 * يُشتقّ عند كل قراءة من مصادره (أيام الإقامة، صفوف الإعطاء، عناصر المختبر
 * والأشعّة المكتملة) ولا يُخزَّن: صفّ `invoice_item` جديد يعني نموذجًا آخر على
 * رسم أنواع Prisma الذي بلغ سقفه. الأرقام نصوص — Decimal لا يعبر JSON.
 */
export type InpatientInvoiceLine = {
    kind: "ACCOMMODATION" | "MEDICATION" | "LAB" | "IMAGING";
    label: string;
    qty: number;
    unitPrice: string;
    amount: string;
    /** وقت الإعطاء/الاكتمال — للترتيب والعرض */
    at: string | null;
};
export type InpatientInvoiceWithLines = InpatientInvoiceResponse & {
    lines: InpatientInvoiceLine[];
    days: number;
};
/**
 * عدد الأيام المحاسَبة.
 *
 * يوم الدخول يُحتسب دائمًا (الطفل شغل قفصًا ذلك اليوم مهما تأخّرت الساعة)،
 * ثم كل يوم تقويمي جديد يبدأ. هذه هي القاعدة الفندقية نفسها، وهي ما يفهمه وليّ الأمر
 * حين يقرأ «٣ أيام» على فاتورة دخل فيها الثلاثاء وخرج الخميس.
 *
 * القسمة على المللي ثانية بعد تصفير الساعات لا قبلها: الفرق الخام بين الثلاثاء
 * ١١ مساءً والخميس ١ صباحًا يومٌ وساعتان — أي «يومان» بالقسمة، وثلاثة بالتقويم.
 */
export declare const billableDayCount: (admittedAt: Date, dischargedAt: Date | null) => number;
/**
 * تُنشئ فاتورة الإقامة أو تُحدّث مجاميعها.
 *
 * تُستدعى عند كل قراءة لِلَسان الفوترة وقبل السداد مباشرةً: الإقامة الجارية
 * تتغيّر مجاميعها كل يوم، وعرضُ رقمٍ محسوب أمس يجعل وليّ الأمر يقرأ مبلغًا ثم يُطلب
 * منه غيره. الفاتورة المسدَّدة لا تُمسّ مجاميعها أبدًا (نمط بقيّة الوحدات).
 */
export declare const createOrRefreshInpatientInvoice: (stayId: string, clinicId: string, client?: Tx) => Promise<InpatientInvoiceWithLines>;
/** هل سُوّيت فاتورة الإقامة؟ أساس البوابة G7 */
export declare const inpatientInvoiceSettled: (stayId: string, client?: Tx) => Promise<boolean>;
/**
 * سداد فاتورة الإقامة — دفعة واحدة على الفاتورة كلّها (كليّة أو جزئية).
 *
 * لا سداد على مستوى البند خلافًا لفاتورة الزيارة: بنود الإقامة سلّةٌ واحدة
 * (إقامة + ما أُعطي)، وتقسيم الدفعة عليها يُنتج حصصًا لا يفهمها وليّ الأمر.
 */
export declare const payInpatientInvoice: (stayId: string, clinicId: string, userId: string | null, input: {
    amountPaid: number;
    paymentMethod: Prisma.InvoiceUncheckedCreateInput["paymentMethod"];
}) => Promise<InpatientInvoiceResponse | "not-found" | "already-paid" | "empty">;
export {};
