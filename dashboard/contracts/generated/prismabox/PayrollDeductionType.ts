import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PayrollDeductionType = t.Union(
  [
    t.Literal("ADVANCE"),
    t.Literal("LOAN_INSTALLMENT"),
    t.Literal("PENALTY"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
