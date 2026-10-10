import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PayrollEarningType = t.Union(
  [
    t.Literal("ALLOWANCE"),
    t.Literal("BONUS"),
    t.Literal("COMMISSION"),
    t.Literal("EXPENSE_REIMBURSEMENT"),
  ],
  { additionalProperties: false },
);
