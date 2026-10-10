import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ScheduledJobStatus = t.Union(
  [
    t.Literal("QUEUED"),
    t.Literal("IN_PROGRESS"),
    t.Literal("COMPLETED"),
    t.Literal("FAILED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
