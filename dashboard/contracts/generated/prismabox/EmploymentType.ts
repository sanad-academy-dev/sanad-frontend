import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EmploymentType = t.Union(
  [t.Literal("FULL_TIME"), t.Literal("PART_TIME")],
  { additionalProperties: false },
);
