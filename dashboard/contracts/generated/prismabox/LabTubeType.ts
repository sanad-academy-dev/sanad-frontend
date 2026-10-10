import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LabTubeType = t.Union(
  [
    t.Literal("EDTA"),
    t.Literal("SST"),
    t.Literal("CITRATE"),
    t.Literal("HEPARIN"),
    t.Literal("URINE"),
    t.Literal("SWAB"),
  ],
  { additionalProperties: false },
);
