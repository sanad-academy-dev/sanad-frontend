import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PaymentDiscountType = t.Union(
  [t.Literal("PERCENTAGE"), t.Literal("AMOUNT")],
  { additionalProperties: false },
);
