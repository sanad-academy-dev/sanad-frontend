import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const Plan = t.Union(
  [t.Literal("FREE"), t.Literal("BASIC"), t.Literal("PRO")],
  { additionalProperties: false },
);
