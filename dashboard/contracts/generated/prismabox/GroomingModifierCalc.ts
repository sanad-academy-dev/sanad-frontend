import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingModifierCalc = t.Union(
  [t.Literal("PERCENT"), t.Literal("FIXED"), t.Literal("PER_MINUTE")],
  { additionalProperties: false, description: `طريقة حساب الرسم.` },
);
