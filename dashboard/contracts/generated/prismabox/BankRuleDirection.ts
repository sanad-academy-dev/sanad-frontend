import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BankRuleDirection = t.Union(
  [t.Literal("ANY"), t.Literal("DEPOSIT"), t.Literal("WITHDRAWAL")],
  { additionalProperties: false },
);
