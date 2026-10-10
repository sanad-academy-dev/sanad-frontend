import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExpenseApprovalStepState = t.Union(
  [
    t.Literal("PENDING"),
    t.Literal("SENT"),
    t.Literal("APPROVED"),
    t.Literal("REJECTED"),
    t.Literal("DONE"),
  ],
  { additionalProperties: false },
);
