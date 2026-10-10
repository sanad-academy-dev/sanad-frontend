import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaskStatus = t.Union(
  [
    t.Literal("PENDING"),
    t.Literal("NOT_YET_STARTED"),
    t.Literal("IN_PROGRESS"),
    t.Literal("COMPLETED"),
    t.Literal("CANCELLED"),
    t.Literal("DUPLICATE"),
    t.Literal("QUEUE"),
  ],
  { additionalProperties: false },
);
