import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AppointmentActivityType = t.Union(
  [
    t.Literal("CREATED"),
    t.Literal("STATUS_CHANGED"),
    t.Literal("COMMENT"),
    t.Literal("DOCUMENT_ADDED"),
    t.Literal("DOCUMENT_REMOVED"),
    t.Literal("RESCHEDULED"),
    t.Literal("OWNER_REASSIGNED"),
    t.Literal("STAFF_REASSIGNED"),
    t.Literal("EXAM_STARTED"),
    t.Literal("EXAM_COMPLETED"),
  ],
  { additionalProperties: false },
);
