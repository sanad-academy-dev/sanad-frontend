import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NutritionLifeStage = t.Union(
  [
    t.Literal("GROWTH_UNDER_4M"),
    t.Literal("GROWTH_OVER_4M"),
    t.Literal("ADULT"),
    t.Literal("SENIOR"),
  ],
  { additionalProperties: false },
);
