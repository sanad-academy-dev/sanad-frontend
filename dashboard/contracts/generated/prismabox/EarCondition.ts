import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EarCondition = t.Union(
  [
    t.Literal("NORMAL"),
    t.Literal("WAXY"),
    t.Literal("REDNESS"),
    t.Literal("ODOR"),
    t.Literal("DISCHARGE"),
    t.Literal("PAINFUL"),
  ],
  { additionalProperties: false },
);
