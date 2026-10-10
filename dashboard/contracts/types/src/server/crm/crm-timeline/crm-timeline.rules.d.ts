import type { CrmTimelineEntry, CrmTimelineKind } from "@/server/crm/crm-timeline/crm-timeline.type";
/**
 * [CRM-P3] §8.3 — دمج الخيط الزمني وترقيمه، خالصًا بلا قاعدة بيانات فيعمل في الحزمة السريعة.
 *
 * كان الدمج قبل هذه المرحلة يقع في المتصفّح (`lead-timeline.tsx` يجمع أربعة نداءات
 * ويرتّبها). البريد يجعلها خمسة، و«الأحدث أولًا مع مرشّحات النوع» لا يمكن ترقيمه على
 * العميل إطلاقًا: لا يعرف المتصفّح أين تقع الصفحة التالية قبل أن يجلب كل صفٍّ من كل نوع.
 */
/**
 * الترتيب الكلّي: الوقت تنازليًّا، ثم المعرّف تنازليًّا لفضّ التعادل.
 *
 * فضّ التعادل ليس تجميلًا: صفّان في اللحظة نفسها (تغيير حالة يكتب سطر سجلّ وملاحظة آليّة
 * في معاملةٍ واحدة) بلا ترتيبٍ ثابت قد يتبادلان المواقع بين صفحةٍ وأخرى، فيختفي أحدهما
 * من الخيط أو يتكرّر. المعرّفات فريدة، فالترتيب بها حاسمٌ ومستقرّ.
 */
export declare function comparePosition(aAt: string | Date, aId: string, bAt: string | Date, bId: string): number;
export declare function compareEntries(a: CrmTimelineEntry, b: CrmTimelineEntry): number;
/** المؤشّر يحمل الوقت والمعرّف معًا، لأنّ الوقت وحده لا يحدّد موضعًا عند التعادل. */
export type TimelineCursor = {
    at: string;
    id: string;
};
export declare function encodeCursor(entry: CrmTimelineEntry): string;
/** مؤشّر تالف يُعامَل كغيابه: صفحةٌ أولى، لا انهيار. */
export declare function decodeCursor(raw: string | undefined | null): TimelineCursor | null;
/**
 * دمج مجاري مرتَّبة ثم قصّها عند المؤشّر.
 *
 * كل مصدرٍ يُجلب منه `limit + 1` صفًّا بحدٍّ أقصى، فالكلفة محدودة بعدد الأنواع لا بحجم
 * الخيط: خمسة أنواع × (حدّ + ١) في أسوأ الحالات، مهما طال تاريخ الصفقة.
 */
export declare function mergeTimeline(sources: ReadonlyArray<ReadonlyArray<CrmTimelineEntry>>, limit: number, cursor: TimelineCursor | null): {
    entries: CrmTimelineEntry[];
    nextCursor: string | null;
};
/** الأنواع المطلوبة؛ غيابها يعني «الكل» (تبويب «الكل» في §8.3). */
export declare function parseKinds(raw: string | undefined | null): CrmTimelineKind[] | null;
