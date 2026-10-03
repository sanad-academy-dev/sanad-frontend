import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OutboxStatus = t.Union(
  [
    t.Literal("QUEUED"),
    t.Literal("SENDING"),
    t.Literal("SENT"),
    t.Literal("FAILED"),
    t.Literal("SKIPPED"),
    t.Literal("CANCELLED"),
    t.Literal("AWAITING_MANUAL"),
  ],
  { additionalProperties: false },
);
