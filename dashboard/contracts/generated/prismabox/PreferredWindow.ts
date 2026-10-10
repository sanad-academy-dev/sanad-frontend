import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PreferredWindow = t.Union(
  [
    t.Literal("MORNING"),
    t.Literal("AFTERNOON"),
    t.Literal("EVENING"),
    t.Literal("ANY"),
  ],
  { additionalProperties: false },
);
