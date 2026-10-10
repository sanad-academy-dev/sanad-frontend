import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AllowanceType = t.Union(
  [
    t.Literal("HOUSING"),
    t.Literal("TRANSPORT"),
    t.Literal("FOOD"),
    t.Literal("PHONE"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
