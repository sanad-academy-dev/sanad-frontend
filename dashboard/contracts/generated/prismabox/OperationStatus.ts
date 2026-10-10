import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationStatus = t.Union(
  [
    t.Literal("SCHEDULED"),
    t.Literal("PREP"),
    t.Literal("ANESTHESIA"),
    t.Literal("SURGERY"),
    t.Literal("RECOVERY"),
    t.Literal("DISCHARGE"),
    t.Literal("FOLLOW_UP"),
    t.Literal("COMPLETED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
