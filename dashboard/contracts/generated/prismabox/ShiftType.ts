import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ShiftType = t.Union(
  [t.Literal("MORNING"), t.Literal("EVENING"), t.Literal("NIGHT")],
  { additionalProperties: false },
);
