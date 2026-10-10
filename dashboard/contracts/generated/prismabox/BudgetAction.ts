import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BudgetAction = t.Union(
  [t.Literal("STOP"), t.Literal("WARN"), t.Literal("IGNORE")],
  { additionalProperties: false },
);
