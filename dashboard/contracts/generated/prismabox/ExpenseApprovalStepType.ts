import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExpenseApprovalStepType = t.Union(
  [
    t.Literal("CREATED"),
    t.Literal("SENT_FOR_REVIEW"),
    t.Literal("MANAGER_REVIEW"),
    t.Literal("FINANCE_APPROVAL"),
    t.Literal("DISBURSEMENT"),
  ],
  { additionalProperties: false },
);
