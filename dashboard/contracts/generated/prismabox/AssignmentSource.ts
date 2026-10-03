import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AssignmentSource = t.Union(
  [t.Literal("MANUAL"), t.Literal("AUTO"), t.Literal("ENROLL_ALL")],
  { additionalProperties: false },
);
