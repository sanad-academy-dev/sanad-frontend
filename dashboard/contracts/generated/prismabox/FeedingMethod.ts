import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const FeedingMethod = t.Union(
  [t.Literal("MEAL_FED"), t.Literal("FREE_CHOICE"), t.Literal("COMBINATION")],
  { additionalProperties: false },
);
