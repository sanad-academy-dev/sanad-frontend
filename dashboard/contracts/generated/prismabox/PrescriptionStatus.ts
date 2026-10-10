import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PrescriptionStatus = t.Union(
  [
    t.Literal("DRAFT"),
    t.Literal("ACTIVE"),
    t.Literal("COMPLETED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
