import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const OperationActivityType = t.Union(
  [
    t.Literal("CREATED"),
    t.Literal("STATUS_CHANGED"),
    t.Literal("STAGE_CHANGED"),
    t.Literal("SCHEDULE_CHANGED"),
    t.Literal("TEAM_CHANGED"),
    t.Literal("URGENCY_CHANGED"),
    t.Literal("GATE_OVERRIDDEN"),
    t.Literal("CANCELLED"),
    t.Literal("NOTE"),
    t.Literal("CONSENT_SIGNED"),
    t.Literal("CONSENT_REVOKED"),
    t.Literal("ASSESSMENT_UPDATED"),
    t.Literal("CHECKLIST_COMPLETED"),
    t.Literal("NOTE_SIGNED"),
  ],
  { additionalProperties: false },
);
