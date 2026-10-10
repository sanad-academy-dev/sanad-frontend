import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ConsentType = t.Union(
  [
    t.Literal("SURGICAL"),
    t.Literal("ANESTHESIA"),
    t.Literal("BLOOD_PRODUCTS"),
    t.Literal("EUTHANASIA"),
    t.Literal("FINANCIAL_ESTIMATE"),
    t.Literal("HIGH_RISK_SURGICAL"),
    t.Literal("HOSPITALIZATION"),
    t.Literal("DISCHARGE_HEALTHY"),
    t.Literal("DISCHARGE_HOME_TREATMENT"),
    t.Literal("DISCHARGE_AGAINST_ADVICE"),
    t.Literal("BOARDING"),
    t.Literal("GROOMING"),
    t.Literal("EMERGENCY_TREATMENT"),
  ],
  { additionalProperties: false },
);
