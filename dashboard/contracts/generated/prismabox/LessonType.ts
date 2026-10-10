import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LessonType = t.Union(
  [
    t.Literal("TEXT"),
    t.Literal("VIDEO"),
    t.Literal("DOCUMENT"),
    t.Literal("QUIZ"),
    t.Literal("SURVEY"),
    t.Literal("AUDIO"),
  ],
  { additionalProperties: false },
);
