import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const QueueStatus = t.Union(
  [t.Literal("ON_HOLD"), t.Literal("NO_SHOW"), t.Literal("CONFIRMED")],
  { additionalProperties: false },
);
