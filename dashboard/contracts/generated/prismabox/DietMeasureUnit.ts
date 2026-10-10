import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DietMeasureUnit = t.Union(
  [
    t.Literal("GRAM"),
    t.Literal("CUP"),
    t.Literal("CAN"),
    t.Literal("SCOOP"),
    t.Literal("PIECE"),
  ],
  { additionalProperties: false },
);
