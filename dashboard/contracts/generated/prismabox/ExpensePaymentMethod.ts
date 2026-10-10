import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExpensePaymentMethod = t.Union(
  [
    t.Literal("CASH"),
    t.Literal("BANK_TRANSFER"),
    t.Literal("CARD"),
    t.Literal("CHEQUE"),
    t.Literal("TREASURY"),
  ],
  { additionalProperties: false },
);
