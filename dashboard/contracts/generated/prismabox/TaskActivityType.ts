import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaskActivityType = t.Union(
  [
    t.Literal("STATUS_CHANGED"),
    t.Literal("COMMENT"),
    t.Literal("TASK_ACCEPTED"),
    t.Literal("TASK_DECLINED"),
  ],
  { additionalProperties: false },
);
