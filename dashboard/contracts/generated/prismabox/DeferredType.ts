import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DeferredType = t.Union(
  [t.Literal("REVENUE"), t.Literal("EXPENSE")],
  { additionalProperties: false },
);
