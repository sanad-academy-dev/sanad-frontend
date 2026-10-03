import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NailCondition = t.Union(
  [
    t.Literal("NORMAL"),
    t.Literal("OVERGROWN"),
    t.Literal("SPLIT"),
    t.Literal("INGROWN"),
    t.Literal("MISSING"),
  ],
  { additionalProperties: false },
);
