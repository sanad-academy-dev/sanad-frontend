import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const GroomingFindingSeverity = t.Union(
  [t.Literal("INFO"), t.Literal("ATTENTION"), t.Literal("URGENT")],
  { additionalProperties: false },
);
