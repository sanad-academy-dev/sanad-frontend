import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RadiologyActivityType = t.Union(
  [
    t.Literal("CREATED"),
    t.Literal("STATUS_CHANGED"),
    t.Literal("STAGE_CHANGED"),
    t.Literal("ASSIGNED"),
    t.Literal("SAFETY_COMPLETED"),
    t.Literal("MACHINE_ASSIGNED"),
    t.Literal("IMAGES_UPLOADED"),
    t.Literal("REPORT_SAVED"),
    t.Literal("SENT_TO_REVIEW"),
    t.Literal("APPROVED"),
    t.Literal("REJECTED"),
    t.Literal("DECLINED"),
    t.Literal("CRITICAL_FLAGGED"),
    t.Literal("INVOICE_PAID"),
    t.Literal("RESCHEDULED"),
    t.Literal("ADDENDUM_ADDED"),
  ],
  { additionalProperties: false },
);
