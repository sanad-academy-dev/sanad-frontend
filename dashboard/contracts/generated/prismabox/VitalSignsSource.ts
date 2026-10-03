import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const VitalSignsSource = t.Union(
  [
    t.Literal("MANUAL"),
    t.Literal("VISIT"),
    t.Literal("LAB"),
    t.Literal("RADIOLOGY"),
    t.Literal("OPERATION"),
    t.Literal("GROOMING"),
    t.Literal("INPATIENT"),
    t.Literal("TRIAGE"),
  ],
  { additionalProperties: false },
);
