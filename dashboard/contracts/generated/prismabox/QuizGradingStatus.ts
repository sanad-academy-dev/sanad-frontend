import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const QuizGradingStatus = t.Union(
  [t.Literal("AUTO_DONE"), t.Literal("NEEDS_MANUAL"), t.Literal("GRADED")],
  { additionalProperties: false },
);
