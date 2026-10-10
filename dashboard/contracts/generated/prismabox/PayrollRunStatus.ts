import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PayrollRunStatus = t.Union(
  [
    t.Literal("DRAFT"),
    t.Literal("CALCULATED"),
    t.Literal("PENDING_APPROVAL"),
    t.Literal("APPROVED"),
    t.Literal("PAID"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
