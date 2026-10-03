import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClinicMainGoal = t.Union(
  [
    t.Literal("APPOINTMENTS_MANAGEMENT"),
    t.Literal("PATIENTS_MANAGEMENT"),
    t.Literal("INVENTORY_MANAGEMENT"),
    t.Literal("BILLING_MANAGEMENT"),
    t.Literal("REVENUE_IMPROVEMENT"),
    t.Literal("WORKFLOW_AUTOMATION"),
    t.Literal("PAPERWORK_REDUCTION"),
    t.Literal("CUSTOMER_EXPERIENCE"),
  ],
  { additionalProperties: false },
);
