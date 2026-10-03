import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingCancelKind = t.Union(
  [
    t.Literal("OWNER_CANCELLED"),
    t.Literal("CLINIC_CANCELLED"),
    t.Literal("NO_SHOW"),
    t.Literal("HEALTH_REFUSAL"),
    t.Literal("BEHAVIOR_REFUSAL"),
  ],
  { additionalProperties: false, description: `سبب إنهاء الجلسة قبل أوانها` },
);
