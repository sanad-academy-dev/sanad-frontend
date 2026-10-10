import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MucousMembrane = t.Union(
  [
    t.Literal("PINK"),
    t.Literal("PALE"),
    t.Literal("CYANOTIC"),
    t.Literal("ICTERIC"),
    t.Literal("CONGESTED"),
    t.Literal("MUDDY"),
  ],
  { additionalProperties: false },
);
