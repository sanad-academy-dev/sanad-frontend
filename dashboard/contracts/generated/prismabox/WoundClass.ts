import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const WoundClass = t.Union(
  [
    t.Literal("CLEAN"),
    t.Literal("CLEAN_CONTAMINATED"),
    t.Literal("CONTAMINATED"),
    t.Literal("DIRTY"),
  ],
  { additionalProperties: false },
);
