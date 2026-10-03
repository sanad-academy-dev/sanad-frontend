import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ReEnrollMode = t.Union(
  [
    t.Literal("NONE"),
    t.Literal("AFTER_COMPLETION"),
    t.Literal("BEFORE_EXPIRY"),
  ],
  { additionalProperties: false },
);
