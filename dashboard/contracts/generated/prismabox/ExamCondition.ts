import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExamCondition = t.Union(
  [t.Literal("NORMAL"), t.Literal("ABNORMAL"), t.Literal("NOT_EXAMINED")],
  { additionalProperties: false },
);
