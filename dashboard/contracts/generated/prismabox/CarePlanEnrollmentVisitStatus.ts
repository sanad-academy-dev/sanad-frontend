import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CarePlanEnrollmentVisitStatus = t.Union(
  [t.Literal("PENDING"), t.Literal("COMPLETED"), t.Literal("SKIPPED")],
  { additionalProperties: false },
);
