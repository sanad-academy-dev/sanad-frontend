import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SopDomain = t.Union(
  [t.Literal("LAB"), t.Literal("RADIOLOGY"), t.Literal("OPERATION")],
  { additionalProperties: false },
);
