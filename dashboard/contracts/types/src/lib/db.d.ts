import "dotenv/config";
import type { Prisma } from "../../generated/prisma/client";
declare const db: import("../../generated/prisma/internal/class").PrismaClient<never, Prisma.GlobalOmitConfig | undefined, import("@prisma/client/runtime/client").DefaultArgs>;
/**
 * [E0] العميل نفسه بنوع `TransactionClient` — لتمريره إلى مُعِينٍ يقبل معاملة.
 *
 * ── لماذا موجود ─────────────────────────────────────────────────────────────
 *
 * القاعدة البيتيّة التي أرستها وحدة التنويم: أيّ مُعِين يقبل `tx` يُعلَن
 * `Prisma.TransactionClient` وحده، **لا** `Prisma.TransactionClient | typeof db`.
 * الاتحاد هو ما يستهلك عمق استنتاج TypeScript: كل استدعاء عبره يوزّع النوع على
 * طرفَي الاتحاد فيضاعف العمل بحجم أنواع Prisma كلّها، وقد قِيس ذلك — أربعة اتحادات
 * باقية كانت تكفي لإسقاط برنامج الخادم في نفاد ذاكرة عند سقف 9216 ميغابايت.
 *
 * لكنّ المستدعي خارج المعاملة يملك `db` لا `TransactionClient`. فبدل أن يستورد كل
 * متحكّم أنواع Prisma ليكتب `db as unknown as Prisma.TransactionClient` بنفسه —
 * وهو استيرادٌ يُضيف حِملًا نوعيًّا إلى ملفّ لم يكن يحمله — يُكتب التحويل هنا مرّة
 * واحدة بتعليقه، ويستورده المستدعي جاهزًا.
 *
 * التحويل آمن: `PrismaClient` يحقّق `TransactionClient` في وقت التشغيل (نفس دوالّ
 * النماذج)، وما ينقصه هو `$transaction`/`$connect` وأخواتها — وهي بالضبط ما لا
 * يستعمله مُعِينٌ يقبل معاملة. السلوك واحد، والفرق كلّه في وقت الفحص.
 */
declare const dbAsTx: Prisma.TransactionClient;
export { db, dbAsTx };
