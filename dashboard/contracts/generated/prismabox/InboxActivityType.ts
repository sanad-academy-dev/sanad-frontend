import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const InboxActivityType = t.Union(
  [
    t.Literal("CREATED"),
    t.Literal("COMMENT"),
    t.Literal("ACCEPTED"),
    t.Literal("REJECTED"),
    t.Literal("STATUS_CHANGED"),
  ],
  { additionalProperties: false },
);
