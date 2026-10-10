import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ConsentStatus = t.Union(
  [
    t.Literal("DRAFT"),
    t.Literal("AWAITING_SIGNATURE"),
    t.Literal("SIGNED"),
    t.Literal("REVOKED"),
  ],
  { additionalProperties: false },
);
