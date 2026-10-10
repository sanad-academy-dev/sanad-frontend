import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CourseContentType = t.Union(
  [t.Literal("PAGE"), t.Literal("LESSON"), t.Literal("QUIZ")],
  { additionalProperties: false },
);
