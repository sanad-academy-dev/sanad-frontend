import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdTemplateCategory = t.Union(
  [
    t.Literal("SEO"),
    t.Literal("PAID_ADS"),
    t.Literal("SALES"),
    t.Literal("SOCIAL"),
    t.Literal("EMAIL"),
  ],
  {
    additionalProperties: false,
    description: `تبويبات مكتبة القوالب (شاشة 540226)`,
  },
);
