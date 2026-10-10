import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationUrgency = t.Union(
  [
    t.Literal("IMMEDIATE"),
    t.Literal("URGENT"),
    t.Literal("EXPEDITED"),
    t.Literal("ELECTIVE"),
  ],
  { additionalProperties: false },
);
