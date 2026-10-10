import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InpatientAcuity = t.Union(
  [
    t.Literal("LOW"),
    t.Literal("MEDIUM"),
    t.Literal("HIGH"),
    t.Literal("CRITICAL"),
  ],
  {
    additionalProperties: false,
    description: `درجة الحرجية — يدوية في الإصدار الأول (القرار D7). حسابها آليًا من العلامات
الحيوية ممكن لاحقًا وبيانات اللوحة تكفيه، لكن رقمًا محسوبًا يُعرض كأنه حكم
سريري قبل أن يُعاير على أنواع الحيوانات خطرٌ لا فائدة.`,
  },
);
