import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ApplyDiscountOn = t.Union(
  [t.Literal("GRAND_TOTAL"), t.Literal("NET_TOTAL")],
  { additionalProperties: false },
);
