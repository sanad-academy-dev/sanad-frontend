import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CoursePriority = t.Union(
  [t.Literal("URGENT"), t.Literal("NORMAL")],
  { additionalProperties: false },
);
