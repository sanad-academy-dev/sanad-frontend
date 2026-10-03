/**
 * أقسام فاتورة الزيارة: الكشف، الدورات، الأدوية والمستلزمات.
 *
 * الخصم والضريبة يُحسبان على مستوى الفاتورة، فحصة كل قسم منهما تُوزَّع بالتناسب
 * مع مجموع القسم. الصيغة هنا واحدة يستعملها الخادم للتحصيل والعميل للعرض قبل
 * الدفع، حتى لا يظهر للمستخدم رقم ويُخصم منه رقم آخر.
 */
export declare const SECTION_SCOPES: readonly ["CONSULTATION", "SERVICES", "PRODUCTS"];
export type SectionScope = (typeof SECTION_SCOPES)[number];
export declare const PAYMENT_SCOPES: readonly ["CONSULTATION", "SERVICES", "PRODUCTS", "ALL"];
export type PaymentScope = (typeof PAYMENT_SCOPES)[number];
/** الكمية المحاسَبة على الفاتورة = الكمية − المجانية (صفر إن كان الصنف مجانيًا بالكامل) */
export declare const billableProductQty: (p: {
    quantity: number;
    freeQuantity: number;
    fullyFree: boolean;
}) => number;
/**
 * حصة القسم من إجمالي الفاتورة (شاملة الضريبة بعد الخصم).
 * `subtotal` هو مجموع الأقسام كلها قبل الخصم والضريبة.
 */
export declare const sectionAmount: (sectionSubtotal: number, subtotal: number, total: number) => number;
