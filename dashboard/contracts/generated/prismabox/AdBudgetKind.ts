import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdBudgetKind = t.Union(
  [t.Literal("DAILY"), t.Literal("LIFETIME")],
  { additionalProperties: false },
);
