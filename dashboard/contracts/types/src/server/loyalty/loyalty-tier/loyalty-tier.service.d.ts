import type { Prisma as PrismaNs } from "@/generated/prisma/client";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { type TierRow } from "@/server/loyalty/loyalty-tier/loyalty-tier.rules";
/**
 * [LY-P3] §4 — اشتقاق مستوى وليّ الأمر، وتثبيتُه للتقارير.
 *
 * **الاشتقاق هو المصدر؛ اللقطة كاشٌ.** كل قراءةٍ تخصّ وليّ أمرًا بعينه — الشريحة، ومضاعِفُ
 * الكسب لحظة المنح — تمرّ بـ`resolveOwnerTier`، فتكون صادقةً حتى لو لم تُشغَّل المهمّة
 * اليومية قطّ. وهي لا تُشغَّل في الإنتاج اليوم ([P13.12])، وهذا بالضبط سبب بناء المستوى
 * على الاشتقاق لا على عمود: مستوًى معلَّقٌ على مهمّةٍ نائمة مستوًى كاذب.
 */
type Tx = PrismaNs.TransactionClient;
export type OwnerTierOutcome = {
    tier: TierRow | null;
    qualifyingSpend: Prisma.Decimal;
    windowMonths: number;
    multiplier: Prisma.Decimal;
};
/**
 * BR-L4.1 — المستوى من الإنفاق المتدحرج، محسوبًا عند القراءة.
 *
 * **لا يُحتسب كسبُ هذه اللحظة نفسها**، لأنّ الصفّ لم يُكتب بعد حين يُستدعى هذا من
 * `commitLoyaltyEarn`. وهذه ليست مصادفةً بل BR-L4.3 حرفيًا: بلوغُ مستوًى أعلى يؤثّر في
 * الكسب **القادم**، فلا تُرقّي فاتورةٌ نفسَها ثمّ تُكافئ نفسها بالمضاعِف الجديد.
 */
export declare function resolveOwnerTier(client: Tx | typeof db, clinicId: string, ownerId: string, now?: Date): Promise<OwnerTierOutcome | null>;
/**
 * خطوة المهمّة اليومية: تُعيد حساب اللقطات لِمَن له حركةٌ في الدفتر.
 *
 * **تُثبّت ما تراه القراءة ولا تكون مصدره** — نفس عقد `crm-sla.job`. ما تضيفه شيءٌ
 * واحد لا تقدّمه القراءة: مستوًى قابلٌ للتصفية والتجميع عبر آلاف أولياء الأمور في تقارير
 * §11 بلا استعلامٍ لكلّ وليّ أمر.
 */
export declare function reconcileOwnerTiers(clinicId: string, now?: Date, limit?: number): Promise<{
    scanned: number;
    changed: number;
}>;
export {};
