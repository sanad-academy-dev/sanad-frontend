import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InsuranceClaimStatus = t.Union(
  [
    t.Literal("DRAFT"),
    t.Literal("SUBMITTED"),
    t.Literal("APPROVED"),
    t.Literal("PARTIALLY_APPROVED"),
    t.Literal("REJECTED"),
    t.Literal("SETTLED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
