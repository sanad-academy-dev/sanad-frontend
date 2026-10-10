import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NutritionRecheckOutcome = t.Union(
  [
    t.Literal("ON_TRACK"),
    t.Literal("TOO_FAST"),
    t.Literal("TOO_SLOW"),
    t.Literal("STALLED"),
    t.Literal("REVERSED"),
    t.Literal("GOAL_REACHED"),
  ],
  { additionalProperties: false },
);
