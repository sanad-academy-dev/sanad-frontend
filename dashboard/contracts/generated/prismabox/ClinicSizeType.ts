import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicSizeType = t.Union(
  [
    t.Literal("SOLO"),
    t.Literal("SMALL"),
    t.Literal("MEDIUM"),
    t.Literal("MEDICAL_CENTER"),
    t.Literal("HOSPITAL"),
  ],
  { additionalProperties: false },
);
