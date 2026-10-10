import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PayrollPaymentMethod = t.Union(
  [t.Literal("TRANSFER"), t.Literal("CASH"), t.Literal("CHECK")],
  { additionalProperties: false },
);
