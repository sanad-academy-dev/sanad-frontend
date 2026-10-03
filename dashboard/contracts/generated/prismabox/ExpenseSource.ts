import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExpenseSource = t.Union(
  [
    t.Literal("MANUAL"),
    t.Literal("PAYROLL_RUN"),
    t.Literal("END_OF_SERVICE"),
    t.Literal("PURCHASE_ORDER"),
  ],
  { additionalProperties: false },
);
