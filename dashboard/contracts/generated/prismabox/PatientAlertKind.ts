import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PatientAlertKind = t.Union(
  [
    t.Literal("ALLERGY"),
    t.Literal("CHRONIC_CONDITION"),
    t.Literal("BITE_RISK"),
    t.Literal("CODE_STATUS"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
