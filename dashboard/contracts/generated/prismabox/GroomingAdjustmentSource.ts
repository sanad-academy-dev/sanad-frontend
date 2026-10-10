import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingAdjustmentSource = t.Union(
  [
    t.Literal("AUTO_INTAKE"),
    t.Literal("MANUAL"),
    t.Literal("PACKAGE"),
    t.Literal("OVERRIDE"),
  ],
  {
    additionalProperties: false,
    description: `مصدر الرسم المطبَّق — يُحفظ على الصفّ لا يُستنتج، فيبقى «لماذا هذا المبلغ؟» مقروءًا`,
  },
);
