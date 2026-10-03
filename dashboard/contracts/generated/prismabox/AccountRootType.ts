import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AccountRootType = t.Union(
  [
    t.Literal("ASSET"),
    t.Literal("LIABILITY"),
    t.Literal("INCOME"),
    t.Literal("EXPENSE"),
    t.Literal("EQUITY"),
  ],
  { additionalProperties: false },
);
