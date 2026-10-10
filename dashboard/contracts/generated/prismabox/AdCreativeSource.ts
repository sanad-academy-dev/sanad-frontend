import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AdCreativeSource = t.Union(
  [
    t.Literal("AI_GENERATED"),
    t.Literal("LIBRARY"),
    t.Literal("UPLOAD"),
    t.Literal("TEMPLATE"),
  ],
  { additionalProperties: false },
);
