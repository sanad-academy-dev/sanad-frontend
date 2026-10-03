import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ConsentLocale = t.Union(
  [t.Literal("AR"), t.Literal("EN"), t.Literal("BOTH")],
  { additionalProperties: false },
);
