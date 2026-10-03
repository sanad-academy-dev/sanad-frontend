import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabSampleQuality = t.Union(
  [
    t.Literal("EXCELLENT"),
    t.Literal("GOOD"),
    t.Literal("ACCEPTABLE"),
    t.Literal("REJECTED"),
  ],
  { additionalProperties: false },
);
