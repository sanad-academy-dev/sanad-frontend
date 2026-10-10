import Elysia from "elysia";
/**
 * [RC1] نبضة الـcron — **المسار الوحيد في الوحدة بلا صلاحية**، وله ملفّ خاصّ لهذا
 * السبب بالضبط.
 *
 * `ungated-routes.audit.test.ts` يعمل على مستوى **الملفّ**: إعفاءُ ملفٍّ فيه خمسة
 * مسارات ليُقبل واحدٌ منها بلا حارس يُسقط الرقابة عن الأربعة الباقية. فمسارٌ واحد
 * في ملفٍّ واحد يعني أن الإعفاء يصف ما يُعفى بالضبط، ولا يخفي شيئًا خلفه.
 *
 * ── الحارس هنا سرٌّ لا صلاحية ─────────────────────────────────────────────────
 *
 * يستدعيها `crontab` على المضيف (وهو مستعمل فعلًا للنسخ الاحتياطي — راجع
 * `docs/deployment.md` §النسخ)، فلا جلسة لها ولا مستخدم ولا أكاديمية نشطة. ولا يُغني
 * عن ذلك «تشغيلٌ من الشاشة» وحده: ميزةٌ لا تعمل إلّا وأحدٌ يفتح المتصفّح هي بالضبط
 * الحدّ الذي بُنيت هذه الوحدة لإزالته.
 *
 * ولأن النقطة تُطلق دفعةَ رسائل إلى أولياء أمور حقيقيّين:
 *   - غياب `CRON_SECRET` ⇒ **٥٠٣ مغلقة** برسالة تشرح ما ينقص. لا فتحٌ افتراضيّ،
 *     ولا تشغيلٌ صامت لأن متغيّرًا لم يُضبط.
 *   - المقارنة **بزمنٍ ثابت** لا `===`: مقارنة السلاسل تخرج عند أوّل محرف مختلف،
 *     وذلك فرقٌ زمنيّ يُقاس ويُستغلّ لتخمين السرّ محرفًا محرفًا.
 *
 * ── السطر الذي يُضاف إلى crontab ─────────────────────────────────────────────
 *
 *   *​/5 * * * * curl -fsS -X POST https://<host>/api/cron/tick \
 *       -H "x-cron-secret: $CRON_SECRET" >/dev/null 2>&1
 *
 * وهي عديمةُ الأثر عند التكرار بحكم مفاتيح الفرادة: نبضةٌ كل خمس دقائق تُنتج مسحًا
 * واحدًا في اليوم وتوزيعًا واحدًا لكل نافذة ربع ساعة.
 */
/**
 * مقارنةٌ بزمنٍ ثابت، بلا `node:crypto` كي يبقى الملفّ صالحًا في أيّ زمن تشغيل
 * تستهدفه الحزمة. الحلقة تمرّ على الطول الأكبر دائمًا فلا يُسرَّب الطولُ نفسه.
 */
export declare function safeEqual(a: string, b: string): boolean;
export declare const cronController: Elysia<"/cron", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {};
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
}, {
    cron: {
        tick: {
            post: {
                body: unknown;
                params: {};
                query: {
                    limit?: string | undefined;
                };
                headers: {
                    "x-cron-secret"?: string | undefined;
                };
                response: {
                    200: {
                        ranAt: string;
                        enqueued: number;
                        run: import("@/server/scheduler/scheduler.runner").RunSummary;
                        ok: boolean;
                    };
                    401: {
                        readonly message: "غير مصرح";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                    503: {
                        readonly message: "المُجدوِل غير مُهيّأ: اضبط CRON_SECRET (٣٢ محرفًا فأكثر) لتفعيل نبضة التذكيرات";
                    };
                };
            };
        };
    };
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
