import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingSizeBand = t.Union(
  [
    t.Literal("TOY"),
    t.Literal("SMALL"),
    t.Literal("MEDIUM"),
    t.Literal("LARGE"),
    t.Literal("GIANT"),
  ],
  {
    additionalProperties: false,
    description: `شريحة الحجم — تُشتق من وزن المريض ويتجاوزها كرت التجميل (القرار D4).`,
  },
);
