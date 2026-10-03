import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CarePlanStatus = t.Union(
  [t.Literal("ACTIVE"), t.Literal("INACTIVE")],
  { additionalProperties: false },
);
