import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ParasiteFinding = t.Union(
  [
    t.Literal("NONE"),
    t.Literal("FLEAS"),
    t.Literal("TICKS"),
    t.Literal("LICE"),
    t.Literal("MITES_SUSPECTED"),
    t.Literal("MULTIPLE"),
  ],
  {
    additionalProperties: false,
    description: `نتيجة فحص الطفيليات — أي قيمة غير NONE تُفعّل بروتوكول G7.`,
  },
);
