import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OwnerType = t.Union(
  [
    t.Literal("ALL"),
    t.Literal("VIP"),
    t.Literal("LOYALTY"),
    t.Literal("NEW"),
    t.Literal("CURRENT"),
  ],
  { additionalProperties: false },
);
