import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaxChargeType = t.Union(
  [
    t.Literal("ACTUAL"),
    t.Literal("ON_NET_TOTAL"),
    t.Literal("ON_PREVIOUS_ROW_AMOUNT"),
    t.Literal("ON_PREVIOUS_ROW_TOTAL"),
    t.Literal("ON_ITEM_QUANTITY"),
  ],
  { additionalProperties: false },
);
