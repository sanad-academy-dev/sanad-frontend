import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DietFoodForm = t.Union(
  [
    t.Literal("DRY"),
    t.Literal("WET"),
    t.Literal("RAW"),
    t.Literal("HOME_COOKED"),
    t.Literal("TREAT"),
    t.Literal("SUPPLEMENT"),
  ],
  { additionalProperties: false },
);
