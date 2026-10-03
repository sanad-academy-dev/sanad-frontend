import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AccountingJobStatus = t.Union(
  [
    t.Literal("QUEUED"),
    t.Literal("IN_PROGRESS"),
    t.Literal("COMPLETED"),
    t.Literal("FAILED"),
  ],
  { additionalProperties: false },
);
