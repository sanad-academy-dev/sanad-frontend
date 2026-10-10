import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NutritionGoal = t.Union(
  [
    t.Literal("MAINTENANCE"),
    t.Literal("WEIGHT_LOSS"),
    t.Literal("WEIGHT_GAIN"),
    t.Literal("GROWTH"),
    t.Literal("GESTATION"),
    t.Literal("LACTATION"),
    t.Literal("RECOVERY"),
  ],
  { additionalProperties: false },
);
