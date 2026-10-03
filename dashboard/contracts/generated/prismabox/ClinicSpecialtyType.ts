import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicSpecialtyType = t.Union(
  [
    t.Literal("VET_CLINIC"),
    t.Literal("VET_HOSPITAL"),
    t.Literal("GROOMING_CENTER"),
    t.Literal("MOBILE_SERVICES"),
    t.Literal("SPECIALIZED_SURGERY"),
    t.Literal("MULTI_SERVICES"),
  ],
  { additionalProperties: false },
);
