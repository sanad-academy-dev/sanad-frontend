import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AnesthesiaEventKind = t.Union(
  [
    t.Literal("DRUG"),
    t.Literal("ABX_PROPHYLAXIS"),
    t.Literal("FLUID"),
    t.Literal("POSITION"),
    t.Literal("EVENT"),
    t.Literal("NOTE"),
  ],
  { additionalProperties: false },
);
