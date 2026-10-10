import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MuscleConditionScore = t.Union(
  [
    t.Literal("NORMAL"),
    t.Literal("MILD_LOSS"),
    t.Literal("MODERATE_LOSS"),
    t.Literal("SEVERE_LOSS"),
  ],
  { additionalProperties: false },
);
