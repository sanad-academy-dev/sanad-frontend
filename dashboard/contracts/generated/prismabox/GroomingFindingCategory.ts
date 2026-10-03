import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingFindingCategory = t.Union(
  [
    t.Literal("SKIN"),
    t.Literal("EARS"),
    t.Literal("EYES"),
    t.Literal("NAILS"),
    t.Literal("DENTAL"),
    t.Literal("LUMP"),
    t.Literal("PARASITE"),
    t.Literal("WEIGHT"),
    t.Literal("PAIN"),
    t.Literal("BEHAVIOR"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
