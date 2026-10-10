import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyImageQuality = t.Union(
  [t.Literal("DIAGNOSTIC"), t.Literal("LIMITED"), t.Literal("NON_DIAGNOSTIC")],
  { additionalProperties: false },
);
