import type { emergencyDao } from "@/server/emergency/emergency.dao";
/**
 * [E3] توجيه تنبيهات الفرز — الطبقة التي تقرّر **من يُوقَظ**.
 *
 * الخطة الحاكمة: `docs/emergency-workflow-plan.md` §4.4
 *
 * مفصولة عن الـDAO عمدًا: الـDAO استعلامات Prisma بلا منطق أعمال (AGENTS.md)،
 * و«هل يستحقّ هذا اللون إيقاظ فريق كامل؟» قرارُ سياسة لا استعلام.
 *
 * كل دالّة هنا **لا ترمي أبدًا**: إخفاق تنبيه يجب ألّا يُفشل الفرز نفسه — الفرز
 * حدث، والتنبيه أثرٌ له.
 */
type AssessResult = Awaited<ReturnType<typeof emergencyDao.assess>>;
export declare function notifyTriageAssessed(clinicId: string, result: AssessResult, actorUserId: string | null): Promise<void>;
/**
 * إنذار التجاوز عند تحميل اللوحة.
 *
 * **الحدّ المعروف (§4.5):** بلا مُجدوِل دوريّ في المستودع، التجاوز يُكتشف حين يفتح
 * أحدٌ اللوحة. هذا مذكور لا مخفيّ، وهو نفس حدّ وحدة التنويم مع الجرعة الفائتة.
 *
 * وحتى لا يتحوّل ذلك إلى فيضان: يُنبَّه المتجاوز وحده، ومرّة واحدة لكل زيارة في
 * اليوم — الفحص على عنصر وارد قائم لنفس الزيارة اليوم.
 */
export declare function notifyTriageBreaches(clinicId: string, board: Awaited<ReturnType<typeof emergencyDao.listBoard>>): Promise<void>;
export {};
