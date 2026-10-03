import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabParameterType = t.Union(
  [t.Literal("NUMERIC"), t.Literal("TEXT")],
  { additionalProperties: false },
);
