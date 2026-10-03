import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CarePlanIntervalUnit = t.Union(
  [t.Literal("DAY"), t.Literal("WEEK")],
  { additionalProperties: false },
);
