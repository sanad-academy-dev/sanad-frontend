import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyStage = t.Union(
  [
    t.Literal("SAFETY_SCREENING"),
    t.Literal("PATIENT_PREP"),
    t.Literal("ROOM_ASSIGNMENT"),
    t.Literal("READY_CHECK"),
    t.Literal("ACQUISITION"),
    t.Literal("IMAGE_UPLOAD"),
    t.Literal("IMAGE_QC"),
  ],
  { additionalProperties: false },
);
