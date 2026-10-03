import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const QuizAnswerType = t.Union(
  [t.Literal("SINGLE"), t.Literal("MULTIPLE"), t.Literal("TEXT")],
  { additionalProperties: false },
);
