import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const HairType = t.Union(
  [
    t.Literal("LONG_THICK"),
    t.Literal("SHORT_THICK"),
    t.Literal("LIGHT"),
    t.Literal("MEDIUM"),
    t.Literal("DOUBLE_COAT"),
    t.Literal("NONE"),
  ],
  { additionalProperties: false },
);
