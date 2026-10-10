import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabSampleStage = t.Union(
  [
    t.Literal("NOT_COLLECTED"),
    t.Literal("COLLECTED"),
    t.Literal("QUALITY_CHECK"),
    t.Literal("LABEL_PRINT"),
    t.Literal("ANALYZER_ASSIGNMENT"),
    t.Literal("HANDOVER_SUMMARY"),
    t.Literal("ANALYZING"),
    t.Literal("RESULTS_READY"),
  ],
  { additionalProperties: false },
);
