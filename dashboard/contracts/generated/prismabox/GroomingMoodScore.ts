import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingMoodScore = t.Union(
  [
    t.Literal("CALM"),
    t.Literal("HAPPY"),
    t.Literal("ANXIOUS"),
    t.Literal("STRESSED"),
    t.Literal("AGGRESSIVE"),
  ],
  { additionalProperties: false },
);
