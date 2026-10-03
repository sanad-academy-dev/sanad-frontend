import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ServiceZoneShape = t.Union(
  [t.Literal("CIRCLE"), t.Literal("POLYGON")],
  { additionalProperties: false },
);
