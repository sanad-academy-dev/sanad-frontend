import type { CrmDealStatusKind, CrmLeadStatusKind } from "@/generated/prisma/enums";
/**
 * [CRM-P0] قواعد BR-C2.1 خالصة — بلا قاعدة بيانات وبلا شبكة، فتُختبر بالجدول (§2.1).
 */
/** BR-C2.1.1 — الحذف الصلب ممنوع ما دام النوع مُشارًا إليه؛ التعطيل هو البديل. */
export declare function assertDeletable(referenceCount: number, label: string): void;
/**
 * BR-C2.1.2 — تغطية الأنواع تُتحقَّق **عند التعطيل**: خطّ الأنابيب يجب أن يبقى صالحًا للسير،
 * فلا يجوز أن تُترك الأكاديمية بلا حالةٍ مفتوحة أو بلا مخرجٍ للكسب أو الفقد.
 *
 * تُمرَّر الحالات النشطة **بعد** استثناء الحالة المرشَّحة للتعطيل، فتصف الدالة العالم كما
 * سيصبح لا كما هو. هذا هو الفرق بين منعِ آخر حالةٍ مفتوحة وبين السماح بتعطيلها.
 */
export declare function missingKinds<K extends string>(remainingKinds: readonly K[], requiredKinds: readonly K[]): K[];
export declare const REQUIRED_LEAD_KINDS: readonly CrmLeadStatusKind[];
export declare const REQUIRED_DEAL_KINDS: readonly CrmDealStatusKind[];
export declare function assertLeadKindCoverage(remainingKinds: readonly CrmLeadStatusKind[]): void;
export declare function assertDealKindCoverage(remainingKinds: readonly CrmDealStatusKind[]): void;
