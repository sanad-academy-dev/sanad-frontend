import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NutritionActivity = t.Union(
  [
    t.Literal("INACTIVE"),
    t.Literal("LOW"),
    t.Literal("MODERATE"),
    t.Literal("HIGH"),
    t.Literal("WORK_LIGHT"),
    t.Literal("WORK_MODERATE"),
    t.Literal("WORK_HEAVY"),
  ],
  { additionalProperties: false },
);
