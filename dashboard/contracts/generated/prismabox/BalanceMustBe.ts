import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BalanceMustBe = t.Union(
  [t.Literal("NONE"), t.Literal("DEBIT"), t.Literal("CREDIT")],
  { additionalProperties: false },
);
