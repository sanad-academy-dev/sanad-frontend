import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationLaterality = t.Union(
  [
    t.Literal("NONE"),
    t.Literal("LEFT"),
    t.Literal("RIGHT"),
    t.Literal("BILATERAL"),
  ],
  { additionalProperties: false },
);
