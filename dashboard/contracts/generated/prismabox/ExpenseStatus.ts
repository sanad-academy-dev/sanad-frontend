import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExpenseStatus = t.Union(
  [
    t.Literal("DRAFT"),
    t.Literal("PENDING_REVIEW"),
    t.Literal("APPROVED"),
    t.Literal("REJECTED"),
    t.Literal("PAID"),
    t.Literal("CANCELED"),
  ],
  { additionalProperties: false },
);
