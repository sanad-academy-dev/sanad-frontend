import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PaymentType = t.Union(
  [t.Literal("RECEIVE"), t.Literal("PAY"), t.Literal("INTERNAL_TRANSFER")],
  { additionalProperties: false },
);
