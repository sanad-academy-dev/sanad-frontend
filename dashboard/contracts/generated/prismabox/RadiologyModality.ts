import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyModality = t.Union(
  [
    t.Literal("XRAY"),
    t.Literal("CT"),
    t.Literal("MRI"),
    t.Literal("ULTRASOUND"),
    t.Literal("FLUOROSCOPY"),
    t.Literal("MAMMOGRAPHY"),
    t.Literal("NUCLEAR"),
    t.Literal("PET"),
    t.Literal("DENTAL"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
