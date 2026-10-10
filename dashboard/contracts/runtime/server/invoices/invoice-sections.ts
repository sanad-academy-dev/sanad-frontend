/**
 * أقسام فاتورة الزيارة: الكشف، الدورات، الأدوية والمستلزمات.
 *
 * الخصم والضريبة يُحسبان على مستوى الفاتورة، فحصة كل قسم منهما تُوزَّع بالتناسب
 * مع مجموع القسم. الصيغة هنا واحدة يستعملها الخادم للتحصيل والعميل للعرض قبل
 * الدفع، حتى لا يظهر للمستخدم رقم ويُخصم منه رقم آخر.
 */

export const SECTION_SCOPES = ["CONSULTATION", "SERVICES", "PRODUCTS"] as const;
export type SectionScope = (typeof SECTION_SCOPES)[number];

export const PAYMENT_SCOPES = [...SECTION_SCOPES, "ALL"] as const;
export type PaymentScope = (typeof PAYMENT_SCOPES)[number];

const round2 = (n: number) => Math.round(n * 100) / 100;

/** الكمية المحاسَبة على الفاتورة = الكمية − المجانية (صفر إن كان الصنف مجانيًا بالكامل) */
export const billableProductQty = (p: {
	quantity: number;
	freeQuantity: number;
	fullyFree: boolean;
}) => (p.fullyFree ? 0 : Math.max(0, p.quantity - p.freeQuantity));

/**
 * حصة القسم من إجمالي الفاتورة (شاملة الضريبة بعد الخصم).
 * `subtotal` هو مجموع الأقسام كلها قبل الخصم والضريبة.
 */
export const sectionAmount = (
	sectionSubtotal: number,
	subtotal: number,
	total: number,
): number => (subtotal <= 0 ? 0 : round2((sectionSubtotal / subtotal) * total));
