import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CourseType = t.Union(
  [
    t.Literal("INTERNAL"),
    t.Literal("WORKSHOP"),
    t.Literal("ONLINE"),
    t.Literal("CERTIFICATION"),
    t.Literal("CONFERENCE"),
  ],
  { additionalProperties: false },
);
