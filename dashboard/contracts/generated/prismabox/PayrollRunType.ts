import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PayrollRunType = t.Union(
  [t.Literal("REGULAR"), t.Literal("OFF_CYCLE")],
  { additionalProperties: false },
);
