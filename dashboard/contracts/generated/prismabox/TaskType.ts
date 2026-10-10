import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TaskType = t.Union(
  [
    t.Literal("ADMINISTRATIVE"),
    t.Literal("PHARMACEUTICALS"),
    t.Literal("INVENTORY"),
    t.Literal("FINANCE"),
    t.Literal("LABORATORY"),
    t.Literal("COSMETICS"),
    t.Literal("MEDICAL"),
  ],
  { additionalProperties: false },
);
