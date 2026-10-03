import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingNeeds = t.Union(
  [t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH")],
  { additionalProperties: false },
);
