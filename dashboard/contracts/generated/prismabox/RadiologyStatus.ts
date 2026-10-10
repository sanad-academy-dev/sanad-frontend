import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyStatus = t.Union(
  [
    t.Literal("QUEUE"),
    t.Literal("SCHEDULED"),
    t.Literal("PREPARATION"),
    t.Literal("IMAGING"),
    t.Literal("REPORTING"),
    t.Literal("UNDER_REVIEW"),
    t.Literal("COMPLETED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
