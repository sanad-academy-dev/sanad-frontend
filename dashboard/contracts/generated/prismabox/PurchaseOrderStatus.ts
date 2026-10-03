import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PurchaseOrderStatus = t.Union(
  [
    t.Literal("DRAFT"),
    t.Literal("ORDERED"),
    t.Literal("PARTIALLY_RECEIVED"),
    t.Literal("RECEIVED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
