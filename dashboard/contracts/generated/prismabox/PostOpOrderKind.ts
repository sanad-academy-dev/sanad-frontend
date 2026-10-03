import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PostOpOrderKind = t.Union(
  [
    t.Literal("MEDICATION"),
    t.Literal("MONITORING"),
    t.Literal("FEEDING"),
    t.Literal("ACTIVITY"),
    t.Literal("WOUND_CARE"),
    t.Literal("FOLLOW_UP"),
    t.Literal("SUTURE_REMOVAL"),
  ],
  { additionalProperties: false },
);
