import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CoatCondition = t.Union(
  [
    t.Literal("HEALTHY"),
    t.Literal("DRY"),
    t.Literal("GREASY"),
    t.Literal("DANDRUFF"),
    t.Literal("SHEDDING_HEAVY"),
    t.Literal("DAMAGED"),
  ],
  { additionalProperties: false },
);
