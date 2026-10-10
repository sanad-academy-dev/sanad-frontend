import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DietFoodKind = t.Union(
  [
    t.Literal("MAINTENANCE"),
    t.Literal("THERAPEUTIC"),
    t.Literal("TREAT"),
    t.Literal("SUPPLEMENT"),
  ],
  { additionalProperties: false },
);
