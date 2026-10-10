import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationStage = t.Union(
  [
    t.Literal("CONSENT"),
    t.Literal("FASTING_CHECK"),
    t.Literal("ASSESSMENT"),
    t.Literal("PREMED"),
    t.Literal("SIGN_IN"),
    t.Literal("INDUCTION"),
    t.Literal("MAINTENANCE"),
    t.Literal("TIME_OUT"),
    t.Literal("IN_PROGRESS"),
    t.Literal("CLOSING"),
    t.Literal("SIGN_OUT"),
    t.Literal("MONITORING"),
    t.Literal("READY_FOR_DISCHARGE"),
  ],
  { additionalProperties: false },
);
