import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BankTransactionStatus = t.Union(
  [
    t.Literal("PENDING"),
    t.Literal("UNRECONCILED"),
    t.Literal("RECONCILED"),
    t.Literal("SETTLED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
