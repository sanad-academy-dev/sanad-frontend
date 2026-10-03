import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DunningStatus = t.Union(
  [
    t.Literal("DRAFT"),
    t.Literal("UNRESOLVED"),
    t.Literal("RESOLVED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
