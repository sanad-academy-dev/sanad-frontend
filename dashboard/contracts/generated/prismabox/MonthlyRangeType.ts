import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MonthlyRangeType = t.Union(
  [
    t.Literal("UNDER_50"),
    t.Literal("RANGE_50_100"),
    t.Literal("RANGE_101_250"),
    t.Literal("OVER_1000"),
  ],
  { additionalProperties: false },
);
