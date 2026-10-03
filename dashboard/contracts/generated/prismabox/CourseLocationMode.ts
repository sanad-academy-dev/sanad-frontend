import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CourseLocationMode = t.Union(
  [t.Literal("ONSITE"), t.Literal("ONLINE"), t.Literal("HYBRID")],
  { additionalProperties: false },
);
