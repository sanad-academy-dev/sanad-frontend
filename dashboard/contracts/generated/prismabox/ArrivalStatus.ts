import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ArrivalStatus = t.Union(
  [
    t.Literal("EN_ROUTE"),
    t.Literal("ARRIVED"),
    t.Literal("TRIAGED"),
    t.Literal("DISPOSED"),
    t.Literal("LEFT_WITHOUT_TRIAGE"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
