import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BudgetAgainst = t.Union(
  [t.Literal("COST_CENTER"), t.Literal("PROJECT")],
  { additionalProperties: false },
);
