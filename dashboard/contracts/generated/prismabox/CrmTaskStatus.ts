import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmTaskStatus = t.Union(
  [
    t.Literal("BACKLOG"),
    t.Literal("TODO"),
    t.Literal("IN_PROGRESS"),
    t.Literal("DONE"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
