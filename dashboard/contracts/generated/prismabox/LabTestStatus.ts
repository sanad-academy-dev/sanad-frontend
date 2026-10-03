import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabTestStatus = t.Union(
  [
    t.Literal("QUEUE"),
    t.Literal("SCHEDULED"),
    t.Literal("SAMPLE_COLLECTION"),
    t.Literal("IN_LAB"),
    t.Literal("UNDER_REVIEW"),
    t.Literal("COMPLETED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);
