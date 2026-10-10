import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MobileUnitStatus = t.Union(
  [
    t.Literal("OFFLINE"),
    t.Literal("AVAILABLE"),
    t.Literal("EN_ROUTE"),
    t.Literal("ON_SITE"),
    t.Literal("RETURNING"),
    t.Literal("ON_BREAK"),
    t.Literal("OUT_OF_SERVICE"),
  ],
  { additionalProperties: false },
);
