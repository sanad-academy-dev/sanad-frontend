import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PayrollScope = t.Union(
  [
    t.Literal("ALL"),
    t.Literal("BRANCH"),
    t.Literal("DEPARTMENT"),
    t.Literal("CONTRACT"),
    t.Literal("SPECIFIC"),
  ],
  { additionalProperties: false },
);
