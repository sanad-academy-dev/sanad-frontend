import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TriageCategory = t.Union(
  [
    t.Literal("RED"),
    t.Literal("ORANGE"),
    t.Literal("YELLOW"),
    t.Literal("GREEN"),
    t.Literal("BLUE"),
  ],
  {
    additionalProperties: false,
    description: `فئات قائمة الفرز البيطرية (VTL — Ruys et al. 2012) المشتقّة من مقياس مانشستر.
الأهداف الزمنية لكل فئة في \`emergency.rules.ts\` لا هنا: العتبة التي تقرّر من
يُرى أوّلًا تُراجَع في طلب دمج ويوقّعها إنسان، ولا تُحرَّر من شاشة إعدادات.`,
  },
);
