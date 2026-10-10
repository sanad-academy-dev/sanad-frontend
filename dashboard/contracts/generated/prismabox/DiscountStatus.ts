import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DiscountStatus = t.Union(
  [
    t.Literal("ACTIVE"),
    t.Literal("INACTIVE"),
    t.Literal("EXPIRED"),
    t.Literal("SCHEDULED"),
  ],
  { additionalProperties: false },
);
